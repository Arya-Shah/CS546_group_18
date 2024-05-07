import { users,reports } from "../config/mongoCollections.js";
// import uuid from 'uuid';
// import bcrypt from 'bcrypt';
import bcrypt from "bcryptjs";
import { v4 as uuid } from "uuid";
import validators from "../helper.js";
// import {ObjectId} from 'mongodb';

const saltRounds = 16;


//Function: getAllUsers
export const getAllUsers = async () => {
    
    //Retreive User Collection
    const userCollection = await users();
    
    //Return collection as array
    return await userCollection.find({}).toArray();
    };


   

//Function: loginUser
export const loginUser = async (username, password) => {

    const errorObject = {
    status: 400,
    };
    
    if (!username && !password) {
    errorObject.error = "No input provided to create user.";
    throw errorObject;
    }

    if(username.length < 5 || username.length > 10){
    errorObject.error = 'Username should be between 5 and 10 characters.';
    throw errorObject;
    }
    
    if (!/^[a-zA-Z\s]+$/.test(username)) {
    errorObject.error = 'Username must be characters and cannot contain numbers.' ;
    throw errorObject;
    }
    
    if(password.length < 8){
    errorObject.error = 'Password should be greater than 8.' ;
    throw errorObject;
    }
    
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password) || !/[A-Z]/.test(password) || !/[0-9]/.test(password)) {
    errorObject.error = 'There needs to be at least one uppercase character, there has to be at least one number and there has to be at least one special character' ;
    throw errorObject;
    }
    
    const userRow = await getUserByName(username);
    
    if (Object.keys(userRow).length === 0) {
        errorObject.status = 500;
    errorObject.error = "Either the username or password is invalid";
    throw errorObject;
    }
    
    let compareResult = await bcrypt.compare(password, userRow.hashedPassword);

    if (!compareResult) {
    errorObject.error = "Password is incorrect";
    throw errorObject;
    }
    
    return userRow;
    
    };


//Function: getUserByName
const getUserByName = async (username) => {

    let result = {};

    const errorObject = {
    status: 400,
    };
    
    if (!username) {
    errorObject.error = "No input provided to search user.";
    throw errorObject;
    }
    
    if(username.length < 5 || username.length > 10){
    errorObject.error = 'Username should be between 5 and 10.';
    throw errorObject;
    }
    
    if (!/^[a-zA-Z\s]+$/.test(username)) {
    errorObject.error = 'Username must be characters and cannot contain numbers.';
    throw errorObject;
    } 
    
    username = username.trim().toLowerCase();
    const usersCollection = await users();
    const userRow = await usersCollection.findOne({ username: username });
    if (userRow === null) {
    return result;
    }
    
    return userRow;
};

const getUserByEmail = async (email) => {

    let result = {};

    const errorObject = {
    status: 400,
    };
    
    if (!email || !validators.isValidEmail(email) || email.trim().length === 0){
        errorObject.error  = 'Invalid email input';
        throw errorObject;
    }
    
    email = email.trim().toLowerCase();
    const usersCollection = await users();
    const userRow = await usersCollection.findOne({ email: email });
    if (userRow === null) {
    return result;
    }
    
    return userRow;
};


//Function: getUserById
export const getUserById = async (id) => {
    const errorObject = {
        status: 400,
    };
    if (!validators.isValidUuid(id)) {
        errorObject.error= "Invalid ID input";
        throw errorObject;
    }

    //Retreive user collection and specific user
    const userCollection = await users();
    const user = await userCollection.findOne({ userId: id });
    //Validation (cont.)
    if (!user){
        errorObject.error = 'User not found';
        errorObject.status = 404;
        throw errorObject; 
    }

    //Return 
    return user;    
    
};

//Function: getLandlordById
export const getLandlordById = async (id) => {
    const errorObject = {
        status: 400,
    };
    if (!validators.isValidUuid(id)) {
        errorObject.error= "Invalid ID input";
        throw errorObject;
    }

    // Retrieve user collection and specific landlord
    const userCollection = await users();
    const landlord = await userCollection.findOne({ userId: id, isLandlord: true });

    // Validation
    if (!landlord) {
        errorObject.error = 'Landlord not found';
        errorObject.status = 404;
        throw errorObject; 
    }

    // Return 
    return landlord;    
};

//Function: getAllLandlords
export const getAllLandlords = async () => {
    const errorObject = {
        status: 400,
    };

    // Retrieve user collection
    const userCollection = await users();

    // Find all users where isLandlord is true
    const landlords = await userCollection.find({ isLandlord: true }).toArray();

    // Validation
    if (!landlords || landlords.length === 0) {
        errorObject.error = 'No landlords found';
        errorObject.status = 404;
        throw errorObject; 
    }

    // Return landlords
    return landlords;    
};

// Function: getAllLandlordsByState
export const getAllLandlordsByState = async (state) => {
    
    const errorObject = {
        status: 400,
    };

    // Validation
    if (!state || !validators.isValidString(state) || state.trim().length === 0) {
        errorObject.error = "Invalid state input.";
        throw errorObject;
    }

    state = state.trim().toLowerCase();

    const userCollection = await users();

    const landlords = await userCollection.find({ isLandlord: true, state: state }).toArray();

    if (!landlords || landlords.length === 0) {
        errorObject.error = "No landlords found for the provided state.";
        throw errorObject;
    }

    return landlords;

};

// Function: getAllLandlordsByCity
export const getAllLandlordsByCity = async (city) => {
    const errorObject = {
        status: 400,
    };

    // Validation
    if (!city || !validators.isValidString(city) || city.trim().length === 0) {
        errorObject.error = "Invalid city input.";
        throw errorObject;
    }

    city = city.trim().toLowerCase();

    // Retrieve user collection
    const userCollection = await users();

    // Find all users where isLandlord is true and city matches
    const landlords = await userCollection.find({ isLandlord: true, city: city }).toArray();

    // Validation
    if (!landlords || landlords.length === 0) {
        errorObject.error = "No landlords found for the provided city.";
        throw errorObject;
    }

    // Return landlords
    return landlords;
}

//Function: registerUser    
export const registerUser = async (firstName, lastName, username, password, city, state, email, isLandlord, isAdmin) => {

    const errorObject = {
        status: 400,
    };
    //Validation
    if (!firstName || !validators.isValidString(firstName) || firstName.trim().length === 0){
        errorObject.error = 'Invalid first name input';
        throw errorObject;
    }

    if (!lastName || !validators.isValidString(lastName) || lastName.trim().length === 0){
        errorObject.error = 'Invalid last name input';
        throw errorObject;
    }
    
    if (!username || !validators.isValidString(username) || username.trim().length === 0){
        errorObject.error = 'Invalid user name input';
        throw errorObject;
    }

    //Check if username exists
    const userRow = await getUserByName(username);
    
    if(userRow && username === userRow.username){
        errorObject.error = "Username Already Exists."
        throw errorObject;
    }

    //Validations (cont.)

    if (!password || !validators.isValidPassword(password) || password.trim().length === 0){
        errorObject.error  = 'Invalid password input';
        throw errorObject;
    }

if (!email || !validators.isValidEmail(email) || email.trim().length === 0){
    errorObject.error  = 'Invalid email input';
    throw errorObject;
}
//Check if email exists
const useremailRow = await getUserByEmail(email);
    
if(useremailRow && email === useremailRow.email){
    errorObject.error = "email Already Exists."
    throw errorObject;
}

    if (!city || !validators.isValidString(city) || city.trim().length === 0){
        errorObject.error  = 'Invalid city input';
        throw errorObject;
    }
    
    if (!state || !validators.isValidString(state) || state.trim().length === 0){
        errorObject.error  = 'Invalid state input';
        throw errorObject;
    }

    //To Do: additional validation for isLandlord and isAdmin needed?
    //if (!isLandlord)
        //throw 'An indication whether the user is a landlord or not is required.';

    //if (!isAdmin)
        //throw 'An indication whether the user is a landlord or not is required.';

    //Retrieve user collection
    const userCollection = await users();

    //Set hashed password
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    
    //New User Object
    let newUser = {
        userId: uuid(),
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        username: username.trim().toLowerCase(),
        hashedPassword: hashedPassword,
        city: city.trim(),
        state: state.trim(),
        email: email.trim().toLowerCase(),
        isLandlord: isLandlord,
        isAdmin: isAdmin,
        properties: [],
        reviews: [], 
        reviewIds: [],
        commentsIds: [],
        threadIds: [],
        reportsIds: [],
        averageRatings: {},
        landlordReviews: [],
    };
    
    //Insert new user object into collection
    const insertInfo = await userCollection.insertOne(newUser);
    
    //Validation (cont.)
    if (!insertInfo.acknowledged || !insertInfo.insertedId){
        errorObject.status  = 500;    
        errorObject.error =  "Could not add new user";
        throw errorObject;
    }
    
    //Return
    return { userInserted: true, userId: newUser.userId };
    
};


//Function: updateUser
export const updateUser = async (userId, updatedUser) => {
    const errorObject = {
        status:400
    }
    //Validation
    if (!userId || !validators.isValidUuid(userId)) {
        errorObject.error= "Invalid ID input"; 
        throw errorObject;
    }
  
    if (!updatedUser || typeof updatedUser !== "object" || Array.isArray(updatedUser)){
        errorObject.error =  "Invalid updatedUser input";
        throw errorObject;
    }

    //Retrieve user collection
    const userCollection = await users();
    
    //Create object for updated user information
    const updatedUserData = {};
    
    //Validate and add updated user information to object
    if (updatedUser.firstName) {
        if (!updatedUser.firstName || !validators.isValidString(updatedUser.firstName) || updatedUser.firstName.trim().length === 0){
            errorObject.error = "Invalid first name input";
            throw errorObject;
        }
    
        updatedUserData.firstName = updatedUser.firstName.trim();
    }
    
    if (updatedUser.lastName) {
        if (!updatedUser.lastName || !validators.isValidString(updatedUser.lastName) || updatedUser.lastName.trim().length === 0){
            errorObject.error = "Invalid last name input";
            throw errorObject;
        }
        
        updatedUserData.lastName = updatedUser.lastName.trim();       
    }

    if (updatedUser.username) {
        
        if (!updatedUser.username || !validators.isValidString(updatedUser.username) || updatedUser.username.trim().length === 0){
            errorObject.error = "Invalid username input";
            throw errorObject;
        }

        //Check if username exists
        const userRow = await getUserByName(updatedUser.username);
        
        if(userRow && updatedUser.username === userRow.username){
            errorObject.error = "Username Already Exists.";
            throw errorObject;
        }
        
        updatedUserData.username = updatedUser.username.trim();       
    }

    if (updatedUser.password) {
        
        if (!updatedUser.password || !validators.isValidPassword(updatedUser.password) || updatedUser.password.trim().length === 0){
          errorObject.error = "Invalid password input";
          throw errorObject;
        }
    
        updatedUserData.hashedPassword = await bcrypt.hash(updatedUser.password, saltRounds);
        
    }

    if (updatedUser.city) {
        
        if (!updatedUser.city || !validators.isValidString(updatedUser.city) || updatedUser.city.trim().length === 0){
            errorObject.error = "Invalid city input";
            throw errorObject;
        }
    
        updatedUserData.city = updatedUser.city.trim();
        
    }
    
    if (updatedUser.state) {
        
        if (!updatedUser.state || !validators.isValidString(updatedUser.state) || updatedUser.state.trim().length === 0){
            errorObject.error = "Invalid state input";
            throw errorObject;
        }
    
        updatedUserData.state = updatedUser.state.trim();
        
    }
    
    if (updatedUser.email) {
        
        if (!updatedUser.email || !validators.isValidEmail(updatedUser.email) || updatedUser.email.trim().length === 0){
          errorObject.error = "Invalid email input";
          throw errorObject;
        }
        
        updatedUserData.email = updatedUser.email.trim().toLowerCase();
        
    }

    if(updatedUser.reportsIds){

        updatedUserData.reportsIds = updatedUser.reportsIds;
        
    }
    
    //Update user with object
    const updateResponse = await userCollection.updateOne(
        { userId: userId },
        { $set: updatedUserData });

    
    //Validation (cont.)
    if (!updateResponse.acknowledged || updateResponse.modifiedCount === 0){
        errorObject.status = 500;
        errorObject.error =  "Error occurred while updating user";
        throw errorObject;
    }
    
    //Return
    return { userUpdated: true };
    
};


//Function: removeUser
// export const removeUser = async (userId) => {

//     if (!userId || validators.isValidUuid(userId)) throw "Invalid ID input";
    
//     //Retreive User Collection
//     const userCollection = await users();
    
//     //Delete user
//     const deletionInfo = await userCollection.deleteOne({ userId: userId });
    
//     //Validation (cont.)
//     if (deletionInfo.deletedCount === 0) {
//     throw `Error occurred while deleting user with ID ${userId}`;
//     }
    
//     //Return
//     return { userDeleted: true };
// };


//Function: addLandlordReview
export const addLandlordReview = async (landlordId, reviewData, userId) => {
    const errorObject = {
        status:400
    }
    
    //Validation
    if (!landlordId || !validators.isValidUuid(landlordId)){
        errorObject.error =  "Invalid landlord ID input";
        throw errorObject;
    }

    const landlord = await getUserById(landlordId);

    if (!landlord){
        errorObject.error = 'No landlord found with specified id.';
        throw errorObject;
    }
    
    if (!userId || !validators.isValidUuid(userId)){
        errorObject.error =  "Invalid user ID input";
        throw errorObject;
    }
    
    if (!reviewData || Object.keys(reviewData).length === 0){
        errorObject.error = "Invalid Review: Review data is required.";
        throw errorObject;
    }
    
    //Create Review Object
    const updatedReviewData = {
        userId: userId,
        reviewId: uuid(),
        date: new Date().toISOString(),
        reports: [],
        kindnessRating: null,
        maintenanceResponsivenessRating: null,
        overallCommunicationRating: null,
        professionalismRating: null,
        handinessRating: null,
        depositHandlingRating: null,
        reviewText: null,
    };
    
    const validRatings = [1, 2, 3, 4, 5];
    
    if ( !reviewData.kindnessRating || typeof reviewData.kindnessRating !== "number" || !validRatings.includes(reviewData.kindnessRating)) {
        errorObject.error = "Invalid kindnessRating input";
        throw errorObject;
    } else {
        updatedReviewData.kindnessRating = reviewData.kindnessRating;
    }
    
    if ( !reviewData.maintenanceResponsivenessRating || typeof reviewData.maintenanceResponsivenessRating !== "number" || !validRatings.includes(reviewData.maintenanceResponsivenessRating)) {
        errorObject.error = "Invalid maintenanceResponsivenessRating input";
        throw errorObject;
    } else {
        updatedReviewData.maintenanceResponsivenessRating = reviewData.maintenanceResponsivenessRating;
    }
    
    if ( !reviewData.overallCommunicationRating || typeof reviewData.overallCommunicationRating !== "number" || !validRatings.includes(reviewData.overallCommunicationRating) ) {
        errorObject.error = "Invalid overallCommunicationRating input";
        throw errorObject;
    } else {
        updatedReviewData.overallCommunicationRating = reviewData.overallCommunicationRating;
    }
    
    if ( !reviewData.professionalismRating || typeof reviewData.professionalismRating !== "number" || !validRatings.includes(reviewData.professionalismRating)) {
        errorObject.error = "Invalid professionalismRating input";
        throw errorObject;
    } else {
        updatedReviewData.professionalismRating = reviewData.professionalismRating;
    }
    
    if ( !reviewData.handinessRating || typeof reviewData.handinessRating !== "number" || !validRatings.includes(reviewData.handinessRating)) {
        errorObject.error = "Invalid handinessRating input";
        throw errorObject;
    } else {
        updatedReviewData.handinessRating = reviewData.handinessRating;
    }
    
    if ( !reviewData.depositHandlingRating || typeof reviewData.depositHandlingRating !== "number" || !validRatings.includes(reviewData.depositHandlingRating) ) {
        errorObject.error = "Invalid depositHandlingRating input";
        throw errorObject;
    } else {
        updatedReviewData.depositHandlingRating = reviewData.depositHandlingRating;
    }
    
    if ( !reviewData.reviewText || !validators.isValidString(reviewData.reviewText) || reviewData.reviewText.trim().length === 0 ) {
        errorObject.error = "Invalid reviewText input";
        throw errorObject;
    } else {
        updatedReviewData.reviewText = reviewData.reviewText;
    }
    
    //Retreive User Collection
    const userCollection = await users();

    //Update User with review id
    const userUpdateStatus = await userCollection.updateOne(
        { userId: userId },
        { $push: { reviewIds: updatedReviewData.reviewId } }
    );
    
    if (!userUpdateStatus){
        errorObject.error =  "Failed to update user information with new review id."; 
        throw errorObject;
    }    
    //Update Landlord with review
    const landlordUpdateStatus = await userCollection.updateOne(
        { userId: landlordId },
        { $push: { reviews: updatedReviewData } }
    );
    
    if (!landlordUpdateStatus)
{    errorObject.error= "Failed to update landlord informaiton with new review.";
    throw errorObject;
}    
    //Recalculate Landlord's average ratings
    validators.updateRating(landlordId);
    
    //Return
    return { reviewAdded: true };
    
};


// Function: removeLandlordReview
export const removeLandlordReview = async (userId, landlordId, landlordReviewId ) => {
    const errorObject = {
        status:400
    }
    //Validations
    if (!userId || !validators.isValidUuid(userId)) 
{    errorObject.error =  "Invalid user ID input";
    throw errorObject;
}    
    if (!landlordId || !validators.isValidUuid(landlordId))
{        errorObject.error= "Invalid landlord ID input";
        throw errorObject;
}    
    if (!landlordReviewId || !validators.isValidUuid(landlordReviewId))
{    errorObject.error= "Invalid user landlordReviewId input";
    throw errorObject
}    
    //Pull user collection
    const userCollection = await users();
    
    //Remove Review from Landlord
    const landlordUpdateStatus = await userCollection.updateOne(
        { userId: landlordId },
        { $pull: { reviews: { reviewId: landlordReviewId } } }
    );

    if (!landlordUpdateStatus.acknowledged || landlordUpdateStatus.modifiedCount === 0)
{        errorObject.error= "Failed to update landlord information with removed review.";
        throw errorObject;
}
    //Try to pull review id from userid
    let userUpdateStatus = await userCollection.updateOne(
        { userId: userId },
        { $pull: { "reviewIds": landlordReviewId } }
    );
    
    //Throw Error if Failed
    if (!userUpdateStatus.acknowledged || userUpdateStatus.modifiedCount === 0)
{        errorObject.error= "Failed to remove landlord review id from user.";
    throw errorObject;
}    
    //Return
    return { landlordReviewPulled: true };
};

// Function: addBookmark
export const addBookmark = async (userId, propertyId) => {
    const errorObject = {
        status:400
    }

    if (!userId || !validators.isValidUuid(userId)) 
        {errorObject.error= "Invalid user ID input";
    throw errorObject}

    if (!propertyId || !validators.isValidUuid(propertyId))
{       errorObject.error= "Invalid property ID input";
        throw errorObject;
}
    const userCollection = await users();

    const updateInfo = await userCollection.updateOne(
        { userId: userId },
        { $addToSet: { bookmarkedProperties: propertyId } }
    );

    if (!updateInfo.acknowledged || updateInfo.modifiedCount === 0)
{        errorObject.error= "Failed to add bookmark";
        throw errorObject;
}
    return { bookmarkAdded: true };
    
};


// Function: removeBookmark
export const removeBookmark = async (userId, propertyId) => {

    const errorObject = {
        status:400
    }
    if (!userId || !validators.isValidUuid(userId)) 
{         errorObject.error= "Invalid user ID input";
    throw errorObject;
}
    if (!propertyId || !validators.isValidUuid(propertyId))
{         errorObject.error= "Invalid property ID input";
        throw errorObject;

}
    const userCollection = await users();
    
    const updateInfo = await userCollection.updateOne(
        { userId: userId },
        { $pull: { bookmarkedProperties: propertyId } }
    );

    if (!updateInfo.acknowledged || updateInfo.modifiedCount === 0)
{        errorObject.error= "Failed to remove bookmark";
    throw errorObject;

}

    return { bookmarkRemoved: true };
    
};


// Function: getBookmarkedProperties
export const getBookmarkedProperties = async (userId) => {

    const errorObject = {
        status:400
    }
    if (!userId || !validators.isValidUuid(userId)) 
{        errorObject.error= "Invalid user ID input";
    throw errorObject;
}
    const userCollection = await users();

    const user = await userCollection.findOne(
        { userId: userId },
        { projection: { bookmarkedProperties: 1 } }
    );

    if (!user) 
{        errorObject.error= "User not found";
        throw errorObject;
}
    return user.bookmarkedProperties || [];
    
};


//1. Should be in properties? 2. No name field currently in properties.
//Function: searchPropertiesByName
export const searchPropertiesByName = async (title) => {

    const result = [];

    const errorObject = { status: 400 };

    if (!title || typeof title !== "string" || !validators.isValidString(title)) {
        errorObject.error = "Provided input must be a valid string.";
        throw errorObject;
    }

    title = title.trim();

    if (title.length === 0) {
        errorObject.error = "No input provided to search.";
        throw errorObject;
    }

    const propertyCollection = await properties();

    await propertyCollection.createIndex({ name: "text" });
    
    const propertiesList = await propertyCollection.find({$text: { $search: title }}).toArray();

    if (!propertiesList || propertiesList.length === 0) {
        errorObject.status = 404;
        errorObject.error = `No properties were found for "${title}".`;
        throw errorObject;
    }

    propertiesList.forEach((property) => {
        result.push({
            propertyName: property.name,
            location: property.location,
            propertyId: property._id,
        });
    });

    return result;
    
};


//Function: getAllPendingReports
export const getAllPendingReports = async (userId) => {
    const errorObject = {
        status:400
    }
    if (!userId || !validators.isValidUuid(userId)) 
{        errorObject.error="Invalid user ID input";
    throw errorObject;
}    
    const adminData = await getUserById(userId);
  
    if (!adminData.isAdmin) 
{        errorObject.error="User does not have admin access.";
        throw errorObject;
}  
const reportsData = await reports();
const pendingReports = await reportsData.find({ status: 'pending' }).toArray();

// Check if any pending reports were found
if (pendingReports.length === 0) {
    errorObject.error = "No pending reports found.";
    throw errorObject;
}

return pendingReports;
//     const reportsData = await reports();
  
//     const usersWithReports = userData.filter((user) => 
//         user && user.reportsIds.length > 0
//     );
    
//     if (usersWithReports.length === 0)
// {       errorObject.error="No reports found.";
//         throw errorObject;
// }  
    // //const reportsOnly = usersWithReports.map(user => user.reportsIds);
    // const pendingReports = userData.flatMap(user => 
    //     (user.reportsIds || []).filter(report => report.status === 'pending')
    // );

//       // Check if any pending reports were found
//       if (pendingReports.length === 0)
// {        errorObject.error="No pending reports found.";
//         throw errorObject;
// }
//       return pendingReports;
    
};


//Function: getReportbyId
export const getReportbyId = async(reportId, userId) =>{
    const errorObject = {
        status: 400
    };

    if (!userId || !validators.isValidUuid(userId)) {
        errorObject.error = "Invalid user ID input";
        throw errorObject;
    }

    if (!reportId || !validators.isValidUuid(reportId)) {
        errorObject.error = "Invalid report ID input";
        throw errorObject;
    }

    const adminData = await getUserById(userId);

    if (!adminData.isAdmin) {
        errorObject.error = "User does not have admin access.";
        throw errorObject;
    }

    const reportsData = await reports();

    const report = await reportsData.findOne({ "report_id": reportId });

    if (!report) {
        errorObject.error = "Report with the provided report ID is not found";
        throw errorObject;
    }

    return report;
//     const errorObject = {
//         status:400
//     }
//     if (!userId || !validators.isValidUuid(userId)) 
// {        errorObject.error= "Invalid user ID input";
//     throw errorObject;
// }
//     if (!reportId || !validators.isValidUuid(reportId)) 
// {        errorObject.error= "Invalid report ID input";
//     throw errorObject;
// }
//     const adminData = await getUserById(userId);
    
//     if (!adminData.isAdmin) 
// {        errorObject.error="User does not have admin access.";
//         throw errorObject;
// }    
//     const userData = await reports();
    
//     const usersWithReports = userData.filter((user) => 
//         reports.length >0
//     );
    
//     if (usersWithReports.length === 0) {
//         errorObject.error="No reports found.";
//         throw errorObject;
//     }
    

//     const reportWithId = userData.flatMap(user => 
//         (user.reportsIds || []).filter(report => report.report_id === reportId)
//     );
    

//     if(!reportWithId){
//         errorObject.error="Report with report id provided is not found";
//         throw errorObject;
//     }
    
//     return reportWithId;
};

export const updateReportStatus= async(userId, reportId,newStatus,property_id) =>{
    const errorObject = {
        status:400
    }
    if (!userId || !validators.isValidUuid(userId)) 
        {errorObject.error= "Invalid user ID input";
        throw errorObject}

    if (!reportId || !validators.isValidUuid(reportId)) 
        {errorObject.error= "Invalid report ID input";
    throw errorObject}
    
    const adminData = await getUserById(userId);
    
    if (!adminData.isAdmin) 
{        errorObject.error="User does not have admin access.";
        throw errorObject;
}    
    const reportData = await getReportbyId(reportId,userId);
    if(!reportData){
        errorObject.error="Report with report id provided is not found";
        throw errorObject;
    }
    
    if( newStatus === "Accepted" || newStatus === "Rejected"){
        reportData.status = newStatus;
    }else {
        errorObject.error="Invalid status update requested";
        throw errorObject;
    }
    

    const userData = await getUserById(reportData.userId);

    if(!userData) 
{        errorObject.error="No user data found.";
        throw errorObject;
}
    // const reportWithId = userData.map(user =>
    //     (user.reportsIds || []).filter(report => report.report_id === reportId));
    

    //const reportWithId = userData.reportsIds.find(report => report.report_id === reportId);
    // const updatedReportsIds = userData.reportsIds.filter(report => report.report_id !== reportId);
    const updatedReportsIds = userData.reportsIds.map(report => 
        report.report_id === reportId ? { ...report, status: newStatus } : report
    );

    const updateResult = await updateUserReportIds(userId, updatedReportsIds);
    if (!updateResult)
{      errorObject.error="Failed to update user information with the report.";
        throw errorObject;
}

    return reportData[0].status;
  

}

export const updatePostReportStatus= async(userId, reportId,status) =>{
    const errorObject = {
        status:400
    }
    if (!userId || !validators.isValidUuid(userId)) 
{        errorObject.error= "Invalid user ID input";
    throw errorObject;
}
    if (!reportId || !validators.isValidUuid(reportId)) 
{        errorObject.error= "Invalid report ID input";
    throw errorObject;
}    
    const adminData = await getUserById(userId);
    

    if (!adminData.isAdmin) 
{        errorObject.error="User does not have admin access.";
    throw errorObject;
}    
    const reportData = await getReportbyId(reportId);

    if(!reportData){
        errorObject.error="Report with report id provided is not found.";
        throw errorObject;
    }
    
    // const updatedReportData = reportData.status("Post Report");
    
    //Update status of report
    reportData[0].status = "Accepted";
    const updatedReportData = reportData[0].status;

    //Pull user data associated with report
    const userData = await getUserById(reportData[0].userId);
    
    if(!userData) 
{        errorObject.error="No user data found.";
    throw errorObject
}    
    //Check the report with report ID is in user's reports
    const reportWithId = userData.flatMap(user => 
        (user.reportsIds || []).filter(report => report.report_id === reportId));
        

    return updatedReportData;

};

export const updateDeleteReportStatus= async(userId,reportId) =>{
    
    const errorObject = {
        status:400
    }
    if (!userId || !validators.isValidUuid(userId)) 
{        errorObject.error= "Invalid user ID input";
    throw errorObject;
}
    if (!reportId || !validators.isValidUuid(reportId)) 
{        errorObject.error= "Invalid report ID input";
    throw errorObject;
}    
    const adminData = await getUserById(userId);
    
    if (!adminData.isAdmin) 
{        errorObject.error="User does not have admin access.";
        throw errorObject;
}    
    const reportData = await getReportbyId(reportId);
    
    if(!reportData){
        errorObject.error="Report with report id provided is not found";
        throw errorObject;
    }

const updatedReportData = reportData.status("Delete");

return updatedReportData;

};

export const addLandLordReport = async ( userId, reportData,reportReason,reportedItemType,propertyId) => {
    const errorObject = {
        status:400
    }
    const userData = await getUserById(userId);
    const date = new Date().toISOString(); //date when report is raised.
    if (!reportData || Object.keys(reportData).length === 0)
{      errorObject.error="Invalid Report: Report content is required.";
        throw errorObject;
}    if (userData.isLandlord === true)
{      errorObject.error="no access since landlord";
        throw errorObject
}    
      const updatedReportData = {
        report_id: uuid(),
        userId: null, //user id of customer reporter_id/userId
        reported_item_type: null, //property or landlord
        report_reason: null, //report reason
        report_description: null, //description of reporting
        reported_at: null, // date of report raised
        status: "pending", //status of the report which is managed by landlord
        resolved_at: null, // Date when status is resolved.
        property_id:null
      };
    
    //Validation (cont.) and add to report object
    if (!userId || !validators.isValidUuid(userId)) {
    errorObject.error="Invalid user ID input";
    throw errorObject;
    } else {
        updatedReportData.userId = userId;
    }
    updatedReportData.property_id=propertyId;
    updatedReportData.reported_at = date;
    updatedReportData.report_description=reportData;
    updatedReportData.report_reason = reportReason;
    updatedReportData.reported_item_type=reportedItemType;
    userData.reportsIds.push(updatedReportData);
    const updateResult = await updateUserReportIds(userId, updatedReportData);
    if (!updateResult)
{      errorObject.error="Failed to update user information with the report.";
    throw errorObject;
}
if (!updateResult.acknowledged || !updateResult.insertedId)
{
    errorObject.error= "Could not create report";
    throw errorObject;
}
    
    //Return
    return { reportAdded: true };
    };

const updateUserReportIds = async (userId, updatedReportsIds) => {
    const reportsCollection = await reports();
    const insertInfo = await reportsCollection.insertOne(updatedReportsIds);
    return insertInfo;
};

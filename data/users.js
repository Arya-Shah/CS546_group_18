import { users } from "../config/mongoCollections.js";
// import uuid from 'uuid';
// import bcrypt from 'bcrypt';
import bcrypt from "bcryptjs";
import { v4 as uuid } from "uuid";
import validators from "../helper.js";
import {ObjectId} from 'mongodb';

const saltRounds = 16;

//Function: getAllUsers
export const getAllUsers = async () => {
//Retreive User Collection
const userCollection = await users();

//Return collection as array
return await userCollection.find({}).toArray();
};

export const loginUser = async (username, password) => {
const errorObject = {
status: 400,
};
if (!username && !password) {
errorObject.error = "No input provided to create user.";
throw errorObject;
}

if(username.length < 5 || username.length > 10){
errorObject = 'username should be between 5 and 10.' ;

}
if (!/^[a-zA-Z\s]+$/.test(username)) {
errorObject = 'username must be characters and cannot contain numbers.' ;
throw errorObject;
}

if(password.length < 8){
errorObject = 'password should be greater than 8.' ;
throw errorObject;
}
if (!/[!@#$%^&*(),.?":{}|<>]/.test(password) || !/[A-Z]/.test(password) || !/[0-9]/.test(password)) {
errorObject = 'There needs to be at least one uppercase character, there has to be at least one number and there has to be at least one special character' ;
throw errorObject;
}
const userRow = await getUserByName(username);
if (Object.keys(userRow).length === 0) {
errorObject.error = "Either the username or password is invalid";
throw errorObject;
}
let compareResult = await bcrypt.compare(password, userRow.hashedPassword);
if (!compareResult) {
errorObject.error = "Either the username or password is invalid";
throw errorObject;
}
''
return userRow;
};

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
errorObject = 'username should be between 5 and 10.';
throw errorObject;
}
if (!/^[a-zA-Z\s]+$/.test(username)) {
errorObject = 'username must be characters and cannot contain numbers.';
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


//Function: getUserById
export const getUserById = async (id) => {

//Validation
    if (!validators.isValidUuid(id)) 
        throw 'Invalid ID input';
        
//Retreive user collection and specific user
    const userCollection = await users();
    const user = await userCollection.findOne({ _id: new ObjectId(id) });
//Validation (cont.)
    if (!user) 
        throw 'User not found';
//Return 
    return user;    
};

//Function: registerUser    
export const registerUser = async (firstName, lastName, username, password, city, state, email, isLandlord, isAdmin) => {
//Validation
    if (!firstName || !validators.isValidString(firstName) || firstName.trim().length === 0)
        throw 'Invalid first name input';

if (
!lastName ||
!validators.isValidString(lastName) ||
lastName.trim().length === 0
)
throw "Invalid last name input";

    if (!email || !validators.isValidEmail(email) || email.trim().length === 0)
        throw 'Invalid email input';

    if (!city || !validators.isValidString(city) || city.trim().length === 0)
        throw 'Invalid city input';
    
    if (!state || !validators.isValidString(state) || state.trim().length === 0)
        throw 'Invalid state input';
    
    if (!password || !validators.isValidPassword(password) || password.trim().length === 0)
        throw 'Invalid password input';

//Retrieve user collection
const userCollection = await users();

//Set hashed password
const hashedPassword = await bcrypt.hash(password, saltRounds);

//New User Object
let newUser = {
firstName: firstName.trim(),
lastName: lastName.trim(),
username:username.trim().toLowerCase(),
email: email.trim().toLowerCase(),
isLandlord: false,
isAdmin: false,
properties: [],
city: city.trim(),
state: state.trim(),
hashedPassword: hashedPassword,
reviews: [], 
reviewIds: [],
commentsIds: [],
reportsIds: [],
averageRatings: {},
landlordReviews: [],
};

//Check if username exists
const userRow = await getUserByName(username);
if(username === userRow.username){
    throw "Username Already Exists."
}

//Insert new user object into collection
const insertInfo = await userCollection.insertOne(newUser);

//Validation (cont.)
if (!insertInfo.acknowledged || !insertInfo.insertedId)
throw "Could not add new user";

//Return
return { userInserted: true, userId: newUser.userId };
};

//Function: updateUser
export const updateUser = async (userId, updatedUser) => {
//Validation

if (!userId || !validators.isValidUuid(userId)) throw "Invalid user ID input";

if (
!updatedUser ||
typeof updatedUser !== "object" ||
Array.isArray(updatedUser)
)
throw "Invalid updatedUser input";

//Retrieve user collection
const userCollection = await users();

//Create object for updated user information
const updatedUserData = {};

//Validate and add updated user information to object
if (updatedUser.firstName) {
if (
    !updatedUser.firstName ||
    !validators.isValidString(updatedUser.firstName) ||
    updatedUser.firstName.trim().length === 0
)
    throw "Invalid first name input";

updatedUserData.firstName = updatedUser.firstName.trim();
}

if (updatedUser.lastName) {
if (
    !updatedUser.lastName ||
    !validators.isValidString(updatedUser.lastName) ||
    updatedUser.lastName.trim().length === 0
)
    throw "Invalid first name input";

updatedUserData.lastName = updatedUser.lastName.trim();
}

if (updatedUser.email) {
if (
    !updatedUser.email ||
    !validators.isValidEmail(updatedUser.email) ||
    updatedUser.email.trim().length === 0
)
    throw "Invalid email input";

updatedUserData.email = updatedUser.email.trim().toLowerCase();
}

if (updatedUser.city) {
if (
    !updatedUser.city ||
    !validators.isValidString(updatedUser.city) ||
    updatedUser.city.trim().length === 0
)
    throw "Invalid city input";

updatedUserData.city = updatedUser.city.trim();
}

if (updatedUser.state) {
if (
    !updatedUser.state ||
    !validators.isValidString(updatedUser.state) ||
    updatedUser.state.trim().length === 0
)
    throw "Invalid state input";

updatedUserData.state = updatedUser.state.trim();
}

if (updatedUser.password) {
if (
    !updatedUser.password ||
    !validators.isValidPassword(updatedUser.password) ||
    updatedUser.password.trim().length === 0
)
    throw "Invalid password input";

updatedUserData.hashedPassword = await bcrypt.hash(
    updatedUser.password,
    saltRounds
);
}

//Update user with object
const updateResponse = await userCollection.updateOne(
{ userId: userId },
{ $set: updatedUserData }
);

//Validation (cont.)
if (!updateResponse.acknowledged || updateResponse.modifiedCount === 0)
throw "Error occurred while updating user";

//Return
return { userUpdated: true };
};

//Function: removeUser
export const removeUser = async (userId) => {
//Validation
if (!userId || !validators.isValidUuid(userId)) throw "Invalid user ID input";

//Retreive User Collection
const userCollection = await users();

//Delete user
const deletionInfo = await userCollection.deleteOne({ userId: userId });

//Validation (cont.)
if (deletionInfo.deletedCount === 0) {
throw `Error occurred while deleting user with ID ${userId}`;
}

//Return
return { userDeleted: true };
};

//Function: addLandlordReview
export const addLandlordReview = async (landlordId, reviewData, userId) => {
//Retrieve Landlord
const landlord = await getUserById(landlordId);

//Validation
if (!reviewData || Object.keys(reviewData).length === 0)
throw "Invalid Review: Review data is required.";

//Create Review Object
const updatedReviewData = {
userId: null,
reviewId: uuid.v4(),
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

//Validation (cont.) and add to review object
if (!userId || !validators.isValidUuid(userId)) {
throw new Error("Invalid user ID input");
} else {
updatedReviewData.userId = userId;
}

const validRatings = [1, 2, 3, 4, 5];

if (
!reviewData.kindnessRating ||
typeof reviewData.kindnessRating !== "number" ||
!validRatings.includes(reviewData.kindnessRating)
) {
throw new Error("Invalid kindnessRating input");
} else {
updatedReviewData.kindnessRating = reviewData.kindnessRating;
}

if (
!reviewData.maintenanceResponsivenessRating ||
typeof reviewData.maintenanceResponsivenessRating !== "number" ||
!validRatings.includes(reviewData.maintenanceResponsivenessRating)
) {
throw new Error("Invalid maintenanceResponsivenessRating input");
} else {
updatedReviewData.maintenanceResponsivenessRating =
    reviewData.maintenanceResponsivenessRating;
}

if (
!reviewData.overallCommunicationRating ||
typeof reviewData.overallCommunicationRating !== "number" ||
!validRatings.includes(reviewData.overallCommunicationRating)
) {
throw new Error("Invalid overallCommunicationRating input");
} else {
updatedReviewData.overallCommunicationRating =
    reviewData.overallCommunicationRating;
}

if (
!reviewData.professionalismRating ||
typeof reviewData.professionalismRating !== "number" ||
!validRatings.includes(reviewData.professionalismRating)
) {
throw new Error("Invalid professionalismRating input");
} else {
updatedReviewData.professionalismRating = reviewData.professionalismRating;
}

if (
!reviewData.handinessRating ||
typeof reviewData.handinessRating !== "number" ||
!validRatings.includes(reviewData.handinessRating)
) {
throw new Error("Invalid handinessRating input");
} else {
updatedReviewData.handinessRating = reviewData.handinessRating;
}

if (
!reviewData.depositHandlingRating ||
typeof reviewData.depositHandlingRating !== "number" ||
!validRatings.includes(reviewData.depositHandlingRating)
) {
throw new Error("Invalid depositHandlingRating input");
} else {
updatedReviewData.depositHandlingRating = reviewData.depositHandlingRating;
}

if (
!reviewData.reviewText ||
!validators.isValidString(reviewData.reviewText) ||
reviewData.reviewText.trim().length === 0
) {
throw new Error("Invalid reviewText input");
} else {
updatedReviewData.reviewText = reviewData.reviewText;
}

//Update User with review id
const userUpdateStatus = await updateUser(
{ userId: userId },
{ $push: { reviewIds: updatedReviewData.reviewId } }
);

if (!userUpdateStatus)
throw "Failed to update user information with new review.";

//Update Landlord with review
const landlordUpdateStatus = await updateUser(landlordId, {
$push: { reviews: updatedReviewData },
});

if (!landlordUpdateStatus)
throw "Failed to update landlord informaiton with new review.";

//To Do: Recalculate Landlord's average ratings
validators.updateRating(landlordId);

//Return
return { reviewAdded: true };
};

// Function: removeCommentReply, removes comment from property or reply from comment
export const removeLandlordReview = async (
userId,
landlordId,
landlordReviewId
) => {
//Validations
if (!userId || !validators.isValidUuid(userId)) throw "Invalid user ID input";

if (!landlordId || !validators.isValidUuid(landlordId))
throw "Invalid landlord ID input";

if (!landlordReviewId || !validators.isValidUuid(landlordReviewId))
throw "Invalid user landlordReviewId input";

//Pull property collection
const userCollection = await users();

//Try to pull comment from property
let updateInfo = await userCollection.updateOne(
{ userId: landlordId },
{ $pull: { "reviews.reviewId": landlordReviewId } }
);

//Throw Error if Failed
if (!updateInfo.acknowledged || updateInfo.modifiedCount === 0)
throw "Failed to remove comment or reply.";

//Remove reviewId from user's object

const userUpdateStatus = await userCollection.updateOne(
{ userId: userId },
{ $pull: { reviewIds: landlordReviewId } }
);

if (!userUpdateStatus.acknowledged || userUpdateStatus.modifiedCount === 0)
throw "Failed to update user information with removed review.";

//Return
return { commentOrReplyPulled: true };
};

// Function: Add a property to user's bookmarks
export const addBookmark = async (userId, propertyId) => {
if (!userId || !validators.isValidUuid(userId)) throw "Invalid user ID input";
if (!propertyId || !validators.isValidUuid(propertyId))
throw "Invalid property ID input";

const userCollection = await users();
const updateInfo = await userCollection.updateOne(
{ userId: userId },
{ $addToSet: { bookmarkedProperties: propertyId } }
);

if (!updateInfo.acknowledged || updateInfo.modifiedCount === 0)
throw "Failed to add bookmark";

return { bookmarkAdded: true };
};

// Function: Remove a property from user's bookmarks
export const removeBookmark = async (userId, propertyId) => {
if (!userId || !validators.isValidUuid(userId)) throw "Invalid user ID input";
if (!propertyId || !validators.isValidUuid(propertyId))
throw "Invalid property ID input";

const userCollection = await users();
const updateInfo = await userCollection.updateOne(
{ userId: userId },
{ $pull: { bookmarkedProperties: propertyId } }
);

if (!updateInfo.acknowledged || updateInfo.modifiedCount === 0)
throw "Failed to remove bookmark";

return { bookmarkRemoved: true };
};

// Function: Get all bookmarked properties for a user
export const getBookmarkedProperties = async (userId) => {
if (!userId || !validators.isValidUuid(userId)) throw "Invalid user ID input";

const userCollection = await users();
const user = await userCollection.findOne(
{ userId: userId },
{ projection: { bookmarkedProperties: 1 } }
);

if (!user) throw "User not found";

return user.bookmarkedProperties || [];
};

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
const propertiesList = await propertyCollection
.find({
    $text: { $search: title },
})
.toArray();

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

//Function addLandLordReport (report created by user on landlord)
export const addLandLordReport = async (landlordId, reportData, userId) => {
console.log("called addLandLordReport", landlordId, reportData, userId);
const landlord = await getUserById(landlordId);
const date = new Date().toISOString(); //date when report is raised.
if (!reportData || Object.keys(reportData).length === 0)
throw "Invalid Report: Report content is required.";

const updatedReportData = {
report_id: uuid(),
userId: null, //user id of customer reporter_id/userId
reported_item_type: null, //property or landlord
report_reason: null, //report reason
report_description: null, //description of reporting
reported_at: null, // date of report raised
status: "pending", //status of the report which is managed by landlord
resolved_at: null, // Date when status is resolved.
};

updatedReportData.reported_at = date;
if (!userId || !validators.isValidUuid(userId)) {
throw new Error("Invalid user ID input");
} else {
updatedReportData.userId = userId;
}
// complete the validation before using this method!
const userReportUpdateStatus = await updateUser(
{ userId: userId },
{ $push: { reportsIds: updatedReportData.report_id } }
);
console.log(userReportUpdateStatus);
if (!userReportUpdateStatus)
throw "Failed to update user information with the report.";

const landlordReportUpdateStatus = await updateUser(landlordId, {
$push: { reports: updatedReportData },
});
console.log(landlordReportUpdateStatus);
if (!landlordReportUpdateStatus)
throw "Failed to update landlord informaiton with new report.";

return { reportAdded: true };
}


//Imports
import { users } from '../config/mongoCollections.js';
import { properties } from '../config/mongoCollections.js';
import { v4 as uuid } from "uuid";
import validators from "../helper.js";


//Function: getAllProperties
export const getAllProperties = async () => {

    //Retreive Property Collection
    const propertyCollection = await properties();

    //Return collection as array
    return await propertyCollection.find({}).toArray();

};

//Function: getPropertyById
export const getPropertyById = async (id) => {
 
    //Validation
    if (!validators.isValidUuid(id)) throw "Invalid ID input";

    //Retreive property collection and specific property
    const propertyCollection = await properties();
    const property = await propertyCollection.findOne({ propertyId: id });

    //Validation (cont.)
    if (!property) throw "Property not found";

    //Return
    return property;

};

// Function: getPropertyByAddress
export const getPropertyByAddress = async (address) => {
    
    if (!address || 
        !validators.isValidString(address) || 
        address.trim().length === 0) {
            throw "Invalid address input.";
    }

    if (address.length < 5 || address.length > 100) {
        throw "Address should be between 5 and 100 characters.";
    }
    
    address = address.trim().toLowerCase();
    
    const propertyCollection = await properties();

    //Regular expression to make search case insenstive and global
    const regex = new RegExp(address, 'gi');

    const propertiesMatchingAddress = await propertyCollection.find({ address: regex }).toArray();
    
    //Note: propertiesMatchingAddress is an array of objects
    return propertiesMatchingAddress;
};

// Function: getPropertyByCity
export const getPropertyByCity = async (city) => {
    if (!city || 
        !validators.isValidString(city) || 
        city.trim().length === 0) {
            throw "Invalid city input.";
    }
    
    city = city.trim().toLowerCase();
    
    const propertyCollection = await properties();

    // Regular expression to make search case insensitive and global
    const regex = new RegExp(city, 'gi');

    const propertiesMatchingCity = await propertyCollection.find({ city: regex }).toArray();
    
    // Note: propertiesMatchingCity is an array of objects
    return propertiesMatchingCity;

};

// Function: getPropertyByState
export const getPropertyByState = async (state) => {
    if (!state || 
        !validators.isValidString(state) || 
        state.trim().length === 0) {
            throw "Invalid state input.";
    }

    state = state.trim().toLowerCase();
    
    const propertyCollection = await properties();

    // Regular expression to make search case insensitive and global
    const regex = new RegExp(state, 'gi');

    const propertiesMatchingState = await propertyCollection.find({ state: regex }).toArray();
    
    // Note: propertiesMatchingState is an array of objects
    return propertiesMatchingState;
};

// Function: getPropertyByZipcode
export const getPropertyByZipcode = async (zipcode) => {
    if (!zipcode || 
        !validators.isValidString(zipcode) || 
        !validators.isValidZipcode(zipcode) ||
        zipcode.trim().length === 0) {
            throw "Invalid zipcode input.";
    }

    zipcode = zipcode.trim();

    const propertyCollection = await properties();

    // Regular expression to make search case insensitive and global
    const regex = new RegExp(zipcode, 'gi');

    const propertiesMatchingZipcode = await propertyCollection.find({ zipcode: regex }).toArray();
    
    // Note: propertiesMatchingZipcode is an array of objects
    return propertiesMatchingZipcode;
};

//Function: addProperty
export const addProperty = async (
  propertyName,
  address,
  city,
  state,
  zipcode,
  longitude,
  latitude,
  propertyCategory,
  bedrooms,
  bathrooms
) => {
  
    //Validation
    if (
      !propertyName ||
      !validators.isValidString(propertyName) ||
      propertyName.trim().length === 0
    )
      throw "Invalid property name input";

    if (
      !address ||
      !validators.isValidString(address) ||
      address.trim().length === 0
    )
      throw "Invalid address input";

    if (address.trim().length < 5 || 
        address.trim().length > 100)
        throw "The provided address needs to be between 5 and 100 characters.";

    if (!city || 
        !validators.isValidString(city) || 
        city.trim().length === 0)
      throw "Invalid city input";

    if (!state || 
        !validators.isValidString(state) || 
        state.trim().length === 0)
      throw "Invalid state input";

    if (!zipcode || 
        !validators.isValidString(zipcode) || 
        !validators.isValidZipcode(zipcode) ||
        zipcode.trim().length === 0)
      throw "Invalid zipcode input";

    if (!longitude || 
        !validators.isValidString(longitude) || 
        !validators.isValidLongitude(longitude) ||
        longitude.trim().length === 0)
      throw "Invalid longitude input";

    if (!latitude || 
        !validators.isValidString(latitude) || 
        !validators.isValidLatitude(latitude) ||
        latitude.trim().length === 0)
      throw "Invalid latitude input";
    
    if (!propertyCategory || 
        !validators.isValidString(propertyCategory) || 
        propertyCategory.trim().length === 0 || 
        !validators.isValidPropertyCategory(propertyCategory))
      throw "Invalid propertyCategory input";

    if (!bedrooms || 
        !validators.isValidString(bedrooms) || 
        bedrooms.trim().length === 0 ||
        isNaN(parseFloat(bedrooms)))
    throw "Invalid bedrooms input";

    if (!bathrooms || 
        !validators.isValidString(bathrooms) || 
        bathrooms.trim().length === 0 ||
        isNaN(parseFloat(bathrooms)))
    throw "Invalid bathrooms input";

    //Retrieve property collection
    const propertyCollection = await properties();

    //New Property Object
    let newProperty = {
        propertyId: uuid(),
        propertyName: propertyName,
        address: address,
        city: city,
        state: state,
        zipcode: zipcode,
        longitude: longitude,
        latitude: latitude,
        propertyCategory: propertyCategory,
        bedrooms: bedrooms,
        bathrooms: bathrooms,
        averageRatings: {},
        reviews: [],
        comments: []
    };
    
    //Insert new property object into collection
    const insertInfo = await propertyCollection.insertOne(newProperty);

    //Validation (cont.)
    if (!insertInfo.acknowledged || !insertInfo.insertedId)
      throw "Could not add new property";

    //Return
    return { propertyInserted: true, propertyId: newProperty.propertyId};
};

//Function: updateUser
export const updateUser = async (propertyId, updatedProperty) => {
    
    //Validation
    if (!propertyId || !validators.isValidUuid(propertyId)) throw "Invalid property ID input";
    
    if ( !updatedProperty || 
        typeof updatedProperty !== "object" ||
        Array.isArray(updatedProperty))
        throw "Invalid updatedProperty input";
    
    //Retrieve user collection
    const propertyCollection = await properties();
    
    //Create object for updated user information
    const updatedPropertyData = {};
    
    //Validate and add updated user information to object
    if (updatedProperty.propertyName) {
        if (!updatedProperty.propertyName ||
            !validators.isValidString(updatedProperty.propertyName) ||
            updatedProperty.propertyName.trim().length === 0
        )
            throw "Invalid property name input";
        
        updatedPropertyData.propertyName = updatedProperty.propertyName.trim();
    }
    
    if (updatedProperty.address) {
        if ( !updatedProperty.address ||
            !validators.isValidString(updatedProperty.address) ||
            updatedProperty.address.trim().length === 0
        )
            throw "Invalid address input";
    
        updatedPropertyData.address = updatedProperty.address.trim();
    }
    
    if (updatedProperty.city) {
        if ( !updatedProperty.city ||
            !validators.isValidString(updatedProperty.city) ||
            updatedProperty.city.trim().length === 0)
            throw "Invalid city input";
        
        updatedPropertyData.city = updatedProperty.city.trim();
    }
    
    if (updatedProperty.state) {
        if (!updatedProperty.state ||
            !validators.isValidString(updatedProperty.state) ||
            updatedProperty.state.trim().length === 0)
                throw "Invalid state input";
    
        updatedPropertyData.state = updatedProperty.state.trim();
    }

    if (updatedProperty.zipcode) {
        if (
            !updatedProperty.zipcode || 
            !validators.isValidString(updatedProperty.zipcode) || 
            !validators.isValidZipcode(updatedProperty.zipcode) || 
            updatedProperty.zipcode.trim().length === 0)
                throw "Invalid zipcode input";
    
        updatedPropertyData.zipcode = updatedProperty.zipcode.trim();
    }
   
    if (updatedProperty.longitude) { 
        if ( !updatedProperty.longitude || 
            !validators.isValidString(updatedProperty.longitude) || 
            !validators.isValidLongitude(updatedProperty.longitude) || 
            updatedProperty.longitude.trim().length === 0 ) 
                throw "Invalid longitude input"; 
        
        updatedPropertyData.longitude = updatedProperty.longitude.trim(); 
    
    } 
        
    if (updatedProperty.latitude) { 
        if ( !updatedProperty.latitude || 
            !validators.isValidString(updatedProperty.latitude) || 
            !validators.isValidLatitude(updatedProperty.latitude) || 
            updatedProperty.latitude.trim().length === 0 ) 
                throw "Invalid latitude input"; 
        
        updatedPropertyData.latitude = updatedProperty.latitude.trim(); 
    
    } 
        
    if (updatedProperty.propertyCategory) { 
        if ( !updatedProperty.propertyCategory || 
            !validators.isValidString(updatedProperty.propertyCategory) || 
            updatedProperty.propertyCategory.trim().length === 0 || 
            !validators.isValidPropertyCategory(updatedProperty.propertyCategory) ) 
                throw "Invalid propertyCategory input"; 
        
        updatedPropertyData.propertyCategory = updatedProperty.propertyCategory.trim(); 
    
    } 
    
    if (updatedProperty.bedrooms) { 
        if ( !updatedProperty.bedrooms || 
            !validators.isValidString(updatedProperty.bedrooms) || 
            updatedProperty.bedrooms.trim().length === 0 || 
            isNaN(parseFloat(updatedProperty.bedrooms)) ) 
                throw "Invalid bedrooms input"; 
                
        updatedPropertyData.bedrooms = updatedProperty.bedrooms.trim(); 
    
    } 
    
    if (updatedProperty.bathrooms) { 
        if ( !updatedProperty.bathrooms || 
            !validators.isValidString(updatedProperty.bathrooms) || 
            updatedProperty.bathrooms.trim().length === 0 || 
            isNaN(parseFloat(updatedProperty.bathrooms)) ) 
                throw "Invalid bathrooms input"; 
                
        updatedPropertyData.bathrooms = updatedProperty.bathrooms.trim(); }


    //Update user with object
    const updateResponse = await propertyCollection.updateOne(
        { propertyId: propertyId },
         { $set: updatedPropertyData }
    );
    
    //Validation (cont.)
    if (!updateResponse.acknowledged || updateResponse.modifiedCount === 0)
    throw "Error occurred while updating property";
    
    //Return
    return { propertyUpdated: true };
    
};

//Function: removeProperty
export const removeProperty = async (propertyId) => {
    //Validation
    if (!propertyId || !validators.isValidUuid(propertyId)) throw "Invalid property ID input";
    
    //Retreive Property Collection
    const propertyCollection = await properties();
    
    //Delete Property
    const deletionInfo = await propertyCollection.deleteOne({ propertyId: propertyId });
    
    //Validation (cont.)
    if (deletionInfo.deletedCount === 0) {
    throw `Error occurred while deleting user with ID ${propertyId}`;
    }
    
    //Return
    return { propertyDeleted: true };

};

//Function: addPropertyReview
export const addPropertyReview = async (propertyId, reviewData, userId) => {
    
    //Retrieve Property
        const property = await getPropertyById(propertyId);
    
    //Validation
        if (!reviewData || Object.keys(reviewData).length === 0)
            throw "Invalid Review: Review data is required.";
    
    //Create Review Object
    const updatedReviewData = {
        userId: null,
        reviewId: uuid.v4(),
        date: new Date().toISOString(),
        reports: [],
        locationDesirabilityRating: null, 
        ownerResponsivenessRating: null, 
        propertyConditionRating: null, 
        communityRating: null, 
        amenitiesRating: null, 
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
        !reviewData.locationDesirabilityRating ||
        typeof reviewData.locationDesirabilityRating !== "number" ||
        !validRatings.includes(reviewData.locationDesirabilityRating)
    ) {
        throw new Error("Invalid locationDesirabilityRating input");
    } else {
        updatedReviewData.locationDesirabilityRating = reviewData.locationDesirabilityRating;
    }
    
    if (
        !reviewData.ownerResponsivenessRating ||
        typeof reviewData.ownerResponsivenessRating !== "number" ||
        !validRatings.includes(reviewData.ownerResponsivenessRating)
    ) {
        throw new Error("Invalid ownerResponsivenessRating input");
    } else {
        updatedReviewData.ownerResponsivenessRating = reviewData.ownerResponsivenessRating;
    }
    
    if (
        !reviewData.propertyConditionRating ||
        typeof reviewData.propertyConditionRating !== "number" ||
        !validRatings.includes(reviewData.propertyConditionRating)
        ) {
        throw new Error("Invalid propertyConditionRating input");

    } else {
        updatedReviewData.propertyConditionRating = reviewData.propertyConditionRating;
    }
    
    if (
        !reviewData.communityRating ||
        typeof reviewData.communityRating !== "number" ||
        !validRatings.includes(reviewData.communityRating)
        ) {
        throw new Error("Invalid communityRating input");
    } else {
        updatedReviewData.communityRating = reviewData.communityRating;
    }
    
    if (
        !reviewData.amenitiesRating ||
        typeof reviewData.amenitiesRating !== "number" ||
        !validRatings.includes(reviewData.amenitiesRating)
    ) {
        throw new Error("Invalid amenitiesRating input");
    } else {
        updatedReviewData.amenitiesRating = reviewData.amenitiesRating;
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
        throw "Failed to update user information with new property review.";
    
    //Update property with review
    const propertyUpdateStatus = await updatedProperty(propertyId, {
        $push: { reviews: updatedReviewData },
    });
    
    if (!propertyUpdateStatus)
    throw "Failed to update property informaiton with new review.";
    
    //To Do: Recalculate Property's average ratings
    validators.updateRatingProperty (propertyId);
    
    //Return
    return { reviewAdded: true };
 };

//Function: removePropertyReview
 export const removePropertyReview = async (propertyId, reviewId) => {
    
    // Validations
    if (!propertyId || !validators.isValidUuid(propertyId))
        throw "Invalid property ID input";

    if (!reviewId || !validators.isValidUuid(reviewId))
        throw "Invalid review ID input";

    // Retrieve Property
    const propertyCollection = await properties();
    const property = await propertyCollection.findOne({ propertyId });

    // Check if property exists
    if (!property) throw "Property not found";

    // Try to pull the review from the property
    const updateInfo = await propertyCollection.updateOne(
        { propertyId },
        { $pull: { reviews: { reviewId } } }
    );

    // Throw Error if Failed
    if (!updateInfo.acknowledged || updateInfo.modifiedCount === 0)
        throw "Failed to remove review from property.";

    // Remove reviewId from user's object
    const userCollection = await users();
    
    const updateUserStatus = await userCollection.updateMany(
        {},
        { $pull: { reviewIds: reviewId } }
    );

    if (!updateUserStatus.acknowledged || updateUserStatus.modifiedCount === 0)
         throw "Failed to update user information with removed review.";

    // Return
    return { reviewRemoved: true };
};

// Function: addCommentReply, adds comment to property or reply to comment
export const addCommentReply = async (userId, propertyOrCommentId, commentText) => {
        
    //Validations
        if (!userId || !validators.isValidUuid(userId))
            throw 'Invalid user ID input';
        
        if (!propertyOrCommentId || !validators.isValidUuid(propertyOrCommentId))
            throw 'Invalid property ID input';

        if(!commentText || typeof commentText !== 'string'){
            throw 'Invalid comment provided. Comment needs to be a string.'
        }

    //Create Comment Object    
        const commentToAdd = {
            commentId: uuid.v4(),
            userId : userId,
            commentText : commentText,
            dateCreated : new Date().toISOString(),
            likes : 0,
            dislikes : 0,
            replies : [],
            reports : []
        };

    //Pull property collection
        const propertyCollection = await properties();
        
        const property = await propertyCollection.findOne({ propertyId: propertyOrCommentId });
    
        let updateInfo;
    
        //If a property id, add a commment; Else: Add reply
            if (property){  
                updateInfo = await propertyCollection.updateOne(
                    { propertyId: propertyOrCommentId },
                    { $push: { comments: commentToAdd } }
                );

            } else {
                updateInfo = await propertyCollection.updateOne(
                    { 'comments.commentId': propertyOrCommentId },
                    { $push: { 'comments.$.replies': commentToAdd } }
                );
            }

    //Throw Error if Failed 
        if (!updateInfo.acknowledged || updateInfo.modifiedCount === 0)
                throw 'Failed to add comment or reply.';

    //Update User with comment id

        const userCollection = await users();

        const userUpdateStatus = await userCollection.updateOne(
            {userId: userId},
            { $push: {commentsIds: commentToAdd.commentId}}
        );

        if (!userUpdateStatus)
            throw 'Failed to update user information with new review.';

    //Return
        return { commentOrReplyAdded: true };
        
};


// Function: removeCommentReply, removes comment from property or reply from comment
export const removeCommentReply = async (userId, propertyOrCommentId) => {
    
    //Validations    
        if (!userId || !validators.isValidUuid(userId))
            throw 'Invalid user ID input';
    
        if (!propertyOrCommentId || !validators.isValidUuid(propertyOrCommentId))
            throw 'Invalid property ID input';   

    //Pull property collection
        const propertyCollection = await properties();
    
    //Try to pull comment from property
        let updateInfo = await propertyCollection.updateOne(
            { $pull: {'comments.commentId': propertyOrCommentId} }
        );

    //If failed, try to pull reply
        if (!updateInfo.acknowledged || updateInfo.modifiedCount === 0){
        
            updateInfo = await propertyCollection.updateOne(
                { $pull: {'replies.commentId': propertyOrCommentId} }
            );

        }

    //Throw Error if Failed 
        if (!updateInfo.acknowledged || updateInfo.modifiedCount === 0)
            throw 'Failed to remove comment or reply.';

    //Remove commentId from user's object
        const userCollection = await users();

        const userUpdateStatus = await userCollection.updateOne(
            {'userId': userId},
            {$pull: {'commentsIds.commentId': propertyOrCommentId}}
        );

        if (!userUpdateStatus)
            throw 'Failed to update user information with new review.';

    //Return
        return { commentOrReplyPulled: true };
        
};


//Function: addLikeDislike, adds like or dislike to comment or reply
export const addLikeDislike = async (propertyOrCommentId, likeOrDislike) => {
    
    //Validations    
    if (!propertyOrCommentId || !validators.isValidUuid(propertyOrCommentId))
        throw 'Invalid property ID input';   

    //Validations    
    if (!likeOrDislike || typeof likeOrDislike !== 'string' || (likeOrDislike !== 'like' && likeOrDislike !== 'dislike'))
        throw 'Invalid indicidation if like or dislike should be added';   

    //Pull property collection
    const propertyCollection = await properties();

    //Try to add like or dislike to comment from property
    
    let updateInfo;    

    if(likeOrDislike === 'like'){
        
        updateInfo = await propertyCollection.updateOne(
            { 'comments.commentId': propertyOrCommentId },
            { $inc: { 'comments.$.likes': 1 } }
        );

    } else {
        
        updateInfo = await propertyCollection.updateOne(
            { 'comments.commentId': propertyOrCommentId },
            { $inc: { 'comments.$.dislikes': 1 } }
        );

    };


    //If failed, try to add like or dislike to reply
    if (!updateInfo.acknowledged || updateInfo.modifiedCount === 0){
        
        if(likeOrDislike === 'like'){
            
            updateInfo = await propertyCollection.updateOne(
                { 'replies.commentId': propertyOrCommentId },
                { $inc: { 'replies.$.likes': 1 } }
            );
        
        } else{ 
            
            updateInfo = await propertyCollection.updateOne(
                { 'replies.commentId': propertyOrCommentId },
                { $inc: { 'replies.$.dislikes': 1 } }
            );
        }

    }

    //Throw Error if Failed 
    if (!updateInfo.acknowledged || updateInfo.modifiedCount === 0)
        throw 'Failed to increment likes on comment or reply.';

//Return
    return { likeAdded: true };
    
};


//Function: removeLikeDislike, removes like or dislike to comment or reply
export const removeLikeDislike = async (propertyOrCommentId, likeOrDislike) => {
    
    //Validations    
        if (!propertyOrCommentId || !validators.isValidUuid(propertyOrCommentId))
            throw 'Invalid property ID input';   
    
    //Validations    
        if (!likeOrDislike || typeof likeOrDislike !== 'string' || (likeOrDislike !== 'like' && likeOrDislike !== 'dislike'))
            throw 'Invalid indicidation if like or dislike should be added';   
    
    //Pull property collection
        const propertyCollection = await properties();
    
    //Try to add like or dislike to comment from property
        
        let updateInfo;    
    
        if(likeOrDislike === 'like'){
            
            updateInfo = await propertyCollection.updateOne(
                { 'comments.commentId': propertyOrCommentId },
                { $inc: { 'comments.$.likes': -1 } }
            );
    
        } else {
            
            updateInfo = await propertyCollection.updateOne(
                { 'comments.commentId': propertyOrCommentId },
                { $inc: { 'comments.$.dislikes': -1 } }
            );
    
        };
    
    //If failed, try to add like or dislike to reply
        if (!updateInfo.acknowledged || updateInfo.modifiedCount === 0){
            
            if(likeOrDislike === 'like'){
                
                updateInfo = await propertyCollection.updateOne(
                    { 'replies.commentId': propertyOrCommentId },
                    { $inc: { 'replies.$.likes': -1 } }
                );
            
            } else{ 
                
                updateInfo = await propertyCollection.updateOne(
                    { 'replies.commentId': propertyOrCommentId },
                    { $inc: { 'replies.$.dislikes': -1 } }
                );
            }
    
        }
    
    //Throw Error if Failed 
        if (!updateInfo.acknowledged || updateInfo.modifiedCount === 0)
            throw 'Failed to decrement likes on comment or reply.';
    
    //Return
        return { likeRemoved: true };
        
    };
    


//Imports
import { users } from '../config/mongoCollections.js';
import { properties } from '../config/mongoCollections.js';
import { v4 as uuid } from "uuid";
import validators from "../helper.js";
import * as usersfunctions from './users.js';


//Function: getAllProperties
export const getAllProperties = async () => {

    //Retreive Property Collection
    const propertyCollection = await properties();

    //Return collection as array
    return await propertyCollection.find({}).toArray();

};

//Function: getPropertyById
export const getPropertyById = async (id) => {
  
    const errorObject = {
        status: 400,
        };
    //Validation
    if (!id || !validators.isValidUuid(id)) {errorObject.error= "Invalid ID input";
        throw errorObject;
    }
  
    //Retreive property collection and specific property
    const propertyCollection = await properties();
    
    const property = await propertyCollection.findOne({ propertyId: id });
   
    //Validation (cont.)
    if (!property) {errorObject.error= "Property not found";
    throw errorObject
    }
 
    //Return
    return property;

};


// Function: getPropertyByName
export const getPropertyByName = async (name) => {
    
    const errorObject = {
        status: 400,
        };
    if (!name || 
        !validators.isValidString(name) || 
        name.trim().length === 0) {
            errorObject.error = "Invalid address input.";
            throw errorObject
    }
    
    name = name.trim().toLowerCase();
    
    const propertyCollection = await properties();

    //Regular expression to make search case insenstive and global
    const regex = new RegExp(`\\b${name}\\b`, 'gi');
    const propertiesMatchingName = await propertyCollection.find({ propertyName: regex }).toArray();
    
    //Note: propertiesMatchingName is an array of objects
    return propertiesMatchingName;
};

// Function: getPropertyByAddress
export const getPropertyByAddress = async (address) => {
    
    const errorObject = {
        status: 400,
        };
    if (!address || 
        !validators.isValidString(address) || 
        address.trim().length === 0) {
            errorObject.error= "Invalid address input.";
            throw errorObject
    }

    if (address.length < 5 || address.length > 100) {
        errorObject.error= "Address should be between 5 and 100 characters.";
        throw errorObject
    }
    
    address = address.trim().toLowerCase();
    
    const propertyCollection = await properties();

    //Regular expression to make search case insenstive and global
    const regex = new RegExp(`\\b${address}\\b`, 'gi');

    const propertiesMatchingAddress = await propertyCollection.find({ address: regex }).toArray();
    
    //Note: propertiesMatchingAddress is an array of objects
    return propertiesMatchingAddress;
};

// Function: getPropertyByCity
export const getPropertyByCity = async (city) => {
    const errorObject = {
        status: 400,
        };
    if (!city || 
        !validators.isValidString(city) || 
        city.trim().length === 0) {
            errorObject.error= "Invalid city input.";
            throw errorObject;
    }
    
    city = city.trim().toLowerCase();
    
    const propertyCollection = await properties();

    // Regular expression to make search case insensitive and global
    const regex = new RegExp(`\\b${city}\\b`, 'gi');

    const propertiesMatchingCity = await propertyCollection.find({ city: regex }).toArray();
    
    // Note: propertiesMatchingCity is an array of objects
    return propertiesMatchingCity;

};

// Function: getPropertyByState
export const getPropertyByState = async (state) => {
    const errorObject = {
        status: 400,
        };
    if (!state || 
        !validators.isValidString(state) || 
        state.trim().length === 0) {
            errorObject.error= "Invalid state input.";
            throw errorObject
    }

    state = state.trim().toLowerCase();
    
    const propertyCollection = await properties();

    // Regular expression to make search case insensitive and global
    const regex = new RegExp(`\\b${state}\\b`, 'gi');

    const propertiesMatchingState = await propertyCollection.find({ state: regex }).toArray();
    
    // Note: propertiesMatchingState is an array of objects
    return propertiesMatchingState;
};

// Function: getPropertyByZipcode
export const getPropertyByZipcode = async (zipcode) => {
    const errorObject = {
        status: 400,
        };
    if (!zipcode || 
        !validators.isValidString(zipcode) || 
        !validators.isValidZipcode(zipcode) ||
        zipcode.trim().length === 0) {
            errorObject.error= "Invalid zipcode input.";
            throw errorObject
    }

    zipcode = zipcode.trim();

    const propertyCollection = await properties();

    // Regular expression to make search case insensitive and global
    const regex = new RegExp(`\\b${zipcode}\\b`, 'gi');

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
  
    const errorObject = {
        status: 400,
        };
    //Validation
    if (
      !propertyName ||
      !validators.isValidString(propertyName) ||
      propertyName.trim().length === 0
    )
      {errorObject.error= "Invalid property name input";
      throw errorObject}

    if (
      !address ||
      !validators.isValidString(address) ||
      address.trim().length === 0
    )
      {errorObject.error= "Invalid address input";
      throw errorObject}

    if (address.trim().length < 5 || 
        address.trim().length > 100)
        {errorObject.error= "The provided address needs to be between 5 and 100 characters.";
        throw errorObject}

    if (!city || 
        !validators.isValidString(city) || 
        city.trim().length === 0)
      {errorObject.error= "Invalid city input";
      throw errorObject}

    if (!state || 
        !validators.isValidString(state) || 
        state.trim().length === 0)
      {errorObject.error= "Invalid state input";
      throw errorObject}

    if (!zipcode || 
        !validators.isValidString(zipcode) || 
        !validators.isValidZipcode(zipcode) ||
        zipcode.trim().length === 0)
      {errorObject.error= "Invalid zipcode input";
      throw errorObject}

    if (!longitude || 
        !validators.isValidString(longitude) || 
        !validators.isValidLongitude(longitude) ||
        longitude.trim().length === 0)
      {errorObject.error= "Invalid longitude input";
      throw errorObject}

    if (!latitude || 
        !validators.isValidString(latitude) || 
        !validators.isValidLatitude(latitude) ||
        latitude.trim().length === 0)
      {errorObject.error= "Invalid latitude input";
      throw errorObject}
    
    if (!propertyCategory || 
        !validators.isValidString(propertyCategory) || 
        propertyCategory.trim().length === 0 || 
        !validators.isValidPropertyCategory(propertyCategory))
      {errorObject.error= "Invalid propertyCategory input";
      throw errorObject}

    if (!bedrooms || 
        !validators.isValidString(bedrooms) || 
        bedrooms.trim().length === 0 ||
        isNaN(parseFloat(bedrooms)))
    {errorObject.error= "Invalid bedrooms input";
    throw errorObject}

    if (!bathrooms || 
        !validators.isValidString(bathrooms) || 
        bathrooms.trim().length === 0 ||
        isNaN(parseFloat(bathrooms)))
    {errorObject.error= "Invalid bathrooms input";
    throw errorObject}

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
    {  errorObject.error= "Could not add new property";
    throw errorObject}

    //Return
    return { propertyInserted: true, propertyId: newProperty.propertyId};
};

//Function: updateProperty
export const updateProperty = async (propertyId, updatedProperty) => {
    
    const errorObject = {
        status: 400,
        };
    //Validation
    if (!propertyId || !validators.isValidUuid(propertyId)) errorObject.error= "Invalid property ID input";
    
    if ( !updatedProperty || 
        typeof updatedProperty !== "object" ||
        Array.isArray(updatedProperty))
        {errorObject.error= "Invalid updatedProperty input";
        throw errorObject}
    
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
            {errorObject.error= "Invalid property name input";
            throw errorObject}
        
        updatedPropertyData.propertyName = updatedProperty.propertyName.trim();
    }
    
    if (updatedProperty.address) {
        if ( !updatedProperty.address ||
            !validators.isValidString(updatedProperty.address) ||
            updatedProperty.address.trim().length === 0
        )
            {errorObject.error= "Invalid address input";
            throw errorObject}
    
        updatedPropertyData.address = updatedProperty.address.trim();
    }
    
    if (updatedProperty.city) {
        if ( !updatedProperty.city ||
            !validators.isValidString(updatedProperty.city) ||
            updatedProperty.city.trim().length === 0)
            {errorObject.error= "Invalid city input";
            throw errorObject}
        
        updatedPropertyData.city = updatedProperty.city.trim();
    }
    
    if (updatedProperty.state) {
        if (!updatedProperty.state ||
            !validators.isValidString(updatedProperty.state) ||
            updatedProperty.state.trim().length === 0)
                {errorObject.error= "Invalid state input";
                throw errorObject}
    
        updatedPropertyData.state = updatedProperty.state.trim();
    }

    if (updatedProperty.zipcode) {
        if (
            !updatedProperty.zipcode || 
            !validators.isValidString(updatedProperty.zipcode) || 
            !validators.isValidZipcode(updatedProperty.zipcode) || 
            updatedProperty.zipcode.trim().length === 0)
                {errorObject.error= "Invalid zipcode input";
                throw errorObject}
    
        updatedPropertyData.zipcode = updatedProperty.zipcode.trim();
    }
   
    if (updatedProperty.longitude) { 
        if ( !updatedProperty.longitude || 
            !validators.isValidString(updatedProperty.longitude) || 
            !validators.isValidLongitude(updatedProperty.longitude) || 
            updatedProperty.longitude.trim().length === 0 ) 
                {errorObject.error= "Invalid longitude input";
                throw errorObject} 
        
        updatedPropertyData.longitude = updatedProperty.longitude.trim(); 
    
    } 
        
    if (updatedProperty.latitude) { 
        if ( !updatedProperty.latitude || 
            !validators.isValidString(updatedProperty.latitude) || 
            !validators.isValidLatitude(updatedProperty.latitude) || 
            updatedProperty.latitude.trim().length === 0 ) 
                {errorObject.error= "Invalid latitude input"; 
                throw errorObject}
        
        updatedPropertyData.latitude = updatedProperty.latitude.trim(); 
    
    } 
        
    if (updatedProperty.propertyCategory) { 
        if ( !updatedProperty.propertyCategory || 
            !validators.isValidString(updatedProperty.propertyCategory) || 
            updatedProperty.propertyCategory.trim().length === 0 || 
            !validators.isValidPropertyCategory(updatedProperty.propertyCategory) ) 
                {errorObject.error= "Invalid propertyCategory input"; 
                throw errorObject}
        
        updatedPropertyData.propertyCategory = updatedProperty.propertyCategory.trim(); 
    
    } 
    
    if (updatedProperty.bedrooms) { 
        if ( !updatedProperty.bedrooms || 
            !validators.isValidString(updatedProperty.bedrooms) || 
            updatedProperty.bedrooms.trim().length === 0 || 
            isNaN(parseFloat(updatedProperty.bedrooms)) ) 
                {errorObject.error= "Invalid bedrooms input"; 
                throw errorObject}
                
        updatedPropertyData.bedrooms = updatedProperty.bedrooms.trim(); 
    
    } 
    
    if (updatedProperty.bathrooms) { 
        if ( !updatedProperty.bathrooms || 
            !validators.isValidString(updatedProperty.bathrooms) || 
            updatedProperty.bathrooms.trim().length === 0 || 
            isNaN(parseFloat(updatedProperty.bathrooms)) ) 
                {errorObject.error= "Invalid bathrooms input";
                throw errorObject} 
                
        updatedPropertyData.bathrooms = updatedProperty.bathrooms.trim(); }


    //Update user with object
    const updateResponse = await propertyCollection.updateOne(
        { propertyId: propertyId },
         { $set: updatedPropertyData }
    );
    
    //Validation (cont.)
    if (!updateResponse.acknowledged || updateResponse.modifiedCount === 0)
    {errorObject.error= "Error occurred while updating property";
    throw errorObject;}
    
    //Return
    return { propertyUpdated: true };
    
};

//Function: removeProperty
export const removeProperty = async (propertyId) => {
    const errorObject = {
        status: 400,
        };
    //Validation
    if (!propertyId || !validators.isValidUuid(propertyId)) {errorObject.error= "Invalid property ID input";
        throw errorObject;
    }
    
    //Retreive Property Collection
    const propertyCollection = await properties();
    
    //Delete Property
    const deletionInfo = await propertyCollection.deleteOne({ propertyId: propertyId });
    
    //Validation (cont.)
    if (deletionInfo.deletedCount === 0) {
    errorObject.error= `Error occurred while deleting user with ID ${propertyId}`;
    throw errorObject
    }
    
    //Return
    return { propertyDeleted: true };

};

//Function: addPropertyReview
export const addPropertyReview = async (propertyId, reviewData, userId) => {
    const errorObject = {
        status: 400,
        };
    //Validation
        if (!reviewData || Object.keys(reviewData).length === 0)
            {errorObject.error= "Invalid Review: Review data is required.";
        throw errorObject}
    
    //Create Review Object
    const updatedReviewData = {
        userId: null,
        reviewId: uuid(),
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
        errorObject.error="Invalid user ID input";
        throw errorObject
    } else {
        updatedReviewData.userId = userId;
    }
    
    const validRatings = [1, 2, 3, 4, 5];
    
    if (
        !reviewData.locationDesirabilityRating ||
        typeof reviewData.locationDesirabilityRating !== "number" ||
        !validRatings.includes(reviewData.locationDesirabilityRating)
    ) {
        errorObject.error="Invalid locationDesirabilityRating input";
        throw errorObject
    } else {
        updatedReviewData.locationDesirabilityRating = reviewData.locationDesirabilityRating;
    }
    
    if (
        !reviewData.ownerResponsivenessRating ||
        typeof reviewData.ownerResponsivenessRating !== "number" ||
        !validRatings.includes(reviewData.ownerResponsivenessRating)
    ) {
        errorObject.error="Invalid ownerResponsivenessRating input";
        throw errorObject
    } else {
        updatedReviewData.ownerResponsivenessRating = reviewData.ownerResponsivenessRating;
    }
    
    if (
        !reviewData.propertyConditionRating ||
        typeof reviewData.propertyConditionRating !== "number" ||
        !validRatings.includes(reviewData.propertyConditionRating)
        ) {
        errorObject.error="Invalid propertyConditionRating input";
        throw errorObject

    } else {
        updatedReviewData.propertyConditionRating = reviewData.propertyConditionRating;
    }
    
    if (
        !reviewData.communityRating ||
        typeof reviewData.communityRating !== "number" ||
        !validRatings.includes(reviewData.communityRating)
        ) {
        errorObject.error="Invalid communityRating input";
        throw errorObject
    } else {
        updatedReviewData.communityRating = reviewData.communityRating;
    }
    
    if (
        !reviewData.amenitiesRating ||
        typeof reviewData.amenitiesRating !== "number" ||
        !validRatings.includes(reviewData.amenitiesRating)
    ) {
        errorObject.error="Invalid amenitiesRating input";
        throw errorObject
    } else {
        updatedReviewData.amenitiesRating = reviewData.amenitiesRating;
    }
    
    if (
        !reviewData.reviewText ||
        !validators.isValidString(reviewData.reviewText) ||
        reviewData.reviewText.trim().length === 0
    ) {
        errorObject.error="Invalid reviewText input";
        throw errorObject
    } else {
        updatedReviewData.reviewText = reviewData.reviewText;
    }
    
    //Update User with review id
    const userUpdateStatus = await usersfunctions.updateUser(
        userId,
        { reviewIds: updatedReviewData.reviewId }
    );
    
    if (!userUpdateStatus)
        {errorObject.error= "Failed to update user information with new property review.";
        throw errorObject}
    
    //ProperpertyCollection
    const propertyCollection = await properties();

    const propertyUpdateStatus = await propertyCollection.updateOne(
        { propertyId: propertyId }, 
        { $push: { reviews: updatedReviewData } } 
    );
    
    if (!propertyUpdateStatus)
        {errorObject.error= "Failed to update property informatino with new review.";
    throw errorObject}
    
    //To Do: Recalculate Property's average ratings
    validators.updatePropertyRating(propertyId);
    
    //Return
    return { reviewAdded: true };
 };

//Function: removePropertyReview
 export const removePropertyReview = async (propertyId, reviewId) => {
    const errorObject = {
        status: 400,
        };
    // Validations
    if (!propertyId || !validators.isValidUuid(propertyId))
        {errorObject.error= "Invalid property ID input";
    throw errorObject}

    if (!reviewId || !validators.isValidUuid(reviewId))
    {    errorObject.error= "Invalid review ID input";
    throw errorObject}

    // Retrieve Property
    const propertyCollection = await properties();
    const property = await propertyCollection.findOne({ propertyId });

    // Check if property exists
    if (!property) 
    {    errorObject.error= "Property not found";
    throw errorObject}

    // Try to pull the review from the property
    const updateInfo = await propertyCollection.updateOne(
        { propertyId },
        { $pull: { reviews: { reviewId } } }
    );

    // errorObject.error= Error if Failed
    if (!updateInfo.acknowledged || updateInfo.modifiedCount === 0)
    {    errorObject.error= "Failed to remove review from property.";
    throw errorObject}

    // Remove reviewId from user's object
    const userCollection = await users();
    
    const updateUserStatus = await userCollection.updateMany(
        {},
        { $pull: { reviewIds: reviewId } }
    );

    if (!updateUserStatus.acknowledged || updateUserStatus.modifiedCount === 0)
    {     errorObject.error= "Failed to update user information with removed review.";
    throw errorObject}

    // Return
    return { reviewRemoved: true };
};

// Function: addCommentReply, adds comment to property or reply to comment
export const addCommentReply = async (userId, propertyOrCommentId, commentText) => {
    const errorObject = {
        status: 400,
        };
    //Validations
        if (!userId || !validators.isValidUuid(userId))
        {    errorObject.error= 'Invalid user ID input';
        throw errorObject}
        
        if (!propertyOrCommentId || !validators.isValidUuid(propertyOrCommentId))
        {    errorObject.error= 'Invalid property ID input';
        throw errorObject}

        if(!commentText || typeof commentText !== 'string'){
            errorObject.error= 'Invalid comment provided. Comment needs to be a string.'
            throw errorObject
        }

    //Create Comment Object    
        const commentToAdd = {
            commentId: uuid(),
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

            } /*else {
                updateInfo = await propertyCollection.updateOne(
                    { 'comments.commentId': propertyOrCommentId },
                    { $push: { 'comments.$.replies': commentToAdd } }
                );
            }*/

    //errorObject.error= Error if Failed 
        if (!updateInfo.acknowledged || updateInfo.modifiedCount === 0)
        {        errorObject.error= 'Failed to add comment or reply.';
        throw errorObject}

    //Update User with comment id

        const userCollection = await users();

        const userUpdateStatus = await userCollection.updateOne(
            {userId: userId},
            { $push: {commentsIds: commentToAdd.commentId}}
        );

        if (!userUpdateStatus)
        {    errorObject.error= 'Failed to update user information with new review.';
        throw errorObject}

    //Return
        return { commentOrReplyAdded: true };
        
};


// Function: removeCommentReply, removes comment from property or reply from comment
export const removeCommentReply = async (userId, propertyOrCommentId) => {
    const errorObject = {
        status: 400,
        };
    //Validations    
        if (!userId || !validators.isValidUuid(userId))
        {    errorObject.error= 'Invalid user ID input';
        throw errorObject}
    
        if (!propertyOrCommentId || !validators.isValidUuid(propertyOrCommentId))
        {    errorObject.error= 'Invalid property ID input';   
        throw errorObject}

    //Pull property collection
        const propertyCollection = await properties();

    //Try to pull comment from property
    let updateInfo; 
    updateInfo = await propertyCollection.updateOne(
        { 'comments.commentId': propertyOrCommentId },
        { $pull: { comments: { commentId: propertyOrCommentId } } }
    );

    /* //If failed, try to pull reply
    if (!updateInfo.acknowledged || updateInfo.modifiedCount === 0) {
        updateInfo = await propertyCollection.updateOne(
            { 'comments.replies.commentId': propertyOrCommentId },
            { $pull: { 'comments.$.replies': { commentId: propertyOrCommentId } } }
        );
    }*/

    //errorObject.error= Error if Failed 
        if (!updateInfo.acknowledged || updateInfo.modifiedCount === 0)
        {    errorObject.error= 'Failed to remove comment.';
        throw errorObject}

    //Remove commentId from user's object
        const userCollection = await users();

        const userUpdateStatus = await userCollection.updateOne(
            {'userId': userId},
            {$pull: {'commentsIds.commentId': propertyOrCommentId}}
        );

        if (!userUpdateStatus)
        {    errorObject.error= 'Failed to update user information with new comment ID.';
        throw errorObject}

    //Return
        return { commentOrReplyPulled: true };
        
};


//Function: addLikeDislike, adds like or dislike to comment or reply
export const addLikeDislike = async (propertyOrCommentId, likeOrDislike) => {
    const errorObject = {
        status: 400,
        };
    //Validations    
    if (!propertyOrCommentId || !validators.isValidUuid(propertyOrCommentId))
    {    errorObject.error= 'Invalid property ID input';   
    throw errorObject}

    //Validations    
    if (!likeOrDislike || typeof likeOrDislike !== 'string' || (likeOrDislike !== 'like' && likeOrDislike !== 'dislike'))
    {    errorObject.error= 'Invalid indication if like or dislike should be added';   
    throw errorObject}
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

    /*
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

    }*/

    //errorObject.error= Error if Failed 
    if (!updateInfo.acknowledged || updateInfo.modifiedCount === 0)
    {    errorObject.error= 'Failed to increment likes on comment.';
    throw errorObject}
//Return
    return { likeAdded: true };
    
};


//Function: removeLikeDislike, removes like or dislike to comment or reply
export const removeLikeDislike = async (propertyOrCommentId, likeOrDislike) => {
    const errorObject = {
        status: 400,
        };
    //Validations    
        if (!propertyOrCommentId || !validators.isValidUuid(propertyOrCommentId))
             {errorObject.error= 'Invalid property ID input';   
        throw errorObject}
    
    //Validations    
        if (!likeOrDislike || typeof likeOrDislike !== 'string' || (likeOrDislike !== 'like' && likeOrDislike !== 'dislike'))
             {errorObject.error= 'Invalid indication if like or dislike should be added';   
        throw errorObject}
    
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
    
    /*
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
    
        }*/
    
    // errorObject.error= Error if Failed 
        if (!updateInfo.acknowledged || updateInfo.modifiedCount === 0)
             {errorObject.error= 'Failed to decrement likes on comment or reply.';
            throw errorObject}
    
    //Return
        return { likeRemoved: true };
        
    };
    
// Function: addPropertyReport (report created by user on property)
export const addPropertyReport = async (userId, propertyId, reportData, reportReason) => {
    const errorObject = {
        status: 400,
        };
    if (!userId || !validators.isValidUuid(userId)) {
        {errorObject.error= new Error("Invalid user ID input");
        throw errorObject;}
    }

    const property = await getPropertyById(propertyId);

    if (!property)
        {errorObject.error= new Error("Invalid property ID or property does not exist");
    throw errorObject}

    if (!reportData || Object.keys(reportData).length === 0)
        {errorObject.error= new Error("Invalid Report: Report content is required.");
    throw errorObject}

    if (!reportReason || typeof reportReason !== 'string' || reportReason.trim().length === 0)
        errorObject.error= new Error("Invalid Report Reason: Report reason is required and must be a non-empty string.");

    const updatedReportData = {
        report_id: uuid(),
        userId: userId, 
        propertyId: propertyId, 
        report_reason: reportReason, 
        report_description: reportData, 
        reported_at: new Date().toISOString(), 
        status: "pending", 
        resolved_at: null
    };

    property.reports.push(updatedReportData);

    const propertyReportUpdateStatus = await updateProperty(propertyId, {
        $push: { reports: updatedReportData },
    });

    if (!propertyReportUpdateStatus)
        {errorObject.error= new Error("Failed to update property information with the report.");
    throw errorObject}

    return { reportAdded: true };
};

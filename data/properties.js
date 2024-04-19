//Imports
import { users } from '../config/mongoCollections.js';
import { properties } from '../config/mongoCollections.js';

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
    

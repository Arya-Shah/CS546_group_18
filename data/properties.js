// Function: addComment, adds comment to property or reply to comment
    export const addCommentOrReply = async (userId, propertyOrCommentId, commentText) => {
        
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
                        { $push: { replies: commentToAdd } }
                    );
                }

        //Throw Error if Failed 
            if (!updateInfo.acknowledged || updateInfo.modifiedCount === 0)
                    throw 'Failed to add comment or reply.';

        //Return
            return { commentOrReplyAdded: true };
            
    };


// Function: removeCommentOrReply, adds comment to property
    export const removeCommentOrReply = async (propertyOrCommentId) => {
        
        //Validations    
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

        //Return
            return { commentOrReplyPulled: true };
            
    };


//Function: addLike, adds like to comment or reply
    export const addlikeOrDislike = async (propertyOrCommentId, likeOrDislike) => {
        
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

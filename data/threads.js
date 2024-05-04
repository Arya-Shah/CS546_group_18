//Imports
import { users, properties, threads } from '../config/mongoCollections.js';
import { v4 as uuid } from "uuid";
import validators from "../helper.js";

//Function: getAllThreads
export const getAllThreads = async () => {

    const threadCollection = await threads();
    return await threadCollection.find({}).toArray();

};

// Function: getThreadById
export const getThreadById = async (id) => {
    
    // Validation
    if (!id || !validators.isValidUuid(id)) throw "Invalid ID input";

    //Thread Collection and Thread
    const threadCollection = await threads();
    const thread = await threadCollection.findOne({ threadId: id });

    // Validation (cont.)
    if (!thread) throw "Thread not found";

    // Return
    return thread;
};

// Function: getThreadByCategory
export const getThreadByCategory = async (category) => {
   
    // Validation
    if (!category || !validators.isValidString(category) || category.trim().length === 0) {
        throw "Invalid category input.";
    }
    category = category.trim().toLowerCase();

    //Thread Collection
    const threadCollection = await threads();


    // Regular expression to make search case insensitive and global
    const regex = new RegExp(category, 'gi');

    // Find threads matching the category
    const threadsMatchingCategory = await threadCollection.find({ category: regex }).toArray();

    //Array of threads
    return threadsMatchingCategory;
};

// Function: addThread
export const addThread = async (
    userId,
    title,
    threadText,
    category
  ) => {
    
      // Validation
      if (!userId || !validators.isValidString(userId))
        throw "Invalid userId input";
  
      if (!title || !validators.isValidString(title) || title.trim().length === 0)
        throw "Invalid title input";
  
      if (!threadText || !validators.isValidString(threadText) || threadText.trim().length === 0)
        throw "Invalid threadText input";
  
      if (!category || !validators.isValidString(category) || !validators.isValidThreadCategory(category) || category.trim().length === 0)
        throw "Invalid category input";
  
      // Thread Collection
      const threadCollection = await threads();
  
      // New Thread Object
      let newThread = {
          threadId: uuid(),
          userId: userId,
          title: title,
          threadText: threadText,
          category: category,
          createdDate: new Date(),
          lastUpdated: new Date(),
          likes: 0,
          dislikes: 0,
          comments: [],
          reports: []
      };
      
      // Insert new thread object into collection
      const insertInfo = await threadCollection.insertOne(newThread);
  
      // Validation (cont.)
      if (!insertInfo.acknowledged || !insertInfo.insertedId)
        throw "Could not add new thread";

      // Update User with thread id
        const userCollection = await users();

        const userUpdateStatus = await userCollection.updateOne(
            { userId: userId },
            { $push: { threadsIds: newThread.threadId } } 
        );

        if (!userUpdateStatus)
            throw 'Failed to update user information with new thread.';
    
      // Return
      return { threadInserted: true, threadId: newThread.threadId };
  };

// Function: updateThread
export const updateThread = async (threadId, updatedThread) => {
    
    // Validation
    if (!threadId || !validators.isValidUuid(threadId)) 
        throw "Invalid thread ID input";

    if (!updatedThread || typeof updatedThread !== "object" || Array.isArray(updatedThread))
        throw "Invalid updatedThread input";

    //Thread collection
    const threadCollection = await threads();

    // Create object for updated thread information
    const updatedThreadData = {};

    // Validate and add updated thread information to object
    if (updatedThread.title) {
        if (!updatedThread.title || !validators.isValidString(updatedThread.title) || updatedThread.title.trim().length === 0)
            throw "Invalid title input";
        
        updatedThreadData.title = updatedThread.title.trim();
    }

    if (updatedThread.threadText) {
        if (!updatedThread.threadText || !validators.isValidString(updatedThread.threadText) || updatedThread.threadText.trim().length === 0)
            throw "Invalid threadText input";
        
        updatedThreadData.threadText = updatedThread.threadText.trim();
    }

    if (updatedThread.category) {
        if (!updatedThread.category || !validators.isValidString(updatedThread.category) || !validators.isValidThreadCategory(updatedThread.category) || updatedThread.category.trim().length === 0)
            throw "Invalid category input";
        
        updatedThreadData.category = updatedThread.category.trim();
    }

    // Set lastUpdated to current date
    updatedThreadData.lastUpdated = new Date();

    // Update thread with object
    const updateResponse = await threadCollection.updateOne(
        { threadId: threadId },
        { $set: updatedThreadData }
    );

    // Validation (cont.)
    if (!updateResponse.acknowledged || updateResponse.modifiedCount === 0)
        throw "Error occurred while updating thread";

    // Return
    return { threadUpdated: true };
};

// Function: removeThread
export const removeThread = async (userId, threadId) => {
    
    // Validation
    if (!threadId || !validators.isValidUuid(threadId)) throw "Invalid thread ID input";
    if (!userId || !validators.isValidString(userId)) throw "Invalid userId input";
    
    // Retrieve thread collection
    const threadCollection = await threads();
    
    // Delete thread
    const deletionInfo = await threadCollection.deleteOne({ threadId: threadId });
    
    // Validation (cont.)
    if (deletionInfo.deletedCount === 0) {
        throw `Error occurred while deleting thread with ID ${threadId}`;
    }

    // Update User to remove thread id
    const userCollection = await users();

    const userUpdateStatus = await userCollection.updateOne(
        { userId: userId },
        { $pull: { threadsIds: threadId } } 
    );

    if (!userUpdateStatus)
        throw 'Failed to update user information after removing the thread.';
    
    // Return
    return { threadRemoved: true };
};


// Function: addCommentReply, adds comment to property or reply to comment
export const addCommentReply = async (userId, threadOrCommentId, commentText) => {
        
    //Validations
        if (!userId || !validators.isValidUuid(userId))
            throw 'Invalid user ID input';
        
        if (!threadOrCommentId || !validators.isValidUuid(threadOrCommentId))
            throw 'Invalid thread or comment ID input';

        if(!commentText || typeof commentText !== 'string'){
            throw 'Invalid comment provided. Comment needs to be a string.'
        }

    //Create Comment Object    
        const commentToAdd = {
            commentId: uuid(),
            userId : userId,
            commentText : commentText,
            dateCreated : new Date(),
            likes : 0,
            dislikes : 0,
            replies : [],
            reports : []
        };

    //Pull thread collection
        const threadCollection = await threads();
        
        const thread = await threadCollection.findOne({ threadId: threadOrCommentId });
    
        let updateInfo;
    
        //If a property id, add a commment; Else: Add reply
            if (thread){  
                updateInfo = await threadCollection.updateOne(
                    { threadId: threadOrCommentId },
                    { $push: { comments: commentToAdd } }
                );

            } else {
                updateInfo = await threadCollection.updateOne(
                    { 'comments.commentId': threadOrCommentId },
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
export const removeCommentReply = async (userId, threadOrCommentId) => {
    
    //Validations    
        if (!userId || !validators.isValidUuid(userId))
            throw 'Invalid user ID input';
    
        if (!threadOrCommentId || !validators.isValidUuid(threadOrCommentId))
            throw 'Invalid threadOrCommentId ID input';   

    //Pull property collection
        const threadCollection = await threads();
    
    //Try to pull comment from property
    let updateInfo = await threadCollection.updateOne(
        { 'comments.commentId': threadOrCommentId },
        { $pull: { comments: { commentId: threadOrCommentId } } }
    );

    //If failed, try to pull reply
    if (!updateInfo.acknowledged || updateInfo.modifiedCount === 0) {
        updateInfo = await threadCollection.updateOne(
            { 'comments.replies.commentId': threadOrCommentId },
            { $pull: { 'comments.$.replies': { commentId: threadOrCommentId } } }
        );
    }

    //Throw Error if Failed 
        if (!updateInfo.acknowledged || updateInfo.modifiedCount === 0)
            throw 'Failed to remove comment or reply.';

    //Remove commentId from user's object
        const userCollection = await users();

        const userUpdateStatus = await userCollection.updateOne(
            {'userId': userId},
            {$pull: {'commentsIds.commentId': threadOrCommentId}}
        );

        if (!userUpdateStatus)
            throw 'Failed to update user information with new review.';

    //Return
        return { commentOrReplyPulled: true };
        
};

//Function: addLikeDislike, adds like or dislike to comment or reply
export const addLikeDislike = async (threadOrCommentId, likeOrDislike) => {
    
    //Validations    
    if (!threadOrCommentId || !validators.isValidUuid(threadOrCommentId))
        throw 'Invalid threadOrCommentId input';   

    //Validations    
    if (!likeOrDislike || typeof likeOrDislike !== 'string' || (likeOrDislike !== 'like' && likeOrDislike !== 'dislike'))
        throw 'Invalid indicidation if like or dislike should be added';   

    //Pull property collection
    const threadCollection = await threads();

    //Try to add like or dislike to comment from property
    
    let updateInfo;    

    if(likeOrDislike === 'like'){
        
        updateInfo = await threadCollection.updateOne(
            { 'comments.commentId': threadOrCommentId },
            { $inc: { 'comments.$.likes': 1 } }
        );

    } else {
        
        updateInfo = await threadCollection.updateOne(
            { 'comments.commentId': threadOrCommentId },
            { $inc: { 'comments.$.dislikes': 1 } }
        );

    };

    //If failed, try to add like or dislike to reply
    if (!updateInfo.acknowledged || updateInfo.modifiedCount === 0){
        
        if(likeOrDislike === 'like'){
            
            updateInfo = await threadCollection.updateOne(
                { 'replies.commentId': threadOrCommentId },
                { $inc: { 'replies.$.likes': 1 } }
            );
        
        } else{ 
            
            updateInfo = await threadCollection.updateOne(
                { 'replies.commentId': threadOrCommentId },
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
export const removeLikeDislike = async (threadOrCommentId, likeOrDislike) => {
    
    //Validations    
        if (!threadOrCommentId || !validators.isValidUuid(threadOrCommentId))
            throw 'Invalid property ID input';   
    
    //Validations    
        if (!likeOrDislike || typeof likeOrDislike !== 'string' || (likeOrDislike !== 'like' && likeOrDislike !== 'dislike'))
            throw 'Invalid indication if like or dislike should be added';   
    
    //Pull property collection
        const threadCollection = await threads();
    
    //Try to add like or dislike to comment from property
        
        let updateInfo;    
    
        if(likeOrDislike === 'like'){
            
            updateInfo = await threadCollection.updateOne(
                { 'comments.commentId': threadOrCommentId },
                { $inc: { 'comments.$.likes': -1 } }
            );
    
        } else {
            
            updateInfo = await threadCollection.updateOne(
                { 'comments.commentId': threadOrCommentId },
                { $inc: { 'comments.$.dislikes': -1 } }
            );
    
        };
    
    //If failed, try to add like or dislike to reply
        if (!updateInfo.acknowledged || updateInfo.modifiedCount === 0){
            
            if(likeOrDislike === 'like'){
                
                updateInfo = await threadCollection.updateOne(
                    { 'replies.commentId': threadOrCommentId },
                    { $inc: { 'replies.$.likes': -1 } }
                );
            
            } else{ 
                
                updateInfo = await threadCollection.updateOne(
                    { 'replies.commentId': threadOrCommentId },
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

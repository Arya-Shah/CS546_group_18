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
export const getThreadById = async (id,flag = false) => {
    const errorObject = {
        status: 400,
        };
    // Validation
    if (!id || !validators.isValidUuid(id)) {
        errorObject.error = "Invalid ID input"
        throw errorObject }

    //Thread Collection and Thread
    const threadCollection = await threads();
    const thread = await threadCollection.findOne({ threadId: id });

    // Validation (cont.)
if (!thread) {
    if(flag){
        return false;
    }else{
    errorObject.error = "Thread not found"
    throw errorObject;
    }
}

    // Return
    return thread;
};

// Function: getThreadByCategory
export const getThreadByCategory = async (category) => {
   
    const errorObject = {
        status: 400,
        };
    // Validation
    if (!category || !validators.isValidString(category) || category.trim().length === 0) {
        errorObject.error = "Invalid category input.";
        throw errorObject;
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
    category,
    userRealName
  ) => {
    
      // Validation
      const errorObject = {
        status: 400,
        };
      if (!userId || !validators.isValidString(userId))
{
            errorObject.error = "Invalid userId input";
            throw errorObject;
}  
      if (!title || !validators.isValidString(title) || title.trim().length === 0)
{        errorObject.error = "Invalid title input";
      throw errorObject;

    }  
      if (!threadText || !validators.isValidString(threadText) || threadText.trim().length === 0)
{        errorObject.error = "Invalid threadText input";
    throw errorObject;

    }  
      if (!category || !validators.isValidString(category) || !validators.isValidThreadCategory(category) || category.trim().length === 0)
{
            errorObject.error = "Invalid category input";
            throw errorObject;
        }  
      // Thread Collection
      const threadCollection = await threads();
      let createdDate = new Date();
      let lastUpdated = new Date();

      // Function to format date
        function formatDate(dateInput) {
            const date = new Date(dateInput);
            const options = { year: 'numeric', month: 'short', day: 'numeric' };
            return date.toLocaleDateString(undefined, options);
        }

        //FormattedDates
        let formattedCreatedDate = formatDate(createdDate);
        let formattedLastUpdated = formatDate(lastUpdated);
  
      // New Thread Object
      let newThread = {
          threadId: uuid(),
          userRealName: userRealName,
          userId: userId,
          title: title,
          threadText: threadText,
          category: category,
          createdDate: createdDate,
          lastUpdated: lastUpdated,
          formattedCreatedDate,
          formattedLastUpdated,
          likes: 0,
          dislikes: 0,
          comments: [],
          reports: [],
          isVoted:[]
      };
      
      // Insert new thread object into collection
      const insertInfo = await threadCollection.insertOne(newThread);
  
      // Validation (cont.)
      if (!insertInfo.acknowledged || !insertInfo.insertedId)
        {
            errorObject.error= "Could not add new thread";
            throw errorObject;
        }

      // Update User with thread id
        const userCollection = await users();

        const userUpdateStatus = await userCollection.updateOne(
            { userId: userId },
            { $push: { threadsIds: newThread.threadId } } 
        );

        if (!userUpdateStatus)
{            errorObject.error= 'Failed to update user information with new thread.';
            throw errorObject
    }    
      // Return
      return { threadInserted: true, threadId: newThread.threadId };
  };

// Function: updateThread
export const updateThread = async (threadId, updatedThread) => {
    
    const errorObject = {
        status: 400,
        };
    // Validation
    if (!threadId || !validators.isValidUuid(threadId)) 
        {errorObject.error =  "Invalid thread ID input";
        throw errorObject}

    if (!updatedThread || typeof updatedThread !== "object" || Array.isArray(updatedThread))
    {errorObject.error= "Invalid updatedThread input";
    throw errorObject}

    //Thread collection
    const threadCollection = await threads();

    // Create object for updated thread information
    const updatedThreadData = {};

    // Validate and add updated thread information to object
    if (updatedThread.title) {
        if (!updatedThread.title || !validators.isValidString(updatedThread.title) || updatedThread.title.trim().length === 0)
            {errorObject.error= "Invalid title input";
            throw errorObject}
        updatedThreadData.title = updatedThread.title.trim();
    }

    if (updatedThread.threadText) {
        if (!updatedThread.threadText || !validators.isValidString(updatedThread.threadText) || updatedThread.threadText.trim().length === 0)
            {errorObject.error= "Invalid threadText input";
        throw errorObject}        
        updatedThreadData.threadText = updatedThread.threadText.trim();
    }

    if (updatedThread.category) {
        if (!updatedThread.category || !validators.isValidString(updatedThread.category) || !validators.isValidThreadCategory(updatedThread.category) || updatedThread.category.trim().length === 0)
            {errorObject.error= "Invalid category input";
        throw errorObject}        
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
    {errorObject.error= "Error occurred while updating thread";
    throw errorObject}

    // Return
    return { threadUpdated: true };
};

// Function: removeThread
export const removeThread = async (userId, threadId) => {
    
    const errorObject = {
        status: 400,
        };
    // Validation
    if (!threadId || !validators.isValidUuid(threadId)) {
        errorObject.error= "Invalid thread ID input";
        throw errorObject
    }
    if (!userId || !validators.isValidString(userId)) {
        errorObject.error= "Invalid userId input";
    throw errorObject
    }
    
    // Retrieve thread collection
    const threadCollection = await threads();
    
    // Delete thread
    const deletionInfo = await threadCollection.deleteOne({ threadId: threadId });
    
    // Validation (cont.)
    if (deletionInfo.deletedCount === 0) {
        errorObject.error= `Error occurred while deleting thread with ID ${threadId}`;
        throw errorObject
    }

    // Update User to remove thread id
    const userCollection = await users();

    const userUpdateStatus = await userCollection.updateOne(
        { userId: userId },
        { $pull: { threadsIds: threadId } } 
    );

    if (!userUpdateStatus)
        {errorObject.error= 'Failed to update user information after removing the thread.';
        throw errorObject}
    
    // Return
    return { threadRemoved: true };
};


// Function: addCommentReply, adds comment to property or reply to comment
export const addCommentReply = async (userId, threadOrCommentId, commentText, userRealName) => {
        
    const errorObject = {
        status: 400,
        };
    //Validations
        if (!userId || !validators.isValidUuid(userId))
            {errorObject.error= 'Invalid user ID input';
            throw errorObject}
        
        if (!threadOrCommentId || !validators.isValidUuid(threadOrCommentId))
            {errorObject.error= 'Invalid thread or comment ID input';
        throw errorObject}

        if(!commentText || typeof commentText !== 'string'){
            errorObject.error= 'Invalid comment provided. Comment needs to be a string.'
            throw errorObject
        }

        //Create Dates
        let createdDate = new Date();

        // Function to format date
            function formatDate(dateInput) {
                const date = new Date(dateInput);
                const options = { year: 'numeric', month: 'short', day: 'numeric' };
                return date.toLocaleDateString(undefined, options);
            }

        //FormattedDates
        let formattedCreatedDate = formatDate(createdDate);

    //Create Comment Object    
        const commentToAdd = {
            commentId: uuid(),
            userRealName: userRealName,
            userId : userId,
            commentText : commentText,
            dateCreated : createdDate,
            formattedCreatedDate,
            likes : 0,
            dislikes : 0,
            replies : [],
            reports : [],
            isVoted:[]
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

            } /*else {
                updateInfo = await threadCollection.updateOne(
                    { 'comments.commentId': threadOrCommentId },
                    { $push: { 'comments.$.replies': commentToAdd } }
                );
            }*/

    //Throw Error if Failed 
        if (!updateInfo.acknowledged || updateInfo.modifiedCount === 0)
            {errorObject.error= 'Failed to add comment or reply.';
            throw errorObject
}
    //Update User with comment id

        const userCollection = await users();

        const userUpdateStatus = await userCollection.updateOne(
            {userId: userId},
            { $push: {commentsIds: commentToAdd.commentId}}
        );

        if (!userUpdateStatus)
            {errorObject.error= 'Failed to update user information with new review.';
            throw errorObject}

    //Return
        return { commentOrReplyAdded: true };
        
};

// Function: removeCommentReply, removes comment from property or reply from comment
export const removeCommentReply = async (userId, threadOrCommentId) => {
    
    const errorObject = {
        status: 400,
        };
    //Validations    
        if (!userId || !validators.isValidUuid(userId))
            {errorObject.error= 'Invalid user ID input';
            throw errorObject}
    
        if (!threadOrCommentId || !validators.isValidUuid(threadOrCommentId))
            {errorObject.error= 'Invalid threadOrCommentId ID input';   
            throw errorObject}

    //Pull property collection
        const threadCollection = await threads();
    
    //Try to pull comment from property
    let updateInfo = await threadCollection.updateOne(
        { 'comments.commentId': threadOrCommentId },
        { $pull: { comments: { commentId: threadOrCommentId } } }
    );
    /*
    //If failed, try to pull reply
    if (!updateInfo.acknowledged || updateInfo.modifiedCount === 0) {
        updateInfo = await threadCollection.updateOne(
            { 'comments.replies.commentId': threadOrCommentId },
            { $pull: { 'comments.$.replies': { commentId: threadOrCommentId } } }
        );
    }*/

    //Throw Error if Failed 
        if (!updateInfo.acknowledged || updateInfo.modifiedCount === 0)
            {errorObject.error= 'Failed to remove comment.';
        throw errorObject
}
    //Remove commentId from user's object
        const userCollection = await users();

        const userUpdateStatus = await userCollection.updateOne(
            {'userId': userId},
            {$pull: {'commentsIds.commentId': threadOrCommentId}}
        );

        if (!userUpdateStatus)
            {errorObject.error= 'Failed to update user information with new review.';
            throw errorObject}

    //Return
        return { commentOrReplyPulled: true };
        
};

//Function: addLikeDislike, adds like or dislike to comment or reply
export const addLikeDislike = async (threadOrCommentId, likeOrDislike, userId) => {
    
    const errorObject = {
        status: 400,
        };
    //Validations    
    if (!threadOrCommentId || !validators.isValidUuid(threadOrCommentId))
    {errorObject.error=   'Invalid threadOrCommentId input';   
    throw errorObject}

    //Validations    
    if (!likeOrDislike || typeof likeOrDislike !== 'string' || (likeOrDislike !== 'like' && likeOrDislike !== 'dislike'))
        {errorObject.error= 'Invalid indicidation if like or dislike should be added';
        throw errorObject}

    //Pull property collection
    const threadCollection = await threads();

    //Try to add like or dislike to comment from thread
    
    let updateInfo;    
    const threadData = await getThreadById(threadOrCommentId,true);
    if(likeOrDislike === 'like'){
        let updateData = [];
        if(threadData){updateData = threadData.isVoted;
        updateData.push(userId);
        updateInfo = await threadCollection.updateOne(
            { 'threadId': threadOrCommentId },
            {$set:{isVoted:updateData},
             $inc: { 'likes': 1 } }
        
        );
    }

    } else {
        let updateData = [];
       if(threadData){ updateData = threadData.isVoted;
        updateData.push(userId);
        updateInfo = await threadCollection.updateOne(
            { 'threadId': threadOrCommentId },
            {$set:{isVoted:updateData},
            $inc: { 'dislikes': 1 } }
        );
}
    };
    
    //If failed, try to add like or dislike to reply
    if (!threadData){
        if(likeOrDislike === 'like'){
            let updateData = [];
            const threadData = await threadCollection.findOne({ 'comments.commentId': threadOrCommentId });
            const comment = threadData.comments.find(comment => comment.commentId === threadOrCommentId);
            updateData = comment.isVoted;
            updateData.push(userId);
            updateInfo = await threadCollection.updateOne(
                { 'comments.commentId': threadOrCommentId },
                { $inc: { 'comments.$.likes': 1 }, $set:{'comments.$.isVoted':updateData} }
            );
        
        } else{ 
            let updateData = [];
            const threadData = await threadCollection.findOne({ 'comments.commentId': threadOrCommentId });
            const comment = threadData.comments.find(comment => comment.commentId === threadOrCommentId);
            updateData = comment.isVoted;
            updateData.push(userId);
            updateInfo = await threadCollection.updateOne(
                { 'comments.commentId': threadOrCommentId },
                { $inc: { 'comments.$.dislikes': 1 }, $set:{'comments.$.isVoted':updateData}}
            );
        }

    }

    //Throw Error if Failed 
    if (!updateInfo.acknowledged || updateInfo.modifiedCount === 0)
        {errorObject.error= 'Failed to increment likes on comment.';
    throw errorObject}

//Return
    return { likeAdded: true };
    
};


//Function: removeLikeDislike, removes like or dislike to comment or reply
export const removeLikeDislike = async (threadOrCommentId, likeOrDislike) => {
    
    const errorObject = {
        status: 400,
        };
    //Validations    
        if (!threadOrCommentId || !validators.isValidUuid(threadOrCommentId))
            {errorObject.error= 'Invalid property ID input';
        throw errorObject }  
    
    //Validations    
        if (!likeOrDislike || typeof likeOrDislike !== 'string' || (likeOrDislike !== 'like' && likeOrDislike !== 'dislike'))
{            errorObject.error= 'Invalid indication if like or dislike should be added';   
        throw errorObject   
    }    
    //Pull property collection
        const threadCollection = await threads();
    
    //Try to add like or dislike to comment from property
        
        let updateInfo;    
    
        if(likeOrDislike === 'like'){
            
            updateInfo = await threadCollection.updateOne(
                { 'threadId': threadOrCommentId },
                { $inc: { 'likes': 1 } }
            );
    
        } else {
            
            updateInfo = await threadCollection.updateOne(
                { 'threadId': threadOrCommentId },
                { $inc: { 'dislikes': 1 } }
            );
    
        };
    /*
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
    
        }*/
    
    //Error if Failed 
        if (!updateInfo.acknowledged || updateInfo.modifiedCount === 0)
{            errorObject.error= 'Failed to decrement likes on comment.';
        throw errorObject   

}    
    //Return
        return { likeRemoved: true };
        
    };

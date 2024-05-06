import express from 'express';
const router = express.Router();
import * as thread from '../data/threads.js';


//Upvote Thread
router.get('/thread_routes/upvote/:threadOrCommentId', async (req, res) => {
    try {
        const threadOrCommentId = req.params.threadOrCommentId;
        await thread.addLikeDislike(threadOrCommentId, 'like');
        res.redirect('back');
    } catch (error) {
        res.status(error.status || 500).json({ error: error.message });
    }
});


//Downvote Thread
router.get('/threads_routes/downvote/:threadOrCommentId', async (req, res) => {
    try {
        const threadOrCommentId = req.params.threadOrCommentId;
        await thread.addLikeDislike(threadOrCommentId, 'dislike');
        res.redirect('back');
    } catch (error) {
        res.status(error.status || 500).json({ error: error.message });
    }
});


//Add Thread
router.post('/addThread', async (req, res) => {
    try {
        
        const { title, content, category } = req.body;

        if (!title || !validators.isValidString(title)) {
            throw new Error("Invalid title input");
        }

        if (!content || !validators.isValidString(content)) {
            throw new Error("Invalid content input");
        }

        if (!category || !validators.isValidString(category) || !validators.isValidThreadCategory(category)) {
            throw new Error("Invalid category input");
        }

        try {
            const { threadInserted, threadId } = await thread.addThread(userId, title, content, category);

            if (!threadInserted) {
                return res.status(500).render('error', { error: 'Failed to add thread.', layout: 'main' });
            }

            res.redirect(`/thread/${threadId}`);

        } catch (error) {
            res.status(500).render('error', { error: 'Internal Server Error when trying to add thread.', layout: 'main' });
        }

        
    } catch (error) {
        res.render('addThreadForm', { error: error.message });
    }
});


//Delete Thread
router.post('/deleteThread/:threadId', async (req, res) => {
    
    try {

        const threadId = req.params.threadId;

        const userId = req.user.id;

        if (!threadId || !validators.isValidUuid(threadId)) {
            throw new Error("Invalid thread ID input");
        }

        const { threadRemoved } = await thread.removeThread(userId, threadId);

        if (!threadRemoved) {
            return res.status(500).json({ error: 'Failed to remove thread.' });
        }

        res.redirect('/');

    } catch (error) {
        res.status(error.status || 500).json({ error: error.message });
    }

});


//Thread Individual Page
router.route('/thread/:threadId')
.get(async (req, res) => {
    
    const threadId = req.params.threadId;

    if (!threadId || !validators.isValidUuid(threadId)) {
        return res.status(400).render('error', { error: 'Invalid thread ID format.', layout: 'main' });
    }

    try {
    
        // Assuming you have a function to get the thread by ID
        const thread = await threads.getThreadById(threadId);
    
        if (!thread) {
            return res.status(404).render('error', { error: 'Thread not found.', layout: 'main' });
        }

        res.render('threadIndividual', { thread, layout: 'main' });

    } catch (error) {

        res.status(500).render('error', { error: 'Internal Server Error.', layout: 'main' });

    }

});


//Add comment to thread
router.post('/threads_routes/addComment/:threadId', async (req, res) => {
    try {
        const { userId } = req.body;
        const { threadId } = req.params;
        const { comment } = req.body; 

        const result = await thread.addCommentReply(userId, threadId, comment);

        if (!result) {
            return res.status(500).json({ error: 'Failed to add comment to thread.' });
        }

        res.redirect(`/thread/${threadId}`);

    } catch (error) {
       
        res.status(500).render('error', { error: 'Internal Server Error when adding comment to thread.', layout: 'main' });
    }
});


// Remove Comment
router.post('/threads_routes/removeComment/:threadId/:commentId', async (req, res) => {
    try {
        const { userId } = req.body;
        const { threadId, commentId } = req.params;

        const result = await thread.removeCommentReply(userId, commentId);

        if (!result) {
            return res.status(500).json({ error: 'Failed to remove comment from thread.' });
        }

        res.redirect(`/thread/${threadId}`);

    } catch (error) {
        // Handle errors
        res.status(500).render('error', { error: 'Internal Server Error when removing comment from thread.', layout: 'main' });
    }
});
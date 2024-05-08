import express from 'express';
const router = express.Router();
import * as thread from '../data/threads.js';
import validators from "../helper.js";

router.get('/', async (req, res) => {
        try {
            
            const threads = await thread.getAllThreads();
            res.render('communityForum', { title:'Forums',threads:threads, layout: 'main' });
        
            } catch (e) {
            res.status(500).render('error', { title:'error',error: 'Internal Server Error.', layout: 'main' });
            }
            
        });

//Upvote Thread
router.get('/upvote/:threadOrCommentId', async (req, res) => {
    try {
        //console.log('in route');
        const threadOrCommentId = req.params.threadOrCommentId;
        //console.log(threadOrCommentId);
        await thread.addLikeDislike(threadOrCommentId, 'like');
        res.redirect('back');
    } catch (error) {
        res.status(error.status || 500).json({ error: error.message });
    }
});


//Downvote Thread
router.get('/downvote/:threadOrCommentId', async (req, res) => {
    try {
        const threadOrCommentId = req.params.threadOrCommentId;
        await thread.addLikeDislike(threadOrCommentId, 'dislike');
        res.redirect('back');
    } catch (error) {
        res.status(error.status || 500).json({ error: error.message });
    }
});


//Add Thread
router
.get('/addThread', async (req, res) => {
    try {
        
        res.render('addThread', { title:'Forums', layout: 'main' });
    
        } catch (e) {
        res.status(500).render('error', { title:'error',error: 'Internal Server Error.', layout: 'main' });
        }
        
    }).post('/addThread', async (req, res) => {
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
            const userId = req.session.user.userId;
            const userRealName = req.session.user.firstName + ' ' + req.session.user.lastName;
            const { threadInserted, threadId } = await thread.addThread(userId, title, content, category, userRealName);

            if (!threadInserted) {
                return res.status(500).render('error', { title:'error',error: 'Failed to add thread.', layout: 'main' });
            }

            res.redirect(`/thread/id/${threadId}`);

        } catch (e) {
           
            res.status(e.status?e.status:500).render('error', { title:'error',error: e.error?e.error:e, layout: 'main' });
        }

        
    } catch (error) {
        res.render('addThread', {title:'error', error: error.message });
    }
});


//Delete Thread
router.post('/delete/:threadId', async (req, res) => {
    
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
router.route('/id/:threadId')
.get(async (req, res) => {
    
    const threadId = req.params.threadId;

    if (!threadId || !validators.isValidUuid(threadId)) {
        return res.status(400).render('error', { title:'error',error: 'Invalid thread ID format.', layout: 'main' });
    }

    try {
    
        // Assuming you have a function to get the thread by ID
        const threadData = await thread.getThreadById(threadId);
    
        if (!threadData) {
            return res.status(404).render('error', {title:'error', error: 'Thread not found.', layout: 'main' });
        }

        res.render('threadIndividual', { title:'threads',threadData:threadData, layout: 'main', threadId: threadId});

    } catch (error) {
       
        res.status(500).render('error', { title:'error',error: 'Internal Server Error.', layout: 'main' });

    }

});


//Add comment to thread
router.post('/addComment/:threadId', async (req, res) => {
    try {
  
        let userId = req.session.user.userId;

        const { threadId } = req.params;
        const { comment } = req.body;

        const userRealName = req.session.user.firstName + ' ' + req.session.user.lastName;
   
        const result = await thread.addCommentReply(userId, threadId, comment, userRealName);

        if (!result) {
            return res.status(500).json({ error: 'Failed to add comment to thread.' });
        }

        res.redirect(`/thread/id/${threadId}`);

    } catch (error) {
       
        res.status(500).render('error', { title:'error',error: 'Internal Server Error when adding comment to thread.', layout: 'main' });
    }
});


// Remove Comment
router.post('/removeComment/:threadId/:commentId', async (req, res) => {
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
        res.status(500).render('error', { title:'error',error: 'Internal Server Error when removing comment from thread.', layout: 'main' });
    }
});




export default router;

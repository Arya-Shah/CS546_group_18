import express from 'express';
const router = express.Router();
import * as thread from '../data/threads.js';
import validators from "../helper.js";
import xss from 'xss';

router.get('/', async (req, res) => {
        try {
            let sessionId = req.session.user.userId;
            const threads = await thread.getAllThreads();
            res.render('communityForum', { title:'Forums', userInfo: req.session.user,threads:threads, layout: 'main' });
        
            } catch (e) {
            res.status(500).render('error', { title:'error',error: 'Internal Server Error.', layout: 'main' });
            }
            
        });

//Upvote Thread
router.get('/upvote/:threadOrCommentId', async (req, res) => {
    try {
        const threadOrCommentId = xss(req.params.threadOrCommentId);
        await thread.addLikeDislike(threadOrCommentId, 'like', req.session.user.userId);
        res.redirect('back');
    } catch (e) {
       
         res.status(e.status?e.status:500).render('error',{ error:e.error?e.error:e, layout: 'main' }); 
    }
});


//Downvote Thread
router.get('/downvote/:threadOrCommentId', async (req, res) => {
    try {
        const threadOrCommentId = xss(req.params.threadOrCommentId);
        await thread.addLikeDislike(threadOrCommentId, 'dislike', req.session.user.userId);
        res.redirect('back');
    } catch (error) {
         res.status(error.status?error.status:500).render('error', { error:error.error?error.error:error}); 
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
        
        let title  = xss(req.body.title);
        let content  = xss(req.body.content);
        let category  = xss(req.body.category);

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

        const threadId = xss(req.params.threadId);

        const userId = xss(req.user.id);

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
    const threadId = xss(req.params.threadId);
    if (!threadId || !validators.isValidUuid(threadId)) {
        return res.status(400).render('error', { title:'error',error: 'Invalid thread ID format.', layout: 'main' });
    }

    try {
    
        // Assuming you have a function to get the thread by ID
        const threadData = await thread.getThreadById(threadId);
    
        if (!threadData) {
            return res.status(404).render('error', {title:'error', error: 'Thread not found.', layout: 'main' });
        }
        let sessionId = req.session.user.userId;
        res.render('threadIndividual', { title:'threads',threadData:threadData, userInfo: sessionId, layout: 'main', threadId: threadId});

    } catch (error) {
       
        res.status(500).render('error', { title:'error',error: 'Internal Server Error.', layout: 'main' });

    }

});


//Add comment to thread
router.post('/addComment/:threadId', async (req, res) => {
    try {
  
        let userId = req.session.user.userId;

        let threadId = xss(req.params.threadId);
        let comment = xss(req.body.comment);

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
        const userId = xss(req.body.userId);
        const threadId = xss(req.params.threadId);
        const commentId = xss(req.params.commentId);

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

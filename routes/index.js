<<<<<<< HEAD
import usersRoutes from './auth_routes.js';

const constructorMethod = (app) => {
    app.use('/', usersRoutes);

app.use('*', (req, res) => {
    return res.status(404).json({error: 'Not found'});
    });
};

export default constructorMethod;
=======

import express from 'express';
import bodyParser from 'body-parser';
import { getAllUsers, getUserById, addUser, updateUser, removeUser, addLandlordReview, removeBookmark, addBookmark, getBookmarkedProperties,
    searchPropertiesByName, addLandLordReport } from '../data/users.js';
    import xss from 'xss';

    

const router = express.Router();
router.use(bodyParser.json());

// Route to get all users
router.get('/users', async (req, res) => {
    try {
        const users = await getAllUsers();
        res.json(users);
    } catch (e) {
        res.status(500).send(e.toString());
    }
});

// Route to get a single user by ID
router.get('/users/:id', async (req, res) => {
    try {
        const user = await getUserById(req.params.id);
        res.json(user);
    } catch (e) {
        res.status(404).send(e.toString());
    }
});

// Route to add a new user
router.post('/users', async (req, res) => {
    const { firstName, lastName, email, hasProperty, city, state, password } = req.body;
    try {
        const newUser = await addUser(firstName, lastName, email, hasProperty, city, state, password);
        res.status(201).json(newUser);
    } catch (e) {
        res.status(400).send(e.toString());
    }
});

// Route to update a user
router.put('/users/:id', async (req, res) => {
    try {
        const updatedUser = await updateUser(req.params.id, req.body);
        res.json(updatedUser);
    } catch (e) {
        res.status(400).send(e.toString());
    }
});

// Route to delete a user
router.delete('/users/:id', async (req, res) => {
    try {
        const deleteUser = await removeUser(req.params.id);
        res.status(204).json(deleteUser);
    } catch (e) {
        res.status(404).send(e.toString());
    }
});

router.post('/landlords/:landlordId/reviews', async (req, res) => {
    try {
        // Extract necessary data from request body or parameters
        const { landlordId } = req.params;
        const { reviewData, userId } = req.body;

        // Call the addLandlordReview function
        const result = await addLandlordReview(landlordId, reviewData, userId);

        // Return success response
        res.json(result);
    } catch (error) {
        // Return error response if something goes wrong
        res.status(400).json({ error: error.message });
    }
});

// POST route to add a bookmark for a user
router.post('/users/:userId/bookmarks/:propertyId', async (req, res) => {
    try {
        const userId = req.params.userId;
        const propertyId = req.params.propertyId;
        const result = await addBookmark(userId, propertyId);
        res.status(200).json(result);
    } catch (error) {
        res.status(400).json({ error: error.toString() });
    }
});



// DELETE route to remove a bookmark for a user
router.delete('/users/:userId/bookmarks/:propertyId', async (req, res) => {
    try {
        const userId = req.params.userId;
        const propertyId = req.params.propertyId;
        const result = await removeBookmark(userId, propertyId);
        res.status(200).json(result);
    } catch (error) {
        res.status(400).json({ error: error.toString() });
    }
});



// GET route to fetch bookmarked properties for a user
router.get('/users/:userId/bookmarks', async (req, res) => {
    try {
        const userId = req.params.userId;
        const bookmarkedProperties = await getBookmarkedProperties(userId);
        res.status(200).json({ bookmarkedProperties });
    } catch (error) {
        res.status(400).json({ error: error.toString() });
    }
});



// GET route to search properties by name
router.get('/properties/search', async (req, res) => {
    try {
        const title = req.query.title; // Assuming the title is provided as a query parameter
        const result = await searchPropertiesByName(title);
        res.status(200).json({ result });
    } catch (error) {
        const status = error.status || 400;
        res.status(status).json({ error: error.error || error.toString() });
    }
});


// rise a report on property and landlord
router.post('/users/:userId/report/:landlordId', async (req, res) => {
    try {
        // Extract necessary data from request body or parameters
        const  landlordId  =req.params.landlordId;
        const  reportData   = req.body.report_description;
        const userId = req.body.userId;
        // Call the addLandlordReport function
        const result = await addLandLordReport(landlordId, reportData, userId);
        // Return success response
        res.json(result);
    } catch (error) {
        // Return error response if something goes wrong
        res.status(400).json({ error: error.message });
    }
});

router.get('/report', async(req,res) =>{
    res.render('report');
})
.post(async(req,res)=>{
    console.log("posted!",req);
    res.send('Report submitted successfully!');
});

export default router;


>>>>>>> 42798d498ead8de64b1a6c3b380ee6a5d7a6190c

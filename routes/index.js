
import express from 'express';
import { getAllUsers, getUserById, addUser, updateUser, removeUser } from '../data/users.js';

const router = express.Router();

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

export default router;



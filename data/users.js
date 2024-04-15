import { users } from './mongoCollections.js';
import uuid from 'uuid';
import bcrypt from 'bcrypt';

const saltRounds = 16;

export const getAllUsers = async () => {
const userCollection = await users();
return await userCollection.find({}).toArray();
};

export const getUserById = async (id) => {
if (!id || typeof id !== 'string') throw 'Invalid ID input';
const userCollection = await users();
const user = await userCollection.findOne({ userId: id });
if (!user) throw 'User not found';
return user;
};

export const addUser = async (firstName, lastName, email, hasProperty, city, state, password) => {
if (!firstName || typeof firstName !== 'string' || firstName.trim().length === 0)
throw 'Invalid first name input';
if (!lastName || typeof lastName !== 'string' || lastName.trim().length === 0)
throw 'Invalid last name input';
if (!email || typeof email !== 'string' || email.trim().length === 0)
throw 'Invalid email input';
if (typeof hasProperty !== 'boolean') throw 'Invalid hasProperty input';
if (!city || typeof city !== 'string' || city.trim().length === 0)
throw 'Invalid city input';
if (!state || typeof state !== 'string' || state.trim().length === 0)
throw 'Invalid state input';
if (!password || typeof password !== 'string' || password.trim().length === 0)
throw 'Invalid password input';

const userCollection = await users();
const hashedPassword = await bcrypt.hash(password, saltRounds);
let newUser = {
userId: uuid.v4(),
firstName: firstName.trim(),
lastName: lastName.trim(),
email: email.trim().toLowerCase(),
hasProperty: hasProperty,
city: city.trim(),
state: state.trim(),
hashedPassword: hashedPassword,
reviewIds: [],
commentsIds: [],
reportsIds: []
};

const insertInfo = await userCollection.insertOne(newUser);
if (!insertInfo.acknowledged || !insertInfo.insertedId)
throw 'Could not add new user';
return { userInserted: true };
};

export const updateUser = async (userId, updatedUser) => {
if (!userId || typeof userId !== 'string') throw 'Invalid user ID input';
if (!updatedUser || typeof updatedUser !== 'object' || Array.isArray(updatedUser))
throw 'Invalid updatedUser input';

const userCollection = await users();
const updatedUserData = {};

if (updatedUser.firstName) {
updatedUserData.firstName = updatedUser.firstName.trim();
}
if (updatedUser.lastName) {
updatedUserData.lastName = updatedUser.lastName.trim();
}
if (updatedUser.email) {
updatedUserData.email = updatedUser.email.trim().toLowerCase();
}
if (updatedUser.hasProperty !== undefined) {
updatedUserData.hasProperty = updatedUser.hasProperty;
}
if (updatedUser.city) {
updatedUserData.city = updatedUser.city.trim();
}
if (updatedUser.state) {
updatedUserData.state = updatedUser.state.trim();
}
if (updatedUser.password) {
updatedUserData.hashedPassword = await bcrypt.hash(updatedUser.password, saltRounds);
}

const updateResponse = await userCollection.updateOne(
{ userId: userId },
{ $set: updatedUserData }
);
if (!updateResponse.acknowledged || updateResponse.modifiedCount === 0)
throw 'Error occurred while updating user';

return { userUpdated: true };
};

export const removeUser = async (userId) => {
if (!userId || typeof userId !== 'string') throw 'Invalid user ID input';

const userCollection = await users();
const deletionInfo = await userCollection.deleteOne({ userId: userId });

if (deletionInfo.deletedCount === 0) {
throw `Error occurred while deleting user with ID ${userId}`;
}

return { userDeleted: true };
};
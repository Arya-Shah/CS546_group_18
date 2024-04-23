import { users } from "./../config/mongoCollections.js";
import bcrypt from 'bcryptjs';
const saltRounds = 16;

export const registerUser = async (
firstName,
lastName,
username,
password
) => {
const errorObject = {
status: 400,
};

if(!firstName || !lastName || !username || !password){
    errorObject = 'All fields must be provided.';
    throw errorObject
}

firstName.trim();
lastName.trim();
username.trim();
password.trim();

if(firstName.length < 2 || lastName.length < 2 || firstName.length > 25 || lastName.length > 25){
errorObject = 'Firstname and Lastname should be between 2 and 25.';
throw errorObject}

if (!/^[a-zA-Z\s]+$/.test(firstName) || !/^[a-zA-Z\s]+$/.test(lastName)) {
errorObject = 'First and last name must be characters and cannot contain numbers.';
throw errorObject}

if(username.length < 5 || username.length > 10){

errorObject = 'username should be between 5 and 10.';
throw errorObject}

if (!/^[a-zA-Z\s]+$/.test(username)) {
errorObject = 'username must be characters and cannot contain numbers.';
throw errorObject}

if(password.length < 8){
errorObject = 'password should be greater than 8.';
throw errorObject;
}
if (!/[!@#$%^&*(),.?":{}|<>]/.test(password) || !/[A-Z]/.test(password) || !/[0-9]/.test(password)) {
errorObject = 'There needs to be at least one uppercase character, there has to be at least one number and there has to be at least one special character';
throw errorObject;
}

const userRow = await getUserByName(username);

if (Object.keys(userRow).length !== 0) {
errorObject.error = "User with this username already exists.";
throw errorObject;
}

let newUser = {
firstName: firstName,
lastName: lastName,
username: username,
password: await bcrypt.hash(password, saltRounds)
};
const userCollection = await users();
const insertInfo = await userCollection.insertOne(newUser);
if (!insertInfo.acknowledged || !insertInfo.insertedId) {
errorObject.status = 500;
errorObject.error = "Internal Server Error.";
throw errorObject;
}
return { insertedUser: true };
};

export const loginUser = async (username, password) => {
const errorObject = {
status: 400,
};
if (!username && !password) {
errorObject.error = "No input provided to create user.";
throw errorObject;
}

if(username.length < 5 || username.length > 10){
errorObject = 'username should be between 5 and 10.' ;

}
if (!/^[a-zA-Z\s]+$/.test(username)) {
errorObject = 'username must be characters and cannot contain numbers.' ;
throw errorObject;
}

if(password.length < 8){
errorObject = 'password should be greater than 8.' ;
throw errorObject;
}
if (!/[!@#$%^&*(),.?":{}|<>]/.test(password) || !/[A-Z]/.test(password) || !/[0-9]/.test(password)) {
errorObject = 'There needs to be at least one uppercase character, there has to be at least one number and there has to be at least one special character' ;
throw errorObject;
}

const userRow = await getUserByName(username);
if (Object.keys(userRow).length === 0) {
errorObject.error = "Either the username or password is invalid";
throw errorObject;
}
let compareResult = await bcrypt.compare(password, userRow.password);
if (!compareResult) {
errorObject.error = "Either the username or password is invalid";
throw errorObject;
}
''
return userRow;
};

const getUserByName = async (username) => {
let result = {};
const errorObject = {
status: 400,
};
if (!username) {
errorObject.error = "No input provided to search user.";
throw errorObject;
}
if(username.length < 5 || username.length > 10){
errorObject = 'username should be between 5 and 10.';
throw errorObject;
}
if (!/^[a-zA-Z\s]+$/.test(username)) {
errorObject = 'username must be characters and cannot contain numbers.';
throw errorObject;
}  
username = username.trim();
const usersCollection = await users();
const userRow = await usersCollection.findOne({ username: username });
if (userRow === null) {
return result;
}
return userRow;
};

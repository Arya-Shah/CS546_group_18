import { users } from "../config/mongoCollections.js";
import { ObjectId } from "mongodb";

//collection  name for db
const usersCollectionName = "users";
const create = async (
  //   userId,
  firstName,
  lastName,
  email,
  hasProperty,
  city,
  state,
  hashedPassword,
  userStatus,
  reviewIds,
  commentsIds,
  reportsIds
) => {
  const user = {
    // userId,
    firstName: firstName.trim(),
    lastName: lastName.trim(),
    email: email.trim(),
    hasProperty: hasProperty,
    city: city.trim(),
    state: state.trim(),
    hashedPassword: hashedPassword.trim(),
    userStatus: userStatus,
    reviewIds: [],
    commentsIds: [],
    reportsIds: [],
  };
  const usersCollection = await users(usersCollectionName);
  const result = await usersCollection.insertOne(user);
  return result;
};

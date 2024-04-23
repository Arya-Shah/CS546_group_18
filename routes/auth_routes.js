import express from 'express';
const router = express.Router();

import {registerUser,loginUser} from '../data/users.js';

router.route('/').get(async (req, res) => {
//code here for GET THIS ROUTE SHOULD NEVER FIRE BECAUSE OF MIDDLEWARE #1 IN SPECS.
});

router
.route('/register')
.get(async (req, res) => {
  return res.status(200).render("register", {
    title: "User Registration",
  });
})
.post(async (req, res) => {
  //code here for POST
  try{
  let firstName = req.body.firstName.trim()
  let lastName = req.body.lastName.trim()
  let username = req.body.username.trim()
  let password = req.body.password.trim()
  let confirmPassword = req.body.confirmPassword.trim()

  if(!firstName || !lastName || !username || !password || !confirmPassword){
    return res.status(400).render('register', { error: 'All fields must be provided.' });
  }
  if(firstName.length < 2 || lastName.length < 2 || firstName.length > 25 || lastName.length > 25){
    return res.status(400).render('register', { error: 'firstName and lastName should be between 2 and 25.' });
  }
  if (!/^[a-zA-Z\s]+$/.test(firstName) || !/^[a-zA-Z\s]+$/.test(lastName)) {
    return res.status(400).render('register', { error: 'First and last name must be characters and cannot contain numbers.' });
}
if(username.length < 5 || username.length > 10){
  return res.status(400).render('register', { error: 'username should be between 5 and 10.' });
}
if (!/^[a-zA-Z\s]+$/.test(username)) {
  return res.status(400).render('register', { error: 'username must be characters and cannot contain numbers.' });
}
if(password.length < 8){
return res.status(400).render('register', { error: 'password should be greater than 8.' });
}
if (!/[!@#$%^&*(),.?":{}|<>]/.test(password) || !/[A-Z]/.test(password) || !/[0-9]/.test(password)) {
return res.status(400).render('register', { error: 'There needs to be at least one uppercase character, there has to be at least one number and there has to be at least one special character' });
}
if(password !== confirmPassword){
return res.status(400).render('register', { error: 'Password did not match.' });
}
await registerUser(req.body.firstName, req.body.lastName, req.body.username, req.body.password);
return res.status(200).render('login', {
layout: 'main',
success: 'User Created successfully', 
});
}catch(e){
      res.status(e.status?e.status:500).render('register', { error: e.error?e.error:e, form: req.body });
  }
});

router
.route('/login')
.get(async (req, res) => {
  //code here for GET
  return res.status(200).render('login', {
    layout: 'main',
    error: '', 
});

})
.post(async (req, res) => {
  //code here for POST
  try {
    const errorObject = {
      status: 400,
    };
    let username = req.body.username.trim();
    let password = req.body.password.trim();
    
    if(username.length < 5 || username.length > 10){
      return res.status(400).render('login', { error: 'username should be between 5 and 10.' });
    }
    if (!/^[a-zA-Z\s]+$/.test(username)) {
      return res.status(400).render('login', { error: 'username must be characters and cannot contain numbers.' });
  }
  
  if(password.length < 8){
    return res.status(400).render('login', { error: 'password should be greater than 8.' });
  }

  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password) || !/[A-Z]/.test(password) || !/[0-9]/.test(password)) {
    return res.status(400).render('login', { error: 'There needs to be at least one uppercase character, there has to be at least one number and there has to be at least one special character' });
  }
  let userData =  await loginUser(username, password);
    req.session.user = userData;
    res.redirect("/");
  } catch(e){
        res.status(e.status?e.status:500).render('login', { error: e.error?e.error:e, form: req.body });
    }
});

router.route('/user').get(async (req, res) => {
try{
return res.status(200).render("user", {
  // get code for user
});
} catch(e){
res.status(500).render('user', { error: e, form: req.body });
}
});

router.route('/admin').get(async (req, res) => {
try{
  return res.status(200).render("admin", {
      // post code for user
  });
} catch(e){
  res.status(500).render('user', { error: e, form: req.body });
}
});

router.route('/logout').get(async (req, res) => {
//code here for GET
req.session.destroy();
return res.status(200).render("logout", {
  title: "Logout",
});
});

export default router;
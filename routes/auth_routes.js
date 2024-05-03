import express from 'express';
const router = express.Router();

import {registerUser,loginUser,addLandLordReport} from '../data/users.js';

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
  let firstName = req.body.firstName.trim();
  let lastName = req.body.lastName.trim();
  let username = req.body.username.trim();
  let password = req.body.password.trim();
  let confirmPassword = req.body.confirmPassword.trim();
  let email = req.body.email.trim();
  let city = req.body.city.trim();
  let state = req.body.state.trim();

  if(!firstName || !lastName || !username || !password || !confirmPassword || !email || !city || !state){
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
// Validate email
if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
  return res.status(400).render('register', { error: 'Invalid email format.' });
}
// Validate city and state if required
if (!/^[a-zA-Z\s]+$/.test(city) || !/^[a-zA-Z\s]+$/.test(state)) {
  return res.status(400).render('register', { error: 'City and state must contain only alphabetic characters and spaces.' });
}
await registerUser(firstName, lastName, username, password, city, state, email);
return res.status(200).render('login', {
layout: 'main',
success: 'User Created successfully', 
});
}catch(e){
      res.status(e.status?e.status:500).render('register', { error: e.error?e.error:e, form: req.body });
      console.log(e)
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




router.route('/logout').get(async (req, res) => {
//code here for GET
req.session.destroy();
return res.status(200).render("logout", {
  title: "Logout",
});
});

router.route('/report').get(async (req,res)=>{
  try{
    return res.status(200).render('report',{ layout: 'main',
    error: '', })
  }catch(e){
    res.status(500).render('report',{error:e, form:req.body});
  }
})
.post(async (req,res) =>{
  let reportReason = req.body.reportReason;
  if(reportReason.length < 5){
    return res.status(400).render('report', { error: 'Enter more Description!.' });
  }else{
    try {
    const userId = req.session.user._id;
    const result = await addLandLordReport(userId, reportReason,req.body.reportedItemId);
    console.log("is greater");
    res.status(200).render('report', { layout: 'main',
    success: 'successfully reported!', });
    // res.json(result);
    }catch(e){
      res.status(500).render('report', { error: e, form: req.body });
    }
  }
})

  export default router;


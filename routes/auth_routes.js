import express from 'express';
const router = express.Router();

import {registerUser,loginUser,addLandLordReport,getAllPendingReports,updateReportStatus} from '../data/users.js';

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
      res.status(e.status?e.status:500).render('error', { error: e.error?e.error:e, form: req.body });
  }
});

router
.route('/login')
.get(async (req, res) => {
  //code here for GET
  return res.status(200).render('login', {
    title:'login',
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
        res.status(e.status?e.status:500).render('error', { error: e.error?e.error:e, form: req.body });
    }
});




router.route('/logout').get(async (req, res) => {
//code here for GET
req.session.destroy();
return res.status(200).render("logout", {
  title: "Logout",
});
});

router.route('/report/:reportState/:id/:propertyId').get(async (req,res)=>{
  if(!req.session.user || req.session.user.isAdmin){
      return res.status(500).render('error', { title:'error' , error: 'Access Denied', layout: 'main' });
  }
  try{
    return res.status(200).render('report',{title:'report', layout: 'main',
    error: '', 
    reportState: req.params.reportState,id:req.params.id,propertyId:req.params.propertyId})
  }catch(e){
    res.status(e.status?e.status:500).render('error', { title:'error', error: e.error?e.error:e, form: req.body });
  }
})
.post(async (req,res) =>{
  //if report on property

  let report_Reason = req.body.reportReason;
  let reportedItem_type=req.params.reportState;
  if(report_Reason.length < 5){
    return res.status(400).render('report', {title:'error', error: 'Enter more Description!.' ,reportState: req.params.reportState,id:req.params.id,propertyId: req.params.propertyId});
  }else{
    try {
    const userId = req.session.user.userId;
      const result = await addLandLordReport(userId, report_Reason,req.body.reportedItemId,reportedItem_type,req.params.propertyId);
      return res.status(200).render('report', { title:'report',layout: 'main',
      success: 'successfully reported!', });
    }catch(e){
      res.status(e.status?e.status:500).render('error', { error: e.error?e.error:e, form: req.body });
      // res.status(500).render('report', { error: e, form: req.body });
    }
  }
});

router.route('/moderator').get(async (req,res)=>{
  try{
    const userId = req.session.user.userId;
    const pendingReports = await getAllPendingReports(userId);
    return res.status(200).render('moderator',{ layout: 'main',
    error: '', pendingReports })
  }catch(e){
    res.status(e.status?e.status:500).render('error', { error: e.error?e.error:e, form: req.body });
  }
});

router.route('/moderator/accept/:userId/:reportId/:propertyId').post(async (req, res) => {
    try {
        const status = "Accepted";
        const reportId = req.params.reportId;
        const userId = req.params.userId;
        const propertyId=req.params.propertyId;
        const result = await updateReportStatus(userId,reportId,status,propertyId);
        console.log("updated result:",result);
        // updatePostReportStatus

        // Implement logic to accept the report with the given reportId
        // For example, update the status of the report in the database
        // Once the report is accepted, you can redirect or respond accordingly
        return res.status(200).render('moderator', { layout: 'main', success: 'Report accepted successfully.' }).then(
          res.redirect('/moderator')
        );
        // return res.status(200).json({ message: 'Report accepted successfully.' });
    } catch (e) {
      res.status(e.status?e.status:500).render('error', { error: e.error?e.error:e, form: req.body });
    }
});

router.route('/moderator/reject/:userId/:reportId/:property_id').post(async (req, res) => {
    try {
        const status = "Rejected";
        const reportId = req.params.reportId;
        const userId = req.params.userId;
        const propertyId=req.params.property_id;
        const result = await updateReportStatus(userId,reportId,status,propertyId);
        // updatePostReportStatus

        // Implement logic to accept the report with the given reportId
        // For example, update the status of the report in the database
        // Once the report is accepted, you can redirect or respond accordingly
        return res.status(200).json({ message: 'Report Rejected successfully.' });
    } catch (e) {
      res.status(e.status?e.status:500).render('error', { error: e.error?e.error:e, form: req.body });
    }
});

  export default router;


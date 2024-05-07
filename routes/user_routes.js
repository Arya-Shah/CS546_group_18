import express from 'express';
const router = express.Router();
import helpers from '../helper.js';
import xss from 'xss';

import {
getAllUsers,
getUserById,
updateUser,
        // removeUser,
removeLandlordReview,
addBookmark,
removeBookmark,
getBookmarkedProperties,
searchPropertiesByName,
addLandLordReport,
addLandlordReview,
getLandlordById,
getAllLandlordsByState,
getAllLandlordsByCity,
registerUser,
getAllLandlords
} from '../data/users.js'; 



router.route('/')
.get(async (req, res) => {
try {
let id = req.session.user.userId;
    const user = await getUserById(id);
    return res.status(200).render("user", {title:'user',
        user:user,
    });
}catch (e) {
    res.status(e.status?e.status:500).render('error', { error: e.error?e.error:e, form: req.body });
}
})


router.route('/landlord')
.get(async (req, res) => {
try {
    const allLandlords = await getAllLandlords();
    return res.status(200).render("allLandlords", {
        landlords:allLandlords,
        layout:"main"
    });
}catch (e) {
    res.status(e.status?e.status:500).render('error', { error: e.error?e.error:e, form: req.body });
}
})

router.route('/addlandlord')
.get(async (req, res) => {
try {
        let flag = true;
    return res.status(200).render("register", {
        flag:flag,
        layout:"main"
    });
}catch (e) {
    res.status(e.status?e.status:500).render('error', { error: e.error?e.error:e, form: req.body });
}
})

.post(async (req, res) => {
    //code here for POST
    try{
        let firstName = xss(req.body.firstName.trim());
        let lastName = xss(req.body.lastName.trim());
        let username = xss(req.body.username.trim());
        let password = xss(req.body.password.trim());
        let confirmPassword = xss(req.body.confirmPassword.trim());
        let email = xss(req.body.email.trim());
        let city = xss(req.body.city.trim());
        let state = xss(req.body.state.trim());
  
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
    return res.status(400).render('error', { error: 'City and state must contain only alphabetic characters and spaces.' });
  }
  await registerUser(firstName, lastName, username, password, city, state, email,true);
  return res.status(200).render('allLandlords', {
  layout: 'main',
  success: 'Landord Created successfully', 
  });
  }catch(e){
        res.status(e.status?e.status:500).render('error', { error: e.error?e.error:e, form: req.body });
    }
  });

// User profile page
router.route('/profile')
.get(async (req, res) => {
const userId = req.session.user.userId;
if (!helpers.isValidUuid(userId)) {
return res.status(400).render('error', {title:'error', error: 'Invalid user ID format.', layout: 'main' });
}
try {
const user = await getUserById(userId);
if (!user) {
    return res.status(404).render('error', { title:'error',error: 'User not found.', layout: 'main' });
}
res.render('user', { user:user, layout: 'main' });
} catch (e) {
    res.status(e.status?e.status:500).render('error', { error: e.error?e.error:e, form: req.body });
}
});

// Landlord details page
router.route('/landlord/:landlordId')
.get(async (req, res) => {
const landlordId = req.params.landlordId;
if (!helpers.isValidUuid(landlordId)) {
return res.status(400).render('error', { title:'error',error: 'Invalid landlord ID format.', layout: 'main' });
}
try {
const landlord = await getLandlordById(landlordId);
if (!landlord) {
    return res.status(404).render('error', {title:'error', error: 'Landlord not found.', layout: 'main' });
}
res.render('landlordDetails', {title:'landlord', landlord:landlord, layout: 'main' });
} catch (e) {
    res.status(e.status?e.status:500).render('error', { error: e.error?e.error:e, form: req.body });
}
});

// Redirection the url below to landlord page
router.route('/review/landlord/:landlordId')
    .get(async (req, res) => {
        const landlordId = req.params.landlordId;
        if (!landlordId || !helpers.isValidUuid(landlordId)) {
            return res.status(400).render('error', { title:'error',error: 'Invalid landlord ID format.', layout: 'main' });
        }
        try {
            res.redirect(`/landlord/${landlordId}`);
        } catch (e) {
            res.status(500).render('error', { title:'error',error: 'Internal Server Error when redirecting to landlord\'s page.', layout: 'main' });
        }
    });

// Redirection the url below to property page
router.route('/review/property/:propertyId')
    .get(async (req, res) => {
    const propertyId = req.params.propertyId;
    
    if (!propertyId || !helpers.isValidUuid(propertyId)) {
        return res.status(400).render('error', { title:'error',error: 'Invalid property ID format.', layout: 'main' });
    }

    try {
        res.redirect(`/property/${propertyId}`);
    } catch (e) {
        res.status(500).render('error', { title:'error',error: 'Internal Server Error when redirecting to landlord\'s page.', layout: 'main' });
    }

    });

//LandlordReview
router.get('/landlordReview', (req, res) => {
    res.render('addLandlordReview', { title:'review',layout: 'main' });
});
router.post('/landlordReview', async (req, res) => {
    const { 
        kindnessRating, 
        maintenanceResponsivenessRating, 
        overallCommunicationRating, 
        professionalismRating, 
        handinessRating, 
        depositHandlingRating, 
        reviewText 
    } = req.body;

    const validRatings = [1, 2, 3, 4, 5];
    const errors = [];

    if (!kindnessRating || !validRatings.includes(parseInt(kindnessRating))) {
        errors.push("Invalid kindness rating input");
    }
    if (!maintenanceResponsivenessRating || !validRatings.includes(parseInt(maintenanceResponsivenessRating))) {
        errors.push("Invalid maintenance responsiveness rating input");
    }
    if (!overallCommunicationRating || !validRatings.includes(parseInt(overallCommunicationRating))) {
        errors.push("Invalid overall communication rating input");
    }
    if (!professionalismRating || !validRatings.includes(parseInt(professionalismRating))) {
        errors.push("Invalid professionalism rating input");
    }

    if (!handinessRating || !validRatings.includes(parseInt(handinessRating))) {
        errors.push("Invalid handiness rating input");
    }

    if (!depositHandlingRating || !validRatings.includes(parseInt(depositHandlingRating))) {
        errors.push("Invalid deposit handling rating input");
    }

    if (!reviewText || !validators.isValidString(reviewText.trim())) {
        errors.push("Review text is required");
    }

    //Render landlordReview Page with any caught errors
    if (errors.length > 0) {
        return res.status(400).render('landlordReview', {title:'review', errors });
    } else {

        try {

            const result = await addLandlordReview(
                landlordId,
                {
                    kindnessRating: parseInt(kindnessRating),
                    maintenanceResponsivenessRating: parseInt(maintenanceResponsivenessRating),
                    overallCommunicationRating: parseInt(overallCommunicationRating),
                    professionalismRating: parseInt(professionalismRating),
                    handinessRating: parseInt(handinessRating),
                    depositHandlingRating: parseInt(depositHandlingRating),
                    reviewText: reviewText.trim()
                },
                userId
            );

            // Render the landlord details page after successfully adding the review
            return res.redirect(`/landlord/${landlordId}`);
        } catch (error) {
            console.error('Error adding landlord review:', error);
            return res.status(500).render('error', {title:'error', error: 'Internal Server Error.', layout: 'main' });
        }
    }
});
    
// Delete Landlord Review
router.post('/deleteLandlordReview/:reviewId', async (req, res) => {
    try {
        const reviewId = xss(req.params.reviewId);
        const userId = xss(req.user.id);

        if (!reviewId || !validators.isValidUuid(reviewId)) {
            throw new Error("Invalid review ID input");
        }

        const { reviewRemoved } = await removeLandlordReview(userId, reviewId);

        if (!reviewRemoved) {
            return res.status(500).json({ error: 'Failed to remove review.' });
        }

        res.redirect(`/review/landlord/${landlordId}`);

    } catch (error) {
        res.status(error.status || 500).json({ error: error.message });
    }
});

// Route for searching landlords by state
router.route('/searchLandlordByState/:searchQuery').post(async (req, res) => {
    try {
        const errorObject = {
            status: 400,
        };

        const searchQuery = xss(req.params.searchQuery.trim());

        if (!searchQuery) {
            errorObject.error = "No input provided to search.";
            throw errorObject;
        }

        const result = await getAllLandlordsByState(searchQuery);

        if (result.length === 0) {
            errorObject.error = "We're sorry, but no landlords were found for '" + searchQuery + "'.";
            throw errorObject;
        } else {
            return res.status(200).json(result);
        }
    } catch (e) {

        if (typeof e === "object" && e !== null && !Array.isArray(e) && "status" in e && "error" in e) {
            return res.status(e.status).render("error", {
                title: "Error",
                error: e.error,
            });
        } else {
            return res.status(400).render("error", {
                title: "Error",
                error: e,
            });
        }
    }
});

router.route('/searchLandlordByCity/:searchQuery').post(async (req, res) => {
    try {

        const errorObject = { status: 400 };

        const searchQuery = xss(req.params.searchQuery.trim());

        if (!searchQuery) {
            errorObject.error = "No input provided to search.";
            throw errorObject;
        }

        const result = await getAllLandlordsByCity(searchQuery);

        if (result.length === 0) {
            errorObject.error = "We're sorry, but no landlords were found for '" + searchQuery + "'.";
            throw errorObject;
        } else {
            return res.status(200).json(result);
        }

    } catch (e) {
        if (typeof e === "object" && e !== null && !Array.isArray(e) && "status" in e && "error" in e) {
            return res.status(e.status).render("error", { title: "Error", error: e.error });
        } else {
            return res.status(400).render("error", { title: "Error", error: e });
        }
    }
});

export default router;


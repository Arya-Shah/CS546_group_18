import express from 'express';
const router = express.Router();
import helpers from '../helper.js';

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
addLandlordReview
} from '../data/users.js'; 

// const router = express.Router();

// router.use(bodyParser.urlencoded({ extended: true }));
// router.use(bodyParser.json());

// router.route('/users')
// .get(async (req, res) => {
// try {
//     const users = await getAllUsers();
//     return res.json(users);
// } catch (e) {
//     return res.status(500).json({ error: e.toString() });
// }
// });

router.route('/')
.get(async (req, res) => {
try {
let id = req.session.user.userId;
    const user = await getUserById(id);
    return res.status(200).render("user", {
        user:user,
    });
}catch (e) {
    if (
    typeof e === "object" &&
    e !== null &&
    !Array.isArray(e) &&
    "status" in e &&
    "error" in e
    ) {
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
})
// .put(async (req, res) => {
// try {
//     // Example validation directly in the route
//     if (!req.body.firstName || req.body.firstName.trim() === '') {
//     throw new Error('First name is required');
//     }
//     const updatedUser = await updateUser(req.params.userId, req.body);
//     return res.json(updatedUser);
// } catch (e) {
//     return res.status(400).json({ error: e.message });
// }
// })
// .delete(async (req, res) => {
// try {
//     const result = await removeUser(req.params.userId);
//     return res.status(200).json(result);
// } catch (e) {
//     return res.status(400).json({ error: e.toString() });
// }
// });

// // Route for bookmark operations
// router.route('/bookmarks/:userId')
// .get(async (req, res) => {
// try {
//     const bookmarks = await getBookmarkedProperties(req.params.userId);
//     return res.json(bookmarks);
// } catch (e) {
//     return res.status(404).json({ error: e.toString() });
// }
// })
// .post(async (req, res) => {
// try {
//     if (!req.body.propertyId || req.body.propertyId.trim() === '') {
//     throw new Error('Property ID is required');
//     }
//     const bookmark = await addBookmark(req.params.userId, req.body.propertyId);
//     return res.status(200).json(bookmark);
// } catch (e) {
//     return res.status(400).json({ error: e.message });
// }
// })
// .delete(async (req, res) => {
// try {
//     if (!req.body.propertyId || req.body.propertyId.trim() === '') {
//     throw new Error('Property ID is required');
//     }
//     const result = await removeBookmark(req.params.userId, req.body.propertyId);
//     return res.status(200).json(result);
// } catch (e) {
//     return res.status(400).json({ error: e.message });
// }
// });

// // Route for property search
// router.get('/properties/search', async (req, res) => {
// try {
// if (!req.query.title || req.query.title.trim() === '') {
//     throw new Error('Title is required and cannot be empty');
// }
// const results = await searchPropertiesByName(req.query.title);
// return res.json(results);
// } catch (e) {
// return res.status(404).json({ error: e.message });
// }
// });

// // Route for adding a landlord review
// router.post('/reviews/landlord/:landlordId', async (req, res) => {
// try {
// if (!req.body.userId || req.body.userId.trim() === '' || !req.body.reviewText || req.body.reviewText.trim() === '') {
//     throw new Error('User ID and review text are required');
// }
// const review = await addLandlordReview(req.params.landlordId, req.body, req.body.userId);
// return res.status(200).json(review);
// } catch (e) {
// return res.status(400).json({ error: e.message });
// }
// });

// // Route for removing a landlord review
// router.delete('/reviews/landlord/:landlordId/:reviewId', async (req, res) => {
// try {
// if (!req.body.userId || req.body.userId.trim() === '') {
//     throw new Error('User ID is required');
// }
// const result = await removeLandlordReview(req.body.userId, req.params.landlordId, req.params.reviewId);
// return res.status(200).json(result);
// } catch (e) {
// return res.status(400).json({ error: e.message });
// }
// });

// // Route for adding a report about a landlord
// router.post('/reports/landlord/:landlordId', async (req, res) => {
// try {
// if (!req.body.userId || req.body.userId.trim() === '' || !req.body.reportReason || req.body.reportReason.trim() === '' || !req.body.reportDescription || req.body.reportDescription.trim() === '') {
//     throw new Error('User ID, report reason, and report description are required');
// }
// const report = await addLandLordReport(req.params.landlordId, req.body, req.body.userId);
// return res.status(200).json(report);
// } catch (e) {
// return res.status(400).json({ error: e.message });
// }
// });


// User profile page
router.route('/profile/:userId')
.get(async (req, res) => {
const userId = req.params.userId;
if (!helpers.isValidUuid(userId)) {
return res.status(400).render('error', { error: 'Invalid user ID format.', layout: 'main' });
}
try {
const user = await getUserById(userId);
if (!user) {
    return res.status(404).render('error', { error: 'User not found.', layout: 'main' });
}
res.render('user', { user, layout: 'main' });
} catch (e) {
    if (
    typeof e === "object" &&
    e !== null &&
    !Array.isArray(e) &&
    "status" in e &&
    "error" in e
    ) {
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

// Landlord details page
router.route('/landlord/:landlordId')
.get(async (req, res) => {
const landlordId = req.params.landlordId;
if (!helpers.isValidUuid(landlordId)) {
return res.status(400).render('error', { error: 'Invalid landlord ID format.', layout: 'main' });
}
try {
const landlord = await getLandlordById(landlordId);
if (!landlord) {
    return res.status(404).render('error', { error: 'Landlord not found.', layout: 'main' });
}
res.render('landlordDetails', { landlord, layout: 'main' });
} catch (e) {
    if (
    typeof e === "object" &&
    e !== null &&
    !Array.isArray(e) &&
    "status" in e &&
    "error" in e
    ) {
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

// Property details page
router.route('/property/:propertyId')
.get(async (req, res) => {
const propertyId = req.params.propertyId;
if (!helpers.isValidUuid(propertyId)) {
return res.status(400).render('error', { error: 'Invalid property ID format.', layout: 'main' });
}
try {
const property = await getPropertyById(propertyId);
if (!property) {
    return res.status(404).render('error', { error: 'Property not found.', layout: 'main' });
}
res.render('propertyDetails', { property, layout: 'main' });
} catch (e) {
    if (
    typeof e === "object" &&
    e !== null &&
    !Array.isArray(e) &&
    "status" in e &&
    "error" in e
    ) {
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

// getPropertyByName
router.route('/searchProperty').post(async (req, res) => {
//code here for POST this is where your form will be submitting searchMoviesByName and then call your data function passing in the searchMoviesByName and then rendering the search results of up to 20 Movies.
try {
    const errorObject = {
    status: 400,
    };

    if (typeof req.body.name !== "string") {
    errorObject.error = "Provided input must be a string.";
    throw errorObject;
    }

    req.body.name = req.body.name.trim();

    if (!req.body.name) {
    errorObject.error = "No input provided to search.";
    throw errorObject;
    }
    const result = await searchPropertiesByName(req.body.name);
    if (result.length === 0) {
    return res.status(404).render("error", {
        title: "Movie Not Found",
        error:
        "We're sorry, but no results were found for '" + req.body.name + "'",
    });
    } else {
    return res.status(200).render("searchResults", {
        title: "Movie Found",
        searchTerm: "Search Input: " + req.body.name,
        movies: result,
    });
    }
} catch (e) {
    if (
    typeof e === "object" &&
    e !== null &&
    !Array.isArray(e) &&
    "status" in e &&
    "error" in e
    ) {
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

/*

NOTE FROM CONNOR: the render('landlordReview) and ('propertyReview) handle bars are now used
for the intake forms to submit these reviews. Sorry - I thought that was their purpose.
Below I've added redirects, which will render the individual landlord's and properties's ids. 

// Landlord review page
router.route('/review/landlord/:landlordId')
    .get(async (req, res) => {
 
    const landlordId = req.params.landlordId;
    if (!helpers.isValidUuid(landlordId)) {
    return res.status(400).render('error', { error: 'Invalid landlord ID format.', layout: 'main' });
    }
    try {
    const reviews = await getReviewsByUserId(landlordId); // Assume this function exists
    res.render('landlordReview', { reviews, layout: 'main' });
    } catch (e) {
    res.status(500).render('error', { error: 'Internal Server Error.', layout: 'main' });
    }
    });

// Property review page
router.route('/review/property/:propertyId')
    .get(async (req, res) => {
  
    const propertyId = req.params.propertyId;
    if (!helpers.isValidUuid(propertyId)) {
    return res.status(400).render('error', { error: 'Invalid property ID format.', layout: 'main' });
    }
    try {
    const reviews = await getReviewsByUserId(propertyId); // Assume this function exists
    res.render('propertyReview', { reviews, layout: 'main' });
    } catch (e) {
    res.status(500).render('error', { error: 'Internal Server Error.', layout: 'main' });
    }
    });
*/

// Redirection the url below to landlord page
router.route('/review/landlord/:landlordId')
    .get(async (req, res) => {
        const landlordId = req.params.landlordId;
        if (!landlordId || !helpers.isValidUuid(landlordId)) {
            return res.status(400).render('error', { error: 'Invalid landlord ID format.', layout: 'main' });
        }
        try {
            res.redirect(`/landlord/${landlordId}`);
        } catch (e) {
            res.status(500).render('error', { error: 'Internal Server Error when redirecting to landlord\'s page.', layout: 'main' });
        }
    });

// Redirection the url below to property page
router.route('/review/property/:propertyId')
    .get(async (req, res) => {
    const propertyId = req.params.propertyId;
    
    if (!propertyId || !helpers.isValidUuid(propertyId)) {
        return res.status(400).render('error', { error: 'Invalid property ID format.', layout: 'main' });
    }

    try {
        res.redirect(`/property/${propertyId}`);
    } catch (e) {
        res.status(500).render('error', { error: 'Internal Server Error when redirecting to landlord\'s page.', layout: 'main' });
    }

    });

// Community Forum page
    router.route('/communityForum')
    .get(async (req, res) => {
    try {
    // Replace 'getAllForumThreads' with the actual data function that retrieves forum threads
    const threads = await getAllForumThreads();
    res.render('communityForum', { threads, layout: 'main' });
    } catch (e) {
    res.status(500).render('error', { error: 'Internal Server Error.', layout: 'main' });
    }
    });

// Search Results page
    router.route('/searchResults')
    .get(async (req, res) => {
    const searchTerm = req.query.searchTerm;
    if (!helpers.isValidString(searchTerm)) {
    return res.status(400).render('error', { error: 'Invalid search term.', layout: 'main' });
    }
    try {
    // Replace 'searchPropertiesByName' with the actual function
    const results = await searchPropertiesByName(searchTerm);
    res.render('searchResults', { results, searchTerm, layout: 'main' });
    } catch (e) {
    res.status(500).render('error', { error: 'Internal Server Error.', layout: 'main' });
    }
    });

//LandlordReview
router.get('/landlordReview', (req, res) => {
    res.render('addLandlordReview', { layout: 'main' });
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
        return res.status(400).render('landlordReview', { errors });
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
            return res.status(500).render('error', { error: 'Internal Server Error.', layout: 'main' });
        }
    }
});
    

export default router;

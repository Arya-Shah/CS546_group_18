import express from 'express';
const router = express.Router();
import helpers from '../helper.js';
import {
    getAllUsers,
    getUserById,
    updateUser,
    removeUser,
    addLandlordReview,
    removeLandlordReview,
    addBookmark,
    removeBookmark,
    getBookmarkedProperties,
    searchPropertiesByName,
    addLandLordReport
    } from '../data/users.js'; 


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
res.status(500).render('error', { error: 'Internal Server Error.', layout: 'main' });
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
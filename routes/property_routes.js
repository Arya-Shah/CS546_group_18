import express from 'express';
const router = express.Router();
import helpers from '../helper.js';

import * as properties from '../data/properties.js';
import {searchPropertiesByName} from '../data/users.js'; 
import validators from "../helper.js";

// Property details page
router.route('/property/:propertyId')
.get(async (req, res) => {
    
    const propertyId = req.params.propertyId;

    if (!propertyId || !validators.isValidUuid(propertyId)) {
        return res.status(400).render('error', { error: 'Invalid property ID format.', layout: 'main' });
    }

    try {
    
        const property = await properties.getPropertyById(propertyId);
    
        if (!property) {
            return res.status(404).render('error', { error: 'Property not found.', layout: 'main' });
        }

        res.render('propertyDetails', {property, layout: 'main'});

    } catch (e) {

        res.status(e.status?e.status:500).render('error', { error: e.error?e.error:e, form: req.body });

    }

}

)
.post(
    async (req, res) => {

        const { propertyName, address, city, state, zipcode, latitude, longitude, category, bedrooms, bathrooms } = req.body;

    //Validation
    const errors = [];

    if (!propertyName || !validators.isValidString(propertyName.trim())) {
        errors.push("Invalid property name input");
    }

    if (!address || address.trim().length < 5 || address.trim().length > 100) {
        errors.push("The provided address needs to be between 5 and 100 characters.");
    }

    if (!city || !validators.isValidString(city.trim())) {
        errors.push("Invalid city input");
    }

    if (!state || !validators.isValidString(state.trim())) {
        errors.push("Invalid state input");
    }

    if (!zipcode || !validators.isValidString(zipcode.trim()) || !validators.isValidZipcode(zipcode.trim())) {
        errors.push("Invalid zipcode input");
    }

    if (!longitude || !validators.isValidString(longitude.trim()) || !validators.isValidLongitude(longitude.trim())) {
        errors.push("Invalid longitude input");
    }

    if (!latitude || !validators.isValidString(latitude.trim()) || !validators.isValidLatitude(latitude.trim())) {
        errors.push("Invalid latitude input");
    }

    if (!category || !validators.isValidString(category.trim()) || !validators.isValidPropertyCategory(category.trim())) {
        errors.push("Invalid property category input");
    }

    if (!bedrooms || !Number.isInteger(parseInt(bedrooms.trim()))) {
        errors.push("Invalid bedrooms input");
    }

    if (!bathrooms || !Number.isInteger(parseInt(bathrooms.trim()))) {
        errors.push("Invalid bathrooms input");
    }

    //Render addProperty Page with any caught errors
    if (errors.length > 0) {
        res.status(400).render('addProperty', { errors }); 
    } else {
       
        try{
        
        const { propertyInserted, propertyId } = await properties.updateProperty(
            propertyName.trim(),
            address.trim(),
            city.trim(),
            state.trim(),
            zipcode.trim(),
            longitude.trim(),
            latitude.trim(),
            category.trim(),
            bedrooms.trim(),
            bathrooms.trim()
        );

        res.redirect(`/property/${propertyId}`)

       } catch (e) {
        res.status(e.status?e.status:500).render('property', { error: e.error?e.error:e, form: req.body });
       }

    }

    }
)
;

//searchPropertyByName
router.route('/property/searchPropertyByName/:searchQuery').post(async (req, res) => {
    try {
        
        const errorObject = {
            status: 400,
        };

        const searchQuery = req.params.searchQuery.trim();

        if (!searchQuery) {
            errorObject.error = "No input provided to search.";
            throw errorObject;
        }
        
        const result = await properties.getPropertyByName(searchQuery);
        
        if (result.length === 0) {
            
            return res.status(404).render("error", {
                title: "Property Not Found",
                error: "We're sorry, but no results were found for '" + searchQuery + ".'",
            });

        } else {
            return res.status(200).json(result);
        };

    
    } catch (e) {
        if (typeof e === "object" && e !== null && !Array.isArray(e) && "status" in e && "error" in e) {
            return res.status(e.status).render("error", {
                title: "Error",
                error: e.error,
            });
        } else {
            return res.status(400).render("error", {title: "Error", error: e,});
        }
    }

});

//searchPropertyByAddress
router.route('/property/searchPropertyByAddress/:searchQuery').post(async (req, res) => {
    try {
        
        const errorObject = {
            status: 400,
        };

        const searchQuery = req.params.searchQuery.trim();

        if (!searchQuery) {
            errorObject.error = "No input provided to search.";
            throw errorObject;
        }
        
        const result = await properties.getPropertyByAddress(searchQuery);
        
        if (result.length === 0) {
            
            return res.status(404).render("error", {
                title: "Property Not Found",
                error: "We're sorry, but no results were found for '" + searchQuery + ".'",
            });

        } else {
            return res.status(200).json(result);
        };

    
    } catch (e) {
        if (typeof e === "object" && e !== null && !Array.isArray(e) && "status" in e && "error" in e) {
            return res.status(e.status).render("error", {
                title: "Error",
                error: e.error,
            });
        } else {
            return res.status(400).render("error", {title: "Error", error: e,});
        }
    }

});

//searchPropertyByState
router.route('/property/searchPropertyByState/:searchQuery').post(async (req, res) => {
    try {
        
        const errorObject = {
            status: 400,
        };

        const searchQuery = req.params.searchQuery.trim();

        if (!searchQuery) {
            errorObject.error = "No input provided to search.";
            throw errorObject;
        }
        
        const result = await properties.getPropertyByState(searchQuery);
        
        if (result.length === 0) {
            
            return res.status(404).render("error", {
                title: "Property Not Found",
                error: "We're sorry, but no results were found for '" + searchQuery + ".'",
            });

        } else {
            return res.status(200).json(result);
        };

    
    } catch (e) {
        if (typeof e === "object" && e !== null && !Array.isArray(e) && "status" in e && "error" in e) {
            return res.status(e.status).render("error", {
                title: "Error",
                error: e.error,
            });
        } else {
            return res.status(400).render("error", {title: "Error", error: e,});
        }
    }

});

//searchPropertyByCity
router.route('/property/searchPropertyByCity/:searchQuery').post(async (req, res) => {
    try {
        
        const errorObject = {
            status: 400,
        };

        const searchQuery = req.params.searchQuery.trim();

        if (!searchQuery) {
            errorObject.error = "No input provided to search.";
            throw errorObject;
        }
        
        const result = await properties.getPropertyByCity(searchQuery);
        
        if (result.length === 0) {
            
            return res.status(404).render("error", {
                title: "Property Not Found",
                error: "We're sorry, but no results were found for '" + searchQuery + ".'",
            });

        } else {
            return res.status(200).json(result);
        };

    
    } catch (e) {
        if (typeof e === "object" && e !== null && !Array.isArray(e) && "status" in e && "error" in e) {
            return res.status(e.status).render("error", {
                title: "Error",
                error: e.error,
            });
        } else {
            return res.status(400).render("error", {title: "Error", error: e,});
        }
    }

});

//searchPropertyByZip
router.route('/property/searchPropertyByZip/:searchQuery').post(async (req, res) => {
    try {
        
        const errorObject = {
            status: 400,
        };

        const searchQuery = req.params.searchQuery.trim();

        if (!searchQuery) {
            errorObject.error = "No input provided to search.";
            throw errorObject;
        }
        
        const result = await properties.getPropertyByZipcode(searchQuery);
        
        if (result.length === 0) {
            
            return res.status(404).render("error", {
                title: "Property Not Found",
                error: "We're sorry, but no results were found for '" + searchQuery + ".'",
            });

        } else {
            return res.status(200).json(result);
        };

    
    } catch (e) {
        if (typeof e === "object" && e !== null && !Array.isArray(e) && "status" in e && "error" in e) {
            return res.status(e.status).render("error", {
                title: "Error",
                error: e.error,
            });
        } else {
            return res.status(400).render("error", {title: "Error", error: e,});
        }
    }

});

//searchPropertyById
router.route('/property/searchPropertyById/:searchQuery').post(async (req, res) => {
    try {
        
        const errorObject = {
            status: 400,
        };

        const searchQuery = req.params.searchQuery.trim();

        if (!searchQuery) {
            errorObject.error = "No input provided to search.";
            throw errorObject;
        }
        
        const result = await properties.getPropertyById(searchQuery);
        
        if (result.length === 0) {
            
            return res.status(404).render("error", {
                title: "Property Not Found",
                error: "We're sorry, but no results were found for '" + searchQuery + ".'",
            });

        } else {
            return res.status(200).json(result);
        };

    
    } catch (e) {
        if (typeof e === "object" && e !== null && !Array.isArray(e) && "status" in e && "error" in e) {
            return res.status(e.status).render("error", {
                title: "Error",
                error: e.error,
            });
        } else {
            return res.status(400).render("error", {title: "Error", error: e,});
        }
    }

});

// GET route to display the addProperty form
router.get('/addProperty', (req, res) => {
    res.render('addProperty', { error: null }); 
});


// POST route to handle form submission and add a property
router.post('/addProperty', async (req, res) => {
    
    const { propertyName, address, city, state, zipcode, latitude, longitude, category, bedrooms, bathrooms } = req.body;

    //Validation
    const errors = [];

    if (!propertyName || !validators.isValidString(propertyName.trim())) {
        errors.push("Invalid property name input");
    }

    if (!address || address.trim().length < 5 || address.trim().length > 100) {
        errors.push("The provided address needs to be between 5 and 100 characters.");
    }

    if (!city || !validators.isValidString(city.trim())) {
        errors.push("Invalid city input");
    }

    if (!state || !validators.isValidString(state.trim())) {
        errors.push("Invalid state input");
    }

    if (!zipcode || !validators.isValidString(zipcode.trim()) || !validators.isValidZipcode(zipcode.trim())) {
        errors.push("Invalid zipcode input");
    }

    if (!longitude || !validators.isValidString(longitude.trim()) || !validators.isValidLongitude(longitude.trim())) {
        errors.push("Invalid longitude input");
    }

    if (!latitude || !validators.isValidString(latitude.trim()) || !validators.isValidLatitude(latitude.trim())) {
        errors.push("Invalid latitude input");
    }

    if (!category || !validators.isValidString(category.trim()) || !validators.isValidPropertyCategory(category.trim())) {
        errors.push("Invalid property category input");
    }

    if (!bedrooms || !Number.isInteger(parseInt(bedrooms.trim()))) {
        errors.push("Invalid bedrooms input");
    }

    if (!bathrooms || !Number.isInteger(parseInt(bathrooms.trim()))) {
        errors.push("Invalid bathrooms input");
    }

    //Render addProperty Page with any caught errors
    if (errors.length > 0) {
        res.status(400).render('addProperty', { errors }); 
    } else {
       
        try{
        
        const { propertyInserted, propertyId } = await properties.addProperty(
            propertyName.trim(),
            address.trim(),
            city.trim(),
            state.trim(),
            zipcode.trim(),
            longitude.trim(),
            latitude.trim(),
            category.trim(),
            bedrooms.trim(),
            bathrooms.trim()
        );

        res.redirect(`/property/${propertyId}`)

       } catch (e) {

            res.status(500).render('error', { 
                title: "Error Adding Property to Database.",
                error: e.toString()
            });
       }

    }

});

// Delete a property (post)
router.post('/deleteProperty/:propertyId', async (req, res) => {
    try {
        const propertyId = req.params.propertyId;

        if (!propertyId || !validators.isValidUuid(propertyId)) {
            throw new Error("Invalid property ID input");
        }

        const { propertyDeleted } = await removeProperty(propertyId);

        if (!propertyDeleted) {
            return res.status(500).json({ error: 'Failed to delete property.' });
        }

        // Redirect to the property page after successful deletion
        res.redirect(`/property/${propertyId}`);

    } catch (e) {
        res.status(e.status?e.status:500).render('error', { error: e.error?e.error:e, form: req.body });
    }
});

// PropertyReview
router.get('/propertyReview', (req, res) => {
    res.render('addPropertyReview', { layout: 'main' });
});

router.post('/propertyReview', async (req, res) => {
    const { 
        maintenanceRating, 
        locationDesirabilityRating, 
        ownerResponsivenessRating, 
        propertyConditionRating, 
        communityRating, 
        amenitiesRating, 
        reviewText 
    } = req.body;

    const validRatings = [1, 2, 3, 4, 5];
    const errors = [];

    if (!maintenanceRating || !validRatings.includes(parseInt(maintenanceRating))) {
        errors.push("Invalid maintenance rating input");
    }

    if (!locationDesirabilityRating || !validRatings.includes(parseInt(locationDesirabilityRating))) {
        errors.push("Invalid location desirability rating input");
    }

    if (!ownerResponsivenessRating || !validRatings.includes(parseInt(ownerResponsivenessRating))) {
        errors.push("Invalid owner responsiveness rating input");
    }

    if (!propertyConditionRating || !validRatings.includes(parseInt(propertyConditionRating))) {
        errors.push("Invalid property condition rating input");
    }

    if (!communityRating || !validRatings.includes(parseInt(communityRating))) {
        errors.push("Invalid community rating input");
    }

    if (!amenitiesRating || !validRatings.includes(parseInt(amenitiesRating))) {
        errors.push("Invalid amenities rating input");
    }

    if (!reviewText || !validators.isValidString(reviewText.trim())) {
        errors.push("Review text is required");
    }

    // Render propertyReview Page with any caught errors
    if (errors.length > 0) {
        return res.status(400).render('propertyReview', { errors });
    } else {
        try {
            // Assuming functions like addPropertyReview exist to handle database operations
            const result = await addPropertyReview(
                propertyId,
                {
                    maintenanceRating: parseInt(maintenanceRating),
                    locationDesirabilityRating: parseInt(locationDesirabilityRating),
                    ownerResponsivenessRating: parseInt(ownerResponsivenessRating),
                    propertyConditionRating: parseInt(propertyConditionRating),
                    communityRating: parseInt(communityRating),
                    amenitiesRating: parseInt(amenitiesRating),
                    reviewText: reviewText.trim()
                },
                userId
            );

            // Render the property details page after successfully adding the review
            return res.redirect(`/property/${propertyId}`);

        } catch (e) {
            console.error('Error adding property review:', error);
            res.status(e.status?e.status:500).render('error', { error: e.error?e.error:e, form: req.body });
        }
    }
});

router.post('/deletePropertyReview/:reviewId', async (req, res) => {
    try {
        const reviewId = req.params.reviewId;

        if (!reviewId || !validators.isValidUuid(reviewId)) {
            throw new Error("Invalid review ID input");
        }

        const { reviewRemoved, propertyId } = await removePropertyReview(propertyId, reviewId);

        if (!reviewRemoved) {
            return res.status(500).json({ error: 'Failed to remove property review.' });
        }

        // Redirect to the property page after successful review deletion
        res.redirect(`/property/${propertyId}`);

    } catch (e) {
        res.status(e.status?e.status:500).render('error', { error: e.error?e.error:e, form: req.body });
    }
});


//Add comment to property
router.post('/property_routes/addComment/:propertyId', async (req, res) => {
    try {
        const { userId } = req.body;
        const { propertyId } = req.params;
        const { comment } = req.body; 

        const result = await properties.addCommentReply(userId, propertyId, comment);

        if (!result) {
            return res.status(500).json({ error: 'Failed to add comment to thread.' });
        }

        res.redirect(`'/property/${propertyId}'`);

    } catch (e) {
       
        res.status(e.status?e.status:500).render('error', { error: e.error?e.error:e, form: req.body });
    }
});


// Remove Comment
router.post('/property_routes/removeComment/:propertyId/:commentId', async (req, res) => {
    try {
        const { userId } = req.body;
        const { propertyId, commentId } = req.params;

        const result = await properties.removeCommentReply(userId, commentId);

        if (!result) {
            return res.status(500).json({ error: 'Failed to remove comment from thread.' });
        }

        res.redirect(`'/property/${propertyId}'`);

    } catch (e) {
        // Handle errors
        res.status(e.status?e.status:500).render('error', { error: e.error?e.error:e, form: req.body });
    }
});



export default router;
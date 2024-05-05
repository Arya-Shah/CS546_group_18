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

        res.status(500).render('error', { error: 'Internal Server Error.', layout: 'main' });

    }

});

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
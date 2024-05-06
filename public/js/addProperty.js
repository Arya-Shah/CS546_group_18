import * as validators from '../../helpers.js';

const addPropertyForm = document.getElementById('addProperty-form');
const propertyNameEl = document.getElementById('propertyName');
const addressEl = document.getElementById('address');
const cityEl = document.getElementById('city');
const stateEl = document.getElementById('state');
const zipcodeEl = document.getElementById('zipcode');
const longitudeEl = document.getElementById('longitude');
const latitudeEl = document.getElementById('latitude');
const propertyCategoryEl = document.getElementById('category');
const bedroomsEl = document.getElementById('bedrooms');
const bathroomsEl = document.getElementById('bathrooms');
const errorDiv = document.getElementById('errorDiv');

if (addPropertyForm) {

    addPropertyForm.addEventListener('submit', async (event) => {

        event.preventDefault();

        const errors = [];

        try {
            
            // Validation
            if (
                !propertyNameEl.value.trim() ||
                !validators.isValidString(propertyNameEl.value.trim())
            )
                throw "Invalid property name input";

            if (addressEl.value.trim().length < 5 || 
                addressEl.value.trim().length > 100)
                throw "The provided address needs to be between 5 and 100 characters.";
        
            if (!cityEl.value || 
                !validators.isValidString(cityEl.value) || 
                cityEl.value.trim().length === 0)
                throw "Invalid city input";
        
            if (!stateEl.value || 
                !validators.isValidString(stateEl.value) || 
                stateEl.value.trim().length === 0)
                throw "Invalid state input";
        
            if (!zipcodeEl.value || 
                !validators.isValidString(zipcodeEl.value) || 
                !validators.isValidZipcode(zipcodeEl.value) ||
                zipcodeEl.value.trim().length === 0)
                throw "Invalid zipcode input";
        
            if (!longitudeEl.value || 
                !validators.isValidString(longitudeEl.value) || 
                !validators.isValidLongitude(longitudeEl.value) ||
                longitudeEl.value.trim().length === 0)
                throw "Invalid longitude input";
        
            if (!latitudeEl.value || 
                !validators.isValidString(latitudeEl.value) || 
                !validators.isValidLatitude(latitudeEl.value) ||
                latitudeEl.value.trim().length === 0)
                throw "Invalid latitude input";
            
            if (!propertyCategoryEl.value || 
                !validators.isValidString(propertyCategoryEl.value) || 
                propertyCategoryEl.value.trim().length === 0 || 
                !validators.isValidPropertyCategory(propertyCategoryEl.value))
                throw "Invalid propertyCategory input";
        
            if (!bedroomsEl.value || 
                !validators.isValidString(bedroomsEl.value) || 
                bedroomsEl.value.trim().length === 0 ||
                !Number.isInteger(parseInt(bedroomsEl.value)))
                throw "Invalid bedrooms input";
        
            if (!bathroomsEl.value || 
                !validators.isValidString(bathroomsEl.value) || 
                bathroomsEl.value.trim().length === 0 ||
                !Number.isInteger(parseInt(bathroomsEl.value)))
                throw "Invalid bathrooms input";
                    
        } catch (e) {
            errors.push(e.message);
        }

        //Show Errors, If None Submit
        if (errors.length > 0) {
            errorDiv.textContent = errors.join('\n');
        } else {
            addPropertyForm.submit();
        }

    });

}

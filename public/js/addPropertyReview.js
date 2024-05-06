import * as validators from '../../helpers.js';

const propertyReviewForm = document.getElementById('propertyReviewForm');
const maintenanceRatingEl = document.getElementById('maintenanceRating');
const locationDesirabilityRatingEl = document.getElementById('locationDesirabilityRating');
const ownerResponsivenessRatingEl = document.getElementById('ownerResponsivenessRating');
const propertyConditionRatingEl = document.getElementById('propertyConditionRating');
const communityRatingEl = document.getElementById('communityRating');
const amenitiesRatingEl = document.getElementById('amenitiesRating');
const reviewTextEl = document.getElementById('reviewText');
const propertyErrorDiv = document.getElementById('errorDiv');

if (propertyReviewForm) {
    
    propertyReviewForm.addEventListener('submit', async (event) => {
        
        event.preventDefault();
        
        const errors = [];

        try {
            // Validation
            const validRatings = [1, 2, 3, 4, 5];

            if (!maintenanceRatingEl.value || 
                !validRatings.includes(parseInt(maintenanceRatingEl.value)))
                throw new Error("Invalid maintenance rating input");

            if (!locationDesirabilityRatingEl.value || 
                !validRatings.includes(parseInt(locationDesirabilityRatingEl.value)))
                throw new Error("Invalid location desirability rating input");

            if (!ownerResponsivenessRatingEl.value || 
                !validRatings.includes(parseInt(ownerResponsivenessRatingEl.value)))
                throw new Error("Invalid owner responsiveness rating input");

            if (!propertyConditionRatingEl.value || 
                !validRatings.includes(parseInt(propertyConditionRatingEl.value)))
                throw new Error("Invalid property condition rating input");

            if (!communityRatingEl.value || 
                !validRatings.includes(parseInt(communityRatingEl.value)))
                throw new Error("Invalid community rating input");

            if (!amenitiesRatingEl.value || 
                !validRatings.includes(parseInt(amenitiesRatingEl.value)))
                throw new Error("Invalid amenities rating input");

            if (!reviewTextEl.value || 
                !validators.isValidString(reviewTextEl.value) || 
                reviewTextEl.value.trim().length === 0)
                throw new Error("Review text is required");

        } catch (error) {
            errors.push(error.message);
        }

        // Show Errors, If None Submit
        if (errors.length > 0) {
            propertyErrorDiv.textContent = errors.join('\n');
        } else {
            propertyReviewForm.submit();
        }
    });
}

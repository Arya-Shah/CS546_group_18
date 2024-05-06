import * as validators from '../../helpers.js';

const landlordReviewForm = document.getElementById('landlordReviewForm');
const kindnessRatingEl = document.getElementById('kindnessRating');
const maintenanceResponsivenessRatingEl = document.getElementById('maintenanceResponsivenessRating');
const overallCommunicationRatingEl = document.getElementById('overallCommunicationRating');
const professionalismRatingEl = document.getElementById('professionalismRating');
const handinessRatingEl = document.getElementById('handinessRating');
const depositHandlingRatingEl = document.getElementById('depositHandlingRating');
const reviewTextEl = document.getElementById('reviewText');
const landlordErrorDiv = document.getElementById('errorDiv');

if (landlordReviewForm) {
    
    landlordReviewForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const errors = [];

        try {
            // Validation
            const validRatings = [1, 2, 3, 4, 5];

            if (!kindnessRatingEl.value || 
                !validRatings.includes(parseInt(kindnessRatingEl.value)))
                throw "Invalid kindness rating input";

            if (!maintenanceResponsivenessRatingEl.value || 
                !validRatings.includes(parseInt(maintenanceResponsivenessRatingEl.value)))
                throw "Invalid maintenance responsiveness rating input";

            if (!overallCommunicationRatingEl.value || 
                !validRatings.includes(parseInt(overallCommunicationRatingEl.value)))
                throw "Invalid overall communication rating input";

            if (!professionalismRatingEl.value || 
                !validRatings.includes(parseInt(professionalismRatingEl.value)))
                throw "Invalid professionalism rating input";

            if (!handinessRatingEl.value || 
                !validRatings.includes(parseInt(handinessRatingEl.value)))
                throw "Invalid handiness rating input";

            if (!depositHandlingRatingEl.value || 
                !validRatings.includes(parseInt(depositHandlingRatingEl.value)))
                throw "Invalid deposit handling rating input";

            if (!reviewTextEl.value || 
                !validators.isValidString(reviewTextEl.value) || 
                reviewTextEl.value.trim().length === 0)
                throw "Review text is required";

        } catch (e) {
            errors.push(e.message);
        }

        // Show Errors, If None Submit
        if (errors.length > 0) {
            landlordErrorDiv.textContent = errors.join('\n');
        } else {
            landlordReviewForm.submit();
        }
    });
}
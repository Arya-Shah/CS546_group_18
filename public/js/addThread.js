import * as validators from '../../helpers.js';

const addThreadForm = document.getElementById('addThread-form');
const titleEl = document.getElementById('title');
const contentEl = document.getElementById('content');
const categoryEl = document.getElementById('category');
const errorDiv = document.getElementById('errorDiv');

if (addThreadForm) {
    
    addThreadForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const errors = [];

        try {
            // Validation
            const title = titleEl.value.trim();
            const content = contentEl.value.trim();
            const category = categoryEl.value.trim();

            if (!title || !validators.isValidString(title)) {
                throw "Invalid title input";
            }

            if (!content || !validators.isValidString(content)) {
                throw "Invalid content input";
            }

            if (!category || !validators.isValidString(category) || !validators.isValidThreadCategory(category)) {
                throw "Invalid category input";
            }
        } catch (e) {
            errors.push(e);
        }

        // Show Errors, If None Submit
        if (errors.length > 0) {
            errorDiv.textContent = errors.join('\n');
        } else {
            addThreadForm.submit();
        }
    });
}

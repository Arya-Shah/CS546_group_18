const usernameEl = document.querySelector('#username');
const passwordEl = document.querySelector('#password');
const form = document.querySelector('#signin-form');


const checkUsername = () => {
    let valid = false;
    const min = 5,
        max = 10;
    const username = usernameEl.value.trim();
    if (!isRequired(username)) {
        showError(usernameEl, 'Username cannot be blank.');
    } else if (!isBetween(username.length, min, max)) {
        showError(usernameEl, `Username must be between ${min} and ${max} characters.`)
    } else {
        showSuccess(usernameEl);
        valid = true;
    }
    return valid;
};

const checkPassword = () => {
    let valid = false;
    const password = passwordEl.value.trim();
    if (!isRequired(password)) {
        showError(passwordEl, 'Password cannot be blank.');
    } else if(!/[!@#$%^&*(),.?":{}|<>]/.test(password) || !/[A-Z]/.test(password) || !/[0-9]/.test(password)) {
        showError(passwordEl, 'There needs to be at least one uppercase character, there has to be at least one number and there has to be at least one special character');
    } else {
        showSuccess(passwordEl);
        valid = true;
    }
    return valid;
};

const isRequired = value => value === '' ? false : true;
const isBetween = (length, min, max) => length < min || length > max ? false : true;
const showError = (input, message) => {
    const formField = input.parentElement;
    formField.classList.remove('success');
    formField.classList.add('error');

    const error = formField.querySelector('small');
    error.textContent = message;
};

const showSuccess = (input) => {
    const formField = input.parentElement;
    formField.classList.remove('error');
    formField.classList.add('success');

    const error = formField.querySelector('small');
    error.textContent = '';
}


form.addEventListener('submit', function (e) {
    e.preventDefault();
    let isUsernameValid = checkUsername(),
        isPasswordValid = checkPassword()
    let isFormValid = isUsernameValid &&
        isPasswordValid
    if (isFormValid) {
        form.submit();
    }
});

form.addEventListener('input', function (e) {
    switch (e.target.id) {
        case 'username':
            checkUsername();
            break;
        case 'password':
            checkPassword();
    }
});

document.addEventListener('DOMContentLoaded', function() {
    // Get the current URL pathname
    const currentPath = window.location.pathname;


    // Check if the current page is the '/report' page
    if (currentPath === '/report/:reportState/:id') {
        const reportForm = document.getElementById('reportForm');
        if (reportForm) {
            reportForm.addEventListener('submit', (event) => {
                // Validate report form fields
                const isValid = validateReportForm();
                if (!isValid) {
                    event.preventDefault(); // Prevent form submission

                    // Display error message to the user
                    const errorElement = document.getElementById('reportedItemIdError');
                    errorElement.style.color = 'red';
                    errorElement.innerText = 'Please fill in all fields.';
                }
            });
        }
    }
});

function validateReportForm() {
    const reportedItemType = document.getElementById('reportedItem_type').value;
    const reportedItemId = document.getElementById('reportedItemId').value;
    const reportReason = document.getElementById('reportReason').value;
    return (reportedItemType && reportedItemId && reportReason);
}

$(document).ready(() => {
    $('#searchForm').show();
    $('#searchForm').submit((event) => {
        event.preventDefault();
        const searchType = $('#searchType').val().trim();
        $('#searchResults').empty();
        if (searchType === '') {
            alert('Please select a search type to filter what exaclty are you searching for!');
            return;
        }
        const searchTerm = $('#searchQuery').val().trim();
        if (searchTerm === '') {
            alert('Please enter text in search bar to get results.');
            return;
        }
    })
});
const usernameEl = document.querySelector('#username');
const passwordEl = document.querySelector('#password');
const firstNameEl = document.querySelector('#firstname');
const lastNameEl = document.querySelector('#lastname');
const confirmPasswordEl = document.querySelector('#confirmpassword');
const form = document.querySelector('#signin-form');
const signupform = document.querySelector('#signup-form');

const checkFirstName = () => {
    let valid = false;
    const firstName = firstNameEl.value.trim();
    if (!isRequired(firstName)) {
        showError(firstNameEl, 'First name cannot be blank.');
    } else {
        showSuccess(firstNameEl);
        valid = true;
    }
    return valid;
};

const checkLastName = () => {
    let valid = false;
    const lastName = lastNameEl.value.trim();
    if (!isRequired(lastName)) {
        showError(lastNameEl, 'Last name cannot be blank.');
    } else {
        showSuccess(lastNameEl);
        valid = true;
    }
    return valid;
};

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

const checkConfirmPassword = () => {
    let valid = false;
    // Check if confirm password is not blank and if it matches the password
    const confirmPassword = confirmPasswordEl.value.trim();
    const password = passwordEl.value.trim();
    if (!isRequired(confirmPassword)) {
        showError(confirmPasswordEl, 'Please confirm your password.');
    } else if (password !== confirmPassword) {
        showError(confirmPasswordEl, 'Passwords do not match.');
    } else {
        showSuccess(confirmPasswordEl);
        valid = true;
    }
    return valid;
};

const isRequired = value => value === '' ? false : true;
const isBetween = (length, min, max) => length < min || length > max ? false : true;
const showError = (input, message) => {
    // get the form-field element
    const formField = input.parentElement;
    // add the error class
    formField.classList.remove('success');
    formField.classList.add('error');

    // show the error message
    const error = formField.querySelector('small');
    error.textContent = message;
};

const showSuccess = (input) => {
    // get the form-field element
    const formField = input.parentElement;

    // remove the error class
    formField.classList.remove('error');
    formField.classList.add('success');

    // hide the error message
    const error = formField.querySelector('small');
    error.textContent = '';
}


form.addEventListener('submit', function (e) {
    // prevent the form from submitting
    e.preventDefault();
    // validate fields
    let isUsernameValid = checkUsername(),
        isPasswordValid = checkPassword()
    let isFormValid = isUsernameValid &&
        isPasswordValid
    // submit to the server if the form is valid
    if (isFormValid) {
        form.submit();
    }
});

// signupform.addEventListener('submit', function (e) {
//     // prevent the form from submitting
//     e.preventDefault();
//     // validate fields
//     let isUsernameValid = checkUsername(),
//         isPasswordValid = checkPassword(),
//         isFirstNameValid = checkFirstName(),
//         isLastNameValid = checkLastName(),
//         isConfirmPasswordValid = checkConfirmPassword()
//     let isFormValid = isUsernameValid &&
//         isPasswordValid &&
//         isFirstNameValid &&
//         isLastNameValid &&
//         isConfirmPasswordValid;

//     // submit to the server if the form is valid
//     if (isFormValid) {
//         signupform.submit();
//     }
// });

form.addEventListener('input', function (e) {
    switch (e.target.id) {
        case 'username':
            checkUsername();
            break;
        case 'password':
            checkPassword();
    }
});

// signupform.addEventListener('input', function (e) {
//     switch (e.target.id) {
//         case 'first-name':
//             checkFirstName();
//             break;
//         case 'last-name':
//             checkLastName();
//             break;
//         case 'username':
//             checkUsername();
//             break;
//         case 'password':
//             checkPassword();
//             break;
//         case 'confirm-password':
//             checkConfirmPassword();
//             break;
//     }
// });

const reportForm= document.getElementById('reportForm');
// console.log(reportForm);
// const reportForm = document.querySelector('#reportForm');
reportForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const min = 5,
        max = 10;
    const reportedItemId = document.getElementById('reportedItemId');
    const reportReason = document.getElementById('reportReason');
    if (!isRequired(reportReason)) {
        showError(reportReason, 'reportReason cannot be blank.');
    }else if (!isBetween(username.length, min, max)) {
        showError(usernameEl, `Username must be between ${min} and ${max} characters.`)
    }
    console.log(reportedItemId,reportReason);
    const reportedItemIdError = document.getElementById('reportedItemIdError');
    const reportReasonError = document.getElementById('reportReasonError');
    reportedItemId.classList.remove('error');
    reportReason.classList.remove('error');
    reportedItemIdError.textContent = "";
    reportReasonError.textContent = "";

    let isValid = true;
    if (!reportedItemId.value) {
        isValid = false;
        reportedItemId.classList.add('error');
        reportedItemIdError.textContent = "Please select a reason";
    }
    if (!reportReason.value.trim()|| reportReason.value === '') {
        isValid = false;
        reportReason.classList.add('error');
        reportReasonError.textContent = "Please provide a reason for the report";
    }

    if (isValid) {
        this.submit();
    }
});



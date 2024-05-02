const usernameEl = document.querySelector('#username');
const passwordEl = document.querySelector('#password');
const firstNameEl = document.querySelector('#firstname');
const lastNameEl = document.querySelector('#lastname');
const confirmPasswordEl = document.querySelector('#confirmpassword');
const emailEl = document.querySelector('#email');
const cityEl = document.querySelector('#city');
const form = document.querySelector('#signup-form');


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

const checkConfirmPassword = () => {
    let valid = false;
    const confirmPassword = confirmPasswordEl.value.trim();
    const password = passwordEl.value.trim();
    if (!isRequired(confirmPassword)) {
        showError(confirmPasswordEl, 'Please confirm your password.');
    } else if (confirmPassword !== password) {
        showError(confirmPasswordEl, 'Passwords do not match.');
    } else {
        showSuccess(confirmPasswordEl);
        valid = true;
    }
    return valid;
};

const checkEmail = () => {
    let valid = false;
    const email = emailEl.value.trim();
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!isRequired(email)) {
        showError(emailEl, 'Email cannot be blank.');
    } else if (!pattern.test(email)) {
        showError(emailEl, 'Please enter a valid email address.');
    } else {
        showSuccess(emailEl);
        valid = true;
    }
    return valid;
};

const checkCity = () => {
    let valid = false;
    const city = cityEl.value.trim();
    if (!isRequired(city)) {
        showError(cityEl, 'City cannot be blank.');
    } else {
        showSuccess(cityEl);
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
        isPasswordValid = checkPassword(),
        isFirstNameValid = checkFirstName(),
        isLastNameValid = checkLastName(),
        isConfirmPasswordValid = checkConfirmPassword(),
        isEmailValid = checkEmail(),
        isCityValid = checkCity();

    let isFormValid = isUsernameValid &&
        isPasswordValid &&
        isFirstNameValid &&
        isLastNameValid &&
        isConfirmPasswordValid &&
        isEmailValid &&
        isCityValid;

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
            break;
        case 'firstname':
            checkFirstName();
            break;
        case 'lastname':
            checkLastName();
            break;
        case 'confirmpassword':
            checkConfirmPassword();
            break;
        case 'email':
            checkEmail();
            break;
        case 'city':
            checkCity();
            break;
    }
});
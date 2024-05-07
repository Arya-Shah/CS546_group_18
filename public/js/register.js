const usernameE = document.querySelector('#username');
const passwordE = document.querySelector('#password');
const firstNameE = document.querySelector('#firstname');
const lastNameE = document.querySelector('#lastname');
const confirmPasswordE = document.querySelector('#confirmpassword');
const emailE = document.querySelector('#email');
const cityE = document.querySelector('#city');
const formRegister = document.querySelector('#signup-form');


const checkUsername = () => {
    let valid = false;
    const min = 5,
        max = 10;
    const username = usernameE.value.trim();
    if (!isRequired(username)) {
        showError(usernameE, 'Username cannot be blank.');
    } else if (!isBetween(username.length, min, max)) {
        showError(usernameE, `Username must be between ${min} and ${max} characters.`)
    } else {
        showSuccess(usernameE);
        valid = true;
    }
    return valid;
};

const checkPassword = () => {
    let valid = false;
    const password = passwordE.value.trim();
    if (!isRequired(password)) {
        showError(passwordE, 'Password cannot be blank.');
    } else if(!/[!@#$%^&*(),.?":{}|<>]/.test(password) || !/[A-Z]/.test(password) || !/[0-9]/.test(password)) {
        showError(passwordE, 'There needs to be at least one uppercase character, there has to be at least one number and there has to be at least one special character');
    } else {
        showSuccess(passwordE);
        valid = true;
    }
    return valid;
};

const checkFirstName = () => {
    let valid = false;
    const firstName = firstNameE.value.trim();
    if (!isRequired(firstName)) {
        showError(firstNameE, 'First name cannot be blank.');
    } else {
        showSuccess(firstNameE);
        valid = true;
    }
    return valid;
};

const checkLastName = () => {
    let valid = false;
    const lastName = lastNameE.value.trim();
    if (!isRequired(lastName)) {
        showError(lastNameE, 'Last name cannot be blank.');
    } else {
        showSuccess(lastNameE);
        valid = true;
    }
    return valid;
};

const checkConfirmPassword = () => {
    let valid = false;
    const confirmPassword = confirmpasswordE.value.trim();
    const password = passwordE.value.trim();
    if (!isRequired(confirmPassword)) {
        showError(confirmpasswordE, 'Please confirm your password.');
    } else if (confirmPassword !== password) {
        showError(confirmpasswordE, 'Passwords do not match.');
    } else {
        showSuccess(confirmpasswordE);
        valid = true;
    }
    return valid;
};

const checkEmail = () => {
    let valid = false;
    const email = emailE.value.trim();
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!isRequired(email)) {
        showError(emailE, 'Email cannot be blank.');
    } else if (!pattern.test(email)) {
        showError(emailE, 'Please enter a valid email address.');
    } else {
        showSuccess(emailE);
        valid = true;
    }
    return valid;
};

const checkCity = () => {
    let valid = false;
    const city = cityE.value.trim();
    if (!isRequired(city)) {
        showError(cityE, 'City cannot be blank.');
    } else {
        showSuccess(cityE);
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


formRegister.addEventListener('submit', function (e) {
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

formRegister.addEventListener('input', function (e) {
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
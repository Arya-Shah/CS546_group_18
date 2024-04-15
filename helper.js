// valid strings
export const isValidString = (str) => {
if (typeof str !== 'string' || str.trim().length === 0) return false;
return true;
};

// valid email 
export const isValidEmail = (email) => {
const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,2}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
return re.test(String(email).toLowerCase());
};

// valid UUID format
export const isValidUuid = (uuid) => {
const re = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
return re.test(uuid);
};

// valid password (example: at least one number, one lowercase and one uppercase letter, at least six characters)
export const isValidPassword = (password) => {
const re = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}$/;
return re.test(password);
};

// valid boolean type
export const isBoolean = (bool) => {
return typeof bool === 'boolean';
};

export default {
isValidString,
isValidEmail,
isValidUuid,
isValidPassword,
isBoolean
};

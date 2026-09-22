const validator = require("validator");

const validateSignupData = (req) => {
  const { firstName, lastName, email, password } = req.body;

  if (!firstName || !lastName) {
    throw new Error("First name and last name are required");
  } else if (!validator.isEmail(email)) {
    throw new Error("Invalid email");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Password is not strong enough");
  }
};

const validateProfileEditData = (req) => {
  const allowedEditFields = [
    'firstName',
    'lastName',
    'age',
    'gender',
    'photourl',
    'about',
    'skills',
  ];
  const editFields = Object.keys(req.body);

  const isValidOperation = editFields.every((field) =>
    allowedEditFields.includes(field)
  );

  if (!isValidOperation) {
    throw new Error("Invalid edit fields");
  }
};

module.exports = {
  validateSignupData,
  validateProfileEditData,
};

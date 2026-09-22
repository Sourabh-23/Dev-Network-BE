const User = require('../models/user');
const { validateProfileEditData } = require('../utils/validation');
const bcrypt = require('bcrypt');
const validator = require('validator');

const viewProfile = async (req, res) => {
  try {
    const user = req.user;
    console.log(`User from profile route: ${user}`);

    res.send(user);
  } catch (err) {
    res.status(400).send('Something went wrong ' + err.message);
  }
};

const editProfile = async (req, res) => {
  try {
    // The database field is named `photourl`; accept the client-friendly
    // camelCase alias without allowing Mongoose to silently discard it.
    if (req.body.photoUrl !== undefined && req.body.photourl === undefined) {
      req.body.photourl = req.body.photoUrl;
    }
    delete req.body.photoUrl;

    validateProfileEditData(req);

    const loggedInuser = req.user;

    Object.keys(req.body).forEach((key) => {
      loggedInuser[key] = req.body[key];
    });

    await loggedInuser.save();

    const user = loggedInuser.toObject();
    delete user.password;
    user.photoUrl = user.photourl;

    res.send({ message: 'Profile updated successfully', data: user });
  } catch (err) {
    res.status(400).send('Something went wrong ' + err.message);
  }
};

const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      throw new Error('Current password and new password are required');
    }

    const loggedInUser = req.user;

    const isPasswordValid = await loggedInUser.validatePassword(currentPassword);
    if (!isPasswordValid) {
      throw new Error('Current password is incorrect');
    }

    if (!validator.isStrongPassword(newPassword)) {
      throw new Error('New password is not strong enough');
    }

    const newPasswordHash = await bcrypt.hash(newPassword, 10);
    loggedInUser.password = newPasswordHash;
    await loggedInUser.save();

    res.clearCookie('token');
    res.send('Password changed successfully. Please login again');
  } catch (err) {
    res.status(400).send('Something went wrong ' + err.message);
  }
};

module.exports = { viewProfile, editProfile, changePassword };

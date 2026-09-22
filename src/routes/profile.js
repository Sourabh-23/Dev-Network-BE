const express = require('express');
const profileRouter = express.Router();
const { userAuth } = require('../../middlewares/auth');
const {
  viewProfile,
  editProfile,
  changePassword,
} = require('../controllers/profileController');

profileRouter.get('/profile/view', userAuth, viewProfile);
profileRouter.patch('/profile/edit', userAuth, editProfile);
profileRouter.patch('/profile/password', userAuth, changePassword);

module.exports = profileRouter;

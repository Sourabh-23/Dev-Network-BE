const express = require('express');
const userRouter = express.Router();
const { userAuth } = require('../../middlewares/auth');
const {
  getUser,
  deleteUser,
  updateUser,
  getReceivedRequests,
  getConnections,
  getFeed,
} = require('../controllers/userController');

userRouter.get('/user', userAuth, getUser);
userRouter.delete('/user', userAuth, deleteUser);
userRouter.patch('/user/:id', userAuth, updateUser);
userRouter.get('/user/requests/received', userAuth, getReceivedRequests);
userRouter.get('/user/connections', userAuth, getConnections);
userRouter.get('/feed', userAuth, getFeed);

module.exports = userRouter;
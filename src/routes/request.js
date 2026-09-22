const express = require('express');
const requestRouter = express.Router();
const { userAuth } = require('../../middlewares/auth');
const { sendRequest, reviewRequest } = require('../controllers/requestController');

requestRouter.post('/request/send/:status/:toUserId', userAuth, sendRequest);
requestRouter.post('/request/review/:status/:requestId', userAuth, reviewRequest);

module.exports = requestRouter;

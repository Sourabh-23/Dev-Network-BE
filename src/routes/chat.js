const express = require('express');
const chatRouter = express.Router();
const { userAuth } = require('../../middlewares/auth');
const { getChat } = require('../controllers/chatController');

chatRouter.get('/chat/:targetUserId', userAuth, getChat);

module.exports = chatRouter;

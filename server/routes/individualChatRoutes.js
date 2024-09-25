const express = require('express');
const { createChat, userChat, findChat } = require('../controller/chatController');
const { getMessagesBetweenUsers } = require('../controller/messageController');
const authMiddleware = require('../middleware/authMiddleware.js');

const router = express.Router();

// Define routes
router.post('/', authMiddleware, createChat);
router.get('/:userId', authMiddleware, userChat);
router.get('/find/:firstId/:secondId', authMiddleware, findChat);
router.get('/between/:userId/:receiverId', getMessagesBetweenUsers);

module.exports = router;

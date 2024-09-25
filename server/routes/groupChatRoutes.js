const express = require('express');
const { createGroupChat, sendGroupMessage, getGroupMessages } = require('../controller/groupChatController');
const authMiddleware = require('../middleware/authMiddleware.js');

const router = express.Router();

router.post('/create', authMiddleware, createGroupChat); // Create a new group chat
router.post('/send', authMiddleware, sendGroupMessage); // Send a group message
router.get('/messages', authMiddleware, getGroupMessages); // Get messages from a group chat

module.exports = router;

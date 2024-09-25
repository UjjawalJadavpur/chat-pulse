const express = require('express');
const { createChat, userChat, findChat } = require('../controller/chatController');

const router = express.Router();

// Define routes
router.post('/', createChat);
router.get('/:userId', userChat);
router.get('/find/:firstId/:secondId', findChat);

module.exports = router;

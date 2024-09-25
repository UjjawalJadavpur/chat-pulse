const express = require('express');
const { addMessage, getMessages, getMessagesBetweenUsers } = require('../controller/messageController'); // Import functions

const router = express.Router();

//router.post('/', addMessage);
router.post('/send', addMessage);
router.get('/:chatId', getMessages);
router.get('/between/:userId/:receiverId', getMessagesBetweenUsers);


module.exports = router;

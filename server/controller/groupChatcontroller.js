const GroupChatModel = require('../Schema/groupChatSchema'); // Assuming you have a Group Chat model
const MessageModel = require('../Schema/messageSchema');
const IndividualMessageModel = require('../Schema/IndividualChatSchema'); // For individual messages
const { User } = require('../Schema/UserSchema'); // For user lookups

// Create a new group chat
const createGroupChat = async (req, res) => {
    const { members } = req.body; // Expecting members to be an array

    if (!members || !Array.isArray(members) || members.length === 0) {
        return res.status(400).json({ error: 'Members are required to create a group chat' });
    }

    try {
        const newGroupChat = new GroupChatModel({ members });
        const savedGroupChat = await newGroupChat.save();
        res.status(201).json(savedGroupChat);
    } catch (error) {
        console.error("Error creating group chat:", error);
        res.status(500).json({ message: 'Failed to create group chat', error: error.message });
    }
};

// Send a group message
const sendGroupMessage = async (req, res) => {
    const { chatId, senderId, text } = req.body;

    if (!chatId || !senderId || !text) {
        return res.status(400).json({ error: 'Chat ID, sender ID, and message text are required' });
    }

    try {
        const newMessage = new MessageModel({
            room: chatId, // Associate the message with the chat room
            author: senderId,
            message: text,
        });

        const savedMessage = await newMessage.save();
        res.status(201).json(savedMessage);
    } catch (error) {
        console.error("Error sending group message:", error);
        res.status(500).json({ message: 'Failed to send message', error: error.message });
    }
};

// Get messages from a group chat
const getGroupMessages = async (req, res) => {
    const { chatId } = req.query; // Using query params for chatId

    if (!chatId) {
        return res.status(400).json({ error: 'Chat ID is required' });
    }

    try {
        const messages = await MessageModel.find({ room: chatId }).populate('author', 'name email').sort({ createdAt: -1 }); // Populate author info
        res.status(200).json(messages);
    } catch (error) {
        console.error("Error fetching group messages:", error);
        res.status(500).json({ message: 'Failed to fetch messages', error: error.message });
    }
};

module.exports = { createGroupChat, sendGroupMessage, getGroupMessages };

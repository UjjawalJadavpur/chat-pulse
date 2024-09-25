const MessageModel = require('../Schema/messageSchema');
const IndividualMessageModel = require('../Schema/IndividualChatSchema');

const addMessage = async (req, res) => {
  //  const { chatId, senderId, text } = req.body;
    const { sender, receiver, message } = req.body;
    // const newMessage = new MessageModel({
    const newMessage = new IndividualMessageModel({
      //  chatId, senderId, text,
      sender, receiver, message,
    });
    try {
        const result = await newMessage.save();
        res.status(201).json(result);
    } catch (error) {
        console.error("Error adding message:", error);
        res.status(500).json({ message: 'Failed to add message', error: error.message });
    }
};

const getMessages = async (req, res) => {
    const { chatId } = req.params;
    try {
        // const messages = await MessageModel.find({ chatId });
        const messages = await IndividualMessageModel.find({ chatId });
        res.status(200).json(messages);
    } catch (error) {
        console.error("Error fetching messages:", error);
        res.status(500).json({ message: 'Failed to fetch messages', error: error.message });
    }
};

const getMessagesBetweenUsers = async (req, res) => {
    const { userId, receiverId } = req.params;
    console.log("userId, receiverId : ",userId,receiverId);

    try {
        const messages = await IndividualMessageModel.find({
            $or: [
                { sender: userId, receiver: receiverId },
                { sender: receiverId, receiver: userId }
            ]
        }).sort({ createdAt: 1 }); // Sort by creation date

        console.log("Conversation found :-",messages);

        res.status(200).json(messages);
    } catch (error) {
        console.error("Error fetching messages:", error);
        res.status(500).json({ message: 'Failed to fetch messages', error: error.message });
    }
};

module.exports = { addMessage, getMessages, getMessagesBetweenUsers };


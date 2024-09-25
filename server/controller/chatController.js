const Chat = require('../Schema/IndividualChatSchema.js');

const createChat = async(req,res)=>{
    const { senderId, receiverId } = req.body;
    
    const existingChat = await Chat.findOne({
        members: { $all: [senderId, receiverId] }
    });

    if (existingChat) {
        return res.status(400).json({ message: 'Chat already exists' });
    }

    const newChat = new Chat({
        members: [senderId, receiverId]
    });

    try {
        const result = await newChat.save();
        res.status(201).json(result);
    } catch (error) {
        console.error("Error creating chat:", error);
        res.status(500).json({ message: 'Failed to create chat', error: error.message });
    }
};

const userChat = async(req,res)=>{   
    try {
           const chats = await Chat.find({
            members:{$in: [req.params.userId]}
           });
        res.status(200).json(chats)
        
    } catch (error) {
        console.error("Error fetching user chats:", error);
        res.status(500).json({ message: 'Failed to fetch user chats', error: error.message });    
    }
}

const findChat = async(req,res)=>{
    try {
        const chat = await Chat.find({
            members:{$all:[req.params.firstId, req.params.secondId]}
        });
        console.log("find_chat: ",chat);
        res.status(200).json(chat);
        
    } catch (error) {
        console.error("Error finding chat:", error);
        res.status(500).json({ message: 'Failed to find chat', error: error.message });        
    }
} 
module.exports = {createChat, userChat, findChat};

// export default {createChat, userChat,findChat};
// export default userChat;
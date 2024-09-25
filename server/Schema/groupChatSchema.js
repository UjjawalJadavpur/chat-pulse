const mongoose = require('mongoose');

const groupChatSchema = new mongoose.Schema({
    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', 
        required: true
    }],
    roomId: {
        type: String,
        required: true,
        unique: true,
    },
}, { timestamps: true }); 

const GroupChat = mongoose.model('GroupChat', groupChatSchema);

module.exports = GroupChat;

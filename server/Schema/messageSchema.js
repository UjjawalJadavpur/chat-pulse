// messageSchema.js
const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  roomId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'GroupChat',
    required: true,
},
author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
},
message: {
    type: String,
    required: true,
},
  image: Buffer,
}, { timestamps: true });

const Message = mongoose.model('Message', messageSchema);
module.exports = Message;

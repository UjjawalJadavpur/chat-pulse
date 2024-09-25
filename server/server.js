const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');
const connectDB = require('./Schema/db');
const Message = require('./Schema/messageSchema');
const IndividualSchema = require('./Schema/IndividualChatSchema'); 
require('dotenv').config();
console.log('JWT Secret:', process.env.JWT_SECRET);



const app = express();
const server = http.createServer(app);
const PORT =  3009;


connectDB();


app.use(cors());
app.use(express.json());


const registerRoutes = require('./routes/registerRoutes');
const loginRoutes = require('./routes/loginRoutes');
const individualChatRoutes = require('./routes/individualChatRoutes'); 
const groupChatRoutes = require('./routes/groupChatRoutes'); 
const userRoutes = require('./routes/userRoutes');

app.use('/register', registerRoutes);
app.use('/login', loginRoutes);
app.use('/individual-chat', individualChatRoutes); 
app.use('/group-chat', groupChatRoutes); 
app.use('/users', userRoutes);


const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", 
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on("join_room", (room) => {
    socket.join(room);
    console.log(`User ${socket.id} joined room ${room}`);
  });

  socket.on("send_group_message", async (data) => {
    try {
      if (!data || !data.room || !data.author || !data.message) {
        throw new Error('Invalid message data');
      }

      const savedMessage = await Message.create(data);

      io.to(data.room).emit("receive_group_message", savedMessage);
    } catch (error) {
      console.error("Error sending group message:", error.message);
    }
  });

  socket.on("send_individual_message", async (data) => {
    try {
      console.log("SEND_indiviual_message__ -Received message data:", data);
      if (!data || !data.receiver || !data.sender || !data.message) {
        throw new Error('Invalid message data');
      }

      // data.sender='User2';
  
      const savedMessage = await IndividualSchema.create(data);
      console.log("Saved message:", savedMessage);
  
      socket.broadcast.emit("receive_individual_message", savedMessage);
      // io.to(data.sender).emit("receive_individual_message", savedMessage);
    } catch (error) {
      console.error("Error sending individual message:", error.message);
    }
  });

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

server.listen(PORT, () => {
  console.log(`Server is live on port ${PORT}`);
});

import React, { useEffect, useRef, useState } from 'react';
import './Room.css';
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client';

const socket = io("http://localhost:3009");

const Room = () => {  //{ state: { socket, username, room } }
  const [currentMessage, setCurrentMessage] = useState("");
  const [messageList, setMessageList] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const endOfMessagesRef = useRef(null); // Ref for auto-scrolling

  const navigate = useNavigate();

  const room = localStorage.getItem('room');
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const username = storedUser.name;

  const sendMessage = async () => {
    if (currentMessage.trim() !== "") {
      const messageData = {
        room: room,
        author: username,
        message: currentMessage,
        time: new Date(Date.now()).toLocaleTimeString(),
      };
  
      socket.emit("send_group_message", messageData);
  
      if (!messageList.find(msg => msg.message === messageData.message)) {
        setMessageList((list) => [...list, messageData]);
      }
  
      setCurrentMessage("");
    }
  };

  useEffect(() => {
    const handleReceiveMessage = (data) => {
      console.log("Received message:", data);
  
      if (data.author !== username) {
        setMessageList((list) => [...list, data]);
      }
    };
    
    const handleReceiveImage = (imageData) => {
      console.log("Received image:", imageData); 
      setMessageList((list) => [...list, { image: imageData }]);
    };

    const handlePreviousMessages = (messages) => {
      console.log("Received previous messages:", messages); 
      setMessageList(messages);
    };

    socket.on("receive_group_message", handleReceiveMessage);
    socket.on("receive_image", handleReceiveImage);
    socket.on("previous_messages", handlePreviousMessages);

    socket.emit("join_room", room);

    return () => {
      socket.off("receive_group_message", handleReceiveMessage);
      socket.off("receive_image", handleReceiveImage);
      socket.off("previous_messages", handlePreviousMessages);
    };
  }, [socket, room, username]);

  useEffect(() => {
    // Scroll to the bottom whenever messages change
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messageList]);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(file);
    }
  };

  const handleUpload = () => {
    if (selectedImage) {
      const reader = new FileReader();
      reader.onloadend = () => {
        console.log("Image data:", reader.result); // Debugging line
        socket.emit('image-upload', reader.result);
        setSelectedImage(null); // Clear the image after uploading
      };
      reader.readAsArrayBuffer(selectedImage);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    //  socket.disconnect();
    navigate('/login');
  };

  return (
    <div className='chat-container'>
      <div className='chat-header'>
        <h4>Room Id - {room}</h4>
      </div>
      <div className='chat-body'>
        {messageList.map((messageContent, index) => (
          <div
            key={index} // Ensure a unique key for each message
            className={`message ${messageContent.author === username ? 'self' : 'author'}`}
          >
            <strong>{messageContent.author}</strong>: {messageContent.message}
            {messageContent.image && (
              <img
                src={`data:image/jpeg;base64,${btoa(
                  String.fromCharCode(...new Uint8Array(messageContent.image))
                )}`}
                alt="Uploaded"
                style={{ maxWidth: '200px', maxHeight: '200px' }} // Ensure the image fits well in the chat
              />
            )}
          </div>
        ))}
        <div ref={endOfMessagesRef} /> {/* Scroll to this div */}
      </div>
      <div className='chat-footer'>
        <input
          type='text'
          placeholder='Type a message...'
          value={currentMessage}
          onChange={(e) => setCurrentMessage(e.target.value)}
        />
        <div className='file-upload'>
          <input type="file" accept="image/*" onChange={handleImageChange} />
          <button onClick={handleUpload} style={{ margin: "5px", width: "20%" }}>
            Upload Image
          </button>
        </div>
        <button onClick={sendMessage}>Send</button>
      </div>
      <button onClick={handleLogout} className="logoutButton">Logout</button>
    </div>
  );
};

export default Room;

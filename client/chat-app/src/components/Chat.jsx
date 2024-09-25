import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Chat.css";
import io from "socket.io-client";
import Room from './Room';
import IndividualChat from "./IndividualChat";

const socket = io.connect("http://localhost:3009");

const Chat = () => {
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  const [showChat, setShowChat] = useState(false);
  const [showIndividualChat, setShowIndividualChat] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login'); 
    }
  }, [navigate]);

  const joinRoom = () => {
    if (username && room) {
      socket.emit("join_room", room);
      localStorage.setItem('room', room);
      navigate('/room');   //{ state: { socket, username, room } }
     // setShowChat(true);
    }
  };

  const handleIndividualChatClick = () => {
    navigate('/individualChat');
    // setShowIndividualChat(true);
    // setShowChat(false);
  };

  return (
    <div className="enterChatRoom">
    <h3>Join a Chat</h3>
    <button onClick={handleIndividualChatClick} className="personal-chat-button">
      Personal Chat Room
    </button>
    <input
      type="text"
      placeholder="Enter Your Name.."
      onChange={(e) => setUsername(e.target.value)}
    />
    <input
      type="text"
      placeholder="Room Id.."
      onChange={(e) => setRoom(e.target.value)}
    />
    <button onClick={joinRoom} className="join-room-button">
      Join Room
    </button>
  </div>
);
};

export default Chat;

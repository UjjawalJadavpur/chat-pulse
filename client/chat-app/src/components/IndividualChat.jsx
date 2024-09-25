import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import './IndividualChat.css';

const socket = io("http://localhost:3009");

const IndividualChat = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [activeReceiver, setActiveReceiver] = useState(() => {
    const savedReceiver = localStorage.getItem('activeReceiver');
    return savedReceiver ? JSON.parse(savedReceiver) : null ; 
});
//console.log("active Receiver : -",activeReceiver);
  const navigate = useNavigate();
  const storedUser = JSON.parse(localStorage.getItem("user"));
  //console.log("stored user ",storedUser);
  // console.log("stored user id ",storedUser._id);

  const predefinedSender = storedUser.name;
  const predefinedReceiver = "User2";

  

  useEffect(() => {
    // console.log('Component mounted, setting up socket listeners');
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://localhost:3009/users');
        if (!response.ok) throw new Error('Failed to fetch users');
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();

    socket.on("receive_individual_message", (receivedMessage) => {
      console.log({ receivedMessage }, "Received message");
      setMessages((prev) => [...prev, receivedMessage]);
    });

    return () => {
      console.log('Cleaning up socket listeners');
      socket.off("receive_individual_message");
    };
  }, []);

  useEffect(() => {
    const chatWindow = document.querySelector('.messages');
    if (chatWindow) {
      chatWindow.scrollTop = chatWindow.scrollHeight;
    }
  }, [messages]);

  
  useEffect(() => {
    const fetchMessages = async () => {
      if (activeReceiver) {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        try {
          const response = await fetch(`http://localhost:3009/individual-chat/between/${storedUser._id}/${activeReceiver._id}`);
          if (!response.ok) throw new Error('Failed to fetch messages');
          const data = await response.json();
          console.log('Fetched messages:', data);
          setMessages(data);
        } catch (error) {
          console.error('Error fetching messages:', error);
        }
      }
    };
    fetchMessages();
  }, [activeReceiver]);


  // const selectReceiver = (receiver) => {
  //   localStorage.setItem('activeReceiver', JSON.stringify(receiver));
  //   setActiveReceiver(receiver);
  // };

  // useEffect(() => {
  //   const savedReceiver = localStorage.getItem('activeReceiver');
  //   if (savedReceiver) {
  //     setActiveReceiver(savedReceiver);
  //   }
  // }, []);
  
  const selectReceiver = async (receiver) => {
    localStorage.setItem('activeReceiver', JSON.stringify(receiver));
    setActiveReceiver(receiver);
  }

  const sendMessage = () => {
    if (message.trim() && activeReceiver) {
      const timestamp = new Date();
      const msgData = {
        // sender: predefinedSender,
        sender: storedUser._id,
        receiver: activeReceiver._id,  //predefinedReceiver,
        message: message,
        timestamp: timestamp.toISOString(),
      };
      setMessages((prev) => [...prev, msgData]);
      console.log("Sending message:", msgData);

      socket.emit("send_individual_message", msgData);
      setMessage("");
    } else {
      console.log("Message is empty, not sending");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    //  socket.disconnect();
    navigate('/login');
  };

  const formatTimestamp = (isoString) => {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) {
      console.error('Invalid date string:', isoString);
      return 'Invalid Date';
    }
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  

  return (
    <div className="chat-container">
      <h2 className="chat-header">Chat-Pulse</h2>

      <div className='chatWindow'>

        <div className='chatWindowLeft'>
          <div className="user-list">
            <h3>Select Users</h3>
            {users.map(user => (
              <div key={user._id} 
               className={`user-item ${activeReceiver?._id === user._id ? 'selected' : ''}`}    
               onClick={() => selectReceiver(user)}>
                <FontAwesomeIcon icon={faUser} className='userIcon' />
                {user.name}
              </div>
            ))}
          </div>
          <div>
            <button onClick={handleLogout} className="logoutButton">Logout</button>
          </div>
        </div>


        <div className='chatWindowRight'>
          <div className='headerRight'>
            <p>
              Welcome: <strong>{storedUser.name}</strong>!
              <span className='receiverLabel'>Receiver: <strong>{activeReceiver ? activeReceiver.name : "None0"}</strong></span>
            </p>
          </div>
          <div className="messages">
            {messages.length === 0 ? <p>No messages yet</p> : null}

            {messages
              .filter(msg => msg.receiver === activeReceiver?._id || msg.sender === activeReceiver?._id)
              .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)) // Sort by timestamp
              .map((msg, index) => (
                <div
                  key={index}
                  className={`message ${msg.sender === storedUser._id ? 'self' : 'other'}`}
                >
                  <strong>{msg.sender === storedUser._id ? storedUser.name : activeReceiver.name}</strong>: {msg.message}
                  <div className="timestamp">{formatTimestamp(msg.createdAt)}</div>
                </div>
              ))}
          </div>

          <div className="input-group">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a message..."
              className="message-input"
            />
            <button onClick={sendMessage} className="send-button">
              Send
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};

export default IndividualChat;

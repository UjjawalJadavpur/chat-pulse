import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import Chat from './components/Chat';
import Room from './components/Room';
import IndividualChat from './components/IndividualChat.jsx';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/room" element={<Room />} />
        <Route path="/individualChat" element={<IndividualChat />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;

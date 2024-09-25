import React, { useState } from 'react';
import Axios from 'axios';
import { useNavigate, Link } from 'react-router-dom'; 
import './register.css'; 

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); 

  const handleRegister = (e) => {
    e.preventDefault();
    Axios.post('http://localhost:3009/register', {
      name: name,
      email: email,
      password: password,
    })
      .then((response) => {
        console.log(response.data);
        console.log(response);
       // localStorage.setItem("name", name);
        alert('Registration successful!');
        // localStorage.setItem("name", JSON.stringify(name))
        setName('');
        setEmail('');
        setPassword('');
        navigate('/login'); 
      })
      .catch((error) => {
        console.error('Error registering:', error);
        alert('Registration failed!');
      });
  };

  return (
    <div className="register-container">
      <h2>Sign Up</h2>
      <form onSubmit={handleRegister}>
        <input
          type="text"
          placeholder="Enter Your Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <br />
        <input
          type="email"
          placeholder="E-mail Id"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <br />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <br />
        <button type="submit">Register</button>
      </form>
      <div className="login-link">
        <p>Already Registered? <Link to="/login">Login</Link></p>
      </div>
    </div>
  );
};

export default Register;

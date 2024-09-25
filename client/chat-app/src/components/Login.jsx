import React, { useState } from 'react';
import Axios from 'axios';
import { useNavigate, Link } from 'react-router-dom'; 
import './login.css';

const Login = ({name}) => {
  // console.log(name, "name")
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); 

  const handleLogin = (e) => {
    e.preventDefault();
    Axios.post('http://localhost:3009/login', {
      email: email,
      password: password,
    })
      .then((response) => {
        console.log(" Response.data : ", response.data);
        const { user, token } = response.data;

        localStorage.setItem("name", user.name);
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem('token', token);
        
        // alert('Login successful!');
        setEmail('');
        setPassword('');
        navigate('/chat'); 
      })
      .catch((error) => {
        console.error('Error Login:', error);
        alert('Login failed!');
      });
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <input
        type="text"
        placeholder="Enter your Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <br />
      <input
        type="password"
        placeholder="Enter your password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <br />
      <button onClick={handleLogin}>Login</button>
      <div className="register-link">
        <p>Not Registered? <Link to="/">Register</Link></p>
      </div>
    </div>
  );
};

export default Login;

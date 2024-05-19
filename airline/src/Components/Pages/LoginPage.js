import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes, Link, useNavigate} from 'react-router-dom';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';


function LoginPage({onLoginSuccess}) {
    // Implement user login functionality here
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
  
    const handleLogin = async (e) => {
      e.preventDefault();
      try {
        const response = await fetch('http://127.0.0.1:5000/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password })
        });
  
        const data = await response.json();
        if (response.ok && data.role === "admin") {
          onLoginSuccess(username);
          alert(data.message);
          navigate('/adminHome'); // Redirect to home page on successful login
        } 
  
        else if(response.ok){
          onLoginSuccess(username);
          alert(data.message);
          navigate('/userHome'); // Redirect to home page on successful login
        }
        
        else {
          alert(data.message);
          setUsername(username); // Update the username in the state
        }
        
      } catch (error) {
        console.error(error);
        alert('An error occurred during login.');
      }
    };
  
    return (
      <div>
        <h1>Login</h1>
        <form onSubmit={handleLogin}>
          <TextField
            label="Username"
            variant="filled"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            size="small"
            className="text"
          />
          <TextField
            label="Password"
            type="password"
            variant="filled"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            size="small"
            className="text"
          />
          <Button type="submit" variant="contained">Login</Button>
        </form>
      </div>
    );
  }

  export default LoginPage;
  
import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes, Link, useNavigate, useLocation} from 'react-router-dom';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

function SignUpPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
  
    const handleSignUp = async (e) => {
      try {
        e.preventDefault();
        const url = "http://127.0.0.1:5000/signup" 
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        const data = await response.json();
        alert(data.message);
        // Redirect to login or home page on successful sign-up
      } catch (error) {
        console.error(error);
        alert('An error occurred during sign-up.');
      }
    };
  
    return (
        <div>
            <h1>Sign Up</h1>
            <form onSubmit={handleSignUp}>
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
                <Button type="submit" variant="contained">Sign Up</Button>
            </form>
        </div>
    );
  
  }

  export default SignUpPage;
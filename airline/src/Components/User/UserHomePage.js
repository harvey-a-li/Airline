import React, { useState } from "react";
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';

function UserHomePage({ logout }) {

    const [loggedInUser, setLoggedInUser] = useState(localStorage.getItem('user') || 'Guest');
    const navigate = useNavigate();

    const handleLogout = () => {
      logout();
      navigate('/home'); // Redirect to login page on logout
    };

    return (
      <div>
        <h1>Welcome {loggedInUser}!</h1>
        <Button onClick={handleLogout} variant="contained">Logout</Button>
      </div>
    );
  }
  export default UserHomePage;
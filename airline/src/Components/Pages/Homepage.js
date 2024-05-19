import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes, Link, useNavigate, useLocation} from 'react-router-dom';
import Button from '@mui/material/Button';


function Homepage({ logout }) {
    const [loggedInUser, setLoggedInUser] = useState(localStorage.getItem('user') || 'Guest');
    const navigate = useNavigate();
  
    const handleLogout = () => {
      // Clear user data from local storage
      localStorage.removeItem('user');
      setLoggedInUser('Guest');
      navigate('/login'); // Redirect to login page on logout
    };
  
    return (
      <div>
        <h1>Welcome {loggedInUser}</h1>
        {loggedInUser !== 'Guest' && <Button onClick={handleLogout} variant="contained">Logout</Button>}
      </div>
    );
  }
  export default Homepage;
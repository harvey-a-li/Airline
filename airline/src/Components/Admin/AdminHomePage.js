import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes, Link, useNavigate, useLocation} from 'react-router-dom';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

function AdminHomePage({ logout }) {  
    const [loggedInUser, setLoggedInUser] = useState(localStorage.getItem('user') || 'Guest');
    const navigate = useNavigate();
  
    const handleLogout = () => {
      logout();
      navigate('/home'); // Redirect to login page on logout
    };

    return (
      <div>
        <h1>Admin Page</h1>
        {loggedInUser !== 'Guest' && <Button onClick={handleLogout} variant="contained">Logout</Button>}
      </div>
    );
  }

  export default AdminHomePage;
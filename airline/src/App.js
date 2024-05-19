import React, { useState, useEffect} from "react";
import { BrowserRouter as Router, Route, Routes, Link, useNavigate, useLocation, Navigate} from 'react-router-dom';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

import NavBar from './Components/NavBar';

import Homepage from './Components/Pages/Homepage';
import LoginPage from './Components/Pages/LoginPage';
import SignUpPage from './Components/Pages/SignUpPage';
import FlightsPage from './Components/Pages/FlightsPage';

import UserHomePage from './Components/User/UserHomePage';

import AdminHomePage from './Components/Admin/AdminHomePage';
import AddFlightsPage from './Components/Admin/AddFlightsPage';
import AdminViewFlights from './Components/Admin/AdminViewFlights';
import ModifyFlightsPage from './Components/Admin/ModifyFlightsPage';
import ModifyFlight from './Components/Admin/ModifyFlight';

function App() {
  const [username, setUsername] = useState('guest');

  useEffect(() => {
    // Check local storage for user info
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUsername(storedUser);
    }
  }, []);

  const handleLoginSuccess = (username) => {
    localStorage.setItem('user', username);
    setUsername(username);
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUsername('guest'); // Update the username state to 'guest'
  };

  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <NavBar />
        </header>
        <Routes>
          <Route path="/" element={<Navigate to="/home" />} />
          <Route path="/home" element={<Homepage logout={logout}/>} />
          <Route path="/login" element={<LoginPage onLoginSuccess={handleLoginSuccess}/>} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/flights" element={<FlightsPage />} />
          <Route path="/userHome" element={<UserHomePage logout={logout} />} />
          <Route path="/adminHome" element={<AdminHomePage logout={logout} />} />
          <Route path= "/add" element = {<AddFlightsPage />} />
          <Route path= "/adminView" element = {<AdminViewFlights />} />
          <Route path= "/modify" element = {<ModifyFlightsPage />} />
          <Route path= "/modifyFlight" element = {<ModifyFlight />} />
          {/* <Route path="/tickets" element={<TicketsPage />} />
          <Route path="/add" element={<AddFlightsPage />} />
          <Route path="/modify" element={<ModifyFlightsPage />} />
          <Route path="/delete" element={<DeleteFlightsPage />} /> */}
          {/* Add more routes as needed */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;

import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';

import NavBar from './Components/NavBar';

import Homepage from './Components/Pages/Homepage';
import LoginPage from './Components/Pages/LoginPage';
import SignUpPage from './Components/Pages/SignUpPage';
import FlightsPage from './Components/Pages/FlightsPage';

import UserHomePage from './Components/User/UserHomePage';
import UserViewFlights from './Components/User/UserViewFlights';
import UserBookFlights from './Components/User/UserBookFlights';
import BookFlight from './Components/User/BookFlight';
import PassengerDetails from './Components/User/PassengerDetails';
import UserBookedTickets from './Components/User/UserBookedTickets'

import AdminHomePage from './Components/Admin/AdminHomePage';
import AddFlightsPage from './Components/Admin/AddFlightsPage';
import AdminViewFlights from './Components/Admin/AdminViewFlights';
import ModifyFlightsPage from './Components/Admin/ModifyFlightsPage';
import ModifyFlight from './Components/Admin/ModifyFlight';
import DeleteFlightsPage from './Components/Admin/DeleteFlightsPage';

function App() {
  const [username, setUsername] = useState('guest');

  useEffect(() => {
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
    setUsername('guest');
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
          <Route path="/add" element={<AddFlightsPage />} />
          <Route path="/adminView" element={<AdminViewFlights />} />
          <Route path="/modify" element={<ModifyFlightsPage />} />
          <Route path="/modifyFlight/:flightNumber" element={<ModifyFlight />} />
          <Route path="/delete" element={<DeleteFlightsPage />} />
          <Route path="/userViewFlights" element={<UserViewFlights />} />
          <Route path="/bookFlights" element={<UserBookFlights />} />
          <Route path="/bookFlights/:flightNumber" element={<BookFlight />} />
          <Route path="/bookFlights/:flightNumber/:numTickets" element={<PassengerDetails />} />
          <Route path="/tickets" element={<UserBookedTickets />} /> 
        </Routes>
      </div>
    </Router>
  );
}

export default App;

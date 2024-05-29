import React from 'react';
import { Link, useLocation } from 'react-router-dom';

function NavBar() {
    const location = useLocation();
  
    // Function to determine which navbar to render based on the current route
    if (location.pathname === '/home') {
        return (
          <nav>
            <Link to="/home" className="active">Homepage</Link> | 
            <Link to="/login">Sign In</Link> | 
            <Link to="/signup">Sign Up</Link> |
            <Link to="/flights">View Flights</Link>
          </nav>
        );
      } else if (location.pathname === '/login') {
        return (
          <nav>
            <Link to="/home">Homepage</Link> | 
            <Link to="/login">Sign In</Link> | 
            <Link to="/signup" className="active">Sign Up</Link> |
            <Link to="/flights">View Flights</Link>
          </nav>
        );
      } else if (location.pathname === '/signup') {
        return (
          <nav>
            <Link to="/home">Homepage</Link> | 
            <Link to="/login">Sign In</Link> | 
            <Link to="/signup" className="active">Sign Up</Link> |
            <Link to="/flights">View Flights</Link>
          </nav>
        );
      } else if (location.pathname === '/flights') {
        return (
          <nav>
            <Link to="/home">Homepage</Link> | 
            <Link to="/login">Sign In</Link> | 
            <Link to="/signup">Sign Up</Link> |
            <Link to="/flights" className="active">View Flights</Link>
          </nav>
        );
      }
      else if (location.pathname === '/userHome') {
        return (
          <nav>
            <Link to="/userHome">Homepage</Link> | 
            <Link to="/userViewFlights">View Flights</Link> |
            <Link to="/bookFlights">Book Flights</Link> |
            <Link to="/tickets">My Booked Tickets</Link>
          </nav>
        );
      }
  
      else if (location.pathname === '/adminHome') {
        return (
          <nav>
            <Link to="/adminHome">Homepage</Link> | 
            <Link to="/adminView">View Flights</Link> |
            <Link to="/add">Add Flights</Link> |
            <Link to="/modify">Modify Flights</Link> |
            <Link to="/delete">Delete Flights</Link>
          </nav>
        );
      }

      else if (location.pathname === '/add') {
        return (
          <nav style={{ marginBottom: '20px' }}>
            <Link to="/adminHome">Homepage</Link> | 
            <Link to="/adminView">View Flights</Link> |
            <Link to="/add" className="active">Add Flights</Link> |
            <Link to="/modify">Modify Flights</Link> |
            <Link to="/delete">Delete Flights</Link>
          </nav>
        );
      }

      else if (location.pathname === '/adminView') {
        return (
          <nav style={{ marginBottom: '20px' }}>
            <Link to="/adminHome">Homepage</Link> |
            <Link to="/adminView" className="active">View Flights</Link> |
            <Link to="/add">Add Flights</Link> |
            <Link to="/modify">Modify Flights</Link> |
            <Link to="/delete">Delete Flights</Link>
          </nav>
        );
      }

      else if (location.pathname.startsWith('/modify')) {
        return (
          <nav style={{ marginBottom: '20px' }}>
            <Link to="/adminHome">Homepage</Link> |
            <Link to="/adminView">View Flights</Link> |
            <Link to="/add">Add Flights</Link> |
            <Link to="/modify" className="active">Modify Flights</Link> |
            <Link to="/delete">Delete Flights</Link>
          </nav>
        );
      }

      else if (location.pathname === '/modify/flightNumber') {
        return (
          <nav style={{ marginBottom: '20px' }}>
            <Link to="/adminHome">Homepage</Link> |
            <Link to="/adminView">View Flights</Link> |
            <Link to="/add">Add Flights</Link> |
            <Link to="/modify">Modify Flights</Link> |
            <Link to="/delete">Delete Flights</Link>
          </nav>
        );
      }

      else if (location.pathname === '/delete') {
        return (
          <nav style={{ marginBottom: '20px' }}>
            <Link to="/adminHome">Homepage</Link> |
            <Link to="/adminView">View Flights</Link> |
            <Link to="/add">Add Flights</Link> |
            <Link to="/modify">Modify Flights</Link> |
            <Link to="/delete" className="active">Delete Flights</Link>
          </nav>
        );
      }

      else if (location.pathname === '/userViewFlights') {
        return (
          <nav>
            <Link to="/userHome">Homepage</Link> | 
            <Link to="/userViewFlights" className="active">View Flights</Link> |
            <Link to="/bookFlights">Book Flights</Link> |
            <Link to="/tickets">My Booked Tickets</Link>
          </nav>
        );
      }

      else if (location.pathname.startsWith('/bookFlights')) {
        return (
          <nav style={{ marginBottom: '20px' }}>
            <Link to="/userHome">Homepage</Link> | 
            <Link to="/userViewFlights">View Flights</Link> |
            <Link to="/bookFlights" className="active">Book Flights</Link> |
            <Link to="/tickets">My Booked Tickets</Link>
          </nav>
        );
      }

      else if (location.pathname === '/tickets') {
        return (
          <nav style={{ marginBottom: '20px' }}>
            <Link to="/userHome">Homepage</Link> | 
            <Link to="/userViewFlights">View Flights</Link> |
            <Link to="/bookFlights">Book Flights</Link> |
            <Link to="/tickets" className="active">My Booked Tickets</Link>
          </nav>
        );
      }
      
      else{
        return (
          <nav>
            <Link to="/home">Homepage</Link> | 
            <Link to="/login">Sign In</Link> | 
            <Link to="/signup">Sign Up</Link> |
            <Link to="/flights" className="active">View Flights</Link>
          </nav>
        );
      }
    
  }

export default NavBar;

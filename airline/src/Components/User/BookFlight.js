import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';

import airports from '../Pages/airportData.js';

function Book() {
    const { flightNumber } = useParams();
    const navigate = useNavigate();

    const [flightData, setFlightData] = useState({
        departure: '',
        arrival: '',
        month: '',
        day: '',
        year: '',
        departureTime: '',
        arrivalTime: '',
        price: '',
        seats: 0,
        bookedSeats: 0

    });
    const [numTickets, setNumTickets] = useState(1); // State for number of tickets
    const [errorMessage, setErrorMessage] = useState(''); // State for error message

    const getAirportObjectWithCode = (code) => {
        const airport = airports.find(airport => airport.code === code) || { code, name: code };
        return `${airport.name} (${airport.code})`;
    };

    const convertMonth = (month) => {
        const monthMapping = {
            'January': '01',
            'February': '02',
            'March': '03',
            'April': '04',
            'May': '05',
            'June': '06',
            'July': '07',
            'August': '08',
            'September': '09',
            'October': '10',
            'November': '11',
            'December': '12'
        };
        return monthMapping[month];
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                console.log(flightNumber);
                const response = await fetch(`http://127.0.0.1:5000/bookFlights/${flightNumber}`, {
                    method: 'GET'
                });

                if (response.ok) {
                    const data = await response.json();
                    setFlightData({
                        departure: getAirportObjectWithCode(data.departure),
                        arrival: getAirportObjectWithCode(data.arrival),
                        month: data.month,
                        day: data.day,
                        year: data.year,
                        departureTime: data.departureTime,
                        arrivalTime: data.arrivalTime,
                        price: data.price,
                        seats: data.seats,
                        bookedSeats: data.bookedSeats
                    });
                } else {
                    console.error("Error fetching flight data");
                }
            } catch (error) {
                console.error('Error fetching flight:', error);
                alert('An error occurred while fetching the flight.');
            }
        };
        fetchData();
    }, [flightNumber]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if(numTickets > flightData.seats - flightData.bookedSeats) {
            setErrorMessage('Not enough seats available');
        }
        else {
            navigate(`/bookFlights/${flightNumber}/passengerDetails`, { state: { numTickets } }); 
        }
    };

    const handleNumTicketsChange = (e) => {
        const value = Math.max(1, Math.min(100, Number(e.target.value))); // Ensures the number is between 1 and 10
        setNumTickets(value);
    };

    return (
        <div style={{ marginTop: '20px', padding: '20px' }}>
            <h1>Booking Details</h1>
            <form onSubmit={handleSubmit}>
                <div style={{ display: 'flex', marginBottom: '10px' }}>
                    <TextField
                        label="Departure City"
                        value={flightData.departure}
                        size="small"
                        sx={{ marginRight: '10px', width: '100%' }}
                        InputProps={{ readOnly: true }}
                    />
                    <TextField
                        label="Arrival City"
                        value={flightData.arrival}
                        size="small"
                        sx={{ marginRight: '10px', width: '100%' }}
                        InputProps={{ readOnly: true }}
                    />
                </div>
                
                <div style={{ display: 'flex', marginBottom: '10px' }}>
                    <TextField
                        label="Date"
                        
                        name="date"
                        value={`${convertMonth(flightData.month)}/${flightData.day}/${flightData.year}`}
                        size="small"
                        style={{ marginRight: '10px' }}
                        InputProps={{ readOnly: true }}
                    />
                    <TextField
                        label="Departure Time"
                       
                        name="departureTime"
                        value={flightData.departureTime}
                        size="small"
                        style={{ marginRight: '10px' }}
                        InputProps={{ readOnly: true }}
                    />
                    <TextField
                        label="Price per Ticket"
                        name="price"
                        value={flightData.price}
                        size="small"
                        style={{ marginRight: '10px' }}
                        InputProps={{ readOnly: true }}
                    />
                </div>

                <FormControl variant="filled" style={{ marginBottom: '10px', width: '100%' }}>
                    <TextField
                        label="Number of Tickets"
                        type="number"
                        value={numTickets}
                        size = "small"
                        onChange={handleNumTicketsChange}
                        style={{ width: '200px' }}
                        InputProps={{ inputProps: { min: 1, max: 100 } }}
                    />
                </FormControl>

                <Button type="submit" variant="contained">Next</Button>
            </form>
        </div>
    );
}

export default Book;

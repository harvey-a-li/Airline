import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import AirportDropdown from './AirportDropdown';
import airports from '../Pages/airportData.js';

function ModifyFlight() {
    const { flightNumber } = useParams();
    const navigate = useNavigate();

    const [flightData, setFlightData] = useState({
        departure: null,
        arrival: null,
        month: '',
        day: '',
        year: '',
        departureTime: '',
        arrivalTime: '',
        price: '',
        seats: ''
    });

    const getAirportObjectWithCode = (code) => {
        return airports.find(airport => airport.code === code) || { code, name: code };
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`http://127.0.0.1:5000/modify/${flightNumber}`, {
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
                        seats: data.seats
                    });
                } else {
                    console.error("Error fetching flight data");
                }
            } catch (error) {
                console.error('Error modifying flight:', error);
                alert('An error occurred while modifying the flight.');
            }
        };
        fetchData();
    }, [flightNumber]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFlightData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleUpdateFlight = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`http://127.0.0.1:5000/modify/${flightNumber}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(flightData)
            });
            if (response.ok) {
                alert('Flight updated successfully!');
                navigate('/modify');
            } else {
                console.error("Error updating flight data");
                alert('Error updating flight data');
            }
        } catch (error) {
            console.error('Error updating flight data:', error);
            alert('An error occurred while updating the flight data.');
        }
    };

    return (
        <div style={{ marginTop: '20px', padding: '20px' }}>
            <form onSubmit={handleUpdateFlight}>
                <TextField
                    label="Flight Number"
                    variant="filled"
                    value={flightNumber}
                    disabled
                    size="small"
                    style={{ marginBottom: '10px' }}
                />
                <div style={{ display: 'flex', marginBottom: '10px' }}>
                    <AirportDropdown
                        label="Departure City"
                        value={flightData.departure}
                        onChange={(value) => setFlightData(prev => ({ ...prev, departure: value }))}
                        size="small"
                        sx={{ marginRight: '10px', width: '100%' }}
                    />
                    <AirportDropdown
                        label="Arrival City"
                        value={flightData.arrival}
                        onChange={(value) => setFlightData(prev => ({ ...prev, arrival: value }))}
                        size="small"
                        sx={{ marginRight: '10px', width: '100%' }}
                    />
                </div>
                <div style={{ display: 'flex', marginBottom: '10px' }}>
                    <TextField
                        label="Month"
                        variant="filled"
                        name="month"
                        value={flightData.month}
                        onChange={handleChange}
                        size="small"
                        style={{ marginRight: '10px' }}
                    />
                    <TextField
                        label="Day"
                        variant="filled"
                        name="day"
                        value={flightData.day}
                        onChange={handleChange}
                        size="small"
                        style={{ marginRight: '10px' }}
                    />
                    <TextField
                        label="Year"
                        variant="filled"
                        name="year"
                        value={flightData.year}
                        onChange={handleChange}
                        size="small"
                    />
                </div>
                <div style={{ display: 'flex', marginBottom: '10px' }}>
                    <TextField
                        label="Departure Time"
                        variant="filled"
                        name="departureTime"
                        value={flightData.departureTime}
                        onChange={handleChange}
                        size="small"
                        style={{ marginRight: '10px' }}
                    />
                    <TextField
                        label="Arrival Time"
                        variant="filled"
                        name="arrivalTime"
                        value={flightData.arrivalTime}
                        onChange={handleChange}
                        size="small"
                    />
                </div>
                <div style={{ marginBottom: '10px' }}>
                    <TextField
                        label="Price"
                        variant="filled"
                        name="price"
                        value={flightData.price}
                        onChange={handleChange}
                        size="small"
                    />
                </div>
                <div style={{ marginBottom: '10px' }}>
                    <TextField
                        label="Seats"
                        variant="filled"
                        name="seats"
                        value={flightData.seats}
                        onChange={handleChange}
                        size="small"
                    />
                </div>
                <Button type="submit" variant="contained">Update</Button>
            </form>
        </div>
    );
}

export default ModifyFlight;

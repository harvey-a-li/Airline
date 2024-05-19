import React, {useState} from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

import AirportDropdown from './AirportDropdown'; 

function ModifyFlight() {
    const [flightNumber, setFlightNumber] = useState('');
    const [departure, setDeparture] = useState('');
    const [arrival, setArrival] = useState('');
    const [month, setMonth] = useState('');
    const [day, setDay] = useState('');
    const [year, setYear] = useState('');
    const [departureTime, setDepartureTime] = useState('');
    const [arrivalTime, setArrivalTime] = useState('');
    const [price, setPrice] = useState('');
    const [seats, setSeats] = useState('');


    const handleModifyFlight = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://127.0.0.1:5000/modify/${flightNumber}', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ flight_id: flightNumber, new_data:{ flightNumber, departure, arrival, month, day, year, departureTime, arrivalTime, price, seats }})
            });

            const data = await response.json();
            if (response.ok) {
                alert(data.message);
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error(error);
            alert('An error occurred during login.');
        }
    };

    return (
        <div style={{ marginTop: '20px', padding: '20px' }}>
            <form onSubmit={handleModifyFlight}>
                <TextField
                    label="Flight Number"
                    variant="filled"
                    value={flightNumber}
                    onChange={(e) => setFlightNumber(e.target.value)}
                    size="small"
                    style={{ marginBottom: '10px' }}
                />
                <div style={{ display: 'flex', marginBottom: '10px' }}>
                    <AirportDropdown
                        label="Departure City"
                        value={departure}
                        onChange={(value) => setDeparture(value)}
                        size="small"
                        sx={{ marginRight: '10px', width: '100%'}}
                    />
                    
                    <AirportDropdown
                        label="Arrival City"
                        value={arrival}
                        onChange={(value) => setArrival(value)}
                        size="small"
                        sx={{ marginRight: '10px', width: '100%' }}
                    />
                </div>

                <div style={{ display: 'flex', marginBottom: '10px' }}>
                    <TextField
                        label="Month"
                        variant="filled"
                        value={month}
                        onChange={(e) => setMonth(e.target.value)}
                        size="small"
                        style={{ marginRight: '10px' }}
                    />
                    <TextField
                        label="Day"
                        variant="filled"
                        value={day}
                        onChange={(e) => setDay(e.target.value)}
                        size="small"
                        style={{ marginRight: '10px' }}
                    />
                    <TextField
                        label="Year"
                        variant="filled"
                        value={year}
                        onChange={(e) => setYear(e.target.value)}
                        size="small"
                    />
                </div>

                <div style={{ display: 'flex', marginBottom: '10px' }}>
                    <TextField
                        label="Departure Time"
                        variant="filled"
                        value={departureTime}
                        onChange={(e) => setDepartureTime(e.target.value)}
                        size="small"
                        style={{ marginRight: '10px' }}
                    />

                    <TextField
                        label="Arrival Time"
                        variant="filled"
                        value={arrivalTime}
                        onChange={(e) => setArrivalTime(e.target.value)}
                        size="small"
                    />    
                </div>

                <div style={{marginBottom: '10px' }}>
                    <TextField
                        label = "Price"
                        variant = "filled"
                        value = {price}
                        onChange = {(e) => setPrice(e.target.value)}
                        size = "small"
                    />
                </div>

                <div style={{marginBottom: '10px' }}>
                    <TextField
                        label = "Seats"
                        variant = "filled"
                        value = {seats}
                        onChange = {(e) => setSeats(e.target.value)}
                        size = "small"
                    />
                </div>
                <Button type="submit" variant="contained">Modify Flight</Button>
            </form>
        </div>
    );
}

export default ModifyFlight;
        


import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

function AddDetails() {
    const { flightNumber } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const numTickets = location.state?.numTickets || 1; // Get number of tickets from state or default to 1

    const username = localStorage.getItem('user');

    const [passengerDetails, setPassengerDetails] = useState(Array.from({ length: numTickets }, () => ({
        first_name: '',
        middle_init: '',
        last_name: '',
        dob: '',
        age: ''
    })));

    const [submissionStatus, setSubmissionStatus] = useState(null); // State for tracking submission status

    const calculateAge = (dob) => {
        const birthDate = new Date(dob);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDifference = today.getMonth() - birthDate.getMonth();

        if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }

        return age;
    };

    const handleInputChange = (index, field, value) => {
        const newPassengerDetails = [...passengerDetails];
        newPassengerDetails[index][field] = value;

        if (field === 'dob') {
            const age = calculateAge(value);
            newPassengerDetails[index]['age'] = age;
        }

        setPassengerDetails(newPassengerDetails);
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`http://127.0.0.1:5000/bookFlights/${flightNumber}/details`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ passengerDetails, username })
            });

            if (response.ok) {
                setSubmissionStatus('success');
            } else {
                setSubmissionStatus('error');
                console.error('Details not added');
            }
        } catch (error) {
            setSubmissionStatus('error');
            console.error(error);
        }
    };

    return (
        <div style={{ marginTop: '10px', padding: '20px' }}>
            <h1>Passenger Details</h1>
            {submissionStatus === 'success' ? (
                <div style={{ color: 'green', marginBottom: '20px' }}>
                    <h2>Thank you! Your details have been successfully submitted.</h2>
                </div>
            ) : (
                <form onSubmit={onSubmit}>
                    {passengerDetails.map((details, index) => (
                        <Box key={index} sx={{ padding: '20px', marginBottom: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
                            <h2>Passenger {index + 1}</h2>
                            <TextField
                                label="First Name"
                                value={details.first_name}
                                onChange={(e) => handleInputChange(index, 'first_name', e.target.value)}
                                size="small"
                                style={{ marginRight: '10px' }}
                            />
                            <TextField
                                label="M. Initial"
                                value={details.middle_init}
                                onChange={(e) => handleInputChange(index, 'middle_init', e.target.value)}
                                size="small"
                                style={{ marginRight: '10px', width: '120px'}}
                            />
                            <TextField
                                label="Last Name"
                                value={details.last_name}
                                onChange={(e) => handleInputChange(index, 'last_name', e.target.value)}
                                size="small"
                                style={{ marginRight: '10px' }}
                            />
                            <TextField
                                label="Date of Birth"
                                type="date"
                                value={details.dob}
                                onChange={(e) => handleInputChange(index, 'dob', e.target.value)}
                                InputLabelProps={{ shrink: true }}
                                size="small"
                                style={{ marginRight: '10px' }}
                            />
                            <TextField
                                label="Age"
                                type="number"
                                value={details.age}
                                onChange={(e) => handleInputChange(index, 'age', e.target.value)}
                                size="small"
                                style={{ marginRight: '10px', width: '80px' }}
                                InputProps={{ readOnly: true }} // Make age field read-only
                            />
                        </Box>
                    ))}
                    <Button type="submit" variant="contained">Submit</Button>
                </form>
            )}
            {submissionStatus === 'error' && (
                <div style={{ color: 'red', marginTop: '20px' }}>
                    <h2>There was an error submitting your details. Please try again.</h2>
                </div>
            )}
        </div>
    );
}

export default AddDetails;

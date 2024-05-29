import React, { useState, useEffect } from "react";
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';

const BoardingPass = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(2),
    marginBottom: theme.spacing(2),
    border: '2px solid #000',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    maxWidth: '400px',
    margin: '0 auto',
    position: 'relative'
}));

const BoardingPassHeader = styled(Box)({
    backgroundColor: '#000',
    color: '#fff',
    padding: '10px',
    width: '100%',
    borderRadius: '6px 6px 0 0',
    textAlign: 'center'
});

const BoardingPassDetails = styled(Box)({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'left',
    width: '100%',
    padding: '10px'
});

const BoardingPassFooter = styled(Box)({
    backgroundColor: '#000',
    color: '#fff',
    padding: '10px',
    width: '100%',
    borderRadius: '0 0 6px 6px',
    textAlign: 'center'
});

function UserBookedTickets() {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTickets = async () => {
            const username = localStorage.getItem('user');
            if (!username) {
                console.error('No username found in localStorage');
                setLoading(false);
                return;
            }
            try {
                const response = await fetch(`http://127.0.0.1:5000/tickets?username=${username}`);
                if (response.ok) {
                    const data = await response.json();
                    setTickets(data);
                } else {
                    console.error("Error fetching tickets");
                }
            } catch (error) {
                console.error('Error fetching tickets:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchTickets();
    }, []);

    if (loading) {
        return <CircularProgress />;
    }

    return (
        <div style={{ padding: '20px' }}>
            <Typography variant="h4" gutterBottom>My Booked Tickets</Typography>
            {tickets.length === 0 ? (
                <Typography variant="body1">No tickets found.</Typography>
            ) : (
                tickets.map((ticket, index) => (
                    <BoardingPass key={index}>
                        <BoardingPassHeader>
                            <Typography variant="h6">Boarding Pass</Typography>
                        </BoardingPassHeader>
                        <BoardingPassDetails>
                            <Typography variant="body1"><strong>Passenger:</strong> {ticket.firstName} {ticket.middleInitial} {ticket.lastName}</Typography>
                            <Typography variant="body1"><strong>Flight Number:</strong> {ticket.flightNumber}</Typography>
                            <Typography variant="body1"><strong>Departure:</strong> {ticket.departure}</Typography>
                            <Typography variant="body1"><strong>Arrival:</strong> {ticket.arrival}</Typography>
                            <Typography variant="body1"><strong>Date:</strong> {ticket.date}</Typography>
                            <Typography variant="body1"><strong>Departure Time:</strong> {ticket.departureTime}</Typography>
                            <Typography variant="body1"><strong>Arrival Time:</strong> {ticket.arrivalTime}</Typography>

                        </BoardingPassDetails>
                        <BoardingPassFooter>
                            <Typography variant="body2">Thank you for flying with us!</Typography>
                        </BoardingPassFooter>
                    </BoardingPass>
                ))
            )}
        </div>
    );
}

export default UserBookedTickets;

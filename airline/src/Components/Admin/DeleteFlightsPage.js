import React, { useState, useEffect, useMemo } from 'react';
import { useTable, useSortBy } from 'react-table';
import './table.css';

function DeleteFlightsPage() {
    const [flights, setFlights] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://127.0.0.1:5000/delete', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' }
                });
                if (response.ok) {
                    const data = await response.json();
                    setFlights(data);
                } else {
                    console.error('Flights not found');
                }
            } catch (error) {
                console.error(error);
            }
        };

        fetchData();
    }, []);

    const formatDate = (month, day, year) => {
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

        const monthStr = monthMapping[month] || month.toString().padStart(2, '0');
        const dayStr = day.toString().padStart(2, '0');
        return `${monthStr}/${dayStr}/${year}`;
    };

    const handleDelete = async (flightNumber) => {
        const confirmed = window.confirm("Are you sure you want to delete this flight?");
        if (confirmed) {
            try {
                const response = await fetch(`http://127.0.0.1:5000/deleteFlight/${flightNumber}`, {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' }
                });

                if (response.ok) {
                    setFlights(flights.filter(flight => flight.flightNumber !== flightNumber));
                    alert('Flight deleted successfully');
                } else {
                    console.error('Failed to delete flight');
                    alert('Failed to delete flight');
                }
            } catch (error) {
                console.error(error);
                alert('An error occurred while deleting the flight');
            }
        }
    };

    const columns = useMemo(
        () => [
            { Header: 'Flight Number', accessor: 'flightNumber' },
            { Header: 'Date', accessor: row => formatDate(row.month, row.day, row.year) },
            { Header: 'Origin', accessor: 'departure' },
            { Header: 'Destination', accessor: 'arrival' },
            { Header: 'Departure Time', accessor: 'departureTime' },
            { Header: 'Arrival Time', accessor: 'arrivalTime' },
            { Header: 'Price', accessor: 'price' },
            { Header: 'Total Seats', accessor: 'seats' },
            { Header: 'Booked Seats', accessor: 'bookedSeats' },
            {
                Header: 'Actions',
                Cell: ({ row }) => (
                    <button onClick={() => handleDelete(row.original.flightNumber)}>Delete</button>
                )
            }
        ],
        [flights]
    );

    const filteredFlights = useMemo(() => {
        return flights.filter(flight =>
            flight.flightNumber.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [searchQuery, flights]);

    const tableInstance = useTable({ columns, data: filteredFlights }, useSortBy);

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
    } = tableInstance;

    return (
        <div className="delete-flights-page">
            <h1>Delete Flights</h1>
            <input
                type="text"
                placeholder="Search by Flight Number"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
            />
            <table {...getTableProps()}>
                <thead>
                    {headerGroups.map(headerGroup => (
                        <tr {...headerGroup.getHeaderGroupProps()}>
                            {headerGroup.headers.map(column => (
                                <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                                    {column.render('Header')}
                                    <span>
                                        {column.isSorted
                                            ? column.isSortedDesc
                                                ? ' 🔽'
                                                : ' 🔼'
                                            : ''}
                                    </span>
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody {...getTableBodyProps()}>
                    {rows.map(row => {
                        prepareRow(row);
                        return (
                            <tr {...row.getRowProps()}>
                                {row.cells.map(cell => (
                                    <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                                ))}
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}

export default DeleteFlightsPage;

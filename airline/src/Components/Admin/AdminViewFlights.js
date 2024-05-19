import React, { useState, useEffect } from 'react';
import { useTable, useSortBy } from 'react-table';
import './table.css'; // Ensure this file is created with appropriate styles

function AdminViewFlights() {
    const [flights, setFlights] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://127.0.0.1:5000/adminView', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' }
                });
                if (response.ok) {
                    const data = await response.json();
                    setFlights(data);
                } else {
                    console.error('Flights not found');
                    setError('Flights not found');
                }
            } catch (error) {
                console.error(error);
                setError('An error occurred while fetching flights');
            } finally {
                setLoading(false);
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

    const columns = React.useMemo(
        () => [
            { Header: 'Flight Number', accessor: 'flightNumber' },
            { Header: 'Date', accessor: row => formatDate(row.month, row.day, row.year) }, // Combining month, day, year
            { Header: 'Origin', accessor: 'departure' },
            { Header: 'Destination', accessor: 'arrival' },
            { Header: 'Departure Time', accessor: 'departureTime' },
            { Header: 'Arrival Time', accessor: 'arrivalTime' },
            { Header: 'Price', accessor: 'price' },
            { Header: 'Seats Left', accessor: 'seats' },
        ],
        []
    );

    const tableInstance = useTable({ columns, data: flights }, useSortBy);

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
    } = tableInstance;

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div className="table-container">
            <h1>Flights</h1>
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

export default AdminViewFlights;

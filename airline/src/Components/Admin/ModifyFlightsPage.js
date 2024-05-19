import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useTable, useSortBy } from 'react-table';
import './table.css';

function ModifyFlightsPage() {
    const [flights, setFlights] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://127.0.0.1:5000/modify', {
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

    const columns = useMemo(
        () => [
            { Header: 'Flight Number', accessor: 'flightNumber' },
            { Header: 'Date', accessor: row => formatDate(row.month, row.day, row.year) },
            { Header: 'Origin', accessor: 'departure' },
            { Header: 'Destination', accessor: 'arrival' },
            { Header: 'Departure Time', accessor: 'departureTime' },
            { Header: 'Arrival Time', accessor: 'arrivalTime' },
            { Header: 'Price', accessor: 'price' },
            { Header: 'Seats Left', accessor: 'seats' },
            {
                Header: 'Actions',
                Cell: ({ row }) => (
                    <Link to={`/modify/${row.original.flightNumber}`}>
                        <button>Modify</button>
                    </Link>
                )
            }
        ],
        []
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
        <div className="modify-flights-page">
            <h1>Modify Flights</h1>
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

export default ModifyFlightsPage;

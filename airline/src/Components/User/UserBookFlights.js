import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useTable, useSortBy } from 'react-table';
import '../Admin/table.css';

function UserBookFlights() {
    const [flights, setFlights] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://127.0.0.1:5000/bookFlights', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' }
                });

                if (response.ok){
                    const data = await response.json();
                    setFlights(data);
                }
                else {
                    console.error('Flights not found');
                }
            }
            catch (error) {
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
            { Header: 'Price', accessor: 'price', Cell: ({value}) => `$${value}` },
            { Header: 'Actions', 
                Cell: ({row}) => ( 
                    <Link to={`/bookFlights/${row.original.flightNumber}`}>
                        <button>Book</button>
                    </Link>
                )
            }
        ],
        []
    );

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow
    } = useTable({ columns, data: flights }, useSortBy);

    return (
        <div>
            <input type="text" placeholder="Search" onChange={e => setSearchQuery(e.target.value)} />
            <table {...getTableProps()}>
                <thead>
                    {headerGroups.map(headerGroup => (
                        <tr {...headerGroup.getHeaderGroupProps()}>
                            {headerGroup.headers.map(column => (
                                <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                                    {column.render('Header')}
                                    <span>
                                        {column.isSorted ? (column.isSortedDesc ? ' 🔽' : ' 🔼') : ''}
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
                                {row.cells.map(cell => {
                                    return (
                                        <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                                    );
                                })}
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}

export default UserBookFlights;



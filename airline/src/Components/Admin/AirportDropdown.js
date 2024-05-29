import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

// Dummy airport data
const airports = [
    {"code": "ATL", "name": "Hartsfield-Jackson Atlanta International Airport"},
    {"code": "LAX", "name": "Los Angeles International Airport"},
    {"code": "ORD", "name": "Chicago O'Hare International Airport"},
    {"code": "DFW", "name": "Dallas/Fort Worth International Airport"},
    {"code": "DEN", "name": "Denver International Airport"},
    {"code": "JFK", "name": "John F. Kennedy International Airport"},
    {"code": "SFO", "name": "San Francisco International Airport"},
    {"code": "SEA", "name": "Seattle-Tacoma International Airport"},
    {"code": "LAS", "name": "McCarran International Airport"},
    {"code": "MCO", "name": "Orlando International Airport"},
    {"code": "MIA", "name": "Miami International Airport"},
    {"code": "PHX", "name": "Phoenix Sky Harbor International Airport"},
    {"code": "CLT", "name": "Charlotte Douglas International Airport"},
    {"code": "EWR", "name": "Newark Liberty International Airport"},
    {"code": "MSP", "name": "Minneapolis-Saint Paul International Airport"},
    {"code": "BOS", "name": "Logan International Airport"},
    {"code": "DTW", "name": "Detroit Metropolitan Airport"},
    {"code": "PHL", "name": "Philadelphia International Airport"},
    {"code": "LGA", "name": "LaGuardia Airport"},
    {"code": "IAH", "name": "George Bush Intercontinental Airport"},
    {"code": "FLL", "name": "Fort Lauderdale-Hollywood International Airport"},
    {"code": "BWI", "name": "Baltimore/Washington International Thurgood Marshall Airport"},
    {"code": "SLC", "name": "Salt Lake City International Airport"},
    {"code": "DCA", "name": "Ronald Reagan Washington National Airport"},
    {"code": "MDW", "name": "Chicago Midway International Airport"},
    {"code": "IAD", "name": "Washington Dulles International Airport"},
    {"code": "SAN", "name": "San Diego International Airport"},
    {"code": "TPA", "name": "Tampa International Airport"},
    {"code": "PDX", "name": "Portland International Airport"},
    {"code": "HNL", "name": "Daniel K. Inouye International Airport"},
    {"code": "STL", "name": "St. Louis Lambert International Airport"},
    {"code": "BNA", "name": "Nashville International Airport"},
    {"code": "AUS", "name": "Austin-Bergstrom International Airport"},
    {"code": "DAL", "name": "Dallas Love Field"},
    {"code": "SMF", "name": "Sacramento International Airport"},
    {"code": "MSY", "name": "Louis Armstrong New Orleans International Airport"},
    {"code": "SAT", "name": "San Antonio International Airport"},
    {"code": "RDU", "name": "Raleigh-Durham International Airport"},
    {"code": "CLE", "name": "Cleveland Hopkins International Airport"},
    {"code": "IND", "name": "Indianapolis International Airport"},
    {"code": "MCI", "name": "Kansas City International Airport"},
    {"code": "PIT", "name": "Pittsburgh International Airport"},
    {"code": "CVG", "name": "Cincinnati/Northern Kentucky International Airport"},
    {"code": "SJC", "name": "Norman Y. Mineta San Jose International Airport"},
    {"code": "OAK", "name": "Oakland International Airport"},
    {"code": "SNA", "name": "John Wayne Airport"},
    {"code": "SDF", "name": "Louisville Muhammad Ali International Airport"},
    {"code": "BHM", "name": "Birmingham-Shuttlesworth International Airport"},
    {"code": "JAX", "name": "Jacksonville International Airport"},
    {"code": "RSW", "name": "Southwest Florida International Airport"},
    {"code": "BUF", "name": "Buffalo Niagara International Airport"},
    {"code": "OMA", "name": "Eppley Airfield"},
    {"code": "OKC", "name": "Will Rogers World Airport"},
    {"code": "TUL", "name": "Tulsa International Airport"},
    {"code": "ABQ", "name": "Albuquerque International Sunport"},
    {"code": "ANC", "name": "Ted Stevens Anchorage International Airport"},
    {"code": "BOI", "name": "Boise Airport"},
    {"code": "BZN", "name": "Bozeman Yellowstone International Airport"},
    {"code": "BTV", "name": "Burlington International Airport"},
    {"code": "CHS", "name": "Charleston International Airport"},
    {"code": "CMH", "name": "John Glenn Columbus International Airport"},
    {"code": "ELP", "name": "El Paso International Airport"},
    {"code": "FAT", "name": "Fresno Yosemite International Airport"},
    {"code": "GEG", "name": "Spokane International Airport"},
    {"code": "GRR", "name": "Gerald R. Ford International Airport"},
    {"code": "GSO", "name": "Piedmont Triad International Airport"},
    {"code": "GSP", "name": "Greenville-Spartanburg International Airport"},
    {"code": "ICT", "name": "Wichita Dwight D. Eisenhower National Airport"},
    {"code": "ILM", "name": "Wilmington International Airport"},
    {"code": "MHT", "name": "Manchester-Boston Regional Airport"},
    {"code": "MKE", "name": "General Mitchell International Airport"},
    {"code": "ORF", "name": "Norfolk International Airport"},
    {"code": "PBI", "name": "Palm Beach International Airport"},
    {"code": "PWM", "name": "Portland International Jetport"},
    {"code": "RNO", "name": "Reno-Tahoe International Airport"},
    {"code": "ROC", "name": "Greater Rochester International Airport"},
    {"code": "SYR", "name": "Syracuse Hancock International Airport"},
    {"code": "TUS", "name": "Tucson International Airport"},
    {"code": "TYS", "name": "McGhee Tyson Airport"},
    {"code": "XNA", "name": "Northwest Arkansas National Airport"},
    {"code": "YVR", "name": "Vancouver International Airport"},
    {"code": "YYC", "name": "Calgary International Airport"},
    {"code": "YYZ", "name": "Toronto Pearson International Airport"},
    {"code": "ONT", "name": "Ontario International Airport"}
];

function AirportDropdown({ label, value, onChange, ...props }) {
  const [inputValue, setInputValue] = useState('');

  const handleInputChange = (event, newInputValue) => {
    setInputValue(newInputValue);
  };

  return (
    <Autocomplete
      value={value || null}
      onChange={(event, newValue) => onChange(newValue)}
      inputValue={inputValue}
      onInputChange={handleInputChange}
      options={airports}
      getOptionLabel={(option) => {
        const label = option.name + " " + "(" + option.code + ")";
        console.log("Label:", label);
        return label;
      }}
      renderInput={(params) => 
      <TextField 
        {...params} 
        label={label}
        variant="filled" 
        style={{ width: '500px' }}
        {...props}  
        />}
        isOptionEqualToValue={(option, value) => option.code === value.code} 
    />//218
  );
}

export default AirportDropdown;

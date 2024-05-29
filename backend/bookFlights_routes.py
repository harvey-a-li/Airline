from flask import Blueprint, request, jsonify
from pymongo.mongo_client import MongoClient
import random
import string
from datetime import datetime
current_time = datetime.now()
bookFlights_routes = Blueprint('bookFlights', __name__)

uri = "mongodb+srv://harveyli:harveyli@cluster0.hbmcjmw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
client = MongoClient(uri)

month_map = {
    'January': 1,
    'February': 2,
    'March': 3,
    'April': 4,
    'May': 5,
    'June': 6,
    'July': 7,
    'August': 8,
    'September': 9,
    'October': 10,
    'November': 11,
    'December': 12
}

def validate_time(time_str):
    # Check if the time string is in the format "HH:MM"
    if len(time_str) != 5 or time_str[2] != ":":
        return False

    # Extract hours and minutes
    hours, minutes = map(int, time_str.split(":"))

    # Check if hours and minutes are within valid range
    if hours < 0 or hours > 23:
        return False
    if minutes < 0 or minutes > 59:
        return False

    return True

def changeFromMilitaryTime(time_str):
    hours, minutes = map(int, time_str.split(":"))
    if hours > 12:
        hours -= 12
        period = "PM"
    elif hours == 12:
        period = "PM"
    else:
        if hours == 0:
            hours = 12
        period = "AM"
    return f"{hours}:{minutes:02d} {period}"
    
def generate_confirmation_code(length=6):
    """Generate a random alphanumeric confirmation code."""
    characters = string.ascii_letters + string.digits
    return ''.join(random.choice(characters) for _ in range(length)).upper()


@bookFlights_routes.route('/bookFlights', methods=['POST'])
def bookFlights():
    db = client['Flights']
    collectionNames = db.list_collection_names()
    flights = []
    for flight_collection in collectionNames:
        collection = db[flight_collection]
        for flight in collection.find({}, 
                                      {'_id': 0,
                                      'flightNumber': 1,
                                      'departure': 1,
                                      'arrival': 1,
                                      'month': 1,
                                      'day': 1,
                                      'year': 1,
                                      'departureTime': 1,
                                      'arrivalTime': 1,
                                      'price': 1,}):
            if(isinstance(flight['departureTime'], str)):
                departure_time_str = flight['departureTime']
                departure_time_obj = datetime.strptime(departure_time_str, "%H:%M")
            
                month = month_map.get(flight['month'])

                year = flight['year']
                day = flight['day']

                departure_time = datetime(year, month, day, departure_time_obj.hour, departure_time_obj.minute)
            
            if departure_time < current_time:
                collection.delete_one({'flightNumber': flight['flightNumber']})
                db.drop_collection(flight_collection)
            else:
                flight['departureTime'] = changeFromMilitaryTime(flight['departureTime'])
                flight['arrivalTime'] = changeFromMilitaryTime(flight['arrivalTime'])

            flights.append(flight)
    return jsonify(flights), 200

@bookFlights_routes.route('/bookFlights/<flightNumber>', methods=['GET'])
def getFlight(flightNumber):
    db = client['Flights']
    collection = db[flightNumber]
    flight = collection.find_one({}, {'_id': 0})
    if flight:
        flight['departureTime'] = changeFromMilitaryTime(flight['departureTime'])
        flight['arrivalTime'] = changeFromMilitaryTime(flight['arrivalTime'])
        return jsonify(flight), 200
    else:
        return jsonify({'error': 'Flight not found'}), 404
    
@bookFlights_routes.route('/bookFlights/<flightNumber>/details', methods=['POST'])
def details(flightNumber):
    data = request.get_json()
    passengerDetails = data.get('passengerDetails')
    username = data.get('username')

    if not passengerDetails or not username:
        return jsonify({'error': 'Missing passenger details or username'}), 400
    
    usersDB = client.get_database('Users')
    user = usersDB[username]

    confirmationCode = generate_confirmation_code()

    #get flight info HERE
    db = client['Flights']
    collection = db[flightNumber]
    flight = collection.find_one({}, {'_id': 0})
    
    for passenger in passengerDetails:
        passenger_data = {
            'confirmationCode': confirmationCode,
            'firstName': passenger['first_name'],
            'middleInitial': passenger['middle_init'],
            'lastName': passenger['last_name'],
            'dob': passenger['dob'],
            'age': passenger['age'],
            'flightNumber': flightNumber,
            'departure': flight['departure'],
            'arrival': flight['arrival'],
            'month': flight['month'],
            'day': flight['day'],
            'year': flight['year'],
            'date': flight['month'] + " " + str(flight['day']) + ", " + str(flight['year']),
            'departureTime': flight['departureTime'],
            'arrivalTime': flight['arrivalTime']
        }
        user.insert_one(passenger_data)

    #update the flight collection with seats booked
    seats_booked = flight['bookedSeats']
    seats_booked += len(passengerDetails)
    collection.update_one({}, {'$set': {'bookedSeats': seats_booked}})

    return jsonify({'message': 'Passenger details added successfully', 'confirmation_code': confirmationCode}), 200



    

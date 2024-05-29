from flask import Blueprint, request, jsonify
from pymongo.mongo_client import MongoClient
from datetime import datetime
current_time = datetime.now()
modify_routes = Blueprint('modify', __name__)

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

@modify_routes.route('/modify', methods=['POST'])
def modify():
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
                                      'price': 1,
                                      'seats': 1,
                                      'bookedSeats': 1}):
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

            flights.append(flight)
        
    return jsonify(flights), 200

@modify_routes.route('/modify/<flightNumber>', methods=['GET'])
def getFlight(flightNumber):
    db = client['Flights']
    collection = db[flightNumber]
    flight = collection.find_one({}, {'_id': 0})
    if flight:
        return jsonify(flight), 200
    else:
        return jsonify({'message': 'Flight not found'}), 404

@modify_routes.route('/modify/<flightNumber>', methods=['POST'])
def modifyFlight(flightNumber):
    data = request.get_json()
    departure = data.get('departure')
    arrival = data.get('arrival')
    month = data.get('month')
    day = data.get('day')
    year = data.get('year')
    departureTime = data.get('departureTime')
    arrivalTime = data.get('arrivalTime')
    price = data.get('price')
    seats = data.get('seats')
    bookedSeats = data.get('bookedSeats')
    
    if not departure:
        return jsonify({"message": "Departure airport required"}), 400
    elif not arrival:
        return jsonify({"message": "Arrival airport required"}), 400
    elif not month:
        return jsonify({"message": "Month required"}), 400
    elif not day:
        return jsonify({"message": "Day required"}), 400
    elif not year:
        return jsonify({"message": "Year required"}), 400
    elif not departureTime:
        return jsonify({"message": "Departure time required"}), 400
    elif not arrivalTime:
        return jsonify({"message": "Arrival time required"}), 400
    elif not price:
        return jsonify({"message": "Price required"}), 400
    elif not seats:
        return jsonify({"message": "Number of seats required"}), 400

    departure_code = departure.get('code')
    print(departure_code)
    # departure.pop('code', None)
    print(departure)
    arrival_code = arrival.get('code')
    airportCollection = client['Airports']['airports']
    depart = airportCollection.find_one({'code': departure_code})
    arrive = airportCollection.find_one({'code': arrival_code})

    depart_code = depart.get('code')
    arrive_code = arrive.get('code')

    if depart is None:
        return jsonify({"message": "Departure airport not found"}), 400
    elif arrive is None:
        return jsonify({"message": "Arrival airport not found"}), 400
    elif departure == arrival:
        return jsonify({"message": "Departure and arrival airports cannot be the same"}), 400
    elif month != 'January' and month != 'February' and month != 'March' and month != 'April' and month != 'May' and month != 'June' and month != 'July' and month != 'August' and month != 'September' and month != 'October' and month != 'November' and month != 'December':
        return jsonify({"message": "Invalid month"}), 400
    elif month == 'February' and day > 28:
        return jsonify({"message": "Invalid day for February"}), 400
    elif month == 'April' and day > 30:
        return jsonify({"message": "Invalid day for April"}), 400
    elif month == 'June' and day > 30:
        return jsonify({"message": "Invalid day for June"}), 400
    elif month == 'September' and day > 30:
        return jsonify({"message": "Invalid day for September"}), 400
    elif month == 'November' and day > 30:
        return jsonify({"message": "Invalid day for November"}), 400
    
    day = int(data.get('day'))  
    year = int(data.get('year'))
    price = float(data.get('price'))
    seats = int(data.get('seats'))

    if day < 1 or day > 31:
        return jsonify({"message": "Invalid day"}), 400
    elif year < 2024:
        return jsonify({"message": "Invalid year"}), 400
    elif not validate_time(departureTime):
        return jsonify({"message": "Invalid departure time"}), 400
    elif not validate_time(arrivalTime):
        return jsonify({"message": "Invalid arrival time"}), 400
    elif price < 0:
        return jsonify({"message": "Invalid price"}), 400
    elif seats < 0:
        return jsonify({"message": "Invalid number of seats"}), 400
    elif seats < bookedSeats:
        return jsonify({"message": "Number of seats cannot be less than the number of booked seats"}), 400
    else:
        try:
            collection = client['Flights'][flightNumber]
            update_data = {
                'departure': depart_code,
                'arrival': arrive_code,
                'month': month,
                'day': day,
                'year': year,
                'departureTime': departureTime,
                'arrivalTime': arrivalTime,
                'price': price,
                'seats': seats
            }
            collection.update_one({}, {'$set': update_data})
            return jsonify({'message': 'Flight updated'}), 200
        except:
            return jsonify({'message': 'Flight not found'}), 404

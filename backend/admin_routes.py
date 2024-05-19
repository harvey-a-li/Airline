from flask import Blueprint, request, jsonify
from pymongo.mongo_client import MongoClient

admin_routes = Blueprint('admin', __name__)

# 1 Opens a connection to the Cluster
uri = "mongodb+srv://harveyli:harveyli@cluster0.hbmcjmw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
# Create a new client and connect to the server/cluster
client = MongoClient(uri)

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

@admin_routes.route('/add', methods=['POST'])
def add():
    data = request.get_json()
    number = data.get('flightNumber')
    departure = data.get('departure')
    arrival = data.get('arrival')
    month = data.get('month')
    day = data.get('day')
    year = data.get('year')
    departureTime = data.get('departureTime')
    arrivalTime = data.get('arrivalTime')
    price = data.get('price')
    seats = data.get('seats')
    if not number:
        return jsonify({"message": "Flight number required"}), 400
    elif not departure:
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
    else:
        try:
            db = client['Flights']
            collection = db[number]
            document = {
                'flightNumber': number,
                'departure': departure.get('code'),
                'arrival': arrival.get('code'),
                'month': month,
                'day': day,
                'year': year,
                'departureTime': departureTime,
                'arrivalTime': arrivalTime,
                'price': price,
                'seats': seats
            }
            collection.insert_one(document)
            return jsonify({"message": "Flight added to database successfully"}), 200
        except Exception as e:
            return jsonify({"message": "Error adding flight"}), 400
        

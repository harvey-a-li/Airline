from flask import Blueprint, request, jsonify
from pymongo.mongo_client import MongoClient
from datetime import datetime

current_time = datetime.now()

admin_routes = Blueprint('admin', __name__)

# Open a connection to the Cluster
uri = "mongodb+srv://harveyli:harveyli@cluster0.hbmcjmw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
client = MongoClient(uri)

def validate_time(time_str):
    # Check if the time string is in the format "HH:MM"
    if len(time_str) != 5 or time_str[2] != ":":
        return False
    try:
        hours, minutes = map(int, time_str.split(":"))
    except ValueError:
        return False
    if hours < 0 or hours > 23 or minutes < 0 or minutes > 59:
        return False
    return True

@admin_routes.route('/add', methods=['POST'])
def add():
    data = request.get_json()
    try:
        number = data['flightNumber']
        departure = data['departure']
        arrival = data['arrival']
        month = data['month']
        day = int(data['day'])
        year = int(data['year'])
        departureTime = data['departureTime']
        arrivalTime = data['arrivalTime']
        price = float(data['price'])
        seats = int(data['seats'])
    except (KeyError, ValueError, TypeError) as e:
        return jsonify({"message": f"Invalid input: {str(e)}"}), 400

    if not validate_time(departureTime):
        return jsonify({"message": "Invalid departure time"}), 400
    if not validate_time(arrivalTime):
        return jsonify({"message": "Invalid arrival time"}), 400
    if year < 2024:
        return jsonify({"message": "Invalid year"}), 400
    if price < 0:
        return jsonify({"message": "Invalid price"}), 400
    if seats < 0:
        return jsonify({"message": "Invalid number of seats"}), 400

    departure_code = departure.get('code')
    arrival_code = arrival.get('code')

    airportCollection = client['Airports']['airports']
    depart = airportCollection.find_one({'code': departure_code})
    arrive = airportCollection.find_one({'code': arrival_code})

    if not depart:
        return jsonify({"message": "Departure airport not found"}), 400
    if not arrive:
        return jsonify({"message": "Arrival airport not found"}), 400
    if departure_code == arrival_code:
        return jsonify({"message": "Departure and arrival airports cannot be the same"}), 400

    valid_months = {
        'January': 31, 'February': 28, 'March': 31, 'April': 30,
        'May': 31, 'June': 30, 'July': 31, 'August': 31,
        'September': 30, 'October': 31, 'November': 30, 'December': 31
    }

    if month not in valid_months:
        return jsonify({"message": "Invalid month"}), 400
    if day < 1 or day > valid_months[month]:
        return jsonify({"message": f"Invalid day for {month}"}), 400

    departure_datetime = datetime(year, list(valid_months.keys()).index(month) + 1, day, 
                                  int(departureTime[:2]), int(departureTime[3:]))
    
    if departure_datetime < current_time:
        return jsonify({"message": "Departure time has already passed"}), 400

    try:
        db = client['Flights']
        collection = db[number]
        document = {
            'flightNumber': number,
            'departure': departure_code,
            'arrival': arrival_code,
            'month': month,
            'day': day,
            'year': year,
            'departureTime': departureTime,
            'arrivalTime': arrivalTime,
            'price': price,
            'seats': seats,
            'bookedSeats': 0
        }
        collection.insert_one(document)
        return jsonify({"message": "Flight added to database successfully"}), 200
    except Exception as e:
        return jsonify({"message": f"Error adding flight: {str(e)}"}), 400

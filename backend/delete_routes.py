from flask import Blueprint, request, jsonify
from pymongo.mongo_client import MongoClient
from datetime import datetime
current_time = datetime.now()
delete_routes = Blueprint('delete', __name__)

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

@delete_routes.route('/delete', methods=['POST'])
def delete():
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
                                      'bookedSeats': 1,}):
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

def convert_object_id(data):
    """Convert ObjectId to string for JSON serialization."""
    if isinstance(data, list):
        for item in data:
            if '_id' in item:
                item['_id'] = str(item['_id'])
    elif isinstance(data, dict):
        if '_id' in data:
            data['_id'] = str(data['_id'])
    return data

@delete_routes.route('/deleteFlight/<flightNumber>', methods=['DELETE'])
def delete_flight(flightNumber):
    db = client['Flights']
    collection_names = db.list_collection_names()
    for collection_name in collection_names:
        collection = db[collection_name]
        flight = collection.find_one({'flightNumber': flightNumber})
        if flight:
            collection.delete_one({'flightNumber': flightNumber})
            db.drop_collection(collection_name)
            return jsonify(convert_object_id(flight)), 200
    return jsonify({'error': 'Flight not found'}), 404
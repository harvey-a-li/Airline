from flask import Blueprint, request, jsonify
from pymongo.mongo_client import MongoClient
from datetime import datetime

viewFlight_routes = Blueprint('viewFlight', __name__)

uri = "mongodb+srv://harveyli:harveyli@cluster0.hbmcjmw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
client = MongoClient(uri)

# Define a dictionary to map month names to their numerical representations
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

@viewFlight_routes.route('/adminView', methods=['POST'])
def viewFlights():
    db = client['Flights']
    collectionNames = db.list_collection_names()
    flights = []
    
    for flight_collection_name in collectionNames:
        collection = db[flight_collection_name]
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
            # Ensure departureTime is a datetime object
            if isinstance(flight['departureTime'], str):
                # Parse departureTime to datetime object
                departure_time_str = flight['departureTime']
                departure_time_obj = datetime.strptime(departure_time_str, "%H:%M")
                
                # Convert month to its numerical representation
                month = month_map.get(flight['month'])
                if month is None:
                    raise ValueError(f"Invalid month name: {flight['month']}")
                
                # Convert year and day to integers
                year = int(flight['year'])
                day = int(flight['day'])
                
                # Combine year, month, day with departureTime to form a full datetime object
                departure_time = datetime(year, month, day, departure_time_obj.hour, departure_time_obj.minute)
                
            # Check if the departure time has passed
            if departure_time < datetime.now():
                # Delete the flight from the database
                collection.delete_one({'flightNumber': flight['flightNumber']})
                db.drop_collection(flight_collection_name)
            else:
                flights.append(flight)
    
    return jsonify(flights), 200

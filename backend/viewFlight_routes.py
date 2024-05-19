from flask import Blueprint, request, jsonify
from pymongo.mongo_client import MongoClient

viewFlight_routes = Blueprint('viewFlight', __name__)

uri = "mongodb+srv://harveyli:harveyli@cluster0.hbmcjmw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
client = MongoClient(uri)

@viewFlight_routes.route('/adminView', methods=['POST'])
def viewFlights():
    db = client['Flights']
    collectionNames = db.list_collection_names()
    flights = []
    for flight in collectionNames:
        collection = db[flight]
        flights += list(collection.find({}, 
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
                                        'seats': 1,}))
    print(len(flights))
    
    return jsonify(flights), 200
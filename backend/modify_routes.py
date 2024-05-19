from flask import Blueprint, request, jsonify
from pymongo.mongo_client import MongoClient

modify_routes = Blueprint('modify', __name__)

uri = "mongodb+srv://harveyli:harveyli@cluster0.hbmcjmw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
client = MongoClient(uri)

@modify_routes.route('/modify', methods=['POST'])
def modify():
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
    return jsonify(flights), 200


@modify_routes.route('/modify/flightNumber', methods=['POST'])
def modifyFlight():
    data = request.json
    flight_id = data['flight_id']
    new_data = data['new_data']
    db = client['flight']
    collection = db['flights']
    collection.update_one({'flight_id': flight_id}, {'$set': new_data})
    return jsonify({'message': 'Flight updated successfully!'})

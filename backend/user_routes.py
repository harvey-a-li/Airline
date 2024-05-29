from flask import Blueprint, request, jsonify
from pymongo.mongo_client import MongoClient
from datetime import datetime

user_routes = Blueprint('user', __name__)

# Opens a connection to the Cluster
uri = "mongodb+srv://harveyli:harveyli@cluster0.hbmcjmw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
# Create a new client and connect to the server/cluster
client = MongoClient(uri)

def delete_expired_tickets(username):
    usersDB = client.get_database('Users')
    user_collection = usersDB[username]

    current_time = datetime.now()
    expired_tickets = user_collection.find({"$expr": {"$lt": [{"$dateFromString": {"dateString": {"$concat": ["$year", "-", "$month", "-", "$day", "T", "$departureTime", "Z"]}}}, current_time]}})
    
    for ticket in expired_tickets:
        user_collection.delete_one({"_id": ticket["_id"]})

@user_routes.route('/tickets', methods=['GET'])
def get_booked_tickets():
    try:
        username = request.args.get('username')
        if not username:
            return jsonify({"error": "Username is required"}), 400
        
        delete_expired_tickets(username)

        usersDB = client.get_database('Users')
        user_collection = usersDB[username]  # Access the specific collection for the user

        # Fetch tickets for the user, excluding the password field
        tickets = list(user_collection.find({"confirmationCode": {"$exists": True}}, {"_id": 0, "password": 0}))

        return jsonify(tickets), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

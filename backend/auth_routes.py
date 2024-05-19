from flask import Blueprint, request, jsonify
from pymongo.mongo_client import MongoClient
from encryption import encryption

auth_routes = Blueprint('auth', __name__)

# 1 Opens a connection to the Cluster
uri = "mongodb+srv://harveyli:harveyli@cluster0.hbmcjmw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
# Create a new client and connect to the server/cluster
client = MongoClient(uri)

# Send a ping to confirm connection
try:
  client.admin.command('ping')
  print("Pinged your deployment. You successfully connected to MongoDB!")
except Exception as e:
  print(e)

try: 
    db = client['Manager']
    collection = db['admin']

    if collection.count_documents({}) == 0:
        # If no documents exist, insert the initial document
        encrypted_password = encryption.encrypt('password1234', 1, 1)
        document = {
            'Password': encrypted_password
        }
        collection.insert_one(document)
        print("Initial admin document inserted successfully")
    else:
        print("Admin document already exists")

except Exception as e:
    print(e)


@auth_routes.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    form_username = data.get('username')
    form_password = data.get('password')
    if not form_username or not form_password:
        return jsonify({"message": "Username and password required"}), 400

    if(form_username == 'admin'):
        admin_db = client['Manager']
        admin_collection = admin_db['admin']

        admin_data = admin_collection.find_one({"Password" : {"$exists": True}})
        if admin_data:
            stored_password_encrypted = admin_data.get('Password')
            if encryption.decrypt(stored_password_encrypted, 1, 1) == (form_password):
                return jsonify({"message": "Login succesful", "role": "admin"}), 200
            else:
                return jsonify({"message": "Wrong Password"}), 400
        else:
            return jsonify({"message": "User Doesn't Exist"}), 400
    
    else:
        user_db = client['Users']
        user_collection = user_db[form_username] # get the collection

        user_data = user_collection.find_one({"password" : {"$exists": True}}) # get the document
        # Check if the username exists in the database
        if user_data:
            # Check if the password is correct
            stored_password_encrypted = user_data.get('password')
            if encryption.decrypt(stored_password_encrypted, 1, 1) == (form_password):
                return jsonify({"message": "Login succesful", "role": "user"}), 200
            else:
                return jsonify({"message": "Wrong Password"}), 400
        else:
            return jsonify({"message": "User Doesn't Exist"}), 400

@auth_routes.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    form_username = data.get('username')
    form_password = data.get('password')

    if not form_username or not form_password:
        return jsonify({"message": "Username and password required"}), 400

    hashed_password = encryption.encrypt(form_password, 1, 1)#encrypt with N and D

    # Check if database with the same username already exists
    
    colNames = client['Users'].list_collection_names()
    if form_username in colNames:
        return jsonify({"message": "User already exists"}), 400
    else: 
        col = client['Users'][form_username]  # Create a new collection with the username
        col.insert_one({"password": hashed_password})
        return jsonify({"message": "User registered successfully"}), 201
    
@auth_routes.route('/view', methods=['POST'])
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
                                        'seats': 1}))
    
    return jsonify(flights), 200
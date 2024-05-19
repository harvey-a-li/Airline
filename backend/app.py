from flask import Flask, request, jsonify
from pymongo.mongo_client import MongoClient
from flask_cors import CORS
from auth_routes import auth_routes
from admin_routes import admin_routes
from airport_routes import airport_routes
from viewFlight_routes import viewFlight_routes
from modify_routes import modify_routes
# from dotenv import load_dotenv

# Load environment variables
# load_dotenv()
app = Flask(__name__)
CORS(app)  # Enable CORS for all domains



app.register_blueprint(auth_routes)
app.register_blueprint(admin_routes)
app.register_blueprint(airport_routes)
app.register_blueprint(viewFlight_routes)
app.register_blueprint(modify_routes)


@app.route('/home')
def home():
    return 'Home Page content'

if __name__ == '__main__':
    app.run(debug=True)
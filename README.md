Solo Project by Harvey Li

Here's the full instruction set in README markup format:

# Airline Application

This is a airline booking systems for travelers looking for an easy way to see all the flights they could potentially book.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

What things you need to install the software and how to install them:
```bash
node -v npm -v python --version
```

### Installing

A step-by-step series of examples that tell you how to get a development environment running.

1. Clone the repository:
```bash
git clone [https://github.com/yourusername/yourprojectname.git](https://github.com/harvey-a-li/Airline.git)
cd airline

```
2. Install the necessary packages for the frontend:

```bash
cd project  # Navigate into the frontend directory if it's separate
npm install

```
3. Install the necessary packages for the backend:

```bash
cd backend  # Navigate into the backend directory if it's separate
pip install -r requirements.txt

```
### Configuration
Explain how to configure the environment variables if necessary:

Set up the .env file in the backend directory with the necessary environment variables:

```bash
DB_URI=mongodb+srv://your_mongodb_uri
SECRET_KEY=your_secret_key
```

Set up any frontend environment variables in .env or directly in your application code.

### Running the Application
How to run the application:

Start the backend server:

```bash
cd backend
python app.py
```

Run the frontend in development mode:

```bash
cd project
npm start
```
The frontend should now be running on http://localhost:3000 and the backend on http://localhost:5000.

### Usage

There is an admin and user role. Admin account is already created and
they can access things like adding, modifying, and deleting flights.
Users can see which flight that want to book and will be able to
book flights through the interactive pages.

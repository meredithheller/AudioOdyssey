# This is the course project for CSE 30246 by Meredith Heller, Jack Galassi, Hugh Smith, and Jack Flaherty

# Organization:
    - algorithms:
        contains python files that parse csv and tsv datasets then upload to our mysql database
    - client:
        the react-native application for users to interact with our database
    - server: 
        our REST API that uses express and node.js to interact with our client and mysql database

# How To Run The Project

Requirements:
    - python3
    - python modules: unicodedata, unittest, urllib.parse, flask, flask_mysqldb, random, phonenumbers, scipy
    - expo go app
    - node.js

1. THE SERVER: Open a terminal run "python3 py_server/server.py
    - If the port specified at the end of server.py is not available, enter another port number. You will also need to update the global.port value in client/global.js to this port number

2. THE CLIENT: 
    Pre-step: cd into client folder. Create a .env file. Add the line:
        REACT_APP_GOOGLE_PLACES_API_KEY='' and put the api key (provided in email) in the quotation marks
    a) Open another terminal. Cd into client. Run the command "npm i" to install all necessary node modules. Because it is an expo go application, it cannot be run from the student machines. Please open the client code from your local terminal and run this command. 
    b) run "npm start"
    c) scan the barcode printed to the terminal with your iPhone camera and open in the expo go app by following the link provided. 
    d) Create an account and begin using Audio Odyssey!

from urllib.parse import _NetlocResultMixinBase
from flask import Flask
from flask_mysqldb import MySQL
from flask import request
import json

app = Flask(__name__)
app.config['MYSQL_HOST'] = 'db8.cse.nd.edu'
app.config['MYSQL_USER'] = 'mheller5'
app.config['MYSQL_PASSWORD'] = 'audioodyssey'
app.config['MYSQL_DB'] = 'mheller5'
mysql = MySQL(app)

# Members API Route
@app.route("/podcasts")
def podcasts():
    cur = mysql.connection.cursor()
    cur.execute('''SELECT * FROM podcasts''')
    row_headers=[x[0] for x in cur.description]
    rv = cur.fetchall()
    json_data=[]
    for result in rv:
        json_data.append(dict(zip(row_headers,result)))
    return json.dumps(json_data)

@app.route('/login',methods=['POST'])
def parse_login():
    data = request.json
<<<<<<< HEAD

    cur = mysql.connection.cursor()
    cur.execute(f"SELECT * FROM users WHERE users.username = '{data['username']}' and users.password = '{data['password']}';")
    row_headers=[x[0] for x in cur.description]
    rv = cur.fetchall()
    json_data=[]
    for result in rv:
        json_data.append(dict(zip(row_headers,result)))

    if len(json_data) == 0:
       return {"error" : "Incorrect username or password"}

    return json_data[0]
=======
    cur = mysql.connection.cursor()
    cur.execute(f"SELECT * FROM users WHERE users.username = '{data['username']}' and users.password = '{data['password']}';")
    rv = cur.fetchall()
    row_headers=[x[0] for x in cur.description]
    json_data=[]
    for result in rv:
        json_data.append(dict(zip(row_headers,result)))
        
    return json.dumps(json_data)[0]
>>>>>>> 8689209454427e76929087d56b73df8bdc18d1b0

@app.route('/createAccount', methods=['POST'])
def parse_request():
    data = request.json

    if data['password'] != data['confirmPassword']:
        return {"error" : "Passwords do not match"}

    phone_number = data['phoneNumber'].replace("-","")

    if not phone_number.isnumeric() or len(phone_number) != 10:
        return {"error" : "Phone number is not formatted properly (XXX-XXX-XXXX)"}

    cur = mysql.connection.cursor()
    cur.execute("INSERT INTO users (username, password, firstname, lastname, phonenumber) VALUES ('{uname}','{pword}','{fname}','{lname}','{pnum}');".format(
        uname = data['username'],
        pword = data['password'],
        fname = data['firstname'].capitalize(),
        lname = data['lastname'].capitalize(),
        pnum = phone_number
    ))
    mysql.connection.commit()

<<<<<<< HEAD
    return { "username" : data['username'], "password" : data['password'], "firstname" : data['firstname'], "lastname" : data['lastname'], "phoneNumber" : data['phoneNumber'] } 
=======
    return request.data
>>>>>>> 8689209454427e76929087d56b73df8bdc18d1b0

if __name__ == "__main__":
    app.run(host='db8.cse.nd.edu',debug=True, port=5008)



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
    cur = mysql.connection.cursor()
    cur.execute(f"SELECT * FROM users WHERE users.username = '{data['username']}' and users.password = '{data['password']}';")
    rv = cur.fetchall()
    row_headers=[x[0] for x in cur.description]
    json_data=[]
    for result in rv:
        json_data.append(dict(zip(row_headers,result)))
        
    return json.dumps(json_data)[0]

@app.route('/createAccount', methods=['POST'])
def parse_request():
    data = request.json
    cur = mysql.connection.cursor()
    cur.execute("INSERT INTO users (username, password, firstname, lastname, phonenumber) VALUES ('{uname}','{pword}','{fname}','{lname}','{pnum}');".format(
        uname = data['username'],
        pword = data['password'],
        fname = data['firstname'],
        lname = data['lastname'],
        pnum = data['phoneNumber']
    ))
    mysql.connection.commit()

    return request.data

if __name__ == "__main__":
    app.run(debug=True, port=5001)




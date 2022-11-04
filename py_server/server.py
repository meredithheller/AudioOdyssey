from urllib.parse import _NetlocResultMixinBase
from flask import Flask
from flask_mysqldb import MySQL
from flask import request
import json

app = Flask(__name__)
app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = 'mheller5'
app.config['MYSQL_PASSWORD'] = 'audioodyssey'
app.config['MYSQL_DB'] = 'mheller5'
mysql = MySQL(app)

# Members API Route
@app.route('/podcasts',methods=['POST'])
def podcasts():
    data = request.json
    sql_query = '''SELECT show_name, episode_name FROM podcasts WHERE episode_uri='{uri}';'''.format(
        uri = data['episode_uri'][0]
    )
    print(sql_query)
    cur = mysql.connection.cursor()
    cur.execute(sql_query)
    rv = cur.fetchall()
    json_data=[]
    for result in rv:
        json_data.append(result)
    print("TEST")
    print(rv)
    print(json_data)

    return json_data

@app.route('/login',methods=['POST'])
def parse_login():
    data = request.json

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

@app.route('/tripPodcasts', methods=['POST'])
def trip_podcasts():
    data = request.json

    cur = mysql.connection.cursor()
    sql_query = '''SELECT p.episode_uri
                FROM categories c, podcasts p
                WHERE c.episode_uri = p.episode_uri and (p.duration > 35 and p.duration < 55) and 
                (c.category = '{category}' '''.format(
                    category = data['categories'][0]
                )
    for i in data['categories']:
        if i == data['categories'][0]:
            continue
        sql_query += ''' or c.category = '{category}' '''.format(
            category = i
        )
    sql_query += ''') LIMIT 5;'''
    cur.execute(sql_query)
    rv = cur.fetchall()
    json_data = []
    for result in rv:
        json_data.append(result)
    return json_data


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

    return { "username" : data['username'], "password" : data['password'], "firstname" : data['firstname'], "lastname" : data['lastname'], "phoneNumber" : data['phoneNumber'] } 

if __name__ == "__main__":
    app.run(host='db8.cse.nd.edu',debug=True, port=5008)



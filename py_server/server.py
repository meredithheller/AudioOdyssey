from urllib.parse import _NetlocResultMixinBase
from flask import Flask, request, jsonify
from flask_mysqldb import MySQL
from flask import request
import json
import random
from ex_response import backend_response

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
        uri = data['episode_uri']
    )
    cur = mysql.connection.cursor()
    cur.execute(sql_query)
    rv = cur.fetchall()
    json_data=[]
    for result in rv:
        json_data.append(result)

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

def getRandResults(duration):
    sql_query = '''SELECT p.episode_uri, p.episode_name, p.show_name, p.duration, c.category
            FROM categories c, podcasts p
            WHERE c.episode_uri = p.episode_uri AND (p.duration  < {dur}) 
            ORDER BY RAND() 
            LIMIT 200;'''.format(
                dur = duration
            )
    cur = mysql.connection.cursor()
    cur.execute(sql_query)
    rv = cur.fetchall()
    # TODO: if rv == 0 just run a sql query to return the shortest podcast 50
    return rv



@app.route('/tripOptions', methods=['GET'])
def trip_options():
    # deconstruct params
    args_dict = request.args.to_dict()
    duration = float(args_dict['duration'])
    if args_dict['categories'] == 'none':
        categories = {}
        # randomly select 200 podcasts if no categories were provided
        sql_query = '''SELECT p.episode_uri, p.episode_name, p.show_name, p.duration, c.category
            FROM categories c, podcasts p
            WHERE c.episode_uri = p.episode_uri AND (p.duration  < {dur}) 
            ORDER BY RAND() 
            LIMIT 200;'''.format(
                dur = duration
            )
    else: 
        categories = args_dict['categories'].replace('_', ' ').split(',')
        sql_query = '''SELECT p.episode_uri, p.episode_name, p.show_name, p.duration
            FROM categories c, podcasts p
            WHERE c.episode_uri = p.episode_uri AND (p.duration  < {dur})'''.format(
                dur = duration
            )
        for index, cat in enumerate(categories):
            if index == 0:
                sql_query += f' AND (c.category = \'{cat}\''
            else:
                sql_query += f' OR c.category = \'{cat}\''
        sql_query += ''') 
            LIMIT 500;'''
    cur = mysql.connection.cursor()
    cur.execute(sql_query)
    rv = cur.fetchall()
    if len(rv) == 0:
        rv = getRandResults(duration) # TODO: somehow alert that we were unable to get podcasts with these categories
    # filter the results for podcasts that have already been listened to
        # execute sql query to get all listened to podcasts
    # TODO: change this to empty list, for now just converty tuple to list
    new_podcasts = list(rv)
    # podcast_history = set()
    # for pod_info_tuple in rv:
    #     if pod_info_tuple[0] not in podcast_history:
    #         new_podcasts.append(pod_info_tuple)
    
    possible_pods = {}
    for pod_info_tuple in new_podcasts:
        possible_pods[pod_info_tuple[0]] = {
            'uri': pod_info_tuple[0],
            'duration': pod_info_tuple[3],
            'subcategories': set(),
            'categories': set(),
            'image_uri': '',
            'show_name': pod_info_tuple[2],
            'episode_name': pod_info_tuple[1],
            'description': ''
        }
    subcat_scores = {}
    cat_scores = {}
    for pod_key in possible_pods:
        # get all of the podcasts' subcategories
        cat_query = '''SELECT category
            FROM categories
            WHERE episode_uri = \'{uri}\';'''.format(
                uri = pod_key
            )
        cur.execute(cat_query)
        rv = cur.fetchall()
        for cat in rv:
            # TODO: here add (category, score) as tuple to possible_pods; if not already been queried, need to execute query to get score
            score = random.uniform(0.0, 5.0) 
            possible_pods[pod_key]['categories'].add((cat[0], score))
        
        subcat_query = '''SELECT subcategory, is_power
            FROM subcategories
            WHERE episode_uri = \'{uri}\';'''.format(
                uri = pod_key
            )
        cur.execute(subcat_query)
        rv = cur.fetchall()
        for subcat in rv:
            # TODO: here add (subcategory, score, is_power) as tuple to possible_pods; if not already been queried, need to execute query to get score
            score = random.uniform(0.0, 5.0)
            possible_pods[pod_key]['subcategories'].add((subcat[0], score, subcat[1]))
    # for pod in possible_pods:
    #     print(possible_pods[pod])
    # print(possible_pods)
        
    
    # tell jack I'm also sending the actual categories they chose so he can optimize extra on those bc im sending all categories from all returned podcasts
    trip_options = jacks_func(duration, possible_pods, categories)
    # once jack returns trip_options, execute SQL query to get image and description
    # ask jack to return list length 3 or less of lists of the podcast dictionaries
        # TODO: handle no possibilities
    for trip_op in trip_options:
        for pod in trip_op:
            pod['rating'] = 0
            # these should be the dictionaries I created before
            # TODO: attempt sql query for image
            image_uri_query = '''SELECT image_uri
                FROM image_urls
                WHERE episode_uri = \'{uri}\';'''.format(
                    uri = pod['uri']
                )
            cur.execute(image_uri_query)
            rv = cur.fetchall()
            if len(rv) > 1:
                continue
            else:
                pod['image_uri'] = rv[0][0] # TODO: ensure I need to double [0] this
            # TODO: attempt sql query for description
            desc_query = '''SELECT episode_description
                FROM descriptions
                WHERE episode_uri = \'{uri}\';'''.format(
                    uri = pod['uri']
                )
            cur.execute(desc_query)
            rv = cur.fetchall()
            if len(rv) > 1:
                continue
            else:
                pod['image_uri'] = rv[0][0] # TODO: ensure I need to double [0] this

    # TODO: properly format the response
    cur.close()
    res_json = jsonify_podcasts(backend_response)
    return res_json

def jsonify_podcasts(podcast_options):
    # need to convert sets to lists
    for trip in podcast_options:
        for pod in trip:
            pod['subcategories'] = list(pod['subcategories'])
            pod['categories'] = list(pod['categories'])
    return jsonify(podcast_options)


# return set of podcasts user has listened to or replaced
def get_user_history():
    pass

# need to handle what to do if they haven't listened to a podcast from that category yet
def get_subcat_score(user_id, subcat):
    pass
def get_cat_score(user_id, cat):
    pass

def jacks_func(trip_duration, podcasts, categories):
    return []

@app.route('/tripPodcasts', methods=['POST'])
def trip_podcasts():
    data = request.json

    # cur = mysql.connection.cursor()
    # sql_query = '''SELECT p.episode_uri
    #             FROM categories c, podcasts p
    #             WHERE c.episode_uri = p.episode_uri and (p.duration > 35 and p.duration < 55) and 
    #             (c.category = '{category}' '''.format(
    #                 category = data['categories'][0]
    #             )
    # for i in data['categories']:
    #     if i == data['categories'][0]:
    #         continue
    #     sql_query += ''' or c.category = '{category}' '''.format(
    #         category = i
    #     )
    # sql_query += ''') LIMIT 5;'''
    # cur.execute(sql_query)
    # rv = cur.fetchall()
    json_data = []
    # for result in rv:
    #     json_data.append(result[0])
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

@app.route('/saveTrip', methods=['POST'])
def save_trip():
    data = request.json

    cur = mysql.connection.cursor()
    cur.execute("UPDATE total_trips SET num_trips = num_trips + 1;")
    cur.execute("select * from total_trips limit 1;")
    trip_id = cur.fetchall()[0][0]
    cur.execute("select now()")
    date = cur.fetchall()[0][0]
    cur.execute("INSERT INTO trip_info (trip_id, start_location, end_location, date_created) VALUES ('{tripid}','{start}','{stop}', '{date}');".format(
        tripid = trip_id,
        start = data['start'],
        stop = data['stop'],
        date = date
    ))

    cur.execute("INSERT INTO trip_episode_ratings (trip_id, episode_uri, rating) VALUES ('{tripid}','{episode_uri}', '{rating}');".format(
        tripid = trip_id,
        episode_uri = data['episode_uri'],
        rating = 0
    ))
    
    mysql.connection.commit()
    return request.data 

if __name__ == "__main__":
    app.run(host='db8.cse.nd.edu',debug=True, port=5006)



from urllib.parse import _NetlocResultMixinBase
from flask import Flask, request, jsonify
from flask_mysqldb import MySQL
from flask import request
import json
import random
from ex_response import backend_response
from algorithms import find_trip

app = Flask(__name__)
app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = 'mheller5'
app.config['MYSQL_PASSWORD'] = 'audioodyssey'
app.config['MYSQL_DB'] = 'mheller5'
mysql = MySQL(app)

# Members API Route


@app.route('/podcasts', methods=['POST'])
def podcasts():
    data = request.json
    sql_query = '''SELECT show_name, episode_name FROM podcasts WHERE episode_uri='{uri}';'''.format(
        uri=data['episode_uri']
    )
    cur = mysql.connection.cursor()
    cur.execute(sql_query)
    rv = cur.fetchall()
    json_data = []
    for result in rv:
        json_data.append(result)

    return json_data


@app.route('/login', methods=['POST'])
def parse_login():
    data = request.json

    cur = mysql.connection.cursor()
    cur.execute(
        f"SELECT * FROM users WHERE users.username = '{data['username']}' and users.password = '{data['password']}';")
    row_headers = [x[0] for x in cur.description]
    rv = cur.fetchall()
    json_data = []
    for result in rv:
        json_data.append(dict(zip(row_headers, result)))

    if len(json_data) == 0:
        return {"error": "Incorrect username or password"}

    return json_data[0]


def getRandResults(duration):
    sql_query = '''SELECT p.episode_uri, p.episode_name, p.show_name, p.duration, c.category
            FROM categories c, podcasts p
            WHERE c.episode_uri = p.episode_uri AND (p.duration  < {dur}) 
            ORDER BY RAND() 
            LIMIT 200;'''.format(
                dur=duration
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
    duration = random.uniform(20, 400)
    # duration = float(args_dict['duration'])
    if args_dict['categories'] == 'none':
        categories = {}
        # randomly select 200 podcasts if no categories were provided
        sql_query = '''SELECT p.episode_uri, p.episode_name, p.show_name, p.duration, c.category
            FROM categories c, podcasts p
            WHERE c.episode_uri = p.episode_uri AND (p.duration  < {dur}) 
            ORDER BY RAND() 
            LIMIT 200;'''.format(
            dur=duration
        )
    else:
        categories = args_dict['categories'].replace('_', ' ').split(',')
        sql_query = '''SELECT p.episode_uri, p.episode_name, p.show_name, p.duration
            FROM categories c, podcasts p
            WHERE c.episode_uri = p.episode_uri AND (p.duration  < {dur})'''.format(
            dur=duration
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
        # TODO: somehow alert that we were unable to get podcasts with these categories
        rv = getRandResults(duration)
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
            'image_url': '',
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
            uri=pod_key
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
            uri=pod_key
        )
        cur.execute(subcat_query)
        rv = cur.fetchall()
        for subcat in rv:
            # TODO: here add (subcategory, score, is_power) as tuple to possible_pods; if not already been queried, need to execute query to get score
            score = random.uniform(0.0, 5.0)
            possible_pods[pod_key]['subcategories'].add(
                (subcat[0], score, subcat[1]))
    # for pod in possible_pods:
    #     print(possible_pods[pod])
    # print(possible_pods)

    # tell jack I'm also sending the actual categories they chose so he can optimize extra on those bc im sending all categories from all returned podcasts
    print('DURATION:', duration)
    trip_options = find_trip(duration, possible_pods, categories)
    print(len(trip_options))
    # something's not passing right
    # once jack returns trip_options, execute SQL query to get image and description
    # ask jack to return list length 3 or less of lists of the podcast dictionaries
    # TODO: handle no possibilities
    for trip_op in trip_options:
        for pod in trip_op:
            pod['rating'] = 0
            # these should be the dictionaries I created before
            # TODO: attempt sql query for image
            image_url_query = '''SELECT image_url
                FROM image_urls
                WHERE episode_uri = \'{uri}\';'''.format(
                uri=pod['uri']
            )
            cur.execute(image_url_query)
            rv = cur.fetchall()
            if len(rv) > 1:
                continue
            else:
                # TODO: ensure I need to double [0] this
                pod['image_url'] = rv[0][0]
            # TODO: attempt sql query for description
            desc_query = '''SELECT episode_description
                FROM descriptions
                WHERE episode_uri = \'{uri}\';'''.format(
                uri=pod['uri']
            )
            cur.execute(desc_query)
            rv = cur.fetchall()
            if len(rv) > 1:
                continue
            else:
                # TODO: ensure I need to double [0] this
                pod['description'] = rv[0][0]

    # TODO: properly format the response
    cur.close()
    res_json = jsonify_podcasts(trip_options)
    return res_json


def jsonify_podcasts(podcast_options):
    # need to convert sets to lists
    for trip in podcast_options:
        for pod in trip:
            pod['subcategories'] = list(pod['subcategories'])
            pod['categories'] = list(pod['categories'])
    return jsonify(podcast_options)


# return set of podcasts user has listened to or replaced
@app.route('/getCurrTrip', methods=['GET'])
def get_curr_trip():
     # deconstruct params
    args_dict = request.args.to_dict()
    cur = mysql.connection.cursor()
    cur.execute("select * from trip_info where username = '{username}' order by date_created desc limit 1;".format(
        username = args_dict['username']
    ))
    most_recent = cur.fetchone() # 0,0 or just 0? for whole row?
    if most_recent == None:
        most_recent = "You haven't listened to any podcasts yet"

    else:
        cur.execute("select episode_uri, rating from trip_episode_ratings where trip_id = {tripid};".format(
            tripid=most_recent[0]
        ))
        eps = cur.fetchall()
        podcasts = []
        for x in range(0, len(eps)):

            cur.execute("select episode_description from descriptions where episode_uri = '{uri}';".format(
                uri=eps[x][0]
            ))
            desc = cur.fetchall()
        
            cur.execute("select episode_name, show_name from podcasts where episode_uri = '{uri}';".format(
                uri=eps[x][0]
            ))
            pod = cur.fetchall()

            cur.execute("select image_url from image_urls where episode_uri = '{uri}';".format(
                uri=eps[x][0]
            ))
            img_url = cur.fetchall()

            current = {"uri": eps[x][0], "image_url": img_url[0][0], "rating": eps[x][1], "episode_name": pod[0][0], "show_name": pod[0][1], "description": desc[0][0]}
            #print(current)
            podcasts.append(current)

    output = {"trip_id" : most_recent[0], "start_loc" : most_recent[2], "destination" : most_recent[3], "podcasts" : podcasts}
                
    mysql.connection.commit()
    #output: (json)
    
    return output

# need to handle paginated
def get_user_hist():
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
        return {"error": "Passwords do not match"}

    phone_number = data['phoneNumber'].replace("-", "")

    if not phone_number.isnumeric() or len(phone_number) != 10:
        return {"error": "Phone number is not formatted properly (XXX-XXX-XXXX)"}

    cur = mysql.connection.cursor()
    cur.execute("INSERT INTO users (username, password, firstname, lastname, phonenumber) VALUES ('{uname}','{pword}','{fname}','{lname}','{pnum}');".format(
        uname=data['username'],
        pword=data['password'],
        fname=data['firstname'].capitalize(),
        lname=data['lastname'].capitalize(),
        pnum=phone_number
    ))
    mysql.connection.commit()

    return {"username": data['username'], "password": data['password'], "firstname": data['firstname'], "lastname": data['lastname'], "phoneNumber": data['phoneNumber']}


@app.route('/saveTrip', methods=['POST'])
def save_trip():
    data = request.json
    # username, categories (cat & rating), subcategories (cat & rating), description, duration, show_name, episode_name, 
    cur = mysql.connection.cursor()
    cur.execute("UPDATE total_trips SET num_trips = num_trips + 1;")
    mysql.connection.commit()
    cur.execute("select * from total_trips limit 1;")
    trip_id = cur.fetchall()[0][0]
    print(trip_id)
    cur.execute("select now()")
    date = cur.fetchall()[0][0]
    cur.execute("INSERT INTO trip_info (trip_id, username, start_location, stop_location, date_created) VALUES ('{tripid}', '{username}', '{start}','{stop}', '{date}');".format(
        tripid = trip_id,
        username = data['username'],
        start = data['start_loc'],
        stop = data['destination'],
        date = date
    ))
    # trip_info endpoint 1?
    for podcast in data['tripInfo']:
        cur.execute("INSERT INTO trip_episode_ratings (username, trip_id, episode_uri, rating) VALUES ('{uname}','{tripid}','{episode_uri}', '{rating}');".format(
            uname = data['username'],
            tripid = trip_id,
            episode_uri = podcast['uri'],
            rating = -1
        ))
    print(trip_id)
    for cat in data["categories"]:
        cur.execute("INSERT INTO trip_categories (trip_id, category) VALUES ('{tripid}', '{cat}');".format(
            tripid  = trip_id,
            cat     = cat
        ))

    mysql.connection.commit()
    return request.data 

###
### This is where I'm working
###

@app.route('/saveRating', methods=['POST'])
def save_Rating():
    data = request.json
    cur = mysql.connection.cursor()

    for pod in data['podcastRatings']: # arbitary naming of this value passed as podcasts. can be changed whenever
        '''
        #cur.execute("INSERT INTO trip_episode_ratings VALUES ('{uname}', '{trip_id}', '{uri}', '{rating}');".format(
            uname = data['username'],
            trip_id = data['trip_id'],
            uri = row[0],
            rating = row[1]
        )'''
        # if they have already rated, then ignore a -1.
        # if they haven't already rated, then check -1

        if pod['rating'] != -1:
            ## categories
            # acquires all categories associated with episode
            # cur.execute("UPDATE trip_episode_ratings set "

            cur.execute("select category from categories where episode_uri = '{uri}';".format(
                uri = pod['uri']
            ))
            cats = cur.fetchall()

            # for each category in the list of categories
            for cat in cats:
                print(cat[0])
                # get the row in user_category_store associated with the username and category
                # CAUSING AN ERROR FOR SOME REASON
                cur.execute("select * from user_category_score where username = '{uname}' and category = '{cat}';".format(
                    uname = data['username'],
                    cat = cat[0]
                ))
                results = cur.fetchall()
                print(results)

                # if the row exists (returns non-empty table), updates the row
                if results != '()':
                    cur.execute("update user_category_score set count = count + 1 and score = score + {rating} where username = '{user}' and category = '{cat}';".format(
                        rating = pod['rating'],
                        user = data['username'],
                        cat = cat
                    ))
                # otherwise- if the row is empty, insert the data into the user_category_score table
                else:
                    cur.execute("insert into user_category_score values ({user}, {cat}, {count}, {score};".format(
                        user = data['username'],
                        cat = cat,
                        count = pod['rating'],
                        rating = pod['rating']
                    ))
            
            ## subcategories (same as categories)
            cur.execute("select subcategory from subcategories where episode_uri = '{uri}';".format(
                uri = pod['uri']
            ))
            subcats = cur.fetchall()[0][0]
            for subcat in subcats:
                cur.execute("select * from user_subcategory_score where username = {uname} and subcategory = {subcat};".format(
                    uname = data['username'],
                    subcat = subcat
                ))
                results = cur.fetchall()[0][0]
                if results != '':
                    cur.execute("update user_category_score set count = count + 1 and score = score + {rating} where username = {user} and subcategory = {subcat};".format(
                        rating = pod['rating'],
                        user = data['username']
                    ))
                else:
                    cur.execute("insert into user_subcategory_score values ({user}, {subcat}, {count}, {score};".format(
                        user = data['username'],
                        subcat = subcat,
                        count = pod['rating'],
                        rating = pod['rating']
                    ))


    mysql.connection.commit()
    return [] #UPDATE

# /update_history
@app.route('/updateHist', methods=['POST'])
def update_History():
    data = request.json
    cur = mysql.connection.cursor()
    cur.execute("INSERT INTO episode_history values('{user}','{uri}','{rep}');".format(
        user = data['username'],
        uri = data['episode_uri'],
        rep = data['replaced']
    ))

    return []

if __name__ == "__main__":
    app.run(host='db8.cse.nd.edu',debug=True, port=5006)

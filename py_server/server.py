from unicodedata import category
from unittest import result
from urllib.parse import _NetlocResultMixinBase
from flask import Flask, request, jsonify
from flask_mysqldb import MySQL
from flask import request
import json
import random
from ex_response import backend_response
from podcast_algorithm import find_trip
from buddy_algorithm import find_buddy
import phonenumbers

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
    if (args_dict['duration']):
        duration = float(args_dict['duration'])/60.
    else:
        duration = random.uniform(20, 150)

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
        username=args_dict['username']
    ))
    most_recent = cur.fetchone()  # 0,0 or just 0? for whole row?
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

            current = {"uri": eps[x][0], "image_url": img_url[0][0], "rating": eps[x][1],
                       "episode_name": pod[0][0], "show_name": pod[0][1], "description": desc[0][0]}
            # print(current)
            podcasts.append(current)

    output = {"trip_id": most_recent[0], "start_loc": most_recent[2],
              "destination": most_recent[3], "podcasts": podcasts}

    mysql.connection.commit()
    #output: (json)

    return output


# return set of podcasts user has listened to or replaced
def get_user_history():
    pass


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
    cur.execute("select now()")
    date = cur.fetchall()[0][0]
    cur.execute("INSERT INTO trip_info (trip_id, username, start_location, stop_location, date_created) VALUES ('{tripid}', '{username}', '{start}','{stop}', '{date}');".format(
        tripid=trip_id,
        username=data['username'],
        start=data['start_loc'],
        stop=data['destination'],
        date=date
    ))
    # trip_info endpoint 1?
    for podcast in data['tripInfo']:
        cur.execute("INSERT INTO trip_episode_ratings (username, trip_id, episode_uri, rating) VALUES ('{uname}','{tripid}','{episode_uri}', '{rating}');".format(
            uname=data['username'],
            tripid=trip_id,
            episode_uri=podcast['uri'],
            rating=-1
        ))

    for cat in data["categories"]:
        cur.execute("INSERT INTO trip_categories (trip_id, category) VALUES ('{tripid}', '{cat}');".format(
            tripid=trip_id,
            cat=cat
        ))

    mysql.connection.commit()
    return request.data


@app.route('/saveRating', methods=['POST'])
def save_Rating():
    data = request.json
    cur = mysql.connection.cursor()
    # arbitary naming of this value passed as podcasts. can be changed whenever
    for pod in data['podcastRatings']:

        # if they have already rated, then ignore a -1.
        # if they haven't already rated, then check -1

        # if past_rating != -1, subtract past rating from categories, subcategories before adding new.

        if pod['rating'] != -1:
            # categories
            # acquires all categories associated with episode
            # cur.execute("UPDATE trip_episode_ratings set "

            cur.execute("select rating from trip_episode_ratings where episode_uri = '{uri}' and username = '{user}';".format(
                uri=pod['uri'],
                user=data['username']
            ))
            past_rating = cur.fetchall()[0][0]
            print("episode: ", pod['uri'])
            print("past rating: ", past_rating)
            print("new rating: ", pod['rating'])
            cur.execute("update trip_episode_ratings set rating = {rating} where username = '{user}' and episode_uri = '{uri}';".format(
                rating=pod['rating'],
                user=data['username'],
                uri=pod['uri']
            ))

            cur.execute("select category from categories where episode_uri = '{uri}';".format(
                uri=pod['uri']
            ))
            cats = cur.fetchall()

            cur.execute("insert into episode_history values ('{user}', '{uri}', {rep});".format(
                        user=data['username'],
                        uri=pod['uri'],
                        rep=0
                        ))

            # for each category in the list of categories
            for cat in cats:
                # get the row in user_category_store associated with the username and category
                # CAUSING AN ERROR FOR SOME REASON
                cur.execute("select * from user_category_score where username = '{uname}' and category = '{cat}';".format(
                    uname=data['username'],
                    cat=cat[0]
                ))
                results = cur.fetchall()

                # if the row exists (returns non-empty table), updates the row
                if len(results) != 0:
                    cur.execute("update user_category_score set count = count + 1, score = score + {rating} where username = '{user}' and category = '{cat}';".format(
                        rating=pod['rating'],
                        user=data['username'],
                        cat=cat[0]
                    ))

                    if past_rating != -1:
                        cur.execute("update user_category_score set score = score - {old_rating}, count = count - 1 where username = '{user}' and category = '{cat}';".format(
                            old_rating=past_rating,
                            user=data['username'],
                            cat=cat[0]
                        ))

                # otherwise- if the row is empty, insert the data into the user_category_score table
                else:
                    cur.execute("insert into user_category_score values ('{user}', '{cat}', {count}, {rating});".format(
                        user=data['username'],
                        cat=cat[0],
                        count=1,
                        rating=pod['rating']
                    ))

            # subcategories (same as categories)
            cur.execute("select subcategory from subcategories where episode_uri = '{uri}';".format(
                uri=pod['uri']
            ))
            subcats = cur.fetchall()
            for subcat in subcats:
                cur.execute("select * from user_subcategory_score where username = '{uname}' and subcategory = '{subcat}';".format(
                    uname=data['username'],
                    subcat=subcat[0]
                ))
                results = cur.fetchall()
                if len(results) != 0:
                    cur.execute("update user_subcategory_score set count = count + 1, score = score + {rating} where username = '{user}' and subcategory = '{subcat}';".format(
                        rating=pod['rating'],
                        user=data['username'],
                        subcat=subcat[0]
                    ))

                    if past_rating != pod['rating'] and past_rating != -1:
                        cur.execute("update user_subcategory_score set score = score - {old_rating}, count = count - 1 where username = '{user}' and subcategory = '{subcat}';".format(
                            old_rating=past_rating,
                            user=data['username'],
                            subcat=subcat[0]
                        ))

                else:
                    cur.execute("insert into user_subcategory_score values ('{user}', '{subcat}', {count}, {rating});".format(
                        user=data['username'],
                        subcat=subcat[0],
                        count=1,
                        rating=pod['rating']
                    ))

    mysql.connection.commit()
    return []

# TODO: implement
# args: username
# return: total number of minutes of podcasts the user has listened to (as a formatted string please)


@app.route('/wrapped/minutes', methods=['GET'])
def minutes():
    args_dict = request.args.to_dict()
    username = args_dict['username']
    sql_query = '''SELECT sum(duration)
                    FROM episode_history e, podcasts p
                    WHERE e.episode_uri=p.episode_uri AND e.username='{username}' AND e.replaced=0;'''.format(
        username=username
    )
    cur = mysql.connection.cursor()
    cur.execute(sql_query)
    totalMinutes = cur.fetchall()[0][0]
    minutes = str("{:,}".format(totalMinutes))
    print(minutes)
    return minutes  # return as formatted string please (with commas)

# TODO: implement
# args: username
# return: total number of miles user has traveled as a formatted string(could make this easier by adding a trip miles column to the trip_info table and calling the google maps api in that endpoint (/saveTrip) to get the miles between start location and destination, then just need to add all of the users miles from that table and return here)


@app.route('/wrapped/miles', methods=['GET'])
def miles():
    args_dict = request.args.to_dict()
    username = args_dict['username']
    totalMiles = round(random.uniform(20, 10000000))
    miles = str("{:,}".format(totalMiles))
    return miles  # return as formatted string please (with commas)

# TODO: implement
# args: username
# return: json object of their highest rated category and the percentile (formatted as ordinal number, the function do so is already in here) of listeners that they are within that category


@app.route('/wrapped/category', methods=['GET'])
def topCategory():
    args_dict = request.args.to_dict()
    username = args_dict['username']
    sql_query = '''SELECT category, score
                    FROM user_category_score u
                    WHERE u.username='{username}'
                    ORDER BY score desc LIMIT 1;'''.format(
        username=username
    )
    cur = mysql.connection.cursor()
    cur.execute(sql_query)
    result = cur.fetchall()
    topCategory = result[0][0]
    score = result[0][1]
    # convert (round to nearest whole percent) and return as a string here
    sql_query = '''SELECT (
                    SELECT count(score)
                    FROM user_category_score u 
                    WHERE score>={score} AND u.category='{category}') / (
                    SELECT count(score)
                    FROM user_category_score u
                    WHERE u.category='{category}') as percentile;'''.format(
        score=score,
        category=topCategory
    )
    cur = mysql.connection.cursor()
    cur.execute(sql_query)
    percentile = round(float(cur.fetchall()[0][0]))
    def ordinal(n): return "%d%s" % (
        n, "tsnrhtdd"[(n//10 % 10 != 1)*(n % 10 < 4)*n % 10::4])
    ordinal_percentile = ordinal(percentile)
    print(topCategory)
    print(ordinal_percentile)
    return {'topCategory': topCategory, 'percentile': ordinal_percentile}

# TODO: implement


@app.route('/wrapped/buddy', methods=['GET'])
def buddy():
    args_dict = request.args.to_dict()
    username = args_dict['username']
    cur = mysql.connection.cursor()
    cat_sql_query = 'SELECT username, category, score/count as user_avg_cat_rating FROM user_category_score;'
    cur.execute(cat_sql_query)
    category_scores = cur.fetchall()
    user_categories_dict = {}
    for result in category_scores:
        if result[0] in user_categories_dict:
            user_categories_dict[result[0]][result[1]] = result[2]
        else:
            user_categories_dict[result[0]] = {result[1]: result[2]}
    buddy_username = find_buddy(username, user_categories_dict)
    if buddy_username == 'no username data':
        print('no data')
        buddy_info_query = ''' SELECT firstname, lastname, phonenumber 
                        FROM users
                        ORDER BY RAND() 
                        LIMIT 1;'''
    else:    
        buddy_info_query = ''' SELECT firstname, lastname, phonenumber 
                            FROM users 
                            WHERE username='{uname}';'''.format(
                                uname = buddy_username,
                            )
    cur.execute(buddy_info_query)
    buddy_info = cur.fetchall()

    firstName = buddy_info[0][0]
    lastName = buddy_info[0][1]
    formatted_number = buddy_info[0][2]
    try:
        formatted_number = phonenumbers.format_number(phonenumbers.parse(formatted_number, 'US'), phonenumbers.PhoneNumberFormat.NATIONAL)
    except: 
        print('cannot format phone number')
    return {'firstName': firstName, 'lastName': lastName, 'phone': formatted_number}


if __name__ == "__main__":
    app.run(host='db8.cse.nd.edu', debug=True, port=5005)

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



# used when not enough data
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
    return rv


@app.route('/tripOptions', methods=['GET'])
def trip_options():
    # deconstruct params
    args_dict = request.args.to_dict()
    if (args_dict['duration']):
        duration = float(args_dict['duration'])/60.
    else:
        duration = random.uniform(20, 150)

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
        rv = getRandResults(duration)
    new_podcasts = list(rv)

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
            score = random.uniform(0.0, 5.0)
            possible_pods[pod_key]['subcategories'].add(
                (subcat[0], score, subcat[1]))

    trip_options = find_trip(duration, possible_pods, categories)
    if(len(trip_options) == 0):
        return {}
    for trip_op in trip_options:
        for pod in trip_op:
            pod['rating'] = 0
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
                pod['image_url'] = rv[0][0]
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
                pod['description'] = rv[0][0]

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
    most_recent = cur.fetchone() 
    output = {}
    if most_recent != None:
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
            podcasts.append(current)

        output = {"trip_id": most_recent[0], "start_loc": most_recent[2],
              "destination": most_recent[3], "podcasts": podcasts}

        mysql.connection.commit()
    #output: (json)

    return output


# return set of podcasts user has listened to or replaced
@app.route('/get_user_history', methods=['GET'])
def get_user_history():
    # deconstruct params
    args_dict = request.args.to_dict()
    page = int(args_dict['page'])
    page = (page*5)+1
    cur = mysql.connection.cursor()

    cur.execute("select count(*) from trip_info where username = '{username}';".format(
        username=args_dict['username']
    ))
    num_podcasts = cur.fetchall()
    error = 0
    if num_podcasts[0][0] == 0:
        return {}
    if int(num_podcasts[0][0]) < page:
        error = 1

    cur.execute("select trip_id from trip_info where username = '{username}' group by trip_id order by trip_id desc limit {page}, 5;".format(
        username=args_dict['username'],
        page=page
    ))
    raw_trip_ids = cur.fetchall()
    trip_ids = []
    for trip_id in raw_trip_ids:
        trip_ids.append(trip_id[0])

    trips = []
    for trip in trip_ids:
        episodes = []
        cur.execute("select start_location, stop_location from trip_info where username = '{username}' and trip_id = '{trip}';".format(
            username=args_dict['username'],
            trip=trip
        ))
        start_stop = cur.fetchall()

        cur.execute("select episode_uri from trip_episode_ratings where username = '{username}' and trip_id = '{trip}';".format(
            username=args_dict['username'],
            trip=trip
        ))
        raw_uris = cur.fetchall()
        uris = []

        for uri in raw_uris:
            uris.append(uri[0])

        for uri in uris:
            cur.execute("select episode_description from descriptions where episode_uri = '{uri}';".format(
                uri=uri
            ))
            desc = cur.fetchall()

            cur.execute("select episode_name, show_name, duration from podcasts where episode_uri = '{uri}';".format(
                uri=uri
            ))
            pod = cur.fetchall()

            cur.execute("select image_url from image_urls where episode_uri = '{uri}';".format(
                uri=uri
            ))
            img_url = cur.fetchall()

            cur.execute("select rating from trip_episode_ratings where episode_uri = '{uri}' and username = '{user}';".format(
                uri=uri,
                user=args_dict['username']
            ))
            rating = cur.fetchall()

            episode = {"uri": uri, "image_url": img_url[0][0], "rating": rating[0][0], "episode_name": pod[0]
                       [0], "show_name": pod[0][1], "duration": pod[0][2], "description": desc[0][0]}
            episodes.append(episode)

        full_trip = {
            "trip_id": trip, "starting_loc": start_stop[0][0], "destination": start_stop[0][1], "podcasts": episodes}
        trips.append(full_trip)
    return trips


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
    # remove dangerous characters from locations
    starting_loc = data['start_loc'].replace("'", "").replace(";", "")
    ending_loc = data['destination'].replace("'", "").replace(";", "")
    cur.execute("INSERT INTO trip_info (trip_id, username, start_location, stop_location, date_created) VALUES ('{tripid}', '{username}', '{start}','{stop}', '{date}');".format(
        tripid=trip_id,
        username=data['username'],
        start=starting_loc,
        stop=ending_loc,
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

            cur.execute("select rating from trip_episode_ratings where episode_uri = '{uri}' and username = '{user}';".format(
                uri=pod['uri'],
                user=data['username']
            ))
            past_rating = cur.fetchall()[0][0]
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
    result = cur.fetchall()[0][0]
    if result == None:
        totalMinutes = 0.0
    else:
        totalMinutes = result
    totalMinutes = round(totalMinutes, 2)
    minutes = str("{:,}".format(totalMinutes))
    return minutes  # return as formatted string please (with commas)

@app.route('/wrapped/miles', methods=['GET'])
def miles():
    args_dict = request.args.to_dict()
    username = args_dict['username']
    totalMiles = round(random.uniform(20, 10000000))
    miles = str("{:,}".format(totalMiles))
    return miles  # return as formatted string please (with commas)

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
    if cur.rowcount == 0:
        topCategory = "None"
        percentile = 100
    else:
        result = cur.fetchall()
        topCategory = result[0][0]
        score = result[0][1]

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
        percentile = round(float(100-100*(cur.fetchall()[0][0])))
    def ordinal(n): return "%d%s" % (
        n, "tsnrhtdd"[(n//10 % 10 != 1)*(n % 10 < 4)*n % 10::4])
    ordinal_percentile = ordinal(percentile)
    return {'topCategory': topCategory, 'percentile': ordinal_percentile}


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
        buddy_info_query = ''' SELECT firstname, lastname, phonenumber 
                        FROM users
                        ORDER BY RAND() 
                        LIMIT 1;'''
    else:
        buddy_info_query = ''' SELECT firstname, lastname, phonenumber 
                            FROM users 
                            WHERE username='{uname}';'''.format(
            uname=buddy_username,
        )
    cur.execute(buddy_info_query)
    buddy_info = cur.fetchall()

    firstName = buddy_info[0][0]
    lastName = buddy_info[0][1]
    formatted_number = buddy_info[0][2]
    try:
        formatted_number = phonenumbers.format_number(phonenumbers.parse(
            formatted_number, 'US'), phonenumbers.PhoneNumberFormat.NATIONAL)
    except:
        formatted_number = '3095334163'
    return {'firstName': firstName, 'lastName': lastName, 'phone': formatted_number}


@app.route('/replacePlanningPodcast', methods=['GET'])
def replacePlanningPodcast():
    args_dict = request.args.to_dict()
    cur = mysql.connection.cursor()
    username = args_dict['username']
    duration = args_dict['duration']
    categories = args_dict['categories'].replace('_', ' ').split(',')
    duration = float(duration)
    upper_dur = duration + duration * .1
    lower_dur = duration - duration * .1
    sql_query = '''SELECT p.episode_uri, duration, show_name, episode_name
                    FROM podcasts p, categories c
                    WHERE c.episode_uri = p.episode_uri AND p.duration < {upper_dur} AND 
                    p.duration > {lower_dur} AND c.category = '{category}'
                    '''.format(
        upper_dur=upper_dur,
        lower_dur=lower_dur,
        category=categories[0]
    )
    first = True
    for category in categories:
        if first:
            first = False
            continue
        sql_query += '''OR c.category =
                        '{category}'
                        '''.format(category=category)
    sql_query += '''ORDER BY RAND() LIMIT 1;'''
    cur.execute(sql_query)
    result = cur.fetchall()
    uri = result[0][0]
    return_dict = {}
    return_dict['uri'] = uri
    return_dict['duration'] = result[0][1]
    return_dict['show_name'] = result[0][2]
    return_dict['episode_name'] = result[0][3]
    sql_query = '''SELECT episode_description
                    FROM descriptions d
                    WHERE d.episode_uri = '{uri}'
                    '''.format(uri=uri)
    cur.execute(sql_query)
    description = cur.fetchall()
    return_dict['description'] = description[0]
    sql_query = '''SELECT image_url
                FROM image_urls i
                WHERE i.episode_uri = '{uri}'
                '''.format(uri=uri)
    cur.execute(sql_query)
    image_url = cur.fetchall()[0]
    return_dict['image_url'] = image_url[0]
    sql_query = '''SELECT category
                FROM categories c
                WHERE c.episode_uri = '{uri}'
                '''.format(uri=uri)
    cur.execute(sql_query)
    result = cur.fetchall()
    categories = list()
    for i in result:
        categories.append(i)
    return_dict['categories'] = categories
    sql_query = '''SELECT subcategory, is_power
                FROM subcategories s
                WHERE s.episode_uri = '{uri}'
                '''.format(uri=uri)
    cur.execute(sql_query)
    result = cur.fetchall()
    subcategories = list()
    for i in result:
        subcatlist = list()
        subcatlist.append(i[0])
        sql_query = '''SELECT score
                        FROM user_subcategory_score u
                        WHERE u.username = '{username}' AND u.subcategory = '{subcategory}'
                    '''.format(username=username, subcategory=i[0])
        cur.execute(sql_query)
        score = cur.fetchall()

        try:
            subcatlist.append(score[0][0])
        except:
            subcatlist.append(0)
        subcatlist.append(i[1])
        subcategories.append(subcatlist)
    return_dict['subcategories'] = subcategories
    return return_dict


if __name__ == "__main__":
    app.run(host='db8.cse.nd.edu', debug=True, port=5014)

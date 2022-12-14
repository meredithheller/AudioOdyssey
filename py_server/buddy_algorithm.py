from scipy import spatial

def find_buddy(username, users):
    # create own vector
    if username not in users:
        return 'no username data'
    user_vector = get_vector(users[username])
    distance = None
    closet_user = ''
    for user in users:
        if user != username:
            other_user_vec = get_vector(users[username])
            new_distance = spatial.distance.cosine(other_user_vec, user_vector)
            if distance == None or new_distance < distance:
                distance = new_distance
                closet_user = user
    return closet_user


# compute the similarity between another user and 
def get_vector(user_dict):
    vec = []
    for index, cat in enumerate(category_array):
        if cat in user_dict:
            vec.append(float(user_dict[cat]))
        else:
            vec.append(0)
    return vec


category_array = [
    'Leisure',
    'Sports News',
    'Video Games',
    'Buddhism',
    'Entertainment News',
    'Natural Sciences',
    'Courses',
    'Parenting',
    'Medicine',
    'Improv',
    'Rugby',
    'Film Interviews',
    'Stories for Kids',
    'Visual Arts',
    'Self-Improvement',
    'Careers',
    'Science Fiction',
    'Wilderness',
    'Arts',
    'Business News',
    'Golf',
    'Language Learning',
    'Fashion & Beauty',
    'Film Reviews',
    'Games',
    'TV Reviews',
    'Baseball',
    'Music',
    'Personal Journals',
    'Cricket',
    'Chemistry',
    'Kids & Family',
    'Books',
    'Food',
    'Music History',
    'Stand-Up',
    'Basketball',
    'Outdoor',
    'Games & Hobbies',
    'Documentary',
    'News',
    'Design',
    'Professional',
    'Pets & Animals',
    'Management',
    'Sexuality',
    'Education',
    'Performing Arts',
    'Comedy Interviews',
    'Non-Profit',
    'Crafts',
    'Home & Garden',
    'Places & Travel',
    'Relationships',
    'Judaism',
    'Marketing',
    'News Commentary',
    'TV & Film',
    'Sports',
    'Mathematics',
    'Music Interviews',
    'Tech News',
    'Christianity',
    'Health & Fitness',
    'Government',
    'Wrestling',
    'Religion & Spirituality',
    'Fantasy Sports',
    'Education for Kids',
    'Earth Sciences',
    'Football',
    'Nature',
    'Running',
    'Comedy',
    'Business',
    'Automotive',
    'Social Sciences',
    'Sports & Recreation',
    'Alternative Health',
    'Animation & Manga',
    'Self-Help',
    'Fitness',
    'History',
    'Science',
    'Nutrition',
    'True Crime',
    'Life Sciences',
    'Hobbies',
    'Philosophy',
    'Health',
    'Spirituality',
    'Film History',
    'Hockey',
    'Religion',
    'Volleyball',
    'Soccer',
    'After Shows',
    'Fiction',
    'Drama',
    'Astronomy',
    'Technology',
    'Mental Health',
    'Aviation',
    'Music Commentary',
    'Investing',
    'Society & Culture',
    'Comedy Fiction',
    'Entrepreneurship',
    'How To',
    'Islam'
]
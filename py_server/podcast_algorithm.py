import random
# constants
MULTIPLE = 1


def round_duration(num, multiple):
    return multiple * round(num/multiple)


# Passes in dictionary of dictionaries:
# podcast_id:
# 	duration: number
# 	subcategories: [(name, score)] set
# 	categories: [(name, score)] set
#     and some other unecessary stuff...
# and trip duration
def find_trip(unrounded_trip_duration, podcast_dict, categories):
    # rounded duration (to nearest MULTIPLE): [[podcast_node, used],...]
    duration_dict = {}
    # rounded trip_duration
    trip_duration = round_duration(unrounded_trip_duration, MULTIPLE)
    # find weight of each podcast and put each node in corresponding duration_dict
    for podcast in podcast_dict.values():
        # category dict for time efficiency
        category_dict = {}
        for cat in podcast['categories']:
            category_dict[cat] = 1
        sum = 0
        count = 0
        cats = 0
        num_matching_cats = 0
        for subcat in podcast['subcategories']:
            sum += subcat[1]
            count += 1
        for cat in podcast['categories']:
            sum += cat[1]
            count += 1
            cats += 1
        rate_weight = sum/count
        for cat in categories:
            if cat in category_dict:
                num_matching_cats += 1
        cat_weight = num_matching_cats/cats
        node = podcast_node(
            podcast['uri'], rate_weight+cat_weight, podcast['duration'])
        rounded_duration = round_duration(node.duration, MULTIPLE)
        if rounded_duration in duration_dict:
            duration_dict[rounded_duration].append([node, 0])
        else:
            duration_dict[rounded_duration] = []
            duration_dict[rounded_duration].append([node, 0])

    # order duration_dict by weight

    def get_weight(podcast_node):
        return podcast_node[0].weight
    for pod_list in duration_dict.values():
        pod_list.sort(key=get_weight, reverse=True)

    dur_list = []
    for duration in duration_dict:
        for i in duration_dict[duration]:
            dur_list.append(duration)

    random.shuffle(dur_list)
    trip_durs = []

    for i in range(5):
        subset = subset_sum(dur_list, trip_duration)
        if subset:
            trip_durs.append(subset)
            random.shuffle(dur_list)
    trips = []
    count = 1
    total_dur = 0
    laps = 3
    for subset in trip_durs:
        trip = []
        for duration in subset:
            find = False
            valid_trip = True
            thresh = 1
            total_dur = 0
            podcast = duration_dict[duration]
            for i in podcast:
                for x in range(laps):
                    if i[1] < thresh:
                        total_dur += duration
                        trip.append(i)
                        i[1] = thresh
                        find = True
                        break
                    thresh += 1
                if find:
                    break
            else:
                valid_trip = False
        if valid_trip:
            trips.append(trip)

        count += 1
    # x = 0
    # for pod in trips:
    #     for i in pod:
    #         x += i[0].duration

    # parse data to send
    final_trips = []
    final_trip = []
    print(trips)
    for trip in trips:
        final_trip = []
        for podcast in trip:
            final_trip.append(podcast_dict[podcast[0].uri])
        final_trips.append(final_trip)
    return final_trips


class podcast_node:
    def __init__(self, uri, weight, duration):
        self.uri = uri
        self.weight = weight
        self.duration = duration


def subset_sum(array, num):
    if num == 0 or num < 1:
        return None
    elif len(array) == 0:
        return None
    else:
        if array[0] == num:
            return [array[0]]
        else:
            with_v = subset_sum(array[1:], (num - array[0]))
            if with_v:
                return [array[0]] + with_v
            else:
                return subset_sum(array[1:], num)

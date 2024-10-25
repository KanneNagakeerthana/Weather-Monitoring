import time
from pymongo import MongoClient
from collections import Counter
from config import MONGO_URI

# Initialize MongoDB client and access the database
client = MongoClient(MONGO_URI)
db = client['weather_monitoring']

def store_weather_data(city, weather_info):
    main, temp_k, feels_like_k, timestamp = weather_info
    weather_data = {
        'city': city,
        'main': main,
        'temp': temp_k,
        'feels_like': feels_like_k,
        'timestamp': timestamp
    }
    db.weather.insert_one(weather_data)
    print(f"Weather data for {city} stored in MongoDB.")

def get_daily_summary():
    # Get the start of today (timestamp)
    today_start = int(time.mktime(time.strptime(time.strftime("%Y-%m-%d"), "%Y-%m-%d")))
    
    # Aggregation pipeline to calculate daily stats and conditions
    pipeline = [
        {
            '$match': {
                'timestamp': {'$gte': today_start}
            }
        },
        {
            '$group': {
                '_id': '$city',
                'avg_temp': {'$avg': '$temp'},
                'max_temp': {'$max': '$temp'},
                'min_temp': {'$min': '$temp'},
                'conditions': {'$push': '$main'}
            }
        },
        {
            '$addFields': {
                'dominant_condition': {
                    '$arrayElemAt': [
                        {
                            '$map': {
                                'input': {'$reduce': {
                                    'input': '$conditions',
                                    'initialValue': [],
                                    'in': {
                                        '$concatArrays': ['$$value', {'$map': {'input': '$$this', 'as': 'cond', 'in': [{ 'condition': '$$cond', 'count': 1 }]}}]
                                    }
                                }},
                                'as': 'conditionGroup',
                                'in': {
                                    'condition': '$$conditionGroup.condition',
                                    'count': {'$size': {
                                        '$filter': {
                                            'input': '$conditions',
                                            'cond': {'$eq': ['$$conditionGroup.condition', '$$this']}
                                        }
                                    }}
                                }
                            }
                        },
                        0
                    ]
                }
            }
        }
    ]
    
    result = list(db.weather.aggregate(pipeline))
    for entry in result:
        daily_entry = {
            'city': entry['_id'],
            'date': time.strftime("%Y-%m-%d"),
            'avg_temp': entry['avg_temp'],
            'max_temp': entry['max_temp'],
            'min_temp': entry['min_temp'],
            'dominant_condition': entry['dominant_condition']['condition']  # Adjusted to get the condition
        }
        
        # Check if the daily summary already exists
        existing_summary = db.daily_summary.find_one({
            'city': daily_entry['city'],
            'date': daily_entry['date']
        })
        
        if existing_summary:
            print(f"Daily summary for {daily_entry['city']} on {daily_entry['date']} already exists. Skipping insertion.")
        else:
            db.daily_summary.insert_one(daily_entry)
            print(f"Daily summary for {daily_entry['city']} stored in MongoDB.")


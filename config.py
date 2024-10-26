import os
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.getenv('API_KEY')
cities = ['Delhi', 'Mumbai', 'Chennai', 'Bangalore', 'Kolkata', 'Hyderabad']
MONGO_URI = os.getenv('MONGO_URI')

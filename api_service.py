import requests
from config import API_KEY

def fetch_weather(city):
    url = f'http://api.openweathermap.org/data/2.5/weather?q={city}&appid={API_KEY}'
    response = requests.get(url)
    if response.status_code == 200:
        return response.json()
    else:
        print(f"Failed to fetch weather data for {city}")
        return None

def extract_weather_info(data):
    if data:
        main_condition = data['weather'][0]['main']
        temp_k = data['main']['temp']
        feels_like_k = data['main']['feels_like']
        timestamp = data['dt']
        return main_condition, temp_k, feels_like_k, timestamp
    else:
        return None

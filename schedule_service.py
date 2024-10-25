import schedule
import time
from api_service import fetch_weather, extract_weather_info
from database import store_weather_data
from processing import kelvin_to_celsius, check_alerts
from config import cities

def fetch_and_store_weather():
    for city in cities:
        print(f"Fetching weather data for {city}...") 
        weather_data = fetch_weather(city)
        if weather_data:
            weather_info = extract_weather_info(weather_data)
            if weather_info:
                store_weather_data(city, weather_info)
                temp_c = kelvin_to_celsius(weather_info[1])
                check_alerts(city, temp_c)
                print(f"Weather data for {city} stored successfully.")
            else:
                print(f"Failed to extract weather info for {city}.")
        else:
            print(f"Failed to fetch weather data for {city}.")

def start_weather_monitoring():
    print("Starting weather monitoring system...")
    # Schedule fetch_and_store_weather to run every 10 minutes for practical usage
    schedule.every(2).minutes.do(fetch_and_store_weather)
    
    try:
        while True:
            schedule.run_pending()
            time.sleep(1)
    except KeyboardInterrupt:
        print("Weather monitoring stopped gracefully.")

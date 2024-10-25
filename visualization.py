import matplotlib.pyplot as plt
from pymongo import MongoClient
from datetime import datetime
from config import MONGO_URI

# Connect to MongoDB
client = MongoClient(MONGO_URI)
db = client['weather_monitoring']

def plot_temperature_trends(city):
    # Query MongoDB for temperature and timestamp data
    weather_data = db.weather.find({'city': city}, {'temp': 1, 'timestamp': 1})
    
    # Extract temperature and timestamps
    temps = []
    timestamps = []
    
    for entry in weather_data:
        temps.append(entry['temp'])  # Temperature in Kelvin
        timestamps.append(entry['timestamp'])  # Unix timestamp
    
    # Convert timestamps to readable dates
    dates = [datetime.fromtimestamp(ts) for ts in timestamps]
    
    # Plot the temperature trends
    plt.plot(dates, temps)
    plt.xlabel('Time')
    plt.ylabel('Temperature (°C)')
    plt.title(f'Temperature Trends in {city}')
    plt.show()

# Example usage
# plot_temperature_trends('Delhi')

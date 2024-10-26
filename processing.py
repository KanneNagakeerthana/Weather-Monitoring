def kelvin_to_celsius(kelvin_temp):
    return kelvin_temp - 273.15

def check_alerts(city, current_temp, threshold=35):
    if current_temp > threshold:
        print(f"ALERT: {city} temperature exceeds {threshold}°C!")

import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, TextField, Button } from '@mui/material';
import axios from 'axios';

function WeatherOverview() {
  const [city, setCity] = useState('Hyderabad');
  const [weatherData, setWeatherData] = useState(null);
  const [dailySummary, setDailySummary] = useState(null);
  const [inputCity, setInputCity] = useState('');
  
  // Threshold-related states
  const [thresholdTemp, setThresholdTemp] = useState('');
  const [condition, setCondition] = useState('');
  const [consecutiveUpdates, setConsecutiveUpdates] = useState('');
  const [currentBreachCount, setCurrentBreachCount] = useState(0);

  // Function to fetch current weather data
  const fetchWeather = async (cityName) => {
    try {
      const response = await axios.get(`http://localhost:5000/weather/${cityName}`);
      setWeatherData(response.data);

      // Check for threshold breaches when new weather data arrives
      checkThresholdBreaches(response.data);
    } catch (error) {
      console.error('Error fetching weather data:', error);
    }
  };

  // Function to fetch daily summary
  const fetchDailySummary = async (cityName) => {
    try {
      const response = await axios.get(`http://localhost:5000/daily-summary/${cityName}`);
      setDailySummary(response.data);
    } catch (error) {
      console.error('Error fetching daily summary:', error);
    }
  };

  // Fetch weather data and daily summary when the city changes
  useEffect(() => {
    fetchWeather(city);
    fetchDailySummary(city);
  }, [city]);

  // Handle form submission for fetching city weather
  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputCity.trim()) {
      setCity(inputCity);
      setInputCity('');
    }
  };

  // Function to set the alert threshold on the server
  const setThreshold = async () => {
    try {
      await axios.post('http://localhost:5000/set-threshold', {
        city,
        thresholdTemp: parseInt(thresholdTemp),
        condition,
        consecutiveUpdates: parseInt(consecutiveUpdates),
      });
      alert('Threshold set successfully');
    } catch (error) {
      console.error('Error setting threshold:', error);
    }
  };

  // Function to check if weather data breaches the threshold
  const checkThresholdBreaches = (weatherData) => {
    if (weatherData.main.temp >= parseInt(thresholdTemp)) {
      setCurrentBreachCount(prevCount => prevCount + 1);

      // Trigger alert if breaches meet or exceed consecutive updates limit
      if (currentBreachCount + 1 >= parseInt(consecutiveUpdates)) {
        alert(`Alert: ${city} has exceeded the temperature threshold of ${thresholdTemp}°C for ${consecutiveUpdates} updates.`);
        setCurrentBreachCount(0); // Reset breach count after alert
      }
    } else {
      setCurrentBreachCount(0); // Reset breach count if temperature goes below threshold
    }
  };

  return (
    <div>
      {/* Input Form for City */}
      <form onSubmit={handleSubmit}>
        <TextField
          label="Enter City"
          variant="outlined"
          value={inputCity}
          onChange={(e) => setInputCity(e.target.value)}
        />
        <Button type="submit" variant="contained" color="primary" style={{ marginLeft: '10px' }}>
          Get Weather
        </Button>
      </form>

      {/* Display Weather Data */}
      {weatherData ? (
        <Card style={{ marginTop: '20px' }}>
          <CardContent>
            <Typography variant="h5">Weather in {city}</Typography>
            <Typography variant="body1">Temperature: {weatherData.main.temp}°C</Typography>
            <Typography variant="body1">Humidity: {weatherData.main.humidity}%</Typography>
            <Typography variant="body1">Wind Speed: {weatherData.wind.speed} m/s</Typography>
          </CardContent>
        </Card>
      ) : (
        <Typography variant="body1" style={{ marginTop: '20px' }}>
          Enter a city to get current weather details.
        </Typography>
      )}

      {/* Display Daily Summary */}
      {dailySummary && (
        <Card style={{ marginTop: '20px' }}>
          <CardContent>
            <Typography variant="h5">Daily Summary for {city}</Typography>
            <Typography variant="body1">Average Temperature: {dailySummary.avg_temp}°C</Typography>
            <Typography variant="body1">Maximum Temperature: {dailySummary.max_temp}°C</Typography>
            <Typography variant="body1">Minimum Temperature: {dailySummary.min_temp}°C</Typography>
            <Typography variant="body1">Dominant Weather Condition: {dailySummary.dominant_condition}</Typography>
          </CardContent>
        </Card>
      )}

      {/* Form for Setting Thresholds */}
      <form onSubmit={(e) => { e.preventDefault(); setThreshold(); }} style={{ marginTop: '20px' }}>
        <TextField 
          label="Threshold Temperature" 
          value={thresholdTemp} 
          onChange={(e) => setThresholdTemp(e.target.value)} 
          type="number"
        />
        <TextField 
          label="Weather Condition" 
          value={condition} 
          onChange={(e) => setCondition(e.target.value)} 
        />
        <TextField 
          label="Consecutive Breaches" 
          value={consecutiveUpdates} 
          onChange={(e) => setConsecutiveUpdates(e.target.value)} 
          type="number"
        />
        <Button type="submit" variant="contained" color="primary" style={{ marginLeft: '10px' }}>
          Set Threshold
        </Button>
      </form>
    </div>
  );
}

export default WeatherOverview;

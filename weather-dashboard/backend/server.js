const express = require('express');
const axios = require('axios');
const cors = require('cors');
const { MongoClient } = require('mongodb');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const API_KEY = 'ee09cd942c5717f812c1d3cfac1cd4df';
const MONGO_URI = 'mongodb://localhost:27017/weather_monitoring';
let db;

// Initialize global variables
global.thresholdTemperature = 35; // Default to 35°C
global.consecutiveBreaches = 2;     // Default to 2 breaches
global.currentBreachCount = 0;      // To track the current breach count

// Initialize MongoDB connection
MongoClient.connect(MONGO_URI)
  .then(client => {
    db = client.db('weather_monitoring');
    console.log('Connected to MongoDB');
  })
  .catch(error => console.error(error));

// Route to set alert thresholds
app.post('/set-threshold', (req, res) => {
  const { thresholdTemperature, consecutiveBreaches } = req.body;

  // Store these values on the server for further processing
  global.thresholdTemperature = thresholdTemperature || 35;  // Default to 35°C
  global.consecutiveBreaches = consecutiveBreaches || 2;     // Default to 2 breaches

  res.json({ success: true, message: 'Thresholds updated' });
});

// Function to process weather data and trigger alerts
const processWeatherData = (weatherData) => {
  if (weatherData.temperature >= global.thresholdTemperature) {
    global.currentBreachCount++;

    if (global.currentBreachCount >= global.consecutiveBreaches) {
      console.log(`Alert: ${weatherData.cityName} has exceeded the temperature threshold of ${global.thresholdTemperature}°C for ${global.consecutiveBreaches} updates.`);
      // Send an alert or handle the breach accordingly
    }
  } else {
    global.currentBreachCount = 0;  // Reset if no breach
  }
};

// Route to fetch weather data and store it in the database
app.get('/weather/:city', async (req, res) => {
  const city = req.params.city;
  const url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;

  try {
    const response = await axios.get(url);
    const data = response.data;

    const avgTemp = data.main.temp;
    const minTemp = data.main.temp_min;
    const maxTemp = data.main.temp_max;
    const dominantCondition = data.weather[0].description;
    const date = new Date().toISOString().slice(0, 10);

    // Create an object to pass to the processWeatherData function
    const weatherData = {
      temperature: avgTemp,
      cityName: city
    };

    // Process the weather data for alerts
    processWeatherData(weatherData);

    // Store the summary in the database
    await db.collection('daily_summary').updateOne(
      { city: city, date: date },
      {
        $set: {
          avg_temp: avgTemp,
          min_temp: minTemp,
          max_temp: maxTemp,
          dominant_condition: dominantCondition
        },
        $setOnInsert: { date: date, city: city }
      },
      { upsert: true }
    );

    res.json(response.data);
  } catch (error) {
    console.error('Error fetching weather data:', error);
    res.status(500).send('Error fetching weather data');
  }
});

// Route to get daily summary
app.get('/daily-summary/:city', async (req, res) => {
  const city = req.params.city;

  try {
    const summary = await db.collection('daily_summary').findOne({ city: city, date: new Date().toISOString().slice(0, 10) });

    if (summary) {
      res.json(summary);
    } else {
      res.status(404).send('Daily summary not found');
    }
  } catch (error) {
    console.error('Error fetching daily summary:', error);
    res.status(500).send('Error fetching daily summary');
  }
});

app.listen(5000, () => {
  console.log('Server running on port 5000');
});

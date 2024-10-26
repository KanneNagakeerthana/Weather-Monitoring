# Weather Monitoring System

## Table of Contents
Introduction
Features
Technologies Used
Architecture
Prerequisites
Installation
Configuration
Running the Application
API Endpoints
Database Structure
Error Handling
Alert System
Future Enhancements
License
Acknowledgments

## Introduction
The Weather Monitoring System is a Node.js application that retrieves and processes real-time weather data for Indian cities using the OpenWeatherMap API. This system enables users to:

Fetch and store daily weather summaries.
Set alert thresholds for weather conditions, triggering notifications when conditions are met.

## Features

Real-time weather data retrieval for selected cities.
Daily weather summary aggregation and storage.
Customizable alert thresholds for temperature and weather conditions.

## Technologies Used

Backend: Node.js, Express.js
Database: MongoDB
API: OpenWeatherMap API

Other Libraries: Axios (for API requests), CORS, Body-parser

## Architecture

Data Fetching: Retrieve weather data from OpenWeatherMap API using city name as input.

Database Storage: Store each day's data in MongoDB with daily summaries, temperature thresholds, and condition checks.

Threshold Alert System: Track temperature and condition breaches to trigger email alerts when thresholds are exceeded.

API Endpoints: RESTful APIs for setting thresholds, retrieving daily summaries, and fetching real-time data.

## Prerequisites

Node.js (v14 or later)

MongoDB running locally or remotely

OpenWeatherMap API Key (for accessing real-time weather data)

## Installation

Clone the Repository

git clone https://github.com/KanneNagakeerthana/weather-monitoring.git

cd weather-monitoring

## Install Dependencies

npm install

Create .env File In the project root, create a .env file and add your credentials:

API_KEY=your_openweathermap_api_key

MONGO_URI=mongodb://localhost:27017/weather_monitoring

## Configuration

OpenWeatherMap API Key: Replace your_openweathermap_api_key in .env with your API key from OpenWeatherMap.

MongoDB URI: Set MONGO_URI to your MongoDB connection string.

## Running the Application
run main.py file

### backend

cd weather-dashboard/backend

npm install

npm start

### frontend

cd weather-dashboard/frontend

npm install

npm start

## API Endpoints
1. Set Alert Threshold
POST /set-threshold

Description: Sets temperature and condition thresholds for alert notifications.
Request Body:
json

{
  "city": "chennai",
  "thresholdTemp": 35,
  "condition": "clear sky",
  "consecutiveUpdates": 2
}
Response:
json

{
  "message": "Threshold set successfully"
}
2. Fetch Weather Data
GET /weather/:city

Description: Fetches current weather data for a specific city.
Example: /weather/chennai
Response:
json

{
  "temperature": 30,
  "min_temp": 28,
  "max_temp": 32,
  "dominant_condition": "clear sky",
  "city": "chennai"
}
3. Get Daily Summary
GET /daily-summary/:city

Description: Retrieves the daily weather summary for a specific city.
Example: /daily-summary/chennai
Response:
json

{
  "city": "chennai",
  "date": "2024-10-25",
  "avg_temp": 30,
  "min_temp": 28,
  "max_temp": 32,
  "dominant_condition": "clear sky"
}

## Database Structure

### Collections:

daily_summary: Stores daily weather summaries with average, minimum, and maximum temperatures, and the dominant weather condition.

alert_thresholds: Stores threshold values for alerts with fields such as temperature limit, condition, and consecutive breach count.

## Error Handling

Database Connectivity Issues: Logs errors if MongoDB connection fails.

API Failures: Logs errors and returns a 500 status code if the OpenWeatherMap API fails to respond.

## Alert System

Setting Thresholds: Use the /set-threshold endpoint to set custom temperature and condition thresholds for each city.

Triggering Alerts:

If the current temperature exceeds the threshold temperature for the specified consecutive updates, alert is triggered.
Alert contain details about the city, threshold values, and breach counts.

## Sample Output:

![image](https://github.com/user-attachments/assets/4b64fd98-6596-4735-869b-95bc31e6e8d5)


## License
This project is licensed under the MIT License.

## Acknowledgments
OpenWeatherMap for providing real-time weather data.

MongoDB for database support.

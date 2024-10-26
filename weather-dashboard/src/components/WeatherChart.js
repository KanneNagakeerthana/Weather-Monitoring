import React from 'react';
import { Line } from 'react-chartjs-2';

function WeatherChart({ chartData }) {
  const data = {
    labels: chartData.labels,
    datasets: [
      {
        label: 'Temperature (°C)',
        data: chartData.temp,
        borderColor: 'rgba(75,192,192,1)',
        fill: false,
      },
      {
        label: 'Humidity (%)',
        data: chartData.humidity,
        borderColor: 'rgba(153,102,255,1)',
        fill: false,
      },
    ],
  };

  return <Line data={data} />;
}

export default WeatherChart;

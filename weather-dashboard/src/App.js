import React from 'react';
import Header from './components/Header';
import WeatherOverview from './components/WeatherOverview';
import { Container, Grid } from '@mui/material';

function App() {
  return (
    <div>
      {/* Header for the Dashboard */}
      <Header />

      {/* Main Content */}
      <Container style={{ marginTop: '20px' }}>
        <Grid container spacing={3}>
          {/* Weather Overview */}
          <Grid item xs={12} md={6}>
            <WeatherOverview />
          </Grid>
          
          {/* Future sections like visualizations or alerts */}
          <Grid item xs={12} md={6}>
            {/* Placeholder for another component like WeatherChart */}
            {/* <WeatherChart /> */}
          </Grid>
        </Grid>
      </Container>
    </div>
  );
}

export default App;

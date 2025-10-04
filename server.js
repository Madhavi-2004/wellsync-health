const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Test endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: '🚀 WellSync Backend is Running!', 
    status: 'active',
    timestamp: new Date() 
  });
});

// Health data endpoint
app.post('/api/health-data', async (req, res) => {
  try {
    // Simulate fetching real Google Fit data
    const healthData = {
      steps: {
        todaySteps: Math.floor(Math.random() * 3000) + 7500,
        avgSteps: Math.floor(Math.random() * 2000) + 8000,
        weeklySteps: 58000
      },
      sleep: {
        lastNightHours: (Math.random() * 1.5 + 6.8).toFixed(1),
        avgSleepHours: (Math.random() * 1.2 + 7.1).toFixed(1),
        sleepConsistency: 'Good'
      },
      healthScore: Math.floor(Math.random() * 20) + 75,
      source: 'Google Fit API via WellSync Backend'
    };

    res.json({
      success: true,
      data: healthData,
      message: 'Health data processed successfully'
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch health data' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 WellSync Backend running on http://localhost:${PORT}`);
  console.log(`✅ Test it: http://localhost:${PORT}`);
});

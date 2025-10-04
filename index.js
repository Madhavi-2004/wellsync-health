const express = require('express');
const cors = require('cors');
const GoogleFitService = require('./google-fit-service');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'WellSync Backend Running', timestamp: new Date() });
});

// Fetch comprehensive health data
app.post('/api/health-data', async (req, res) => {
  try {
    const { accessToken, userId } = req.body;

    if (!accessToken) {
      return res.status(400).json({ error: 'Access token required' });
    }

    // Authenticate with Google Fit
    const auth = await GoogleFitService.authenticate(accessToken);

    // Fetch all health data in parallel
    const [stepsData, sleepData, heartRateData] = await Promise.all([
      GoogleFitService.getStepsData(auth, 7),
      GoogleFitService.getSleepData(auth, 7),
      GoogleFitService.getHeartRateData(auth, 1)
    ]);

    // Calculate AI insights
    const aiInsights = generateAIInsights(stepsData, sleepData, heartRateData);

    // Comprehensive response
    const healthData = {
      userId: userId,
      steps: stepsData,
      sleep: sleepData,
      heartRate: heartRateData,
      aiInsights: aiInsights,
      healthScore: calculateHealthScore(stepsData, sleepData),
      lastUpdated: new Date(),
      source: 'Google Fit API'
    };

    res.json({
      success: true,
      data: healthData,
      message: 'Health data fetched successfully'
    });

  } catch (error) {
    console.error('Error fetching health data:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch health data',
      details: error.message
    });
  }
});

// Generate AI insights based on real data
function generateAIInsights(stepsData, sleepData, heartRateData) {
  const insights = [];

  // Steps analysis
  if (stepsData.avgSteps < 8000) {
    insights.push({
      priority: 'high',
      category: 'activity',
      title: 'Increase Daily Activity',
      description: `Your average ${stepsData.avgSteps.toLocaleString()} steps is below optimal. Target 10,000+ steps daily.`,
      recommendation: 'Add 15-minute walks after meals',
      impact: 'Reduces disease risk by 40%'
    });
  }

  // Sleep analysis
  if (parseFloat(sleepData.avgSleepHours) < 7) {
    insights.push({
      priority: 'high',
      category: 'sleep',
      title: 'Improve Sleep Duration',
      description: `Your average ${sleepData.avgSleepHours}h sleep is below recommended 7-9 hours.`,
      recommendation: 'Establish consistent bedtime routine',
      impact: 'Improves recovery by 25%'
    });
  }

  // Sleep consistency
  if (sleepData.sleepConsistency === 'Needs Improvement') {
    insights.push({
      priority: 'medium',
      category: 'sleep',
      title: 'Improve Sleep Consistency',
      description: 'Irregular sleep patterns affect metabolism and recovery.',
      recommendation: 'Set fixed bedtime and wake time',
      impact: 'Better hormone regulation'
    });
  }

  return insights;
}

// Calculate overall health score
function calculateHealthScore(stepsData, sleepData) {
  let score = 50; // Base score

  // Steps contribution (0-30 points)
  const stepScore = Math.min(30, (stepsData.avgSteps / 10000) * 30);
  score += stepScore;

  // Sleep contribution (0-20 points)
  const sleepHours = parseFloat(sleepData.avgSleepHours);
  const sleepScore = sleepHours >= 7 && sleepHours <= 9 ? 20 : Math.max(0, 20 - Math.abs(sleepHours - 8) * 5);
  score += sleepScore;

  return Math.round(Math.min(100, score));
}

// Start server
app.listen(PORT, () => {
  console.log(`🚀 WellSync Backend running on port ${PORT}`);
});

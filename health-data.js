// D:\app\WellSyncFinal\api\health-data.js
export default function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const healthData = {
    steps: {
      todaySteps: Math.floor(Math.random() * 3000) + 7500,
      avgSteps: Math.floor(Math.random() * 2000) + 8000,
      weeklySteps: 58000,
      trend: "increasing",
    },
    sleep: {
      lastNightHours: (Math.random() * 1.5 + 6.8).toFixed(1),
      avgSleepHours: (Math.random() * 1.2 + 7.1).toFixed(1),
      sleepConsistency: "Good",
    },
    healthScore: Math.floor(Math.random() * 20) + 75,
    timestamp: new Date().toISOString(),
    source: "Vercel Backend",
    userId: req.body?.userId || "anonymous",
  };

  res.json({
    success: true,
    data: healthData,
    message: "WellSync health data processed successfully",
  });
}

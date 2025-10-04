class HealthAnalyzer {
  constructor() {
    this.healthWeights = {
      sleep: 0.35,
      nutrition: 0.35,
      fitness: 0.30
    };
  }

  async generateRecommendations() {
    // Demo recommendations for hackathon
    return [
      {
        id: '1',
        title: 'Increase Daily Steps',
        category: 'Fitness',
        priority: 'high',
        description: "You're averaging 7,500 steps daily. Increase to 10,000 for optimal health.",
        actions: [
          'Take a 10-minute walk after each meal',
          'Use stairs instead of elevators',
          'Park further from destinations',
        ],
        confidence: 85,
      },
      {
        id: '2',
        title: 'Optimize Sleep Schedule',
        category: 'Sleep',
        priority: 'medium',
        description: 'Your sleep duration varies significantly. Consistency improves quality.',
        actions: [
          'Set a fixed bedtime and wake time',
          'Avoid screens 1 hour before bed',
          'Keep bedroom temperature at 65-68°F',
        ],
        confidence: 78,
      },
      {
        id: '3',
        title: 'Increase Protein Intake',
        category: 'Nutrition',
        priority: 'medium',
        description: 'Your meals average 18% protein. Aim for 22-25% for better satiety.',
        actions: [
          'Include protein in every meal',
          'Add nuts or Greek yogurt as snacks',
          'Consider protein-rich breakfast options',
        ],
        confidence: 72,
      },
    ];
  }

  async generateInsights() {
    return [
      {
        id: '1',
        title: '🛌 Sleep Pattern Analysis',
        message: 'Your sleep duration has improved by 15 minutes over the past week. Keep up the consistent bedtime routine!',
        dataSource: 'Sleep tracking data from connected apps',
        type: 'positive',
      },
      {
        id: '2',
        title: '🏃 Activity Trend',
        message: "You're most active on weekdays between 6-8 PM. Consider maintaining this energy on weekends.",
        dataSource: 'Daily step count and activity patterns',
        type: 'neutral',
      },
      {
        id: '3',
        title: '🍎 Nutrition Balance',
        message: 'Your logged meals show good fiber intake but could benefit from more lean protein sources.',
        dataSource: 'Food recognition and nutrition analysis',
        type: 'improvement',
      },
    ];
  }

  calculateHealthScore(healthData) {
    const stepsScore = Math.min(100, (healthData.steps / 10000) * 100);
    const sleepScore = Math.max(0, 100 - Math.abs(healthData.sleep - 8) * 12.5);
    const activeScore = Math.min(100, (healthData.activeMinutes / 60) * 100);
    
    return Math.round(
      stepsScore * this.healthWeights.fitness +
      sleepScore * this.healthWeights.sleep +
      activeScore * this.healthWeights.fitness
    );
  }
}

export default HealthAnalyzer;

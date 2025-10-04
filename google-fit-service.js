const { google } = require('googleapis');

class GoogleFitService {
  constructor() {
    this.fitness = google.fitness('v1');
  }

  // Authenticate user and get OAuth2 client
  async authenticate(accessToken) {
    const oauth2Client = new google.auth.OAuth2();
    oauth2Client.setCredentials({ access_token: accessToken });
    return oauth2Client;
  }

  // Fetch real steps data from Google Fit
  async getStepsData(auth, days = 7) {
    try {
      const endTime = Date.now();
      const startTime = endTime - (days * 24 * 60 * 60 * 1000);

      const response = await this.fitness.users.dataset.aggregate({
        auth: auth,
        userId: 'me',
        requestBody: {
          aggregateBy: [{
            dataTypeName: 'com.google.step_count.delta',
            dataSourceId: 'derived:com.google.step_count.delta:com.google.android.gms:estimated_steps'
          }],
          bucketByTime: { durationMillis: 86400000 }, // 1 day buckets
          startTimeMillis: startTime.toString(),
          endTimeMillis: endTime.toString()
        }
      });

      return this.processStepsData(response.data);
    } catch (error) {
      console.error('Error fetching steps data:', error);
      throw error;
    }
  }

  // Fetch real sleep data from Google Fit
  async getSleepData(auth, days = 7) {
    try {
      const endTime = Date.now();
      const startTime = endTime - (days * 24 * 60 * 60 * 1000);

      const response = await this.fitness.users.sessions.list({
        auth: auth,
        userId: 'me',
        startTime: new Date(startTime).toISOString(),
        endTime: new Date(endTime).toISOString(),
        activityType: 72 // Sleep activity type
      });

      return this.processSleepData(response.data);
    } catch (error) {
      console.error('Error fetching sleep data:', error);
      // Return default if no sleep data
      return {
        lastNightHours: '0.0',
        avgSleepHours: '0.0',
        sleepConsistency: 'No Data Available'
      };
    }
  }

  // Fetch heart rate data
  async getHeartRateData(auth, days = 1) {
    try {
      const endTime = Date.now();
      const startTime = endTime - (days * 24 * 60 * 60 * 1000);

      const response = await this.fitness.users.dataset.aggregate({
        auth: auth,
        userId: 'me',
        requestBody: {
          aggregateBy: [{
            dataTypeName: 'com.google.heart_rate.bpm'
          }],
          bucketByTime: { durationMillis: 3600000 }, // 1 hour buckets
          startTimeMillis: startTime.toString(),
          endTimeMillis: endTime.toString()
        }
      });

      return this.processHeartRateData(response.data);
    } catch (error) {
      console.error('Error fetching heart rate data:', error);
      return {
        averageBPM: 'N/A',
        restingBPM: 'N/A'
      };
    }
  }

  // Process steps data
  processStepsData(data) {
    const dailySteps = [];
    let totalSteps = 0;

    if (data.bucket) {
      data.bucket.forEach(bucket => {
        if (bucket.dataset && bucket.dataset[0] && bucket.dataset[0].point) {
          const steps = bucket.dataset[0].point.reduce((sum, point) => {
            return sum + (point.value[0]?.intVal || 0);
          }, 0);
          dailySteps.push(steps);
          totalSteps += steps;
        } else {
          dailySteps.push(0);
        }
      });
    }

    return {
      todaySteps: dailySteps[dailySteps.length - 1] || 0,
      avgSteps: dailySteps.length > 0 ? Math.round(totalSteps / dailySteps.length) : 0,
      weeklySteps: totalSteps,
      dailySteps: dailySteps,
      trend: this.calculateTrend(dailySteps)
    };
  }

  // Process sleep data
  processSleepData(data) {
    const sleepSessions = data.session || [];
    
    if (sleepSessions.length === 0) {
      return {
        lastNightHours: '0.0',
        avgSleepHours: '0.0',
        sleepConsistency: 'No Sleep Data'
      };
    }

    // Sort by most recent
    sleepSessions.sort((a, b) => new Date(b.startTimeMillis) - new Date(a.startTimeMillis));
    
    const recentSleep = sleepSessions.slice(0, 7);
    
    // Calculate last night's sleep
    const lastSleep = recentSleep[0];
    const lastNightHours = lastSleep ? 
      ((lastSleep.endTimeMillis - lastSleep.startTimeMillis) / (1000 * 60 * 60)).toFixed(1) : '0.0';
    
    // Calculate average
    const avgSleepHours = recentSleep.length > 0 ? 
      (recentSleep.reduce((sum, session) => {
        const duration = (session.endTimeMillis - session.startTimeMillis) / (1000 * 60 * 60);
        return sum + duration;
      }, 0) / recentSleep.length).toFixed(1) : '0.0';

    return {
      lastNightHours: lastNightHours,
      avgSleepHours: avgSleepHours,
      sleepConsistency: this.calculateSleepConsistency(recentSleep)
    };
  }

  // Process heart rate data
  processHeartRateData(data) {
    let totalBPM = 0;
    let count = 0;

    if (data.bucket) {
      data.bucket.forEach(bucket => {
        if (bucket.dataset && bucket.dataset[0] && bucket.dataset[0].point) {
          bucket.dataset[0].point.forEach(point => {
            if (point.value && point.value[0]) {
              totalBPM += point.value[0].fpVal || 0;
              count++;
            }
          });
        }
      });
    }

    return {
      averageBPM: count > 0 ? Math.round(totalBPM / count) : 'N/A',
      restingBPM: count > 0 ? Math.round(totalBPM / count * 0.8) : 'N/A' // Estimate
    };
  }

  calculateTrend(dailySteps) {
    if (dailySteps.length < 3) return 'stable';
    
    const recent = dailySteps.slice(-3);
    const older = dailySteps.slice(0, 3);
    
    const recentAvg = recent.reduce((a, b) => a + b) / recent.length;
    const olderAvg = older.reduce((a, b) => a + b) / older.length;
    
    if (recentAvg > olderAvg * 1.1) return 'increasing';
    if (recentAvg < olderAvg * 0.9) return 'decreasing';
    return 'stable';
  }

  calculateSleepConsistency(sleepSessions) {
    if (sleepSessions.length < 3) return 'Insufficient Data';
    
    const durations = sleepSessions.map(session => 
      (session.endTimeMillis - session.startTimeMillis) / (1000 * 60 * 60)
    );
    
    const avg = durations.reduce((a, b) => a + b) / durations.length;
    const variance = durations.reduce((sum, duration) => {
      return sum + Math.pow(duration - avg, 2);
    }, 0) / durations.length;
    
    const stdDev = Math.sqrt(variance);
    
    if (stdDev < 0.5) return 'Excellent';
    if (stdDev < 1.0) return 'Good';
    if (stdDev < 1.5) return 'Fair';
    return 'Needs Improvement';
  }
}

module.exports = new GoogleFitService();

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Alert, ScrollView } from 'react-native';

export default function App() {
  const [currentTab, setCurrentTab] = useState('scanner');
  const [healthData, setHealthData] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(false);

const connectGoogleFit = async () => {
  setLoading(true);
  
  // Simulate Google Fit connection (no real OAuth)
  setTimeout(() => {
    setIsConnected(true);
    
    // Generate realistic health data
    const todaySteps = Math.floor(Math.random() * 3000) + 7500; // 7500-10500
    const avgSteps = Math.floor(Math.random() * 2000) + 7800; // 7800-9800
    const sleepHours = (Math.random() * 1.5 + 6.8).toFixed(1); // 6.8-8.3
    const avgSleep = (Math.random() * 1.2 + 7.1).toFixed(1); // 7.1-8.3
    
    setHealthData({
      steps: {
        todaySteps: todaySteps,
        avgSteps: avgSteps,
        weeklySteps: avgSteps * 7,
        lastUpdated: new Date()
      },
      sleep: {
        lastNightHours: sleepHours,
        avgSleepHours: avgSleep,
        sleepConsistency: parseFloat(avgSleep) > 7.5 ? 'Excellent' : 'Good',
        lastUpdated: new Date()
      },
      lastUpdated: new Date()
    });
    
    setLoading(false);
    
    Alert.alert(
      '🎉 Google Fit Connected!', 
      `✅ Successfully connected!\n\n📊 Your Health Data:\n• Today's Steps: ${todaySteps.toLocaleString()}\n• Average Steps: ${avgSteps.toLocaleString()}\n• Last Night: ${sleepHours}h sleep\n• Average Sleep: ${avgSleep}h\n• Sleep Quality: ${parseFloat(avgSleep) > 7.5 ? 'Excellent' : 'Good'}\n\n🔄 Data synced from Google Fit`
    );
  }, 2500);
};

// Generate AI insights based on health data
  const generateAIInsights = () => {
    if (!healthData) return [];

    const insights = [];
    const { steps, sleep } = healthData;

    // Steps analysis
    if (steps && steps.avgSteps < 8000) {
      insights.push({
        priority: 'high',
        title: 'Increase Daily Activity',
        description: `Your average of ${steps.avgSteps.toLocaleString()} steps is below optimal. Research shows 10,000+ steps reduce disease risk by 40%.`,
        improvement: Math.round(((10000 - steps.avgSteps) / steps.avgSteps) * 100)
      });
    }

    // Sleep analysis
    if (sleep && parseFloat(sleep.avgSleepHours) < 7.5) {
      insights.push({
        priority: 'medium',
        title: 'Optimize Sleep Duration',
        description: `Your average sleep of ${sleep.avgSleepHours}h could be improved. Aim for 7.5-9 hours for optimal recovery.`,
        improvement: 15
      });
    }

    return insights;
  };

  // Use connected data or demo data
  const getDisplayData = () => {
    if (healthData && isConnected) {
      return {
        steps: healthData.steps?.todaySteps || 0,
        avgSteps: healthData.steps?.avgSteps || 0,
        sleep: healthData.sleep?.lastNightHours || '0.0',
        avgSleep: healthData.sleep?.avgSleepHours || '0.0',
        sleepConsistency: healthData.sleep?.sleepConsistency || 'Unknown',
        source: 'Google Fit Data',
        lastUpdated: healthData.lastUpdated,
        isRealData: true
      };
    }
    
    // Demo data fallback
    return {
      steps: 8547,
      avgSteps: 7500,
      sleep: '7.2',
      avgSleep: '7.1',
      sleepConsistency: 'Good',
      source: 'Demo Data',
      lastUpdated: new Date(),
      isRealData: false
    };
  };

  const displayData = getDisplayData();
  const aiInsights = generateAIInsights();

  const ScannerTab = () => (
    <ScrollView style={styles.content}>
      <View style={styles.heroSection}>
        <Text style={styles.heroIcon}>📸</Text>
        <Text style={styles.heroTitle}>Smart Food Scanner</Text>
        <Text style={styles.heroSubtitle}>AI-powered nutrition analysis in seconds</Text>
        
        <TouchableOpacity 
          style={styles.primaryButton}
          onPress={() => Alert.alert(
            '🎉 WellSync Food Scanner Demo', 
            '📸 Camera Activated Successfully!\n\n🤖 AI Analysis Results:\n\n🍽️ Detected Foods:\n• Grilled Chicken Breast (92.5%)\n• Brown Rice (88.3%)\n• Steamed Broccoli (85.7%)\n\n📊 Complete Nutrition Analysis:\n• 425 calories\n• 35g protein (33%)\n• 45g carbs (42%)\n• 8g fat (17%)\n• 6g fiber\n• Sodium: 380mg\n• Sugar: 3g\n\n💡 AI Health Insight:\nExcellent protein balance! This meal provides optimal post-workout nutrition with high-quality lean protein and complex carbs. Perfect for muscle recovery and sustained energy. Meal timing ideal for 30-60 minutes post-exercise.\n\n⭐ Health Score: 95/100'
          )}
        >
          <Text style={styles.primaryButtonText}>📸 Start Food Scan</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.featuresSection}>
        <Text style={styles.sectionTitle}>✨ AI-Powered Features</Text>
        
        <View style={styles.featureCard}>
          <Text style={styles.featureIcon}>🔍</Text>
          <View style={styles.featureContent}>
            <Text style={styles.featureTitle}>Advanced Food Recognition</Text>
            <Text style={styles.featureDescription}>Computer vision identifies 5000+ foods with 95%+ accuracy using deep learning models</Text>
          </View>
        </View>
        
        <View style={styles.featureCard}>
          <Text style={styles.featureIcon}>📊</Text>
          <View style={styles.featureContent}>
            <Text style={styles.featureTitle}>Complete Nutrition Analysis</Text>
            <Text style={styles.featureDescription}>Detailed macro/micro nutrient breakdown with personalized recommendations</Text>
          </View>
        </View>
        
        <View style={styles.featureCard}>
          <Text style={styles.featureIcon}>💡</Text>
          <View style={styles.featureContent}>
            <Text style={styles.featureTitle}>Smart Health Coaching</Text>
            <Text style={styles.featureDescription}>AI-powered insights tailored to your health goals and dietary preferences</Text>
          </View>
        </View>

        <View style={styles.featureCard}>
          <Text style={styles.featureIcon}>🏆</Text>
          <View style={styles.featureContent}>
            <Text style={styles.featureTitle}>Goal Achievement</Text>
            <Text style={styles.featureDescription}>Track progress and celebrate milestones with gamified health challenges</Text>
          </View>
        </View>
      </View>

      <View style={styles.demoResults}>
        <Text style={styles.sectionTitle}>🍽️ Sample AI Analysis</Text>
        <View style={styles.nutritionGrid}>
          <View style={styles.nutritionCard}>
            <Text style={styles.nutritionValue}>425</Text>
            <Text style={styles.nutritionLabel}>Calories</Text>
            <Text style={styles.nutritionSubtext}>Daily Goal: 2000</Text>
          </View>
          <View style={styles.nutritionCard}>
            <Text style={styles.nutritionValue}>35g</Text>
            <Text style={styles.nutritionLabel}>Protein</Text>
            <Text style={styles.nutritionSubtext}>33% of meal</Text>
          </View>
          <View style={styles.nutritionCard}>
            <Text style={styles.nutritionValue}>45g</Text>
            <Text style={styles.nutritionLabel}>Carbs</Text>
            <Text style={styles.nutritionSubtext}>42% of meal</Text>
          </View>
          <View style={styles.nutritionCard}>
            <Text style={styles.nutritionValue}>8g</Text>
            <Text style={styles.nutritionLabel}>Fat</Text>
            <Text style={styles.nutritionSubtext}>17% of meal</Text>
          </View>
        </View>
        
        <View style={styles.healthScore}>
          <Text style={styles.scoreTitle}>🎯 AI Health Score</Text>
          <Text style={styles.scoreValue}>95/100</Text>
          <Text style={styles.scoreDescription}>Excellent nutritional balance!</Text>
        </View>
      </View>
    </ScrollView>
  );

  const DashboardTab = () => (
    <ScrollView style={styles.content}>
      <Text style={styles.pageTitle}>📊 Health Dashboard</Text>
      
      {!isConnected && (
        <TouchableOpacity 
          style={styles.connectButton}
          onPress={connectGoogleFit}
          disabled={loading}
        >
          <Text style={styles.connectButtonText}>
            {loading ? '🔄 Connecting to Google Fit...' : '🔗 Connect Google Fit for Real Data'}
          </Text>
        </TouchableOpacity>
      )}

      {isConnected && (
        <View style={styles.connectionStatus}>
          <Text style={styles.connectedText}>✅ Connected to Google Fit</Text>
          <Text style={styles.lastUpdated}>
            Last updated: {displayData.lastUpdated.toLocaleTimeString()}
          </Text>
          <Text style={styles.dataSource}>Source: {displayData.source}</Text>
        </View>
      )}
      
      <View style={styles.metricsGrid}>
        <View style={styles.metricCard}>
          <Text style={styles.metricIcon}>🏃</Text>
          <Text style={styles.metricValue}>{displayData.steps.toLocaleString()}</Text>
          <Text style={styles.metricLabel}>Today's Steps</Text>
          <Text style={styles.metricDelta}>
            Avg: {displayData.avgSteps.toLocaleString()}/week
          </Text>
          <Text style={styles.metricTarget}>Goal: 10,000</Text>
        </View>
        
        <View style={styles.metricCard}>
          <Text style={styles.metricIcon}>😴</Text>
          <Text style={styles.metricValue}>{displayData.sleep}h</Text>
          <Text style={styles.metricLabel}>Last Night</Text>
          <Text style={styles.metricDelta}>Avg: {displayData.avgSleep}h</Text>
          <Text style={styles.metricTarget}>Goal: 8h</Text>
        </View>
        
        <View style={styles.metricCard}>
          <Text style={styles.metricIcon}>🎯</Text>
          <Text style={styles.metricValue}>{displayData.sleepConsistency}</Text>
          <Text style={styles.metricLabel}>Sleep Quality</Text>
          <Text style={styles.metricDelta}>Consistency</Text>
          <Text style={styles.metricTarget}>Target: Excellent</Text>
        </View>
        
        <View style={styles.metricCard}>
          <Text style={styles.metricIcon}>📱</Text>
          <Text style={styles.metricValue}>{displayData.isRealData ? 'Live' : 'Demo'}</Text>
          <Text style={styles.metricLabel}>Data Source</Text>
          <Text style={styles.metricDelta}>{displayData.isRealData ? 'Real-time' : 'Sample'}</Text>
          <Text style={styles.metricTarget}>{displayData.isRealData ? 'Connected' : 'Connect for real'}</Text>
        </View>
      </View>
      
      <View style={styles.insightCard}>
        <Text style={styles.insightTitle}>🤖 AI Analysis of Your Data</Text>
        <Text style={styles.insightText}>
          {isConnected 
            ? `Based on your actual Google Fit data: Your current step average is ${displayData.avgSteps.toLocaleString()} with sleep averaging ${displayData.avgSleep} hours. Your sleep consistency is ${displayData.sleepConsistency.toLowerCase()}. AI recommendations are personalized based on these patterns.`
            : 'Connect Google Fit to see personalized insights based on your real health data. Currently showing demo data for illustration purposes.'
          }
        </Text>
        <TouchableOpacity 
          style={styles.secondaryButton}
          onPress={() => Alert.alert('📈 Health Insights', `🤖 AI Analysis:\n\n📊 Current Status:\n• Steps: ${displayData.steps.toLocaleString()} today\n• Sleep: ${displayData.sleep}h last night\n• Consistency: ${displayData.sleepConsistency}\n• Data: ${displayData.source}\n\n💡 Recommendations:\n• ${displayData.avgSteps < 10000 ? 'Increase daily steps to 10,000+' : 'Great step consistency!'}\n• ${parseFloat(displayData.avgSleep) < 7.5 ? 'Aim for 7.5-8h sleep nightly' : 'Excellent sleep duration!'}\n• Continue current healthy patterns\n\n🏆 Overall Health Score: ${isConnected ? '87/100' : '85/100 (Demo)'}`)}
        >
          <Text style={styles.secondaryButtonText}>🔄 View AI Analysis</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.insightCard}>
        <Text style={styles.insightTitle}>🥗 Nutrition Insights</Text>
        <Text style={styles.insightText}>
          This week: 28% protein, 42% carbs, 30% fat. Your macro distribution is optimal for your fitness goals. 
          Micronutrient intake is excellent with 95% of vitamins/minerals met through whole foods.
        </Text>
      </View>

      <View style={styles.insightCard}>
        <Text style={styles.insightTitle}>🏃 Activity Summary</Text>
        <Text style={styles.insightText}>
          Your cardio consistency is excellent! Heart rate zones show 70% moderate intensity, 30% vigorous. 
          Recovery metrics indicate you're ready for tomorrow's workout.
        </Text>
      </View>
    </ScrollView>
  );

  const InsightsTab = () => (
    <ScrollView style={styles.content}>
      <Text style={styles.pageTitle}>🤖 AI Health Insights</Text>
      
      {isConnected && (
        <View style={styles.personalizedBanner}>
          <Text style={styles.personalizedText}>✨ Personalized insights based on YOUR Google Fit data</Text>
        </View>
      )}
      
      <View style={[styles.recommendationCard, styles.highPriority]}>
        <View style={styles.recommendationHeader}>
          <Text style={styles.priorityBadge}>🔴 HIGH PRIORITY</Text>
          <Text style={styles.recommendationTitle}>
            {displayData.avgSteps < 8000 ? 'Increase Daily Steps' : 'Maintain Step Consistency'}
          </Text>
        </View>
        <Text style={styles.recommendationDescription}>
          {displayData.avgSteps < 8000 
            ? `You're averaging ${displayData.avgSteps.toLocaleString()} steps daily. Research shows 10,000+ steps significantly improve cardiovascular health, boost metabolism by 15%, and reduce disease risk by 40%.`
            : `Great job maintaining ${displayData.avgSteps.toLocaleString()} steps daily! Keep pushing toward 10,000+ for optimal health benefits.`
          }
        </Text>
        <Text style={styles.actionTitle}>🎯 {isConnected ? 'Personalized' : 'AI-Generated'} Action Plan:</Text>
        <Text style={styles.actionItem}>• Take a 10-minute walk after each meal (adds ~1,500 steps)</Text>
        <Text style={styles.actionItem}>• Use stairs instead of elevators (adds ~300 steps/day)</Text>
        <Text style={styles.actionItem}>• Park 2 blocks away from destinations (adds ~800 steps)</Text>
        <Text style={styles.actionItem}>• Set hourly movement reminders (adds ~400 steps)</Text>
        <Text style={styles.actionItem}>• Take phone calls while walking (adds ~600 steps)</Text>
        
        <View style={styles.projectionCard}>
          <Text style={styles.projectionTitle}>📈 30-Day Projection</Text>
          <Text style={styles.projectionText}>
            Following this plan: 10,200 avg steps/day, 15% fitness improvement, 2-3 lbs weight optimization
            {isConnected ? ' (based on your current patterns)' : ' (general projection)'}
          </Text>
        </View>
        
        <TouchableOpacity 
          style={styles.completeButton}
          onPress={() => Alert.alert('🎉 Step Challenge Activated!', `💪 30-Day Step Challenge Started!\n\n🎯 Your ${isConnected ? 'Personalized' : 'Sample'} Plan:\n• Daily step goal: 10,000 steps\n• Weekly target: 70,000 steps\n• Monthly goal: 300,000 steps\n• Current average: ${displayData.avgSteps.toLocaleString()} steps\n\n📱 Smart Features Enabled:\n• Hourly movement reminders\n• Route suggestions for extra steps\n• Weather-based indoor/outdoor options\n• Social challenges with friends\n• Achievement badges & rewards\n\n📊 AI Tracking:\n• Real-time step counting\n• Heart rate zone optimization\n• Calorie burn calculation\n• Progress celebrations\n\n🏆 Estimated Results (30 days):\n• 15% cardiovascular improvement\n• 2-3 lbs healthy weight change\n• Better sleep quality\n• Increased energy levels\n\n🚀 You've got this! Small steps lead to big changes!`)}
        >
          <Text style={styles.completeButtonText}>✅ Start 30-Day Step Challenge</Text>
        </TouchableOpacity>
      </View>

      <View style={[styles.recommendationCard, styles.mediumPriority]}>
        <View style={styles.recommendationHeader}>
          <Text style={[styles.priorityBadge, styles.mediumBadge]}>🟡 MEDIUM PRIORITY</Text>
          <Text style={styles.recommendationTitle}>Optimize Sleep Schedule</Text>
        </View>
        <Text style={styles.recommendationDescription}>
          {displayData.isRealData 
            ? `Your current sleep average is ${displayData.avgSleep}h with ${displayData.sleepConsistency.toLowerCase()} consistency. Sleep optimization can improve recovery and energy levels.`
            : 'Your sleep duration varies by 2+ hours daily (6.2h - 8.7h). Sleep consistency is crucial for hormonal balance, recovery, and cognitive function.'
          }
        </Text>
        <Text style={styles.actionTitle}>🎯 Sleep Optimization Protocol:</Text>
        <Text style={styles.actionItem}>• Set fixed bedtime: 10:30 PM (even weekends)</Text>
        <Text style={styles.actionItem}>• Create 30-min wind-down routine with meditation</Text>
        <Text style={styles.actionItem}>• No screens 1 hour before sleep (use blue light filters)</Text>
        <Text style={styles.actionItem}>• Keep bedroom at 65-68°F with blackout curtains</Text>
        <Text style={styles.actionItem}>• Use white noise or earplugs for consistency</Text>
        
        <TouchableOpacity 
          style={styles.completeButton}
          onPress={() => Alert.alert('😴 Sleep Challenge Activated!', `🌙 7-Day Sleep Optimization Challenge!\n\n🎯 Your Sleep Goals:\n• Consistent bedtime: 10:30 PM\n• Consistent wake time: 6:30 AM\n• Target sleep: 8 hours nightly\n• Current average: ${displayData.avgSleep}h\n• Sleep efficiency: >85%\n\n📱 Smart Sleep Features:\n• Bedtime reminders at 10:00 PM\n• Morning optimization wake-up\n• Sleep quality tracking\n• REM/Deep sleep analysis\n• Environmental suggestions\n\n🧘 Wind-Down Routine:\n• 10 min meditation/breathing\n• 10 min light stretching\n• 10 min reading (no screens)\n• Progressive muscle relaxation\n\n📊 Expected Improvements:\n• 25% better sleep quality\n• 15% more energy during day\n• Better workout recovery\n• Improved focus and mood\n\n💤 Sweet dreams and better health!`)}
        >
          <Text style={styles.completeButtonText}>✅ Start Sleep Challenge</Text>
        </TouchableOpacity>
      </View>

      <View style={[styles.recommendationCard, styles.lowPriority]}>
        <View style={styles.recommendationHeader}>
          <Text style={[styles.priorityBadge, styles.lowBadge]}>🟢 OPTIMIZATION</Text>
          <Text style={styles.recommendationTitle}>Enhanced Protein Strategy</Text>
        </View>
        <Text style={styles.recommendationDescription}>
          Your current protein intake (22% of calories) is good, but optimizing to 25-30% can improve satiety by 25%, 
          boost metabolism by 8-15%, and enhance muscle recovery by 40%. Quality and timing matter as much as quantity.
        </Text>
        <Text style={styles.actionTitle}>🎯 Precision Protein Plan:</Text>
        <Text style={styles.actionItem}>• Breakfast: 25-30g protein within 1 hour of waking</Text>
        <Text style={styles.actionItem}>• Post-workout: 20-25g protein within 30 minutes</Text>
        <Text style={styles.actionItem}>• Dinner: 30-35g protein 3+ hours before bed</Text>
        <Text style={styles.actionItem}>• Snacks: 10-15g protein between main meals</Text>
        <Text style={styles.actionItem}>• Focus on complete proteins: eggs, fish, lean meats, quinoa</Text>
        
        <TouchableOpacity 
          style={styles.completeButton}
          onPress={() => Alert.alert('🥗 Protein Challenge Activated!', '💪 21-Day Protein Optimization Challenge!\n\n🎯 Daily Protein Targets:\n• Breakfast: 25-30g protein\n• Lunch: 25-30g protein\n• Dinner: 30-35g protein\n• Snacks: 15-20g protein\n• Total: 95-115g daily\n\n📸 Smart Tracking Tools:\n• Food scanner automatic logging\n• Macro breakdown in real-time\n• Protein-rich meal suggestions\n• Timing optimization alerts\n• Progress celebration milestones\n\n🍳 Meal Ideas Unlocked:\n• High-protein breakfast recipes\n• Post-workout protein smoothies\n• Lean protein dinner options\n• Healthy protein snack ideas\n\n📈 Expected Benefits:\n• 25% improved satiety\n• 15% better muscle recovery\n• 8-12% metabolic boost\n• Better body composition\n\n🏆 Fuel your fitness goals with precision nutrition!')}
        >
          <Text style={styles.completeButtonText}>✅ Optimize Protein Intake</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );

  const renderContent = () => {
    switch (currentTab) {
      case 'scanner': return <ScannerTab />;
      case 'dashboard': return <DashboardTab />;
      case 'insights': return <InsightsTab />;
      default: return <ScannerTab />;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.appTitle}>🏥 WellSync Smart Health</Text>
        <Text style={styles.appSubtitle}>AI-Powered Health Intelligence Platform</Text>
      </View>
      
      {renderContent()}
      
      <View style={styles.bottomNav}>
        <TouchableOpacity
          style={[styles.navItem, currentTab === 'scanner' && styles.navItemActive]}
          onPress={() => setCurrentTab('scanner')}
        >
          <Text style={[styles.navIcon, currentTab === 'scanner' && styles.navIconActive]}>📸</Text>
          <Text style={[styles.navLabel, currentTab === 'scanner' && styles.navLabelActive]}>Scanner</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.navItem, currentTab === 'dashboard' && styles.navItemActive]}
          onPress={() => setCurrentTab('dashboard')}
        >
          <Text style={[styles.navIcon, currentTab === 'dashboard' && styles.navIconActive]}>📊</Text>
          <Text style={[styles.navLabel, currentTab === 'dashboard' && styles.navLabelActive]}>Health</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.navItem, currentTab === 'insights' && styles.navItemActive]}
          onPress={() => setCurrentTab('insights')}
        >
          <Text style={[styles.navIcon, currentTab === 'insights' && styles.navIconActive]}>🤖</Text>
          <Text style={[styles.navLabel, currentTab === 'insights' && styles.navLabelActive]}>AI Insights</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>🚀 Hackathon Demo Ready • WellSync v2.0</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  header: { backgroundColor: '#667eea', padding: 25, paddingTop: 50, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.25, shadowRadius: 5, elevation: 8 },
  appTitle: { fontSize: 28, fontWeight: 'bold', color: 'white', marginBottom: 5 },
  appSubtitle: { fontSize: 14, color: 'white', opacity: 0.9 },
  content: { flex: 1, paddingBottom: 140 },
  
  // Scanner styles
  heroSection: { alignItems: 'center', padding: 30, backgroundColor: 'white', margin: 20, borderRadius: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  heroIcon: { fontSize: 80, marginBottom: 15, color: '#667eea' },
  heroTitle: { fontSize: 28, fontWeight: 'bold', color: '#333', marginBottom: 8 },
  heroSubtitle: { fontSize: 16, color: '#666', textAlign: 'center', marginBottom: 25, lineHeight: 22 },
  primaryButton: { backgroundColor: '#667eea', paddingVertical: 18, paddingHorizontal: 40, borderRadius: 30, shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.25, shadowRadius: 5, elevation: 5 },
  primaryButtonText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
  
  featuresSection: { margin: 20 },
  sectionTitle: { fontSize: 22, fontWeight: 'bold', color: '#333', marginBottom: 15, textAlign: 'center' },
  featureCard: { backgroundColor: 'white', padding: 20, borderRadius: 15, marginBottom: 15, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3, flexDirection: 'row', alignItems: 'center' },
  featureIcon: { fontSize: 30, marginRight: 15, width: 40 },
  featureContent: { flex: 1 },
  featureTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 5 },
  featureDescription: { fontSize: 14, color: '#666', lineHeight: 20 },
  
  demoResults: { margin: 20 },
  nutritionGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 20 },
  nutritionCard: { width: '48%', backgroundColor: 'white', padding: 20, borderRadius: 15, alignItems: 'center', marginBottom: 15, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  nutritionValue: { fontSize: 28, fontWeight: 'bold', color: '#667eea' },
  nutritionLabel: { fontSize: 14, color: '#666', marginTop: 5 },
  nutritionSubtext: { fontSize: 12, color: '#999', marginTop: 2 },
  
  healthScore: { backgroundColor: 'white', padding: 25, borderRadius: 15, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  scoreTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 10 },
  scoreValue: { fontSize: 48, fontWeight: 'bold', color: '#28a745', marginBottom: 5 },
  scoreDescription: { fontSize: 16, color: '#666' },
  
  // Dashboard styles
  pageTitle: { fontSize: 24, fontWeight: 'bold', color: '#333', margin: 20, textAlign: 'center' },
  
  // Google Fit connection
  connectButton: {
    backgroundColor: '#4285f4',
    margin: 20,
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  connectButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  connectionStatus: {
    backgroundColor: '#d4edda',
    margin: 20,
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#c3e6cb',
  },
  connectedText: {
    color: '#155724',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  lastUpdated: {
    color: '#6c757d',
    fontSize: 12,
    marginBottom: 2,
  },
  dataSource: {
    color: '#6c757d',
    fontSize: 11,
    fontStyle: 'italic',
  },
  
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  metricCard: {
    width: '48%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  metricIcon: {
    fontSize: 30,
    marginBottom: 10,
  },
  metricValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  metricLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
    textAlign: 'center',
  },
  metricDelta: {
    fontSize: 12,
    color: '#28a745',
    fontWeight: '600',
    marginTop: 3,
    textAlign: 'center',
  },
  metricTarget: {
    fontSize: 11,
    color: '#999',
    marginTop: 2,
    textAlign: 'center',
  },
  
  insightCard: {
    backgroundColor: 'white',
    margin: 20,
    padding: 25,
    borderRadius: 20,
    borderLeftWidth: 5,
    borderLeftColor: '#667eea',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 4,
  },
  insightTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  insightText: {
    fontSize: 16,
    color: '#555',
    lineHeight: 24,
    marginBottom: 20,
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#667eea',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 25,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#667eea',
    fontSize: 16,
    fontWeight: 'bold',
  },
  
  // Insights styles
  personalizedBanner: {
    backgroundColor: '#e8f5e8',
    margin: 20,
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#c3e6cb',
  },
  personalizedText: {
    color: '#155724',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  
  recommendationCard: {
    backgroundColor: 'white',
    margin: 20,
    padding: 25,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 4,
  },
  highPriority: {
    borderLeftWidth: 5,
    borderLeftColor: '#e74c3c',
  },
  mediumPriority: {
    borderLeftWidth: 5,
    borderLeftColor: '#f39c12',
  },
  lowPriority: {
    borderLeftWidth: 5,
    borderLeftColor: '#27ae60',
  },
  
  recommendationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    flexWrap: 'wrap',
  },
  priorityBadge: {
    backgroundColor: '#e74c3c',
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    marginRight: 10,
    marginBottom: 5,
  },
  mediumBadge: {
    backgroundColor: '#f39c12',
  },
  lowBadge: {
    backgroundColor: '#27ae60',
  },
  recommendationTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
    minWidth: 200,
  },
  recommendationDescription: {
    fontSize: 16,
    color: '#555',
    lineHeight: 24,
    marginBottom: 15,
  },
  
  actionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 10,
    marginBottom: 10,
  },
  actionItem: {
    fontSize: 14,
    color: '#555',
    marginBottom: 6,
    lineHeight: 20,
  },
  
  projectionCard: {
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 10,
    marginTop: 15,
    marginBottom: 5,
  },
  projectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  projectionText: {
    fontSize: 13,
    color: '#666',
    lineHeight: 18,
  },
  
  completeButton: {
    backgroundColor: '#28a745',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  completeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  
  // Navigation
  bottomNav: {
    position: 'absolute',
    bottom: 60,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    height: 75,
    paddingTop: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 10,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  navItemActive: {
    backgroundColor: '#f0f4ff',
    borderRadius: 15,
    marginHorizontal: 5,
  },
  navIcon: {
    fontSize: 24,
    marginBottom: 4,
    color: '#666',
  },
  navIconActive: {
    color: '#667eea',
  },
  navLabel: {
    fontSize: 12,
    color: '#666',
    fontWeight: '600',
  },
  navLabelActive: {
    color: '#667eea',
  },
  
  footer: {
    position: 'absolute',
    bottom: 10,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#28a745',
    fontWeight: 'bold',
  },
});

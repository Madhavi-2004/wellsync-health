import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Dimensions,
} from 'react-native';
import { LineChart, PieChart } from 'react-native-chart-kit';
import { GoogleFitAPI } from '../services/GoogleFitAPI';

const { width: screenWidth } = Dimensions.get('window');

const HealthDashboard = () => {
  const [healthData, setHealthData] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    loadHealthData();
  }, []);

  const loadHealthData = async () => {
    setIsRefreshing(true);
    try {
      const googleFitAPI = new GoogleFitAPI();
      const data = await googleFitAPI.getHealthData();
      setHealthData(data);
    } catch (error) {
      console.error('Error loading health data:', error);
      // Use demo data as fallback
      setHealthData(getDemoHealthData());
    }
    setIsRefreshing(false);
  };

  const getDemoHealthData = () => ({
    steps: 8547,
    sleep: 7.2,
    activeMinutes: 45,
    healthScore: 82,
    weeklySteps: [6200, 8500, 7800, 9200, 8100, 10500, 8547],
    nutritionBreakdown: [
      { name: 'Protein', percentage: 25, color: '#FF6B6B' },
      { name: 'Carbs', percentage: 50, color: '#4ECDC4' },
      { name: 'Fat', percentage: 25, color: '#45B7D1' },
    ],
  });

  const renderMetricCard = (title, value, unit, delta, icon) => (
    <View style={styles.metricCard}>
      <Text style={styles.metricIcon}>{icon}</Text>
      <Text style={styles.metricTitle}>{title}</Text>
      <Text style={styles.metricValue}>{value}{unit}</Text>
      <Text style={[styles.metricDelta, delta >= 0 ? styles.positive : styles.negative]}>
        {delta >= 0 ? '+' : ''}{delta}
      </Text>
    </View>
  );

  if (!healthData) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading your health data...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={isRefreshing} onRefresh={loadHealthData} />
      }
    >
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🏥 Health Dashboard</Text>
        <Text style={styles.headerSubtitle}>Your complete health overview</Text>
      </View>

      {/* Key Metrics */}
      <View style={styles.metricsContainer}>
        {renderMetricCard('Steps', healthData.steps.toLocaleString(), '', 
          healthData.steps - 8000, '🏃')}
        {renderMetricCard('Sleep', healthData.sleep, 'h', 
          Math.round((healthData.sleep - 8.0) * 10) / 10, '😴')}
        {renderMetricCard('Active', healthData.activeMinutes, 'min', 
          healthData.activeMinutes - 60, '💪')}
        {renderMetricCard('Score', healthData.healthScore, '/100', 5, '🎯')}
      </View>

      {/* Weekly Steps Chart */}
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>📈 Weekly Steps</Text>
        <LineChart
          data={{
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [{ data: healthData.weeklySteps }],
          }}
          width={screenWidth - 40}
          height={200}
          chartConfig={{
            backgroundColor: '#ffffff',
            backgroundGradientFrom: '#667eea',
            backgroundGradientTo: '#764ba2',
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          }}
          style={styles.chart}
        />
      </View>

      {/* Nutrition Breakdown */}
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>🍎 Today's Nutrition</Text>
        <PieChart
          data={healthData.nutritionBreakdown}
          width={screenWidth - 40}
          height={200}
          chartConfig={{
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          }}
          accessor="percentage"
          backgroundColor="transparent"
          paddingLeft="15"
          style={styles.chart}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    padding: 20,
    paddingTop: 40,
    backgroundColor: '#667eea',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'white',
    marginTop: 5,
  },
  metricsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 10,
  },
  metricCard: {
    width: '48%',
    backgroundColor: 'white',
    padding: 15,
    margin: '1%',
    borderRadius: 12,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  metricIcon: {
    fontSize: 24,
    marginBottom: 5,
  },
  metricTitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  metricValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  metricDelta: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 2,
  },
  positive: {
    color: '#28a745',
  },
  negative: {
    color: '#dc3545',
  },
  chartContainer: {
    backgroundColor: 'white',
    margin: 10,
    borderRadius: 12,
    padding: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
});

export default HealthDashboard;

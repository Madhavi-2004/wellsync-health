import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Alert } from 'react-native';

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🏥 WellSync Smart Health</Text>
        <Text style={styles.subtitle}>AI-Powered Health Intelligence</Text>
      </View>
      
      <View style={styles.content}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>📸 Smart Food Scanner</Text>
          <Text style={styles.cardDescription}>
            Take photos of your meals for instant AI-powered nutrition analysis
          </Text>
          <TouchableOpacity 
            style={styles.button}
            onPress={() => Alert.alert('WellSync Demo', '🎉 Food Scanner Ready!\n\n✨ Features:\n• AI food recognition\n• Nutrition analysis\n• Health recommendations')}
          >
            <Text style={styles.buttonText}>Start Food Scan</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>📊 Health Dashboard</Text>
          <View style={styles.metrics}>
            <View style={styles.metric}>
              <Text style={styles.metricValue}>8,547</Text>
              <Text style={styles.metricLabel}>Daily Steps</Text>
            </View>
            <View style={styles.metric}>
              <Text style={styles.metricValue}>7.2h</Text>
              <Text style={styles.metricLabel}>Sleep</Text>
            </View>
            <View style={styles.metric}>
              <Text style={styles.metricValue}>82/100</Text>
              <Text style={styles.metricLabel}>Health Score</Text>
            </View>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>🤖 AI Health Insights</Text>
          <Text style={styles.cardDescription}>
            Personalized recommendations based on your health data
          </Text>
          <TouchableOpacity 
            style={[styles.button, styles.secondaryButton]}
            onPress={() => Alert.alert('AI Insights', '🎯 Recommendations:\n\n• Increase daily steps to 10,000\n• Maintain consistent sleep schedule\n• Add more protein to meals')}
          >
            <Text style={[styles.buttonText, styles.secondaryButtonText]}>View Insights</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={styles.footer}>
        <Text style={styles.footerText}>Ready for Hackathon Demo! 🚀</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    backgroundColor: '#667eea',
    padding: 30,
    paddingTop: 60,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: 'white',
    opacity: 0.9,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  cardDescription: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#667eea',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#667eea',
  },
  secondaryButtonText: {
    color: '#667eea',
  },
  metrics: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  metric: {
    alignItems: 'center',
    flex: 1,
  },
  metricValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#667eea',
  },
  metricLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  footer: {
    padding: 20,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 16,
    color: '#28a745',
    fontWeight: 'bold',
  },
});

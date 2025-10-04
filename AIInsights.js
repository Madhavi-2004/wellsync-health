import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { HealthAnalyzer } from '../services/HealthAnalyzer';

const AIInsights = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [insights, setInsights] = useState([]);

  useEffect(() => {
    loadAIInsights();
  }, []);

  const loadAIInsights = async () => {
    try {
      const analyzer = new HealthAnalyzer();
      const aiRecommendations = await analyzer.generateRecommendations();
      const healthInsights = await analyzer.generateInsights();
      
      setRecommendations(aiRecommendations);
      setInsights(healthInsights);
    } catch (error) {
      console.error('Error loading AI insights:', error);
      // Fallback to demo data
      setRecommendations(getDemoRecommendations());
      setInsights(getDemoInsights());
    }
  };

  const getDemoRecommendations = () => [
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

  const getDemoInsights = () => [
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

  const markRecommendationComplete = (id) => {
    Alert.alert(
      'Recommendation Completed',
      'Great job! Keep up the healthy habits.',
      [{ text: 'OK', style: 'default' }]
    );
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return '#e74c3c';
      case 'medium': return '#f39c12';
      case 'low': return '#27ae60';
      default: return '#667eea';
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'high': return '🔴';
      case 'medium': return '🟡';
      case 'low': return '🟢';
      default: return '🔵';
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🤖 AI Health Insights</Text>
        <Text style={styles.headerSubtitle}>Personalized recommendations powered by machine learning</Text>
      </View>

      {/* AI Recommendations */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🎯 Today's Personalized Recommendations</Text>
        
        {recommendations.map((rec) => (
          <View key={rec.id} style={styles.recommendationCard}>
            <View style={styles.recommendationHeader}>
              <View style={styles.recommendationTitleContainer}>
                <Text style={styles.priorityIcon}>{getPriorityIcon(rec.priority)}</Text>
                <Text style={styles.recommendationTitle}>{rec.title}</Text>
              </View>
              <View style={[styles.categoryBadge, { backgroundColor: getPriorityColor(rec.priority) }]}>
                <Text style={styles.categoryText}>{rec.category}</Text>
              </View>
            </View>
            
            <Text style={styles.recommendationDescription}>{rec.description}</Text>
            
            <View style={styles.actionsContainer}>
              <Text style={styles.actionsTitle}>Action Steps:</Text>
              {rec.actions.map((action, index) => (
                <Text key={index} style={styles.actionItem}>• {action}</Text>
              ))}
            </View>
            
            <View style={styles.recommendationFooter}>
              <Text style={styles.confidenceText}>
                AI Confidence: {rec.confidence}%
              </Text>
              <TouchableOpacity
                style={styles.completeButton}
                onPress={() => markRecommendationComplete(rec.id)}
              >
                <Text style={styles.completeButtonText}>✅ Mark Complete</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>

      {/* Health Insights */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📊 AI Health Analysis</Text>
        
        {insights.map((insight) => (
          <View key={insight.id} style={styles.insightCard}>
            <Text style={styles.insightTitle}>{insight.title}</Text>
            <Text style={styles.insightMessage}>{insight.message}</Text>
            <Text style={styles.insightSource}>Based on: {insight.dataSource}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
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
    textAlign: 'center',
  },
  section: {
    padding: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  recommendationCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  recommendationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  recommendationTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  priorityIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  recommendationTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  categoryBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  recommendationDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
    lineHeight: 20,
  },
  actionsContainer: {
    marginBottom: 15,
  },
  actionsTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  actionItem: {
    fontSize: 14,
    color: '#555',
    marginLeft: 10,
    marginBottom: 3,
    lineHeight: 18,
  },
  recommendationFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  confidenceText: {
    fontSize: 12,
    color: '#888',
  },
  completeButton: {
    backgroundColor: '#28a745',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  completeButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  insightCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#667eea',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  insightTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  insightMessage: {
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
    marginBottom: 8,
  },
  insightSource: {
    fontSize: 12,
    color: '#888',
    fontStyle: 'italic',
  },
});

export default AIInsights;

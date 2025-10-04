import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { RNCamera } from 'react-native-camera';
import { SpoonacularAPI } from '../services/SpoonacularAPI';

const FoodScanner = ({ navigation }) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const cameraRef = useRef(null);

  const takePicture = async () => {
    if (cameraRef.current) {
      setIsAnalyzing(true);
      
      try {
        const options = {
          quality: 0.8,
          base64: true,
          width: 1024,
          height: 1024,
        };
        
        const data = await cameraRef.current.takePictureAsync(options);
        
        // Analyze food using Spoonacular API
        const spoonacularAPI = new SpoonacularAPI();
        const result = await spoonacularAPI.analyzeFoodImage(data.base64);
        
        setAnalysisResult(result);
        setIsAnalyzing(false);
        
        // Navigate to results screen
        navigation.navigate('FoodResults', { result });
        
      } catch (error) {
        Alert.alert('Error', 'Failed to analyze image');
        setIsAnalyzing(false);
      }
    }
  };

  return (
    <View style={styles.container}>
      <RNCamera
        ref={cameraRef}
        style={styles.camera}
        type={RNCamera.Constants.Type.back}
        flashMode={RNCamera.Constants.FlashMode.auto}
        androidCameraPermissionOptions={{
          title: 'Permission to use camera',
          message: 'We need your permission to scan food',
          buttonPositive: 'Ok',
          buttonNegative: 'Cancel',
        }}
      />
      
      {isAnalyzing && (
        <View style={styles.analyzingOverlay}>
          <ActivityIndicator size="large" color="#667eea" />
          <Text style={styles.analyzingText}>🤖 AI is analyzing your food...</Text>
        </View>
      )}
      
      <View style={styles.captureContainer}>
        <TouchableOpacity
          style={styles.captureButton}
          onPress={takePicture}
          disabled={isAnalyzing}
        >
          <Text style={styles.captureButtonText}>
            {isAnalyzing ? 'Analyzing...' : '📸 Scan Food'}
          </Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>🏥 WellSync Food Scanner</Text>
        <Text style={styles.subHeaderText}>Point camera at your meal</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  camera: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  analyzingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  analyzingText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
  },
  captureContainer: {
    position: 'absolute',
    bottom: 50,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  captureButton: {
    backgroundColor: '#667eea',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  captureButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  headerContainer: {
    position: 'absolute',
    top: 60,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  headerText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  subHeaderText: {
    color: 'white',
    fontSize: 16,
    marginTop: 5,
  },
});

export default FoodScanner;

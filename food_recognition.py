import requests
import cv2
import numpy as np
from PIL import Image
import streamlit as st

class FoodRecognizer:
    def __init__(self):
        self.logmeal_api_key = st.secrets["LOGMEAL_API_KEY"]
        self.logmeal_url = "https://api.logmeal.com/v2"
    
    def analyze_food_image(self, image_file):
        """Analyze food image and return nutrition data"""
        try:
            # Convert Streamlit uploaded file to format needed for API
            image_bytes = image_file.getvalue()
            
            # Call LogMeal API for food recognition
            food_detection = self.detect_foods_logmeal(image_bytes)
            
            # Get nutrition information
            nutrition_data = self.get_nutrition_info(food_detection)
            
            return {
                'detected_foods': food_detection,
                'nutrition': nutrition_data,
                'confidence': self.calculate_overall_confidence(food_detection)
            }
            
        except Exception as e:
            st.error(f"Food recognition error: {str(e)}")
            return self.get_fallback_analysis()
    
    def detect_foods_logmeal(self, image_bytes):
        """Use LogMeal API for food detection"""
        headers = {
            'Authorization': f'Bearer {self.logmeal_api_key}',
            'Content-Type': 'application/json'
        }
        
        files = {
            'image': ('meal.jpg', image_bytes, 'image/jpeg')
        }
        
        response = requests.post(
            f"{self.logmeal_url}/recognition/complete",
            headers=headers,
            files=files
        )
        
        if response.status_code == 200:
            result = response.json()
            
            detected_foods = []
            for food in result.get('recognition_results', []):
                detected_foods.append({
                    'name': food['name'],
                    'confidence': food['prob'],
                    'food_id': food['food_id'],
                    'portion_size': food.get('portion_size', 'medium')
                })
            
            return detected_foods
        else:
            raise Exception(f"LogMeal API error: {response.status_code}")
    
    def get_nutrition_info(self, detected_foods):
        """Get nutrition information for detected foods"""
        total_nutrition = {
            'calories': 0,
            'protein': 0,
            'carbs': 0,
            'fat': 0,
            'fiber': 0,
            'sugar': 0
        }
        
        for food in detected_foods:
            # Get nutrition data for each food
            nutrition_response = requests.get(
                f"{self.logmeal_url}/nutrition/recipe/nutritionalInfo",
                headers={'Authorization': f'Bearer {self.logmeal_api_key}'},
                params={'food_id': food['food_id']}
            )
            
            if nutrition_response.status_code == 200:
                nutrition = nutrition_response.json()
                
                # Weight by confidence and portion size
                weight_factor = food['confidence'] * self.get_portion_multiplier(food['portion_size'])
                
                total_nutrition['calories'] += nutrition.get('calories', 0) * weight_factor
                total_nutrition['protein'] += nutrition.get('protein', 0) * weight_factor
                total_nutrition['carbs'] += nutrition.get('carbs', 0) * weight_factor
                total_nutrition['fat'] += nutrition.get('fat', 0) * weight_factor
                total_nutrition['fiber'] += nutrition.get('fiber', 0) * weight_factor
                total_nutrition['sugar'] += nutrition.get('sugar', 0) * weight_factor
        
        return total_nutrition
    
    def get_portion_multiplier(self, portion_size):
        """Convert portion size to multiplier"""
        multipliers = {
            'small': 0.7,
            'medium': 1.0,
            'large': 1.3,
            'extra_large': 1.6
        }
        return multipliers.get(portion_size, 1.0)
    
    def get_fallback_analysis(self):
        """Fallback analysis if API fails"""
        return {
            'detected_foods': [
                {'name': 'Mixed Meal', 'confidence': 0.5, 'food_id': 'unknown'}
            ],
            'nutrition': {
                'calories': 500,
                'protein': 25,
                'carbs': 60,
                'fat': 20,
                'fiber': 8,
                'sugar': 15
            },
            'confidence': 0.5
        }

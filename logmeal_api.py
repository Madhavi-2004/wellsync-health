import requests
import streamlit as st
from PIL import Image
import io

class LogMealAPI:
    def __init__(self):
        self.api_key = st.secrets["LOGMEAL_API_KEY"]  # Set in .streamlit/secrets.toml
        self.base_url = "https://api.logmeal.com/v2"
        
    def analyze_food_image(self, image_bytes):
        """Main function to analyze food from image"""
        headers = {
            'Authorization': f'Bearer {self.api_key}',
        }
        
        files = {
            'image': ('meal.jpg', image_bytes, 'image/jpeg')
        }
        
        try:
            # Step 1: Food Recognition
            response = requests.post(
                f"{self.base_url}/recognition/complete",
                headers=headers,
                files=files,
                timeout=30
            )
            
            if response.status_code == 200:
                recognition_data = response.json()
                
                # Step 2: Get Nutrition Data
                nutrition_data = self.get_nutrition_details(recognition_data, headers)
                
                return {
                    'success': True,
                    'foods': recognition_data.get('recognition_results', []),
                    'nutrition': nutrition_data,
                    'confidence': self.calculate_confidence(recognition_data)
                }
            else:
                return self.get_fallback_nutrition()
                
        except Exception as e:
            st.error(f"Food API Error: {str(e)}")
            return self.get_fallback_nutrition()
    
    def get_nutrition_details(self, recognition_data, headers):
        """Get detailed nutrition for recognized foods"""
        total_nutrition = {
            'calories': 0, 'protein': 0, 'carbs': 0, 'fat': 0,
            'fiber': 0, 'sugar': 0, 'sodium': 0
        }
        
        for food in recognition_data.get('recognition_results', []):
            try:
                nutrition_response = requests.get(
                    f"{self.base_url}/nutrition/recipe/nutritionalInfo",
                    headers=headers,
                    params={'food_id': food.get('food_id', '')},
                    timeout=15
                )
                
                if nutrition_response.status_code == 200:
                    nutrition = nutrition_response.json()
                    confidence_weight = food.get('prob', 0.5)
                    
                    # Accumulate nutrition values
                    for key in total_nutrition.keys():
                        total_nutrition[key] += nutrition.get(key, 0) * confidence_weight
                        
            except Exception as e:
                continue
        
        return total_nutrition
    
    def get_fallback_nutrition(self):
        """Fallback nutrition data if API fails"""
        return {
            'success': False,
            'foods': [{'name': 'Mixed Meal', 'prob': 0.5}],
            'nutrition': {
                'calories': 450, 'protein': 20, 'carbs': 55, 'fat': 18,
                'fiber': 6, 'sugar': 12, 'sodium': 800
            },
            'confidence': 0.5
        }

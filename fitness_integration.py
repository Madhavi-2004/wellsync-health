import requests
from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build
import streamlit as st
from datetime import datetime, timedelta

class FitnessDataManager:
    def __init__(self):
        self.google_fit_scopes = [
            'https://www.googleapis.com/auth/fitness.activity.read',
            'https://www.googleapis.com/auth/fitness.body.read',
            'https://www.googleapis.com/auth/fitness.sleep.read'
        ]
        self.service = None
    
    def authenticate_google_fit(self):
        """Authenticate with Google Fit API"""
        try:
            if 'google_fit_token' in st.session_state:
                credentials = Credentials.from_authorized_user_info(
                    st.session_state.google_fit_token, 
                    self.google_fit_scopes
                )
            else:
                # First time authentication
                flow = self.create_oauth_flow()
                auth_url = flow.authorization_url()[0]
                
                st.markdown(f"[🔗 Connect to Google Fit]({auth_url})")
                
                auth_code = st.text_input("Enter authorization code:")
                if auth_code:
                    credentials = flow.fetch_token(authorization_response=auth_code)
                    st.session_state.google_fit_token = credentials
                else:
                    return False
            
            self.service = build('fitness', 'v1', credentials=credentials)
            return True
            
        except Exception as e:
            st.error(f"Google Fit authentication error: {str(e)}")
            return False
    
    def get_sleep_data(self, days_back=7):
        """Get sleep data from Google Fit"""
        if not self.service:
            return None
            
        try:
            end_time = datetime.now()
            start_time = end_time - timedelta(days=days_back)
            
            # Convert to nanoseconds (Google Fit format)
            start_time_ns = int(start_time.timestamp() * 1000000000)
            end_time_ns = int(end_time.timestamp() * 1000000000)
            
            # Request sleep data
            request_body = {
                "aggregateBy": [{
                    "dataTypeName": "com.google.sleep.segment"
                }],
                "bucketByTime": {"durationMillis": 86400000},  # 1 day buckets
                "startTimeMillis": start_time_ns // 1000000,
                "endTimeMillis": end_time_ns // 1000000
            }
            
            response = self.service.users().dataset().aggregate(
                userId='me', 
                body=request_body
            ).execute()
            
            sleep_data = []
            for bucket in response.get('bucket', []):
                for dataset in bucket.get('dataset', []):
                    for point in dataset.get('point', []):
                        sleep_segment = {
                            'date': datetime.fromtimestamp(
                                int(point['startTimeNanos']) / 1000000000
                            ).date(),
                            'duration_hours': (
                                int(point['endTimeNanos']) - int(point['startTimeNanos'])
                            ) / (1000000000 * 3600),  # Convert to hours
                            'sleep_type': point.get('value', [{}])[0].get('intVal', 1)
                        }
                        sleep_data.append(sleep_segment)
            
            return sleep_data
            
        except Exception as e:
            st.error(f"Error fetching sleep data: {str(e)}")
            return self.get_fallback_sleep_data()
    
    def get_activity_data(self, days_back=7):
        """Get activity data from Google Fit"""
        if not self.service:
            return None
            
        try:
            end_time = datetime.now() 
            start_time = end_time - timedelta(days=days_back)
            
            start_time_ns = int(start_time.timestamp() * 1000000000)
            end_time_ns = int(end_time.timestamp() * 1000000000)
            
            # Request activity data
            request_body = {
                "aggregateBy": [
                    {"dataTypeName": "com.google.step_count.delta"},
                    {"dataTypeName": "com.google.calories.expended"},
                    {"dataTypeName": "com.google.active_minutes"}
                ],
                "bucketByTime": {"durationMillis": 86400000},
                "startTimeMillis": start_time_ns // 1000000,
                "endTimeMillis": end_time_ns // 1000000
            }
            
            response = self.service.users().dataset().aggregate(
                userId='me',
                body=request_body
            ).execute()
            
            activity_data = []
            for bucket in response.get('bucket', []):
                daily_activity = {
                    'date': datetime.fromtimestamp(
                        int(bucket['startTimeMillis']) / 1000
                    ).date(),
                    'steps': 0,
                    'calories': 0,
                    'active_minutes': 0
                }
                
                for dataset in bucket.get('dataset', []):
                    data_type = dataset['dataSourceId']
                    
                    for point in dataset.get('point', []):
                        if 'step_count' in data_type:
                            daily_activity['steps'] += point['value'][0]['intVal']
                        elif 'calories' in data_type:
                            daily_activity['calories'] += point['value'][0]['fpVal']
                        elif 'active_minutes' in data_type:
                            daily_activity['active_minutes'] += point['value'][0]['intVal']
                
                activity_data.append(daily_activity)
            
            return activity_data
            
        except Exception as e:
            st.error(f"Error fetching activity data: {str(e)}")
            return self.get_fallback_activity_data()
    
    def get_fallback_sleep_data(self):
        """Fallback sleep data if API fails"""
        return [
            {'date': datetime.now().date() - timedelta(days=i), 
             'duration_hours': 7.5 + (i * 0.2), 
             'sleep_type': 1} 
            for i in range(7)
        ]
    
    def get_fallback_activity_data(self):
        """Fallback activity data if API fails"""
        return [
            {'date': datetime.now().date() - timedelta(days=i),
             'steps': 8000 + (i * 200),
             'calories': 2200 + (i * 50),
             'active_minutes': 45 + (i * 2)}
            for i in range(7)
        ]

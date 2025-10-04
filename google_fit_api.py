import streamlit as st
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import Flow
from googleapiclient.discovery import build
import json
from datetime import datetime, timedelta

class GoogleFitIntegration:
    def __init__(self):
        self.SCOPES = [
            'https://www.googleapis.com/auth/fitness.activity.read',
            'https://www.googleapis.com/auth/fitness.body.read', 
            'https://www.googleapis.com/auth/fitness.sleep.read',
            'https://www.googleapis.com/auth/fitness.heart_rate.read'
        ]
        self.CLIENT_ID = st.secrets["GOOGLE_CLIENT_ID"]
        self.CLIENT_SECRET = st.secrets["GOOGLE_CLIENT_SECRET"]
        self.REDIRECT_URI = "http://localhost:8501/oauth2callback"
        
    def get_authorization_url(self):
        """Generate Google OAuth authorization URL"""
        flow = Flow.from_client_config(
            {
                "web": {
                    "client_id": self.CLIENT_ID,
                    "client_secret": self.CLIENT_SECRET,
                    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
                    "token_uri": "https://oauth2.googleapis.com/token",
                    "redirect_uris": [self.REDIRECT_URI]
                }
            },
            scopes=self.SCOPES
        )
        flow.redirect_uri = self.REDIRECT_URI
        
        auth_url, _ = flow.authorization_url(prompt='consent')
        return auth_url, flow
    
    def exchange_code_for_token(self, authorization_code):
        """Exchange authorization code for access token"""
        try:
            flow = Flow.from_client_config(
                {
                    "web": {
                        "client_id": self.CLIENT_ID,
                        "client_secret": self.CLIENT_SECRET,
                        "auth_uri": "https://accounts.google.com/o/oauth2/auth",
                        "token_uri": "https://oauth2.googleapis.com/token",
                        "redirect_uris": [self.REDIRECT_URI]
                    }
                },
                scopes=self.SCOPES
            )
            flow.redirect_uri = self.REDIRECT_URI
            
            flow.fetch_token(code=authorization_code)
            credentials = flow.credentials
            
            # Store credentials in session state
            st.session_state.google_fit_credentials = {
                'token': credentials.token,
                'refresh_token': credentials.refresh_token,
                'token_uri': credentials.token_uri,
                'client_id': credentials.client_id,
                'client_secret': credentials.client_secret,
                'scopes': credentials.scopes
            }
            
            return True
        except Exception as e:
            st.error(f"OAuth Error: {str(e)}")
            return False
    
    def get_fitness_service(self):
        """Build Google Fit API service"""
        if 'google_fit_credentials' not in st.session_state:
            return None
            
        try:
            creds_data = st.session_state.google_fit_credentials
            credentials = Credentials.from_authorized_user_info(creds_data)
            
            if credentials.expired and credentials.refresh_token:
                credentials.refresh(Request())
                
            service = build('fitness', 'v1', credentials=credentials)
            return service
        except Exception as e:
            st.error(f"Service Error: {str(e)}")
            return None
    
    def get_recent_health_data(self, days_back=7):
        """Get comprehensive health data from Google Fit"""
        service = self.get_fitness_service()
        if not service:
            return self.get_demo_health_data()
        
        try:
            end_time = datetime.now()
            start_time = end_time - timedelta(days=days_back)
            
            # Convert to nanoseconds (Google Fit format)
            start_time_ns = int(start_time.timestamp() * 1_000_000_000)
            end_time_ns = int(end_time.timestamp() * 1_000_000_000)
            
            # Aggregate request for multiple data types
            request_body = {
                "aggregateBy": [
                    {"dataTypeName": "com.google.step_count.delta"},
                    {"dataTypeName": "com.google.calories.expended"},
                    {"dataTypeName": "com.google.active_minutes"},
                    {"dataTypeName": "com.google.heart_rate.bpm"},
                    {"dataTypeName": "com.google.sleep.segment"}
                ],
                "bucketByTime": {"durationMillis": 86400000},  # Daily buckets
                "startTimeMillis": start_time_ns // 1_000_000,
                "endTimeMillis": end_time_ns // 1_000_000
            }
            
            response = service.users().dataset().aggregate(
                userId='me', 
                body=request_body
            ).execute()
            
            return self.process_google_fit_response(response)
            
        except Exception as e:
            st.warning(f"Using demo data: {str(e)}")
            return self.get_demo_health_data()
    
    def process_google_fit_response(self, response):
        """Process Google Fit API response into usable format"""
        health_data = {
            'sleep_data': [],
            'fitness_data': [],
            'last_updated': datetime.now().isoformat()
        }
        
        for bucket in response.get('bucket', []):
            date = datetime.fromtimestamp(
                int(bucket['startTimeMillis']) / 1000
            ).date()
            
            daily_data = {
                'date': date.isoformat(),
                'steps': 0,
                'calories': 0,
                'active_minutes': 0,
                'heart_rate_avg': 70,
                'sleep_hours': 7.5
            }
            
            for dataset in bucket.get('dataset', []):
                data_type = dataset.get('dataSourceId', '')
                
                for point in dataset.get('point', []):
                    if 'step_count' in data_type:
                        daily_data['steps'] += point['value'][0].get('intVal', 0)
                    elif 'calories' in data_type:
                        daily_data['calories'] += point['value'][0].get('fpVal', 0)
                    elif 'active_minutes' in data_type:
                        daily_data['active_minutes'] += point['value'][0].get('intVal', 0)
                    elif 'heart_rate' in data_type:
                        daily_data['heart_rate_avg'] = point['value'][0].get('fpVal', 70)
                    elif 'sleep' in data_type:
                        sleep_duration = (
                            int(point['endTimeNanos']) - int(point['startTimeNanos'])
                        ) / (1_000_000_000 * 3600)  # Convert to hours
                        daily_data['sleep_hours'] = sleep_duration
            
            health_data['fitness_data'].append(daily_data)
            health_data['sleep_data'].append({
                'date': daily_data['date'],
                'duration_hours': daily_data['sleep_hours'],
                'quality_estimate': min(10, max(1, daily_data['sleep_hours'] * 1.2))
            })
        
        return health_data
    
    def get_demo_health_data(self):
        """Demo health data when API isn't available"""
        import random
        
        health_data = {'sleep_data': [], 'fitness_data': []}
        
        for i in range(7):
            date = (datetime.now() - timedelta(days=i)).date()
            
            health_data['fitness_data'].append({
                'date': date.isoformat(),
                'steps': random.randint(6000, 12000),
                'calories': random.randint(1800, 2500),
                'active_minutes': random.randint(20, 80),
                'heart_rate_avg': random.randint(65, 85)
            })
            
            health_data['sleep_data'].append({
                'date': date.isoformat(),
                'duration_hours': random.uniform(6.0, 9.0),
                'quality_estimate': random.randint(5, 10)
            })
        
        return health_data

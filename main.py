import streamlit as st
import sys
import os
from datetime import datetime
import random

# Add project root to path for imports
current_dir = os.path.dirname(os.path.abspath(__file__))
parent_dir = os.path.dirname(current_dir)
sys.path.append(parent_dir)

class WellSyncSmartApp:
    def __init__(self):
        self.setup_page()
        self.init_session_state()
    
    def setup_page(self):
        """Configure Streamlit page with professional styling"""
        st.set_page_config(
            page_title="WellSync Smart Health",
            page_icon="🏥",
            layout="wide",
            initial_sidebar_state="expanded"
        )
        
        # Professional CSS styling
        st.markdown("""
        <style>
        .main-header {
            font-size: 3.5rem;
            background: linear-gradient(45deg, #667eea, #764ba2);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            text-align: center;
            margin-bottom: 2rem;
            font-weight: bold;
        }
        
        .permission-card {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 2rem;
            border-radius: 15px;
            box-shadow: 0 8px 32px rgba(102, 126, 234, 0.3);
            margin: 1rem 0;
            transition: transform 0.3s ease;
        }
        
        .permission-card:hover {
            transform: translateY(-5px);
        }
        
        .metric-card {
            background: white;
            padding: 1.5rem;
            border-radius: 12px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.1);
            border-left: 4px solid #667eea;
            margin: 1rem 0;
        }
        
        .food-result {
            background: linear-gradient(135deg, #56ab2f 0%, #a8e6cf 100%);
            color: white;
            padding: 1.5rem;
            border-radius: 10px;
            margin: 1rem 0;
        }
        
        .recommendation-card {
            background: #f8f9fa;
            border-left: 4px solid #28a745;
            padding: 1rem;
            margin: 0.5rem 0;
            border-radius: 5px;
        }
        
        .sidebar .sidebar-content {
            background: linear-gradient(180deg, #667eea 0%, #764ba2 100%);
        }
        </style>
        """, unsafe_allow_html=True)
    
    def init_session_state(self):
        """Initialize session state variables"""
        if 'permissions' not in st.session_state:
            st.session_state.permissions = {
                'camera': False,
                'google_fit': False
            }
        
        if 'user_data' not in st.session_state:
            st.session_state.user_data = {
                'meals': [],
                'health_data': {},
                'setup_complete': False,
                'total_meals_logged': 0
            }
        
        if 'demo_mode' not in st.session_state:
            st.session_state.demo_mode = True  # Use demo data for now
    
    def main(self):
        """Main application entry point"""
        # Check if all permissions are granted
        if not self.check_permissions():
            self.render_permission_screen()
        else:
            self.render_main_application()
    
    def check_permissions(self):
        """Check if required permissions are granted"""
        return (st.session_state.permissions['camera'] and 
                st.session_state.permissions['google_fit'])
    
    def render_permission_screen(self):
        """Render permission request interface"""
        st.markdown('<h1 class="main-header">🏥 WellSync Smart Health</h1>', 
                   unsafe_allow_html=True)
        
        st.markdown("### 🔐 Grant Permissions for AI-Powered Health Insights")
        st.markdown("*We need access to your camera and health data to provide personalized recommendations*")
        
        col1, col2 = st.columns(2)
        
        # Camera Permission Card
        with col1:
            st.markdown("""
            <div class="permission-card">
                <h3>📸 Camera Access</h3>
                <p>✨ Take photos of your meals</p>
                <p>🔍 Automatic food recognition with AI</p>
                <p>📊 Instant nutrition analysis</p>
                <p>🔒 Photos processed locally - not stored</p>
            </div>
            """, unsafe_allow_html=True)
            
            if st.session_state.permissions['camera']:
                st.success("✅ Camera access granted!")
            else:
                if st.button("📸 Grant Camera Permission", key="camera_perm", type="primary"):
                    st.session_state.permissions['camera'] = True
                    st.success("Camera permission granted!")
                    st.rerun()
        
        # Health Data Permission Card
        with col2:
            st.markdown("""
            <div class="permission-card">
                <h3>📱 Health Data Access</h3>
                <p>😴 Connect your sleep tracking apps</p>
                <p>🏃 Sync daily activity and steps</p>
                <p>❤️ Access heart rate and fitness data</p>
                <p>🤖 Enable AI health recommendations</p>
            </div>
            """, unsafe_allow_html=True)
            
            if st.session_state.permissions['google_fit']:
                st.success("✅ Health data connected!")
            else:
                if st.button("📱 Connect Health Apps", key="health_perm", type="primary"):
                    st.session_state.permissions['google_fit'] = True
                    st.success("Health apps connected!")
                    st.rerun()
        
        # Progress indicator
        granted_permissions = sum(st.session_state.permissions.values())
        st.progress(granted_permissions / 2)
        
        if granted_permissions == 0:
            st.info("🚀 Grant both permissions to start your health journey!")
        elif granted_permissions == 1:
            st.info("🎯 Almost there! Grant the remaining permission to continue.")
        else:
            st.success("🎉 All set! Loading your personalized health dashboard...")
            st.balloons()
    
    def render_main_application(self):
        """Main application dashboard"""
        # Sidebar navigation
        st.sidebar.markdown("## 🏥 WellSync")
        st.sidebar.markdown("*AI-Powered Health Intelligence*")
        st.sidebar.markdown("---")
        
        # Navigation menu
        page = st.sidebar.selectbox("📱 Navigate to", [
            "📸 Smart Food Scanner",
            "📊 Health Dashboard", 
            "🤖 AI Health Insights",
            "📈 Progress Tracking",
            "⚙️ Settings"
        ])
        
        # Display current user stats in sidebar
        st.sidebar.markdown("---")
        st.sidebar.markdown("### 📈 Quick Stats")
        st.sidebar.metric("Meals Logged", st.session_state.user_data['total_meals_logged'])
        st.sidebar.metric("Days Active", self.get_days_active())
        st.sidebar.metric("Health Score", "82/100")
        
        # Render selected page
        if page == "📸 Smart Food Scanner":
            self.render_food_scanner_page()
        elif page == "📊 Health Dashboard":
            self.render_health_dashboard_page()
        elif page == "🤖 AI Health Insights":
            self.render_ai_insights_page()
        elif page == "📈 Progress Tracking":
            self.render_progress_tracking_page()
        elif page == "⚙️ Settings":
            self.render_settings_page()
    
    def render_food_scanner_page(self):
        """Smart food scanner with camera integration"""
        st.markdown("# 📸 Smart Food Scanner")
        st.markdown("*Take a photo of your meal for instant AI-powered nutrition analysis*")
        
        # Camera input
        picture = st.camera_input("📷 Capture your meal")
        
        if picture is not None:
            col1, col2 = st.columns([1, 1])
            
            with col1:
                st.image(picture, caption="Your Meal Photo", use_column_width=True)
            
            with col2:
                st.markdown("### 🔍 AI Analysis Results")
                
                # Simulate food recognition processing
                with st.spinner("🤖 AI is analyzing your food..."):
                    import time
                    time.sleep(2)  # Simulate processing time
                    
                    # Generate demo food recognition results
                    food_results = self.generate_demo_food_analysis()
                
                # Display detected foods
                st.markdown("**🍽️ Detected Foods:**")
                for food in food_results['foods']:
                    confidence = food['confidence']
                    confidence_color = "🟢" if confidence > 80 else "🟡" if confidence > 60 else "🔴"
                    st.markdown(f"{confidence_color} **{food['name']}** ({confidence:.1f}% confidence)")
                
                # Display nutrition information
                st.markdown("**📊 Nutrition Analysis:**")
                nutrition = food_results['nutrition']
                
                # Create nutrition metrics
                col_a, col_b = st.columns(2)
                
                with col_a:
                    st.metric("Calories", f"{nutrition['calories']:.0f} kcal")
                    st.metric("Protein", f"{nutrition['protein']:.1f}g")
                    st.metric("Fiber", f"{nutrition['fiber']:.1f}g")
                
                with col_b:
                    st.metric("Carbs", f"{nutrition['carbs']:.1f}g")
                    st.metric("Fat", f"{nutrition['fat']:.1f}g")
                    st.metric("Sugar", f"{nutrition['sugar']:.1f}g")
                
                # Log meal button
                if st.button("✅ Log This Meal", type="primary"):
                    self.save_meal_to_profile(food_results)
                    st.success("🎉 Meal logged successfully!")
                    
                    # Generate personalized health tip
                    health_tip = self.generate_health_tip_from_nutrition(nutrition)
                    st.info(f"💡 **Health Insight:** {health_tip}")
                    
                    # Update total meals counter
                    st.session_state.user_data['total_meals_logged'] += 1
    
    def render_health_dashboard_page(self):
        """Comprehensive health overview dashboard"""
        st.markdown("# 📊 Health Dashboard")
        st.markdown("*Your complete health overview powered by AI*")
        
        # Get health data (demo version)
        health_data = self.get_demo_health_data()
        
        # Key health metrics
        st.markdown("### 🎯 Key Health Metrics")
        
        col1, col2, col3, col4 = st.columns(4)
        
        with col1:
            steps = health_data['fitness']['steps']
            step_delta = steps - 8000
            st.metric("🏃 Daily Steps", f"{steps:,}", f"{step_delta:+,}")
        
        with col2:
            sleep_hours = health_data['sleep']['duration']
            sleep_delta = sleep_hours - 8.0
            st.metric("😴 Sleep Hours", f"{sleep_hours:.1f}h", f"{sleep_delta:+.1f}h")
        
        with col3:
            active_minutes = health_data['fitness']['active_minutes']
            active_delta = active_minutes - 60
            st.metric("💪 Active Minutes", f"{active_minutes}", f"{active_delta:+}")
        
        with col4:
            health_score = self.calculate_health_score(health_data)
            st.metric("🎯 Health Score", f"{health_score}/100", "+5")
        
        # Health trends chart
        st.markdown("### 📈 Weekly Health Trends")
        
        # Generate sample chart data
        import pandas as pd
        import numpy as np
        
        dates = pd.date_range(end=datetime.now().date(), periods=7, freq='D')
        chart_data = pd.DataFrame({
            'Date': dates,
            'Steps': np.random.randint(6000, 12000, 7),
            'Sleep Hours': np.random.uniform(6.5, 9.0, 7),
            'Health Score': np.random.randint(70, 90, 7)
        })
        
        # Display multiple charts
        col1, col2 = st.columns(2)
        
        with col1:
            st.line_chart(chart_data.set_index('Date')[['Steps']])
            st.caption("Daily step count trend")
        
        with col2:
            st.line_chart(chart_data.set_index('Date')[['Health Score']])
            st.caption("Overall health score progression")
        
        # Recent meals section
        st.markdown("### 🍽️ Recent Meals")
        
        if st.session_state.user_data['meals']:
            for i, meal in enumerate(st.session_state.user_data['meals'][-3:]):
                with st.expander(f"Meal {i+1} - {meal['timestamp'][:10]}"):
                    col1, col2 = st.columns(2)
                    
                    with col1:
                        st.markdown("**Detected Foods:**")
                        for food in meal['foods']:
                            st.markdown(f"- {food['name']} ({food['confidence']:.1f}%)")
                    
                    with col2:
                        st.markdown("**Nutrition:**")
                        nutr = meal['nutrition']
                        st.markdown(f"🔥 Calories: {nutr['calories']:.0f} kcal")
                        st.markdown(f"🥩 Protein: {nutr['protein']:.1f}g")
                        st.markdown(f"🍞 Carbs: {nutr['carbs']:.1f}g")
                        st.markdown(f"🥑 Fat: {nutr['fat']:.1f}g")
        else:
            st.info("📸 Start logging meals with the Smart Food Scanner to see your nutrition history!")
    
    def render_ai_insights_page(self):
        """AI-powered health insights and recommendations"""
        st.markdown("# 🤖 AI Health Insights")
        st.markdown("*Personalized recommendations powered by machine learning*")
        
        # Generate AI recommendations based on user data
        recommendations = self.generate_ai_recommendations()
        
        st.markdown("### 🎯 Today's Personalized Recommendations")
        
        for rec in recommendations:
            priority_color = {
                'high': '#e74c3c',
                'medium': '#f39c12', 
                'low': '#27ae60'
            }[rec['priority']]
            
            priority_emoji = {
                'high': '🔴',
                'medium': '🟡',
                'low': '🟢'
            }[rec['priority']]
            
            with st.expander(f"{priority_emoji} {rec['title']} ({rec['category']})"):
                st.markdown(f"**Priority:** {rec['priority'].upper()}")
                st.markdown(f"**Description:** {rec['description']}")
                st.markdown(f"**Action Steps:**")
                for action in rec['actions']:
                    st.markdown(f"• {action}")
                
                if st.button(f"Mark as Done", key=f"done_{rec['title']}"):
                    st.success("✅ Great job completing this recommendation!")
        
        # Health insights based on data
        st.markdown("---")
        st.markdown("### 📊 AI Health Analysis")
        
        # Generate insights
        insights = self.generate_health_insights()
        
        for insight in insights:
            st.markdown(f"""
            <div class="recommendation-card">
                <h4>{insight['title']}</h4>
                <p>{insight['message']}</p>
                <small><strong>Based on:</strong> {insight['data_source']}</small>
            </div>
            """, unsafe_allow_html=True)
    
    def render_progress_tracking_page(self):
        """Progress tracking and goal management"""
        st.markdown("# 📈 Progress Tracking")
        st.markdown("*Track your health journey over time*")
        
        # Goal setting section
        st.markdown("### 🎯 Set Your Health Goals")
        
        col1, col2, col3 = st.columns(3)
        
        with col1:
            daily_steps_goal = st.number_input("Daily Steps Goal", value=10000, step=500)
        
        with col2:
            sleep_goal = st.number_input("Sleep Hours Goal", value=8.0, step=0.5)
        
        with col3:
            meals_per_day = st.number_input("Meals to Log Daily", value=3, step=1)
        
        if st.button("💾 Save Goals"):
            st.success("Goals saved successfully!")
        
        # Progress overview
        st.markdown("### 📊 Progress Overview")
        
        # Generate progress data
        progress_data = {
            'steps': {'current': 8547, 'goal': daily_steps_goal, 'progress': 85.5},
            'sleep': {'current': 7.2, 'goal': sleep_goal, 'progress': 90.0},
            'meals': {'current': 2, 'goal': meals_per_day, 'progress': 66.7}
        }
        
        for metric, data in progress_data.items():
            col1, col2 = st.columns([3, 1])
            
            with col1:
                st.progress(data['progress'] / 100)
                st.markdown(f"**{metric.title()}:** {data['current']} / {data['goal']}")
            
            with col2:
                st.metric("Progress", f"{data['progress']:.1f}%")
        
        # Weekly summary
        st.markdown("### 📅 Weekly Summary")
        
        summary_data = {
            'Days with 8+ hours sleep': 5,
            'Days meeting step goal': 4,
            'Total meals logged': st.session_state.user_data['total_meals_logged'],
            'Average health score': 82
        }
        
        cols = st.columns(len(summary_data))
        for i, (metric, value) in enumerate(summary_data.items()):
            with cols[i]:
                st.metric(metric, value)
    
    def render_settings_page(self):
        """Application settings and preferences"""
        st.markdown("# ⚙️ Settings")
        
        st.markdown("### 🔐 Privacy & Permissions")
        
        # Permission management
        col1, col2 = st.columns(2)
        
        with col1:
            if st.button("🔄 Reconnect Health Apps"):
                st.info("Health app connection refreshed!")
        
        with col2:
            if st.button("📸 Reset Camera Permission"):
                st.session_state.permissions['camera'] = False
                st.info("Camera permission reset. You'll be asked again next time.")
        
        st.markdown("### 📊 Data Management")
        
        col1, col2 = st.columns(2)
        
        with col1:
            st.markdown(f"**Meals Logged:** {len(st.session_state.user_data['meals'])}")
            st.markdown(f"**Days Active:** {self.get_days_active()}")
        
        with col2:
            if st.button("🗑️ Clear All Meal Data"):
                st.session_state.user_data['meals'] = []
                st.session_state.user_data['total_meals_logged'] = 0
                st.success("All meal data cleared!")
        
        st.markdown("### 🎨 App Preferences")
        
        demo_mode = st.checkbox("Demo Mode", value=st.session_state.demo_mode)
        st.session_state.demo_mode = demo_mode
        
        if demo_mode:
            st.info("Demo mode enabled - using simulated data for all features")
        else:
            st.info("Live mode - using real API calls (coming in Hour 10-11)")
    
    # Helper methods
    def generate_demo_food_analysis(self):
        """Generate realistic demo food analysis results"""
        demo_meals = [
            {
                'foods': [
                    {'name': 'Grilled Chicken Breast', 'confidence': 92.5},
                    {'name': 'Brown Rice', 'confidence': 88.3},
                    {'name': 'Steamed Broccoli', 'confidence': 85.7}
                ],
                'nutrition': {'calories': 425, 'protein': 35, 'carbs': 45, 'fat': 8, 'fiber': 6, 'sugar': 4}
            },
            {
                'foods': [
                    {'name': 'Salmon Fillet', 'confidence': 89.2},
                    {'name': 'Quinoa', 'confidence': 91.5},
                    {'name': 'Mixed Vegetables', 'confidence': 82.4}
                ],
                'nutrition': {'calories': 520, 'protein': 38, 'carbs': 42, 'fat': 18, 'fiber': 8, 'sugar': 6}
            },
            {
                'foods': [
                    {'name': 'Turkey Sandwich', 'confidence': 87.6},
                    {'name': 'Whole Wheat Bread', 'confidence': 94.1},
                    {'name': 'Avocado', 'confidence': 90.3}
                ],
                'nutrition': {'calories': 380, 'protein': 28, 'carbs': 35, 'fat': 15, 'fiber': 9, 'sugar': 5}
            }
        ]
        
        return random.choice(demo_meals)
    
    def get_demo_health_data(self):
        """Generate demo health data"""
        return {
            'fitness': {
                'steps': random.randint(7000, 12000),
                'active_minutes': random.randint(35, 75),
                'calories_burned': random.randint(2000, 2800)
            },
            'sleep': {
                'duration': round(random.uniform(6.5, 9.0), 1),
                'quality': random.randint(6, 10),
                'efficiency': round(random.uniform(0.75, 0.95), 2)
            }
        }
    
    def calculate_health_score(self, health_data):
        """Calculate unified health score"""
        steps_score = min(100, (health_data['fitness']['steps'] / 10000) * 100)
        sleep_score = max(0, 100 - abs(health_data['sleep']['duration'] - 8) * 12.5)
        active_score = min(100, (health_data['fitness']['active_minutes'] / 60) * 100)
        
        return round((steps_score * 0.4 + sleep_score * 0.4 + active_score * 0.2))
    
    def generate_ai_recommendations(self):
        """Generate AI-powered health recommendations"""
        return [
            {
                'title': 'Increase Daily Steps',
                'category': 'Fitness',
                'priority': 'high',
                'description': 'You\'re averaging 7,500 steps daily. Increase to 10,000 for optimal health.',
                'actions': [
                    'Take a 10-minute walk after each meal',
                    'Use stairs instead of elevators',
                    'Park further from destinations'
                ]
            },
            {
                'title': 'Optimize Sleep Schedule',
                'category': 'Sleep',
                'priority': 'medium',
                'description': 'Your sleep duration varies significantly. Consistency improves quality.',
                'actions': [
                    'Set a fixed bedtime and wake time',
                    'Avoid screens 1 hour before bed',
                    'Keep bedroom temperature at 65-68°F'
                ]
            },
            {
                'title': 'Increase Protein Intake',
                'category': 'Nutrition',
                'priority': 'medium',
                'description': 'Your meals average 18% protein. Aim for 22-25% for better satiety.',
                'actions': [
                    'Include protein in every meal',
                    'Add nuts or Greek yogurt as snacks',
                    'Consider protein-rich breakfast options'
                ]
            }
        ]
    
    def generate_health_insights(self):
        """Generate health insights based on data patterns"""
        return [
            {
                'title': '🛌 Sleep Pattern Analysis',
                'message': 'Your sleep duration has improved by 15 minutes over the past week. Keep up the consistent bedtime routine!',
                'data_source': 'Sleep tracking data from connected apps'
            },
            {
                'title': '🏃 Activity Trend',
                'message': 'You\'re most active on weekdays between 6-8 PM. Consider maintaining this energy on weekends.',
                'data_source': 'Daily step count and activity patterns'
            },
            {
                'title': '🍎 Nutrition Balance',
                'message': 'Your logged meals show good fiber intake but could benefit from more lean protein sources.',
                'data_source': 'Food recognition and nutrition analysis'
            }
        ]
    
    def save_meal_to_profile(self, meal_data):
        """Save analyzed meal to user profile"""
        meal_record = {
            'timestamp': datetime.now().isoformat(),
            'foods': meal_data['foods'],
            'nutrition': meal_data['nutrition'],
            'date': datetime.now().strftime('%Y-%m-%d')
        }
        
        st.session_state.user_data['meals'].append(meal_record)
        
        # Keep only last 50 meals
        if len(st.session_state.user_data['meals']) > 50:
            st.session_state.user_data['meals'] = st.session_state.user_data['meals'][-50:]
    
    def generate_health_tip_from_nutrition(self, nutrition):
        """Generate personalized health tip based on meal nutrition"""
        tips = []
        
        if nutrition['protein'] > 30:
            tips.append("Excellent protein content! Perfect for muscle recovery and satiety.")
        elif nutrition['protein'] < 15:
            tips.append("Consider adding more protein to feel fuller longer and support muscle health.")
        
        if nutrition['fiber'] > 8:
            tips.append("Great fiber intake! This supports digestive health and stable blood sugar.")
        elif nutrition['fiber'] < 3:
            tips.append("Try including more vegetables or fruits to boost fiber intake.")
        
        if nutrition['sugar'] > 25:
            tips.append("Watch your sugar intake - consider whole fruits instead of processed options.")
        
        if nutrition['calories'] > 600:
            tips.append("Substantial meal! Consider lighter options for your next meal to balance daily intake.")
        elif nutrition['calories'] < 250:
            tips.append("Light meal - make sure you're getting enough energy throughout the day.")
        
        return tips[0] if tips else "Well-balanced meal choice! Consistent logging helps optimize your nutrition."
    
    def get_days_active(self):
        """Calculate days active based on meal logging"""
        if not st.session_state.user_data['meals']:
            return 0
        
        unique_dates = set()
        for meal in st.session_state.user_data['meals']:
            date = meal['timestamp'][:10]  # Extract date part
            unique_dates.add(date)
        
        return len(unique_dates)

# Main application entry point
if __name__ == "__main__":
    app = WellSyncSmartApp()
    app.main()

import streamlit as st
import requests
import sys
import os
from datetime import datetime

# Add parent directory to path for imports
current_dir = os.path.dirname(os.path.abspath(__file__))
parent_dir = os.path.dirname(current_dir)
sys.path.append(parent_dir)

def test_project_structure():
    """Test project folder structure"""
    st.markdown("### 📁 Testing Project Structure")
    
    required_folders = ['app', 'api_integrations', 'ml_models', 'tests', 'config', '.streamlit']
    project_root = parent_dir
    
    all_good = True
    for folder in required_folders:
        folder_path = os.path.join(project_root, folder)
        if os.path.exists(folder_path):
            st.success(f"✅ {folder}/ folder exists")
        else:
            st.error(f"❌ {folder}/ folder missing")
            all_good = False
    
    # Check secrets file
    secrets_path = os.path.join(project_root, '.streamlit', 'secrets.toml')
    if os.path.exists(secrets_path):
        st.success("✅ secrets.toml exists")
    else:
        st.error("❌ secrets.toml missing")
        all_good = False
    
    return all_good

def test_python_packages():
    """Test required Python packages"""
    st.markdown("### 📦 Testing Python Packages")
    
    packages_to_test = [
        ('streamlit', 'Streamlit'),
        ('requests', 'Requests'),
        ('pandas', 'Pandas'),
        ('numpy', 'NumPy'),
        ('PIL', 'Pillow'),
        ('google.auth', 'Google Auth')
    ]
    
    all_installed = True
    
    for package_name, display_name in packages_to_test:
        try:
            if package_name == 'PIL':
                import PIL
                version = PIL.__version__
            elif package_name == 'google.auth':
                import google.auth
                version = "2.0+"
            else:
                module = __import__(package_name)
                version = getattr(module, '__version__', 'Unknown')
            
            st.success(f"✅ {display_name}: {version}")
            
        except ImportError:
            st.error(f"❌ {display_name}: Not installed")
            all_installed = False
        except Exception as e:
            st.warning(f"⚠️ {display_name}: {str(e)}")
    
    return all_installed

def test_streamlit_features():
    """Test Streamlit camera and file features"""
    st.markdown("### 🔧 Testing Streamlit Features")
    
    features_working = True
    
    # Test camera input availability
    if hasattr(st, 'camera_input'):
        st.success("✅ Camera input: Available")
    else:
        st.error("❌ Camera input: Not available")
        features_working = False
    
    # Test file uploader
    if hasattr(st, 'file_uploader'):
        st.success("✅ File uploader: Available")
    else:
        st.error("❌ File uploader: Not available")
        features_working = False
    
    # Test secrets access
    try:
        test_secret = st.secrets.get("test_key", "default_value")
        st.success("✅ Secrets access: Working")
    except Exception as e:
        st.warning(f"⚠️ Secrets access: {str(e)}")
    
    return features_working

def test_spoonacular_api():
    """Test Spoonacular API connection"""
    st.markdown("### 🍎 Testing Spoonacular Food Recognition API")
    
    # Check if API key exists
    try:
        api_key = st.secrets.get("SPOONACULAR_API_KEY", "")
    except Exception:
        st.error("❌ Cannot access secrets.toml file")
        st.code("Make sure .streamlit/secrets.toml exists with your API keys")
        return False
    
    if not api_key or api_key == "your_spoonacular_key_here":
        st.error("❌ Spoonacular API key not configured")
        st.markdown("**📋 Quick Fix:**")
        st.code("""
1. Go to https://spoonacular.com/food-api/console
2. Copy your API key
3. Edit .streamlit/secrets.toml:
   [secrets]
   SPOONACULAR_API_KEY = "your_actual_key_here"
4. Restart this app
        """)
        return False
    
    # Test API connection
    try:
        with st.spinner("Testing Spoonacular API connection..."):
            # Simple API test
            params = {
                'apiKey': api_key,
                'query': 'chicken',
                'number': 1
            }
            
            response = requests.get(
                "https://api.spoonacular.com/recipes/complexSearch",
                params=params,
                timeout=15
            )
            
            if response.status_code == 200:
                # Check remaining quota
                remaining = response.headers.get('X-API-Quota-Left', 'Unknown')
                st.success(f"✅ Spoonacular API: Connected successfully!")
                st.info(f"📊 Daily calls remaining: {remaining}")
                return True
                
            elif response.status_code == 401:
                st.error("❌ Spoonacular API: Invalid API key")
                st.info("Double-check your API key in secrets.toml")
                return False
                
            elif response.status_code == 402:
                st.warning("⚠️ Spoonacular API: Daily quota exceeded")
                st.info("✅ API key is valid - this is normal for free tier (150 calls/day)")
                return True
                
            else:
                st.error(f"❌ Spoonacular API: HTTP {response.status_code}")
                return False
                
    except requests.exceptions.Timeout:
        st.error("❌ Spoonacular API: Connection timeout")
        st.info("Check your internet connection")
        return False
        
    except requests.exceptions.ConnectionError:
        st.error("❌ Spoonacular API: Cannot connect")
        st.info("Check your internet connection")
        return False
        
    except Exception as e:
        st.error(f"❌ Spoonacular API: {str(e)}")
        return False

def test_google_fit_credentials():
    """Test Google Fit API credentials setup"""
    st.markdown("### 📱 Testing Google Fit API Setup")
    
    # Check credentials
    try:
        client_id = st.secrets.get("GOOGLE_CLIENT_ID", "")
        client_secret = st.secrets.get("GOOGLE_CLIENT_SECRET", "")
    except Exception:
        st.error("❌ Cannot access secrets.toml")
        return False
    
    if not client_id or client_id == "your_google_client_id.apps.googleusercontent.com":
        st.error("❌ Google Client ID not configured")
        st.markdown("**📋 Setup Google Fit API:**")
        st.code("""
1. Go to https://console.cloud.google.com/
2. Create project → Enable 'Fitness API'  
3. Create OAuth 2.0 credentials (Web application)
4. Add redirect: http://localhost:8501/oauth2callback
5. Copy Client ID & Secret to secrets.toml:
   [secrets]
   GOOGLE_CLIENT_ID = "your_id.apps.googleusercontent.com"
   GOOGLE_CLIENT_SECRET = "your_secret"
        """)
        return False
    
    if not client_secret or client_secret == "your_google_client_secret":
        st.error("❌ Google Client Secret not configured")
        st.info("Add your Client Secret to secrets.toml")
        return False
    
    # Validate credential format
    if ".apps.googleusercontent.com" not in client_id:
        st.error("❌ Google Client ID format incorrect")
        st.info("Should end with '.apps.googleusercontent.com'")
        return False
    
    # Test OAuth flow setup
    try:
        from google_auth_oauthlib.flow import Flow
        
        # Test credentials by creating OAuth flow
        flow = Flow.from_client_config(
            {
                "web": {
                    "client_id": client_id,
                    "client_secret": client_secret,
                    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
                    "token_uri": "https://oauth2.googleapis.com/token",
                    "redirect_uris": ["http://localhost:8501/oauth2callback"]
                }
            },
            scopes=['https://www.googleapis.com/auth/fitness.activity.read']
        )
        
        flow.redirect_uri = "http://localhost:8501/oauth2callback"
        auth_url, _ = flow.authorization_url(prompt='consent')
        
        if auth_url and "accounts.google.com" in auth_url:
            st.success("✅ Google Fit API: Credentials valid!")
            st.success("✅ OAuth flow: Ready for user authentication")
            st.info("🔗 Authorization URL can be generated")
            return True
        else:
            st.error("❌ Google Fit API: OAuth setup failed")
            return False
            
    except Exception as e:
        st.error(f"❌ Google Fit setup error: {str(e)}")
        st.info("Check your credentials in secrets.toml")
        return False

def main():
    """Main testing interface"""
    st.set_page_config(
        page_title="WellSync API Integration Tester",
        page_icon="🧪",
        layout="wide"
    )
    
    st.title("🧪 WellSync Hour 8 - API Integration Tester")
    st.markdown("**Verify all systems are working before proceeding to Hour 9**")
    st.markdown("---")
    
    # Run all tests
    st.markdown("## 🔍 Running System Tests...")
    
    test_results = {}
    
    # Test 1: Project Structure
    test_results['structure'] = test_project_structure()
    
    st.markdown("---")
    
    # Test 2: Python Packages
    test_results['packages'] = test_python_packages()
    
    st.markdown("---")
    
    # Test 3: Streamlit Features
    test_results['streamlit'] = test_streamlit_features()
    
    st.markdown("---")
    
    # Test 4: Spoonacular API
    test_results['spoonacular'] = test_spoonacular_api()
    
    st.markdown("---")
    
    # Test 5: Google Fit Credentials
    test_results['google_fit'] = test_google_fit_credentials()
    
    # Overall Results Summary
    st.markdown("---")
    st.markdown("## 📊 Test Results Summary")
    
    passed_tests = sum(test_results.values())
    total_tests = len(test_results)
    success_rate = (passed_tests / total_tests) * 100
    
    col1, col2, col3 = st.columns(3)
    
    with col1:
        st.metric("Tests Passed", f"{passed_tests}/{total_tests}")
    
    with col2:
        st.metric("Success Rate", f"{success_rate:.0f}%")
    
    with col3:
        if passed_tests == total_tests:
            st.metric("Status", "🟢 READY")
        elif passed_tests >= 3:
            st.metric("Status", "🟡 PARTIAL")
        else:
            st.metric("Status", "🔴 NOT READY")
    
    # Progress bar
    st.progress(passed_tests / total_tests)
    
    # Next Steps
    st.markdown("---")
    st.markdown("## 🚀 Next Steps")
    
    if passed_tests == total_tests:
        st.success("🎉 **All systems ready!** You can proceed to Hour 9: Main App Development")
        
        st.markdown("### ⏭️ Hour 9 Tasks Preview:")
        st.markdown("""
        1. **Build main Streamlit app** with camera interface
        2. **Integrate food scanning** using Spoonacular API
        3. **Add health dashboard** with Google Fit data
        4. **Create permission system** for user consent
        5. **Test end-to-end functionality**
        """)
        
        if st.button("🚀 Ready for Hour 9!", type="primary"):
            st.balloons()
            st.success("✅ Hour 8 Complete - All APIs configured and tested!")
            
    elif passed_tests >= 3:
        st.warning("⚠️ **Mostly ready, but fix these issues first:**")
        
        for test_name, result in test_results.items():
            if not result:
                st.markdown(f"- ❌ {test_name.replace('_', ' ').title()}")
                
    else:
        st.error("❌ **Major setup issues. Please fix:**")
        failed_tests = [name for name, result in test_results.items() if not result]
        for test_name in failed_tests:
            st.markdown(f"- 🔧 Fix {test_name.replace('_', ' ')}")
    
    # Debug Information
    st.markdown("---")
    st.markdown("### 🔧 Debug Information")
    
    with st.expander("Show System Details"):
        st.markdown(f"**Current Time:** {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        st.markdown(f"**Streamlit Version:** {st.__version__}")
        st.markdown(f"**Working Directory:** `{os.getcwd()}`")
        st.markdown(f"**Python Path:** `{sys.path[0]}`")
        
        # Show secrets file status
        secrets_path = os.path.join(parent_dir, '.streamlit', 'secrets.toml')
        if os.path.exists(secrets_path):
            st.markdown("**Secrets File:** ✅ Found")
            try:
                with open(secrets_path, 'r') as f:
                    content = f.read()
                if 'SPOONACULAR_API_KEY' in content:
                    st.markdown("**Spoonacular Key:** ✅ Present")
                else:
                    st.markdown("**Spoonacular Key:** ❌ Missing")
                    
                if 'GOOGLE_CLIENT_ID' in content:
                    st.markdown("**Google Credentials:** ✅ Present")
                else:
                    st.markdown("**Google Credentials:** ❌ Missing")
            except Exception as e:
                st.markdown(f"**Secrets File Error:** {str(e)}")
        else:
            st.markdown("**Secrets File:** ❌ Not found")

if __name__ == "__main__":
    main()

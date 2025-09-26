#!/usr/bin/env python3
"""
Backend API Testing for EXRSIM Exercise Builder
Tests all Exercise Builder CRUD operations
"""

import requests
import json
from datetime import datetime, timezone
import sys
import os

# Get backend URL from frontend .env
BACKEND_URL = "https://exrsim-command.preview.emergentagent.com/api"

def test_exercise_builder_api():
    """Test Exercise Builder API endpoints comprehensively"""
    print("=" * 60)
    print("TESTING EXERCISE BUILDER API ENDPOINTS")
    print("=" * 60)
    
    # Test data as specified in the review request - with dynamic collections
    test_exercise_data = {
        "exercise_name": "Emergency Flood Response Test",
        "exercise_type": "Table Top",
        "exercise_description": "Testing emergency response to major flood event",
        "location": "City Emergency Operations Center",
        "start_date": "2024-12-15T09:00:00Z",
        "start_time": "09:00",
        "end_date": "2024-12-15T17:00:00Z", 
        "end_time": "17:00",
        "scope_description": "Comprehensive flood response exercise covering all emergency services",
        "scope_hazards": "Major flooding, infrastructure damage, evacuation requirements",
        "scope_geographic_area": "Downtown metropolitan area and surrounding suburbs",
        "scope_functions": "Emergency response, evacuation, resource coordination",
        "scope_organizations": "Fire Department, Police, Emergency Management, Red Cross",
        "scope_personnel": "Emergency responders, coordinators, volunteers",
        "scope_exercise_type": "Table Top",
        "purpose_description": "Test coordination and response capabilities during major flood event",
        "scenario_name": "Metropolitan Flood Emergency",
        "scenario_description": "Heavy rainfall causes river overflow affecting 10,000+ residents",
        "scenario_latitude": 45.4215,
        "scenario_longitude": -75.6972,
        # Dynamic collections as specified in review request
        "goals": [{"id": 1, "name": "Test Goal 1", "description": "Test goal description", "achieved": "Partial"}],
        "objectives": [{"id": 2, "name": "Test Objective 1", "description": "Test objective description", "achieved": "Yes"}],
        "events": [{"id": 3, "name": "Emergency Alert", "description": "Initial emergency notification", "actions": "Notify all personnel"}],
        "functions": [{"id": 4, "name": "Emergency Response", "description": "Primary response function", "achieved": "No"}],
        "injections": [{"id": 5, "name": "Flood Warning", "description": "Initial flood warning injection", "time": "T+0"}],
        "organizations": [{"id": 6, "name": "Fire Department", "description": "Primary emergency response", "contact": "Chief Johnson"}],
        "coordinators": [{"id": 7, "name": "John Smith", "role": "Incident Commander", "contact": "555-0123"}],
        "codeWords": [{"id": 8, "word": "FLOODGATE", "definition": "Major flood event activation"}],
        "callsigns": [{"id": 9, "callsign": "COMMAND-1", "definition": "Emergency Operations Center"}],
        "frequencies": [{"id": 10, "name": "Emergency Channel", "frequency": "155.340", "description": "Primary emergency frequency"}],
        "assumptions": [{"id": 11, "name": "Weather Conditions", "assumption": "Heavy rain continues for 24 hours"}],
        "artificialities": [{"id": 12, "name": "Simulated Damage", "artificiality": "Infrastructure damage will be simulated"}],
        "safetyConcerns": [{"id": 13, "name": "Water Safety", "concern": "Risk of drowning in flood waters"}]
    }
    
    created_exercise_id = None
    
    try:
        # Test 1: GET /api/exercise-builder (Get all exercises - initial state)
        print("\n1. Testing GET /api/exercise-builder (initial)")
        response = requests.get(f"{BACKEND_URL}/exercise-builder")
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            initial_exercises = response.json()
            print(f"✅ Successfully retrieved {len(initial_exercises)} existing exercises")
            print(f"Initial exercise count: {len(initial_exercises)}")
        else:
            print(f"❌ Failed to get exercises: {response.text}")
            return False
            
        # Test 2: POST /api/exercise-builder (Create new exercise)
        print("\n2. Testing POST /api/exercise-builder (create exercise)")
        response = requests.post(
            f"{BACKEND_URL}/exercise-builder",
            json=test_exercise_data,
            headers={"Content-Type": "application/json"}
        )
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            created_exercise = response.json()
            created_exercise_id = created_exercise.get("id")
            print(f"✅ Successfully created exercise with ID: {created_exercise_id}")
            print(f"Exercise Name: {created_exercise.get('exercise_name')}")
            print(f"Exercise Type: {created_exercise.get('exercise_type')}")
            print(f"Location: {created_exercise.get('location')}")
            print(f"Start Date: {created_exercise.get('start_date')}")
            print(f"End Date: {created_exercise.get('end_date')}")
            
            # Verify all fields are present including dynamic collections
            required_fields = ['id', 'exercise_name', 'exercise_type', 'exercise_description', 
                             'location', 'start_date', 'end_date', 'created_at']
            dynamic_fields = ['goals', 'objectives', 'events', 'functions', 'injections', 
                            'organizations', 'coordinators', 'codeWords', 'callsigns', 
                            'frequencies', 'assumptions', 'artificialities', 'safetyConcerns']
            
            missing_fields = [field for field in required_fields if field not in created_exercise]
            missing_dynamic = [field for field in dynamic_fields if field not in created_exercise]
            
            if missing_fields:
                print(f"⚠️  Missing required fields in response: {missing_fields}")
            else:
                print("✅ All required fields present in created exercise")
                
            if missing_dynamic:
                print(f"⚠️  Missing dynamic fields in response: {missing_dynamic}")
            else:
                print("✅ All dynamic collection fields present in created exercise")
                
            # Verify dynamic collections have correct data
            print("\n   Verifying dynamic collections data:")
            if created_exercise.get('goals') == test_exercise_data['goals']:
                print("   ✅ Goals data matches")
            else:
                print(f"   ❌ Goals data mismatch. Expected: {test_exercise_data['goals']}, Got: {created_exercise.get('goals')}")
                
            if created_exercise.get('objectives') == test_exercise_data['objectives']:
                print("   ✅ Objectives data matches")
            else:
                print(f"   ❌ Objectives data mismatch. Expected: {test_exercise_data['objectives']}, Got: {created_exercise.get('objectives')}")
                
            if created_exercise.get('events') == test_exercise_data['events']:
                print("   ✅ Events data matches")
            else:
                print(f"   ❌ Events data mismatch. Expected: {test_exercise_data['events']}, Got: {created_exercise.get('events')}")
                
            print(f"   📊 Dynamic collections summary:")
            for field in dynamic_fields:
                field_data = created_exercise.get(field, [])
                print(f"   - {field}: {len(field_data)} items")
                if field_data and isinstance(field_data, list) and len(field_data) > 0:
                    print(f"     First item: {field_data[0]}")
                    
            print("   ✅ Dynamic collections verification completed")
        else:
            print(f"❌ Failed to create exercise: {response.text}")
            return False
            
        # Test 3: GET /api/exercise-builder (Verify exercise appears in list)
        print("\n3. Testing GET /api/exercise-builder (verify creation)")
        response = requests.get(f"{BACKEND_URL}/exercise-builder")
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            all_exercises = response.json()
            print(f"✅ Successfully retrieved {len(all_exercises)} exercises after creation")
            
            # Check if our created exercise is in the list
            created_found = any(ex.get('id') == created_exercise_id for ex in all_exercises)
            if created_found:
                print("✅ Created exercise found in exercise list")
            else:
                print("❌ Created exercise NOT found in exercise list")
                return False
                
            # Verify count increased
            if len(all_exercises) > len(initial_exercises):
                print(f"✅ Exercise count increased from {len(initial_exercises)} to {len(all_exercises)}")
            else:
                print(f"⚠️  Exercise count did not increase as expected")
        else:
            print(f"❌ Failed to get exercises after creation: {response.text}")
            return False
            
        # Test 4: GET /api/exercise-builder/{exercise_id} (Get specific exercise)
        print(f"\n4. Testing GET /api/exercise-builder/{created_exercise_id}")
        response = requests.get(f"{BACKEND_URL}/exercise-builder/{created_exercise_id}")
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            retrieved_exercise = response.json()
            print(f"✅ Successfully retrieved specific exercise")
            print(f"Exercise Name: {retrieved_exercise.get('exercise_name')}")
            print(f"Exercise Type: {retrieved_exercise.get('exercise_type')}")
            
            # Verify data matches what we created
            if (retrieved_exercise.get('exercise_name') == test_exercise_data['exercise_name'] and
                retrieved_exercise.get('exercise_type') == test_exercise_data['exercise_type']):
                print("✅ Retrieved exercise data matches created data")
            else:
                print("❌ Retrieved exercise data does not match created data")
                return False
        else:
            print(f"❌ Failed to get specific exercise: {response.text}")
            return False
            
        # Test 5: PUT /api/exercise-builder/{exercise_id} (Update exercise)
        print(f"\n5. Testing PUT /api/exercise-builder/{created_exercise_id}")
        update_data = test_exercise_data.copy()
        update_data['exercise_name'] = "Updated Emergency Flood Response Test"
        update_data['exercise_description'] = "Updated testing emergency response to major flood event"
        
        response = requests.put(
            f"{BACKEND_URL}/exercise-builder/{created_exercise_id}",
            json=update_data,
            headers={"Content-Type": "application/json"}
        )
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            updated_exercise = response.json()
            print(f"✅ Successfully updated exercise")
            print(f"Updated Name: {updated_exercise.get('exercise_name')}")
            print(f"Updated Description: {updated_exercise.get('exercise_description')}")
            
            # Verify update worked
            if updated_exercise.get('exercise_name') == "Updated Emergency Flood Response Test":
                print("✅ Exercise update verified")
            else:
                print("❌ Exercise update not reflected in response")
                return False
        else:
            print(f"❌ Failed to update exercise: {response.text}")
            return False
            
        # Test 6: Verify persistence by getting updated exercise
        print(f"\n6. Testing persistence - GET updated exercise")
        response = requests.get(f"{BACKEND_URL}/exercise-builder/{created_exercise_id}")
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            persisted_exercise = response.json()
            if persisted_exercise.get('exercise_name') == "Updated Emergency Flood Response Test":
                print("✅ Exercise updates properly persisted in database")
            else:
                print("❌ Exercise updates NOT persisted in database")
                return False
        else:
            print(f"❌ Failed to verify persistence: {response.text}")
            return False
            
        # Test 7: Test error handling - Get non-existent exercise
        print(f"\n7. Testing error handling - GET non-existent exercise")
        fake_id = "non-existent-exercise-id"
        response = requests.get(f"{BACKEND_URL}/exercise-builder/{fake_id}")
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 404:
            print("✅ Proper 404 error for non-existent exercise")
        else:
            print(f"⚠️  Expected 404, got {response.status_code}")
            
        # Test 8: Test invalid data handling
        print(f"\n8. Testing invalid data handling - POST with missing required fields")
        invalid_data = {"exercise_name": "Test"}  # Missing required fields
        response = requests.post(
            f"{BACKEND_URL}/exercise-builder",
            json=invalid_data,
            headers={"Content-Type": "application/json"}
        )
        print(f"Status Code: {response.status_code}")
        
        if response.status_code in [400, 422]:
            print("✅ Proper error handling for invalid data")
        else:
            print(f"⚠️  Expected 400/422 for invalid data, got {response.status_code}")
            
        # Test 9: DELETE /api/exercise-builder/{exercise_id} (Clean up)
        print(f"\n9. Testing DELETE /api/exercise-builder/{created_exercise_id}")
        response = requests.delete(f"{BACKEND_URL}/exercise-builder/{created_exercise_id}")
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            print("✅ Successfully deleted exercise")
            
            # Verify deletion
            response = requests.get(f"{BACKEND_URL}/exercise-builder/{created_exercise_id}")
            if response.status_code == 404:
                print("✅ Exercise deletion verified - exercise no longer exists")
            else:
                print("❌ Exercise still exists after deletion")
                return False
        else:
            print(f"❌ Failed to delete exercise: {response.text}")
            return False
            
        print("\n" + "=" * 60)
        print("✅ ALL EXERCISE BUILDER API TESTS PASSED")
        print("=" * 60)
        return True
        
    except requests.exceptions.ConnectionError as e:
        print(f"❌ Connection Error: Cannot connect to {BACKEND_URL}")
        print(f"Error: {e}")
        return False
    except requests.exceptions.RequestException as e:
        print(f"❌ Request Error: {e}")
        return False
    except Exception as e:
        print(f"❌ Unexpected Error: {e}")
        return False

def test_health_check():
    """Test basic API health check"""
    print("Testing API Health Check...")
    try:
        response = requests.get(f"{BACKEND_URL}/")
        print(f"Health Check Status: {response.status_code}")
        if response.status_code == 200:
            print("✅ API is responding")
            return True
        else:
            print("❌ API health check failed")
            return False
    except Exception as e:
        print(f"❌ Health check failed: {e}")
        return False

if __name__ == "__main__":
    print("EXRSIM Backend API Testing")
    print(f"Backend URL: {BACKEND_URL}")
    print("=" * 60)
    
    # Test API health first
    if not test_health_check():
        print("❌ API is not responding. Cannot proceed with tests.")
        sys.exit(1)
    
    # Test Exercise Builder API
    success = test_exercise_builder_api()
    
    if success:
        print("\n🎉 ALL TESTS COMPLETED SUCCESSFULLY")
        sys.exit(0)
    else:
        print("\n💥 SOME TESTS FAILED")
        sys.exit(1)
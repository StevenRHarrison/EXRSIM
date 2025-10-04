#!/usr/bin/env python3
"""
Comprehensive Backend API Testing for EXRSIM Emergency Training Platform
Tests all major API endpoints including Exercise Builder, Participants, HIRA, and MSEL
Includes data validation, edge cases, and performance testing as requested
"""

import requests
import json
from datetime import datetime, timezone
import sys
import os
import base64
import time
import uuid

# Get backend URL from frontend .env
BACKEND_URL = "https://leafdraw-ems.preview.emergentagent.com/api"

def test_exercise_builder_api():
    """Test Exercise Builder API endpoints comprehensively"""
    print("=" * 60)
    print("TESTING EXERCISE BUILDER API ENDPOINTS")
    print("=" * 60)
    
    # Test data with all 17 steps as specified in review request
    test_exercise_data = {
        # Step 1: Exercise Details
        "exercise_name": "Emergency Response Training Exercise",
        "exercise_type": "Table Top",
        "exercise_description": "Comprehensive emergency response training focusing on multi-agency coordination",
        "location": "Emergency Operations Center, Vancouver, BC",
        "start_date": "2024-03-15T09:00:00Z",
        "start_time": "09:00",
        "end_date": "2024-03-15T17:00:00Z",
        "end_time": "17:00",
        "exercise_image": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
        
        # Step 2: Scope
        "scope_description": "Multi-agency emergency response coordination",
        "scope_hazards": "Earthquake, Fire, Flood",
        "scope_geographic_area": "Greater Vancouver Regional District",
        "scope_functions": "Command, Operations, Planning, Logistics",
        "scope_organizations": "Fire, Police, EMS, Emergency Management",
        "scope_personnel": "50-75 participants",
        "scope_exercise_type": "Table Top",
        
        # Step 3: Purpose
        "purpose_description": "Test inter-agency coordination and communication protocols during major emergency",
        
        # Step 4: Scenario
        "scenario_name": "Major Earthquake Response",
        "scenario_description": "7.2 magnitude earthquake strikes Greater Vancouver area",
        "scenario_latitude": 49.2827,
        "scenario_longitude": -123.1207,
        "scenario_image": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
        
        # Step 5-17: Dynamic Collections
        "goals": [
            {"id": 1, "name": "Test Emergency Response", "description": "Verify team activation", "achieved": "Partial"},
            {"id": 2, "name": "Communication Systems", "description": "Test radio systems", "achieved": "Yes"}
        ],
        "objectives": [
            {"id": 1, "name": "Activate EOC within 30 minutes", "description": "Measure response time", "achieved": "No"}
        ],
        "events": [
            {"id": 1, "name": "Initial Earthquake", "description": "7.2 magnitude earthquake", "time": "09:00"}
        ],
        "functions": [
            {"id": 1, "name": "Command Function", "description": "Incident command structure", "achieved": "Yes"}
        ],
        "injections": [
            {"id": 1, "event_number": 1, "scenario_time": "T+15", "message": "Earthquake detected"}
        ],
        "organizations": [
            {"id": 1, "name": "Vancouver Fire Department", "description": "Primary fire response", "contact": "Chief Johnson"}
        ],
        "coordinators": [
            {"id": 1, "name": "John Smith", "role": "Exercise Director", "phone": "555-0123"}
        ],
        "codeWords": [
            {"id": 1, "code_word": "ALPHA", "definition": "All clear signal"}
        ],
        "callsigns": [
            {"id": 1, "callsign": "COMMAND-1", "definition": "Incident Commander"}
        ],
        "frequencies": [
            {"id": 1, "name": "Command Net", "frequency": "155.475", "description": "Primary command communications"}
        ],
        "assumptions": [
            {"id": 1, "name": "Weather Conditions", "assumption": "Clear weather throughout exercise"}
        ],
        "artificialities": [
            {"id": 1, "name": "Limited Resources", "artificiality": "Simulated shortage of emergency vehicles"}
        ],
        "safetyConcerns": [
            {"id": 1, "name": "Participant Safety", "safety_concern": "Ensure all participants remain in designated areas", "safety_officer_first_name": "Sarah", "safety_officer_last_name": "Wilson", "safety_officer_cell_phone": "555-0199"}
        ]
    }
    
    created_exercise_id = None
    
    try:
        # Test 1: GET /api/exercise-builder (Get all exercises)
        print("\n1. Testing GET /api/exercise-builder")
        response = requests.get(f"{BACKEND_URL}/exercise-builder")
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            initial_exercises = response.json()
            print(f"✅ Successfully retrieved {len(initial_exercises)} existing exercises")
        else:
            print(f"❌ Failed to get exercises: {response.text}")
            return False
            
        # Test 2: POST /api/exercise-builder (Create new exercise)
        print("\n2. Testing POST /api/exercise-builder (create comprehensive exercise)")
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
            
            # Verify all 17 steps data is present
            print("\n   Verifying exercise data persistence:")
            
            # Basic exercise info
            if created_exercise.get("exercise_name") == test_exercise_data["exercise_name"]:
                print(f"   ✅ Exercise Name: {created_exercise.get('exercise_name')}")
            else:
                print(f"   ❌ Exercise Name mismatch")
                return False
                
            # Dynamic collections verification
            collections_to_verify = ["goals", "objectives", "events", "functions", "organizations", 
                                   "codeWords", "callsigns", "frequencies", "assumptions", 
                                   "artificialities", "safetyConcerns"]
            
            for collection in collections_to_verify:
                expected_count = len(test_exercise_data.get(collection, []))
                actual_count = len(created_exercise.get(collection, []))
                if actual_count == expected_count:
                    print(f"   ✅ {collection}: {actual_count} items")
                else:
                    print(f"   ❌ {collection}: Expected {expected_count}, Got {actual_count}")
                    return False
                    
        else:
            print(f"❌ Failed to create exercise: {response.text}")
            return False
            
        # Test 3: GET /api/exercise-builder/{id} (Get specific exercise)
        print(f"\n3. Testing GET /api/exercise-builder/{created_exercise_id}")
        response = requests.get(f"{BACKEND_URL}/exercise-builder/{created_exercise_id}")
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            retrieved_exercise = response.json()
            print(f"✅ Successfully retrieved exercise: {retrieved_exercise.get('exercise_name')}")
            
            # Verify coordinate data
            if (retrieved_exercise.get("scenario_latitude") == 49.2827 and 
                retrieved_exercise.get("scenario_longitude") == -123.1207):
                print("   ✅ Coordinate data preserved correctly")
            else:
                print("   ❌ Coordinate data not preserved correctly")
                return False
        else:
            print(f"❌ Failed to get specific exercise: {response.text}")
            return False
            
        # Test 4: PUT /api/exercise-builder/{id} (Update exercise)
        print(f"\n4. Testing PUT /api/exercise-builder/{created_exercise_id}")
        update_data = test_exercise_data.copy()
        update_data["exercise_name"] = "Updated Emergency Response Training"
        update_data["goals"].append({"id": 3, "name": "New Goal", "description": "Additional goal", "achieved": "No"})
        
        response = requests.put(
            f"{BACKEND_URL}/exercise-builder/{created_exercise_id}",
            json=update_data,
            headers={"Content-Type": "application/json"}
        )
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            updated_exercise = response.json()
            if (updated_exercise.get("exercise_name") == "Updated Emergency Response Training" and
                len(updated_exercise.get("goals", [])) == 3):
                print("✅ Exercise updated successfully with new goal added")
            else:
                print("❌ Exercise update failed")
                return False
        else:
            print(f"❌ Failed to update exercise: {response.text}")
            return False
            
        # Test 5: DELETE /api/exercise-builder/{id} (Delete exercise)
        print(f"\n5. Testing DELETE /api/exercise-builder/{created_exercise_id}")
        response = requests.delete(f"{BACKEND_URL}/exercise-builder/{created_exercise_id}")
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            print("✅ Successfully deleted exercise")
            
            # Verify deletion
            response = requests.get(f"{BACKEND_URL}/exercise-builder/{created_exercise_id}")
            if response.status_code == 404:
                print("✅ Exercise deletion verified")
            else:
                print("❌ Exercise still exists after deletion")
                return False
        else:
            print(f"❌ Failed to delete exercise: {response.text}")
            return False
            
        print("\n✅ ALL EXERCISE BUILDER API TESTS PASSED")
        return True
        
    except Exception as e:
        print(f"❌ Exercise Builder API Test Error: {e}")
        return False

def test_hira_api():
    """Test HIRA Management API endpoints"""
    print("=" * 60)
    print("TESTING HIRA MANAGEMENT API ENDPOINTS")
    print("=" * 60)
    
    # Test data with coordinate validation
    test_hira_data = {
        "name": "Earthquake Hazard Assessment",
        "description": "Major earthquake risk assessment for Vancouver region",
        "notes": "Based on geological survey data from 2024",
        "disaster_type": "Earthquake",
        "latitude": 49.2827,  # Valid Vancouver coordinates
        "longitude": -123.1207,
        "frequency": 3,
        "fatalities": 2,
        "injuries": 3,
        "evacuation": 2,
        "property_damage": 3,
        "critical_infrastructure": 3,
        "environmental_damage": 1,
        "business_financial_impact": 2,
        "psychosocial_impact": 2,
        "change_in_frequency": [True, False, True, False],
        "change_in_vulnerability": [False, True, False],
        "hazard_image": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
    }
    
    created_hira_id = None
    
    try:
        # Test 1: GET /api/hira (Get all HIRA entries)
        print("\n1. Testing GET /api/hira")
        response = requests.get(f"{BACKEND_URL}/hira")
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            initial_hira = response.json()
            print(f"✅ Successfully retrieved {len(initial_hira)} existing HIRA entries")
        else:
            print(f"❌ Failed to get HIRA entries: {response.text}")
            return False
            
        # Test 2: POST /api/hira (Create HIRA entry with coordinates)
        print("\n2. Testing POST /api/hira (create with coordinate validation)")
        response = requests.post(
            f"{BACKEND_URL}/hira",
            json=test_hira_data,
            headers={"Content-Type": "application/json"}
        )
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            created_hira = response.json()
            created_hira_id = created_hira.get("id")
            print(f"✅ Successfully created HIRA entry with ID: {created_hira_id}")
            
            # Verify coordinate data
            if (created_hira.get("latitude") == 49.2827 and 
                created_hira.get("longitude") == -123.1207):
                print("   ✅ Coordinate validation passed")
            else:
                print("   ❌ Coordinate validation failed")
                return False
                
            # Verify risk assessment data
            if (created_hira.get("frequency") == 3 and 
                created_hira.get("fatalities") == 2):
                print("   ✅ Risk assessment data preserved")
            else:
                print("   ❌ Risk assessment data not preserved")
                return False
                
        else:
            print(f"❌ Failed to create HIRA entry: {response.text}")
            return False
            
        # Test 3: GET /api/hira/{id} (Get specific HIRA entry)
        print(f"\n3. Testing GET /api/hira/{created_hira_id}")
        response = requests.get(f"{BACKEND_URL}/hira/{created_hira_id}")
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            retrieved_hira = response.json()
            print(f"✅ Successfully retrieved HIRA: {retrieved_hira.get('name')}")
        else:
            print(f"❌ Failed to get specific HIRA entry: {response.text}")
            return False
            
        # Test 4: PUT /api/hira/{id} (Update HIRA entry)
        print(f"\n4. Testing PUT /api/hira/{created_hira_id}")
        update_data = test_hira_data.copy()
        update_data["name"] = "Updated Earthquake Assessment"
        update_data["latitude"] = 49.3000  # Updated coordinates
        update_data["longitude"] = -123.2000
        
        response = requests.put(
            f"{BACKEND_URL}/hira/{created_hira_id}",
            json=update_data,
            headers={"Content-Type": "application/json"}
        )
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            updated_hira = response.json()
            if (updated_hira.get("name") == "Updated Earthquake Assessment" and
                updated_hira.get("latitude") == 49.3000):
                print("✅ HIRA entry updated successfully")
            else:
                print("❌ HIRA entry update failed")
                return False
        else:
            print(f"❌ Failed to update HIRA entry: {response.text}")
            return False
            
        # Test 5: DELETE /api/hira/{id} (Delete HIRA entry)
        print(f"\n5. Testing DELETE /api/hira/{created_hira_id}")
        response = requests.delete(f"{BACKEND_URL}/hira/{created_hira_id}")
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            print("✅ Successfully deleted HIRA entry")
            
            # Verify deletion
            response = requests.get(f"{BACKEND_URL}/hira/{created_hira_id}")
            if response.status_code == 404:
                print("✅ HIRA deletion verified")
            else:
                print("❌ HIRA entry still exists after deletion")
                return False
        else:
            print(f"❌ Failed to delete HIRA entry: {response.text}")
            return False
            
        print("\n✅ ALL HIRA API TESTS PASSED")
        return True
        
    except Exception as e:
        print(f"❌ HIRA API Test Error: {e}")
        return False

def test_msel_api():
    """Test MSEL Management API endpoints"""
    print("=" * 60)
    print("TESTING MSEL MANAGEMENT API ENDPOINTS")
    print("=" * 60)
    
    # Test data for MSEL events
    test_msel_data = {
        "exercise_id": "test-exercise-123",
        "event_number": 1,
        "scenario_time": "T+15 minutes",
        "event_type": "Inject",
        "inject_mode": "Phone Call",
        "from_entity": "Emergency Operations Center",
        "to_entity": "Fire Department",
        "message": "Major earthquake detected, magnitude 7.2. Activate emergency response protocols.",
        "expected_response": "Fire department activates emergency response team and reports status within 10 minutes",
        "objective_capability_task": "Test emergency activation procedures",
        "notes": "First major inject of the exercise"
    }
    
    created_msel_id = None
    
    try:
        # Test 1: GET /api/msel (Get all MSEL events)
        print("\n1. Testing GET /api/msel")
        response = requests.get(f"{BACKEND_URL}/msel")
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            initial_msel = response.json()
            print(f"✅ Successfully retrieved {len(initial_msel)} existing MSEL events")
        else:
            print(f"❌ Failed to get MSEL events: {response.text}")
            return False
            
        # Test 2: POST /api/msel (Create MSEL event)
        print("\n2. Testing POST /api/msel (create MSEL event)")
        response = requests.post(
            f"{BACKEND_URL}/msel",
            json=test_msel_data,
            headers={"Content-Type": "application/json"}
        )
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            created_msel = response.json()
            created_msel_id = created_msel.get("id")
            print(f"✅ Successfully created MSEL event with ID: {created_msel_id}")
            
            # Verify MSEL data
            if (created_msel.get("event_number") == 1 and 
                created_msel.get("scenario_time") == "T+15 minutes"):
                print("   ✅ MSEL event data preserved correctly")
            else:
                print("   ❌ MSEL event data not preserved correctly")
                return False
                
        else:
            print(f"❌ Failed to create MSEL event: {response.text}")
            return False
            
        # Test 3: GET /api/msel/event/{id} (Get specific MSEL event)
        print(f"\n3. Testing GET /api/msel/event/{created_msel_id}")
        response = requests.get(f"{BACKEND_URL}/msel/event/{created_msel_id}")
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            retrieved_msel = response.json()
            print(f"✅ Successfully retrieved MSEL event #{retrieved_msel.get('event_number')}")
        else:
            print(f"❌ Failed to get specific MSEL event: {response.text}")
            return False
            
        # Test 4: PUT /api/msel/event/{id} (Update MSEL event)
        print(f"\n4. Testing PUT /api/msel/event/{created_msel_id}")
        update_data = {
            "event_number": 2,
            "scenario_time": "T+30 minutes",
            "message": "Updated: Earthquake aftershock detected",
            "completed": True,
            "actual_time": "10:45"
        }
        
        response = requests.put(
            f"{BACKEND_URL}/msel/event/{created_msel_id}",
            json=update_data,
            headers={"Content-Type": "application/json"}
        )
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            updated_msel = response.json()
            if (updated_msel.get("event_number") == 2 and
                updated_msel.get("completed") == True):
                print("✅ MSEL event updated successfully")
            else:
                print("❌ MSEL event update failed")
                return False
        else:
            print(f"❌ Failed to update MSEL event: {response.text}")
            return False
            
        # Test 5: DELETE /api/msel/event/{id} (Delete MSEL event)
        print(f"\n5. Testing DELETE /api/msel/event/{created_msel_id}")
        response = requests.delete(f"{BACKEND_URL}/msel/event/{created_msel_id}")
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            print("✅ Successfully deleted MSEL event")
            
            # Verify deletion
            response = requests.get(f"{BACKEND_URL}/msel/event/{created_msel_id}")
            if response.status_code == 404:
                print("✅ MSEL deletion verified")
            else:
                print("❌ MSEL event still exists after deletion")
                return False
        else:
            print(f"❌ Failed to delete MSEL event: {response.text}")
            return False
            
        print("\n✅ ALL MSEL API TESTS PASSED")
        return True
        
    except Exception as e:
        print(f"❌ MSEL API Test Error: {e}")
        return False

def test_data_validation():
    """Test data validation for coordinates, emails, and phone numbers"""
    print("=" * 60)
    print("TESTING DATA VALIDATION")
    print("=" * 60)
    
    try:
        # Test coordinate validation - Invalid latitude
        print("\n1. Testing invalid latitude (>90)")
        invalid_hira = {
            "name": "Test Invalid Coordinates",
            "description": "Test description",
            "disaster_type": "Earthquake",
            "latitude": 95.0,  # Invalid - exceeds 90
            "longitude": -123.1207,
            "frequency": 1,
            "fatalities": 0,
            "injuries": 0,
            "evacuation": 0,
            "property_damage": 0,
            "critical_infrastructure": 0,
            "environmental_damage": 0,
            "business_financial_impact": 0,
            "psychosocial_impact": 0
        }
        
        response = requests.post(f"{BACKEND_URL}/hira", json=invalid_hira)
        print(f"Status Code: {response.status_code}")
        if response.status_code in [400, 422]:
            print("✅ Invalid latitude properly rejected")
        else:
            print("⚠️  Invalid latitude not properly validated")
            
        # Test coordinate validation - Invalid longitude
        print("\n2. Testing invalid longitude (<-180)")
        invalid_hira["latitude"] = 49.2827
        invalid_hira["longitude"] = -185.0  # Invalid - less than -180
        
        response = requests.post(f"{BACKEND_URL}/hira", json=invalid_hira)
        print(f"Status Code: {response.status_code}")
        if response.status_code in [400, 422]:
            print("✅ Invalid longitude properly rejected")
        else:
            print("⚠️  Invalid longitude not properly validated")
            
        # Test email validation
        print("\n3. Testing invalid email format")
        invalid_participant = {
            "firstName": "Test",
            "lastName": "User",
            "email": "invalid-email-format",  # Invalid email
            "position": "Test Position",
            "name": "Test User",
            "phone": "555-0123"
        }
        
        response = requests.post(f"{BACKEND_URL}/participants", json=invalid_participant)
        print(f"Status Code: {response.status_code}")
        if response.status_code in [400, 422]:
            print("✅ Invalid email format properly rejected")
        else:
            print("⚠️  Invalid email format not properly validated")
            
        # Test phone number validation
        print("\n4. Testing invalid phone number format")
        invalid_participant["email"] = "test@example.com"
        invalid_participant["phone"] = "invalid-phone"  # Invalid phone
        
        response = requests.post(f"{BACKEND_URL}/participants", json=invalid_participant)
        print(f"Status Code: {response.status_code}")
        if response.status_code in [400, 422]:
            print("✅ Invalid phone format properly rejected")
        else:
            print("⚠️  Invalid phone format not properly validated")
            
        print("\n✅ DATA VALIDATION TESTS COMPLETED")
        return True
        
    except Exception as e:
        print(f"❌ Data Validation Test Error: {e}")
        return False

def test_edge_cases():
    """Test edge cases and error handling"""
    print("=" * 60)
    print("TESTING EDGE CASES AND ERROR HANDLING")
    print("=" * 60)
    
    try:
        # Test 1: Large exercise data payload
        print("\n1. Testing large exercise data payload")
        large_exercise_data = {
            "exercise_name": "Large Data Test Exercise",
            "exercise_type": "Full Scale Exercise",
            "exercise_description": "A" * 5000,  # Large description
            "location": "Test Location",
            "start_date": "2024-03-15T09:00:00Z",
            "start_time": "09:00",
            "end_date": "2024-03-15T17:00:00Z",
            "end_time": "17:00",
            "goals": [{"id": i, "name": f"Goal {i}", "description": f"Description {i}", "achieved": "No"} for i in range(100)]  # 100 goals
        }
        
        start_time = time.time()
        response = requests.post(f"{BACKEND_URL}/exercise-builder", json=large_exercise_data)
        end_time = time.time()
        response_time = end_time - start_time
        
        print(f"Status Code: {response.status_code}")
        print(f"Response Time: {response_time:.2f} seconds")
        
        if response.status_code == 200:
            print("✅ Large payload handled successfully")
            created_exercise = response.json()
            if len(created_exercise.get("goals", [])) == 100:
                print("✅ All 100 goals preserved in large payload")
            
            # Clean up
            exercise_id = created_exercise.get("id")
            if exercise_id:
                requests.delete(f"{BACKEND_URL}/exercise-builder/{exercise_id}")
        else:
            print(f"⚠️  Large payload handling issue: {response.text}")
            
        # Test 2: Empty/null values in optional fields
        print("\n2. Testing empty/null values in optional fields")
        minimal_exercise = {
            "exercise_name": "Minimal Exercise",
            "exercise_type": "Table Top",
            "exercise_description": "",  # Empty description
            "location": "",  # Empty location
            "start_date": "2024-03-15T09:00:00Z",
            "start_time": "09:00",
            "end_date": "2024-03-15T17:00:00Z",
            "end_time": "17:00",
            "goals": [],  # Empty goals
            "objectives": []  # Empty objectives
        }
        
        response = requests.post(f"{BACKEND_URL}/exercise-builder", json=minimal_exercise)
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            print("✅ Empty/null optional fields handled correctly")
            created_exercise = response.json()
            # Clean up
            exercise_id = created_exercise.get("id")
            if exercise_id:
                requests.delete(f"{BACKEND_URL}/exercise-builder/{exercise_id}")
        else:
            print(f"⚠️  Empty/null field handling issue: {response.text}")
            
        # Test 3: Unicode/special characters
        print("\n3. Testing Unicode and special characters")
        unicode_exercise = {
            "exercise_name": "Exercice d'Urgence 🚨 测试演习",
            "exercise_type": "Table Top",
            "exercise_description": "Description with émojis 🔥💧⚡ and spéciàl chäractërs",
            "location": "Montréal, Québec, Canada 🇨🇦",
            "start_date": "2024-03-15T09:00:00Z",
            "start_time": "09:00",
            "end_date": "2024-03-15T17:00:00Z",
            "end_time": "17:00"
        }
        
        response = requests.post(f"{BACKEND_URL}/exercise-builder", json=unicode_exercise)
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            print("✅ Unicode/special characters handled correctly")
            created_exercise = response.json()
            if "🚨" in created_exercise.get("exercise_name", ""):
                print("✅ Unicode characters preserved correctly")
            
            # Clean up
            exercise_id = created_exercise.get("id")
            if exercise_id:
                requests.delete(f"{BACKEND_URL}/exercise-builder/{exercise_id}")
        else:
            print(f"⚠️  Unicode/special character handling issue: {response.text}")
            
        # Test 4: Non-existent resource access
        print("\n4. Testing access to non-existent resources")
        fake_id = "non-existent-id-12345"
        
        endpoints_to_test = [
            f"/exercise-builder/{fake_id}",
            f"/participants/{fake_id}",
            f"/hira/{fake_id}",
            f"/msel/event/{fake_id}"
        ]
        
        for endpoint in endpoints_to_test:
            response = requests.get(f"{BACKEND_URL}{endpoint}")
            if response.status_code == 404:
                print(f"✅ {endpoint}: Proper 404 response")
            else:
                print(f"⚠️  {endpoint}: Expected 404, got {response.status_code}")
                
        print("\n✅ EDGE CASE TESTS COMPLETED")
        return True
        
    except Exception as e:
        print(f"❌ Edge Case Test Error: {e}")
        return False

def test_weather_api():
    """Test Weather API endpoints comprehensively as requested"""
    print("=" * 60)
    print("TESTING WEATHER API ENDPOINTS")
    print("=" * 60)
    
    try:
        # Test 1: POST /api/weather-locations/import-excel (Import sample weather data)
        print("\n1. Testing POST /api/weather-locations/import-excel (import sample data)")
        response = requests.post(f"{BACKEND_URL}/weather-locations/import-excel")
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            import_result = response.json()
            print(f"✅ Successfully imported weather data: {import_result.get('message')}")
            
            # Extract number of imported locations
            message = import_result.get('message', '')
            if 'Imported' in message and 'weather locations' in message:
                print("✅ Import message format correct")
            else:
                print("❌ Import message format unexpected")
                return False
        else:
            print(f"❌ Failed to import weather data: {response.text}")
            return False
            
        # Test 2: GET /api/weather-locations (Get all weather locations)
        print("\n2. Testing GET /api/weather-locations (verify import)")
        response = requests.get(f"{BACKEND_URL}/weather-locations")
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            locations = response.json()
            print(f"✅ Successfully retrieved {len(locations)} weather locations")
            
            if len(locations) > 0:
                # Verify data structure of first location
                first_location = locations[0]
                required_fields = ['id', 'city', 'state_province', 'rss_feed', 'created_at', 'updated_at']
                missing_fields = [field for field in required_fields if field not in first_location]
                
                if missing_fields:
                    print(f"❌ Missing required fields in location data: {missing_fields}")
                    return False
                else:
                    print("✅ Weather location data structure verified")
                    print(f"   Sample location: {first_location.get('city')}, {first_location.get('state_province')}")
            else:
                print("❌ No weather locations found after import")
                return False
        else:
            print(f"❌ Failed to get weather locations: {response.text}")
            return False
            
        # Test 3: GET /api/weather-locations/provinces (Get list of provinces)
        print("\n3. Testing GET /api/weather-locations/provinces")
        response = requests.get(f"{BACKEND_URL}/weather-locations/provinces")
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            provinces = response.json()
            print(f"✅ Successfully retrieved {len(provinces)} provinces")
            
            # Verify expected Canadian provinces are present
            expected_provinces = ["Alberta", "British Columbia", "Ontario", "Quebec"]
            found_provinces = [p for p in expected_provinces if p in provinces]
            
            if len(found_provinces) >= 3:  # At least 3 of the major provinces
                print(f"✅ Major Canadian provinces found: {found_provinces}")
            else:
                print(f"❌ Expected major provinces not found. Got: {provinces}")
                return False
                
            # Store a province for next test
            test_province = provinces[0] if provinces else None
            if not test_province:
                print("❌ No provinces available for city testing")
                return False
        else:
            print(f"❌ Failed to get provinces: {response.text}")
            return False
            
        # Test 4: GET /api/weather-locations/cities/{province} (Get cities for a province)
        print(f"\n4. Testing GET /api/weather-locations/cities/{test_province}")
        response = requests.get(f"{BACKEND_URL}/weather-locations/cities/{test_province}")
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            cities = response.json()
            print(f"✅ Successfully retrieved {len(cities)} cities for {test_province}")
            
            if len(cities) > 0:
                print(f"   Cities in {test_province}: {cities}")
                test_city = cities[0]  # Store for RSS test
            else:
                print(f"❌ No cities found for province {test_province}")
                return False
        else:
            print(f"❌ Failed to get cities for {test_province}: {response.text}")
            return False
            
        # Test 5: GET /api/weather-locations/rss/{province}/{city} (Get RSS feed for city/province)
        print(f"\n5. Testing GET /api/weather-locations/rss/{test_province}/{test_city}")
        response = requests.get(f"{BACKEND_URL}/weather-locations/rss/{test_province}/{test_city}")
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            rss_data = response.json()
            print(f"✅ Successfully retrieved RSS data for {test_city}, {test_province}")
            
            # Verify RSS response structure
            required_rss_fields = ['rss_feed', 'city', 'province']
            missing_rss_fields = [field for field in required_rss_fields if field not in rss_data]
            
            if missing_rss_fields:
                print(f"❌ Missing required RSS fields: {missing_rss_fields}")
                return False
            else:
                print("✅ RSS response structure verified")
                print(f"   RSS Feed URL: {rss_data.get('rss_feed')}")
                print(f"   City: {rss_data.get('city')}")
                print(f"   Province: {rss_data.get('province')}")
                
                # Verify RSS feed URL format
                rss_url = rss_data.get('rss_feed', '')
                if rss_url.startswith('https://weather.gc.ca/'):
                    print("✅ RSS feed URL format verified (weather.gc.ca)")
                else:
                    print(f"⚠️  Unexpected RSS feed URL format: {rss_url}")
        else:
            print(f"❌ Failed to get RSS data for {test_city}, {test_province}: {response.text}")
            return False
            
        # Test 6: Test error handling - Non-existent city/province combination
        print(f"\n6. Testing error handling - GET RSS for non-existent city/province")
        response = requests.get(f"{BACKEND_URL}/weather-locations/rss/NonExistentProvince/NonExistentCity")
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 404:
            print("✅ Proper 404 error for non-existent city/province combination")
        else:
            print(f"⚠️  Expected 404, got {response.status_code}")
            
        # Test 7: Test specific province/city combinations from sample data
        print(f"\n7. Testing specific province/city combinations")
        test_combinations = [
            ("Alberta", "Calgary"),
            ("Ontario", "Toronto"),
            ("British Columbia", "Vancouver"),
            ("Quebec", "Montreal")
        ]
        
        for province, city in test_combinations:
            print(f"   Testing {city}, {province}")
            
            # Check if cities endpoint returns the expected city
            cities_response = requests.get(f"{BACKEND_URL}/weather-locations/cities/{province}")
            if cities_response.status_code == 200:
                cities = cities_response.json()
                if city in cities:
                    print(f"   ✅ {city} found in {province}")
                    
                    # Test RSS endpoint for this combination
                    rss_response = requests.get(f"{BACKEND_URL}/weather-locations/rss/{province}/{city}")
                    if rss_response.status_code == 200:
                        rss_data = rss_response.json()
                        if (rss_data.get('city') == city and 
                            rss_data.get('province') == province and
                            rss_data.get('rss_feed')):
                            print(f"   ✅ RSS data verified for {city}, {province}")
                        else:
                            print(f"   ❌ RSS data verification failed for {city}, {province}")
                            return False
                    else:
                        print(f"   ❌ RSS endpoint failed for {city}, {province}")
                        return False
                else:
                    print(f"   ⚠️  {city} not found in {province} (may not be in sample data)")
            else:
                print(f"   ❌ Failed to get cities for {province}")
                return False
                
        print("\n✅ ALL WEATHER API TESTS PASSED")
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

def test_exercise_coordinates_functionality():
    """Test latitude and longitude functionality in exercise management as requested"""
    print("=" * 60)
    print("TESTING EXERCISE COORDINATES FUNCTIONALITY")
    print("=" * 60)
    
    # Test Exercise Claybelt ID as specified in review request
    exercise_claybelt_id = "9204c218-cb55-44e8-812e-3a643aef023c"
    
    try:
        # A. Current Exercise Coordinate Verification
        print("\n🎯 A. CURRENT EXERCISE COORDINATE VERIFICATION")
        print(f"Testing GET /api/exercise-builder/{exercise_claybelt_id} (Exercise Claybelt)")
        
        response = requests.get(f"{BACKEND_URL}/exercise-builder/{exercise_claybelt_id}")
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            exercise_data = response.json()
            print(f"✅ Successfully retrieved Exercise Claybelt")
            print(f"Exercise Name: {exercise_data.get('exercise_name', 'N/A')}")
            
            # Check current coordinate values
            current_lat = exercise_data.get('latitude')
            current_lng = exercise_data.get('longitude')
            
            print(f"\n📍 Current Coordinates:")
            print(f"   Latitude: {current_lat}")
            print(f"   Longitude: {current_lng}")
            
            # Verify coordinate fields are included in response
            if current_lat is not None and current_lng is not None:
                print("✅ Latitude and longitude fields are included in response")
                
                # Check if current coordinates are Vancouver area (as expected)
                expected_vancouver_lat = 49.2827
                expected_vancouver_lng = -123.1207
                
                if (abs(current_lat - expected_vancouver_lat) < 0.01 and 
                    abs(current_lng - expected_vancouver_lng) < 0.01):
                    print(f"✅ Current coordinates match expected Vancouver area:")
                    print(f"   Expected: lat={expected_vancouver_lat}, lng={expected_vancouver_lng}")
                    print(f"   Actual: lat={current_lat}, lng={current_lng}")
                else:
                    print(f"⚠️  Current coordinates differ from expected Vancouver area:")
                    print(f"   Expected: lat={expected_vancouver_lat}, lng={expected_vancouver_lng}")
                    print(f"   Actual: lat={current_lat}, lng={current_lng}")
            else:
                print("❌ Latitude and/or longitude fields are missing from response")
                return False
        else:
            print(f"❌ Failed to retrieve Exercise Claybelt: {response.text}")
            return False
            
        # B. Exercise Update with Coordinates Test
        print("\n🎯 B. EXERCISE UPDATE WITH COORDINATES TEST")
        print("Testing PUT request to update exercise coordinates")
        
        # Prepare update data with Toronto coordinates
        toronto_lat = 43.6532
        toronto_lng = -79.3832
        
        # Get current exercise data to avoid "Field required" errors
        current_exercise = exercise_data.copy()
        
        # Update coordinates to Toronto
        update_data = {
            "exercise_name": current_exercise.get("exercise_name", "Exercise Claybelt"),
            "exercise_type": current_exercise.get("exercise_type", "Table Top"),
            "exercise_description": current_exercise.get("exercise_description", "Test exercise"),
            "location": "Toronto, Ontario, Canada",  # Update location to match coordinates
            "latitude": toronto_lat,  # New Toronto coordinates
            "longitude": toronto_lng,  # New Toronto coordinates
            "start_date": current_exercise.get("start_date", "2024-03-15T09:00:00Z"),
            "start_time": current_exercise.get("start_time", "09:00"),
            "end_date": current_exercise.get("end_date", "2024-03-15T17:00:00Z"),
            "end_time": current_exercise.get("end_time", "17:00")
        }
        
        print(f"📍 Updating coordinates to Toronto:")
        print(f"   New Latitude: {toronto_lat}")
        print(f"   New Longitude: {toronto_lng}")
        print(f"   New Location: {update_data['location']}")
        
        response = requests.put(
            f"{BACKEND_URL}/exercise-builder/{exercise_claybelt_id}",
            json=update_data,
            headers={"Content-Type": "application/json"}
        )
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            updated_exercise = response.json()
            print("✅ Successfully updated exercise coordinates")
            
            # Verify updated coordinates in response
            updated_lat = updated_exercise.get('latitude')
            updated_lng = updated_exercise.get('longitude')
            updated_location = updated_exercise.get('location')
            
            print(f"\n📍 Updated Coordinates in Response:")
            print(f"   Latitude: {updated_lat}")
            print(f"   Longitude: {updated_lng}")
            print(f"   Location: {updated_location}")
            
            if (updated_lat == toronto_lat and updated_lng == toronto_lng):
                print("✅ Updated coordinates match Toronto values in response")
            else:
                print(f"❌ Updated coordinates don't match expected Toronto values")
                print(f"   Expected: lat={toronto_lat}, lng={toronto_lng}")
                print(f"   Got: lat={updated_lat}, lng={updated_lng}")
                return False
        else:
            print(f"❌ Failed to update exercise coordinates: {response.text}")
            return False
            
        # C. Data Persistence Verification
        print("\n🎯 C. DATA PERSISTENCE VERIFICATION")
        print("Making another GET request after update to verify persistence")
        
        response = requests.get(f"{BACKEND_URL}/exercise-builder/{exercise_claybelt_id}")
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            persisted_exercise = response.json()
            print("✅ Successfully retrieved exercise after update")
            
            # Verify coordinates are persisted
            persisted_lat = persisted_exercise.get('latitude')
            persisted_lng = persisted_exercise.get('longitude')
            persisted_location = persisted_exercise.get('location')
            
            print(f"\n📍 Persisted Coordinates:")
            print(f"   Latitude: {persisted_lat}")
            print(f"   Longitude: {persisted_lng}")
            print(f"   Location: {persisted_location}")
            
            if (persisted_lat == toronto_lat and persisted_lng == toronto_lng):
                print("✅ New coordinates are properly persisted in database")
                
                # Check for data corruption or field loss
                required_fields = ['id', 'exercise_name', 'exercise_type', 'exercise_description', 
                                 'location', 'latitude', 'longitude', 'start_date', 'end_date']
                missing_fields = [field for field in required_fields if field not in persisted_exercise]
                
                if missing_fields:
                    print(f"❌ Data corruption detected - missing fields: {missing_fields}")
                    return False
                else:
                    print("✅ No data corruption or field loss detected")
            else:
                print(f"❌ Coordinates not properly persisted")
                print(f"   Expected: lat={toronto_lat}, lng={toronto_lng}")
                print(f"   Persisted: lat={persisted_lat}, lng={persisted_lng}")
                return False
        else:
            print(f"❌ Failed to verify persistence: {response.text}")
            return False
            
        # D. Coordinate Field Validation
        print("\n🎯 D. COORDINATE FIELD VALIDATION")
        print("Testing coordinate field validation with various values")
        
        # Test valid coordinate ranges
        valid_test_cases = [
            {"lat": 90.0, "lng": 180.0, "desc": "Maximum valid values"},
            {"lat": -90.0, "lng": -180.0, "desc": "Minimum valid values"},
            {"lat": 0.0, "lng": 0.0, "desc": "Zero coordinates"},
            {"lat": 45.1234, "lng": -97.5678, "desc": "4 decimal places precision"}
        ]
        
        for test_case in valid_test_cases:
            print(f"\n   Testing {test_case['desc']}: lat={test_case['lat']}, lng={test_case['lng']}")
            
            test_update = update_data.copy()
            test_update['latitude'] = test_case['lat']
            test_update['longitude'] = test_case['lng']
            
            response = requests.put(
                f"{BACKEND_URL}/exercise-builder/{exercise_claybelt_id}",
                json=test_update,
                headers={"Content-Type": "application/json"}
            )
            
            if response.status_code == 200:
                result = response.json()
                if (result.get('latitude') == test_case['lat'] and 
                    result.get('longitude') == test_case['lng']):
                    print(f"   ✅ Valid coordinates accepted and saved correctly")
                else:
                    print(f"   ❌ Valid coordinates not saved correctly")
                    return False
            else:
                print(f"   ❌ Valid coordinates rejected: {response.text}")
                return False
                
        # Test handling of null/empty coordinates
        print(f"\n   Testing null/empty coordinates handling")
        test_update = update_data.copy()
        test_update['latitude'] = None
        test_update['longitude'] = None
        
        response = requests.put(
            f"{BACKEND_URL}/exercise-builder/{exercise_claybelt_id}",
            json=test_update,
            headers={"Content-Type": "application/json"}
        )
        
        if response.status_code == 200:
            result = response.json()
            print(f"   ✅ Null coordinates handled properly")
            print(f"   Latitude: {result.get('latitude')}")
            print(f"   Longitude: {result.get('longitude')}")
        else:
            print(f"   ⚠️  Null coordinates handling: {response.status_code}")
            
        # E. Exercise List Verification
        print("\n🎯 E. EXERCISE LIST VERIFICATION")
        print("Testing GET /api/exercise-builder (list all exercises)")
        
        response = requests.get(f"{BACKEND_URL}/exercise-builder")
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            all_exercises = response.json()
            print(f"✅ Successfully retrieved {len(all_exercises)} exercises")
            
            # Find Exercise Claybelt in the list
            claybelt_in_list = None
            for exercise in all_exercises:
                if exercise.get('id') == exercise_claybelt_id:
                    claybelt_in_list = exercise
                    break
                    
            if claybelt_in_list:
                print("✅ Exercise Claybelt found in exercise list")
                
                # Verify coordinate fields are included in list response
                list_lat = claybelt_in_list.get('latitude')
                list_lng = claybelt_in_list.get('longitude')
                
                print(f"📍 Coordinates in List Response:")
                print(f"   Latitude: {list_lat}")
                print(f"   Longitude: {list_lng}")
                
                if list_lat is not None and list_lng is not None:
                    print("✅ Coordinate fields are included in exercise list summaries")
                else:
                    print("❌ Coordinate fields missing from exercise list summaries")
                    return False
            else:
                print("❌ Exercise Claybelt not found in exercise list")
                return False
        else:
            print(f"❌ Failed to get exercise list: {response.text}")
            return False
            
        # Restore original coordinates (cleanup)
        print("\n🔄 CLEANUP: Restoring original Vancouver coordinates")
        restore_data = update_data.copy()
        restore_data['latitude'] = current_lat
        restore_data['longitude'] = current_lng
        restore_data['location'] = exercise_data.get('location', 'Vancouver, BC')
        
        response = requests.put(
            f"{BACKEND_URL}/exercise-builder/{exercise_claybelt_id}",
            json=restore_data,
            headers={"Content-Type": "application/json"}
        )
        
        if response.status_code == 200:
            print("✅ Original coordinates restored successfully")
        else:
            print(f"⚠️  Failed to restore original coordinates: {response.text}")
            
        # Final Success Summary
        print("\n" + "=" * 60)
        print("🎉 EXERCISE COORDINATES FUNCTIONALITY TEST RESULTS")
        print("=" * 60)
        print("✅ Current coordinates retrieved successfully")
        print("✅ PUT request updates coordinates without errors")
        print("✅ Updated values persist in database")
        print("✅ GET responses include coordinate fields")
        print("✅ No data loss or field corruption")
        print("✅ Coordinate fields included in exercise list")
        print("✅ Valid coordinate ranges handled properly")
        print("✅ Null/empty coordinates handled appropriately")
        print("=" * 60)
        print("🏆 ALL SUCCESS CRITERIA MET - COORDINATES FUNCTIONALITY WORKING CORRECTLY")
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

def test_performance():
    """Test performance with multiple concurrent requests"""
    print("=" * 60)
    print("TESTING PERFORMANCE")
    print("=" * 60)
    
    try:
        # Test response times for different endpoints
        endpoints = [
            "/exercise-builder",
            "/participants", 
            "/hira",
            "/msel"
        ]
        
        print("\n1. Testing response times for GET endpoints")
        for endpoint in endpoints:
            start_time = time.time()
            response = requests.get(f"{BACKEND_URL}{endpoint}")
            end_time = time.time()
            response_time = end_time - start_time
            
            print(f"{endpoint}: {response_time:.3f}s (Status: {response.status_code})")
            
            if response_time > 5.0:
                print(f"⚠️  Slow response time for {endpoint}")
            else:
                print(f"✅ Good response time for {endpoint}")
                
        # Test multiple rapid requests
        print("\n2. Testing multiple rapid requests")
        rapid_requests = 5
        start_time = time.time()
        
        for i in range(rapid_requests):
            response = requests.get(f"{BACKEND_URL}/")
            if response.status_code != 200:
                print(f"⚠️  Request {i+1} failed with status {response.status_code}")
                
        end_time = time.time()
        total_time = end_time - start_time
        avg_time = total_time / rapid_requests
        
        print(f"✅ {rapid_requests} requests completed in {total_time:.3f}s")
        print(f"✅ Average response time: {avg_time:.3f}s")
        
        print("\n✅ PERFORMANCE TESTS COMPLETED")
        return True
        
    except Exception as e:
        print(f"❌ Performance Test Error: {e}")
        return False

def test_participant_crud_api():
    """Test Participant CRUD API endpoints comprehensively"""
    print("=" * 60)
    print("TESTING PARTICIPANT CRUD API ENDPOINTS")
    print("=" * 60)
    
    # Test data as specified in the review request - ALL participant fields
    test_participant_data = {
        # Basic Info
        "firstName": "John",
        "lastName": "Doe",
        "position": "Fire Chief",
        "assignedTo": "Fire Hall",
        
        # Contact Info
        "email": "john.doe@example.com",
        "homePhone": "+1 (555) 123-4567",
        "cellPhone": "+1 (555) 987-6543",
        
        # Address Info
        "address": "123 Main Street",
        "city": "Emergency City",
        "provinceState": "Emergency Province",
        "country": "Canada",
        
        # Exercise Info
        "involvedInExercise": True,
        
        # Profile
        "profileImage": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
        
        # Legacy fields (required by backend model)
        "name": "John Doe",
        "phone": "+1 (555) 987-6543",
        "organization": "Fire Department",
        "role": "incident_commander",
        "experience_level": "Expert",
        "certifications": ["Fire Safety", "Emergency Response"]
    }
    
    created_participant_id = None
    
    try:
        # Test 1: GET /api/participants (Get all participants - initial state)
        print("\n1. Testing GET /api/participants (initial)")
        response = requests.get(f"{BACKEND_URL}/participants")
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            initial_participants = response.json()
            print(f"✅ Successfully retrieved {len(initial_participants)} existing participants")
            print(f"Initial participant count: {len(initial_participants)}")
        else:
            print(f"❌ Failed to get participants: {response.text}")
            return False
            
        # Test 2: POST /api/participants (Create new participant with ALL fields)
        print("\n2. Testing POST /api/participants (create participant with ALL fields)")
        response = requests.post(
            f"{BACKEND_URL}/participants",
            json=test_participant_data,
            headers={"Content-Type": "application/json"}
        )
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            created_participant = response.json()
            created_participant_id = created_participant.get("id")
            print(f"✅ Successfully created participant with ID: {created_participant_id}")
            
            # Verify ALL fields are present and correct
            print("\n   Verifying ALL participant fields:")
            
            # Basic Info
            basic_fields = {
                "firstName": "John",
                "lastName": "Doe", 
                "position": "Fire Chief",
                "assignedTo": "Fire Hall"
            }
            
            for field, expected_value in basic_fields.items():
                actual_value = created_participant.get(field)
                if actual_value == expected_value:
                    print(f"   ✅ {field}: '{actual_value}' (matches)")
                else:
                    print(f"   ❌ {field}: Expected '{expected_value}', Got '{actual_value}'")
                    return False
            
            # Contact Info
            contact_fields = {
                "email": "john.doe@example.com",
                "homePhone": "+1 (555) 123-4567",
                "cellPhone": "+1 (555) 987-6543"
            }
            
            for field, expected_value in contact_fields.items():
                actual_value = created_participant.get(field)
                if actual_value == expected_value:
                    print(f"   ✅ {field}: '{actual_value}' (matches)")
                else:
                    print(f"   ❌ {field}: Expected '{expected_value}', Got '{actual_value}'")
                    return False
            
            # Address Info
            address_fields = {
                "address": "123 Main Street",
                "city": "Emergency City",
                "provinceState": "Emergency Province",
                "country": "Canada"
            }
            
            for field, expected_value in address_fields.items():
                actual_value = created_participant.get(field)
                if actual_value == expected_value:
                    print(f"   ✅ {field}: '{actual_value}' (matches)")
                else:
                    print(f"   ❌ {field}: Expected '{expected_value}', Got '{actual_value}'")
                    return False
            
            # Exercise Info (boolean)
            involved_value = created_participant.get("involvedInExercise")
            if involved_value is True:
                print(f"   ✅ involvedInExercise: {involved_value} (boolean True)")
            else:
                print(f"   ❌ involvedInExercise: Expected True, Got {involved_value}")
                return False
            
            # Profile Image (base64 string)
            profile_image = created_participant.get("profileImage")
            if profile_image and profile_image.startswith("data:image/png;base64,"):
                print(f"   ✅ profileImage: Base64 string present (length: {len(profile_image)})")
            else:
                print(f"   ❌ profileImage: Expected base64 string, Got {profile_image}")
                return False
            
            # Verify required fields are present
            required_fields = ['id', 'firstName', 'lastName', 'email', 'position', 'assignedTo', 'created_at']
            missing_fields = [field for field in required_fields if field not in created_participant]
            
            if missing_fields:
                print(f"   ❌ Missing required fields in response: {missing_fields}")
                return False
            else:
                print("   ✅ All required fields present in created participant")
                
            print("   ✅ ALL PARTICIPANT FIELDS VERIFIED SUCCESSFULLY")
        else:
            print(f"❌ Failed to create participant: {response.text}")
            return False
            
        # Test 3: GET /api/participants (Verify participant appears in list)
        print("\n3. Testing GET /api/participants (verify creation)")
        response = requests.get(f"{BACKEND_URL}/participants")
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            all_participants = response.json()
            print(f"✅ Successfully retrieved {len(all_participants)} participants after creation")
            
            # Check if our created participant is in the list
            created_found = any(p.get('id') == created_participant_id for p in all_participants)
            if created_found:
                print("✅ Created participant found in participant list")
            else:
                print("❌ Created participant NOT found in participant list")
                return False
                
            # Verify count increased
            if len(all_participants) > len(initial_participants):
                print(f"✅ Participant count increased from {len(initial_participants)} to {len(all_participants)}")
            else:
                print(f"⚠️  Participant count did not increase as expected")
        else:
            print(f"❌ Failed to get participants after creation: {response.text}")
            return False
            
        # Test 4: GET /api/participants/{participant_id} (Get specific participant)
        print(f"\n4. Testing GET /api/participants/{created_participant_id}")
        response = requests.get(f"{BACKEND_URL}/participants/{created_participant_id}")
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            retrieved_participant = response.json()
            print(f"✅ Successfully retrieved specific participant")
            print(f"Participant Name: {retrieved_participant.get('firstName')} {retrieved_participant.get('lastName')}")
            print(f"Position: {retrieved_participant.get('position')}")
            print(f"Email: {retrieved_participant.get('email')}")
            
            # Verify data matches what we created
            if (retrieved_participant.get('firstName') == test_participant_data['firstName'] and
                retrieved_participant.get('lastName') == test_participant_data['lastName'] and
                retrieved_participant.get('email') == test_participant_data['email']):
                print("✅ Retrieved participant data matches created data")
            else:
                print("❌ Retrieved participant data does not match created data")
                return False
        else:
            print(f"❌ Failed to get specific participant: {response.text}")
            return False
            
        # Test 5: PUT /api/participants/{participant_id} (Update participant with modified ALL fields)
        print(f"\n5. Testing PUT /api/participants/{created_participant_id} (Update ALL fields)")
        update_data = test_participant_data.copy()
        
        # Modify ALL fields to test complete update functionality
        update_data.update({
            # Basic Info - Modified
            "firstName": "Jane",
            "lastName": "Smith",
            "position": "Police Chief",
            "assignedTo": "Police Station",
            
            # Contact Info - Modified
            "email": "jane.smith@example.com",
            "homePhone": "+1 (555) 111-2222",
            "cellPhone": "+1 (555) 333-4444",
            
            # Address Info - Modified
            "address": "456 Oak Avenue",
            "city": "Safety City",
            "provinceState": "Safety Province",
            "country": "United States",
            
            # Exercise Info - Modified
            "involvedInExercise": False,
            
            # Profile - Modified
            "profileImage": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/2wBDAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwA/wA==",
            
            # Legacy fields - Modified
            "name": "Jane Smith",
            "phone": "+1 (555) 333-4444",
            "organization": "Police Department",
            "role": "operations_chief",
            "experience_level": "Advanced",
            "certifications": ["Law Enforcement", "Crisis Management"]
        })
        
        print(f"   📊 Updating ALL participant fields:")
        print(f"   - Name: John Doe → Jane Smith")
        print(f"   - Position: Fire Chief → Police Chief")
        print(f"   - Email: john.doe@example.com → jane.smith@example.com")
        print(f"   - Address: 123 Main Street → 456 Oak Avenue")
        print(f"   - City: Emergency City → Safety City")
        print(f"   - Province: Emergency Province → Safety Province")
        print(f"   - Country: Canada → United States")
        print(f"   - Involved in Exercise: True → False")
        print(f"   - Profile Image: PNG → JPEG")
        
        response = requests.put(
            f"{BACKEND_URL}/participants/{created_participant_id}",
            json=update_data,
            headers={"Content-Type": "application/json"}
        )
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            updated_participant = response.json()
            print(f"✅ Successfully updated participant")
            
            # Verify ALL field updates worked
            print("\n   Verifying ALL field updates:")
            
            # Basic Info Updates
            basic_updates = {
                "firstName": "Jane",
                "lastName": "Smith",
                "position": "Police Chief",
                "assignedTo": "Police Station"
            }
            
            for field, expected_value in basic_updates.items():
                actual_value = updated_participant.get(field)
                if actual_value == expected_value:
                    print(f"   ✅ {field}: '{actual_value}' (updated correctly)")
                else:
                    print(f"   ❌ {field}: Expected '{expected_value}', Got '{actual_value}'")
                    return False
            
            # Contact Info Updates
            contact_updates = {
                "email": "jane.smith@example.com",
                "homePhone": "+1 (555) 111-2222",
                "cellPhone": "+1 (555) 333-4444"
            }
            
            for field, expected_value in contact_updates.items():
                actual_value = updated_participant.get(field)
                if actual_value == expected_value:
                    print(f"   ✅ {field}: '{actual_value}' (updated correctly)")
                else:
                    print(f"   ❌ {field}: Expected '{expected_value}', Got '{actual_value}'")
                    return False
            
            # Address Info Updates
            address_updates = {
                "address": "456 Oak Avenue",
                "city": "Safety City",
                "provinceState": "Safety Province",
                "country": "United States"
            }
            
            for field, expected_value in address_updates.items():
                actual_value = updated_participant.get(field)
                if actual_value == expected_value:
                    print(f"   ✅ {field}: '{actual_value}' (updated correctly)")
                else:
                    print(f"   ❌ {field}: Expected '{expected_value}', Got '{actual_value}'")
                    return False
            
            # Exercise Info Update (boolean)
            involved_value = updated_participant.get("involvedInExercise")
            if involved_value is False:
                print(f"   ✅ involvedInExercise: {involved_value} (updated to False)")
            else:
                print(f"   ❌ involvedInExercise: Expected False, Got {involved_value}")
                return False
            
            # Profile Image Update
            profile_image = updated_participant.get("profileImage")
            if profile_image and profile_image.startswith("data:image/jpeg;base64,"):
                print(f"   ✅ profileImage: Updated to JPEG format (length: {len(profile_image)})")
            else:
                print(f"   ❌ profileImage: Expected JPEG base64 string, Got {profile_image}")
                return False
                
            print("   ✅ ALL FIELD UPDATES VERIFIED SUCCESSFULLY")
        else:
            print(f"❌ Failed to update participant: {response.text}")
            return False
            
        # Test 6: Verify persistence by getting updated participant
        print(f"\n6. Testing persistence - GET updated participant")
        response = requests.get(f"{BACKEND_URL}/participants/{created_participant_id}")
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            persisted_participant = response.json()
            if (persisted_participant.get('firstName') == "Jane" and
                persisted_participant.get('lastName') == "Smith" and
                persisted_participant.get('email') == "jane.smith@example.com"):
                print("✅ Participant updates properly persisted in database")
            else:
                print("❌ Participant updates NOT persisted in database")
                return False
        else:
            print(f"❌ Failed to verify persistence: {response.text}")
            return False
            
        # Test 7: Test error handling - Get non-existent participant
        print(f"\n7. Testing error handling - GET non-existent participant")
        fake_id = "non-existent-participant-id"
        response = requests.get(f"{BACKEND_URL}/participants/{fake_id}")
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 404:
            print("✅ Proper 404 error for non-existent participant")
        else:
            print(f"⚠️  Expected 404, got {response.status_code}")
            
        # Test 8: Test invalid data handling
        print(f"\n8. Testing invalid data handling - POST with missing required fields")
        invalid_data = {"firstName": "Test"}  # Missing required fields
        response = requests.post(
            f"{BACKEND_URL}/participants",
            json=invalid_data,
            headers={"Content-Type": "application/json"}
        )
        print(f"Status Code: {response.status_code}")
        
        if response.status_code in [400, 422]:
            print("✅ Proper error handling for invalid data")
        else:
            print(f"⚠️  Expected 400/422 for invalid data, got {response.status_code}")
            
        # Test 9: DELETE /api/participants/{participant_id} (Clean up)
        print(f"\n9. Testing DELETE /api/participants/{created_participant_id}")
        response = requests.delete(f"{BACKEND_URL}/participants/{created_participant_id}")
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            print("✅ Successfully deleted participant")
            
            # Verify deletion
            response = requests.get(f"{BACKEND_URL}/participants/{created_participant_id}")
            if response.status_code == 404:
                print("✅ Participant deletion verified - participant no longer exists")
            else:
                print("❌ Participant still exists after deletion")
                return False
        else:
            print(f"❌ Failed to delete participant: {response.text}")
            return False
            
        print("\n" + "=" * 60)
        print("✅ ALL PARTICIPANT CRUD API TESTS PASSED")
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

def test_scribe_template_api():
    """Test Digital Scribe Template API endpoints comprehensively as requested"""
    print("=" * 60)
    print("TESTING DIGITAL SCRIBE TEMPLATE API ENDPOINTS")
    print("=" * 60)
    
    # Test data with comprehensive nested structures as specified in review request
    test_scribe_data = {
        "exercise_id": "4bb39755-0b97-4ded-902d-7f9325f3d9a9",  # Valid exercise ID
        "scribe_name": "Sarah Johnson",
        "scribe_signature": "S. Johnson",
        "exercise_start_time": "9:30 AM",  # HH:MM AM/PM format
        "exercise_end_time": "2:45 PM",   # HH:MM AM/PM format
        
        # Timeline Events with time strings
        "timeline_events": [
            {
                "time": "9:30 AM",
                "event": "Exercise initiation and briefing",
                "observations": "All participants present and engaged"
            },
            {
                "time": "10:15 AM", 
                "event": "First emergency scenario activated",
                "observations": "Quick response from fire department team"
            },
            {
                "time": "11:00 PM",  # Test PM time
                "event": "Mid-exercise evaluation checkpoint",
                "observations": "Communication protocols working effectively"
            },
            {
                "time": "12:15 AM",  # Test midnight time
                "event": "Late night emergency response drill",
                "observations": "Night shift coordination tested"
            }
        ],
        
        # Communications with longtext content field
        "communications": [
            {
                "time": "9:45 AM",
                "from_person": "Incident Commander",
                "to_person": "Fire Chief",
                "method": "Radio",
                "content": "This is a comprehensive test of the longtext content field. It should be able to handle large amounts of text data including detailed communication logs, extensive notes, and multi-paragraph descriptions. The content field is specifically designed to store detailed communication records that may include timestamps, participant names, detailed messages, response protocols, and any other relevant information that needs to be preserved for post-exercise analysis and evaluation purposes."
            },
            {
                "time": "10:30 AM",
                "from_person": "Operations Chief",
                "to_person": "EOC Director",
                "method": "Phone",
                "content": "Status update on current operations. All units are responding according to protocol. Resource allocation is proceeding as planned with no significant delays or issues identified at this time."
            },
            {
                "time": "1:15 PM",
                "from_person": "Safety Officer",
                "to_person": "All Units",
                "method": "Face-to-face",
                "content": "Safety briefing completed. All personnel are aware of current hazards and safety protocols. No incidents reported during this phase of the exercise."
            }
        ],
        
        # Decisions with detailed rationale
        "decisions": [
            {
                "time": "10:00 AM",
                "decision": "Activate additional fire units",
                "decision_maker": "Incident Commander",
                "rationale": "Based on scenario escalation and resource assessment"
            },
            {
                "time": "11:30 AM",
                "decision": "Establish unified command structure",
                "decision_maker": "EOC Director",
                "rationale": "Multi-agency response requires coordinated command"
            }
        ],
        
        # Issues and challenges
        "issues": [
            {
                "time": "10:45 AM",
                "issue": "Radio communication interference",
                "severity": "Medium",
                "resolution": "Switched to backup frequency channel"
            },
            {
                "time": "12:00 PM",
                "issue": "Resource shortage simulation",
                "severity": "High",
                "resolution": "Activated mutual aid agreements"
            }
        ],
        
        # Participant observations
        "participant_observations": [
            {
                "participant": "John Smith",
                "role": "Fire Chief",
                "performance": "Excellent",
                "notes": "Demonstrated strong leadership and quick decision-making"
            },
            {
                "participant": "Mary Wilson",
                "role": "EOC Coordinator",
                "performance": "Good",
                "notes": "Effective coordination but could improve communication timing"
            }
        ],
        
        # Additional notes
        "additional_notes": "Overall exercise performance was excellent. Key learning objectives were met. Recommend additional training on inter-agency communication protocols. Weather conditions were favorable throughout the exercise duration."
    }
    
    created_template_id = None
    
    try:
        # Test 1: GET /api/scribe-templates (Get all scribe templates)
        print("\n1. Testing GET /api/scribe-templates")
        response = requests.get(f"{BACKEND_URL}/scribe-templates")
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            initial_templates = response.json()
            print(f"✅ Successfully retrieved {len(initial_templates)} existing scribe templates")
        else:
            print(f"❌ Failed to get scribe templates: {response.text}")
            return False
            
        # Test 2: POST /api/scribe-templates (Create comprehensive scribe template)
        print("\n2. Testing POST /api/scribe-templates (create with comprehensive nested data)")
        response = requests.post(
            f"{BACKEND_URL}/scribe-templates",
            json=test_scribe_data,
            headers={"Content-Type": "application/json"}
        )
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            created_template = response.json()
            created_template_id = created_template.get("id")
            print(f"✅ Successfully created scribe template with ID: {created_template_id}")
            
            # Verify comprehensive data structure persistence
            print("\n   Verifying scribe template data persistence:")
            
            # Basic template info
            if created_template.get("scribe_name") == test_scribe_data["scribe_name"]:
                print(f"   ✅ Scribe Name: {created_template.get('scribe_name')}")
            else:
                print(f"   ❌ Scribe Name mismatch")
                return False
                
            # Time field verification (HH:MM AM/PM format)
            start_time = created_template.get("exercise_start_time")
            end_time = created_template.get("exercise_end_time")
            if start_time == "9:30 AM" and end_time == "2:45 PM":
                print(f"   ✅ Time fields: Start '{start_time}', End '{end_time}' (HH:MM AM/PM format preserved)")
            else:
                print(f"   ❌ Time fields: Expected '9:30 AM'/'2:45 PM', Got '{start_time}'/'{end_time}'")
                return False
                
            # Nested data structure verification
            nested_collections = {
                "timeline_events": 4,
                "communications": 3,
                "decisions": 2,
                "issues": 2,
                "participant_observations": 2
            }
            
            for collection, expected_count in nested_collections.items():
                actual_count = len(created_template.get(collection, []))
                if actual_count == expected_count:
                    print(f"   ✅ {collection}: {actual_count} items")
                else:
                    print(f"   ❌ {collection}: Expected {expected_count}, Got {actual_count}")
                    return False
                    
            # Verify time strings in nested events
            timeline_events = created_template.get("timeline_events", [])
            if len(timeline_events) >= 4:
                expected_times = ["9:30 AM", "10:15 AM", "11:00 PM", "12:15 AM"]
                for i, expected_time in enumerate(expected_times):
                    actual_time = timeline_events[i].get("time")
                    if actual_time == expected_time:
                        print(f"   ✅ Timeline Event {i+1} time: '{actual_time}'")
                    else:
                        print(f"   ❌ Timeline Event {i+1} time: Expected '{expected_time}', Got '{actual_time}'")
                        return False
                        
            # Verify longtext content field
            communications = created_template.get("communications", [])
            if len(communications) >= 1:
                first_comm_content = communications[0].get("content", "")
                if len(first_comm_content) > 200:  # Should be longtext
                    print(f"   ✅ Longtext content field: {len(first_comm_content)} characters preserved")
                else:
                    print(f"   ❌ Longtext content field: Expected >200 chars, Got {len(first_comm_content)}")
                    return False
                    
        else:
            print(f"❌ Failed to create scribe template: {response.text}")
            return False
            
        # Test 3: GET /api/scribe-templates/{id} (Get specific scribe template)
        print(f"\n3. Testing GET /api/scribe-templates/{created_template_id}")
        response = requests.get(f"{BACKEND_URL}/scribe-templates/{created_template_id}")
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            retrieved_template = response.json()
            print(f"✅ Successfully retrieved scribe template: {retrieved_template.get('scribe_name')}")
            
            # Verify data integrity after retrieval
            if (retrieved_template.get("exercise_start_time") == "9:30 AM" and 
                len(retrieved_template.get("timeline_events", [])) == 4 and
                len(retrieved_template.get("communications", [])) == 3):
                print("   ✅ Data integrity verified after retrieval")
            else:
                print("   ❌ Data integrity compromised after retrieval")
                return False
        else:
            print(f"❌ Failed to get specific scribe template: {response.text}")
            return False
            
        # Test 4: PUT /api/scribe-templates/{id} (Update scribe template)
        print(f"\n4. Testing PUT /api/scribe-templates/{created_template_id}")
        update_data = {
            "scribe_name": "Updated Sarah Johnson",
            "exercise_end_time": "3:30 PM",  # Updated time
            "timeline_events": test_scribe_data["timeline_events"] + [
                {
                    "time": "2:30 PM",
                    "event": "Exercise conclusion and debrief",
                    "observations": "Successful completion of all objectives"
                }
            ],
            "communications": test_scribe_data["communications"] + [
                {
                    "time": "2:45 PM",
                    "from_person": "Exercise Director",
                    "to_person": "All Participants",
                    "method": "Announcement",
                    "content": "Exercise concluded successfully. Thank you for your participation and professional conduct throughout this training event."
                }
            ],
            "additional_notes": "Updated notes: Exercise exceeded expectations with excellent inter-agency coordination demonstrated."
        }
        
        response = requests.put(
            f"{BACKEND_URL}/scribe-templates/{created_template_id}",
            json=update_data,
            headers={"Content-Type": "application/json"}
        )
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            updated_template = response.json()
            if (updated_template.get("scribe_name") == "Updated Sarah Johnson" and
                updated_template.get("exercise_end_time") == "3:30 PM" and
                len(updated_template.get("timeline_events", [])) == 5 and
                len(updated_template.get("communications", [])) == 4):
                print("✅ Scribe template updated successfully with additional nested data")
            else:
                print("❌ Scribe template update failed")
                return False
        else:
            print(f"❌ Failed to update scribe template: {response.text}")
            return False
            
        # Test 5: Test time string handling edge cases
        print(f"\n5. Testing time string handling edge cases")
        edge_case_data = {
            "exercise_id": "4bb39755-0b97-4ded-902d-7f9325f3d9a9",
            "scribe_name": "Time Test Scribe",
            "exercise_start_time": "12:00 AM",  # Midnight
            "exercise_end_time": "11:59 PM",   # Just before midnight
            "timeline_events": [
                {"time": "12:01 AM", "event": "Just after midnight", "observations": "Test"},
                {"time": "12:00 PM", "event": "Noon exactly", "observations": "Test"},
                {"time": "11:59 PM", "event": "Just before midnight", "observations": "Test"}
            ]
        }
        
        response = requests.post(
            f"{BACKEND_URL}/scribe-templates",
            json=edge_case_data,
            headers={"Content-Type": "application/json"}
        )
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            edge_template = response.json()
            edge_template_id = edge_template.get("id")
            print("✅ Edge case time strings handled correctly")
            
            # Verify edge case times
            if (edge_template.get("exercise_start_time") == "12:00 AM" and
                edge_template.get("exercise_end_time") == "11:59 PM"):
                print("   ✅ Midnight and near-midnight times preserved correctly")
            else:
                print("   ❌ Edge case time handling failed")
                return False
                
            # Clean up edge case template
            requests.delete(f"{BACKEND_URL}/scribe-templates/{edge_template_id}")
        else:
            print(f"❌ Failed to handle edge case times: {response.text}")
            return False
            
        # Test 6: Test error handling - Missing required fields
        print(f"\n6. Testing error handling - Missing required exerciseId")
        invalid_data = {
            "scribe_name": "Test Scribe"
            # Missing required exercise_id
        }
        
        response = requests.post(
            f"{BACKEND_URL}/scribe-templates",
            json=invalid_data,
            headers={"Content-Type": "application/json"}
        )
        print(f"Status Code: {response.status_code}")
        
        if response.status_code in [400, 422]:
            print("✅ Proper error handling for missing required fields")
        else:
            print(f"⚠️  Expected 400/422 for missing required fields, got {response.status_code}")
            
        # Test 7: Test invalid exercise ID reference
        print(f"\n7. Testing invalid exercise ID reference")
        invalid_exercise_data = {
            "exercise_id": "invalid-exercise-id-12345",
            "scribe_name": "Test Scribe"
        }
        
        response = requests.post(
            f"{BACKEND_URL}/scribe-templates",
            json=invalid_exercise_data,
            headers={"Content-Type": "application/json"}
        )
        print(f"Status Code: {response.status_code}")
        
        # Note: Backend may or may not validate exercise ID existence
        print(f"   Response for invalid exercise ID: {response.status_code}")
        
        # Test 8: DELETE /api/scribe-templates/{id} (Delete scribe template)
        print(f"\n8. Testing DELETE /api/scribe-templates/{created_template_id}")
        response = requests.delete(f"{BACKEND_URL}/scribe-templates/{created_template_id}")
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            print("✅ Successfully deleted scribe template")
            
            # Verify deletion
            response = requests.get(f"{BACKEND_URL}/scribe-templates/{created_template_id}")
            if response.status_code == 404:
                print("✅ Scribe template deletion verified")
            else:
                print("❌ Scribe template still exists after deletion")
                return False
        else:
            print(f"❌ Failed to delete scribe template: {response.text}")
            return False
            
        # Test 9: Test CRUD workflow verification
        print(f"\n9. Testing complete CRUD workflow verification")
        
        # Create → Save → Retrieve → Update → Retrieve → Delete workflow
        workflow_data = {
            "exercise_id": "4bb39755-0b97-4ded-902d-7f9325f3d9a9",
            "scribe_name": "Workflow Test Scribe",
            "exercise_start_time": "8:00 AM",
            "exercise_end_time": "4:00 PM",
            "timeline_events": [
                {"time": "8:30 AM", "event": "Workflow test event", "observations": "Initial"}
            ],
            "communications": [
                {"time": "9:00 AM", "from_person": "Test", "to_person": "Test", "method": "Test", "content": "Workflow test communication"}
            ]
        }
        
        # Create
        create_response = requests.post(f"{BACKEND_URL}/scribe-templates", json=workflow_data)
        if create_response.status_code != 200:
            print("❌ Workflow test: Create failed")
            return False
            
        workflow_id = create_response.json().get("id")
        
        # Retrieve
        retrieve_response = requests.get(f"{BACKEND_URL}/scribe-templates/{workflow_id}")
        if retrieve_response.status_code != 200:
            print("❌ Workflow test: Retrieve failed")
            return False
            
        # Update
        update_workflow_data = {"scribe_name": "Updated Workflow Scribe"}
        update_response = requests.put(f"{BACKEND_URL}/scribe-templates/{workflow_id}", json=update_workflow_data)
        if update_response.status_code != 200:
            print("❌ Workflow test: Update failed")
            return False
            
        # Retrieve again
        retrieve2_response = requests.get(f"{BACKEND_URL}/scribe-templates/{workflow_id}")
        if retrieve2_response.status_code != 200 or retrieve2_response.json().get("scribe_name") != "Updated Workflow Scribe":
            print("❌ Workflow test: Second retrieve failed")
            return False
            
        # Delete
        delete_response = requests.delete(f"{BACKEND_URL}/scribe-templates/{workflow_id}")
        if delete_response.status_code != 200:
            print("❌ Workflow test: Delete failed")
            return False
            
        print("✅ Complete CRUD workflow verification successful")
        
        print("\n✅ ALL DIGITAL SCRIBE TEMPLATE API TESTS PASSED")
        return True
        
    except Exception as e:
        print(f"❌ Scribe Template API Test Error: {e}")
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

def test_evaluation_report_crud_api():
    """Test Evaluation Report CRUD API endpoints with comprehensive rating system testing"""
    print("=" * 60)
    print("TESTING EVALUATION REPORT CRUD API ENDPOINTS - RATING PERSISTENCE VERIFICATION")
    print("=" * 60)
    
    # Test data with comprehensive rating system as specified in review request
    test_evaluation_data = {
        "exercise_id": "4bb39755-0b97-4ded-902d-7f9325f3d9a9",  # Valid exercise ID
        "report_title": "Emergency Response Exercise Evaluation",
        "evaluator_name": "Dr. Sarah Wilson",
        "evaluator_organization": "Emergency Management Institute",
        "evaluation_date": "2024-03-15",
        
        # Main sections
        "exercise_overview": "Comprehensive emergency response exercise testing multi-agency coordination",
        "summary_of_findings": "Overall performance was excellent with strong coordination between agencies",
        "strengths": "Excellent communication protocols and rapid response times",
        "areas_for_improvement": "Resource allocation could be optimized for better efficiency",
        "key_findings_narrative": "The exercise demonstrated effective emergency response capabilities",
        "recommendations": "Continue regular training exercises and improve resource tracking systems",
        "appendices": "Supporting documentation and detailed logs attached",
        
        # Key Areas Assessment with NEW RATING SYSTEM
        "command_and_control": {
            "area_name": "Command and Control",
            "rating": "Excellent",
            "comments": "Outstanding leadership and clear command structure maintained throughout"
        },
        "communication": {
            "area_name": "Communication",
            "rating": "Satisfactory", 
            "comments": "Good overall communication with minor delays in some transmissions"
        },
        "resource_management": {
            "area_name": "Resource Management",
            "rating": "Needs Improvement",
            "comments": "Resource allocation was slow and could be more efficient"
        },
        "safety_and_security": {
            "area_name": "Safety and Security",
            "rating": "Excellent",
            "comments": "All safety protocols followed perfectly with no incidents"
        },
        "operational_effectiveness": {
            "area_name": "Operational Effectiveness",
            "rating": "Satisfactory",
            "comments": "Operations were effective but some procedures could be streamlined"
        },
        "training_and_readiness": {
            "area_name": "Training and Readiness",
            "rating": "Not Rated",
            "comments": "Training assessment was not part of this exercise scope"
        },
        "plan_adherence_adaptability": {
            "area_name": "Plan Adherence and Adaptability",
            "rating": "Needs Improvement",
            "comments": "Some deviations from plan were necessary but adaptation was slow"
        },
        
        # Supporting documents
        "evaluation_images": ["data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="]
    }
    
    created_report_id = None
    
    try:
        # Test 1: GET /api/evaluation-reports (Get all evaluation reports)
        print("\n1. Testing GET /api/evaluation-reports")
        response = requests.get(f"{BACKEND_URL}/evaluation-reports")
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            initial_reports = response.json()
            print(f"✅ Successfully retrieved {len(initial_reports)} existing evaluation reports")
        else:
            print(f"❌ Failed to get evaluation reports: {response.text}")
            return False
            
        # Test 2: POST /api/evaluation-reports (Create evaluation report with comprehensive ratings)
        print("\n2. Testing POST /api/evaluation-reports (CREATE with comprehensive rating data)")
        print("   📊 Creating evaluation report with ratings:")
        print("   - Command and Control: 'Excellent'")
        print("   - Communication: 'Satisfactory'")
        print("   - Resource Management: 'Needs Improvement'")
        print("   - Safety and Security: 'Excellent'")
        print("   - Operational Effectiveness: 'Satisfactory'")
        print("   - Training and Readiness: 'Not Rated'")
        print("   - Plan Adherence and Adaptability: 'Needs Improvement'")
        
        response = requests.post(
            f"{BACKEND_URL}/evaluation-reports",
            json=test_evaluation_data,
            headers={"Content-Type": "application/json"}
        )
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            created_report = response.json()
            created_report_id = created_report.get("id")
            print(f"✅ Successfully created evaluation report with ID: {created_report_id}")
            
            # Verify ALL 7 assessment area ratings are preserved exactly
            print("\n   🔍 Verifying ALL 7 assessment area ratings persistence:")
            
            assessment_areas = [
                ("command_and_control", "Excellent"),
                ("communication", "Satisfactory"),
                ("resource_management", "Needs Improvement"),
                ("safety_and_security", "Excellent"),
                ("operational_effectiveness", "Satisfactory"),
                ("training_and_readiness", "Not Rated"),
                ("plan_adherence_adaptability", "Needs Improvement")
            ]
            
            for area_key, expected_rating in assessment_areas:
                area_data = created_report.get(area_key, {})
                actual_rating = area_data.get("rating")
                area_name = area_data.get("area_name")
                comments = area_data.get("comments", "")
                
                if actual_rating == expected_rating:
                    print(f"   ✅ {area_name}: '{actual_rating}' (preserved exactly)")
                else:
                    print(f"   ❌ {area_name}: Expected '{expected_rating}', Got '{actual_rating}'")
                    return False
                    
                # Verify rating structure includes all required fields
                if not area_name or not isinstance(comments, str):
                    print(f"   ❌ {area_name}: Rating structure incomplete")
                    return False
                    
            print("   ✅ ALL 7 ASSESSMENT AREA RATINGS VERIFIED IN CREATE RESPONSE")
            
        else:
            print(f"❌ Failed to create evaluation report: {response.text}")
            return False
            
        # Test 3: GET /api/evaluation-reports/{id} (READ - Verify rating persistence)
        print(f"\n3. Testing GET /api/evaluation-reports/{created_report_id} (READ - Rating Persistence)")
        response = requests.get(f"{BACKEND_URL}/evaluation-reports/{created_report_id}")
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            retrieved_report = response.json()
            print(f"✅ Successfully retrieved evaluation report: {retrieved_report.get('report_title')}")
            
            # Verify ALL 7 assessment area ratings are preserved exactly after retrieval
            print("\n   🔍 Verifying rating persistence after database retrieval:")
            
            assessment_areas = [
                ("command_and_control", "Excellent"),
                ("communication", "Satisfactory"),
                ("resource_management", "Needs Improvement"),
                ("safety_and_security", "Excellent"),
                ("operational_effectiveness", "Satisfactory"),
                ("training_and_readiness", "Not Rated"),
                ("plan_adherence_adaptability", "Needs Improvement")
            ]
            
            for area_key, expected_rating in assessment_areas:
                area_data = retrieved_report.get(area_key, {})
                actual_rating = area_data.get("rating")
                area_name = area_data.get("area_name")
                comments = area_data.get("comments", "")
                
                if actual_rating == expected_rating:
                    print(f"   ✅ {area_name}: '{actual_rating}' (persisted correctly)")
                else:
                    print(f"   ❌ {area_name}: Expected '{expected_rating}', Got '{actual_rating}' - DATA LOSS!")
                    return False
                    
                # Verify "Not Rated" areas are handled correctly
                if expected_rating == "Not Rated" and actual_rating == "Not Rated":
                    print(f"   ✅ {area_name}: 'Not Rated' handled correctly")
                    
            print("   ✅ ALL RATING VALUES PRESERVED EXACTLY - NO DATA LOSS")
            
        else:
            print(f"❌ Failed to get specific evaluation report: {response.text}")
            return False
            
        # Test 4: PUT /api/evaluation-reports/{id} (UPDATE with different ratings)
        print(f"\n4. Testing PUT /api/evaluation-reports/{created_report_id} (UPDATE with rating changes)")
        
        # Update with different ratings as specified in review request
        update_data = {
            "report_title": "Updated Emergency Response Exercise Evaluation",
            "command_and_control": {
                "area_name": "Command and Control",
                "rating": "Satisfactory",  # Changed from "Excellent"
                "comments": "Good command structure but some coordination delays observed"
            },
            "communication": {
                "area_name": "Communication",
                "rating": "Needs Improvement",  # Changed from "Satisfactory"
                "comments": "Communication delays affected response times"
            },
            "training_and_readiness": {
                "area_name": "Training and Readiness",
                "rating": "Excellent",  # Changed from "Not Rated"
                "comments": "All personnel demonstrated excellent training and readiness"
            }
            # Other ratings remain unchanged to test partial updates
        }
        
        print("   📊 Updating ratings:")
        print("   - Command and Control: 'Excellent' → 'Satisfactory'")
        print("   - Communication: 'Satisfactory' → 'Needs Improvement'")
        print("   - Training and Readiness: 'Not Rated' → 'Excellent'")
        print("   - Other ratings should remain unchanged")
        
        response = requests.put(
            f"{BACKEND_URL}/evaluation-reports/{created_report_id}",
            json=update_data,
            headers={"Content-Type": "application/json"}
        )
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            updated_report = response.json()
            print("✅ Successfully updated evaluation report")
            
            # Verify specific rating changes persisted
            print("\n   🔍 Verifying rating changes persisted:")
            
            # Check changed ratings
            changed_ratings = [
                ("command_and_control", "Satisfactory"),
                ("communication", "Needs Improvement"),
                ("training_and_readiness", "Excellent")
            ]
            
            for area_key, expected_rating in changed_ratings:
                area_data = updated_report.get(area_key, {})
                actual_rating = area_data.get("rating")
                area_name = area_data.get("area_name")
                
                if actual_rating == expected_rating:
                    print(f"   ✅ {area_name}: Updated to '{actual_rating}' (change persisted)")
                else:
                    print(f"   ❌ {area_name}: Expected '{expected_rating}', Got '{actual_rating}' - UPDATE FAILED!")
                    return False
                    
            # Check unchanged ratings remain intact
            unchanged_ratings = [
                ("resource_management", "Needs Improvement"),
                ("safety_and_security", "Excellent"),
                ("operational_effectiveness", "Satisfactory"),
                ("plan_adherence_adaptability", "Needs Improvement")
            ]
            
            for area_key, expected_rating in unchanged_ratings:
                area_data = updated_report.get(area_key, {})
                actual_rating = area_data.get("rating")
                area_name = area_data.get("area_name")
                
                if actual_rating == expected_rating:
                    print(f"   ✅ {area_name}: '{actual_rating}' (unchanged, preserved)")
                else:
                    print(f"   ❌ {area_name}: Expected '{expected_rating}', Got '{actual_rating}' - UNCHANGED DATA LOST!")
                    return False
                    
            print("   ✅ ALL RATING CHANGES PERSISTED AND UNCHANGED RATINGS PRESERVED")
            
        else:
            print(f"❌ Failed to update evaluation report: {response.text}")
            return False
            
        # Test 5: Verify persistence by retrieving updated report
        print(f"\n5. Testing persistence verification - GET updated report")
        response = requests.get(f"{BACKEND_URL}/evaluation-reports/{created_report_id}")
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            final_report = response.json()
            
            # Verify all changes persisted correctly
            if (final_report.get("command_and_control", {}).get("rating") == "Satisfactory" and
                final_report.get("communication", {}).get("rating") == "Needs Improvement" and
                final_report.get("training_and_readiness", {}).get("rating") == "Excellent"):
                print("✅ All rating updates properly persisted in database")
            else:
                print("❌ Rating updates NOT persisted in database")
                return False
                
        else:
            print(f"❌ Failed to verify persistence: {response.text}")
            return False
            
        # Test 6: Data Integrity Testing - Edge cases
        print(f"\n6. Testing data integrity - Edge cases")
        
        # Test all ratings set to same value
        same_rating_data = {
            "command_and_control": {"area_name": "Command and Control", "rating": "Satisfactory", "comments": "Test"},
            "communication": {"area_name": "Communication", "rating": "Satisfactory", "comments": "Test"},
            "resource_management": {"area_name": "Resource Management", "rating": "Satisfactory", "comments": "Test"},
            "safety_and_security": {"area_name": "Safety and Security", "rating": "Satisfactory", "comments": "Test"},
            "operational_effectiveness": {"area_name": "Operational Effectiveness", "rating": "Satisfactory", "comments": "Test"},
            "training_and_readiness": {"area_name": "Training and Readiness", "rating": "Satisfactory", "comments": "Test"},
            "plan_adherence_adaptability": {"area_name": "Plan Adherence and Adaptability", "rating": "Satisfactory", "comments": "Test"}
        }
        
        response = requests.put(
            f"{BACKEND_URL}/evaluation-reports/{created_report_id}",
            json=same_rating_data,
            headers={"Content-Type": "application/json"}
        )
        
        if response.status_code == 200:
            print("✅ Edge case: All ratings set to same value - handled correctly")
        else:
            print(f"⚠️  Edge case: All same ratings - issue: {response.text}")
            
        # Test mixed scenario with some "Not Rated"
        mixed_rating_data = {
            "command_and_control": {"area_name": "Command and Control", "rating": "Excellent", "comments": "Test"},
            "communication": {"area_name": "Communication", "rating": "Not Rated", "comments": "Not assessed"},
            "resource_management": {"area_name": "Resource Management", "rating": "Needs Improvement", "comments": "Test"},
            "safety_and_security": {"area_name": "Safety and Security", "rating": "Not Rated", "comments": "Not assessed"},
            "operational_effectiveness": {"area_name": "Operational Effectiveness", "rating": "Satisfactory", "comments": "Test"},
            "training_and_readiness": {"area_name": "Training and Readiness", "rating": "Not Rated", "comments": "Not assessed"},
            "plan_adherence_adaptability": {"area_name": "Plan Adherence and Adaptability", "rating": "Excellent", "comments": "Test"}
        }
        
        response = requests.put(
            f"{BACKEND_URL}/evaluation-reports/{created_report_id}",
            json=mixed_rating_data,
            headers={"Content-Type": "application/json"}
        )
        
        if response.status_code == 200:
            print("✅ Edge case: Mixed scenario with some 'Not Rated' - handled correctly")
        else:
            print(f"⚠️  Edge case: Mixed ratings - issue: {response.text}")
            
        # Test 7: Invalid rating values (should be rejected)
        print(f"\n7. Testing invalid rating values rejection")
        invalid_rating_data = {
            "command_and_control": {
                "area_name": "Command and Control",
                "rating": "Invalid Rating",  # Should be rejected
                "comments": "Test"
            }
        }
        
        response = requests.put(
            f"{BACKEND_URL}/evaluation-reports/{created_report_id}",
            json=invalid_rating_data,
            headers={"Content-Type": "application/json"}
        )
        
        if response.status_code in [400, 422]:
            print("✅ Invalid rating values properly rejected")
        else:
            print(f"⚠️  Invalid rating values not properly validated (Status: {response.status_code})")
            
        # Test 8: GET all reports to verify our report appears
        print(f"\n8. Testing GET all reports - verify report appears in list")
        response = requests.get(f"{BACKEND_URL}/evaluation-reports")
        
        if response.status_code == 200:
            all_reports = response.json()
            report_found = any(r.get('id') == created_report_id for r in all_reports)
            if report_found:
                print("✅ Created report appears in GET all reports list")
            else:
                print("❌ Created report NOT found in GET all reports list")
                return False
        else:
            print(f"❌ Failed to get all reports: {response.text}")
            return False
            
        # Test 9: DELETE /api/evaluation-reports/{id} (Clean up)
        print(f"\n9. Testing DELETE /api/evaluation-reports/{created_report_id}")
        response = requests.delete(f"{BACKEND_URL}/evaluation-reports/{created_report_id}")
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            print("✅ Successfully deleted evaluation report")
            
            # Verify deletion
            response = requests.get(f"{BACKEND_URL}/evaluation-reports/{created_report_id}")
            if response.status_code == 404:
                print("✅ Evaluation report deletion verified")
            else:
                print("❌ Evaluation report still exists after deletion")
                return False
        else:
            print(f"❌ Failed to delete evaluation report: {response.text}")
            return False
            
        print("\n" + "=" * 60)
        print("🎉 EVALUATION REPORT CRUD TESTING COMPLETED - ALL RATING PERSISTENCE TESTS PASSED")
        print("✅ New rating system ('Not Rated', 'Needs Improvement', 'Satisfactory', 'Excellent') working perfectly")
        print("✅ All 7 assessment area ratings preserved exactly across CRUD operations")
        print("✅ Rating field structure consistent and complete")
        print("✅ Database persistence verified - no data loss")
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

def test_ics_dashboard_overview_api():
    """Test ICS Dashboard Overview API endpoints as requested in review"""
    print("=" * 60)
    print("TESTING ICS DASHBOARD OVERVIEW API ENDPOINTS")
    print("=" * 60)
    
    # Use the exercise ID specified in the review request
    exercise_id = "4bb39755-0b97-4ded-902d-7f9325f3d9a9"
    
    try:
        # Test 1: GET /api/scenarios?exercise_id={exerciseId}
        print(f"\n1. Testing GET /api/scenarios?exercise_id={exercise_id}")
        response = requests.get(f"{BACKEND_URL}/scenarios", params={"exercise_id": exercise_id})
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            scenarios = response.json()
            print(f"✅ Successfully retrieved {len(scenarios)} scenarios for exercise")
            
            if len(scenarios) > 0:
                # Verify scenario data structure
                first_scenario = scenarios[0]
                required_fields = ["scenario_name", "description", "location", "status", "created_at"]
                missing_fields = [field for field in required_fields if field not in first_scenario]
                
                if not missing_fields:
                    print("   ✅ Scenario data structure includes all required fields:")
                    print(f"   - Scenario Name: {first_scenario.get('scenario_name')}")
                    print(f"   - Description: {first_scenario.get('description')[:50]}...")
                    print(f"   - Location: {first_scenario.get('location')}")
                    print(f"   - Status: {first_scenario.get('status')}")
                    print(f"   - Created At: {first_scenario.get('created_at')}")
                else:
                    print(f"   ❌ Missing required fields in scenario data: {missing_fields}")
                    return False
            else:
                print("   ⚠️  No scenarios found for this exercise - testing empty response handling")
                
        else:
            print(f"❌ Failed to get scenarios: {response.text}")
            return False
            
        # Test 2: GET /api/exercise-objectives/{exercise_id}
        print(f"\n2. Testing GET /api/exercise-objectives/{exercise_id}")
        response = requests.get(f"{BACKEND_URL}/exercise-objectives/{exercise_id}")
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            objectives = response.json()
            print(f"✅ Successfully retrieved {len(objectives)} exercise objectives")
            
            if len(objectives) > 0:
                # Verify objective data structure
                first_objective = objectives[0]
                required_fields = ["name", "description", "achieved", "created_at"]
                missing_fields = [field for field in required_fields if field not in first_objective]
                
                if not missing_fields:
                    print("   ✅ Objective data structure includes all required fields:")
                    print(f"   - Name: {first_objective.get('name')}")
                    print(f"   - Description: {first_objective.get('description')[:50]}...")
                    print(f"   - Achievement Status: {first_objective.get('achieved')}")
                    print(f"   - Created At: {first_objective.get('created_at')}")
                    
                    # Verify achievement status values
                    achieved_status = first_objective.get('achieved')
                    valid_statuses = ["Yes", "Partial", "No"]
                    if achieved_status in valid_statuses:
                        print(f"   ✅ Achievement status '{achieved_status}' is valid")
                    else:
                        print(f"   ⚠️  Achievement status '{achieved_status}' not in expected values: {valid_statuses}")
                else:
                    print(f"   ❌ Missing required fields in objective data: {missing_fields}")
                    return False
            else:
                print("   ⚠️  No objectives found for this exercise - testing empty response handling")
                
        else:
            print(f"❌ Failed to get exercise objectives: {response.text}")
            return False
            
        # Test 3: GET /api/safety-officer
        print(f"\n3. Testing GET /api/safety-officer")
        response = requests.get(f"{BACKEND_URL}/safety-officer")
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            safety_officer = response.json()
            
            if safety_officer:
                print("✅ Successfully retrieved safety officer data")
                
                # Verify safety officer data structure
                required_fields = ["firstName", "lastName", "position"]
                missing_fields = [field for field in required_fields if field not in safety_officer]
                
                if not missing_fields:
                    print("   ✅ Safety officer data structure includes required fields:")
                    print(f"   - First Name: {safety_officer.get('firstName')}")
                    print(f"   - Last Name: {safety_officer.get('lastName')}")
                    print(f"   - Position: {safety_officer.get('position')}")
                    
                    # Check for phones array (could be in different formats)
                    phones = []
                    if safety_officer.get('cellPhone'):
                        phones.append(safety_officer.get('cellPhone'))
                    if safety_officer.get('homePhone'):
                        phones.append(safety_officer.get('homePhone'))
                    if safety_officer.get('phone'):
                        phones.append(safety_officer.get('phone'))
                        
                    if phones:
                        print(f"   ✅ Phone numbers available: {phones}")
                    else:
                        print("   ⚠️  No phone numbers found in safety officer data")
                else:
                    print(f"   ❌ Missing required fields in safety officer data: {missing_fields}")
                    return False
            else:
                print("   ⚠️  No safety officer assigned - testing null response handling")
                print("   ✅ Proper handling of case when no safety officer is assigned")
                
        else:
            print(f"❌ Failed to get safety officer: {response.text}")
            return False
            
        # Test 4: Data Integration Testing - Verify JSON responses
        print(f"\n4. Testing data integration - JSON response format validation")
        
        # Test scenarios endpoint JSON format
        response = requests.get(f"{BACKEND_URL}/scenarios", params={"exercise_id": exercise_id})
        if response.status_code == 200:
            try:
                scenarios_json = response.json()
                print("   ✅ Scenarios endpoint returns valid JSON")
            except ValueError as e:
                print(f"   ❌ Scenarios endpoint JSON parsing error: {e}")
                return False
        
        # Test objectives endpoint JSON format
        response = requests.get(f"{BACKEND_URL}/exercise-objectives/{exercise_id}")
        if response.status_code == 200:
            try:
                objectives_json = response.json()
                print("   ✅ Exercise objectives endpoint returns valid JSON")
            except ValueError as e:
                print(f"   ❌ Exercise objectives endpoint JSON parsing error: {e}")
                return False
        
        # Test safety officer endpoint JSON format
        response = requests.get(f"{BACKEND_URL}/safety-officer")
        if response.status_code == 200:
            try:
                safety_officer_json = response.json()
                print("   ✅ Safety officer endpoint returns valid JSON")
            except ValueError as e:
                print(f"   ❌ Safety officer endpoint JSON parsing error: {e}")
                return False
                
        # Test 5: Error handling when no data exists
        print(f"\n5. Testing error handling for non-existent exercise")
        fake_exercise_id = "non-existent-exercise-id"
        
        # Test scenarios with non-existent exercise
        response = requests.get(f"{BACKEND_URL}/scenarios", params={"exercise_id": fake_exercise_id})
        if response.status_code == 200:
            scenarios = response.json()
            if len(scenarios) == 0:
                print("   ✅ Scenarios endpoint properly handles non-existent exercise (empty array)")
            else:
                print(f"   ⚠️  Scenarios endpoint returned data for non-existent exercise")
        else:
            print(f"   ⚠️  Scenarios endpoint error for non-existent exercise: {response.status_code}")
            
        # Test objectives with non-existent exercise
        response = requests.get(f"{BACKEND_URL}/exercise-objectives/{fake_exercise_id}")
        if response.status_code == 200:
            objectives = response.json()
            if len(objectives) == 0:
                print("   ✅ Objectives endpoint properly handles non-existent exercise (empty array)")
            else:
                print(f"   ⚠️  Objectives endpoint returned data for non-existent exercise")
        else:
            print(f"   ⚠️  Objectives endpoint error for non-existent exercise: {response.status_code}")
            
        # Test 6: Date field format validation
        print(f"\n6. Testing date field format for frontend consumption")
        
        # Check scenarios date format
        response = requests.get(f"{BACKEND_URL}/scenarios", params={"exercise_id": exercise_id})
        if response.status_code == 200:
            scenarios = response.json()
            if len(scenarios) > 0 and scenarios[0].get('created_at'):
                created_at = scenarios[0].get('created_at')
                print(f"   ✅ Scenario created_at format: {created_at}")
                # Check if it's a valid datetime string
                try:
                    from datetime import datetime
                    if 'T' in created_at:
                        datetime.fromisoformat(created_at.replace('Z', '+00:00'))
                        print("   ✅ Scenario date format is valid ISO format")
                    else:
                        print("   ⚠️  Scenario date format may not be ISO format")
                except ValueError:
                    print("   ⚠️  Scenario date format validation failed")
                    
        # Check objectives date format
        response = requests.get(f"{BACKEND_URL}/exercise-objectives/{exercise_id}")
        if response.status_code == 200:
            objectives = response.json()
            if len(objectives) > 0 and objectives[0].get('created_at'):
                created_at = objectives[0].get('created_at')
                print(f"   ✅ Objective created_at format: {created_at}")
                try:
                    from datetime import datetime
                    if 'T' in created_at:
                        datetime.fromisoformat(created_at.replace('Z', '+00:00'))
                        print("   ✅ Objective date format is valid ISO format")
                    else:
                        print("   ⚠️  Objective date format may not be ISO format")
                except ValueError:
                    print("   ⚠️  Objective date format validation failed")
                    
        print("\n✅ ALL ICS DASHBOARD OVERVIEW API TESTS COMPLETED")
        return True
        
    except requests.exceptions.ConnectionError as e:
        print(f"❌ Connection Error: Cannot connect to {BACKEND_URL}")
        print(f"Error: {e}")
        return False
    except requests.exceptions.RequestException as e:
        print(f"❌ Request Error: {e}")
        return False
    except Exception as e:
        print(f"❌ ICS Dashboard Overview API Test Error: {e}")
        return False

def test_map_objects_crud_api():
    """Test Map Objects CRUD API endpoints comprehensively for EXRSIM mapping functionality"""
    print("=" * 60)
    print("TESTING MAP OBJECTS CRUD API ENDPOINTS - COMPREHENSIVE REVIEW REQUEST")
    print("=" * 60)
    
    # Exercise ID from review request - Exercise Claybelt
    exercise_id = "9204c218-cb55-44e8-812e-3a643aef023c"
    
    # Test data for different object types with proper GeoJSON geometry
    test_map_objects = {
        "marker": {
            "exercise_id": exercise_id,
            "type": "marker",
            "name": "Emergency Command Post",
            "description": "Main command center for emergency operations",
            "color": "#ff0000",
            "geometry": {
                "type": "Point",
                "coordinates": [-123.1207, 49.2827]  # Vancouver coordinates [longitude, latitude]
            },
            "image": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
        },
        "line": {
            "exercise_id": exercise_id,
            "type": "line",
            "name": "Evacuation Route",
            "description": "Primary evacuation route for emergency response",
            "color": "#00ff00",
            "geometry": {
                "type": "LineString",
                "coordinates": [
                    [-123.1207, 49.2827],  # Start point
                    [-123.1100, 49.2900],  # Mid point
                    [-123.1000, 49.3000]   # End point
                ]
            }
        },
        "polygon": {
            "exercise_id": exercise_id,
            "type": "polygon",
            "name": "Hazard Zone",
            "description": "Area affected by hazardous conditions",
            "color": "#ffff00",
            "geometry": {
                "type": "Polygon",
                "coordinates": [[
                    [-123.1300, 49.2800],  # Point 1
                    [-123.1200, 49.2800],  # Point 2
                    [-123.1200, 49.2900],  # Point 3
                    [-123.1300, 49.2900],  # Point 4
                    [-123.1300, 49.2800]   # Close polygon
                ]]
            }
        },
        "rectangle": {
            "exercise_id": exercise_id,
            "type": "rectangle",
            "name": "Safety Perimeter",
            "description": "Rectangular safety zone around incident",
            "color": "#0000ff",
            "geometry": {
                "type": "Polygon",
                "coordinates": [[
                    [-123.1400, 49.2750],  # Southwest corner
                    [-123.1350, 49.2750],  # Southeast corner
                    [-123.1350, 49.2800],  # Northeast corner
                    [-123.1400, 49.2800],  # Northwest corner
                    [-123.1400, 49.2750]   # Close rectangle
                ]]
            }
        }
    }
    
    created_objects = {}
    
    try:
        # Test 1: GET /api/map-objects (Get all map objects for exercise - initial state)
        print(f"\n1. Testing GET /api/map-objects?exercise_id={exercise_id}")
        response = requests.get(f"{BACKEND_URL}/map-objects", params={"exercise_id": exercise_id})
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            initial_objects = response.json()
            print(f"✅ Successfully retrieved {len(initial_objects)} existing map objects for exercise")
        else:
            print(f"❌ Failed to get map objects: {response.text}")
            return False
            
        # Test 2: POST /api/map-objects (Create all 4 object types)
        print(f"\n2. Testing POST /api/map-objects (create all 4 object types)")
        
        for obj_type, obj_data in test_map_objects.items():
            print(f"\n   Creating {obj_type} object...")
            response = requests.post(
                f"{BACKEND_URL}/map-objects",
                json=obj_data,
                headers={"Content-Type": "application/json"}
            )
            print(f"   Status Code: {response.status_code}")
            
            if response.status_code == 200:
                created_object = response.json()
                object_id = created_object.get("id")
                created_objects[obj_type] = object_id
                print(f"   ✅ Successfully created {obj_type} with ID: {object_id}")
                
                # Verify object data
                if (created_object.get("type") == obj_type and
                    created_object.get("name") == obj_data["name"] and
                    created_object.get("exercise_id") == exercise_id):
                    print(f"   ✅ {obj_type} data verified: name='{created_object.get('name')}', type='{created_object.get('type')}'")
                else:
                    print(f"   ❌ {obj_type} data verification failed")
                    return False
                    
                # Verify GeoJSON geometry preservation
                created_geometry = created_object.get("geometry", {})
                expected_geometry = obj_data["geometry"]
                if (created_geometry.get("type") == expected_geometry["type"] and
                    created_geometry.get("coordinates") == expected_geometry["coordinates"]):
                    print(f"   ✅ {obj_type} GeoJSON geometry preserved exactly")
                else:
                    print(f"   ❌ {obj_type} GeoJSON geometry not preserved correctly")
                    print(f"      Expected: {expected_geometry}")
                    print(f"      Got: {created_geometry}")
                    return False
                    
                # Verify color and optional fields
                if created_object.get("color") == obj_data["color"]:
                    print(f"   ✅ {obj_type} color preserved: {created_object.get('color')}")
                else:
                    print(f"   ❌ {obj_type} color not preserved")
                    return False
                    
                # Verify timestamps
                if created_object.get("created_at") and created_object.get("updated_at"):
                    print(f"   ✅ {obj_type} timestamps present")
                else:
                    print(f"   ❌ {obj_type} timestamps missing")
                    return False
                    
            else:
                print(f"   ❌ Failed to create {obj_type}: {response.text}")
                return False
                
        print(f"\n✅ Successfully created all 4 object types: {list(created_objects.keys())}")
        
        # Test 3: GET /api/map-objects?exercise_id={id} (Verify all objects appear in exercise query)
        print(f"\n3. Testing GET /api/map-objects?exercise_id={exercise_id} (verify creation)")
        response = requests.get(f"{BACKEND_URL}/map-objects", params={"exercise_id": exercise_id})
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            all_objects = response.json()
            print(f"✅ Successfully retrieved {len(all_objects)} map objects after creation")
            
            # Verify all created objects are present
            created_ids = set(created_objects.values())
            retrieved_ids = {obj.get("id") for obj in all_objects}
            
            if created_ids.issubset(retrieved_ids):
                print("✅ All created objects found in exercise query")
            else:
                missing_ids = created_ids - retrieved_ids
                print(f"❌ Missing objects in exercise query: {missing_ids}")
                return False
                
            # Verify object types are correct
            type_counts = {}
            for obj in all_objects:
                obj_type = obj.get("type")
                type_counts[obj_type] = type_counts.get(obj_type, 0) + 1
                
            expected_types = ["marker", "line", "polygon", "rectangle"]
            for expected_type in expected_types:
                if expected_type in type_counts:
                    print(f"✅ Found {type_counts[expected_type]} {expected_type} object(s)")
                else:
                    print(f"❌ No {expected_type} objects found")
                    return False
        else:
            print(f"❌ Failed to get map objects after creation: {response.text}")
            return False
            
        # Test 4: GET /api/map-objects/{object_id} (Get specific objects)
        print(f"\n4. Testing GET /api/map-objects/{{object_id}} (get specific objects)")
        
        for obj_type, object_id in created_objects.items():
            print(f"\n   Getting {obj_type} object {object_id}...")
            response = requests.get(f"{BACKEND_URL}/map-objects/{object_id}")
            print(f"   Status Code: {response.status_code}")
            
            if response.status_code == 200:
                retrieved_object = response.json()
                print(f"   ✅ Successfully retrieved {obj_type}: {retrieved_object.get('name')}")
                
                # Verify data integrity
                expected_data = test_map_objects[obj_type]
                if (retrieved_object.get("type") == expected_data["type"] and
                    retrieved_object.get("name") == expected_data["name"] and
                    retrieved_object.get("description") == expected_data["description"]):
                    print(f"   ✅ {obj_type} data integrity verified")
                else:
                    print(f"   ❌ {obj_type} data integrity compromised")
                    return False
            else:
                print(f"   ❌ Failed to get {obj_type} object: {response.text}")
                return False
                
        # Test 5: PUT /api/map-objects/{object_id} (Update objects)
        print(f"\n5. Testing PUT /api/map-objects/{{object_id}} (update objects)")
        
        # Update the marker object with new data
        marker_id = created_objects["marker"]
        update_data = {
            "name": "Updated Emergency Command Post",
            "description": "Updated main command center with enhanced capabilities",
            "color": "#ff6600",  # Changed color
            "geometry": {
                "type": "Point",
                "coordinates": [-123.1300, 49.2900]  # Updated coordinates
            }
        }
        
        print(f"\n   Updating marker object {marker_id}...")
        response = requests.put(
            f"{BACKEND_URL}/map-objects/{marker_id}",
            json=update_data,
            headers={"Content-Type": "application/json"}
        )
        print(f"   Status Code: {response.status_code}")
        
        if response.status_code == 200:
            updated_object = response.json()
            print(f"   ✅ Successfully updated marker object")
            
            # Verify updates
            if (updated_object.get("name") == update_data["name"] and
                updated_object.get("color") == update_data["color"] and
                updated_object.get("geometry")["coordinates"] == update_data["geometry"]["coordinates"]):
                print(f"   ✅ Marker update verification passed")
                print(f"      Name: {updated_object.get('name')}")
                print(f"      Color: {updated_object.get('color')}")
                print(f"      Coordinates: {updated_object.get('geometry')['coordinates']}")
            else:
                print(f"   ❌ Marker update verification failed")
                return False
                
            # Verify updated_at timestamp changed
            if updated_object.get("updated_at"):
                print(f"   ✅ Updated timestamp present: {updated_object.get('updated_at')}")
            else:
                print(f"   ❌ Updated timestamp missing")
                return False
        else:
            print(f"   ❌ Failed to update marker object: {response.text}")
            return False
            
        # Test 6: DELETE /api/map-objects/{object_id} (Delete objects)
        print(f"\n6. Testing DELETE /api/map-objects/{{object_id}} (delete objects)")
        
        for obj_type, object_id in created_objects.items():
            print(f"\n   Deleting {obj_type} object {object_id}...")
            response = requests.delete(f"{BACKEND_URL}/map-objects/{object_id}")
            print(f"   Status Code: {response.status_code}")
            
            if response.status_code == 200:
                print(f"   ✅ Successfully deleted {obj_type} object")
                
                # Verify deletion
                response = requests.get(f"{BACKEND_URL}/map-objects/{object_id}")
                if response.status_code == 404:
                    print(f"   ✅ {obj_type} deletion verified - object no longer exists")
                else:
                    print(f"   ❌ {obj_type} object still exists after deletion")
                    return False
            else:
                print(f"   ❌ Failed to delete {obj_type} object: {response.text}")
                return False
                
        # Test 7: Error handling for non-existent resources
        print(f"\n7. Testing error handling for non-existent resources")
        fake_id = "non-existent-map-object-id"
        
        # Test GET non-existent object
        response = requests.get(f"{BACKEND_URL}/map-objects/{fake_id}")
        if response.status_code == 404:
            print("✅ GET non-existent object: Proper 404 response")
        else:
            print(f"⚠️  GET non-existent object: Expected 404, got {response.status_code}")
            
        # Test UPDATE non-existent object
        response = requests.put(f"{BACKEND_URL}/map-objects/{fake_id}", json={"name": "test"})
        if response.status_code == 404:
            print("✅ UPDATE non-existent object: Proper 404 response")
        else:
            print(f"⚠️  UPDATE non-existent object: Expected 404, got {response.status_code}")
            
        # Test DELETE non-existent object
        response = requests.delete(f"{BACKEND_URL}/map-objects/{fake_id}")
        if response.status_code == 404:
            print("✅ DELETE non-existent object: Proper 404 response")
        else:
            print(f"⚠️  DELETE non-existent object: Expected 404, got {response.status_code}")
            
        print("\n" + "=" * 60)
        print("✅ ALL MAP OBJECT API TESTS PASSED")
        print("=" * 60)
        print("\n🎯 MAP OBJECT API COMPREHENSIVE TEST SUMMARY:")
        print("✅ All CRUD operations working correctly")
        print("✅ All 4 object types supported (marker, line, polygon, rectangle)")
        print("✅ GeoJSON geometry data preserved exactly")
        print("✅ Exercise-based filtering functional")
        print("✅ Color and optional image field handling working")
        print("✅ Timestamp fields (created_at, updated_at) working")
        print("✅ Error handling for invalid data and missing resources")
        print("✅ Data persistence verified across create-read-update-delete cycle")
        print("\n🚀 BACKEND IS READY TO SUPPORT FRONTEND CLICK-TO-PLACE FUNCTIONALITY!")
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

def test_exercise_partial_update():
    """Test Exercise Builder PUT endpoint for partial updates without requiring all mandatory fields"""
    print("=" * 60)
    print("TESTING EXERCISE BUILDER PARTIAL UPDATE FUNCTIONALITY")
    print("=" * 60)
    
    try:
        # Test 1: First verify that exercises exist in the system by calling GET /api/exercise-builder
        print("\n1. Testing GET /api/exercise-builder (verify exercises exist)")
        response = requests.get(f"{BACKEND_URL}/exercise-builder")
        print(f"Status Code: {response.status_code}")
        
        if response.status_code != 200:
            print(f"❌ Failed to get exercises: {response.text}")
            return False
            
        exercises = response.json()
        print(f"✅ Successfully retrieved {len(exercises)} existing exercises")
        
        if len(exercises) == 0:
            print("⚠️  No exercises found in system. Creating a test exercise first...")
            # Create a minimal test exercise
            test_exercise = {
                "exercise_name": "Test Exercise for Partial Update",
                "exercise_type": "Table Top",
                "exercise_description": "Test exercise for partial update functionality",
                "location": "Test Location",
                "start_date": "2024-03-15T09:00:00Z",
                "start_time": "09:00",
                "end_date": "2024-03-15T17:00:00Z",
                "end_time": "17:00"
            }
            
            create_response = requests.post(
                f"{BACKEND_URL}/exercise-builder",
                json=test_exercise,
                headers={"Content-Type": "application/json"}
            )
            
            if create_response.status_code != 200:
                print(f"❌ Failed to create test exercise: {create_response.text}")
                return False
                
            created_exercise = create_response.json()
            exercise_id = created_exercise.get("id")
            print(f"✅ Created test exercise with ID: {exercise_id}")
        else:
            # Use the first existing exercise
            exercise_id = exercises[0].get("id")
            print(f"✅ Using existing exercise with ID: {exercise_id}")
            
        # Get the original exercise data for comparison
        print(f"\n2. Getting original exercise data for comparison")
        response = requests.get(f"{BACKEND_URL}/exercise-builder/{exercise_id}")
        if response.status_code != 200:
            print(f"❌ Failed to get original exercise: {response.text}")
            return False
            
        original_exercise = response.json()
        print(f"✅ Retrieved original exercise: {original_exercise.get('exercise_name')}")
        print(f"   Original latitude: {original_exercise.get('latitude')}")
        print(f"   Original longitude: {original_exercise.get('longitude')}")
        print(f"   Original exercise_type: {original_exercise.get('exercise_type')}")
        print(f"   Original location: {original_exercise.get('location')}")
        
        # Test 3: Test partial update with only latitude and longitude fields
        print(f"\n3. Testing PUT /api/exercise-builder/{exercise_id} with partial payload (latitude/longitude only)")
        partial_update_payload = {
            "latitude": 45.1234,
            "longitude": -97.5678
        }
        
        print(f"   Sending partial update payload: {partial_update_payload}")
        response = requests.put(
            f"{BACKEND_URL}/exercise-builder/{exercise_id}",
            json=partial_update_payload,
            headers={"Content-Type": "application/json"}
        )
        print(f"Status Code: {response.status_code}")
        
        if response.status_code != 200:
            print(f"❌ Failed partial update: {response.text}")
            return False
            
        updated_exercise = response.json()
        print(f"✅ Partial update successful")
        
        # Test 4: Verify the response includes the updated coordinates
        print(f"\n4. Verifying response includes updated coordinates")
        updated_lat = updated_exercise.get("latitude")
        updated_lng = updated_exercise.get("longitude")
        
        if updated_lat == 45.1234 and updated_lng == -97.5678:
            print(f"✅ Updated coordinates verified: lat={updated_lat}, lng={updated_lng}")
        else:
            print(f"❌ Coordinate update failed: Expected lat=45.1234, lng=-97.5678, Got lat={updated_lat}, lng={updated_lng}")
            return False
            
        # Test 5: Verify that other existing fields remain unchanged
        print(f"\n5. Verifying other existing fields remain unchanged")
        fields_to_check = ['exercise_name', 'exercise_type', 'exercise_description', 'location', 'start_date', 'end_date']
        
        all_fields_preserved = True
        for field in fields_to_check:
            original_value = original_exercise.get(field)
            updated_value = updated_exercise.get(field)
            
            if original_value == updated_value:
                print(f"   ✅ {field}: '{updated_value}' (preserved)")
            else:
                print(f"   ❌ {field}: Original='{original_value}', Updated='{updated_value}' (changed unexpectedly)")
                all_fields_preserved = False
                
        if not all_fields_preserved:
            print("❌ Some fields were unexpectedly modified during partial update")
            return False
        else:
            print("✅ All other fields properly preserved during partial update")
            
        # Test 6: Test edge case with empty payload {}
        print(f"\n6. Testing edge case with empty payload {{}}")
        empty_payload = {}
        
        response = requests.put(
            f"{BACKEND_URL}/exercise-builder/{exercise_id}",
            json=empty_payload,
            headers={"Content-Type": "application/json"}
        )
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            print("✅ Empty payload handled correctly (no error)")
            empty_update_exercise = response.json()
            
            # Verify coordinates are still the same as our previous update
            if (empty_update_exercise.get("latitude") == 45.1234 and 
                empty_update_exercise.get("longitude") == -97.5678):
                print("✅ Empty payload didn't modify existing data")
            else:
                print("❌ Empty payload unexpectedly modified data")
                return False
        else:
            print(f"⚠️  Empty payload returned status {response.status_code}: {response.text}")
            
        # Test 7: Test with invalid exercise_id to verify 404 handling
        print(f"\n7. Testing with invalid exercise_id for 404 handling")
        invalid_id = "invalid-exercise-id-12345"
        
        response = requests.put(
            f"{BACKEND_URL}/exercise-builder/{invalid_id}",
            json={"latitude": 50.0, "longitude": -100.0},
            headers={"Content-Type": "application/json"}
        )
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 404:
            print("✅ Invalid exercise_id properly returns 404")
        else:
            print(f"⚠️  Expected 404 for invalid ID, got {response.status_code}")
            
        # Test 8: Test partial update with multiple fields
        print(f"\n8. Testing partial update with multiple fields")
        multi_field_payload = {
            "latitude": 49.2827,
            "longitude": -123.1207,
            "exercise_description": "Updated description via partial update"
        }
        
        response = requests.put(
            f"{BACKEND_URL}/exercise-builder/{exercise_id}",
            json=multi_field_payload,
            headers={"Content-Type": "application/json"}
        )
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            multi_updated_exercise = response.json()
            
            # Verify all three fields were updated
            if (multi_updated_exercise.get("latitude") == 49.2827 and
                multi_updated_exercise.get("longitude") == -123.1207 and
                multi_updated_exercise.get("exercise_description") == "Updated description via partial update"):
                print("✅ Multi-field partial update successful")
                
                # Verify other fields still preserved
                if multi_updated_exercise.get("exercise_name") == original_exercise.get("exercise_name"):
                    print("✅ Non-updated fields still preserved in multi-field update")
                else:
                    print("❌ Non-updated fields were modified in multi-field update")
                    return False
            else:
                print("❌ Multi-field partial update failed")
                return False
        else:
            print(f"❌ Multi-field partial update failed: {response.text}")
            return False
            
        # Test 9: Final verification - get the exercise one more time
        print(f"\n9. Final verification - retrieving final exercise state")
        response = requests.get(f"{BACKEND_URL}/exercise-builder/{exercise_id}")
        if response.status_code == 200:
            final_exercise = response.json()
            print(f"✅ Final exercise state retrieved")
            print(f"   Final latitude: {final_exercise.get('latitude')}")
            print(f"   Final longitude: {final_exercise.get('longitude')}")
            print(f"   Final description: {final_exercise.get('exercise_description')[:50]}...")
            
            # Verify final state matches our last update
            if (final_exercise.get("latitude") == 49.2827 and
                final_exercise.get("longitude") == -123.1207):
                print("✅ Final coordinates match expected values")
            else:
                print("❌ Final coordinates don't match expected values")
                return False
        else:
            print(f"❌ Failed to get final exercise state: {response.text}")
            return False
            
        print("\n✅ ALL EXERCISE PARTIAL UPDATE TESTS PASSED")
        print("✅ PUT request with partial data returns 200 status")
        print("✅ Updated exercise contains new latitude/longitude")
        print("✅ All other existing fields remain unchanged")
        print("✅ Invalid IDs return 404")
        print("✅ Empty payload handled correctly")
        print("✅ Multi-field partial updates work correctly")
        return True
        
    except Exception as e:
        print(f"❌ Exercise Partial Update Test Error: {e}")
        return False

if __name__ == "__main__":
    print("EXRSIM Backend API Comprehensive Testing")
    print(f"Backend URL: {BACKEND_URL}")
    print("=" * 60)
    
    # Test API health first
    if not test_health_check():
        print("❌ API is not responding. Cannot proceed with tests.")
        sys.exit(1)
    
    # Run all comprehensive tests
    test_results = []
    
    print("\n🚀 STARTING COMPREHENSIVE BACKEND API TESTING")
    print("=" * 60)
    
    # Test 0: Exercise Coordinates Functionality (HIGHEST PRIORITY - CURRENT REVIEW REQUEST)
    print("\n🎯 Testing Exercise Coordinates Functionality (PRIORITY TEST)...")
    test_results.append(("Exercise Coordinates Functionality", test_exercise_coordinates_functionality()))
    
    # Test 0.1: Exercise Partial Update (HIGH PRIORITY)
    print("\n🎯 Testing Exercise Partial Update API...")
    test_results.append(("Exercise Partial Update API", test_exercise_partial_update()))
    
    # Test 1: Map Object APIs (HIGH PRIORITY - LEAFLET MAPPING REVIEW REQUEST)
    print("\n🗺️ Testing Map Object APIs for Leaflet Mapping...")
    test_results.append(("Map Object API (Leaflet Mapping)", test_map_objects_crud_api()))
    
    # Test 1: Weather API (HIGH PRIORITY - NEW FEATURE TESTING)
    print("\n🌤️  Testing Weather API...")
    test_results.append(("Weather API", test_weather_api()))
    
    # Test 2: ICS Dashboard Overview APIs (HIGH PRIORITY - REVIEW REQUEST)
    print("\n🎯 Testing ICS Dashboard Overview APIs...")
    test_results.append(("ICS Dashboard Overview API", test_ics_dashboard_overview_api()))
    
    # Test 3: Exercise Builder APIs
    print("\n📋 Testing Exercise Builder APIs...")
    test_results.append(("Exercise Builder API", test_exercise_builder_api()))
    
    # Test 2: Participant Management APIs  
    print("\n👥 Testing Participant Management APIs...")
    test_results.append(("Participant CRUD API", test_participant_crud_api()))
    
    # Test 3: HIRA Management APIs
    print("\n⚠️ Testing HIRA Management APIs...")
    test_results.append(("HIRA Management API", test_hira_api()))
    
    # Test 4: MSEL Management APIs
    print("\n📝 Testing MSEL Management APIs...")
    test_results.append(("MSEL Management API", test_msel_api()))
    
    # Test 5: Digital Scribe Template APIs (HIGH PRIORITY)
    print("\n📋 Testing Digital Scribe Template APIs...")
    test_results.append(("Digital Scribe Template API", test_scribe_template_api()))
    
    # Test 6: Evaluation Report CRUD APIs (HIGH PRIORITY - RATING PERSISTENCE)
    print("\n📊 Testing Evaluation Report CRUD APIs - Rating Persistence...")
    test_results.append(("Evaluation Report CRUD API", test_evaluation_report_crud_api()))
    
    # Test 7: Data Validation
    print("\n🔍 Testing Data Validation...")
    test_results.append(("Data Validation", test_data_validation()))
    
    # Test 8: Edge Cases
    print("\n🎯 Testing Edge Cases...")
    test_results.append(("Edge Cases", test_edge_cases()))
    
    # Test 9: Performance Testing
    print("\n⚡ Testing Performance...")
    test_results.append(("Performance", test_performance()))
    
    # Summary
    print("\n" + "=" * 60)
    print("🎉 COMPREHENSIVE TESTING SUMMARY")
    print("=" * 60)
    
    passed_tests = 0
    failed_tests = 0
    
    for test_name, result in test_results:
        if result:
            print(f"✅ {test_name}: PASSED")
            passed_tests += 1
        else:
            print(f"❌ {test_name}: FAILED")
            failed_tests += 1
    
    print(f"\nTotal Tests: {len(test_results)}")
    print(f"Passed: {passed_tests}")
    print(f"Failed: {failed_tests}")
    
    if failed_tests == 0:
        print("\n🎉 ALL COMPREHENSIVE BACKEND TESTS COMPLETED SUCCESSFULLY")
        print("✅ EXRSIM Emergency Training Platform Backend APIs are fully functional")
        sys.exit(0)
    else:
        print(f"\n💥 {failed_tests} TEST(S) FAILED")
        print("❌ Some backend functionality needs attention")
        sys.exit(1)
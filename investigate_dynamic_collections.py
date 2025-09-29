#!/usr/bin/env python3
"""
Investigation Script for Dynamic Collections Data Persistence Issue
Specifically investigating the issue where dynamic collections return as empty arrays []
when fetching exercises for editing, despite backend tests showing they work correctly.
"""

import requests
import json
from datetime import datetime, timezone
import sys

# Get backend URL from frontend .env
BACKEND_URL = "https://emergency-sim-3.preview.emergentagent.com/api"

def investigate_existing_exercises():
    """Check existing exercises in database and examine their dynamic collections"""
    print("=" * 80)
    print("INVESTIGATING EXISTING EXERCISES AND DYNAMIC COLLECTIONS")
    print("=" * 80)
    
    try:
        # Step 1: Get all existing exercises
        print("\n1. Fetching all existing exercises...")
        response = requests.get(f"{BACKEND_URL}/exercise-builder")
        print(f"Status Code: {response.status_code}")
        
        if response.status_code != 200:
            print(f"❌ Failed to get exercises: {response.text}")
            return False
            
        exercises = response.json()
        print(f"✅ Found {len(exercises)} exercises in database")
        
        if len(exercises) == 0:
            print("⚠️  No exercises found in database")
            return True
            
        # Step 2: Examine each exercise's dynamic collections
        print(f"\n2. Examining dynamic collections for each exercise:")
        print("-" * 80)
        
        dynamic_fields = ['goals', 'objectives', 'events', 'functions', 'injections', 
                         'organizations', 'coordinators', 'codeWords', 'callsigns', 
                         'frequencies', 'assumptions', 'artificialities', 'safetyConcerns']
        
        for i, exercise in enumerate(exercises, 1):
            exercise_id = exercise.get('id', 'Unknown')
            exercise_name = exercise.get('exercise_name', 'Unknown')
            
            print(f"\nExercise {i}: {exercise_name}")
            print(f"ID: {exercise_id}")
            print(f"Type: {exercise.get('exercise_type', 'Unknown')}")
            print(f"Created: {exercise.get('created_at', 'Unknown')}")
            
            # Check each dynamic collection
            has_data = False
            empty_collections = []
            populated_collections = []
            
            for field in dynamic_fields:
                field_data = exercise.get(field, None)
                if field_data is None:
                    print(f"  ❌ {field}: None (missing field)")
                    empty_collections.append(field)
                elif not isinstance(field_data, list):
                    print(f"  ⚠️  {field}: Not a list - {type(field_data)} - {field_data}")
                elif len(field_data) == 0:
                    print(f"  📭 {field}: Empty list []")
                    empty_collections.append(field)
                else:
                    print(f"  📊 {field}: {len(field_data)} items")
                    if len(field_data) > 0:
                        print(f"     First item: {field_data[0]}")
                    populated_collections.append(field)
                    has_data = True
            
            # Summary for this exercise
            if has_data:
                print(f"  ✅ Exercise has dynamic data in {len(populated_collections)} collections")
                print(f"     Populated: {populated_collections}")
            else:
                print(f"  ❌ Exercise has NO dynamic data - all collections empty")
                
            if empty_collections:
                print(f"  📭 Empty collections ({len(empty_collections)}): {empty_collections}")
                
        return True
        
    except requests.exceptions.ConnectionError as e:
        print(f"❌ Connection Error: Cannot connect to {BACKEND_URL}")
        print(f"Error: {e}")
        return False
    except Exception as e:
        print(f"❌ Unexpected Error: {e}")
        return False

def test_specific_exercise_retrieval():
    """Test retrieving a specific exercise that should have dynamic collections data"""
    print("\n" + "=" * 80)
    print("TESTING SPECIFIC EXERCISE RETRIEVAL")
    print("=" * 80)
    
    try:
        # First get all exercises to find one to test
        response = requests.get(f"{BACKEND_URL}/exercise-builder")
        if response.status_code != 200:
            print(f"❌ Failed to get exercises: {response.text}")
            return False
            
        exercises = response.json()
        if len(exercises) == 0:
            print("⚠️  No exercises found to test specific retrieval")
            return True
            
        # Find an exercise with a meaningful name (likely created by previous tests)
        target_exercise = None
        for exercise in exercises:
            name = exercise.get('exercise_name', '')
            if any(keyword in name.lower() for keyword in ['dynamic', 'test', 'comprehensive', 'flood']):
                target_exercise = exercise
                break
                
        if not target_exercise:
            # Just use the first exercise
            target_exercise = exercises[0]
            
        exercise_id = target_exercise.get('id')
        exercise_name = target_exercise.get('exercise_name')
        
        print(f"\nTesting specific retrieval of: {exercise_name}")
        print(f"Exercise ID: {exercise_id}")
        
        # Test GET /api/exercise-builder/{id}
        response = requests.get(f"{BACKEND_URL}/exercise-builder/{exercise_id}")
        print(f"Status Code: {response.status_code}")
        
        if response.status_code != 200:
            print(f"❌ Failed to get specific exercise: {response.text}")
            return False
            
        retrieved_exercise = response.json()
        print(f"✅ Successfully retrieved exercise: {retrieved_exercise.get('exercise_name')}")
        
        # Examine dynamic collections in detail
        print(f"\nDetailed dynamic collections analysis:")
        dynamic_fields = ['goals', 'objectives', 'events', 'functions', 'injections', 
                         'organizations', 'coordinators', 'codeWords', 'callsigns', 
                         'frequencies', 'assumptions', 'artificialities', 'safetyConcerns']
        
        for field in dynamic_fields:
            field_data = retrieved_exercise.get(field, None)
            print(f"\n{field}:")
            if field_data is None:
                print(f"  ❌ Field is None")
            elif not isinstance(field_data, list):
                print(f"  ⚠️  Field is not a list: {type(field_data)} - {field_data}")
            elif len(field_data) == 0:
                print(f"  📭 Empty list: []")
            else:
                print(f"  📊 Contains {len(field_data)} items:")
                for j, item in enumerate(field_data):
                    print(f"    Item {j+1}: {item}")
                    
        return True
        
    except Exception as e:
        print(f"❌ Error in specific exercise retrieval test: {e}")
        return False

def test_complete_workflow():
    """Test complete workflow: Create exercise with dynamic data → Retrieve → Verify"""
    print("\n" + "=" * 80)
    print("TESTING COMPLETE WORKFLOW: CREATE → RETRIEVE → VERIFY")
    print("=" * 80)
    
    # Create comprehensive test data
    test_data = {
        "exercise_name": "Dynamic Data Investigation Test",
        "exercise_type": "Table Top",
        "exercise_description": "Testing dynamic collections data persistence for investigation",
        "location": "Investigation Test Center",
        "start_date": "2024-12-15T14:00:00Z",
        "start_time": "14:00",
        "end_date": "2024-12-15T18:00:00Z",
        "end_time": "18:00",
        "scope_description": "Investigation scope",
        "purpose_description": "Investigation purpose",
        "scenario_name": "Investigation Scenario",
        "scenario_description": "Testing scenario for investigation",
        # Comprehensive dynamic collections
        "goals": [
            {"id": "goal-1", "name": "Investigation Goal 1", "description": "First investigation goal", "achieved": "No"},
            {"id": "goal-2", "name": "Investigation Goal 2", "description": "Second investigation goal", "achieved": "Partial"}
        ],
        "objectives": [
            {"id": "obj-1", "name": "Investigation Objective 1", "description": "First investigation objective", "achieved": "Yes"},
            {"id": "obj-2", "name": "Investigation Objective 2", "description": "Second investigation objective", "achieved": "No"}
        ],
        "events": [
            {"id": "event-1", "name": "Investigation Event 1", "description": "First investigation event", "actions": "Take action 1"},
            {"id": "event-2", "name": "Investigation Event 2", "description": "Second investigation event", "actions": "Take action 2"}
        ],
        "functions": [
            {"id": "func-1", "name": "Investigation Function 1", "description": "First investigation function", "achieved": "Partial"}
        ],
        "organizations": [
            {"id": "org-1", "name": "Investigation Org 1", "description": "First investigation organization", "contact": "Contact 1"}
        ],
        "codeWords": [
            {"id": "code-1", "word": "INVESTIGATE", "definition": "Investigation code word"}
        ],
        "callsigns": [
            {"id": "call-1", "callsign": "INVEST-1", "definition": "Investigation callsign"}
        ],
        "frequencies": [
            {"id": "freq-1", "name": "Investigation Freq", "frequency": "146.520", "description": "Investigation frequency"}
        ],
        "assumptions": [
            {"id": "assume-1", "name": "Investigation Assumption", "assumption": "Investigation will reveal the issue"}
        ],
        "artificialities": [
            {"id": "art-1", "name": "Investigation Artificiality", "artificiality": "Simulated investigation environment"}
        ],
        "safetyConcerns": [
            {"id": "safety-1", "name": "Investigation Safety", "concern": "Safety during investigation"}
        ]
    }
    
    created_exercise_id = None
    
    try:
        # Step 1: Create exercise with comprehensive dynamic data
        print("\n1. Creating exercise with comprehensive dynamic collections...")
        response = requests.post(
            f"{BACKEND_URL}/exercise-builder",
            json=test_data,
            headers={"Content-Type": "application/json"}
        )
        print(f"Status Code: {response.status_code}")
        
        if response.status_code != 200:
            print(f"❌ Failed to create exercise: {response.text}")
            return False
            
        created_exercise = response.json()
        created_exercise_id = created_exercise.get("id")
        print(f"✅ Successfully created exercise with ID: {created_exercise_id}")
        
        # Verify creation data
        print(f"\nVerifying created exercise dynamic collections:")
        dynamic_fields = ['goals', 'objectives', 'events', 'functions', 'organizations', 
                         'codeWords', 'callsigns', 'frequencies', 'assumptions', 'artificialities', 'safetyConcerns']
        
        creation_success = True
        for field in dynamic_fields:
            expected_data = test_data.get(field, [])
            actual_data = created_exercise.get(field, [])
            
            if len(expected_data) != len(actual_data):
                print(f"  ❌ {field}: Expected {len(expected_data)} items, got {len(actual_data)}")
                creation_success = False
            elif actual_data == expected_data:
                print(f"  ✅ {field}: {len(actual_data)} items - data matches exactly")
            else:
                print(f"  ⚠️  {field}: {len(actual_data)} items - data differs")
                print(f"     Expected: {expected_data}")
                print(f"     Actual: {actual_data}")
                
        if not creation_success:
            print("❌ Creation verification failed")
            return False
            
        # Step 2: Immediately retrieve the exercise
        print(f"\n2. Immediately retrieving created exercise...")
        response = requests.get(f"{BACKEND_URL}/exercise-builder/{created_exercise_id}")
        print(f"Status Code: {response.status_code}")
        
        if response.status_code != 200:
            print(f"❌ Failed to retrieve exercise: {response.text}")
            return False
            
        retrieved_exercise = response.json()
        print(f"✅ Successfully retrieved exercise: {retrieved_exercise.get('exercise_name')}")
        
        # Step 3: Verify data persistence
        print(f"\n3. Verifying data persistence...")
        persistence_success = True
        
        for field in dynamic_fields:
            expected_data = test_data.get(field, [])
            retrieved_data = retrieved_exercise.get(field, [])
            
            if len(expected_data) != len(retrieved_data):
                print(f"  ❌ {field}: Expected {len(expected_data)} items, retrieved {len(retrieved_data)}")
                print(f"     Expected: {expected_data}")
                print(f"     Retrieved: {retrieved_data}")
                persistence_success = False
            elif retrieved_data == expected_data:
                print(f"  ✅ {field}: {len(retrieved_data)} items - persistence verified")
            else:
                print(f"  ⚠️  {field}: {len(retrieved_data)} items - data differs after retrieval")
                print(f"     Expected: {expected_data}")
                print(f"     Retrieved: {retrieved_data}")
                
        if persistence_success:
            print(f"\n✅ ALL DYNAMIC COLLECTIONS PERSISTED CORRECTLY")
        else:
            print(f"\n❌ SOME DYNAMIC COLLECTIONS DID NOT PERSIST CORRECTLY")
            
        # Step 4: Test the exercise appears in list with correct data
        print(f"\n4. Verifying exercise appears in list with correct data...")
        response = requests.get(f"{BACKEND_URL}/exercise-builder")
        if response.status_code == 200:
            all_exercises = response.json()
            found_exercise = None
            for ex in all_exercises:
                if ex.get('id') == created_exercise_id:
                    found_exercise = ex
                    break
                    
            if found_exercise:
                print(f"✅ Exercise found in list")
                # Quick check of dynamic collections in list
                list_goals = found_exercise.get('goals', [])
                list_objectives = found_exercise.get('objectives', [])
                print(f"  Goals in list: {len(list_goals)} items")
                print(f"  Objectives in list: {len(list_objectives)} items")
                
                if len(list_goals) == len(test_data['goals']) and len(list_objectives) == len(test_data['objectives']):
                    print(f"  ✅ Dynamic collections correct in exercise list")
                else:
                    print(f"  ❌ Dynamic collections incorrect in exercise list")
            else:
                print(f"❌ Exercise not found in list")
                
        # Clean up
        if created_exercise_id:
            print(f"\n5. Cleaning up test exercise...")
            requests.delete(f"{BACKEND_URL}/exercise-builder/{created_exercise_id}")
            print(f"🧹 Test exercise deleted")
            
        return persistence_success
        
    except Exception as e:
        print(f"❌ Error in complete workflow test: {e}")
        # Clean up on error
        if created_exercise_id:
            try:
                requests.delete(f"{BACKEND_URL}/exercise-builder/{created_exercise_id}")
                print(f"🧹 Cleaned up test exercise after error")
            except:
                pass
        return False

def main():
    """Main investigation function"""
    print("DYNAMIC COLLECTIONS DATA PERSISTENCE INVESTIGATION")
    print(f"Backend URL: {BACKEND_URL}")
    print("=" * 80)
    
    # Test API health first
    try:
        response = requests.get(f"{BACKEND_URL}/")
        if response.status_code != 200:
            print("❌ API is not responding. Cannot proceed with investigation.")
            return False
        print("✅ API is responding")
    except Exception as e:
        print(f"❌ API health check failed: {e}")
        return False
    
    # Run investigations
    success = True
    
    # Investigation 1: Check existing exercises
    if not investigate_existing_exercises():
        success = False
        
    # Investigation 2: Test specific exercise retrieval
    if not test_specific_exercise_retrieval():
        success = False
        
    # Investigation 3: Test complete workflow
    if not test_complete_workflow():
        success = False
        
    print("\n" + "=" * 80)
    if success:
        print("🎉 INVESTIGATION COMPLETED - ALL TESTS PASSED")
        print("✅ Backend API is working correctly for dynamic collections")
        print("✅ Data persistence is working as expected")
        print("⚠️  If frontend is showing empty arrays, the issue is likely in:")
        print("   - Frontend data loading logic")
        print("   - Frontend state management")
        print("   - Frontend API call implementation")
        print("   - Frontend data parsing/processing")
    else:
        print("💥 INVESTIGATION FOUND ISSUES")
        print("❌ Some backend functionality is not working correctly")
    print("=" * 80)
    
    return success

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
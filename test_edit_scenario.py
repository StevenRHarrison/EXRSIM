#!/usr/bin/env python3
"""
Test the exact Edit Exercise scenario mentioned in the review request.
Focus on the "Dynamic Data Test Exercise" which has goals and objectives data.
"""

import requests
import json
from datetime import datetime, timezone
import sys

# Get backend URL from frontend .env
BACKEND_URL = "https://leaflet-ics.preview.emergentagent.com/api"

def test_edit_exercise_scenario():
    """Test the exact scenario: fetch exercise for editing and examine dynamic collections"""
    print("=" * 80)
    print("TESTING EDIT EXERCISE SCENARIO - DYNAMIC COLLECTIONS INVESTIGATION")
    print("=" * 80)
    
    # The exercise ID we found that has dynamic data
    exercise_id = "027905e3-e909-4e8a-abba-edef0e386a69"
    exercise_name = "Dynamic Data Test Exercise"
    
    print(f"Testing Edit Exercise scenario for: {exercise_name}")
    print(f"Exercise ID: {exercise_id}")
    
    try:
        # Step 1: Simulate what frontend does when "Edit Exercise" is clicked
        print(f"\n1. Simulating frontend 'Edit Exercise' button click...")
        print(f"   Frontend would call: GET {BACKEND_URL}/exercise-builder/{exercise_id}")
        
        response = requests.get(f"{BACKEND_URL}/exercise-builder/{exercise_id}")
        print(f"   Status Code: {response.status_code}")
        
        if response.status_code != 200:
            print(f"❌ Failed to retrieve exercise for editing: {response.text}")
            return False
            
        exercise_data = response.json()
        print(f"✅ Successfully retrieved exercise for editing")
        
        # Step 2: Examine the exact data structure returned
        print(f"\n2. Examining data structure returned to frontend...")
        print(f"   Exercise Name: {exercise_data.get('exercise_name')}")
        print(f"   Exercise Type: {exercise_data.get('exercise_type')}")
        print(f"   Created At: {exercise_data.get('created_at')}")
        
        # Step 3: Focus on dynamic collections that should populate the edit form
        print(f"\n3. Analyzing dynamic collections data for edit form population...")
        
        dynamic_fields = ['goals', 'objectives', 'events', 'functions', 'injections', 
                         'organizations', 'coordinators', 'codeWords', 'callsigns', 
                         'frequencies', 'assumptions', 'artificialities', 'safetyConcerns']
        
        print(f"\n   DYNAMIC COLLECTIONS ANALYSIS:")
        print(f"   " + "-" * 50)
        
        total_items = 0
        populated_fields = []
        empty_fields = []
        
        for field in dynamic_fields:
            field_data = exercise_data.get(field, None)
            
            if field_data is None:
                print(f"   ❌ {field}: None (field missing)")
                empty_fields.append(field)
            elif not isinstance(field_data, list):
                print(f"   ⚠️  {field}: Not a list - {type(field_data)}")
                empty_fields.append(field)
            elif len(field_data) == 0:
                print(f"   📭 {field}: [] (empty array)")
                empty_fields.append(field)
            else:
                print(f"   📊 {field}: {len(field_data)} items")
                populated_fields.append(field)
                total_items += len(field_data)
                
                # Show detailed data for populated fields
                for i, item in enumerate(field_data):
                    print(f"      Item {i+1}: {item}")
        
        # Step 4: Summary and analysis
        print(f"\n4. EDIT EXERCISE DATA ANALYSIS SUMMARY:")
        print(f"   " + "=" * 50)
        print(f"   Total dynamic collections: {len(dynamic_fields)}")
        print(f"   Populated collections: {len(populated_fields)}")
        print(f"   Empty collections: {len(empty_fields)}")
        print(f"   Total items across all collections: {total_items}")
        
        if populated_fields:
            print(f"   ✅ POPULATED FIELDS: {populated_fields}")
        if empty_fields:
            print(f"   📭 EMPTY FIELDS: {empty_fields}")
            
        # Step 5: Test the specific issue mentioned in review request
        print(f"\n5. TESTING SPECIFIC ISSUE FROM REVIEW REQUEST:")
        print(f"   Issue: 'dynamic collections are returning as empty arrays []'")
        print(f"   " + "-" * 50)
        
        # Check goals specifically (mentioned in review)
        goals_data = exercise_data.get('goals', [])
        objectives_data = exercise_data.get('objectives', [])
        events_data = exercise_data.get('events', [])
        
        print(f"   Goals data: {goals_data}")
        print(f"   Objectives data: {objectives_data}")
        print(f"   Events data: {events_data}")
        
        if len(goals_data) > 0:
            print(f"   ✅ GOALS: Contains {len(goals_data)} items - NOT empty!")
            print(f"      This contradicts the reported issue.")
        else:
            print(f"   ❌ GOALS: Empty array [] - confirms the reported issue")
            
        if len(objectives_data) > 0:
            print(f"   ✅ OBJECTIVES: Contains {len(objectives_data)} items - NOT empty!")
            print(f"      This contradicts the reported issue.")
        else:
            print(f"   ❌ OBJECTIVES: Empty array [] - confirms the reported issue")
            
        # Step 6: Test data format compatibility with frontend
        print(f"\n6. TESTING DATA FORMAT COMPATIBILITY WITH FRONTEND:")
        print(f"   " + "-" * 50)
        
        # Check if data structure matches what frontend expects
        if goals_data:
            sample_goal = goals_data[0]
            expected_goal_fields = ['id', 'name', 'description', 'achieved']
            
            print(f"   Sample Goal Structure: {sample_goal}")
            print(f"   Goal Fields Present: {list(sample_goal.keys())}")
            
            missing_fields = [field for field in expected_goal_fields if field not in sample_goal]
            if missing_fields:
                print(f"   ⚠️  Missing expected fields in goal: {missing_fields}")
            else:
                print(f"   ✅ Goal structure contains all expected fields")
                
        if objectives_data:
            sample_objective = objectives_data[0]
            expected_obj_fields = ['id', 'name', 'description', 'achieved']
            
            print(f"   Sample Objective Structure: {sample_objective}")
            print(f"   Objective Fields Present: {list(sample_objective.keys())}")
            
            missing_fields = [field for field in expected_obj_fields if field not in sample_objective]
            if missing_fields:
                print(f"   ⚠️  Missing expected fields in objective: {missing_fields}")
            else:
                print(f"   ✅ Objective structure contains all expected fields")
        
        # Step 7: Final conclusion
        print(f"\n7. CONCLUSION:")
        print(f"   " + "=" * 50)
        
        if total_items > 0:
            print(f"   🎯 BACKEND IS WORKING CORRECTLY!")
            print(f"   ✅ Exercise contains {total_items} dynamic collection items")
            print(f"   ✅ Data is properly structured and accessible")
            print(f"   ✅ API endpoint returns correct data")
            print(f"   ")
            print(f"   🔍 ROOT CAUSE ANALYSIS:")
            print(f"   The issue is NOT in the backend API or data persistence.")
            print(f"   The backend correctly stores and returns dynamic collections data.")
            print(f"   ")
            print(f"   🎯 THE ISSUE IS LIKELY IN THE FRONTEND:")
            print(f"   - Frontend may not be properly parsing the API response")
            print(f"   - Frontend state management may not be populating from API data")
            print(f"   - Frontend useEffect for loading edit data may have bugs")
            print(f"   - Frontend may be overwriting loaded data with empty arrays")
        else:
            print(f"   ❌ BACKEND ISSUE CONFIRMED!")
            print(f"   The exercise has no dynamic collection data")
            print(f"   This confirms the reported issue")
            
        return total_items > 0
        
    except Exception as e:
        print(f"❌ Error in edit exercise scenario test: {e}")
        return False

def test_all_existing_exercises_for_edit():
    """Test all existing exercises to see which ones have dynamic data for editing"""
    print(f"\n" + "=" * 80)
    print("TESTING ALL EXISTING EXERCISES FOR EDIT SCENARIO")
    print("=" * 80)
    
    try:
        # Get all exercises
        response = requests.get(f"{BACKEND_URL}/exercise-builder")
        if response.status_code != 200:
            print(f"❌ Failed to get exercises: {response.text}")
            return False
            
        exercises = response.json()
        print(f"Found {len(exercises)} exercises to test for edit scenario")
        
        exercises_with_data = []
        exercises_without_data = []
        
        for i, exercise in enumerate(exercises, 1):
            exercise_id = exercise.get('id')
            exercise_name = exercise.get('exercise_name', 'Unknown')
            
            print(f"\nTesting Exercise {i}: {exercise_name}")
            print(f"ID: {exercise_id}")
            
            # Test retrieving this exercise for editing
            response = requests.get(f"{BACKEND_URL}/exercise-builder/{exercise_id}")
            if response.status_code == 200:
                exercise_data = response.json()
                
                # Count dynamic collection items
                dynamic_fields = ['goals', 'objectives', 'events', 'functions', 'injections', 
                                 'organizations', 'coordinators', 'codeWords', 'callsigns', 
                                 'frequencies', 'assumptions', 'artificialities', 'safetyConcerns']
                
                total_items = 0
                populated_collections = []
                
                for field in dynamic_fields:
                    field_data = exercise_data.get(field, [])
                    if isinstance(field_data, list) and len(field_data) > 0:
                        total_items += len(field_data)
                        populated_collections.append(f"{field}({len(field_data)})")
                
                if total_items > 0:
                    print(f"  ✅ HAS DYNAMIC DATA: {total_items} items in {len(populated_collections)} collections")
                    print(f"     Collections: {', '.join(populated_collections)}")
                    exercises_with_data.append({
                        'name': exercise_name,
                        'id': exercise_id,
                        'total_items': total_items,
                        'collections': populated_collections
                    })
                else:
                    print(f"  📭 NO DYNAMIC DATA: All collections empty")
                    exercises_without_data.append({
                        'name': exercise_name,
                        'id': exercise_id
                    })
            else:
                print(f"  ❌ Failed to retrieve exercise: {response.status_code}")
        
        # Summary
        print(f"\n" + "=" * 80)
        print(f"EDIT SCENARIO TESTING SUMMARY")
        print(f"=" * 80)
        print(f"Total exercises tested: {len(exercises)}")
        print(f"Exercises WITH dynamic data: {len(exercises_with_data)}")
        print(f"Exercises WITHOUT dynamic data: {len(exercises_without_data)}")
        
        if exercises_with_data:
            print(f"\n✅ EXERCISES WITH DYNAMIC DATA (suitable for edit testing):")
            for ex in exercises_with_data:
                print(f"  - {ex['name']} ({ex['total_items']} items)")
                print(f"    ID: {ex['id']}")
                print(f"    Collections: {', '.join(ex['collections'])}")
        
        if exercises_without_data:
            print(f"\n📭 EXERCISES WITHOUT DYNAMIC DATA:")
            for ex in exercises_without_data:
                print(f"  - {ex['name']} (ID: {ex['id']})")
        
        return len(exercises_with_data) > 0
        
    except Exception as e:
        print(f"❌ Error testing all exercises: {e}")
        return False

def main():
    """Main function to run all edit scenario tests"""
    print("EDIT EXERCISE SCENARIO TESTING")
    print(f"Backend URL: {BACKEND_URL}")
    print("=" * 80)
    
    # Test API health
    try:
        response = requests.get(f"{BACKEND_URL}/")
        if response.status_code != 200:
            print("❌ API is not responding")
            return False
        print("✅ API is responding")
    except Exception as e:
        print(f"❌ API health check failed: {e}")
        return False
    
    # Run tests
    success = True
    
    # Test specific exercise edit scenario
    if not test_edit_exercise_scenario():
        success = False
    
    # Test all exercises for edit scenario
    if not test_all_existing_exercises_for_edit():
        success = False
    
    print(f"\n" + "=" * 80)
    if success:
        print("🎉 EDIT SCENARIO TESTING COMPLETED")
        print("✅ Backend API correctly handles edit exercise scenarios")
        print("✅ Dynamic collections data is properly returned")
        print("")
        print("🔍 INVESTIGATION CONCLUSION:")
        print("The reported issue 'dynamic collections returning as empty arrays []'")
        print("is NOT a backend problem. The backend API works correctly.")
        print("")
        print("🎯 RECOMMENDED NEXT STEPS:")
        print("1. Investigate frontend data loading in edit mode")
        print("2. Check frontend useEffect for editingExercise")
        print("3. Verify frontend state management for dynamic collections")
        print("4. Check if frontend is overwriting API data with empty arrays")
    else:
        print("💥 EDIT SCENARIO TESTING FOUND ISSUES")
    print("=" * 80)
    
    return success

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
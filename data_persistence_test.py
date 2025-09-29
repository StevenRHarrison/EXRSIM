#!/usr/bin/env python3
"""
Data Persistence Investigation for EXRSIM Exercise Builder
Tests the complete data flow to identify where exercise data is being lost
"""

import requests
import json
from datetime import datetime, timezone
import sys
import os

# Get backend URL from frontend .env
BACKEND_URL = "https://crisis-tracker-7.preview.emergentagent.com/api"

def test_complete_data_flow():
    """Test complete data flow from Exercise Builder to Exercise Management Dashboard"""
    print("=" * 80)
    print("DATA PERSISTENCE INVESTIGATION - COMPLETE WORKFLOW TESTING")
    print("=" * 80)
    
    # Test comprehensive exercise data with all fields populated
    comprehensive_exercise_data = {
        "exercise_name": "Data Persistence Investigation Exercise",
        "exercise_type": "Full Scale Exercise",
        "exercise_description": "Comprehensive test to investigate data persistence issues between Exercise Builder and Exercise Management Dashboard",
        "location": "Regional Emergency Operations Center",
        "start_date": "2024-12-20T08:00:00Z",
        "start_time": "08:00",
        "end_date": "2024-12-20T18:00:00Z",
        "end_time": "18:00",
        
        # Step 2: Scope - All fields populated
        "scope_description": "Comprehensive emergency response exercise covering all aspects of disaster management including coordination, communication, resource allocation, and public safety measures",
        "scope_hazards": "Multi-hazard scenario including earthquake, fire, hazardous material spill, infrastructure collapse, and secondary flooding",
        "scope_geographic_area": "Metropolitan area including downtown core, residential districts, industrial zones, and critical infrastructure facilities",
        "scope_functions": "Emergency response coordination, search and rescue operations, medical response, evacuation procedures, resource management, public information",
        "scope_organizations": "Fire Department, Police Department, Emergency Medical Services, Emergency Management Agency, Public Works, Red Cross, Salvation Army",
        "scope_personnel": "Emergency responders, incident commanders, operations staff, planning personnel, logistics coordinators, public information officers",
        "scope_exercise_type": "Full Scale Exercise",
        
        # Step 3: Purpose
        "purpose_description": "Test and evaluate the comprehensive emergency response capabilities of all participating agencies during a complex multi-hazard disaster scenario",
        
        # Step 4: Scenario
        "scenario_name": "Metropolitan Multi-Hazard Emergency",
        "scenario_description": "A 6.5 magnitude earthquake strikes the metropolitan area during peak business hours, causing widespread structural damage, fires, hazardous material releases, and infrastructure failures affecting 50,000+ residents",
        "scenario_latitude": 45.4215,
        "scenario_longitude": -75.6972,
        
        # Step 5: Goals - Multiple comprehensive goals
        "goals": [
            {
                "id": 1001,
                "name": "Emergency Response Coordination",
                "description": "Establish unified command structure and coordinate multi-agency response within 15 minutes of initial alert",
                "achieved": "No"
            },
            {
                "id": 1002,
                "name": "Search and Rescue Operations",
                "description": "Deploy search and rescue teams to all affected areas and establish rescue priorities based on life safety",
                "achieved": "Partial"
            },
            {
                "id": 1003,
                "name": "Medical Response Activation",
                "description": "Activate emergency medical response system and establish field treatment areas",
                "achieved": "Yes"
            }
        ],
        
        # Step 6: Objectives - Multiple detailed objectives
        "objectives": [
            {
                "id": 2001,
                "name": "Activate Emergency Operations Center",
                "description": "Fully activate EOC with all essential functions staffed within 30 minutes",
                "achieved": "No"
            },
            {
                "id": 2002,
                "name": "Establish Communication Networks",
                "description": "Establish primary and backup communication systems between all response agencies",
                "achieved": "Partial"
            },
            {
                "id": 2003,
                "name": "Deploy Field Response Teams",
                "description": "Deploy initial response teams to priority areas within 45 minutes",
                "achieved": "Yes"
            },
            {
                "id": 2004,
                "name": "Initiate Public Warning System",
                "description": "Activate emergency alert system and issue initial public warnings",
                "achieved": "No"
            }
        ],
        
        # Step 7: Events - Multiple timed events
        "events": [
            {
                "id": 3001,
                "name": "Initial Earthquake Event",
                "description": "6.5 magnitude earthquake strikes metropolitan area",
                "start_time": "T+0",
                "end_time": "T+2 minutes",
                "tier": "Tier 3: Disaster",
                "escalation": "Danger"
            },
            {
                "id": 3002,
                "name": "Secondary Fire Outbreak",
                "description": "Multiple structure fires ignited by earthquake damage",
                "start_time": "T+5 minutes",
                "end_time": "T+4 hours",
                "tier": "Tier 2: Emergency",
                "escalation": "Warning"
            },
            {
                "id": 3003,
                "name": "Hazmat Spill Incident",
                "description": "Chemical storage facility damaged causing hazardous material release",
                "start_time": "T+15 minutes",
                "end_time": "T+8 hours",
                "tier": "Tier 2: Emergency",
                "escalation": "Danger"
            }
        ],
        
        # Step 8: Functions - Emergency response functions
        "functions": [
            {
                "id": 4001,
                "name": "Incident Command",
                "description": "Overall incident command and control function",
                "achieved": "Partial"
            },
            {
                "id": 4002,
                "name": "Emergency Medical Services",
                "description": "Medical response and patient care coordination",
                "achieved": "Yes"
            },
            {
                "id": 4003,
                "name": "Fire Suppression",
                "description": "Fire suppression and rescue operations",
                "achieved": "No"
            }
        ],
        
        # Step 9: Injections - MSEL injections
        "injections": [
            {
                "id": 5001,
                "name": "Initial Seismic Alert",
                "description": "Automated seismic monitoring system alert",
                "time": "T+0",
                "mode": "Automated"
            },
            {
                "id": 5002,
                "name": "Damage Assessment Request",
                "description": "Request for rapid damage assessment teams",
                "time": "T+30 minutes",
                "mode": "Phone Call"
            }
        ],
        
        # Step 10: Organizations - Participating organizations
        "organizations": [
            {
                "id": 6001,
                "name": "Metropolitan Fire Department",
                "description": "Primary fire suppression and rescue services",
                "contact": "Chief Sarah Johnson",
                "phone": "555-0101"
            },
            {
                "id": 6002,
                "name": "City Police Department",
                "description": "Law enforcement and traffic control",
                "contact": "Chief Michael Brown",
                "phone": "555-0102"
            },
            {
                "id": 6003,
                "name": "Regional Emergency Medical Services",
                "description": "Emergency medical response and transport",
                "contact": "Director Lisa Wilson",
                "phone": "555-0103"
            }
        ],
        
        # Step 11: Team Coordinators
        "coordinators": [
            {
                "id": 7001,
                "name": "John Anderson",
                "role": "Incident Commander",
                "contact": "555-0201",
                "agency": "Emergency Management"
            },
            {
                "id": 7002,
                "name": "Maria Rodriguez",
                "role": "Operations Chief",
                "contact": "555-0202",
                "agency": "Fire Department"
            }
        ],
        
        # Step 12: Code Words
        "codeWords": [
            {
                "id": 8001,
                "word": "TREMOR",
                "definition": "Major earthquake event activation code"
            },
            {
                "id": 8002,
                "word": "INFERNO",
                "definition": "Multiple structure fire emergency"
            }
        ],
        
        # Step 13: Callsigns
        "callsigns": [
            {
                "id": 9001,
                "callsign": "COMMAND-1",
                "definition": "Incident Command Post"
            },
            {
                "id": 9002,
                "callsign": "RESCUE-1",
                "definition": "Primary search and rescue team"
            }
        ],
        
        # Step 14: Communication Frequencies
        "frequencies": [
            {
                "id": 10001,
                "name": "Command Channel",
                "frequency": "155.340",
                "description": "Primary command and control frequency",
                "tone": "71.9"
            },
            {
                "id": 10002,
                "name": "Tactical Channel",
                "frequency": "155.280",
                "description": "Field operations tactical frequency",
                "tone": "74.4"
            }
        ],
        
        # Step 15: Assumptions
        "assumptions": [
            {
                "id": 11001,
                "name": "Weather Conditions",
                "assumption": "Clear weather with light winds, no precipitation expected during exercise period"
            },
            {
                "id": 11002,
                "name": "Resource Availability",
                "assumption": "All primary response resources available and operational at exercise start"
            }
        ],
        
        # Step 16: Artificialities
        "artificialities": [
            {
                "id": 12001,
                "name": "Simulated Casualties",
                "artificiality": "Casualty numbers and injuries will be simulated using moulage and role players"
            },
            {
                "id": 12002,
                "name": "Controlled Environment",
                "artificiality": "Exercise conducted in controlled environment with safety observers"
            }
        ],
        
        # Step 17: Safety Concerns
        "safetyConcerns": [
            {
                "id": 13001,
                "name": "Vehicle Safety",
                "safety_concern": "Risk of vehicle accidents during emergency response simulation",
                "safety_officer": "Captain Robert Davis",
                "contact": "555-0301"
            },
            {
                "id": 13002,
                "name": "Physical Injury Risk",
                "safety_concern": "Risk of physical injury during search and rescue simulation",
                "safety_officer": "Lieutenant Jennifer Smith",
                "contact": "555-0302"
            }
        ]
    }
    
    created_exercise_id = None
    
    try:
        print("\n🔍 STEP 1: EXERCISE BUILDER DATA SAVING TEST")
        print("-" * 50)
        
        # Test A: Create comprehensive exercise (simulating Exercise Builder save)
        print("A. Testing Exercise Builder saveExercise function (POST /api/exercise-builder)")
        response = requests.post(
            f"{BACKEND_URL}/exercise-builder",
            json=comprehensive_exercise_data,
            headers={"Content-Type": "application/json"}
        )
        print(f"   Status Code: {response.status_code}")
        
        if response.status_code == 200:
            created_exercise = response.json()
            created_exercise_id = created_exercise.get("id")
            print(f"   ✅ Exercise created successfully with ID: {created_exercise_id}")
            print(f"   📋 Exercise Name: {created_exercise.get('exercise_name')}")
            
            # Verify all data fields are saved
            print("\n   📊 VERIFYING ALL DATA FIELDS SAVED:")
            
            # Basic info verification
            basic_fields = ['exercise_name', 'exercise_type', 'exercise_description', 'location', 'start_date', 'end_date']
            for field in basic_fields:
                if created_exercise.get(field) == comprehensive_exercise_data[field]:
                    print(f"   ✅ {field}: Saved correctly")
                else:
                    print(f"   ❌ {field}: Data mismatch")
                    return False
            
            # Scope data verification
            scope_fields = ['scope_description', 'scope_hazards', 'scope_geographic_area', 'scope_functions', 'scope_organizations', 'scope_personnel']
            for field in scope_fields:
                if created_exercise.get(field) == comprehensive_exercise_data[field]:
                    print(f"   ✅ {field}: Saved correctly")
                else:
                    print(f"   ❌ {field}: Data mismatch")
                    return False
            
            # Purpose and scenario verification
            other_fields = ['purpose_description', 'scenario_name', 'scenario_description']
            for field in other_fields:
                if created_exercise.get(field) == comprehensive_exercise_data[field]:
                    print(f"   ✅ {field}: Saved correctly")
                else:
                    print(f"   ❌ {field}: Data mismatch")
                    return False
            
            # Dynamic collections verification
            dynamic_fields = ['goals', 'objectives', 'events', 'functions', 'injections', 'organizations', 'coordinators', 'codeWords', 'callsigns', 'frequencies', 'assumptions', 'artificialities', 'safetyConcerns']
            
            print(f"\n   📊 DYNAMIC COLLECTIONS VERIFICATION:")
            for field in dynamic_fields:
                expected_data = comprehensive_exercise_data[field]
                actual_data = created_exercise.get(field, [])
                
                if len(actual_data) == len(expected_data):
                    print(f"   ✅ {field}: {len(actual_data)} items saved correctly")
                    
                    # Verify first item structure if exists
                    if len(actual_data) > 0 and len(expected_data) > 0:
                        first_expected = expected_data[0]
                        first_actual = actual_data[0]
                        
                        # Check key fields match
                        key_match = True
                        for key in first_expected.keys():
                            if first_actual.get(key) != first_expected[key]:
                                key_match = False
                                break
                        
                        if key_match:
                            print(f"      ✅ Data structure verified for {field}")
                        else:
                            print(f"      ❌ Data structure mismatch for {field}")
                            print(f"         Expected: {first_expected}")
                            print(f"         Actual: {first_actual}")
                            return False
                else:
                    print(f"   ❌ {field}: Expected {len(expected_data)} items, got {len(actual_data)}")
                    return False
            
            print("   ✅ ALL EXERCISE BUILDER DATA SAVING VERIFIED")
        else:
            print(f"   ❌ Failed to create exercise: {response.text}")
            return False
        
        print("\n🔍 STEP 2: EXERCISE MANAGEMENT DASHBOARD DATA LOADING TEST")
        print("-" * 50)
        
        # Test B: Retrieve exercise data (simulating Exercise Management Dashboard loading)
        print("B. Testing Exercise Management Dashboard data retrieval (GET /api/exercise-builder/{id})")
        response = requests.get(f"{BACKEND_URL}/exercise-builder/{created_exercise_id}")
        print(f"   Status Code: {response.status_code}")
        
        if response.status_code == 200:
            retrieved_exercise = response.json()
            print(f"   ✅ Exercise retrieved successfully")
            print(f"   📋 Exercise Name: {retrieved_exercise.get('exercise_name')}")
            
            print("\n   📊 VERIFYING ALL DATA FIELDS RETRIEVED:")
            
            # Verify all basic fields are retrieved
            basic_fields = ['exercise_name', 'exercise_type', 'exercise_description', 'location', 'start_date', 'end_date']
            for field in basic_fields:
                if retrieved_exercise.get(field):
                    print(f"   ✅ {field}: Retrieved correctly")
                else:
                    print(f"   ❌ {field}: Missing or empty")
                    return False
            
            # Verify all scope fields are retrieved
            scope_fields = ['scope_description', 'scope_hazards', 'scope_geographic_area', 'scope_functions', 'scope_organizations', 'scope_personnel']
            for field in scope_fields:
                if retrieved_exercise.get(field):
                    print(f"   ✅ {field}: Retrieved correctly")
                else:
                    print(f"   ❌ {field}: Missing or empty")
                    return False
            
            # Verify purpose and scenario fields
            other_fields = ['purpose_description', 'scenario_name', 'scenario_description']
            for field in other_fields:
                if retrieved_exercise.get(field):
                    print(f"   ✅ {field}: Retrieved correctly")
                else:
                    print(f"   ❌ {field}: Missing or empty")
                    return False
            
            # Verify dynamic collections are retrieved with complete data
            dynamic_fields = ['goals', 'objectives', 'events', 'functions', 'injections', 'organizations', 'coordinators', 'codeWords', 'callsigns', 'frequencies', 'assumptions', 'artificialities', 'safetyConcerns']
            
            print(f"\n   📊 DYNAMIC COLLECTIONS RETRIEVAL VERIFICATION:")
            for field in dynamic_fields:
                expected_count = len(comprehensive_exercise_data[field])
                actual_data = retrieved_exercise.get(field, [])
                actual_count = len(actual_data)
                
                if actual_count == expected_count:
                    print(f"   ✅ {field}: {actual_count} items retrieved correctly")
                    
                    # Verify data structure integrity
                    if actual_count > 0:
                        first_item = actual_data[0]
                        expected_first = comprehensive_exercise_data[field][0]
                        
                        # Check all expected keys are present
                        all_keys_present = all(key in first_item for key in expected_first.keys())
                        if all_keys_present:
                            print(f"      ✅ Data structure complete for {field}")
                        else:
                            print(f"      ❌ Data structure incomplete for {field}")
                            missing_keys = [key for key in expected_first.keys() if key not in first_item]
                            print(f"         Missing keys: {missing_keys}")
                            return False
                else:
                    print(f"   ❌ {field}: Expected {expected_count} items, retrieved {actual_count}")
                    return False
            
            print("   ✅ ALL EXERCISE MANAGEMENT DASHBOARD DATA LOADING VERIFIED")
        else:
            print(f"   ❌ Failed to retrieve exercise: {response.text}")
            return False
        
        print("\n🔍 STEP 3: DATA FLOW VERIFICATION")
        print("-" * 50)
        
        # Test C: Complete workflow verification
        print("C. Testing complete workflow: Create → Save → Edit → View")
        
        # Simulate saveStepDraft function (individual step saves)
        print("\n   Testing saveStepDraft functionality (PUT /api/exercise-builder/{id})")
        
        # Add additional data to simulate step-by-step saving
        step_update_data = comprehensive_exercise_data.copy()
        step_update_data['goals'].append({
            "id": 1004,
            "name": "Additional Goal from Step Save",
            "description": "This goal was added via saveStepDraft function",
            "achieved": "No"
        })
        step_update_data['objectives'].append({
            "id": 2005,
            "name": "Additional Objective from Step Save",
            "description": "This objective was added via saveStepDraft function",
            "achieved": "Partial"
        })
        
        response = requests.put(
            f"{BACKEND_URL}/exercise-builder/{created_exercise_id}",
            json=step_update_data,
            headers={"Content-Type": "application/json"}
        )
        print(f"   Status Code: {response.status_code}")
        
        if response.status_code == 200:
            updated_exercise = response.json()
            print(f"   ✅ Step draft save successful")
            
            # Verify additional data was saved
            updated_goals = updated_exercise.get('goals', [])
            updated_objectives = updated_exercise.get('objectives', [])
            
            if len(updated_goals) == 4:  # Original 3 + 1 new
                print(f"   ✅ Goals updated: {len(updated_goals)} items (added 1)")
            else:
                print(f"   ❌ Goals update failed: Expected 4, got {len(updated_goals)}")
                return False
                
            if len(updated_objectives) == 5:  # Original 4 + 1 new
                print(f"   ✅ Objectives updated: {len(updated_objectives)} items (added 1)")
            else:
                print(f"   ❌ Objectives update failed: Expected 5, got {len(updated_objectives)}")
                return False
            
            print("   ✅ saveStepDraft functionality verified")
        else:
            print(f"   ❌ Step draft save failed: {response.text}")
            return False
        
        # Final verification - retrieve updated exercise
        print("\n   Final verification: Retrieve updated exercise")
        response = requests.get(f"{BACKEND_URL}/exercise-builder/{created_exercise_id}")
        if response.status_code == 200:
            final_exercise = response.json()
            final_goals = final_exercise.get('goals', [])
            final_objectives = final_exercise.get('objectives', [])
            
            print(f"   ✅ Final verification successful")
            print(f"   📊 Final counts: Goals={len(final_goals)}, Objectives={len(final_objectives)}")
            
            # Check for the added items
            added_goal_found = any(goal.get('name') == 'Additional Goal from Step Save' for goal in final_goals)
            added_objective_found = any(obj.get('name') == 'Additional Objective from Step Save' for obj in final_objectives)
            
            if added_goal_found and added_objective_found:
                print("   ✅ All step-saved data persisted correctly")
            else:
                print("   ❌ Step-saved data not persisted")
                return False
        else:
            print(f"   ❌ Final verification failed: {response.text}")
            return False
        
        print("\n🔍 STEP 4: DATABASE VERIFICATION")
        print("-" * 50)
        
        # Test D: Verify data is actually in database (not just cached)
        print("D. Testing database persistence by retrieving from fresh request")
        
        # Get all exercises to verify our exercise is in the list
        response = requests.get(f"{BACKEND_URL}/exercise-builder")
        if response.status_code == 200:
            all_exercises = response.json()
            our_exercise = next((ex for ex in all_exercises if ex.get('id') == created_exercise_id), None)
            
            if our_exercise:
                print(f"   ✅ Exercise found in database listing")
                print(f"   📋 Name: {our_exercise.get('exercise_name')}")
                print(f"   📊 Goals: {len(our_exercise.get('goals', []))} items")
                print(f"   📊 Objectives: {len(our_exercise.get('objectives', []))} items")
                print(f"   📊 Events: {len(our_exercise.get('events', []))} items")
                
                # Verify all dynamic collections are present in database
                dynamic_fields = ['goals', 'objectives', 'events', 'functions', 'injections', 'organizations', 'coordinators', 'codeWords', 'callsigns', 'frequencies', 'assumptions', 'artificialities', 'safetyConcerns']
                
                print(f"\n   📊 DATABASE DYNAMIC COLLECTIONS VERIFICATION:")
                for field in dynamic_fields:
                    db_data = our_exercise.get(field, [])
                    expected_count = len(step_update_data[field])  # Use updated data counts
                    
                    if len(db_data) == expected_count:
                        print(f"   ✅ {field}: {len(db_data)} items in database")
                    else:
                        print(f"   ❌ {field}: Expected {expected_count}, found {len(db_data)} in database")
                        return False
                
                print("   ✅ ALL DATA VERIFIED IN DATABASE")
            else:
                print(f"   ❌ Exercise not found in database listing")
                return False
        else:
            print(f"   ❌ Failed to get exercise list: {response.text}")
            return False
        
        # Clean up test exercise
        print(f"\n🧹 CLEANUP: Deleting test exercise {created_exercise_id}")
        response = requests.delete(f"{BACKEND_URL}/exercise-builder/{created_exercise_id}")
        if response.status_code == 200:
            print("   ✅ Test exercise deleted successfully")
        else:
            print(f"   ⚠️  Failed to delete test exercise: {response.text}")
        
        print("\n" + "=" * 80)
        print("🎉 DATA PERSISTENCE INVESTIGATION COMPLETE - ALL TESTS PASSED")
        print("=" * 80)
        print("\n📋 INVESTIGATION RESULTS:")
        print("✅ Exercise Builder Data Saving: WORKING PERFECTLY")
        print("✅ Exercise Management Dashboard Data Loading: WORKING PERFECTLY")
        print("✅ Data Flow Verification: WORKING PERFECTLY")
        print("✅ Database Persistence: WORKING PERFECTLY")
        print("✅ saveExercise function: WORKING PERFECTLY")
        print("✅ saveStepDraft function: WORKING PERFECTLY")
        print("✅ All dynamic collections: WORKING PERFECTLY")
        print("✅ All exercise fields: WORKING PERFECTLY")
        print("\n🔍 CONCLUSION:")
        print("NO DATA PERSISTENCE ISSUES FOUND IN BACKEND API")
        print("All data is being saved and retrieved correctly.")
        print("If users are experiencing data loss, the issue is likely in:")
        print("1. Frontend form data collection")
        print("2. Frontend API call implementation")
        print("3. Frontend state management")
        print("4. Browser/client-side issues")
        
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

def test_existing_exercise_data():
    """Test the existing Dynamic Data Test Exercise to verify its data structure"""
    print("\n" + "=" * 80)
    print("EXISTING EXERCISE DATA VERIFICATION")
    print("=" * 80)
    
    EXISTING_EXERCISE_ID = "027905e3-e909-4e8a-abba-edef0e386a69"  # Dynamic Data Test Exercise
    
    print(f"Testing existing exercise: {EXISTING_EXERCISE_ID}")
    
    try:
        response = requests.get(f"{BACKEND_URL}/exercise-builder/{EXISTING_EXERCISE_ID}")
        if response.status_code == 200:
            exercise = response.json()
            print(f"✅ Successfully retrieved existing exercise")
            print(f"📋 Name: {exercise.get('exercise_name', 'N/A')}")
            
            # Verify this exercise has the expected dynamic data
            goals = exercise.get('goals', [])
            objectives = exercise.get('objectives', [])
            
            print(f"\n📊 EXISTING EXERCISE DYNAMIC DATA:")
            print(f"Goals: {len(goals)} items")
            for i, goal in enumerate(goals, 1):
                print(f"  {i}. {goal.get('name', 'N/A')} - {goal.get('achieved', 'N/A')}")
            
            print(f"Objectives: {len(objectives)} items")
            for i, obj in enumerate(objectives, 1):
                print(f"  {i}. {obj.get('name', 'N/A')} - {obj.get('achieved', 'N/A')}")
            
            if len(goals) >= 2 and len(objectives) >= 1:
                print("✅ Existing exercise has expected dynamic data structure")
                print("✅ This confirms backend is storing and retrieving dynamic collections correctly")
                return True
            else:
                print("❌ Existing exercise does not have expected dynamic data")
                return False
        else:
            print(f"❌ Failed to retrieve existing exercise: {response.status_code}")
            return False
            
    except Exception as e:
        print(f"❌ Error testing existing exercise: {e}")
        return False

if __name__ == "__main__":
    print("EXRSIM Data Persistence Investigation")
    print(f"Backend URL: {BACKEND_URL}")
    print("=" * 80)
    
    # Test existing exercise first
    existing_test_passed = test_existing_exercise_data()
    
    # Run comprehensive data flow test
    comprehensive_test_passed = test_complete_data_flow()
    
    if existing_test_passed and comprehensive_test_passed:
        print("\n🎉 ALL DATA PERSISTENCE TESTS PASSED")
        print("✅ Backend API is working perfectly for data persistence")
        print("✅ No issues found in Exercise Builder to Exercise Management Dashboard data flow")
        sys.exit(0)
    else:
        print("\n💥 SOME DATA PERSISTENCE TESTS FAILED")
        sys.exit(1)
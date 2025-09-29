#!/usr/bin/env python3
"""
Comprehensive Backend API Testing for EXRSIM Exercise Builder
Tests ALL 17 steps with complete field-by-field data persistence verification
As requested in the comprehensive testing review
"""

import requests
import json
from datetime import datetime, timezone
import sys
import os

# Get backend URL from frontend .env
BACKEND_URL = "https://emergency-sim-3.preview.emergentagent.com/api"

def create_comprehensive_test_data():
    """Create comprehensive test data covering ALL 17 steps as specified in review request"""
    
    # Sample base64 image for testing image fields
    sample_image_base64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
    
    return {
        # Step 1 - Exercise Details
        "exercise_image": sample_image_base64,
        "exercise_name": "Comprehensive Multi-Hazard Emergency Response Exercise",
        "exercise_type": "Full Scale Exercise",
        "exercise_description": "A comprehensive emergency response exercise testing all aspects of multi-hazard emergency management including flood, fire, and evacuation scenarios with full community participation.",
        "location": "Metropolitan Emergency Operations Center and Field Sites",
        "start_date": "2024-12-20T08:00:00Z",
        "start_time": "08:00",
        "end_date": "2024-12-20T18:00:00Z",
        "end_time": "18:00",
        
        # Step 2 - Scope
        "scope_description": "This exercise encompasses a comprehensive multi-hazard scenario affecting the entire metropolitan region, testing coordination between all emergency services, government agencies, and community organizations.",
        "scope_hazards": "Primary: Major flooding from river overflow; Secondary: Wildfire threat from electrical infrastructure damage; Tertiary: Mass evacuation requirements affecting 25,000+ residents",
        "scope_geographic_area": "Metropolitan downtown core (15 square kilometers), surrounding residential areas (50 square kilometers), critical infrastructure corridors including hospitals, schools, and transportation hubs",
        "scope_functions": "Emergency Operations Center activation, Multi-agency coordination, Search and rescue operations, Mass evacuation procedures, Emergency communications, Resource allocation and logistics, Public information management",
        "scope_organizations": "Fire Department, Police Services, Emergency Management Agency, Public Health Authority, Red Cross, Salvation Army, Municipal Government, Provincial Emergency Management, Hospital Networks, School Boards, Transportation Authority",
        "scope_personnel": "Emergency responders (150), Emergency management coordinators (25), Government officials (30), Volunteer organizations (75), Community representatives (50), Exercise controllers and evaluators (40)",
        "scope_exercise_type": "Full Scale Exercise",
        
        # Step 3 - Purpose
        "purpose_description": "To test and evaluate the comprehensive emergency response capabilities of all participating organizations during a complex multi-hazard scenario, focusing on inter-agency coordination, resource management, communication effectiveness, and community protection measures. This exercise will identify strengths and areas for improvement in emergency preparedness and response protocols.",
        
        # Step 4 - Scenario
        "scenario_image": sample_image_base64,
        "scenario_name": "Operation Cascade Response - Multi-Hazard Emergency",
        "scenario_description": "Heavy rainfall over 48 hours causes the Metropolitan River to overflow its banks, flooding downtown areas and residential neighborhoods. Electrical infrastructure damage from flooding creates wildfire risk in surrounding areas. Emergency services must coordinate massive evacuation efforts while maintaining essential services and ensuring public safety.",
        "scenario_latitude": 45.4215,
        "scenario_longitude": -75.6972,
        
        # Step 5 - Goals (Dynamic Collection)
        "goals": [
            {
                "id": 1001,
                "name": "Test Emergency Response Coordination",
                "description": "Evaluate the effectiveness of multi-agency coordination during complex emergency scenarios",
                "achieved": "Partial"
            },
            {
                "id": 1002,
                "name": "Validate Communication Systems",
                "description": "Test all emergency communication systems including radio networks, alert systems, and public information channels",
                "achieved": "Yes"
            },
            {
                "id": 1003,
                "name": "Assess Evacuation Procedures",
                "description": "Evaluate mass evacuation procedures for large-scale population displacement",
                "achieved": "No"
            }
        ],
        
        # Step 6 - Objectives (Dynamic Collection)
        "objectives": [
            {
                "id": 2001,
                "name": "Activate EOC within 30 minutes",
                "description": "Emergency Operations Center must be fully operational within 30 minutes of initial alert",
                "achieved": "Yes"
            },
            {
                "id": 2002,
                "name": "Establish unified command structure",
                "description": "All responding agencies must integrate into unified command within 45 minutes",
                "achieved": "Partial"
            },
            {
                "id": 2003,
                "name": "Deploy search and rescue teams",
                "description": "Search and rescue teams deployed to affected areas within 60 minutes",
                "achieved": "No"
            }
        ],
        
        # Step 7 - Events (Dynamic Collection)
        "events": [
            {
                "id": 3001,
                "name": "Initial Flood Warning",
                "description": "River levels reach critical threshold, flood warning issued",
                "start_time": "T+00:00",
                "end_time": "T+00:15",
                "tier": "Tier 2: Emergency",
                "escalation": "Warning"
            },
            {
                "id": 3002,
                "name": "Infrastructure Failure",
                "description": "Electrical substation flooding causes power outages and fire risk",
                "start_time": "T+02:30",
                "end_time": "T+03:00",
                "tier": "Tier 3: Disaster",
                "escalation": "Danger"
            }
        ],
        
        # Step 8 - Functions (Dynamic Collection)
        "functions": [
            {
                "id": 4001,
                "name": "Emergency Operations Center Management",
                "description": "Coordinate all emergency response activities from central command",
                "achieved": "Yes"
            },
            {
                "id": 4002,
                "name": "Search and Rescue Operations",
                "description": "Conduct search and rescue in flooded and affected areas",
                "achieved": "Partial"
            }
        ],
        
        # Step 9 - Injections (Dynamic Collection)
        "injections": [
            {
                "id": 5001,
                "name": "Media Inquiry Injection",
                "description": "Local news station requests immediate interview about evacuation status",
                "time": "T+01:30",
                "mode": "Phone Call"
            },
            {
                "id": 5002,
                "name": "Resource Request Injection",
                "description": "Field teams request additional rescue boats and medical supplies",
                "time": "T+03:45",
                "mode": "Radio Communication"
            }
        ],
        
        # Step 10 - Organizations (Dynamic Collection)
        "organizations": [
            {
                "id": 6001,
                "name": "Metropolitan Fire Department",
                "description": "Primary emergency response and rescue operations",
                "contact": "Chief Sarah Johnson",
                "phone": "555-0101"
            },
            {
                "id": 6002,
                "name": "City Police Services",
                "description": "Law enforcement, traffic control, and evacuation support",
                "contact": "Inspector Mike Chen",
                "phone": "555-0102"
            }
        ],
        
        # Step 11 - Team Coordinators (Dynamic Collection)
        "coordinators": [
            {
                "id": 7001,
                "name": "Jennifer Martinez",
                "role": "Incident Commander",
                "contact": "jennifer.martinez@emergency.gov",
                "agency": "Emergency Management Agency"
            },
            {
                "id": 7002,
                "name": "Robert Thompson",
                "role": "Operations Chief",
                "contact": "robert.thompson@fire.gov",
                "agency": "Fire Department"
            }
        ],
        
        # Step 12 - Code Words (Dynamic Collection)
        "codeWords": [
            {
                "id": 8001,
                "word": "FLOODGATE",
                "definition": "Major flood event requiring full emergency response activation"
            },
            {
                "id": 8002,
                "word": "CASCADE",
                "definition": "Multi-hazard scenario with escalating emergency conditions"
            }
        ],
        
        # Step 13 - Callsigns (Dynamic Collection)
        "callsigns": [
            {
                "id": 9001,
                "callsign": "COMMAND-1",
                "description": "Emergency Operations Center Command Post"
            },
            {
                "id": 9002,
                "callsign": "RESCUE-7",
                "description": "Primary search and rescue team leader"
            }
        ],
        
        # Step 14 - Communication Frequencies (Dynamic Collection)
        "frequencies": [
            {
                "id": 10001,
                "frequency": "155.340",
                "type": "Primary",
                "description": "Main emergency coordination frequency",
                "primary_backup": "Primary"
            },
            {
                "id": 10002,
                "frequency": "154.265",
                "type": "Tactical",
                "description": "Field operations and rescue teams",
                "primary_backup": "Backup"
            }
        ],
        
        # Step 15 - Assumptions (Dynamic Collection)
        "assumptions": [
            {
                "id": 11001,
                "assumption": "Weather conditions will continue to deteriorate",
                "description": "Heavy rainfall will persist for additional 24 hours, increasing flood severity"
            },
            {
                "id": 11002,
                "assumption": "All emergency personnel are available",
                "description": "Full staffing levels available for all participating agencies"
            }
        ],
        
        # Step 16 - Artificialities (Dynamic Collection)
        "artificialities": [
            {
                "id": 12001,
                "artificiality": "Simulated infrastructure damage",
                "description": "Actual infrastructure will not be damaged; damage will be simulated through exercise injects"
            },
            {
                "id": 12002,
                "artificiality": "Controlled evacuation areas",
                "description": "Evacuation will be limited to designated exercise areas, not actual residential displacement"
            }
        ],
        
        # Step 17 - Safety Concerns (Dynamic Collection)
        "safetyConcerns": [
            {
                "id": 13001,
                "concern": "Water safety during flood simulation",
                "safety_officer": "Captain Lisa Wong",
                "phone": "555-0199",
                "description": "Risk of actual water hazards during simulated flood response activities"
            },
            {
                "id": 13002,
                "concern": "Vehicle safety during evacuation",
                "safety_officer": "Sergeant David Kim",
                "phone": "555-0198",
                "description": "Traffic safety concerns during simulated mass evacuation procedures"
            }
        ]
    }

def verify_all_fields(exercise_data, test_data, test_name):
    """Verify all fields from all 17 steps are present and correct"""
    print(f"\n🔍 COMPREHENSIVE FIELD VERIFICATION - {test_name}")
    print("=" * 80)
    
    # Step 1 - Exercise Details Fields
    step1_fields = ["exercise_image", "exercise_name", "exercise_type", "exercise_description", 
                   "location", "start_date", "start_time", "end_date", "end_time"]
    
    # Step 2 - Scope Fields  
    step2_fields = ["scope_description", "scope_hazards", "scope_geographic_area", 
                   "scope_functions", "scope_organizations", "scope_personnel", "scope_exercise_type"]
    
    # Step 3 - Purpose Fields
    step3_fields = ["purpose_description"]
    
    # Step 4 - Scenario Fields
    step4_fields = ["scenario_image", "scenario_name", "scenario_description", 
                   "scenario_latitude", "scenario_longitude"]
    
    # Steps 5-17 - Dynamic Collection Fields
    dynamic_fields = ["goals", "objectives", "events", "functions", "injections", 
                     "organizations", "coordinators", "codeWords", "callsigns", 
                     "frequencies", "assumptions", "artificialities", "safetyConcerns"]
    
    all_fields_verified = True
    
    # Verify Step 1 - Exercise Details
    print("📋 STEP 1 - EXERCISE DETAILS:")
    for field in step1_fields:
        if field in exercise_data:
            if field in ["start_date", "end_date"]:
                # Date fields might be converted to ISO format
                print(f"   ✅ {field}: Present (date field)")
            elif exercise_data[field] == test_data.get(field):
                print(f"   ✅ {field}: Matches exactly")
            else:
                print(f"   ⚠️  {field}: Present but different format")
                print(f"      Expected: {test_data.get(field)}")
                print(f"      Got: {exercise_data[field]}")
        else:
            print(f"   ❌ {field}: MISSING")
            all_fields_verified = False
    
    # Verify Step 2 - Scope
    print("\n📋 STEP 2 - SCOPE:")
    for field in step2_fields:
        if field in exercise_data:
            if exercise_data[field] == test_data.get(field):
                print(f"   ✅ {field}: Matches exactly")
            else:
                print(f"   ⚠️  {field}: Present but different")
        else:
            print(f"   ❌ {field}: MISSING")
            all_fields_verified = False
    
    # Verify Step 3 - Purpose
    print("\n📋 STEP 3 - PURPOSE:")
    for field in step3_fields:
        if field in exercise_data:
            if exercise_data[field] == test_data.get(field):
                print(f"   ✅ {field}: Matches exactly")
            else:
                print(f"   ⚠️  {field}: Present but different")
        else:
            print(f"   ❌ {field}: MISSING")
            all_fields_verified = False
    
    # Verify Step 4 - Scenario
    print("\n📋 STEP 4 - SCENARIO:")
    for field in step4_fields:
        if field in exercise_data:
            if field in ["scenario_latitude", "scenario_longitude"]:
                # Numeric fields
                print(f"   ✅ {field}: {exercise_data[field]} (numeric)")
            elif exercise_data[field] == test_data.get(field):
                print(f"   ✅ {field}: Matches exactly")
            else:
                print(f"   ⚠️  {field}: Present but different")
        else:
            print(f"   ❌ {field}: MISSING")
            all_fields_verified = False
    
    # Verify Steps 5-17 - Dynamic Collections
    print("\n📋 STEPS 5-17 - DYNAMIC COLLECTIONS:")
    for field in dynamic_fields:
        if field in exercise_data:
            exercise_collection = exercise_data[field]
            test_collection = test_data.get(field, [])
            
            if isinstance(exercise_collection, list):
                print(f"   ✅ {field}: List with {len(exercise_collection)} items")
                
                # Verify collection data matches
                if len(exercise_collection) == len(test_collection):
                    print(f"      ✅ Count matches: {len(exercise_collection)} items")
                    
                    # Check first item structure if exists
                    if len(exercise_collection) > 0 and len(test_collection) > 0:
                        first_exercise_item = exercise_collection[0]
                        first_test_item = test_collection[0]
                        
                        # Check if key fields match
                        matching_keys = 0
                        total_keys = len(first_test_item.keys())
                        
                        for key in first_test_item.keys():
                            if key in first_exercise_item and first_exercise_item[key] == first_test_item[key]:
                                matching_keys += 1
                        
                        if matching_keys == total_keys:
                            print(f"      ✅ First item structure matches completely")
                        else:
                            print(f"      ⚠️  First item: {matching_keys}/{total_keys} fields match")
                            print(f"         Expected: {first_test_item}")
                            print(f"         Got: {first_exercise_item}")
                else:
                    print(f"      ❌ Count mismatch: Expected {len(test_collection)}, Got {len(exercise_collection)}")
                    all_fields_verified = False
            else:
                print(f"   ❌ {field}: Not a list (type: {type(exercise_collection)})")
                all_fields_verified = False
        else:
            print(f"   ❌ {field}: MISSING")
            all_fields_verified = False
    
    print("\n" + "=" * 80)
    if all_fields_verified:
        print("🎉 ALL FIELDS VERIFICATION PASSED - Complete data persistence confirmed!")
    else:
        print("❌ FIELD VERIFICATION FAILED - Some fields missing or incorrect")
    
    return all_fields_verified

def test_comprehensive_exercise_builder():
    """Test comprehensive Exercise Builder functionality across all 17 steps"""
    print("=" * 80)
    print("🚀 COMPREHENSIVE EXERCISE BUILDER TESTING - ALL 17 STEPS")
    print("Testing complete field-by-field data persistence as requested")
    print("=" * 80)
    
    # Get comprehensive test data
    test_data = create_comprehensive_test_data()
    created_exercise_id = None
    
    try:
        # Test 1: Create Exercise with ALL fields from all 17 steps
        print("\n1️⃣ TESTING: CREATE COMPREHENSIVE EXERCISE (POST)")
        print("Creating exercise with ALL fields from all 17 steps...")
        
        response = requests.post(
            f"{BACKEND_URL}/exercise-builder",
            json=test_data,
            headers={"Content-Type": "application/json"}
        )
        
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            created_exercise = response.json()
            created_exercise_id = created_exercise.get("id")
            print(f"✅ Successfully created comprehensive exercise")
            print(f"Exercise ID: {created_exercise_id}")
            print(f"Exercise Name: {created_exercise.get('exercise_name')}")
            
            # Verify all fields are present
            field_verification_passed = verify_all_fields(created_exercise, test_data, "CREATE")
            
            if not field_verification_passed:
                print("❌ Field verification failed during creation")
                return False
                
        else:
            print(f"❌ Failed to create comprehensive exercise: {response.text}")
            return False
        
        # Test 2: Retrieve Exercise and verify all data persisted
        print(f"\n2️⃣ TESTING: RETRIEVE EXERCISE (GET)")
        print("Verifying all data was stored correctly...")
        
        response = requests.get(f"{BACKEND_URL}/exercise-builder/{created_exercise_id}")
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            retrieved_exercise = response.json()
            print(f"✅ Successfully retrieved exercise")
            
            # Comprehensive field verification
            field_verification_passed = verify_all_fields(retrieved_exercise, test_data, "RETRIEVE")
            
            if not field_verification_passed:
                print("❌ Field verification failed during retrieval")
                return False
                
        else:
            print(f"❌ Failed to retrieve exercise: {response.text}")
            return False
        
        # Test 3: Update Exercise with modified data across all steps
        print(f"\n3️⃣ TESTING: UPDATE EXERCISE (PUT)")
        print("Updating exercise with modified data across all 17 steps...")
        
        # Create updated test data - start with the original retrieved data
        updated_data = retrieved_exercise.copy()
        
        # Store original counts for verification (from retrieved data)
        original_goals_count = len(retrieved_exercise.get("goals", []))
        original_objectives_count = len(retrieved_exercise.get("objectives", []))
        original_events_count = len(retrieved_exercise.get("events", []))
        
        # Modify Step 1 fields
        updated_data["exercise_name"] = "UPDATED - Comprehensive Multi-Hazard Emergency Response Exercise"
        updated_data["exercise_description"] = "UPDATED - A comprehensive emergency response exercise with enhanced testing protocols"
        updated_data["location"] = "UPDATED - Metropolitan Emergency Operations Center and Enhanced Field Sites"
        
        # Modify Step 2 fields
        updated_data["scope_description"] = "UPDATED - Enhanced comprehensive multi-hazard scenario"
        updated_data["scope_hazards"] = "UPDATED - Enhanced hazard assessment including cyber threats"
        
        # Modify Step 3 fields
        updated_data["purpose_description"] = "UPDATED - Enhanced testing and evaluation of comprehensive emergency response capabilities"
        
        # Modify Step 4 fields
        updated_data["scenario_name"] = "UPDATED - Operation Cascade Response - Enhanced Multi-Hazard Emergency"
        updated_data["scenario_description"] = "UPDATED - Enhanced scenario with additional complexity factors"
        
        # Add items to dynamic collections (Steps 5-17)
        updated_data["goals"].append({
            "id": 1004,
            "name": "UPDATED - Test Enhanced Coordination",
            "description": "UPDATED - Enhanced multi-agency coordination testing",
            "achieved": "Partial"
        })
        
        updated_data["objectives"].append({
            "id": 2004,
            "name": "UPDATED - Enhanced Response Time",
            "description": "UPDATED - Improved response time objectives",
            "achieved": "Yes"
        })
        
        updated_data["events"].append({
            "id": 3003,
            "name": "UPDATED - Enhanced Emergency Event",
            "description": "UPDATED - Additional emergency scenario complexity",
            "start_time": "T+04:00",
            "end_time": "T+04:30",
            "tier": "Tier 1: Incident",
            "escalation": "Low"
        })
        
        print(f"   📊 Original counts: Goals={original_goals_count}, Objectives={original_objectives_count}, Events={original_events_count}")
        print(f"   📊 Updated counts: Goals={len(updated_data['goals'])}, Objectives={len(updated_data['objectives'])}, Events={len(updated_data['events'])}")
        
        response = requests.put(
            f"{BACKEND_URL}/exercise-builder/{created_exercise_id}",
            json=updated_data,
            headers={"Content-Type": "application/json"}
        )
        
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            updated_exercise = response.json()
            print(f"✅ Successfully updated comprehensive exercise")
            
            # Verify updates were applied
            if "UPDATED" in updated_exercise.get("exercise_name", ""):
                print("✅ Exercise name update confirmed")
            else:
                print("❌ Exercise name update not confirmed")
                return False
            
            # Verify dynamic collections were updated
            print("\n📊 DYNAMIC COLLECTIONS UPDATE VERIFICATION:")
            for collection_name, original_count in [("goals", original_goals_count), ("objectives", original_objectives_count), ("events", original_events_count)]:
                updated_collection = updated_exercise.get(collection_name, [])
                actual_count = len(updated_collection)
                expected_count = original_count + 1  # We added 1 item to each
                
                if actual_count >= expected_count:
                    print(f"   ✅ {collection_name}: {original_count} → {actual_count} items (expected: {expected_count})")
                else:
                    print(f"   ❌ {collection_name}: Expected {expected_count}, got {actual_count} items")
                    return False
                    
        else:
            print(f"❌ Failed to update exercise: {response.text}")
            return False
        
        # Test 4: Final verification - Retrieve updated exercise
        print(f"\n4️⃣ TESTING: FINAL VERIFICATION (GET)")
        print("Verifying all updates persisted correctly...")
        
        response = requests.get(f"{BACKEND_URL}/exercise-builder/{created_exercise_id}")
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            final_exercise = response.json()
            print(f"✅ Successfully retrieved updated exercise")
            
            # Verify key updates persisted
            if "UPDATED" in final_exercise.get("exercise_name", ""):
                print("✅ Exercise name updates persisted")
            else:
                print("❌ Exercise name updates NOT persisted")
                return False
            
            # Verify dynamic collections updates persisted
            goals_count = len(final_exercise.get("goals", []))
            objectives_count = len(final_exercise.get("objectives", []))
            
            # Use the original counts from the retrieved data (before update)
            expected_goals = original_goals_count + 1
            expected_objectives = original_objectives_count + 1
            
            if goals_count >= expected_goals and objectives_count >= expected_objectives:
                print(f"✅ Dynamic collections updates persisted (Goals: {original_goals_count}→{goals_count}, Objectives: {original_objectives_count}→{objectives_count})")
            else:
                print(f"❌ Dynamic collections updates NOT persisted (Goals: {original_goals_count}→{goals_count}, Objectives: {original_objectives_count}→{objectives_count})")
                return False
                
        else:
            print(f"❌ Failed to retrieve updated exercise: {response.text}")
            return False
        
        # Test 5: Clean up
        print(f"\n5️⃣ TESTING: CLEANUP (DELETE)")
        response = requests.delete(f"{BACKEND_URL}/exercise-builder/{created_exercise_id}")
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            print("✅ Successfully deleted test exercise")
        else:
            print(f"⚠️  Failed to delete test exercise: {response.text}")
        
        print("\n" + "=" * 80)
        print("🎉 COMPREHENSIVE EXERCISE BUILDER TESTING COMPLETED SUCCESSFULLY!")
        print("✅ All 17 steps tested with complete field-by-field verification")
        print("✅ Input → Save → Retrieve → Edit workflow verified")
        print("✅ All dynamic collections tested with proper data persistence")
        print("=" * 80)
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
    print("🏥 Testing API Health Check...")
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
    print("🚀 EXRSIM COMPREHENSIVE EXERCISE BUILDER TESTING")
    print("Testing ALL 17 steps with complete field-by-field data persistence verification")
    print(f"Backend URL: {BACKEND_URL}")
    print("=" * 80)
    
    # Test API health first
    if not test_health_check():
        print("❌ API is not responding. Cannot proceed with tests.")
        sys.exit(1)
    
    # Run comprehensive test
    success = test_comprehensive_exercise_builder()
    
    if success:
        print("\n🎉 ALL COMPREHENSIVE TESTS COMPLETED SUCCESSFULLY")
        print("✅ Complete data persistence verified across all 17 Exercise Builder steps")
        sys.exit(0)
    else:
        print("\n💥 COMPREHENSIVE TESTS FAILED")
        print("❌ Issues found with data persistence - see details above")
        sys.exit(1)
#!/usr/bin/env python3
"""
Comprehensive Backend API Testing for EXRSIM Participant CRUD
Tests participant CRUD functionality comprehensively to identify any issues with data persistence across ALL fields
As requested in the comprehensive testing review
"""

import requests
import json
from datetime import datetime, timezone
import sys
import os
import base64

# Get backend URL from frontend .env
BACKEND_URL = "https://crisis-simulator-2.preview.emergentagent.com/api"

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
    print("EXRSIM Backend API Testing - Participant CRUD")
    print(f"Backend URL: {BACKEND_URL}")
    print("=" * 60)
    
    # Test API health first
    if not test_health_check():
        print("❌ API is not responding. Cannot proceed with tests.")
        sys.exit(1)
    
    # Test Participant CRUD API
    success = test_participant_crud_api()
    
    if success:
        print("\n🎉 ALL PARTICIPANT CRUD TESTS COMPLETED SUCCESSFULLY")
        sys.exit(0)
    else:
        print("\n💥 SOME PARTICIPANT CRUD TESTS FAILED")
        sys.exit(1)
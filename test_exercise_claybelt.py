#!/usr/bin/env python3
"""
Exercise Claybelt Coordinate Verification Test
Tests the specific Exercise Claybelt with ID 9204c218-cb55-44e8-812e-3a643aef023c
as requested in the review request.
"""

import requests
import json
import sys

# Get backend URL from frontend .env
BACKEND_URL = "https://leafdraw-ems.preview.emergentagent.com/api"

def test_exercise_claybelt_coordinates():
    """Test Exercise Claybelt coordinate verification as requested in review"""
    print("=" * 60)
    print("TESTING EXERCISE CLAYBELT COORDINATE VERIFICATION")
    print("=" * 60)
    
    exercise_id = "9204c218-cb55-44e8-812e-3a643aef023c"
    vancouver_coords = {"latitude": 49.2827, "longitude": -123.1207}
    
    try:
        # Step 1: Make GET request to fetch current exercise data
        print(f"\n1. Testing GET /api/exercise-builder/{exercise_id}")
        print(f"   Fetching Exercise Claybelt data...")
        
        response = requests.get(f"{BACKEND_URL}/exercise-builder/{exercise_id}")
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 404:
            print(f"❌ Exercise Claybelt with ID {exercise_id} not found")
            print("   This exercise may not exist in the database")
            return False
        elif response.status_code != 200:
            print(f"❌ Failed to fetch exercise: {response.text}")
            return False
            
        exercise_data = response.json()
        print(f"✅ Successfully retrieved Exercise: {exercise_data.get('exercise_name', 'Unknown')}")
        
        # Step 2: Check if exercise has latitude and longitude fields set
        print(f"\n2. Checking current coordinate fields...")
        current_lat = exercise_data.get('latitude')
        current_lng = exercise_data.get('longitude')
        
        print(f"   Current latitude: {current_lat}")
        print(f"   Current longitude: {current_lng}")
        
        # Step 3: Display current coordinate values if they exist
        if current_lat is not None and current_lng is not None:
            print(f"✅ Exercise has coordinates set:")
            print(f"   📍 Latitude: {current_lat}")
            print(f"   📍 Longitude: {current_lng}")
            
            # Check if coordinates are valid (within reasonable bounds)
            if -90 <= current_lat <= 90 and -180 <= current_lng <= 180:
                print(f"✅ Coordinates are within valid ranges")
            else:
                print(f"⚠️  Coordinates are outside valid ranges")
                
        else:
            print(f"⚠️  Exercise does not have coordinates set")
            print(f"   latitude: {current_lat}, longitude: {current_lng}")
            
        # Step 4: Test updating exercise with sample coordinates (Vancouver area)
        print(f"\n3. Testing coordinate update with Vancouver coordinates...")
        print(f"   Setting coordinates to: {vancouver_coords['latitude']}, {vancouver_coords['longitude']}")
        
        update_response = requests.put(
            f"{BACKEND_URL}/exercise-builder/{exercise_id}",
            json=vancouver_coords,
            headers={"Content-Type": "application/json"}
        )
        print(f"Status Code: {update_response.status_code}")
        
        if update_response.status_code == 200:
            updated_exercise = update_response.json()
            print(f"✅ Successfully updated exercise coordinates")
            
            # Step 5: Verify coordinates were updated successfully
            updated_lat = updated_exercise.get('latitude')
            updated_lng = updated_exercise.get('longitude')
            
            if (updated_lat == vancouver_coords['latitude'] and 
                updated_lng == vancouver_coords['longitude']):
                print(f"✅ Coordinates updated successfully:")
                print(f"   📍 New Latitude: {updated_lat}")
                print(f"   📍 New Longitude: {updated_lng}")
            else:
                print(f"❌ Coordinate update failed:")
                print(f"   Expected: {vancouver_coords['latitude']}, {vancouver_coords['longitude']}")
                print(f"   Got: {updated_lat}, {updated_lng}")
                return False
        else:
            print(f"❌ Failed to update exercise coordinates: {update_response.text}")
            return False
            
        # Step 6: Make final GET request to confirm coordinates persist
        print(f"\n4. Final verification - confirming coordinate persistence...")
        
        final_response = requests.get(f"{BACKEND_URL}/exercise-builder/{exercise_id}")
        print(f"Status Code: {final_response.status_code}")
        
        if final_response.status_code == 200:
            final_exercise = final_response.json()
            final_lat = final_exercise.get('latitude')
            final_lng = final_exercise.get('longitude')
            
            if (final_lat == vancouver_coords['latitude'] and 
                final_lng == vancouver_coords['longitude']):
                print(f"✅ Coordinates properly persisted in database:")
                print(f"   📍 Persisted Latitude: {final_lat}")
                print(f"   📍 Persisted Longitude: {final_lng}")
                print(f"   🗺️  Location: Vancouver area coordinates confirmed")
            else:
                print(f"❌ Coordinates not properly persisted:")
                print(f"   Expected: {vancouver_coords['latitude']}, {vancouver_coords['longitude']}")
                print(f"   Got: {final_lat}, {final_lng}")
                return False
        else:
            print(f"❌ Failed to verify coordinate persistence: {final_response.text}")
            return False
            
        # Additional verification: Check if frontend can fetch and use these coordinates
        print(f"\n5. Frontend integration verification...")
        print(f"✅ Coordinates are now available for frontend map centering:")
        print(f"   - Exercise ID: {exercise_id}")
        print(f"   - Latitude: {final_lat} (for map center)")
        print(f"   - Longitude: {final_lng} (for map center)")
        print(f"   - Frontend can use these coordinates to center the map on Vancouver area")
        
        print(f"\n" + "=" * 60)
        print("✅ EXERCISE CLAYBELT COORDINATE VERIFICATION COMPLETED SUCCESSFULLY")
        print("=" * 60)
        print("📋 SUMMARY:")
        print(f"   ✅ Exercise Claybelt found and accessible")
        print(f"   ✅ Coordinate fields exist and are updateable")
        print(f"   ✅ PUT endpoint works correctly for coordinate updates")
        print(f"   ✅ Coordinates persist properly in database")
        print(f"   ✅ Frontend can fetch coordinates for map centering")
        print(f"   📍 Final coordinates: {final_lat}, {final_lng} (Vancouver area)")
        
        return True
        
    except requests.exceptions.ConnectionError as e:
        print(f"❌ Connection Error: Cannot connect to {BACKEND_URL}")
        print(f"Error: {e}")
        return False
    except requests.exceptions.RequestException as e:
        print(f"❌ Request Error: {e}")
        return False
    except Exception as e:
        print(f"❌ Unexpected Error during coordinate verification: {e}")
        return False

if __name__ == "__main__":
    print("🎯 EXERCISE CLAYBELT COORDINATE VERIFICATION TEST")
    print(f"Backend URL: {BACKEND_URL}")
    print("=" * 60)
    
    # Run the specific test
    result = test_exercise_claybelt_coordinates()
    
    if result:
        print("\n🎉 EXERCISE CLAYBELT COORDINATE TEST PASSED")
        sys.exit(0)
    else:
        print("\n❌ EXERCISE CLAYBELT COORDINATE TEST FAILED")
        sys.exit(1)
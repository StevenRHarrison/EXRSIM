#!/usr/bin/env python3
"""
Simple Weather API Test
"""

import requests
import json

BACKEND_URL = "https://leafdraw-ems.preview.emergentagent.com/api"

def test_weather_endpoints():
    print("Testing Weather API endpoints...")
    
    # Test 1: Try to import weather data
    print("\n1. Testing POST /api/weather-locations/import-excel")
    try:
        response = requests.post(f"{BACKEND_URL}/weather-locations/import-excel")
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
    except Exception as e:
        print(f"Error: {e}")
    
    # Test 2: Try to get weather locations
    print("\n2. Testing GET /api/weather-locations")
    try:
        response = requests.get(f"{BACKEND_URL}/weather-locations")
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
    except Exception as e:
        print(f"Error: {e}")
    
    # Test 3: Try to get provinces
    print("\n3. Testing GET /api/weather-locations/provinces")
    try:
        response = requests.get(f"{BACKEND_URL}/weather-locations/provinces")
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_weather_endpoints()
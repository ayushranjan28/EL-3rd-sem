"""
Quick API Test Script
Tests the pollution prediction API endpoints
"""

import requests
import json

BASE_URL = "http://localhost:5000"

print("="*70)
print("API TEST SUITE")
print("="*70)

# Test 1: Health Check
print("\n[Test 1] Health Check")
print("-" * 70)
try:
    response = requests.get(f"{BASE_URL}/health", timeout=5)
    if response.status_code == 200:
        data = response.json()
        print(f"✓ Status: {data['status']}")
        print(f"✓ Model Accuracy: {data['model_accuracy']*100:.2f}%")
    else:
        print(f"✗ Failed with status code: {response.status_code}")
except requests.exceptions.ConnectionError:
    print("✗ Cannot connect to API server")
    print("  Please start the server first: python api_server.py")
    exit(1)

# Test 2: Single Prediction - Clean Reading
print("\n[Test 2] Single Prediction - Clean Reading")
print("-" * 70)
clean_reading = {
    "factory_id": "TX-A",
    "factory_type": "Textile",
    "location_km_from_origin": 8.0,
    "flow_rate_m3ph": 250.0,
    "turbidity_ntu": 85.0,
    "ph": 7.2,
    "conductivity_us_cm": 1200.0,
    "temperature_c": 32.0,
    "chromium_mg_l": 0.05,
    "copper_mg_l": 0.08,
    "tds_mg_l": 950.0,
    "timestamp": "2026-01-06T14:30:00"
}

response = requests.post(f"{BASE_URL}/predict", json=clean_reading)
if response.status_code == 200:
    data = response.json()
    pred = data['prediction']
    print(f"Factory: {pred['factory_id']}")
    print(f"Violation: {pred['is_violation']}")
    print(f"Probability: {pred['violation_probability']:.3f}")
    print(f"Alert Level: {pred['alert_level']}")
    print(f"Reasons: {', '.join(pred['violation_reasons']) if pred['violation_reasons'] else 'None'}")
else:
    print(f"✗ Failed: {response.text}")

# Test 3: Single Prediction - Violation
print("\n[Test 3] Single Prediction - Violation Reading")
print("-" * 70)
violation_reading = {
    "factory_id": "TX-B",
    "factory_type": "Textile",
    "location_km_from_origin": 15.0,
    "flow_rate_m3ph": 420.0,
    "turbidity_ntu": 520.0,
    "ph": 4.2,
    "conductivity_us_cm": 3800.0,
    "temperature_c": 39.0,
    "chromium_mg_l": 1.5,
    "copper_mg_l": 0.45,
    "tds_mg_l": 3500.0,
    "timestamp": "2026-01-06T15:00:00"
}

response = requests.post(f"{BASE_URL}/predict", json=violation_reading)
if response.status_code == 200:
    data = response.json()
    pred = data['prediction']
    print(f"Factory: {pred['factory_id']}")
    print(f"Violation: {pred['is_violation']}")
    print(f"Probability: {pred['violation_probability']:.3f}")
    print(f"Alert Level: {pred['alert_level']}")
    print(f"Reasons: {', '.join(pred['violation_reasons'])}")
else:
    print(f"✗ Failed: {response.text}")

# Test 4: Model Info
print("\n[Test 4] Model Information")
print("-" * 70)
response = requests.get(f"{BASE_URL}/model/info")
if response.status_code == 200:
    data = response.json()
    meta = data['metadata']
    print(f"Model Type: {meta['model_type']}")
    print(f"Accuracy: {meta['accuracy']*100:.2f}%")
    print(f"ROC-AUC: {meta['roc_auc']:.4f}")
    print(f"Training Date: {meta['training_date']}")
    print(f"Training Samples: {meta['training_samples']:,}")
    print(f"Test Samples: {meta['test_samples']:,}")
else:
    print(f"✗ Failed: {response.text}")

# Test 5: Factories List
print("\n[Test 5] Supported Factories")
print("-" * 70)
response = requests.get(f"{BASE_URL}/factories")
if response.status_code == 200:
    data = response.json()
    print(f"Factories: {', '.join(data['factories'])}")
    print(f"Types: {', '.join(data['factory_types'])}")
else:
    print(f"✗ Failed: {response.text}")

print("\n" + "="*70)
print("✅ ALL TESTS COMPLETED")
print("="*70)

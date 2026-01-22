import requests
import json

# Define "Clean" parameters based on what we expect to be safe
clean_data = {
    "turbidity_ntu": 5.0,        # Very clear
    "ph": 7.0,                   # Neutral
    "conductivity_us_cm": 500.0, # Low conductivity
    "temperature_c": 25.0,
    "chromium_mg_l": 0.0,        # No chromium
    "copper_mg_l": 0.0,          # No copper
    "location_km_from_origin": 10.0,
    "flow_rate_m3ph": 100.0,
    "tds_mg_l": 500.0,
    "uv_vis_absorbance": 0.1,
    "factory_id": "UNKNOWN",
    "factory_type": "Unknown"
}

print("Testing 'Perfectly Clean' Water Sample:")
try:
    response = requests.post('http://localhost:5000/predict', json=clean_data)
    result = response.json()
    print(json.dumps(result, indent=2))
except Exception as e:
    print(f"Error: {e}")

print("\n" + "="*50 + "\n")

# Define values from our "Textile-A (Clean)" profile
# turbidity: [80, 150], ph: [7.0, 8.5], conductivity: [900, 1500]
# chromium: [0.01, 0.08], copper: [0.02, 0.08], tds: [900, 1400]
profile_clean_data = {
    "turbidity_ntu": 100.0,
    "ph": 7.5,
    "conductivity_us_cm": 1000.0,
    "temperature_c": 25.0,
    "chromium_mg_l": 0.02,
    "copper_mg_l": 0.03,
    "location_km_from_origin": 20.0,
    "flow_rate_m3ph": 300.0,
    "tds_mg_l": 1000.0,
    "uv_vis_absorbance": 0.4,
    "factory_id": "UNKNOWN",
    "factory_type": "Unknown"
}

print("Testing 'Textile-A (Clean)' Profile Values:")
try:
    response = requests.post('http://localhost:5000/predict', json=profile_clean_data)
    result = response.json()
    print(json.dumps(result, indent=2))
except Exception as e:
    print(f"Error: {e}")

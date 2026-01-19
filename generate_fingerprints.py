import pandas as pd
import json
import numpy as np
from sklearn.preprocessing import MinMaxScaler

def generate_fingerprints():
    print("Loading dataset...")
    df = pd.read_csv('water_pollution_dataset.csv')
    
    # Define features for fingerprinting
    features = [
        'location_km_from_origin', 'flow_rate_m3ph',
        'turbidity_ntu', 'ph', 'conductivity_us_cm', 'temperature_c',
        'chromium_mg_l', 'copper_mg_l', 'tds_mg_l', 'uv_vis_absorbance'
    ]
    
    # 1. Normalize data for fair distance calculation
    # We need to save the scaler parameters to normalize input data later
    print("Normalizing data...")
    scaler = MinMaxScaler()
    df_normalized = df.copy()
    df_normalized[features] = scaler.fit_transform(df[features])
    
    # Save scaler params
    scaler_params = {
        'min': scaler.data_min_.tolist(),
        'max': scaler.data_max_.tolist(),
        'scale': scaler.scale_.tolist(),
        'features': features
    }
    
    with open('fingerprint_scaler.json', 'w') as f:
        json.dump(scaler_params, f, indent=4)
        
    # 2. Calculate centroids (Fingerprints)
    print("Calculating centroids...")
    # Group by factory_id and take the mean
    centroids_normalized = df_normalized.groupby('factory_id')[features].mean()
    centroids_raw = df.groupby('factory_id')[features].mean() # For display/radar chart
    
    first_entries = df[['factory_id', 'factory_type']].drop_duplicates()
    type_map = dict(zip(first_entries['factory_id'], first_entries['factory_type']))

    results = {}
    
    for factory_id in centroids_normalized.index:
        results[factory_id] = {
            'type': type_map.get(factory_id, 'Unknown'),
            'normalized': centroids_normalized.loc[factory_id].to_dict(),
            'raw': centroids_raw.loc[factory_id].to_dict()
        }
    
    # Save fingerprints
    with open('factory_fingerprints.json', 'w') as f:
        json.dump(results, f, indent=4)
        
    print("[OK] Fingerprints generated and saved to factory_fingerprints.json")
    print("[OK] Scaler params saved to fingerprint_scaler.json")

if __name__ == "__main__":
    generate_fingerprints()

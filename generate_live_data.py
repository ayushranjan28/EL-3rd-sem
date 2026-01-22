import pandas as pd
import json
import time
import random
import numpy as np
from datetime import datetime
import os

def generate_live_data():
    print("Loading fingerprints...")
    with open('factory_fingerprints.json', 'r') as f:
        fingerprints = json.load(f)
        
    print("Loading dataset stats for realistic noise...")
    df = pd.read_csv('water_pollution_dataset.csv')
    
    # Calculate std dev for each factory for realistic simulation
    features = [
        'turbidity_ntu', 'ph', 'conductivity_us_cm', 
        'chromium_mg_l', 'copper_mg_l', 'tds_mg_l'
    ]
    
    factory_stats = df.groupby('factory_id')[features].std().to_dict('index')
    
    csv_file = 'live_factory_data.csv'
    
    # Write header if file doesn't exist
    if not os.path.exists(csv_file):
        with open(csv_file, 'w') as f:
            f.write('timestamp,factory_id,turbidity_ntu,ph,conductivity_us_cm,chromium_mg_l,copper_mg_l,tds_mg_l\n')
    
    print(f"Generating live data to {csv_file}...")
    print("Press Ctrl+C to stop.")
    
    try:
        while True:
            new_rows = []
            timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
            
            for factory_id, data in fingerprints.items():
                if factory_id not in factory_stats:
                    continue
                    
                raw_means = data['raw']
                stds = factory_stats[factory_id]
                
                row = [timestamp, factory_id]
                
                for feature in features:
                    mean = raw_means.get(feature, 0)
                    std = stds.get(feature, mean * 0.1) # Default to 10% if no std found
                    
                    # Generate value with noise
                    value = np.random.normal(mean, std * 0.5) # Reduced noise for clearer visual clustering
                    # Ensure non-negative
                    value = max(0, value)
                    
                    row.append(f"{value:.2f}")
                
                new_rows.append(",".join(row))
                
            with open(csv_file, 'a') as f:
                for row in new_rows:
                    f.write(row + '\n')
            
            print(f"[{timestamp}] Added batch of readings for {len(new_rows)} factories")
            time.sleep(1) # Add data every second
            
    except KeyboardInterrupt:
        print("\nStopped.")

if __name__ == "__main__":
    generate_live_data()

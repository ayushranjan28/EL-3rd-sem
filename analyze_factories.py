import pandas as pd
import json

# Load dataset
df = pd.read_csv('water_pollution_dataset.csv')

# Get statistics for each factory
factories = ['TX-A', 'TX-B', 'TX-C', 'CH-1', 'CH-2']
params = ['turbidity_ntu', 'ph', 'conductivity_us_cm', 'temperature_c', 'chromium_mg_l', 'copper_mg_l', 'tds_mg_l']

print("=== FACTORY CHEMICAL SIGNATURES ===\n")

for fid in factories:
    data = df[df['factory_id'] == fid][params]
    if len(data) > 0:
        print(f"{fid} ({df[df['factory_id']==fid]['factory_type'].iloc[0]}):")
        for param in params:
            print(f"  {param:20s}: {data[param].min():7.2f} - {data[param].max():7.2f} (avg: {data[param].mean():7.2f})")
        print()

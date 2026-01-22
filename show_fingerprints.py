import json

with open('factory_fingerprints.json', 'r') as f:
    fingerprints = json.load(f)

print("=== FACTORY RAW FINGERPRINTS ===\n")

for factory_id in ['TX-A', 'TX-B', 'TX-C', 'CH-1', 'CH-2']:
    if factory_id in fingerprints:
        print(f"{factory_id} ({fingerprints[factory_id]['type']}):")
        raw = fingerprints[factory_id]['raw']
        for key, value in raw.items():
            print(f"  {key:25s}: {value:8.2f}")
        print()

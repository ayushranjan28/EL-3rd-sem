import json

with open('factory_fingerprints.json', 'r') as f:
    fingerprints = json.load(f)

print("Factory ID -> Factory Type Mapping:")
print("=" * 40)
for factory_id, data in fingerprints.items():
    print(f"{factory_id}: {data['type']}")

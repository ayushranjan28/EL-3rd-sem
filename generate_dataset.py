import csv
import random
from datetime import datetime, timedelta

# Configuration
START_DATE = datetime(2026, 1, 1, 0, 0, 0)
INTERVAL_MINUTES = 5
TOTAL_ROWS = 2016  # 7 days * 24 hours * 12 (5-min intervals)

# Factories
FACTORIES = {
    'TX-A': {'type': 'Textile', 'location': 8, 'violation_rate': 0.05},
    'TX-B': {'type': 'Textile', 'location': 15, 'violation_rate': 0.35},
    'TX-C': {'type': 'Textile', 'location': 25, 'violation_rate': 0.08},
    'CH-1': {'type': 'Chemical', 'location': 12, 'violation_rate': 0.25},
    'CH-2': {'type': 'Chemical', 'location': 30, 'violation_rate': 0.15}
}

EMPLOYEES = ['EMP-001', 'EMP-002', 'EMP-003', 'EMP-004', 'EMP-005']

def generate_baseline_reading(timestamp, reading_id):
    return {
        'timestamp': timestamp.isoformat(),
        'reading_id': reading_id,
        'factory_id': '',
        'factory_type': '',
        'location_km_from_origin': random.uniform(1, 35),
        'flow_rate_m3ph': random.uniform(50, 200),
        'turbidity_ntu': random.uniform(1, 20),
        'ph': random.uniform(6.8, 7.8),
        'conductivity_us_cm': random.uniform(150, 400),
        'temperature_c': random.uniform(20, 28),
        'chromium_mg_l': random.uniform(0, 0.02),
        'copper_mg_l': random.uniform(0, 0.05),
        'tds_mg_l': random.uniform(100, 300),
        'uv_vis_absorbance': round(random.uniform(0.01, 0.10), 3),  # Clean water: low absorbance at 254nm
        'baseline_segment_id': f"BASE-{random.randint(1, 10):03d}",
        'is_baseline': 1,
        'is_violation': 0,
        'violation_reason': '',
        'ai_violation_score': round(random.uniform(0, 0.2), 3),
        'assigned_employee_id': '',
        'alert_status': 'none'
    }

def generate_factory_reading(timestamp, reading_id, factory_id, factory_info):
    is_textile = factory_info['type'] == 'Textile'
    hour = timestamp.hour
    
    # Night hours have lower flow
    if 22 <= hour or hour <= 5:
        flow_multiplier = 0.3
    else:
        flow_multiplier = 1.0
    
    if is_textile:
        turbidity = random.uniform(80, 600)
        ph = random.uniform(5, 11)
        conductivity = random.uniform(800, 4000)
        temperature = random.uniform(25, 40)
        chromium = random.uniform(0, 1.0)
        copper = random.uniform(0.01, 0.5)
        tds = random.uniform(800, 3000)
        # Textile: dyes and organic compounds increase UV absorbance
        uv_vis_absorbance = random.uniform(0.2, 1.5)
    else:  # Chemical
        turbidity = random.uniform(40, 400)
        ph = random.uniform(2, 10)
        conductivity = random.uniform(1000, 6000)
        temperature = random.uniform(25, 45)
        chromium = random.uniform(0.05, 2.5)
        copper = random.uniform(0.02, 1.2)
        tds = random.uniform(1000, 5000)
        # Chemical: aromatic compounds and heavy metals increase UV absorbance
        uv_vis_absorbance = random.uniform(0.3, 2.5)
    
    # Correlation: higher turbidity -> higher TDS, conductivity, and UV absorbance
    if turbidity > 300:
        tds *= 1.3
        conductivity *= 1.2
        uv_vis_absorbance *= 1.4  # More suspended particles increase absorbance
    
    # Correlation: higher chromium/copper -> higher UV absorbance (metal complexes)
    if chromium > 0.5 or copper > 0.3:
        uv_vis_absorbance *= 1.2
    
    # Determine violation
    violations = []
    if turbidity > 200:
        violations.append('turbidity_high')
    if ph < 5.5:
        violations.append('ph_low')
    elif ph > 9.0:
        violations.append('ph_high')
    if chromium > 0.1:
        violations.append('chromium_high')
    if copper > 3.0:
        violations.append('copper_high')
    if tds > 2100:
        violations.append('tds_high')
    if uv_vis_absorbance > 1.0:  # High UV absorbance indicates organic pollution
        violations.append('uv_absorbance_high')
    
    is_violation = len(violations) > 0
    
    # AI score
    if is_violation:
        ai_score = random.uniform(0.7, 1.0)
    else:
        # 5% false positives
        if random.random() < 0.05:
            ai_score = random.uniform(0.4, 0.6)
        else:
            ai_score = random.uniform(0, 0.3)
    
    # Alert status
    if is_violation:
        age_hours = (datetime(2026, 1, 8, 0, 0) - timestamp).total_seconds() / 3600
        if age_hours > 120:
            alert_status = 'resolved'
        elif age_hours > 48:
            alert_status = 'acknowledged'
        else:
            alert_status = 'pending'
        assigned_employee = random.choice(EMPLOYEES)
    else:
        alert_status = 'none'
        assigned_employee = ''
    
    return {
        'timestamp': timestamp.isoformat(),
        'reading_id': reading_id,
        'factory_id': factory_id,
        'factory_type': factory_info['type'],
        'location_km_from_origin': factory_info['location'],
        'flow_rate_m3ph': round(random.uniform(100, 500) * flow_multiplier, 2),
        'turbidity_ntu': round(turbidity, 2),
        'ph': round(ph, 2),
        'conductivity_us_cm': round(conductivity, 2),
        'temperature_c': round(temperature, 2),
        'chromium_mg_l': round(chromium, 3),
        'copper_mg_l': round(copper, 3),
        'tds_mg_l': round(tds, 2),
        'uv_vis_absorbance': round(uv_vis_absorbance, 3),
        'baseline_segment_id': '',
        'is_baseline': 0,
        'is_violation': 1 if is_violation else 0,
        'violation_reason': '|'.join(violations),
        'ai_violation_score': round(ai_score, 3),
        'assigned_employee_id': assigned_employee,
        'alert_status': alert_status
    }

# Generate dataset
rows = []
reading_counter = 1

for i in range(TOTAL_ROWS):
    timestamp = START_DATE + timedelta(minutes=i * INTERVAL_MINUTES)
    
    # 20% baseline readings
    if random.random() < 0.20:
        rows.append(generate_baseline_reading(timestamp, f"R-{reading_counter:06d}"))
        reading_counter += 1
    
    # Factory readings (not all factories report at every interval)
    for factory_id, factory_info in FACTORIES.items():
        # 70% chance factory reports at this timestamp
        if random.random() < 0.70:
            rows.append(generate_factory_reading(timestamp, f"R-{reading_counter:06d}", factory_id, factory_info))
            reading_counter += 1

# Write CSV
output_file = r'c:\Users\ayush\Desktop\Main EL 3rd sem\water_pollution_dataset.csv'
fieldnames = [
    'timestamp', 'reading_id', 'factory_id', 'factory_type', 'location_km_from_origin',
    'flow_rate_m3ph', 'turbidity_ntu', 'ph', 'conductivity_us_cm', 'temperature_c',
    'chromium_mg_l', 'copper_mg_l', 'tds_mg_l', 'uv_vis_absorbance', 'baseline_segment_id', 'is_baseline',
    'is_violation', 'violation_reason', 'ai_violation_score', 'assigned_employee_id', 'alert_status'
]

with open(output_file, 'w', newline='', encoding='utf-8') as f:
    writer = csv.DictWriter(f, fieldnames=fieldnames)
    writer.writeheader()
    writer.writerows(rows)

print(f"Generated {len(rows)} rows")
print(f"Dataset saved to: {output_file}")

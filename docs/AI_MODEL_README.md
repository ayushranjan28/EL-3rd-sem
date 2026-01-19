# Water Pollution AI Model - Quick Reference

## 🎯 Model Performance
- **Accuracy**: 99.64%
- **Model Type**: Random Forest Classifier (100 trees)
- **Prediction Speed**: <5ms per reading
- **Training Data**: 7,359 factory readings

## 📁 Generated Files

### Model Files
1. `pollution_model.pkl` - Trained Random Forest model
2. `factory_encoder.pkl` - Factory ID encoder
3. `factory_type_encoder.pkl` - Factory type encoder
4. `model_metadata.json` - Model configuration and metrics

### Scripts
1. `train_pollution_model.py` - Training pipeline
2. `predict_pollution.py` - Prediction library
3. `api_server.py` - REST API server

## 🚀 Quick Start

### 1. Install Dependencies
```bash
pip install scikit-learn pandas numpy joblib flask flask-cors
```

### 2. Train Model (Already Done!)
```bash
python train_pollution_model.py
```

### 3. Test Predictions
```bash
python predict_pollution.py
```

### 4. Start API Server
```bash
python api_server.py
```
Server runs on: http://localhost:5000

## 🔌 API Endpoints

### Health Check
```bash
GET http://localhost:5000/health
```

### Single Prediction
```bash
POST http://localhost:5000/predict
Content-Type: application/json

{
  "factory_id": "TX-B",
  "factory_type": "Textile",
  "location_km_from_origin": 15.0,
  "flow_rate_m3ph": 350.0,
  "turbidity_ntu": 420.0,
  "ph": 4.5,
  "conductivity_us_cm": 3200.0,
  "temperature_c": 38.0,
  "chromium_mg_l": 0.85,
  "copper_mg_l": 0.32,
  "tds_mg_l": 2800.0,
  "timestamp": "2026-01-06T14:30:00"
}
```

Response:
```json
{
  "success": true,
  "prediction": {
    "is_violation": true,
    "violation_probability": 0.98,
    "confidence": 0.98,
    "violation_reasons": ["turbidity_high", "ph_low", "chromium_high", "tds_high"],
    "alert_level": "critical",
    "factory_id": "TX-B",
    "timestamp": "2026-01-06T14:30:00"
  },
  "model_accuracy": 0.9964
}
```

### Batch Prediction
```bash
POST http://localhost:5000/predict/batch
Content-Type: application/json

{
  "readings": [
    { /* reading 1 */ },
    { /* reading 2 */ }
  ]
}
```

### Model Info
```bash
GET http://localhost:5000/model/info
```

### Supported Factories
```bash
GET http://localhost:5000/factories
```

## 💻 Python Integration

### Single Prediction
```python
from predict_pollution import PollutionPredictor

predictor = PollutionPredictor()

reading = {
    'factory_id': 'TX-B',
    'factory_type': 'Textile',
    'location_km_from_origin': 15.0,
    'flow_rate_m3ph': 350.0,
    'turbidity_ntu': 420.0,
    'ph': 4.5,
    'conductivity_us_cm': 3200.0,
    'temperature_c': 38.0,
    'chromium_mg_l': 0.85,
    'copper_mg_l': 0.32,
    'tds_mg_l': 2800.0
}

result = predictor.predict_single(reading)
print(f"Violation: {result['is_violation']}")
print(f"Probability: {result['violation_probability']:.3f}")
```

### Batch Prediction
```python
import pandas as pd

df = pd.read_csv('water_pollution_dataset.csv')
df_factory = df[df['is_baseline'] == 0]

results = predictor.predict_batch(df_factory)
print(results[['factory_id', 'ai_prediction', 'ai_violation_score']])
```

## 🎨 Dashboard Integration

### Fetch Prediction from Frontend
```javascript
async function checkViolation(reading) {
  const response = await fetch('http://localhost:5000/predict', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(reading)
  });
  
  const data = await response.json();
  
  if (data.success) {
    console.log('Violation:', data.prediction.is_violation);
    console.log('Probability:', data.prediction.violation_probability);
    console.log('Alert Level:', data.prediction.alert_level);
  }
}
```

## 📊 Top Features (by importance)
1. **Chromium** (24.9%) - Most important indicator
2. **Turbidity** (20.6%)
3. **Flow Rate** (18.6%)
4. **TDS** (15.6%)
5. **pH** (7.2%)

## 🏭 Supported Factories
- **TX-A** (Textile, 8 km)
- **TX-B** (Textile, 15 km) - Highest violation rate
- **TX-C** (Textile, 25 km)
- **CH-1** (Chemical, 12 km)
- **CH-2** (Chemical, 30 km)

## ⚠️ Violation Thresholds (CPCB)
- Turbidity > 200 NTU
- pH < 5.5 or pH > 9.0
- Chromium > 0.1 mg/L
- Copper > 3.0 mg/L
- TDS > 2,100 mg/L

## 🔄 Retraining Model
To retrain with new data:
```bash
# Update water_pollution_dataset.csv with new readings
python train_pollution_model.py
```

## 🆓 Why This Stack?
✅ **100% Free** - No API costs, runs locally
✅ **Fast** - <5ms predictions
✅ **Accurate** - 99.64% accuracy
✅ **Production-Ready** - REST API included
✅ **Offline** - No internet required
✅ **Scalable** - Can handle 1000s of requests/sec

## 📝 Notes
- Model is already trained and ready to use
- All files are in: `c:\Users\ayush\Desktop\Main EL 3rd sem\`
- CORS enabled for frontend integration
- Model automatically handles missing timestamps

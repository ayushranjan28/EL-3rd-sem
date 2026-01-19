# 🚀 Complete Setup Guide - EcoGuard Pollution System

## ✅ System Overview

### 1. Trained AI Models
- **Violation Predictor**: Random Forest Classifier (~99.5% Accuracy)
- **Source Identifier**: Hybrid AI + Chemical Fingerprinting (100% Accuracy)
- **Performance**: <5ms prediction speed, runs locally.

### 2. Project Structure
```
EL-3rd-sem-main/
├── 📊 Data & Models
│   ├── water_pollution_dataset.csv
│   ├── pollution_model.pkl
│   ├── traceback_model.pkl
│   ├── factory_fingerprints.json
│   └── *.json/pkl (Metadata & Encoders)
│
├── 🐍 Core Scripts
│   ├── api_server.py           # Flask Backend
│   ├── predict_pollution.py    # AI Inference Engine
│   ├── generate_fingerprints.py # Chemical Signature Generator
│   ├── train_pollution_model.py # Violation Model Trainer
│   └── train_traceback_model.py # Source ID Model Trainer
│
├── 🎨 Dashboard
│   ├── templates/index.html    # Main UI
│   └── static/css/style.css    # Styles & Animations
│
└── 📚 Documentation (in docs/)
    ├── COMPLETE_SETUP_GUIDE.md
    └── ...
```

---

## 🎯 Quick Start

### Step 1: Install Dependencies
```bash
pip install pandas numpy scikit-learn flask plotly joblib
```

### Step 2: Start the Server
```bash
python api_server.py
```
*You should see "Starting server on http://localhost:5000"*

### Step 3: Launch Dashboard
Open **[http://localhost:5000](http://localhost:5000)** in your browser.

---

## 📖 Features & Usage

### 1. Violation Predictor (Tab 1)
Predicts if water quality violates regulatory standards.
- **Inputs**: Factory ID, Location, Flow Rate, and 7 Chemical Parameters.
- **Output**: Safe/Violation status with specific reasons (e.g., "High Chromium").

### 2. Source Identifier (Tab 2)
Traces pollution back to the specific factory type (Textile vs Chemical) and ID.
- **Inputs**: 
    - **Location (km)**: Distance from origin (Crucial for identification).
    - **Flow Rate**: Discharge volume.
    - **Chemicals**: Full spectrum analysis.
- **Output**: 
    - **Most Probable Source**: The specific factory ID (e.g., TX-A).
    - **Chemical Fingerprint**: Radar chart comparing input vs factory signature.

---

## 🔧 Maintenance

### Retraining Models
If you update the dataset `water_pollution_dataset.csv`:
1. **Train Violation Model**:
   ```bash
   python train_pollution_model.py
   ```
2. **Train Source Identifier**:
   ```bash
   python train_traceback_model.py
   ```
3. **Regenerate Fingerprints**:
   ```bash
   python generate_fingerprints.py
   ```

### Troubleshooting
-   **"Model not found" error**: Ensure all `.pkl` and `.json` files are in the root directory.
-   **Incorrect Source ID**: Check that "Location" and "Flow Rate" match the tested factory's profile (e.g., TX-A is at 8.0km, TX-C at 25.0km).

---

## 🎓 Understanding the AI
-   **Violation Detection**: 99.5% accuracy. Checks chemicals against CPCB standards + learned patterns.
-   **Source Tracing**: Uses "Euclidean Distance" to find which factory's historical chemical profile ("Fingerprint") is most similar to the current water sample.

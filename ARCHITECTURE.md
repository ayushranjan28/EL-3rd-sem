# Water Pollution Monitoring System - Architecture

## 🎯 System Overview

### Data Flow Architecture

```
CSV File (public/data.csv)
    ↓
AI Model Training (Python)
    ↓
Trained Model (pollution_model.pkl)
    ↓
AI Prediction API (Flask - Port 5000)
    ↓
Dashboard submits sensor readings
    ↓
AI API returns violation prediction
    ↓
Dashboard saves to MongoDB
    ↓
Real-time display in Dashboard
```

---

## 📊 Component Roles

### 1. CSV File (`public/data.csv`)
**Purpose**: Training data ONLY
- 7,405 historical readings
- Used to train the AI model
- NOT used for dashboard display
- Contains labeled violations for supervised learning

### 2. AI Model Training (`train_pollution_model.py`)
**Purpose**: Train violation detection model
- Reads CSV file
- Trains Random Forest Classifier
- Achieves 99.57% accuracy
- Saves model to `pollution_model.pkl`

### 3. AI Prediction API (`api_server.py`)
**Purpose**: Real-time violation prediction
- Flask server on port 5000
- Loads trained model
- Accepts sensor readings
- Returns violation prediction + score
- <5ms response time

### 4. Dashboard (Next.js - Port 3000)
**Purpose**: User interface & data management
- Submit new sensor readings
- Call AI API for predictions
- Save results to MongoDB
- Display real-time alerts
- Manage alert status

### 5. MongoDB Database
**Purpose**: Persistent storage
- **users** collection: Authentication
- **alerts** collection: Violation alerts
- **readings** collection: Sensor data
- Real-time data source for dashboard

---

## 🔄 Workflow

### Submitting a New Reading:

1. **User enters sensor data** in dashboard form
   - Factory ID, turbidity, pH, chromium, etc.

2. **Dashboard calls AI API**
   ```javascript
   POST http://localhost:5000/predict
   Body: { sensor readings }
   ```

3. **AI API analyzes data**
   - Uses trained model
   - Returns violation prediction
   - Includes AI score (0-1)

4. **Dashboard saves to MongoDB**
   ```javascript
   POST /api/alerts
   Body: { readings + AI prediction }
   ```

5. **Dashboard updates in real-time**
   - Shows new alert
   - Updates statistics
   - Assigns to employee if violation

---

## 🗄️ Data Storage

### CSV (Training Only)
- **Location**: `public/data.csv`
- **Purpose**: Train AI model
- **Usage**: One-time training
- **Not displayed** in dashboard

### MongoDB (Live Data)
- **Location**: Configured in `.env.local`
- **Purpose**: Store real-time alerts
- **Usage**: Dashboard data source
- **Collections**:
  - `users`: emp047, emp048, admin
  - `alerts`: Violation alerts
  - `readings`: Sensor submissions

---

## 🤖 AI Model

### Training
```bash
python train_pollution_model.py
```
- Reads CSV file
- Trains on 7,405 samples
- Saves model files

### Prediction
```bash
python api_server.py
```
- Loads trained model
- Provides REST API
- Returns predictions

### Model Files
- `pollution_model.pkl` - Main model
- `factory_encoder.pkl` - Factory encoder
- `factory_type_encoder.pkl` - Type encoder
- `model_metadata.json` - Configuration

---

## 📡 API Endpoints

### AI Prediction API (Port 5000)
```
POST /predict
  - Input: Sensor readings
  - Output: Violation prediction + score

GET /health
  - Check API status

GET /model/info
  - Model metadata
```

### Dashboard API (Port 3000)
```
POST /api/auth/login
  - MongoDB authentication

GET /api/alerts
  - Fetch alerts from MongoDB

POST /api/alerts
  - Save new alert to MongoDB

PATCH /api/alerts
  - Update alert status
```

---

## 🎯 Key Differences

### CSV File
- ✅ Used for: AI model training
- ❌ NOT used for: Dashboard display
- ❌ NOT used for: Real-time data

### MongoDB
- ✅ Used for: Dashboard display
- ✅ Used for: Real-time alerts
- ✅ Used for: User authentication
- ✅ Used for: Data persistence

### AI Model
- ✅ Trained on: CSV data
- ✅ Predicts: New sensor readings
- ✅ Saves to: MongoDB (via dashboard)

---

## 🚀 Running the System

### 1. Train AI Model (One-time)
```bash
cd "c:\Users\ayush\Desktop\Main EL 3rd sem"
python train_pollution_model.py
```

### 2. Start AI API
```bash
python api_server.py
# Runs on http://localhost:5000
```

### 3. Start Dashboard
```bash
cd cpcb-dashboard
npm run dev
# Runs on http://localhost:3000
```

### 4. Use Dashboard
- Submit sensor readings
- AI predicts violations
- Results saved to MongoDB
- Display updates in real-time

---

## 📊 Dashboard Features

### Real-Time Data (from MongoDB)
- Total alerts count
- Active alerts (pending)
- Resolved alerts
- Violation rate
- Top violators
- Recent alerts table

### AI Integration
- Submit sensor readings
- Get AI predictions
- Auto-save to database
- Display AI confidence score

### User Management
- Login with emp047/emp123
- Role-based access
- Alert assignment

---

## 💡 Summary

**CSV File**: Training data for AI model (not displayed)  
**AI Model**: Trained on CSV, predicts new readings  
**MongoDB**: Stores real-time alerts (displayed in dashboard)  
**Dashboard**: UI for submitting readings & viewing alerts  

The dashboard shows **live data from MongoDB**, not historical CSV data!

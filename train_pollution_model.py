"""
AI Model Training for Water Pollution Violation Detection
Uses Random Forest Classifier for fast, accurate predictions
"""

import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import classification_report, confusion_matrix, accuracy_score, roc_auc_score
import joblib
import json
from datetime import datetime

print("=" * 70)
print("Water Pollution AI Model Training Pipeline")
print("=" * 70)

# Load dataset
print("\n[1/6] Loading dataset...")
df = pd.read_csv('water_pollution_dataset.csv')
print(f"✓ Loaded {len(df)} rows")

# Data preprocessing
print("\n[2/6] Preprocessing data...")

# Remove baseline readings (we only predict factory violations)
df_factory = df[df['is_baseline'] == 0].copy()
print(f"✓ Filtered to {len(df_factory)} factory readings")

# Feature engineering
df_factory['hour'] = pd.to_datetime(df_factory['timestamp']).dt.hour
df_factory['day_of_week'] = pd.to_datetime(df_factory['timestamp']).dt.dayofweek
df_factory['is_night'] = ((df_factory['hour'] >= 22) | (df_factory['hour'] <= 5)).astype(int)

# Encode categorical variables
le_factory = LabelEncoder()
le_type = LabelEncoder()

df_factory['factory_id_encoded'] = le_factory.fit_transform(df_factory['factory_id'])
df_factory['factory_type_encoded'] = le_type.fit_transform(df_factory['factory_type'])

# Select features for training
feature_columns = [
    'factory_id_encoded',
    'factory_type_encoded',
    'location_km_from_origin',
    'flow_rate_m3ph',
    'turbidity_ntu',
    'ph',
    'conductivity_us_cm',
    'temperature_c',
    'chromium_mg_l',
    'copper_mg_l',
    'tds_mg_l',
    'hour',
    'day_of_week',
    'is_night'
]

X = df_factory[feature_columns]
y = df_factory['is_violation']

print(f"✓ Features: {len(feature_columns)}")
print(f"✓ Violations: {y.sum()} ({y.sum()/len(y)*100:.1f}%)")
print(f"✓ Compliant: {len(y) - y.sum()} ({(len(y) - y.sum())/len(y)*100:.1f}%)")

# Split data
print("\n[3/6] Splitting data...")
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)
print(f"✓ Training set: {len(X_train)} samples")
print(f"✓ Test set: {len(X_test)} samples")

# Train Random Forest model
print("\n[4/6] Training Random Forest Classifier...")
print("(This may take 30-60 seconds...)")

model = RandomForestClassifier(
    n_estimators=100,          # Good balance of accuracy and speed
    max_depth=15,              # Prevent overfitting
    min_samples_split=10,
    min_samples_leaf=5,
    random_state=42,
    n_jobs=-1,                 # Use all CPU cores for speed
    class_weight='balanced'    # Handle class imbalance
)

model.fit(X_train, y_train)
print("✓ Model trained successfully!")

# Evaluate model
print("\n[5/6] Evaluating model performance...")
y_pred = model.predict(X_test)
y_pred_proba = model.predict_proba(X_test)[:, 1]

accuracy = accuracy_score(y_test, y_pred)
roc_auc = roc_auc_score(y_test, y_pred_proba)

print(f"\n{'='*70}")
print("MODEL PERFORMANCE METRICS")
print(f"{'='*70}")
print(f"Accuracy: {accuracy*100:.2f}%")
print(f"ROC-AUC Score: {roc_auc:.4f}")
print(f"\nConfusion Matrix:")
cm = confusion_matrix(y_test, y_pred)
print(f"  True Negatives:  {cm[0][0]:,}")
print(f"  False Positives: {cm[0][1]:,}")
print(f"  False Negatives: {cm[1][0]:,}")
print(f"  True Positives:  {cm[1][1]:,}")

print(f"\nClassification Report:")
print(classification_report(y_test, y_pred, target_names=['Compliant', 'Violation']))

# Feature importance
print(f"\n{'='*70}")
print("TOP 10 MOST IMPORTANT FEATURES")
print(f"{'='*70}")
feature_importance = pd.DataFrame({
    'feature': feature_columns,
    'importance': model.feature_importances_
}).sort_values('importance', ascending=False)

for idx, row in feature_importance.head(10).iterrows():
    print(f"{row['feature']:30s} {row['importance']:.4f}")

# Save model and encoders
print(f"\n[6/6] Saving model and artifacts...")

# Save the trained model
joblib.dump(model, 'pollution_model.pkl')
print("✓ Saved: pollution_model.pkl")

# Save label encoders
joblib.dump(le_factory, 'factory_encoder.pkl')
joblib.dump(le_type, 'factory_type_encoder.pkl')
print("✓ Saved: factory_encoder.pkl")
print("✓ Saved: factory_type_encoder.pkl")

# Save feature names and metadata
metadata = {
    'feature_columns': feature_columns,
    'model_type': 'RandomForestClassifier',
    'accuracy': float(accuracy),
    'roc_auc': float(roc_auc),
    'training_date': datetime.now().isoformat(),
    'training_samples': int(len(X_train)),
    'test_samples': int(len(X_test)),
    'factories': list(le_factory.classes_),
    'factory_types': list(le_type.classes_)
}

with open('model_metadata.json', 'w') as f:
    json.dump(metadata, f, indent=2)
print("✓ Saved: model_metadata.json")

print(f"\n{'='*70}")
print("✅ TRAINING COMPLETE!")
print(f"{'='*70}")
print("\nModel files ready for deployment:")
print("  1. pollution_model.pkl - Main ML model")
print("  2. factory_encoder.pkl - Factory ID encoder")
print("  3. factory_type_encoder.pkl - Factory type encoder")
print("  4. model_metadata.json - Model configuration")
print("\nNext step: Use predict_pollution.py for real-time predictions")
print("="*70)

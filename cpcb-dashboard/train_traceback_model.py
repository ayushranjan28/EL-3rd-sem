import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import classification_report, accuracy_score
import joblib
import json

def train_traceback_model():
    print("Loading dataset...")
    df = pd.read_csv('water_pollution_dataset.csv')
    
    # Feature selection
    feature_cols = [
        'location_km_from_origin', 'flow_rate_m3ph',
        'turbidity_ntu', 'ph', 'conductivity_us_cm', 'temperature_c',
        'chromium_mg_l', 'copper_mg_l', 'tds_mg_l', 'uv_vis_absorbance'
    ]
    
    target_col = 'factory_type'
    
    # Handle missing values if any (though dataset should be clean based on previous steps)
    df = df.dropna(subset=feature_cols + [target_col])
    
    X = df[feature_cols]
    y = df[target_col]
    
    # Encode target
    le = LabelEncoder()
    y_encoded = le.fit_transform(y)
    
    # Split data
    X_train, X_test, y_train, y_test = train_test_split(X, y_encoded, test_size=0.2, random_state=42)
    
    # Train model
    print("Training Random Forest Classifier...")
    clf = RandomForestClassifier(n_estimators=100, random_state=42)
    clf.fit(X_train, y_train)
    
    # Evaluate
    y_pred = clf.predict(X_test)
    accuracy = accuracy_score(y_test, y_pred)
    print(f"Model Accuracy: {accuracy*100:.2f}%")
    print("\nClassification Report:")
    print(classification_report(y_test, y_pred, target_names=le.classes_))
    
    # Save artifacts
    print("Saving model and artifacts...")
    joblib.dump(clf, 'traceback_model.pkl')
    joblib.dump(le, 'active_factory_type_encoder.pkl') # Distinct name to avoid conflict
    
    metadata = {
        'features': feature_cols,
        'classes': list(le.classes_),
        'accuracy': accuracy,
        'training_date': pd.Timestamp.now().isoformat()
    }
    
    with open('traceback_metadata.json', 'w') as f:
        json.dump(metadata, f, indent=4)
        
    print("Done!")

if __name__ == "__main__":
    train_traceback_model()

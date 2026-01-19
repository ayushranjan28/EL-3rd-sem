"""
Real-time Pollution Violation Prediction and Source Tracing API
Fast inference using trained Random Forest models
"""

import pandas as pd
import numpy as np
import joblib
import json
import math
from datetime import datetime

class PollutionPredictor:
    """Fast, production-ready pollution violation predictor"""
    
    def __init__(self):
        """Load trained model and encoders"""
        print("Loading Pollution Prediction AI model...")
        self.model = joblib.load('pollution_model.pkl')
        self.factory_encoder = joblib.load('factory_encoder.pkl')
        self.factory_type_encoder = joblib.load('factory_type_encoder.pkl')
        
        with open('model_metadata.json', 'r') as f:
            self.metadata = json.load(f)
        
        print(f"[OK] Pollution Model loaded (Accuracy: {self.metadata['accuracy']*100:.2f}%)")
        print(f"[OK] Ready for pollution predictions!\n")
    
    def predict_single(self, reading_data):
        """
        Predict violation for a single reading
        """
        # Parse timestamp if provided
        if 'timestamp' in reading_data:
            ts = pd.to_datetime(reading_data['timestamp'])
            hour = ts.hour
            day_of_week = ts.dayofweek
        else:
            now = datetime.now()
            hour = now.hour
            day_of_week = now.weekday()
        
        is_night = 1 if (hour >= 22 or hour <= 5) else 0
        
        # Encode categorical features
        # Encode categorical features with fallback for unknown values
        try:
            factory_id_encoded = self.factory_encoder.transform([reading_data['factory_id']])[0]
        except ValueError:
            # Fallback to a known factory ID if unknown provided
            factory_id_encoded = self.factory_encoder.transform([self.factory_encoder.classes_[0]])[0]
            
        # Default factory_type if not provided
        f_type = reading_data.get('factory_type', self.factory_type_encoder.classes_[0])
        try:
            factory_type_encoded = self.factory_type_encoder.transform([f_type])[0]
        except ValueError:
            # Fallback
            factory_type_encoded = self.factory_type_encoder.transform([self.factory_type_encoder.classes_[0]])[0]
        
        # Prepare features in correct order
        features = np.array([[
            factory_id_encoded,
            factory_type_encoded,
            reading_data['location_km_from_origin'],
            reading_data['flow_rate_m3ph'],
            reading_data['turbidity_ntu'],
            reading_data['ph'],
            reading_data['conductivity_us_cm'],
            reading_data['temperature_c'],
            reading_data['chromium_mg_l'],
            reading_data['copper_mg_l'],
            reading_data['tds_mg_l'],
            hour,
            day_of_week,
            is_night
        ]])
        
        # Make prediction
        prediction = self.model.predict(features)[0]
        probability = self.model.predict_proba(features)[0]
        
        # Determine violation reasons based on thresholds
        violations = []
        if reading_data['turbidity_ntu'] > 200:
            violations.append('turbidity_high')
        if reading_data['ph'] < 5.5:
            violations.append('ph_low')
        elif reading_data['ph'] > 9.0:
            violations.append('ph_high')
        if reading_data['chromium_mg_l'] > 0.1:
            violations.append('chromium_high')
        if reading_data['copper_mg_l'] > 3.0:
            violations.append('copper_high')
        if reading_data['tds_mg_l'] > 2100:
            violations.append('tds_high')
        
        return {
            'is_violation': bool(prediction),
            'violation_probability': float(probability[1]),
            'confidence': float(max(probability)),
            'violation_reasons': violations,
            'alert_level': self._get_alert_level(probability[1]),
            'factory_id': reading_data['factory_id'],
            'timestamp': reading_data.get('timestamp', datetime.now().isoformat())
        }
    
    def predict_batch(self, readings_df):
        """Predict violations for multiple readings"""
        df = readings_df.copy()
        
        # Feature engineering
        df['hour'] = pd.to_datetime(df['timestamp']).dt.hour
        df['day_of_week'] = pd.to_datetime(df['timestamp']).dt.dayofweek
        df['is_night'] = ((df['hour'] >= 22) | (df['hour'] <= 5)).astype(int)
        
        # Encode
        df['factory_id_encoded'] = self.factory_encoder.transform(df['factory_id'])
        
        # Handle missing factory_type in batch
        if 'factory_type' not in df.columns:
            df['factory_type'] = self.factory_type_encoder.classes_[0]
            
        df['factory_type_encoded'] = self.factory_type_encoder.transform(df['factory_type'])
        
        # Prepare features
        X = df[self.metadata['feature_columns']]
        
        # Predict
        predictions = self.model.predict(X)
        probabilities = self.model.predict_proba(X)[:, 1]
        
        df['ai_prediction'] = predictions
        df['ai_violation_score'] = probabilities
        df['ai_alert_level'] = [self._get_alert_level(p) for p in probabilities]
        
        return df
    
    def _get_alert_level(self, probability):
        """Determine alert level based on probability"""
        if probability >= 0.8:
            return 'critical'
        elif probability >= 0.6:
            return 'high'
        elif probability >= 0.4:
            return 'medium'
        else:
            return 'low'


class PollutionTracer:
    """Class to identify pollution sources based on chemical signatures"""
    
    def __init__(self):
        """Load source identification model"""
        print("Loading Source Identification AI model...")
        try:
            self.model = joblib.load('traceback_model.pkl')
            self.factory_type_encoder = joblib.load('active_factory_type_encoder.pkl')
            
            with open('traceback_metadata.json', 'r') as f:
                self.metadata = json.load(f)
                
            print(f"[OK] Tracer Model loaded (Accuracy: {self.metadata['accuracy']*100:.2f}%)")
            self.features = self.metadata['features']
            
            # Load Fingerprints
            with open('factory_fingerprints.json', 'r') as f:
                self.fingerprints = json.load(f)
            
            with open('fingerprint_scaler.json', 'r') as f:
                self.scaler_params = json.load(f)
                
        except Exception as e:
            print(f"[ERROR] Failed to load tracer model or fingerprints: {e}")
            self.model = None

    def calculate_fingerprint_match(self, input_data):
        """
        Calculate probability based on Euclidean distance to factory centroids
        """
        if not hasattr(self, 'fingerprints'):
            return None
            
        # Normalize input
        features_to_norm = self.scaler_params['features']
        normalized_input = {}
        
        # Min-Max Scaling: (x - min) / (max - min)
        for i, feature in enumerate(features_to_norm):
            if feature in input_data:
                val = float(input_data[feature])
                min_val = self.scaler_params['min'][i]
                max_val = self.scaler_params['max'][i]
                scale = self.scaler_params['scale'][i] # scale = 1 / (max - min)
                
                # Manual normalization using saved scaler params
                norm_val = (val - min_val) * scale
                normalized_input[feature] = norm_val
        
        distances = {}
        
        # Calculate Euclidean Distance
        for factory, data in self.fingerprints.items():
            centroid = data['normalized']
            sum_sq_diff = 0
            count = 0
            
            for feature in features_to_norm:
                if feature in normalized_input and feature in centroid:
                    diff = normalized_input[feature] - centroid[feature]
                    sum_sq_diff += diff * diff
                    count += 1
            
            if count > 0:
                dist = math.sqrt(sum_sq_diff)
                distances[factory] = dist
        
        # Convert distance to probability (Softmax-like using negative distance)
        # P = exp(-dist) / sum(exp(-dist))
        
        exp_dists = {k: math.exp(-v) for k, v in distances.items()}
        total_exp = sum(exp_dists.values())
        
        probabilities = {k: (v / total_exp) for k, v in exp_dists.items()}
        
        # Sort by probability
        sorted_probs = dict(sorted(probabilities.items(), key=lambda item: item[1], reverse=True))
        
        # Get raw fingerprint data for the top match to display in radar chart
        top_match = list(sorted_probs.keys())[0]
        
        return {
            'probabilities': sorted_probs,
            'most_probable': top_match,
            'input_raw': {k: float(input_data[k]) for k in features_to_norm if k in input_data},
            'fingerprint_raw': self.fingerprints[top_match]['raw'],
            'all_fingerprints_raw': {k: v['raw'] for k, v in self.fingerprints.items()} # useful for multi-radar
        }

    def trace_source(self, reading_data):
        """
        Identify potential source factory type based on water parameters
        """
        if self.model is None:
            return {'error': 'Model not loaded'}
            
        # Prepare feature vector ensuring all required features are present
        features = []
        missing_features = []
        
        for feature in self.features:
            if feature in reading_data:
                features.append(float(reading_data[feature]))
            else:
                missing_features.append(feature)
        
        if missing_features:
            return {
                'success': False,
                'error': f'Missing features: {missing_features}'
            }
            
        # Reshape for prediction
        X = np.array([features])
        
        # Predict
        prediction_idx = self.model.predict(X)[0]
        probabilities = self.model.predict_proba(X)[0]
        
        predicted_class = self.factory_type_encoder.inverse_transform([prediction_idx])[0]
        
        # Get fingerprint analysis
        fingerprint_analysis = self.calculate_fingerprint_match(reading_data)
        
        # Hybrid result (Model Prediction + Fingerprint Analysis)
        
        # Create confidence dictionary
        confidence_scores = {}
        for idx, prob in enumerate(probabilities):
            class_name = self.factory_type_encoder.inverse_transform([idx])[0]
            confidence_scores[class_name] = float(prob)
            
        return {
            'success': True,
            'predicted_source': predicted_class,
            'confidence_scores': confidence_scores,
            'fingerprint_analysis': fingerprint_analysis,
            'top_confidence': float(max(probabilities))
        }


if __name__ == "__main__":
    print("Running tests...")
    # Test Tracer
    tracer = PollutionTracer()
    test_data = {
        'turbidity_ntu': 300,
        'ph': 4.0,
        'conductivity_us_cm': 4000,
        'temperature_c': 35,
        'chromium_mg_l': 2.0,
        'copper_mg_l': 0.5,
        'tds_mg_l': 3000,
        'uv_vis_absorbance': 2.5
    }
    result = tracer.trace_source(test_data)
    print("Trace Result:", result)

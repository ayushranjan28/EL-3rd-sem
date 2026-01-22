"""
Flask REST API for Water Pollution Violation Prediction
Fast, lightweight API for dashboard integration
"""

from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
import pandas as pd
from predict_pollution import PollutionPredictor, PollutionTracer
from datetime import datetime
import traceback
import os

# Configure Flask to use templates and static files from cpcb-dashboard directory
template_dir = os.path.join(os.path.dirname(__file__), 'cpcb-dashboard', 'templates')
static_dir = os.path.join(os.path.dirname(__file__), 'cpcb-dashboard', 'static')

app = Flask(__name__, template_folder=template_dir, static_folder=static_dir)
CORS(app)  # Enable CORS for frontend integration

# Initialize predictor (loads model once at startup)
print("Initializing AI predictor...")
predictor = PollutionPredictor()
print("Initializing AI Tracer...")
tracer = PollutionTracer()
print("[OK] API ready!\n")


@app.route('/')
def index():
    """Serve the prediction interface"""
    return render_template('index.html')
@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'model_accuracy': predictor.metadata['accuracy'],
        'timestamp': datetime.now().isoformat()
    })

@app.route('/predict', methods=['POST'])
def predict_violation():
    """
    Predict violation for a single reading
    
    Request body example:
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
    """
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = [
            'factory_id', 'location_km_from_origin',
            'flow_rate_m3ph', 'turbidity_ntu', 'ph', 'conductivity_us_cm',
            'temperature_c', 'chromium_mg_l', 'copper_mg_l', 'tds_mg_l'
        ]
        
        missing_fields = [f for f in required_fields if f not in data]
        if missing_fields:
            return jsonify({
                'error': 'Missing required fields',
                'missing_fields': missing_fields
            }), 400
        
        # Make prediction
        result = predictor.predict_single(data)
        
        return jsonify({
            'success': True,
            'prediction': result,
            'model_accuracy': predictor.metadata['accuracy']
        })
    
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e),
            'traceback': traceback.format_exc()
        }), 500

@app.route('/predict/batch', methods=['POST'])
def predict_batch():
    """
    Predict violations for multiple readings
    
    Request body example:
    {
        "readings": [
            {
                "factory_id": "TX-A",
                "factory_type": "Textile",
                ...
            },
            {
                "factory_id": "CH-1",
                "factory_type": "Chemical",
                ...
            }
        ]
    }
    """
    try:
        data = request.get_json()
        
        if 'readings' not in data or not isinstance(data['readings'], list):
            return jsonify({
                'error': 'Request must contain "readings" array'
            }), 400
        
        # Convert to DataFrame
        df = pd.DataFrame(data['readings'])
        
        # Make predictions
        results_df = predictor.predict_batch(df)
        
        # Convert to list of dicts
        predictions = results_df[[
            'factory_id', 'timestamp', 'ai_prediction', 
            'ai_violation_score', 'ai_alert_level'
        ]].to_dict('records')
        
        return jsonify({
            'success': True,
            'predictions': predictions,
            'total_readings': len(predictions),
            'violations_detected': int(results_df['ai_prediction'].sum())
        })
    
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e),
            'traceback': traceback.format_exc()
        }), 500

@app.route('/model/info', methods=['GET'])
def model_info():
    """Get model metadata and performance metrics"""
    return jsonify({
        'success': True,
        'metadata': predictor.metadata
    })

@app.route('/traceback', methods=['POST'])
def trace_pollution_source():
    """
    Identify potential source of pollution (Chemical Signature Backtracking)
    """
    try:
        data = request.get_json()
        
        # Check for required fields (handling partial data handled by class)
        result = tracer.trace_source(data)
        
        if not result.get('success', False):
             return jsonify(result), 400
             
        return jsonify(result)
    
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e),
            'traceback': traceback.format_exc()
        }), 500

@app.route('/factories', methods=['GET'])
def get_factories():
    """Get list of supported factories"""
    return jsonify({
        'success': True,
        'factories': predictor.metadata['factories'],
        'factory_types': predictor.metadata['factory_types']
    })

if __name__ == '__main__':
    print("="*70)
    print("WATER POLLUTION AI API SERVER")
    print("="*70)
    print(f"\nModel Accuracy: {predictor.metadata['accuracy']*100:.2f}%")
    print(f"Training Date: {predictor.metadata['training_date']}")
    print("\nAvailable Endpoints:")
    print("  GET  /health          - Health check")
    print("  POST /predict         - Single prediction")
    print("  POST /predict/batch   - Batch predictions")
    print("  GET  /model/info      - Model metadata")
    print("  GET  /factories       - Supported factories")
    print("\n" + "="*70)
    print("Starting server on http://localhost:5000")
    print("="*70 + "\n")
    
    app.run(host='0.0.0.0', port=5000, debug=True)

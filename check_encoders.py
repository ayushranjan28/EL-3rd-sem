import joblib
import pandas as pd

try:
    le_factory = joblib.load('factory_encoder.pkl')
    le_type = joblib.load('factory_type_encoder.pkl')
    
    print("Factory IDs:", le_factory.classes_)
    print("Factory Types:", le_type.classes_)
    
    print("\nFallback (index 0):")
    print("Factory ID:", le_factory.classes_[0])
    print("Factory Type:", le_type.classes_[0])
except Exception as e:
    print(f"Error: {e}")

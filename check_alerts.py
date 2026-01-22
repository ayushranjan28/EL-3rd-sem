import requests
import json

try:
    response = requests.get('http://localhost:3000/api/alerts?limit=100')
    if response.status_code == 200:
        data = response.json()
        if data.get('success'):
            alerts = data.get('alerts', [])
            print(f"Total Alerts in DB: {len(alerts)}")
            for i, alert in enumerate(alerts):
                print(f"{i+1}. {alert.get('ai_alert_level')} - {alert.get('factory_id')} - {alert.get('timestamp')}")
        else:
            print("API returned success=false")
    else:
        print(f"Error: {response.status_code}")
except Exception as e:
    print(f"Failed to connect: {e}")

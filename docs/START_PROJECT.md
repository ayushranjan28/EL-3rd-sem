# How to Run the Chemical Signature Backtracking System

This project is now set up as a full-stack Flask application.

## Prerequisites
- Python 3.8+
- Required packages (installed): `flask`, `pandas`, `scikit-learn`, `flask-cors`

## Quick Start

1. **Open a terminal** in the project directory:
   ```powershell
   cd c:\Users\nidhi\OneDrive\Desktop\EL-3rd-sem-main
   ```

2. **Start the Server**:
   ```powershell
   python api_server.py
   ```
   *Note: Providing the server is already running, you can skip this step.*

3. **Access the Dashboard**:
   Open your web browser and navigate to:
   [http://localhost:5000](http://localhost:5000)

## Features

### 1. Violation Predictor (Default Tab)
- Enter water parameters.
- Click "Predict" to see if the water quality violates safety standards.

### 2. Source Identifier (Tab 2)
- Click the **"Source Identifier"** tab.
- Enter chemical parameters (ensure to fill in Chromium, Copper, and UV-Vis Absorbance).
- Click **"Analyze Source"** to identify which industry type (Chemical, Textile, etc.) is responsible for the pollution.

# EcoGuard: Industrial Pollution Monitoring System

A comprehensive environmental monitoring dashboard for tracking industrial water pollution using AI prediction and chemical source backtracking.

## Key Features
-   **Violation Predictor**: Real-time AI analysis of water parameters (pH, Turbidity, etc.) to predict regulatory violations.
-   **Source Identifier (Backtracking)**: Identifies the specific factory responsible for pollution using chemical fingerprinting.
-   **Eco-Aware Design**: Professional dashboard with environmental themes and real-time visualization.

## Setup Instructions

1.  **Install Dependencies**:
    ```bash
    pip install pandas numpy scikit-learn flask plotly
    ```

2.  **Run the Application**:
    ```bash
    python api_server.py
    ```

3.  **Access the Dashboard**:
    Open `http://localhost:5000` in your browser.

## Project Structure
-   `api_server.py`: Flask backend.
-   `predict_pollution.py`: AI inference engine.
-   `train_pollution_model.py`: Script to train the violation detection model.
-   `train_traceback_model.py`: Script to train the source identification model.
-   `generate_fingerprints.py`: Generates chemical signatures for factories.
-   `templates/index.html`: Main dashboard UI.
-   `static/css/style.css`: Styling and animations.

## Technologies
-   **Backend**: Python, Flask, Scikit-Learn (Random Forest)
-   **Frontend**: HTML5, CSS3 (Animations), Vanilla JS, Chart.js
-   **Data**: Simulated Water Quality Dataset (`water_pollution_dataset.csv`)

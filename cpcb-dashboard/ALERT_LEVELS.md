# Alert Level System - Enhanced

## Overview
The AI model now uses a **6-level alert system** for more granular risk assessment based on violation probability.

## Alert Levels

### 🚨 CRITICAL (90-100%)
- **Icon**: 🚨
- **Color**: Red (Danger)
- **Status**: Critical
- **Action**: IMMEDIATE action required! Severe pollution detected. Stop operations and investigate immediately.
- **Trigger**: Violation probability ≥ 90%

### ⛔ SEVERE (75-90%)
- **Icon**: ⛔
- **Color**: Red (Danger)
- **Status**: Severe
- **Action**: URGENT attention needed. High pollution levels detected. Immediate investigation recommended.
- **Trigger**: Violation probability ≥ 75%

### ⚠️ HIGH (60-75%)
- **Icon**: ⚠️
- **Color**: Yellow (Warning)
- **Status**: High Risk
- **Action**: Monitor closely. Elevated pollution levels detected. Investigation recommended within 24 hours.
- **Trigger**: Violation probability ≥ 60%

### ⚡ MODERATE (40-60%)
- **Icon**: ⚡
- **Color**: Yellow (Warning)
- **Status**: Moderate
- **Action**: Investigate soon. Some parameters approaching violation thresholds. Schedule inspection.
- **Trigger**: Violation probability ≥ 40%

### ✓ LOW (20-40%)
- **Icon**: ✓
- **Color**: Green (Safe)
- **Status**: Low Risk
- **Action**: Routine monitoring sufficient. Parameters within acceptable range with minor variations.
- **Trigger**: Violation probability ≥ 20%

### ✅ SAFE (0-20%)
- **Icon**: ✅
- **Color**: Green (Safe)
- **Status**: Safe
- **Action**: All parameters within acceptable limits. Continue routine monitoring.
- **Trigger**: Violation probability < 20%

## How It Works

1. **AI Model Prediction**: The trained pollution model (`pollution_model.pkl`) analyzes water quality parameters
2. **Probability Calculation**: Model outputs a violation probability (0-100%)
3. **Alert Level Assignment**: Based on probability, one of 6 alert levels is assigned
4. **Visual Display**: Frontend shows appropriate icon, color, and action message

## Benefits

- **More Granular**: 6 levels instead of 4 provides better risk differentiation
- **Clear Actions**: Each level has specific recommended actions
- **Visual Clarity**: Distinct icons and colors for quick assessment
- **AI-Driven**: All levels determined by trained model, not hardcoded rules

## Example Scenarios

| Violation Score | Alert Level | What It Means |
|----------------|-------------|---------------|
| 95.0% | CRITICAL | Severe violation - stop operations |
| 82.3% | SEVERE | Urgent - investigate immediately |
| 68.7% | HIGH | Elevated risk - investigate within 24h |
| 51.2% | MODERATE | Approaching limits - schedule inspection |
| 28.5% | LOW | Minor variations - routine monitoring |
| 12.1% | SAFE | All good - continue monitoring |

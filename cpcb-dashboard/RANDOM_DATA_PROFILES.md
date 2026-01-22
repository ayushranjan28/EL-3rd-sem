# Random Data Generator - Factory Profiles

## Overview
The random data generator creates 5 distinct chemical signature profiles that the AI can identify as different factories.

## Profiles

### Textile-A Profile (Expected: TX-A)
- **Characteristics**: Cleanest textile factory
- **Turbidity**: 100-250 NTU
- **pH**: 6.5-9.0 (neutral to alkaline)
- **Conductivity**: 1000-2500 µS/cm
- **Chromium**: 0.01-0.3 mg/L (very low)
- **Copper**: 0.02-0.2 mg/L (very low)
- **TDS**: 1000-2200 mg/L
- **UV-Vis**: 0.4-1.2

### Textile-B Profile (Expected: TX-B)
- **Characteristics**: Moderate textile pollution
- **Turbidity**: 200-400 NTU
- **pH**: 5.5-7.5 (slightly acidic)
- **Conductivity**: 1500-3500 µS/cm
- **Chromium**: 0.1-0.6 mg/L (low-moderate)
- **Copper**: 0.05-0.35 mg/L (low-moderate)
- **TDS**: 1500-3000 mg/L
- **UV-Vis**: 0.8-2.0

### Textile-C Profile (Expected: TX-C)
- **Characteristics**: Higher textile pollution
- **Turbidity**: 300-550 NTU
- **pH**: 5.0-8.0
- **Conductivity**: 2000-4500 µS/cm
- **Chromium**: 0.2-0.9 mg/L (moderate)
- **Copper**: 0.1-0.45 mg/L (moderate)
- **TDS**: 2000-3700 mg/L
- **UV-Vis**: 1.2-2.5

### Chemical-1 Profile (Expected: CH-1)
- **Characteristics**: High chemical pollution, very acidic
- **Turbidity**: 80-250 NTU
- **pH**: 2.5-5.0 (very acidic)
- **Conductivity**: 3000-5500 µS/cm (high)
- **Chromium**: 0.5-1.5 mg/L (high)
- **Copper**: 0.2-0.8 mg/L (moderate-high)
- **TDS**: 2500-5000 mg/L (high)
- **UV-Vis**: 0.5-1.5

### Chemical-2 Profile (Expected: CH-2)
- **Characteristics**: Extreme chemical pollution
- **Turbidity**: 100-380 NTU
- **pH**: 3.0-6.5 (acidic)
- **Conductivity**: 4000-7000 µS/cm (very high)
- **Chromium**: 1.0-2.4 mg/L (very high)
- **Copper**: 0.4-1.15 mg/L (high)
- **TDS**: 3500-6300 mg/L (very high)
- **UV-Vis**: 0.8-2.0

## Key Distinguishing Features

### Textile vs Chemical
- **Chromium**: Textile (0.01-0.9) vs Chemical (0.5-2.4)
- **Copper**: Textile (0.02-0.45) vs Chemical (0.2-1.15)
- **Conductivity**: Textile (1000-4500) vs Chemical (3000-7000)
- **TDS**: Textile (1000-3700) vs Chemical (2500-6300)
- **pH**: Textile more neutral/alkaline vs Chemical very acidic

## How It Works

1. Click "Generate Random Data" button
2. System randomly selects one of the 5 profiles
3. Generates random values within that profile's ranges
4. Fills the form with these values
5. Shows notification indicating which profile was used
6. Click "Analyze Water Quality"
7. AI identifies the factory based on chemical fingerprint

## Important Notes

- **All data is completely random** - not copied from the dataset
- **Ranges are scientifically realistic** - based on real water quality standards
- **Each profile has distinct chemical signatures** - allows AI to differentiate
- **Proves AI authenticity** - shows the model works on unseen data

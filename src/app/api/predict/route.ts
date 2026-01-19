// app/api/predict/route.ts
// Real-time AI violation prediction using trained model

import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';

const execAsync = promisify(exec);

// Fallback prediction function (rule-based)
function fallbackPrediction(sensorData: any) {
    const violations: string[] = [];
    let violationScore = 0;

    // Check thresholds
    if (sensorData.turbidity_ntu > 200) {
        violations.push('turbidity_high');
        violationScore += 0.3;
    }

    if (sensorData.ph < 5.5) {
        violations.push('ph_low');
        violationScore += 0.3;
    } else if (sensorData.ph > 9.0) {
        violations.push('ph_high');
        violationScore += 0.3;
    }

    if (sensorData.chromium_mg_l > 0.1) {
        violations.push('chromium_high');
        violationScore += 0.4;
    }

    if (sensorData.copper_mg_l > 3.0) {
        violations.push('copper_high');
        violationScore += 0.3;
    }

    if (sensorData.tds_mg_l > 2100) {
        violations.push('tds_high');
        violationScore += 0.2;
    }

    if (sensorData.uv_vis_absorbance && sensorData.uv_vis_absorbance > 1.0) {
        violations.push('uv_absorbance_high');
        violationScore += 0.2;
    }

    const isViolation = violations.length > 0;
    const probability = Math.min(violationScore, 1.0);

    let alertLevel: string;
    if (probability >= 0.8) alertLevel = 'critical';
    else if (probability >= 0.6) alertLevel = 'high';
    else if (probability >= 0.3) alertLevel = 'medium';
    else alertLevel = 'low';

    return {
        is_violation: isViolation,
        violation_probability: probability,
        confidence: 0.85,
        violation_reasons: violations,
        alert_level: alertLevel,
        factory_id: sensorData.factory_id,
        timestamp: new Date().toISOString(),
    };
}

export async function POST(request: Request) {
    try {
        const sensorData = await request.json();

        // Validate required fields
        const required = ['factory_id', 'factory_type', 'turbidity_ntu', 'ph', 'chromium_mg_l'];
        for (const field of required) {
            if (sensorData[field] === undefined) {
                return NextResponse.json(
                    { success: false, error: `Missing required field: ${field}` },
                    { status: 400 }
                );
            }
        }

        // Try Python prediction first
        try {
            const pythonScript = path.join(process.cwd(), '..', 'predict_pollution.py');
            const dataJson = JSON.stringify(sensorData);

            const { stdout, stderr } = await execAsync(
                `python "${pythonScript}" --predict '${dataJson.replace(/'/g, "\\'")}'`,
                {
                    cwd: path.dirname(pythonScript),
                    timeout: 5000 // 5 second timeout
                }
            );

            if (stderr && !stderr.includes('FutureWarning') && !stderr.includes('DeprecationWarning')) {
                console.warn('Python stderr:', stderr);
            }

            const prediction = JSON.parse(stdout.trim());

            return NextResponse.json({
                success: true,
                prediction: {
                    is_violation: prediction.is_violation,
                    violation_probability: prediction.violation_probability,
                    confidence: prediction.confidence,
                    violation_reasons: prediction.violation_reasons,
                    alert_level: prediction.alert_level,
                    factory_id: sensorData.factory_id,
                    timestamp: new Date().toISOString(),
                },
                source: 'python_ml_model'
            });
        } catch (pythonError: any) {
            console.warn('Python prediction failed, using fallback:', pythonError.message);

            // Use fallback prediction
            const prediction = fallbackPrediction(sensorData);

            return NextResponse.json({
                success: true,
                prediction,
                source: 'fallback_rules',
                note: 'Using rule-based prediction (Python model unavailable)'
            });
        }
    } catch (error: any) {
        console.error('Prediction error:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'Prediction failed',
                details: error.message,
            },
            { status: 500 }
        );
    }
}

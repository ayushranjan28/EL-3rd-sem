'use client';

import { useState } from 'react';
import { predictViolation, formatViolationReasons, getAlertColor, type WaterReading, type PredictionResult } from '@/lib/pollutionAI';

/**
 * Example component showing how to use the AI prediction in your dashboard
 * You can integrate this into your existing components
 */
export default function AIPredictionDemo() {
    const [prediction, setPrediction] = useState<PredictionResult | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const testCleanReading = async () => {
        setLoading(true);
        setError(null);

        const reading: WaterReading = {
            factory_id: 'TX-A',
            factory_type: 'Textile',
            location_km_from_origin: 8,
            flow_rate_m3ph: 250,
            turbidity_ntu: 85,
            ph: 7.2,
            conductivity_us_cm: 1200,
            temperature_c: 32,
            chromium_mg_l: 0.05,
            copper_mg_l: 0.08,
            tds_mg_l: 950,
            uv_vis_absorbance: 0.35,
        };

        try {
            const result = await predictViolation(reading);
            setPrediction(result);
        } catch (err) {
            setError('Failed to get prediction. Make sure API server is running.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const testViolationReading = async () => {
        setLoading(true);
        setError(null);

        const reading: WaterReading = {
            factory_id: 'TX-B',
            factory_type: 'Textile',
            location_km_from_origin: 15,
            flow_rate_m3ph: 420,
            turbidity_ntu: 520,
            ph: 4.2,
            conductivity_us_cm: 3800,
            temperature_c: 39,
            chromium_mg_l: 1.5,
            copper_mg_l: 0.45,
            tds_mg_l: 3500,
            uv_vis_absorbance: 1.8,
        };

        try {
            const result = await predictViolation(reading);
            setPrediction(result);
        } catch (err) {
            setError('Failed to get prediction. Make sure API server is running.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                <h2 className="text-2xl font-bold mb-4 text-gray-800">
                    AI Pollution Prediction Demo
                </h2>

                <p className="text-gray-600 mb-6">
                    Test the AI model with sample readings. Make sure the API server is running:
                    <code className="block mt-2 p-2 bg-gray-100 rounded text-sm">
                        python api_server.py
                    </code>
                </p>

                <div className="flex gap-4 mb-6">
                    <button
                        onClick={testCleanReading}
                        disabled={loading}
                        className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        {loading ? 'Analyzing...' : 'Test Clean Reading'}
                    </button>

                    <button
                        onClick={testViolationReading}
                        disabled={loading}
                        className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        {loading ? 'Analyzing...' : 'Test Violation Reading'}
                    </button>
                </div>

                {error && (
                    <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg mb-6">
                        <p className="font-semibold">Error:</p>
                        <p>{error}</p>
                        <p className="text-sm mt-2">
                            Start the API server: <code>python api_server.py</code>
                        </p>
                    </div>
                )}

                {prediction && (
                    <div className="border-t pt-6">
                        <h3 className="text-xl font-semibold mb-4 text-gray-800">
                            Prediction Results
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Factory Info */}
                            <div className="p-4 bg-gray-50 rounded-lg">
                                <p className="text-sm text-gray-600">Factory</p>
                                <p className="text-lg font-semibold text-gray-800">
                                    {prediction.factory_id}
                                </p>
                            </div>

                            {/* Violation Status */}
                            <div className={`p-4 rounded-lg ${prediction.is_violation ? 'bg-red-50' : 'bg-green-50'}`}>
                                <p className="text-sm text-gray-600">Status</p>
                                <p className={`text-lg font-semibold ${prediction.is_violation ? 'text-red-700' : 'text-green-700'}`}>
                                    {prediction.is_violation ? '⚠️ VIOLATION' : '✅ COMPLIANT'}
                                </p>
                            </div>

                            {/* Probability */}
                            <div className="p-4 bg-gray-50 rounded-lg">
                                <p className="text-sm text-gray-600">Violation Probability</p>
                                <p className="text-lg font-semibold text-gray-800">
                                    {(prediction.violation_probability * 100).toFixed(1)}%
                                </p>
                                <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                                    <div
                                        className={`h-2 rounded-full ${prediction.violation_probability > 0.7
                                            ? 'bg-red-600'
                                            : prediction.violation_probability > 0.4
                                                ? 'bg-yellow-600'
                                                : 'bg-green-600'
                                            }`}
                                        style={{ width: `${prediction.violation_probability * 100}%` }}
                                    />
                                </div>
                            </div>

                            {/* Alert Level */}
                            <div className="p-4 bg-gray-50 rounded-lg">
                                <p className="text-sm text-gray-600">Alert Level</p>
                                <p className={`text-lg font-semibold inline-block px-3 py-1 rounded-full ${getAlertColor(prediction.alert_level)}`}>
                                    {prediction.alert_level.toUpperCase()}
                                </p>
                            </div>

                            {/* Violation Reasons */}
                            {prediction.violation_reasons.length > 0 && (
                                <div className="p-4 bg-red-50 rounded-lg md:col-span-2">
                                    <p className="text-sm text-gray-600 mb-2">Violation Reasons</p>
                                    <div className="flex flex-wrap gap-2">
                                        {prediction.violation_reasons.map((reason, idx) => (
                                            <span
                                                key={idx}
                                                className="px-3 py-1 bg-red-200 text-red-800 rounded-full text-sm font-medium"
                                            >
                                                {formatViolationReasons([reason])}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Confidence */}
                            <div className="p-4 bg-gray-50 rounded-lg md:col-span-2">
                                <p className="text-sm text-gray-600">Model Confidence</p>
                                <p className="text-lg font-semibold text-gray-800">
                                    {(prediction.confidence * 100).toFixed(1)}%
                                </p>
                            </div>
                        </div>

                        {/* Timestamp */}
                        <div className="mt-4 text-sm text-gray-500">
                            Analyzed at: {new Date(prediction.timestamp).toLocaleString()}
                        </div>
                    </div>
                )}
            </div>

            {/* Integration Instructions */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-blue-900 mb-3">
                    💡 Integration Tips
                </h3>
                <ul className="space-y-2 text-blue-800 text-sm">
                    <li>✓ Import <code className="bg-blue-100 px-2 py-1 rounded">predictViolation</code> from <code className="bg-blue-100 px-2 py-1 rounded">@/lib/pollutionAI</code></li>
                    <li>✓ Call it with your water quality readings</li>
                    <li>✓ Display results in your existing components</li>
                    <li>✓ Average response time: &lt;5ms</li>
                    <li>✓ Model accuracy: 99.64%</li>
                </ul>
            </div>
        </div>
    );
}

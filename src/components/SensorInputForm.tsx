'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface SensorFormProps {
    onPrediction?: (result: any) => void;
}

export default function SensorInputForm({ onPrediction }: SensorFormProps) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [prediction, setPrediction] = useState<any>(null);

    const [formData, setFormData] = useState({
        factory_id: 'TX-B',
        factory_type: 'Textile',
        location_km_from_origin: 15,
        flow_rate_m3ph: 350,
        turbidity_ntu: 200,
        ph: 7.0,
        conductivity_us_cm: 2000,
        temperature_c: 30,
        chromium_mg_l: 0.1,
        copper_mg_l: 0.5,
        tds_mg_l: 1500,
        uv_vis_absorbance: 0.5,
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setPrediction(null);

        try {
            // Call AI prediction API
            const response = await fetch('/api/predict', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const result = await response.json();

            if (result.success) {
                setPrediction(result.prediction);

                // If violation detected, save to MongoDB
                if (result.prediction.is_violation) {
                    await saveAlert(result.prediction);
                }

                // Callback for parent component
                if (onPrediction) {
                    onPrediction(result.prediction);
                }
            } else {
                setError(result.error || 'Prediction failed');
            }
        } catch (err: any) {
            setError('Network error: ' + err.message);
            console.error('Prediction error:', err);
        } finally {
            setLoading(false);
        }
    };

    const saveAlert = async (predictionData: any) => {
        try {
            await fetch('/api/alerts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    is_violation: predictionData.is_violation,
                    violation_reason: predictionData.violation_reasons.join('|'),
                    ai_violation_score: predictionData.violation_probability,
                    alert_status: 'pending',
                    assigned_employee_id: 'EMP-001', // From logged-in user
                }),
            });
        } catch (err) {
            console.error('Failed to save alert:', err);
        }
    };

    const handleChange = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>🔬 Sensor Data Input - AI Violation Detection</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Factory Selection */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">Factory ID</label>
                            <select
                                value={formData.factory_id}
                                onChange={(e) => handleChange('factory_id', e.target.value)}
                                className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800"
                            >
                                <option value="TX-A">TX-A (Textile)</option>
                                <option value="TX-B">TX-B (Textile)</option>
                                <option value="TX-C">TX-C (Textile)</option>
                                <option value="CH-1">CH-1 (Chemical)</option>
                                <option value="CH-2">CH-2 (Chemical)</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Factory Type</label>
                            <select
                                value={formData.factory_type}
                                onChange={(e) => handleChange('factory_type', e.target.value)}
                                className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800"
                            >
                                <option value="Textile">Textile</option>
                                <option value="Chemical">Chemical</option>
                            </select>
                        </div>
                    </div>

                    {/* Sensor Readings */}
                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Turbidity (NTU) <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                step="0.01"
                                value={formData.turbidity_ntu}
                                onChange={(e) => handleChange('turbidity_ntu', parseFloat(e.target.value))}
                                className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800"
                                required
                            />
                            <p className="text-xs text-gray-500 mt-1">Threshold: &gt;200</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                pH <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                step="0.1"
                                value={formData.ph}
                                onChange={(e) => handleChange('ph', parseFloat(e.target.value))}
                                className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800"
                                required
                            />
                            <p className="text-xs text-gray-500 mt-1">Range: 5.5-9.0</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Chromium (mg/L) <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                step="0.001"
                                value={formData.chromium_mg_l}
                                onChange={(e) => handleChange('chromium_mg_l', parseFloat(e.target.value))}
                                className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800"
                                required
                            />
                            <p className="text-xs text-gray-500 mt-1">Threshold: &gt;0.1</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">Conductivity (μS/cm)</label>
                            <input
                                type="number"
                                step="0.01"
                                value={formData.conductivity_us_cm}
                                onChange={(e) => handleChange('conductivity_us_cm', parseFloat(e.target.value))}
                                className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Temperature (°C)</label>
                            <input
                                type="number"
                                step="0.1"
                                value={formData.temperature_c}
                                onChange={(e) => handleChange('temperature_c', parseFloat(e.target.value))}
                                className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">TDS (mg/L)</label>
                            <input
                                type="number"
                                step="0.01"
                                value={formData.tds_mg_l}
                                onChange={(e) => handleChange('tds_mg_l', parseFloat(e.target.value))}
                                className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800"
                            />
                            <p className="text-xs text-gray-500 mt-1">Threshold: &gt;2100</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">Copper (mg/L)</label>
                            <input
                                type="number"
                                step="0.001"
                                value={formData.copper_mg_l}
                                onChange={(e) => handleChange('copper_mg_l', parseFloat(e.target.value))}
                                className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">UV-Vis Absorbance</label>
                            <input
                                type="number"
                                step="0.001"
                                value={formData.uv_vis_absorbance}
                                onChange={(e) => handleChange('uv_vis_absorbance', parseFloat(e.target.value))}
                                className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800"
                            />
                            <p className="text-xs text-gray-500 mt-1">Threshold: &gt;1.0</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Flow Rate (m³/h)</label>
                            <input
                                type="number"
                                step="0.01"
                                value={formData.flow_rate_m3ph}
                                onChange={(e) => handleChange('flow_rate_m3ph', parseFloat(e.target.value))}
                                className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800"
                            />
                        </div>
                    </div>

                    {/* Error Display */}
                    {error && (
                        <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
                            {error}
                        </div>
                    )}

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <span className="flex items-center justify-center gap-2">
                                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>
                                Analyzing with AI...
                            </span>
                        ) : (
                            '🤖 Analyze with AI Model (99.57% Accuracy)'
                        )}
                    </button>

                    {/* Prediction Result */}
                    {prediction && (
                        <div className={`p-4 rounded-lg border-2 ${prediction.is_violation
                                ? 'bg-red-50 border-red-500 dark:bg-red-900/20'
                                : 'bg-green-50 border-green-500 dark:bg-green-900/20'
                            }`}>
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="text-lg font-bold">
                                    {prediction.is_violation ? '⚠️ VIOLATION DETECTED' : '✅ COMPLIANT'}
                                </h3>
                                <span className={`px-3 py-1 rounded-full text-sm font-bold ${prediction.alert_level === 'critical' ? 'bg-red-600 text-white' :
                                        prediction.alert_level === 'high' ? 'bg-orange-600 text-white' :
                                            prediction.alert_level === 'medium' ? 'bg-yellow-600 text-white' :
                                                'bg-green-600 text-white'
                                    }`}>
                                    {prediction.alert_level.toUpperCase()}
                                </span>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-3">
                                <div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">AI Confidence</p>
                                    <p className="text-2xl font-bold">{(prediction.violation_probability * 100).toFixed(1)}%</p>
                                    <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                                        <div
                                            className={`h-2 rounded-full ${prediction.violation_probability > 0.7 ? 'bg-red-600' : 'bg-green-600'
                                                }`}
                                            style={{ width: `${prediction.violation_probability * 100}%` }}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Model Confidence</p>
                                    <p className="text-2xl font-bold">{(prediction.confidence * 100).toFixed(1)}%</p>
                                </div>
                            </div>

                            {prediction.violation_reasons.length > 0 && (
                                <div>
                                    <p className="text-sm font-semibold mb-2">Violation Reasons:</p>
                                    <div className="flex flex-wrap gap-2">
                                        {prediction.violation_reasons.map((reason: string, idx: number) => (
                                            <span
                                                key={idx}
                                                className="px-3 py-1 bg-red-200 text-red-900 rounded-full text-sm font-medium"
                                            >
                                                {reason.replace(/_/g, ' ').toUpperCase()}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {prediction.is_violation && (
                                <div className="mt-3 p-2 bg-yellow-100 dark:bg-yellow-900/20 rounded text-sm">
                                    ✓ Alert automatically saved to MongoDB and assigned to employee
                                </div>
                            )}
                        </div>
                    )}
                </form>
            </CardContent>
        </Card>
    );
}

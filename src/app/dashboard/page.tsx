'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import SensorInputForm from '@/components/SensorInputForm';

interface DashboardStats {
    totalAlerts: number;
    activeAlerts: number;
    resolvedAlerts: number;
    violationRate: number;
    topViolators: Array<{ factory: string; count: number }>;
}

export default function DashboardPage() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [alerts, setAlerts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check authentication
        const userData = localStorage.getItem('user');
        if (!userData) {
            router.push('/login');
            return;
        }
        setUser(JSON.parse(userData));
        fetchDashboardData();
    }, [router]);

    const handleLogout = () => {
        localStorage.removeItem('user');
        router.push('/login');
    };

    const fetchDashboardData = async () => {
        try {
            // Fetch alerts from MongoDB
            const alertsResponse = await fetch('/api/alerts?limit=50');
            const alertsResult = await alertsResponse.json();

            if (alertsResult.success) {
                const alertsData = alertsResult.alerts;
                setAlerts(alertsData);

                // Calculate stats from MongoDB data
                const totalAlerts = alertsData.length;
                const activeAlerts = alertsData.filter((a: any) => a.alert_status === 'pending').length;
                const resolvedAlerts = alertsData.filter((a: any) => a.alert_status === 'resolved').length;
                const violations = alertsData.filter((a: any) => a.is_violation).length;
                const violationRate = totalAlerts > 0 ? violations / totalAlerts : 0;

                // Top violators
                const factoryCounts: Record<string, number> = {};
                alertsData.forEach((alert: any) => {
                    if (alert.is_violation && alert.factory_id) {
                        factoryCounts[alert.factory_id] = (factoryCounts[alert.factory_id] || 0) + 1;
                    }
                });

                const topViolators = Object.entries(factoryCounts)
                    .map(([factory, count]) => ({ factory, count }))
                    .sort((a, b) => b.count - a.count)
                    .slice(0, 5);

                setStats({
                    totalAlerts,
                    activeAlerts,
                    resolvedAlerts,
                    violationRate,
                    topViolators,
                });
            }
        } catch (error) {
            console.error('Failed to fetch dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600 dark:text-gray-400">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className="container mx-auto p-6">
                {/* Header with User Info */}
                <div className="mb-8 flex justify-between items-start">
                    <div>
                        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                            Water Pollution Monitoring Dashboard
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400">
                            Real-time monitoring with AI-powered violation detection
                        </p>
                    </div>
                    {user && (
                        <div className="flex items-center gap-4">
                            <div className="text-right">
                                <p className="text-sm font-medium text-gray-900 dark:text-white">
                                    {user.fullName || user.username}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    {user.employeeId} • {user.role}
                                </p>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors"
                            >
                                Logout
                            </button>
                        </div>
                    )}
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                Total Alerts
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-gray-900 dark:text-white">
                                {stats?.totalAlerts || 0}
                            </div>
                            <p className="text-xs text-gray-500 mt-1">From MongoDB</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                Active Alerts
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">
                                {stats?.activeAlerts || 0}
                            </div>
                            <p className="text-xs text-gray-500 mt-1">Pending action</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                Resolved
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                                {stats?.resolvedAlerts || 0}
                            </div>
                            <p className="text-xs text-gray-500 mt-1">Completed</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                Violation Rate
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-red-600 dark:text-red-400">
                                {((stats?.violationRate || 0) * 100).toFixed(1)}%
                            </div>
                            <p className="text-xs text-gray-500 mt-1">AI-detected</p>
                        </CardContent>
                    </Card>
                </div>

                {/* AI Sensor Input Form */}
                <div className="mb-6">
                    <SensorInputForm
                        onPrediction={(prediction) => {
                            // Refresh alerts when new prediction is made
                            if (prediction.is_violation) {
                                fetchDashboardData();
                            }
                        }}
                    />
                </div>

                {/* Recent Alerts */}
                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle>Recent Alerts (MongoDB)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {alerts.length === 0 ? (
                            <div className="text-center py-8">
                                <p className="text-gray-500 dark:text-gray-400">
                                    No alerts yet. Submit sensor readings to generate alerts.
                                </p>
                                <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
                                    Use the AI prediction API to analyze water quality data
                                </p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b">
                                            <th className="text-left py-2 px-4 font-medium">Timestamp</th>
                                            <th className="text-left py-2 px-4 font-medium">Factory</th>
                                            <th className="text-left py-2 px-4 font-medium">Type</th>
                                            <th className="text-left py-2 px-4 font-medium">AI Score</th>
                                            <th className="text-left py-2 px-4 font-medium">Violation</th>
                                            <th className="text-left py-2 px-4 font-medium">Status</th>
                                            <th className="text-left py-2 px-4 font-medium">Assigned To</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {alerts.slice(0, 10).map((alert: any, idx: number) => (
                                            <tr key={idx} className="border-b hover:bg-gray-50 dark:hover:bg-gray-800">
                                                <td className="py-3 px-4 text-xs">
                                                    {new Date(alert.timestamp).toLocaleString()}
                                                </td>
                                                <td className="py-3 px-4 font-medium">{alert.factory_id}</td>
                                                <td className="py-3 px-4">{alert.factory_type}</td>
                                                <td className="py-3 px-4">
                                                    <span className="font-mono">{alert.ai_violation_score?.toFixed(3)}</span>
                                                </td>
                                                <td className="py-3 px-4">
                                                    <span
                                                        className={`px-2 py-1 rounded-full text-xs font-medium ${alert.is_violation
                                                            ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                                                            : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                                            }`}
                                                    >
                                                        {alert.is_violation ? 'Violation' : 'Compliant'}
                                                    </span>
                                                </td>
                                                <td className="py-3 px-4">
                                                    <span
                                                        className={`px-2 py-1 rounded-full text-xs font-medium ${alert.alert_status === 'pending'
                                                            ? 'bg-yellow-100 text-yellow-800'
                                                            : alert.alert_status === 'acknowledged'
                                                                ? 'bg-blue-100 text-blue-800'
                                                                : 'bg-green-100 text-green-800'
                                                            }`}
                                                    >
                                                        {alert.alert_status}
                                                    </span>
                                                </td>
                                                <td className="py-3 px-4 text-xs">{alert.assigned_employee_id || '-'}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Top Violators */}
                {stats && stats.topViolators.length > 0 && (
                    <Card className="mb-6">
                        <CardHeader>
                            <CardTitle>Top Violators (from MongoDB data)</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {stats.topViolators.map((violator, idx) => (
                                    <div key={violator.factory} className="flex items-center gap-4">
                                        <div className="w-24 font-medium">{violator.factory}</div>
                                        <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-4">
                                            <div
                                                className="bg-red-600 h-4 rounded-full"
                                                style={{
                                                    width: `${(violator.count / stats.topViolators[0].count) * 100}%`,
                                                }}
                                            />
                                        </div>
                                        <div className="w-16 text-right font-semibold">{violator.count}</div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* System Info */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                Data Source
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">MongoDB</p>
                            <p className="text-xs text-gray-500 mt-1">Real-time alerts & readings</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                AI Model
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">99.57%</p>
                            <p className="text-xs text-gray-500 mt-1">Accuracy (trained on CSV)</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                API Status
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-2xl font-bold text-green-600 dark:text-green-400">Active</p>
                            <p className="text-xs text-gray-500 mt-1">http://localhost:5000</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Instructions */}
                <Card className="mt-6">
                    <CardHeader>
                        <CardTitle>How to Use</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4 text-sm">
                            <div>
                                <h4 className="font-semibold mb-2">1. Start AI Prediction API</h4>
                                <code className="block bg-gray-100 dark:bg-gray-800 p-2 rounded">
                                    python api_server.py
                                </code>
                            </div>
                            <div>
                                <h4 className="font-semibold mb-2">2. Submit Sensor Readings</h4>
                                <p className="text-gray-600 dark:text-gray-400">
                                    Send water quality data to the AI API for violation detection
                                </p>
                            </div>
                            <div>
                                <h4 className="font-semibold mb-2">3. View Results</h4>
                                <p className="text-gray-600 dark:text-gray-400">
                                    Alerts are automatically saved to MongoDB and displayed here
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

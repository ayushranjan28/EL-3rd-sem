'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface DashboardStats {
    totalAlerts: number;
    activeAlerts: number;
    resolvedAlerts: number;
    resolutionRate: number;
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
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        fetchDashboardData(parsedUser);
    }, [router]);

    const handleLogout = () => {
        localStorage.removeItem('user');
        router.push('/login');
    };

    const fetchDashboardData = async (currentUser?: any) => {
        try {
            const activeUser = currentUser || user;
            if (!activeUser) return;

            // Determine query params based on role
            let queryParams = '?limit=100';
            if (activeUser.role === 'employee') {
                queryParams += `&employeeId=${activeUser.employeeId}`;
            } else if (activeUser.role === 'supervisor') {
                queryParams += `&supervisorId=${activeUser.employeeId}`;
            }
            // Admin sees all (default)

            // Fetch alerts from MongoDB
            const alertsResponse = await fetch(`/api/alerts${queryParams}`);
            const alertsResult = await alertsResponse.json();

            if (alertsResult.success) {
                const alertsData = alertsResult.alerts;
                setAlerts(alertsData);

                // Calculate stats from MongoDB data
                const totalAlerts = alertsData.length;
                const activeAlerts = alertsData.filter((a: any) => a.alert_status === 'pending').length;
                const resolvedAlerts = alertsData.filter((a: any) => a.alert_status === 'resolved').length;
                const resolutionRate = totalAlerts > 0 ? resolvedAlerts / totalAlerts : 0;

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
                    resolutionRate,
                    topViolators,
                });
            }
        } catch (error) {
            console.error('Failed to fetch dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleResolve = async (alertId: string) => {
        const notes = prompt("Enter resolution notes:");
        if (!notes) return;

        try {
            const res = await fetch('/api/alerts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'resolve',
                    id: alertId,
                    notes: notes
                })
            });
            if (res.ok) {
                alert("Alert resolved successfully!");
                fetchDashboardData(); // Refresh list
            }
        } catch (error) {
            console.error("Failed to resolve alert:", error);
        }
    };

    const handleReopen = async (alertId: string) => {
        if (!confirm("Are you sure you want to re-open this alert?")) return;

        try {
            const res = await fetch('/api/alerts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'reopen',
                    id: alertId
                })
            });
            if (res.ok) {
                // No alert needed, just refresh
                fetchDashboardData();
            } else {
                alert("Failed to re-open alert");
            }
        } catch (error) {
            console.error("Failed to re-open alert:", error);
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
                            {user?.role === 'admin' ? 'Admin Dashboard' :
                                user?.role === 'supervisor' ? 'Supervisor Dashboard' :
                                    'Employee Task Board'}
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400">
                            {user?.role === 'admin' ? 'System-wide monitoring & employee tracking' :
                                user?.role === 'supervisor' ? `Monitoring assignments for ${user.fullName}` :
                                    'Your assigned pollution checks'}
                        </p>
                    </div>
                    {user && (
                        <div className="flex items-center gap-4">
                            <div className="text-right">
                                <p className="text-sm font-medium text-gray-900 dark:text-white">
                                    {user.fullName || user.username}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    {user.employeeId} • {user.role.toUpperCase()}
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
                                Total Assigned
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-gray-900 dark:text-white">
                                {stats?.totalAlerts || 0}
                            </div>
                            <p className="text-xs text-gray-500 mt-1">Total alerts generated</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                Pending Action
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">
                                {stats?.activeAlerts || 0}
                            </div>
                            <p className="text-xs text-gray-500 mt-1">Requires attention</p>
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
                            <p className="text-xs text-gray-500 mt-1">Successfully handled</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                Resolution Rate
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                                {((stats?.resolutionRate || 0) * 100).toFixed(1)}%
                            </div>
                            <p className="text-xs text-gray-500 mt-1">Alerts resolved</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Recent Alerts Table */}
                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle>
                            {user?.role === 'employee' ? 'My Assigned Alerts' : 'Alert Monitoring Log'}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {alerts.length === 0 ? (
                            <div className="text-center py-8">
                                <p className="text-gray-500 dark:text-gray-400">
                                    No alerts found matching your criteria.
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
                                            <th className="text-left py-2 px-4 font-medium">Severity</th>
                                            <th className="text-left py-2 px-4 font-medium">Status</th>
                                            {/* Show Assigned To for Admin/Supervisor */}
                                            {user?.role !== 'employee' && (
                                                <th className="text-left py-2 px-4 font-medium">Assigned To</th>
                                            )}
                                            {/* Show Supervisor for Admin */}
                                            {user?.role === 'admin' && (
                                                <th className="text-left py-2 px-4 font-medium">Supervisor</th>
                                            )}
                                            <th className="text-left py-2 px-4 font-medium">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {alerts.map((alert: any, idx: number) => (
                                            <tr key={alert._id || idx} className="border-b hover:bg-gray-50 dark:hover:bg-gray-800">
                                                <td className="py-3 px-4 text-xs">
                                                    {new Date(alert.timestamp).toLocaleString()}
                                                </td>
                                                <td className="py-3 px-4 font-medium">{alert.factory_id}</td>
                                                <td className="py-3 px-4 text-xs">{alert.factory_type}</td>
                                                <td className="py-3 px-4">
                                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${alert.ai_alert_level === 'CRITICAL' ? 'bg-red-800 text-white' :
                                                        alert.ai_alert_level === 'SEVERE' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                                                            alert.ai_alert_level === 'HIGH' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200' :
                                                                alert.ai_alert_level === 'MODERATE' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                                                                    alert.ai_alert_level === 'LOW' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                                                                        'bg-gray-100 text-gray-800'
                                                        }`}>
                                                        {alert.ai_alert_level || 'DETECTED'}
                                                    </span>
                                                </td>
                                                <td className="py-3 px-4">
                                                    <span
                                                        className={`px-2 py-1 rounded-full text-xs font-medium ${alert.alert_status === 'pending'
                                                            ? 'bg-yellow-100 text-yellow-800'
                                                            : 'bg-green-100 text-green-800'
                                                            }`}
                                                    >
                                                        {alert.alert_status.toUpperCase()}
                                                    </span>
                                                </td>

                                                {/* Assigned To Column */}
                                                {user?.role !== 'employee' && (
                                                    <td className="py-3 px-4 text-xs">
                                                        {alert.assigned_employee_name || alert.assigned_employee_id || 'Unassigned'}
                                                    </td>
                                                )}

                                                {/* Supervisor Column (Admin Only) */}
                                                {user?.role === 'admin' && (
                                                    <td className="py-3 px-4 text-xs text-gray-500">
                                                        {alert.supervisor_id === 'SUP-001' ? 'Dr. Meera Iyer' :
                                                            alert.supervisor_id === 'SUP-002' ? 'Dr. Arun Verma' :
                                                                alert.supervisor_id || '-'}
                                                    </td>
                                                )}

                                                {/* Action Column */}
                                                <td className="py-3 px-4">
                                                    {/* Employee Logic */}
                                                    {user?.role === 'employee' && alert.alert_status === 'pending' && (
                                                        <button
                                                            onClick={() => handleResolve(alert._id || alert.id)}
                                                            className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded transition"
                                                        >
                                                            Resolve
                                                        </button>
                                                    )}

                                                    {/* Supervisor Logic */}
                                                    {user?.role === 'supervisor' && (
                                                        <div className="flex gap-2">
                                                            {alert.alert_status === 'pending' && (
                                                                <button
                                                                    onClick={() => handleResolve(alert._id || alert.id)}
                                                                    className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded transition"
                                                                >
                                                                    Resolve
                                                                </button>
                                                            )}
                                                            {alert.alert_status === 'resolved' && (
                                                                <button
                                                                    onClick={() => handleReopen(alert._id || alert.id)}
                                                                    className="px-3 py-1 bg-yellow-600 hover:bg-yellow-700 text-white text-xs rounded transition"
                                                                >
                                                                    Re-open
                                                                </button>
                                                            )}
                                                        </div>
                                                    )}

                                                    {/* Read Only Status (Employee Resolved or Default) */}
                                                    {alert.alert_status === 'resolved' && user?.role !== 'supervisor' && (
                                                        <span className="text-gray-500 text-xs">
                                                            {alert.resolution_notes ? 'Resolved: ' + alert.resolution_notes.substring(0, 15) + '...' : 'Resolved'}
                                                        </span>
                                                    )}

                                                    {alert.alert_status !== 'pending' && alert.alert_status !== 'resolved' && (
                                                        <span className="text-gray-400 text-xs">-</span>
                                                    )}
                                                </td>
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

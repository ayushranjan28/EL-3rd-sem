'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Alert } from '@/lib/types';
import { EMPLOYEES as EMP_LIST } from '@/lib/constants';
import {
    Clock,
    Factory,
    CheckCircle,
    AlertTriangle,
    Download,
    Search
} from 'lucide-react';

export default function AlertsPage() {
    const [alerts, setAlerts] = useState<Alert[]>([]);
    const [filter, setFilter] = useState<'all' | 'active' | 'resolved'>('all');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const load = () => fetch('/api/alerts').then(res => res.json()).then(data => {
            if (Array.isArray(data)) setAlerts(data);
        });
        load();
        const i = setInterval(load, 3000);
        return () => clearInterval(i);
    }, []);

    const resolve = async (id: string) => {
        setAlerts(prev => prev.map(a => a.id === id ? { ...a, status: 'Resolved' } : a));
        await fetch('/api/alerts', { method: 'POST', body: JSON.stringify({ action: 'resolve', id }) });
        toast.success('Alert resolved');
    };

    const filteredAlerts = alerts.filter(a => {
        const matchesFilter = filter === 'all' ||
            (filter === 'active' && a.status === 'Active') ||
            (filter === 'resolved' && a.status === 'Resolved');
        const matchesSearch = searchTerm === '' ||
            a.factory.toLowerCase().includes(searchTerm.toLowerCase()) ||
            a.violationType.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    const activeCount = alerts.filter(a => a.status === 'Active').length;
    const resolvedCount = alerts.filter(a => a.status === 'Resolved').length;

    return (
        <div className="container py-8 space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Alert Management</h1>
                    <p className="text-muted-foreground">Track and resolve environmental violations</p>
                </div>
                <button className="btn btn-primary">
                    <Download className="h-4 w-4" />
                    Export
                </button>
            </div>

            {/* Stats */}
            <div className="grid gap-4 md:grid-cols-3">
                <div className="metric-card">
                    <p className="text-sm font-medium text-muted-foreground">Total Alerts</p>
                    <p className="text-2xl font-bold">{alerts.length}</p>
                </div>
                <div className="metric-card">
                    <p className="text-sm font-medium text-muted-foreground">Active</p>
                    <p className="text-2xl font-bold text-amber-600">{activeCount}</p>
                </div>
                <div className="metric-card">
                    <p className="text-sm font-medium text-muted-foreground">Resolved</p>
                    <p className="text-2xl font-bold text-green-600">{resolvedCount}</p>
                </div>
            </div>

            {/* Filters */}
            <div className="card p-4">
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                    <div className="flex gap-2">
                        {(['all', 'active', 'resolved'] as const).map((f) => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${filter === f
                                        ? 'bg-primary text-primary-foreground'
                                        : 'hover:bg-accent'
                                    }`}
                            >
                                {f.charAt(0).toUpperCase() + f.slice(1)}
                            </button>
                        ))}
                    </div>

                    <div className="relative w-full sm:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Search alerts..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 bg-background border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                        />
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="card">
                {filteredAlerts.length === 0 ? (
                    <div className="empty-state">
                        <CheckCircle className="empty-state-icon" />
                        <p className="empty-state-title">No alerts found</p>
                        <p className="empty-state-description">System running smoothly</p>
                    </div>
                ) : (
                    <div className="table-container">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Timestamp</th>
                                    <th>Factory</th>
                                    <th>Violation</th>
                                    <th>Assigned Officer</th>
                                    <th>Status</th>
                                    <th className="text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredAlerts.map((alert) => {
                                    const emp = EMP_LIST.find(e => e.id === alert.assignedEmployeeId);
                                    return (
                                        <tr key={alert.id}>
                                            <td>
                                                <div className="flex items-center gap-2 text-sm">
                                                    <Clock className="h-4 w-4 text-muted-foreground" />
                                                    {new Date(alert.timestamp).toLocaleString(undefined, {
                                                        dateStyle: 'short',
                                                        timeStyle: 'short'
                                                    })}
                                                </div>
                                            </td>
                                            <td>
                                                <div className="flex items-center gap-2">
                                                    <Factory className="h-4 w-4 text-muted-foreground" />
                                                    <span className="font-medium">Factory {alert.factory}</span>
                                                </div>
                                            </td>
                                            <td>
                                                <span className="badge badge-danger">
                                                    {alert.violationType}
                                                </span>
                                            </td>
                                            <td>
                                                <div>
                                                    <p className="font-medium">{emp ? emp.name : alert.assignedEmployeeId}</p>
                                                    <p className="text-sm text-muted-foreground">{emp?.department}</p>
                                                </div>
                                            </td>
                                            <td>
                                                {alert.status === 'Active' ? (
                                                    <span className="badge badge-warning">
                                                        <AlertTriangle className="h-3 w-3" />
                                                        Active
                                                    </span>
                                                ) : (
                                                    <span className="badge badge-success">
                                                        <CheckCircle className="h-3 w-3" />
                                                        Resolved
                                                    </span>
                                                )}
                                            </td>
                                            <td className="text-right">
                                                {alert.status === 'Active' ? (
                                                    <button
                                                        onClick={() => resolve(alert.id)}
                                                        className="btn btn-primary text-sm"
                                                    >
                                                        Resolve
                                                    </button>
                                                ) : (
                                                    <span className="text-sm text-muted-foreground">Archived</span>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}

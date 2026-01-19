'use client';

import { Alert } from '@/lib/types';
import { AlertTriangle, CheckCircle, Clock, User } from 'lucide-react';

export default function AlertsPanel({ alerts, onResolve }: { alerts: Alert[], onResolve: (id: string) => void }) {
    const activeAlerts = alerts.filter(a => a.status === 'Active');

    return (
        <div className="glass-card h-full flex flex-col p-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-white/10">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-orange-600 flex items-center justify-center shadow-lg">
                        <AlertTriangle className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-white">Active Violations</h2>
                        <p className="text-xs text-slate-400">Real-time alerts</p>
                    </div>
                </div>

                <div className="relative">
                    <div className="badge badge-danger">
                        {activeAlerts.length}
                    </div>
                    {activeAlerts.length > 0 && (
                        <span className="absolute -top-1 -right-1 flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                        </span>
                    )}
                </div>
            </div>

            {/* Alerts List */}
            <div className="overflow-y-auto flex-1 space-y-3 pr-2">
                {alerts.length === 0 ? (
                    <div className="text-center py-16">
                        <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-green-500/10 flex items-center justify-center border border-green-500/20">
                            <CheckCircle className="w-10 h-10 text-green-500" />
                        </div>
                        <p className="text-white font-semibold mb-1">All Clear</p>
                        <p className="text-sm text-slate-400">No active violations detected</p>
                    </div>
                ) : (
                    alerts.map((alert, idx) => (
                        <div
                            key={alert.id}
                            className={`glass-card p-4 transition-all duration-300 hover:border-white/20 animate-slideInUp stagger-${Math.min(idx + 1, 5)} ${alert.status === 'Active'
                                    ? 'border-red-500/30 bg-red-500/5'
                                    : 'border-white/10 opacity-60'
                                }`}
                        >
                            <div className="flex justify-between items-start gap-3 mb-3">
                                <div className="flex-1">
                                    {/* Factory Badge */}
                                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-2">
                                        <div className={`w-2 h-2 rounded-full ${alert.status === 'Active' ? 'bg-red-500 animate-pulse' : 'bg-gray-500'}`}></div>
                                        <span className="text-xs font-bold text-white">Factory {alert.factory}</span>
                                    </div>

                                    {/* Violation Type */}
                                    <p className="text-sm font-bold text-red-400 mb-2">{alert.violationType}</p>

                                    {/* Metadata */}
                                    <div className="space-y-1.5">
                                        <div className="flex items-center gap-2 text-xs text-slate-400">
                                            <Clock className="w-3.5 h-3.5" />
                                            <span>{new Date(alert.timestamp).toLocaleString()}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-xs text-slate-400">
                                            <User className="w-3.5 h-3.5" />
                                            <span className="text-blue-400 font-semibold">{alert.assignedEmployeeId || 'Unassigned'}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Action Button */}
                                <div className="flex flex-col items-end gap-2">
                                    {alert.status === 'Active' ? (
                                        <button
                                            onClick={() => onResolve(alert.id)}
                                            className="btn-primary text-xs px-4 py-2"
                                        >
                                            Resolve
                                        </button>
                                    ) : (
                                        <div className="badge badge-success text-xs">
                                            <CheckCircle className="w-3 h-3" />
                                            Resolved
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

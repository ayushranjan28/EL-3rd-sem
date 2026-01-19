'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface CsvMetadata {
    factories: string[];
    numericColumns: string[];
    violationRate: number;
    topViolators: Array<{ factory: string; rate: number; count: number }>;
    thresholds: Record<string, number>;
    totalRows: number;
    dateRange: { start: string; end: string };
    sensors: string[];
}

export default function CsvSummary() {
    const [metadata, setMetadata] = useState<CsvMetadata | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchMetadata();
    }, []);

    const fetchMetadata = async () => {
        try {
            const response = await fetch('/api/csv-info');
            const result = await response.json();
            if (result.success) {
                setMetadata(result.data);
            }
        } catch (error) {
            console.error('Failed to fetch CSV metadata:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <Card>
                <CardContent className="p-6">
                    <div className="animate-pulse space-y-4">
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (!metadata) {
        return (
            <Card>
                <CardContent className="p-6">
                    <p className="text-red-600">Failed to load CSV data</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {/* Total Readings */}
            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-gray-600">Total Readings</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-3xl font-bold text-gray-900">{metadata.totalRows.toLocaleString()}</div>
                    <p className="text-xs text-gray-500 mt-1">
                        {new Date(metadata.dateRange.start).toLocaleDateString()} - {new Date(metadata.dateRange.end).toLocaleDateString()}
                    </p>
                </CardContent>
            </Card>

            {/* Violation Rate */}
            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-gray-600">Violation Rate</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-3xl font-bold text-red-600">{(metadata.violationRate * 100).toFixed(1)}%</div>
                    <p className="text-xs text-gray-500 mt-1">
                        {Math.round(metadata.totalRows * metadata.violationRate).toLocaleString()} violations detected
                    </p>
                </CardContent>
            </Card>

            {/* Factories Monitored */}
            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-gray-600">Factories</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-3xl font-bold text-blue-600">{metadata.factories.length}</div>
                    <p className="text-xs text-gray-500 mt-1">
                        {metadata.factories.join(', ')}
                    </p>
                </CardContent>
            </Card>

            {/* Sensors Detected */}
            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-gray-600">Sensors</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-3xl font-bold text-green-600">{metadata.sensors.length}</div>
                    <p className="text-xs text-gray-500 mt-1">
                        Parameters monitored
                    </p>
                </CardContent>
            </Card>

            {/* Top Violators Table */}
            <Card className="md:col-span-2 lg:col-span-4">
                <CardHeader>
                    <CardTitle>Top Violators (from CSV data)</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b">
                                    <th className="text-left py-2 px-4 font-medium text-gray-600">Factory</th>
                                    <th className="text-left py-2 px-4 font-medium text-gray-600">Violation Rate</th>
                                    <th className="text-left py-2 px-4 font-medium text-gray-600">Total Violations</th>
                                    <th className="text-left py-2 px-4 font-medium text-gray-600">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {metadata.topViolators.map((violator, idx) => (
                                    <tr key={violator.factory} className="border-b hover:bg-gray-50">
                                        <td className="py-3 px-4 font-medium">{violator.factory}</td>
                                        <td className="py-3 px-4">
                                            <div className="flex items-center gap-2">
                                                <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-[200px]">
                                                    <div
                                                        className={`h-2 rounded-full ${violator.rate > 0.3 ? 'bg-red-600' : violator.rate > 0.1 ? 'bg-yellow-600' : 'bg-green-600'
                                                            }`}
                                                        style={{ width: `${violator.rate * 100}%` }}
                                                    />
                                                </div>
                                                <span className="text-sm font-medium">{(violator.rate * 100).toFixed(1)}%</span>
                                            </div>
                                        </td>
                                        <td className="py-3 px-4">{violator.count.toLocaleString()}</td>
                                        <td className="py-3 px-4">
                                            <span
                                                className={`px-2 py-1 rounded-full text-xs font-medium ${violator.rate > 0.3
                                                    ? 'bg-red-100 text-red-800'
                                                    : violator.rate > 0.1
                                                        ? 'bg-yellow-100 text-yellow-800'
                                                        : 'bg-green-100 text-green-800'
                                                    }`}
                                            >
                                                {violator.rate > 0.3 ? 'Critical' : violator.rate > 0.1 ? 'Warning' : 'Normal'}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

            {/* Detected Thresholds */}
            <Card className="md:col-span-2 lg:col-span-4">
                <CardHeader>
                    <CardTitle>Violation Thresholds (Auto-detected from CSV)</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {Object.entries(metadata.thresholds).map(([key, value]) => (
                            <div key={key} className="p-3 bg-gray-50 rounded-lg">
                                <p className="text-xs text-gray-600 mb-1">{key.replace(/_/g, ' ').toUpperCase()}</p>
                                <p className="text-lg font-semibold text-gray-900">{value}</p>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

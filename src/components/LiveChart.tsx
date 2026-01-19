'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from 'recharts';

interface ChartPoint {
    timestamp: string;
    A: number;
    B: number;
    C: number;
}

interface LiveChartProps {
    data: ChartPoint[];
    dataKeyName: string;
    colorA?: string;
    colorB?: string;
    colorC?: string;
}

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="glass-card p-4 border-white/20">
                <p className="text-xs text-slate-400 mb-2">{new Date(label).toLocaleTimeString()}</p>
                {payload.map((entry: any, index: number) => (
                    <div key={index} className="flex items-center gap-2 mb-1">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }}></div>
                        <span className="text-sm font-semibold text-white">{entry.name}:</span>
                        <span className="text-sm text-slate-300">{entry.value.toFixed(1)}</span>
                    </div>
                ))}
            </div>
        );
    }
    return null;
};

export default function LiveChart({ data, dataKeyName, colorA = "#ef4444", colorB = "#3b82f6", colorC = "#10b981" }: LiveChartProps) {
    return (
        <div className="glass-card p-6 h-[360px] flex flex-col group">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-1 h-8 bg-gradient-to-b from-green-500 to-emerald-600 rounded-full"></div>
                    <div>
                        <h3 className="text-base font-bold text-white uppercase tracking-wide">
                            {dataKeyName}
                        </h3>
                        <p className="text-xs text-slate-400 mt-0.5">Real-time monitoring</p>
                    </div>
                </div>

                <div className="flex items-center gap-2 px-3 py-2 rounded-full bg-green-500/10 border border-green-500/30">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                    </span>
                    <span className="text-xs font-bold text-green-400 uppercase tracking-wider">Live</span>
                </div>
            </div>

            {/* Chart */}
            <div className="flex-1 w-full min-h-[240px]">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                        <defs>
                            <linearGradient id={`colorA-${dataKeyName}`} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={colorA} stopOpacity={0.4} />
                                <stop offset="95%" stopColor={colorA} stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id={`colorB-${dataKeyName}`} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={colorB} stopOpacity={0.4} />
                                <stop offset="95%" stopColor={colorB} stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id={`colorC-${dataKeyName}`} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={colorC} stopOpacity={0.4} />
                                <stop offset="95%" stopColor={colorC} stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" vertical={false} />
                        <XAxis
                            dataKey="timestamp"
                            tick={{ fontSize: 11, fill: '#94a3b8' }}
                            tickFormatter={(val) => new Date(val).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            stroke="rgba(255, 255, 255, 0.1)"
                            tickLine={false}
                        />
                        <YAxis
                            tick={{ fontSize: 11, fill: '#94a3b8' }}
                            stroke="rgba(255, 255, 255, 0.1)"
                            tickLine={false}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend
                            iconType="circle"
                            wrapperStyle={{ fontSize: '12px', paddingTop: '20px' }}
                            formatter={(value) => <span className="text-slate-300 font-semibold">{value}</span>}
                        />
                        <Area
                            name="Factory A"
                            type="monotone"
                            dataKey="A"
                            stroke={colorA}
                            strokeWidth={3}
                            fill={`url(#colorA-${dataKeyName})`}
                            dot={false}
                            activeDot={{ r: 6, strokeWidth: 2, stroke: '#1e293b', fill: colorA }}
                        />
                        <Area
                            name="Factory B"
                            type="monotone"
                            dataKey="B"
                            stroke={colorB}
                            strokeWidth={3}
                            fill={`url(#colorB-${dataKeyName})`}
                            dot={false}
                            activeDot={{ r: 6, strokeWidth: 2, stroke: '#1e293b', fill: colorB }}
                        />
                        <Area
                            name="Factory C"
                            type="monotone"
                            dataKey="C"
                            stroke={colorC}
                            strokeWidth={3}
                            fill={`url(#colorC-${dataKeyName})`}
                            dot={false}
                            activeDot={{ r: 6, strokeWidth: 2, stroke: '#1e293b', fill: colorC }}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

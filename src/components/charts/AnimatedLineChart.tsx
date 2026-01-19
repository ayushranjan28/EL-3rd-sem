'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { motion } from 'framer-motion';

interface ChartPoint {
    timestamp: string;
    A: number;
    B: number;
    C: number;
}

interface AnimatedLineChartProps {
    data: ChartPoint[];
    title: string;
    colorA?: string;
    colorB?: string;
    colorC?: string;
}

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="glass-light p-4 rounded-xl border border-white/20">
                <p className="text-xs text-muted-foreground mb-2 font-semibold">
                    {new Date(label).toLocaleTimeString()}
                </p>
                {payload.map((entry: any, index: number) => (
                    <div key={index} className="flex items-center gap-2 mb-1">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }}></div>
                        <span className="text-sm font-semibold">{entry.name}:</span>
                        <span className="text-sm font-bold" style={{ color: entry.color }}>{entry.value.toFixed(1)}</span>
                    </div>
                ))}
            </div>
        );
    }
    return null;
};

export function AnimatedLineChart({
    data,
    title,
    colorA = "#3B82F6",
    colorB = "#10B981",
    colorC = "#F59E0B"
}: AnimatedLineChartProps) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="glass-light rounded-2xl p-6 h-[400px] flex flex-col card-hover"
        >
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-1 h-10 rounded-full gradient-primary"></div>
                    <div>
                        <h3 className="text-lg font-bold">{title}</h3>
                        <p className="text-xs text-muted-foreground">Real-time monitoring</p>
                    </div>
                </div>

                <div className="flex items-center gap-2 px-3 py-2 rounded-full glass border border-green-500/30">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                    </span>
                    <span className="text-xs font-bold text-green-500 uppercase tracking-wider">Live</span>
                </div>
            </div>

            <div className="flex-1 w-full min-h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                        <defs>
                            <linearGradient id={`colorA-${title}`} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={colorA} stopOpacity={0.3} />
                                <stop offset="95%" stopColor={colorA} stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id={`colorB-${title}`} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={colorB} stopOpacity={0.3} />
                                <stop offset="95%" stopColor={colorB} stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id={`colorC-${title}`} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={colorC} stopOpacity={0.3} />
                                <stop offset="95%" stopColor={colorC} stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="currentColor" opacity={0.1} vertical={false} />
                        <XAxis
                            dataKey="timestamp"
                            tick={{ fontSize: 11, fill: 'currentColor', opacity: 0.6 }}
                            tickFormatter={(val) => new Date(val).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            stroke="currentColor"
                            opacity={0.2}
                            tickLine={false}
                        />
                        <YAxis
                            tick={{ fontSize: 11, fill: 'currentColor', opacity: 0.6 }}
                            stroke="currentColor"
                            opacity={0.2}
                            tickLine={false}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend
                            iconType="circle"
                            wrapperStyle={{ fontSize: '12px', paddingTop: '20px', fontWeight: 600 }}
                        />
                        <Area
                            name="Factory A"
                            type="monotone"
                            dataKey="A"
                            stroke={colorA}
                            strokeWidth={3}
                            fill={`url(#colorA-${title})`}
                            dot={false}
                            activeDot={{ r: 6, strokeWidth: 2, stroke: '#fff', fill: colorA }}
                        />
                        <Area
                            name="Factory B"
                            type="monotone"
                            dataKey="B"
                            stroke={colorB}
                            strokeWidth={3}
                            fill={`url(#colorB-${title})`}
                            dot={false}
                            activeDot={{ r: 6, strokeWidth: 2, stroke: '#fff', fill: colorB }}
                        />
                        <Area
                            name="Factory C"
                            type="monotone"
                            dataKey="C"
                            stroke={colorC}
                            strokeWidth={3}
                            fill={`url(#colorC-${title})`}
                            dot={false}
                            activeDot={{ r: 6, strokeWidth: 2, stroke: '#fff', fill: colorC }}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </motion.div>
    );
}

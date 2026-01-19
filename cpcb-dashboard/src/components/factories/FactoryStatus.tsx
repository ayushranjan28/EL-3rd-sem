'use client';

import { motion } from 'framer-motion';
import { Factory, Activity, AlertTriangle, Droplets, Zap, Gauge } from 'lucide-react';
import { FactoryId } from '@/lib/types';

interface FactoryStatusProps {
    factory: FactoryId;
    data: {
        turbidity: number;
        ph: number;
        cond: number;
    } | null;
    index: number;
}

const factoryConfig = {
    A: {
        name: 'Factory A',
        color: '#3B82F6',
        gradient: 'from-blue-500 to-cyan-600',
        bg: 'bg-blue-500/10',
        border: 'border-blue-500/30',
        glow: 'glow-info',
    },
    B: {
        name: 'Factory B',
        color: '#10B981',
        gradient: 'from-green-500 to-emerald-600',
        bg: 'bg-green-500/10',
        border: 'border-green-500/30',
        glow: 'glow-success',
    },
    C: {
        name: 'Factory C',
        color: '#F59E0B',
        gradient: 'from-amber-500 to-orange-600',
        bg: 'bg-amber-500/10',
        border: 'border-amber-500/30',
        glow: 'glow-warning',
    },
};

export function FactoryStatus({ factory, data, index }: FactoryStatusProps) {
    const config = factoryConfig[factory];
    const isViolation = data && (data.turbidity > 200 || data.ph < 6.5);

    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ y: -12, scale: 1.03 }}
            className={`glass-light rounded-2xl p-6 relative overflow-hidden group ${isViolation ? config.glow : ''}`}
        >
            {/* Animated Background Gradient */}
            <div className={`absolute top-0 right-0 w-40 h-40 bg-gradient-to-br ${config.gradient} opacity-10 rounded-full blur-3xl -mr-20 -mt-20 group-hover:opacity-20 transition-opacity duration-500`}></div>

            <div className="relative z-10">
                {/* Header */}
                <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-3">
                        <motion.div
                            whileHover={{ rotate: 360 }}
                            transition={{ duration: 0.6 }}
                            className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${config.gradient} flex items-center justify-center shadow-lg`}
                        >
                            <Factory className="w-7 h-7 text-white" />
                        </motion.div>
                        <div>
                            <h3 className="text-xl font-bold">{config.name}</h3>
                            <p className="text-xs text-muted-foreground">Zone {factory}</p>
                        </div>
                    </div>

                    {isViolation ? (
                        <motion.div
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 1, repeat: Infinity }}
                        >
                            <AlertTriangle className="w-7 h-7 text-red-500" />
                        </motion.div>
                    ) : (
                        <Activity className="w-7 h-7 text-green-500" />
                    )}
                </div>

                {/* Main Metric */}
                <div className="mb-6">
                    <div className="flex items-baseline gap-2 mb-2">
                        <motion.span
                            key={data?.turbidity}
                            initial={{ scale: 1.2, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="text-5xl font-bold gradient-text"
                        >
                            {data ? data.turbidity.toFixed(0) : '--'}
                        </motion.span>
                        <span className="text-lg text-muted-foreground font-semibold">NTU</span>
                    </div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Turbidity Level</p>
                </div>

                {/* Status Badge */}
                <div className="mb-6">
                    {isViolation ? (
                        <div className="badge badge-danger">
                            <AlertTriangle className="w-3.5 h-3.5" />
                            Violation Detected
                        </div>
                    ) : (
                        <div className="badge badge-success">
                            <Activity className="w-3.5 h-3.5" />
                            Normal Operation
                        </div>
                    )}
                </div>

                {/* Secondary Metrics */}
                <div className="grid grid-cols-2 gap-4">
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        className={`glass p-4 rounded-xl ${config.bg} border ${config.border}`}
                    >
                        <div className="flex items-center gap-2 mb-2">
                            <Droplets className="w-4 h-4" style={{ color: config.color }} />
                            <span className="text-xs text-muted-foreground uppercase font-semibold">pH Level</span>
                        </div>
                        <p className="text-2xl font-bold">{data ? data.ph.toFixed(1) : '--'}</p>
                    </motion.div>

                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        className={`glass p-4 rounded-xl ${config.bg} border ${config.border}`}
                    >
                        <div className="flex items-center gap-2 mb-2">
                            <Zap className="w-4 h-4" style={{ color: config.color }} />
                            <span className="text-xs text-muted-foreground uppercase font-semibold">Conductivity</span>
                        </div>
                        <p className="text-2xl font-bold">{data ? data.cond.toFixed(0) : '--'}</p>
                    </motion.div>
                </div>
            </div>
        </motion.div>
    );
}

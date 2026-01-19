'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface GlassCardProps {
    children: ReactNode;
    className?: string;
    hover?: boolean;
    gradient?: 'primary' | 'success' | 'warning' | 'info' | 'none';
}

export function GlassCard({ children, className = '', hover = true, gradient = 'none' }: GlassCardProps) {
    const gradientClasses = {
        primary: 'border-indigo-500/30',
        success: 'border-green-500/30',
        warning: 'border-amber-500/30',
        info: 'border-blue-500/30',
        none: '',
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            whileHover={hover ? { y: -8, scale: 1.02 } : {}}
            className={`glass-light rounded-2xl p-6 ${gradientClasses[gradient]} ${hover ? 'card-hover cursor-pointer' : ''
                } ${className}`}
        >
            {children}
        </motion.div>
    );
}

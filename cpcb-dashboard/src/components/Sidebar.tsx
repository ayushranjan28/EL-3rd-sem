'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Bell, FileText, Settings, Activity, Zap, Shield } from 'lucide-react';

export default function Sidebar() {
    const pathname = usePathname();

    const navItems = [
        { name: 'Live Dashboard', href: '/', icon: LayoutDashboard, color: 'from-green-500 to-emerald-500' },
        { name: 'Alerts', href: '/alerts', icon: Bell, color: 'from-red-500 to-orange-500' },
        { name: 'Reports', href: '#', icon: FileText, color: 'from-blue-500 to-cyan-500' },
        { name: 'Settings', href: '#', icon: Settings, color: 'from-purple-500 to-pink-500' },
    ];

    return (
        <div className="hidden md:flex flex-col w-72 h-screen sticky top-0 p-4 relative z-10">
            {/* Sidebar Glass Container */}
            <div className="glass-card h-full flex flex-col p-6">
                {/* Logo Section */}
                <div className="mb-8 pb-6 border-b border-white/10">
                    <div className="flex items-center gap-4 mb-3">
                        <div className="relative">
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg animate-pulse-glow">
                                <Activity className="w-7 h-7 text-white" strokeWidth={2.5} />
                            </div>
                            <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-slate-800 animate-pulse"></div>
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold gradient-text">CPCB</h1>
                            <p className="text-xs text-slate-400 uppercase tracking-widest font-semibold">Monitoring Hub</p>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 space-y-2">
                    {navItems.map((item, idx) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`group flex items-center gap-4 px-4 py-4 rounded-2xl transition-all duration-300 relative overflow-hidden ${isActive
                                        ? 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30'
                                        : 'hover:bg-white/5 border border-transparent'
                                    }`}
                            >
                                {/* Animated background on hover */}
                                <div className={`absolute inset-0 bg-gradient-to-r ${item.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-2xl`}></div>

                                {/* Icon with gradient background */}
                                <div className={`relative z-10 w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-300 ${isActive
                                        ? `bg-gradient-to-br ${item.color} shadow-lg`
                                        : 'bg-white/5 group-hover:bg-white/10'
                                    }`}>
                                    <item.icon className={`w-5 h-5 transition-all duration-300 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'
                                        }`} strokeWidth={2} />
                                </div>

                                <span className={`relative z-10 font-semibold text-sm transition-all duration-300 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'
                                    }`}>
                                    {item.name}
                                </span>

                                {/* Active indicator */}
                                {isActive && (
                                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-green-400 to-emerald-500 rounded-l-full shadow-lg shadow-green-500/50"></div>
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* System Status */}
                <div className="mt-auto pt-6 border-t border-white/10">
                    <div className="glass-card p-4 border-green-500/30">
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <Shield className="w-6 h-6 text-green-400" />
                                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                                </span>
                            </div>
                            <div>
                                <p className="text-sm font-bold text-white">System Secure</p>
                                <p className="text-xs text-slate-400">All systems operational</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Activity, Bell, FileText, Settings, Menu, X, User, Search } from 'lucide-react';
import { useState } from 'react';
import { ThemeToggle } from './ThemeToggle';
import { motion, AnimatePresence } from 'framer-motion';

export default function TopNav() {
    const pathname = usePathname();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const navItems = [
        { name: 'Dashboard', href: '/', icon: Activity },
        { name: 'Alerts', href: '/alerts', icon: Bell },
        { name: 'Reports', href: '#', icon: FileText },
        { name: 'Settings', href: '#', icon: Settings },
    ];

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            className="fixed top-0 left-0 right-0 z-50 glass-light border-b border-white/10"
        >
            <div className="max-w-[1800px] mx-auto px-6 py-4">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-3 group">
                        <motion.div
                            whileHover={{ scale: 1.1, rotate: 360 }}
                            transition={{ duration: 0.5 }}
                            className="w-12 h-12 rounded-2xl gradient-primary flex items-center justify-center shadow-lg animate-pulse-glow"
                        >
                            <Activity className="w-6 h-6 text-white" strokeWidth={2.5} />
                        </motion.div>
                        <div>
                            <h1 className="text-xl font-bold gradient-text">CPCB Monitor</h1>
                            <p className="text-xs text-muted-foreground">Real-time Industrial Tracking</p>
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-2">
                        {navItems.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all duration-300 ${isActive
                                            ? 'gradient-primary text-white shadow-lg'
                                            : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
                                        }`}
                                >
                                    <item.icon className="w-4 h-4" />
                                    <span className="font-semibold text-sm">{item.name}</span>
                                </Link>
                            );
                        })}
                    </div>

                    {/* Right Actions */}
                    <div className="flex items-center gap-3">
                        {/* Search */}
                        <button className="hidden sm:flex glass-light p-2.5 rounded-xl hover:scale-110 transition-all duration-300">
                            <Search className="w-5 h-5 text-muted-foreground" />
                        </button>

                        {/* Notifications */}
                        <button className="glass-light p-2.5 rounded-xl hover:scale-110 transition-all duration-300 relative">
                            <Bell className="w-5 h-5 text-muted-foreground" />
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                        </button>

                        {/* Theme Toggle */}
                        <ThemeToggle />

                        {/* User */}
                        <button className="hidden sm:flex glass-light p-1 pr-3 items-center gap-2 rounded-xl hover:scale-105 transition-all duration-300">
                            <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center">
                                <User className="w-4 h-4 text-white" />
                            </div>
                            <span className="text-sm font-semibold">Admin</span>
                        </button>

                        {/* Mobile Menu Toggle */}
                        <button
                            className="md:hidden glass-light p-2.5 rounded-xl"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        >
                            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                <AnimatePresence>
                    {mobileMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="md:hidden mt-4 pt-4 border-t border-white/10 space-y-2"
                        >
                            {navItems.map((item) => {
                                const isActive = pathname === item.href;
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        onClick={() => setMobileMenuOpen(false)}
                                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${isActive
                                                ? 'gradient-primary text-white'
                                                : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
                                            }`}
                                    >
                                        <item.icon className="w-5 h-5" />
                                        <span className="font-semibold">{item.name}</span>
                                    </Link>
                                );
                            })}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.nav>
    );
}

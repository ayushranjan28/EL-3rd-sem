'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function LoginPage() {
    const router = useRouter();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();

            if (data.success) {
                // Store user data in localStorage
                localStorage.setItem('user', JSON.stringify(data.user));

                // Redirect to dashboard
                router.push('/dashboard');
            } else {
                setError(data.error || 'Login failed');
            }
        } catch (err) {
            setError('Network error. Please try again.');
            console.error('Login error:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Logo & Title */}
                <div className="text-center mb-8">
                    <div className="inline-block p-4 bg-blue-600 rounded-full mb-4">
                        <svg
                            className="w-12 h-12 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                            />
                        </svg>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                        CPCB Water Monitoring
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Central Pollution Control Board
                    </p>
                </div>

                {/* Login Card */}
                <Card className="shadow-2xl">
                    <CardHeader>
                        <CardTitle className="text-center text-2xl">Employee Login</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleLogin} className="space-y-4">
                            {/* Error Message */}
                            {error && (
                                <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
                                    {error}
                                </div>
                            )}

                            {/* Username */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Username
                                </label>
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                                    placeholder="Enter your username"
                                    required
                                    autoFocus
                                />
                            </div>

                            {/* Password */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Password
                                </label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                                    placeholder="Enter your password"
                                    required
                                />
                            </div>

                            {/* Login Button */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                            <circle
                                                className="opacity-25"
                                                cx="12"
                                                cy="12"
                                                r="10"
                                                stroke="currentColor"
                                                strokeWidth="4"
                                                fill="none"
                                            />
                                            <path
                                                className="opacity-75"
                                                fill="currentColor"
                                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                            />
                                        </svg>
                                        Logging in...
                                    </span>
                                ) : (
                                    'Login'
                                )}
                            </button>
                        </form>

                        {/* Demo Credentials */}
                        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                            <p className="text-xs font-semibold text-blue-900 dark:text-blue-300 mb-2">
                                Demo Credentials:
                            </p>
                            <div className="space-y-1 text-xs text-blue-800 dark:text-blue-400">
                                <div className="flex justify-between">
                                    <span>Employee:</span>
                                    <code className="bg-white dark:bg-gray-800 px-2 py-0.5 rounded">emp001 / emp001@2024</code>
                                </div>
                                <div className="flex justify-between">
                                    <span>Supervisor:</span>
                                    <code className="bg-white dark:bg-gray-800 px-2 py-0.5 rounded">supervisor / super@2024</code>
                                </div>
                                <div className="flex justify-between">
                                    <span>Admin:</span>
                                    <code className="bg-white dark:bg-gray-800 px-2 py-0.5 rounded">admin / admin@2024</code>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Footer */}
                <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-6">
                    © 2024 Central Pollution Control Board. All rights reserved.
                </p>
            </div>
        </div>
    );
}

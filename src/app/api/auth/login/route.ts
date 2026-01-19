// app/api/auth/login/route.ts
// MongoDB authentication

import { NextResponse } from 'next/server';
import { getDatabase, collections } from '@/lib/mongodb';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
    try {
        const { username, password } = await request.json();

        if (!username || !password) {
            return NextResponse.json(
                { success: false, error: 'Username and password required' },
                { status: 400 }
            );
        }

        const db = await getDatabase();
        const user = await db.collection(collections.users).findOne({ username });

        if (!user) {
            return NextResponse.json(
                { success: false, error: 'Invalid credentials' },
                { status: 401 }
            );
        }

        const isValid = await bcrypt.compare(password, user.password);

        if (!isValid) {
            return NextResponse.json(
                { success: false, error: 'Invalid credentials' },
                { status: 401 }
            );
        }

        // Return user data (excluding password)
        const { password: _, ...userData } = user;

        return NextResponse.json({
            success: true,
            user: {
                id: user._id.toString(),
                username: user.username,
                role: user.role,
                employeeId: user.employeeId,
            },
        });
    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json(
            { success: false, error: 'Login failed' },
            { status: 500 }
        );
    }
}

// app/api/init-db/route.ts
// Database initialization with employee records

import { NextResponse } from 'next/server';
import { getDatabase, collections } from '@/lib/mongodb';
import bcrypt from 'bcryptjs';

export async function GET() {
    try {
        const db = await getDatabase();

        // Check if users already exist
        const existingUsers = await db.collection(collections.users).countDocuments();

        if (existingUsers > 0) {
            return NextResponse.json({
                success: true,
                message: 'Database already initialized',
                userCount: existingUsers,
            });
        }

        // Create employee accounts
        const employees = [
            {
                username: 'emp001',
                password: await bcrypt.hash('emp001@2024', 10),
                role: 'employee',
                employeeId: 'EMP-001',
                fullName: 'Rajesh Kumar',
                email: 'rajesh.kumar@cpcb.gov.in',
                department: 'Water Quality Monitoring',
                phone: '+91-9876543210',
                createdAt: new Date(),
                isActive: true,
            },
            {
                username: 'emp002',
                password: await bcrypt.hash('emp002@2024', 10),
                role: 'employee',
                employeeId: 'EMP-002',
                fullName: 'Priya Sharma',
                email: 'priya.sharma@cpcb.gov.in',
                department: 'Industrial Compliance',
                phone: '+91-9876543211',
                createdAt: new Date(),
                isActive: true,
            },
            {
                username: 'emp003',
                password: await bcrypt.hash('emp003@2024', 10),
                role: 'employee',
                employeeId: 'EMP-003',
                fullName: 'Amit Patel',
                email: 'amit.patel@cpcb.gov.in',
                department: 'Field Operations',
                phone: '+91-9876543212',
                createdAt: new Date(),
                isActive: true,
            },
            {
                username: 'emp004',
                password: await bcrypt.hash('emp004@2024', 10),
                role: 'employee',
                employeeId: 'EMP-004',
                fullName: 'Sneha Reddy',
                email: 'sneha.reddy@cpcb.gov.in',
                department: 'Data Analysis',
                phone: '+91-9876543213',
                createdAt: new Date(),
                isActive: true,
            },
            {
                username: 'emp005',
                password: await bcrypt.hash('emp005@2024', 10),
                role: 'employee',
                employeeId: 'EMP-005',
                fullName: 'Vikram Singh',
                email: 'vikram.singh@cpcb.gov.in',
                department: 'Environmental Safety',
                phone: '+91-9876543214',
                createdAt: new Date(),
                isActive: true,
            },
            {
                username: 'supervisor',
                password: await bcrypt.hash('super@2024', 10),
                role: 'supervisor',
                employeeId: 'SUP-001',
                fullName: 'Dr. Meera Iyer',
                email: 'meera.iyer@cpcb.gov.in',
                department: 'Quality Control',
                phone: '+91-9876543215',
                createdAt: new Date(),
                isActive: true,
            },
            {
                username: 'admin',
                password: await bcrypt.hash('admin@2024', 10),
                role: 'admin',
                employeeId: 'ADMIN-001',
                fullName: 'Administrator',
                email: 'admin@cpcb.gov.in',
                department: 'IT & Systems',
                phone: '+91-9876543216',
                createdAt: new Date(),
                isActive: true,
            },
        ];

        // Insert employees
        const result = await db.collection(collections.users).insertMany(employees);

        // Create indexes
        await db.collection(collections.users).createIndex({ username: 1 }, { unique: true });
        await db.collection(collections.users).createIndex({ employeeId: 1 }, { unique: true });
        await db.collection(collections.users).createIndex({ email: 1 }, { unique: true });

        await db.collection(collections.alerts).createIndex({ timestamp: -1 });
        await db.collection(collections.alerts).createIndex({ factory_id: 1 });
        await db.collection(collections.alerts).createIndex({ alert_status: 1 });
        await db.collection(collections.alerts).createIndex({ assigned_employee_id: 1 });

        return NextResponse.json({
            success: true,
            message: 'Database initialized successfully',
            employeesCreated: result.insertedCount,
            employees: employees.map(e => ({
                username: e.username,
                employeeId: e.employeeId,
                fullName: e.fullName,
                role: e.role,
            })),
        });
    } catch (error: any) {
        console.error('Database initialization error:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'Failed to initialize database',
                details: error.message,
            },
            { status: 500 }
        );
    }
}

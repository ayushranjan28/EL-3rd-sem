// app/api/alerts/route.ts
// Alert management with MongoDB

import { NextResponse } from 'next/server';
import { getDatabase, collections, Alert } from '@/lib/mongodb';

/**
 * GET - Fetch alerts
 */
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const status = searchParams.get('status');
        const factory = searchParams.get('factory');
        const limit = parseInt(searchParams.get('limit') || '50');

        const db = await getDatabase();
        const query: any = {};

        if (status && status !== 'all') {
            query.alert_status = status;
        }

        if (factory) {
            query.factory_id = factory;
        }

        const alerts = await db
            .collection(collections.alerts)
            .find(query)
            .sort({ timestamp: -1 })
            .limit(limit)
            .toArray();

        return NextResponse.json({
            success: true,
            alerts,
            count: alerts.length,
        });
    } catch (error) {
        console.error('Get alerts error:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch alerts' },
            { status: 500 }
        );
    }
}

/**
 * POST - Create new alert
 */
export async function POST(request: Request) {
    try {
        const body = await request.json();

        const alert: Alert = {
            timestamp: body.timestamp || new Date().toISOString(),
            reading_id: body.reading_id || `R-${Date.now()}`,
            factory_id: body.factory_id,
            factory_type: body.factory_type,
            location_km_from_origin: body.location_km_from_origin,
            sensor_data: {
                flow_rate_m3ph: body.flow_rate_m3ph,
                turbidity_ntu: body.turbidity_ntu,
                ph: body.ph,
                conductivity_us_cm: body.conductivity_us_cm,
                temperature_c: body.temperature_c,
                chromium_mg_l: body.chromium_mg_l,
                copper_mg_l: body.copper_mg_l,
                tds_mg_l: body.tds_mg_l,
                uv_vis_absorbance: body.uv_vis_absorbance,
            },
            is_violation: body.is_violation,
            violation_reason: body.violation_reason || '',
            ai_violation_score: body.ai_violation_score || 0,
            assigned_employee_id: body.assigned_employee_id || '',
            alert_status: body.alert_status || 'pending',
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        const db = await getDatabase();
        const result = await db.collection(collections.alerts).insertOne(alert as any);

        return NextResponse.json({
            success: true,
            alertId: result.insertedId.toString(),
            alert,
        });
    } catch (error) {
        console.error('Create alert error:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to create alert' },
            { status: 500 }
        );
    }
}

/**
 * PATCH - Update alert status
 */
export async function PATCH(request: Request) {
    try {
        const body = await request.json();
        const { alertId, status, employeeId } = body;

        if (!alertId || !status) {
            return NextResponse.json(
                { success: false, error: 'Alert ID and status required' },
                { status: 400 }
            );
        }

        const db = await getDatabase();
        const { ObjectId } = require('mongodb');

        const update: any = {
            alert_status: status,
            updatedAt: new Date(),
        };

        if (employeeId) {
            update.assigned_employee_id = employeeId;
        }

        const result = await db.collection(collections.alerts).updateOne(
            { _id: new ObjectId(alertId) },
            { $set: update }
        );

        if (result.matchedCount === 0) {
            return NextResponse.json(
                { success: false, error: 'Alert not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: 'Alert updated successfully',
        });
    } catch (error) {
        console.error('Update alert error:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to update alert' },
            { status: 500 }
        );
    }
}

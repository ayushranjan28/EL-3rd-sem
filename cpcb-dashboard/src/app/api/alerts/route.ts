import { NextResponse } from 'next/server';
import { getDatabase, collections } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

// Helper for CORS
function corsResponse(response: NextResponse) {
    response.headers.set('Access-Control-Allow-Origin', '*'); // Or http://localhost:5000
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type');
    return response;
}

export async function OPTIONS() {
    return corsResponse(NextResponse.json({}, { status: 200 }));
}

// Force dynamic to prevent caching
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {

    try {
        const { searchParams } = new URL(request.url);
        const limit = parseInt(searchParams.get('limit') || '50');
        const employeeId = searchParams.get('employeeId');
        const supervisorId = searchParams.get('supervisorId');

        const db = await getDatabase();
        const collection = db.collection(collections.alerts);

        let query: any = {};

        // Filter by employee if requested
        if (employeeId) {
            query.assigned_employee_id = employeeId;
        }

        // Filter by supervisor if requested (find all employees under this supervisor)
        if (supervisorId) {
            query.supervisor_id = supervisorId;
        }

        const alerts = await collection
            .find(query)
            .sort({ timestamp: -1 })
            .limit(limit)
            .toArray();

        return corsResponse(NextResponse.json({ success: true, alerts }));
    } catch (error: any) {
        return corsResponse(NextResponse.json({ success: false, error: error.message }, { status: 500 }));
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const db = await getDatabase();

        if (body.action === 'create') {
            // "Auto-Assign" Logic
            // 1. Get all employees
            const employees = await db.collection(collections.users)
                .find({ role: 'employee' })
                .toArray();

            if (employees.length === 0) {
                return corsResponse(NextResponse.json({ success: false, error: 'No employees found to assign' }, { status: 404 }));
            }

            // 2. Pick random employee
            const randomEmployee = employees[Math.floor(Math.random() * employees.length)];

            // 3. Create Alert Object
            const newAlert = {
                ...body.alert_data,
                assigned_employee_id: randomEmployee.employeeId,
                assigned_employee_name: randomEmployee.fullName,
                supervisor_id: randomEmployee.supervisorId || 'SUP-001', // Fallback
                alert_status: 'pending',
                timestamp: new Date(),
                created_at: new Date()
            };

            await db.collection(collections.alerts).insertOne(newAlert);

            return corsResponse(NextResponse.json({
                success: true,
                message: 'Alert created and assigned',
                assigned_to: randomEmployee.username,
                supervisor: randomEmployee.supervisorId
            }));
        }

        if (body.action === 'resolve') {
            const { id, notes } = body;

            console.log(`Resolving Alert ID: ${id}`);

            const result = await db.collection(collections.alerts).updateOne(
                { _id: new ObjectId(id) },
                {
                    $set: {
                        alert_status: 'resolved',
                        resolved_at: new Date(),
                        resolution_notes: notes
                    }
                }
            );

            console.log(`Matched: ${result.matchedCount}, Modified: ${result.modifiedCount}`);

            if (result.matchedCount === 0) {
                return corsResponse(NextResponse.json({ success: false, error: 'Alert not found' }, { status: 404 }));
            }

            return corsResponse(NextResponse.json({ success: true }));
        }

        if (body.action === 'reopen') {
            const { id } = body;

            console.log(`Re-opening Alert ID: ${id}`);

            const result = await db.collection(collections.alerts).updateOne(
                { _id: new ObjectId(id) },
                {
                    $set: {
                        alert_status: 'pending',
                        resolved_at: null,
                        resolution_notes: null // Clear notes on re-open
                    }
                }
            );

            if (result.matchedCount === 0) {
                return corsResponse(NextResponse.json({ success: false, error: 'Alert not found' }, { status: 404 }));
            }

            return corsResponse(NextResponse.json({ success: true }));
        }

        return corsResponse(NextResponse.json({ error: 'Invalid action' }, { status: 400 }));
    } catch (error: any) {
        console.error("Alert API Error:", error);
        return corsResponse(NextResponse.json({ success: false, error: error.message }, { status: 500 }));
    }
}

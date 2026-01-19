import { NextResponse } from 'next/server';
import { fetchAlerts, createAlertInDb, updateAlertStatusInDb } from '@/lib/db';
import { Alert } from '@/lib/types';

export async function GET() {
    const alerts = await fetchAlerts();
    return NextResponse.json(alerts);
}

export async function POST(request: Request) {
    const body = await request.json();

    if (body.action === 'create') {
        const newAlert: Alert = body.alert;
        await createAlertInDb(newAlert);
        return NextResponse.json({ success: true });
    }

    if (body.action === 'resolve') {
        const { id } = body;
        await updateAlertStatusInDb(id, 'Resolved');
        return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
}

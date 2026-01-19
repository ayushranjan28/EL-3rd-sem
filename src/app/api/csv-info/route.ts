// app/api/csv-info/route.ts
// Auto-detect CSV structure and metadata

import { NextResponse } from 'next/server';
import { getCsvMetadata, parseCsvFile } from '@/lib/csv-reader';

export async function GET() {
    try {
        const metadata = await getCsvMetadata();

        return NextResponse.json({
            success: true,
            data: metadata,
        });
    } catch (error) {
        console.error('CSV info error:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to read CSV file' },
            { status: 500 }
        );
    }
}

/**
 * Get filtered CSV data
 */
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { factory_id, limit = 100 } = body;

        let data = await parseCsvFile();

        // Filter by factory if specified
        if (factory_id) {
            data = data.filter(row => row.factory_id === factory_id);
        }

        // Limit results
        data = data.slice(0, limit);

        return NextResponse.json({
            success: true,
            data,
            count: data.length,
        });
    } catch (error) {
        console.error('CSV data error:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch CSV data' },
            { status: 500 }
        );
    }
}

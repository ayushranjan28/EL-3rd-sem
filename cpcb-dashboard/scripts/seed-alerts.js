const { MongoClient } = require('mongodb');

// Ensure correct URI
const uri = "mongodb://localhost:27017/water_pollution_db";
const client = new MongoClient(uri);

async function run() {
    try {
        console.log("Connecting to MongoDB...");
        await client.connect();
        const db = client.db('water_pollution_db');
        const alertsCollection = db.collection('alerts');

        // Create 10 dummy alerts
        const dummyAlerts = [
            {
                factory_id: 'TX-C',
                factory_type: 'Textile',
                ai_violation_score: 0.85,
                ai_alert_level: 'SEVERE',
                violation_reasons: ['High Chromium', 'High Turbidity'],
                is_violation: true,
                assigned_employee_id: 'EMP-001',
                assigned_employee_name: 'Rajesh Kumar',
                supervisor_id: 'SUP-001',
                alert_status: 'pending',
                timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
            },
            {
                factory_id: 'CH-2',
                factory_type: 'Chemical',
                ai_violation_score: 0.95,
                ai_alert_level: 'CRITICAL',
                violation_reasons: ['Critical pH', 'High TDS'],
                is_violation: true,
                assigned_employee_id: 'EMP-003', // Amit Patel
                assigned_employee_name: 'Amit Patel',
                supervisor_id: 'SUP-001',
                alert_status: 'pending',
                timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5),
            },
            {
                factory_id: 'TX-A',
                factory_type: 'Textile',
                ai_violation_score: 0.65,
                ai_alert_level: 'HIGH',
                violation_reasons: ['Abnormal Flow'],
                is_violation: true,
                assigned_employee_id: 'EMP-005', // Vikram Singh
                assigned_employee_name: 'Vikram Singh',
                supervisor_id: 'SUP-002',
                alert_status: 'pending',
                timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
            },
            {
                factory_id: 'CH-1',
                factory_type: 'Chemical',
                ai_violation_score: 0.45,
                ai_alert_level: 'MODERATE',
                violation_reasons: ['Low pH'],
                is_violation: true,
                assigned_employee_id: 'EMP-006',
                assigned_employee_name: 'Anjali Gupta',
                supervisor_id: 'SUP-002',
                alert_status: 'resolved',
                resolution_notes: 'Sensor recalibrated',
                resolved_at: new Date(),
                timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48), // 2 days ago
            },
            {
                factory_id: 'TX-B',
                factory_type: 'Textile',
                ai_violation_score: 0.35,
                ai_alert_level: 'LOW',
                violation_reasons: ['Minor Turbidity'],
                is_violation: true,
                assigned_employee_id: 'EMP-001',
                assigned_employee_name: 'Rajesh Kumar',
                supervisor_id: 'SUP-001',
                alert_status: 'pending',
                timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 mins ago
            }
        ];

        // Duplicate to reach 10
        const moreAlerts = dummyAlerts.map(a => ({ ...a, _id: undefined, timestamp: new Date(a.timestamp.getTime() - 10000) }));

        const finalAlerts = [...dummyAlerts, ...moreAlerts];

        const result = await alertsCollection.insertMany(finalAlerts);
        console.log(`✓ Successfully inserted ${result.insertedCount} test alerts.`);

        // Count total
        const count = await alertsCollection.countDocuments();
        console.log(`Total Alerts in Database: ${count}`);

    } catch (err) {
        console.error("Error seeding alerts:", err);
    } finally {
        await client.close();
    }
}

run();

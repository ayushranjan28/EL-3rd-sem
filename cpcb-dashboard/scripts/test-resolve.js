const { MongoClient, ObjectId } = require('mongodb');

// Ensure correct URI
const uri = "mongodb://localhost:27017/water_pollution_db";
const client = new MongoClient(uri);

async function run() {
    try {
        console.log("Connecting...");
        await client.connect();
        const db = client.db('water_pollution_db');
        const alerts = db.collection('alerts');

        // 1. Create 2 alerts for EMP-TEST
        const a1 = {
            assigned_employee_id: 'EMP-TEST',
            alert_status: 'pending',
            desc: 'Alert 1'
        };
        const a2 = {
            assigned_employee_id: 'EMP-TEST',
            alert_status: 'pending',
            desc: 'Alert 2'
        };

        const res = await alerts.insertMany([a1, a2]);
        const ids = Object.values(res.insertedIds);
        console.log("Created 2 alerts:", ids);

        // 2. Resolve Alert 1
        console.log("Resolving Alert 1...");
        await alerts.updateOne(
            { _id: new ObjectId(ids[0]) },
            { $set: { alert_status: 'resolved' } }
        );

        // 3. Check status of Alert 2
        const checkA2 = await alerts.findOne({ _id: new ObjectId(ids[1]) });
        console.log(`Alert 2 Status: ${checkA2.alert_status}`);

        if (checkA2.alert_status === 'pending') {
            console.log("PASS: Alert 2 is still pending.");
        } else {
            console.log("FAIL: Alert 2 was affected!");
        }

        // Cleanup
        await alerts.deleteMany({ assigned_employee_id: 'EMP-TEST' });

    } catch (err) {
        console.error(err);
    } finally {
        await client.close();
    }
}

run();

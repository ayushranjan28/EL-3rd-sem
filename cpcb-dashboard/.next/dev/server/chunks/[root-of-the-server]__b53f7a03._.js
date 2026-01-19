module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/crypto [external] (crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("crypto", () => require("crypto"));

module.exports = mod;
}),
"[project]/src/lib/mongodb.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "collections",
    ()=>collections,
    "default",
    ()=>__TURBOPACK__default__export__,
    "getDatabase",
    ()=>getDatabase,
    "initializeDatabase",
    ()=>initializeDatabase
]);
// lib/mongodb.ts
// MongoDB connection and utilities
var __TURBOPACK__imported__module__$5b$externals$5d2f$mongodb__$5b$external$5d$__$28$mongodb$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$mongodb$29$__ = __turbopack_context__.i("[externals]/mongodb [external] (mongodb, cjs, [project]/node_modules/mongodb)");
;
if (!process.env.MONGODB_URI) {
    throw new Error('Please add your MongoDB URI to .env.local');
}
const uri = process.env.MONGODB_URI;
const options = {};
let client;
let clientPromise;
if ("TURBOPACK compile-time truthy", 1) {
    // In development mode, use a global variable to preserve the MongoClient across hot reloads
    if (!global._mongoClientPromise) {
        client = new __TURBOPACK__imported__module__$5b$externals$5d2f$mongodb__$5b$external$5d$__$28$mongodb$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$mongodb$29$__["MongoClient"](uri, options);
        global._mongoClientPromise = client.connect();
    }
    clientPromise = global._mongoClientPromise;
} else //TURBOPACK unreachable
;
const __TURBOPACK__default__export__ = clientPromise;
async function getDatabase() {
    const client = await clientPromise;
    return client.db('water_pollution_db');
}
const collections = {
    users: 'users',
    alerts: 'alerts',
    readings: 'readings'
};
async function initializeDatabase() {
    const db = await getDatabase();
    // Check if users exist
    const usersCount = await db.collection(collections.users).countDocuments();
    if (usersCount === 0) {
        // Seed users
        const bcrypt = __turbopack_context__.r("[project]/node_modules/bcryptjs/umd/index.js [app-route] (ecmascript)");
        const users = [
            {
                username: 'emp047',
                password: await bcrypt.hash('emp123', 10),
                role: 'employee',
                employeeId: 'EMP-001',
                createdAt: new Date()
            },
            {
                username: 'emp048',
                password: await bcrypt.hash('emp123', 10),
                role: 'employee',
                employeeId: 'EMP-002',
                createdAt: new Date()
            },
            {
                username: 'admin',
                password: await bcrypt.hash('admin123', 10),
                role: 'admin',
                employeeId: 'ADMIN-001',
                createdAt: new Date()
            }
        ];
        await db.collection(collections.users).insertMany(users);
        console.log('✓ Seeded users');
    }
    // Create indexes
    await db.collection(collections.alerts).createIndex({
        timestamp: -1
    });
    await db.collection(collections.alerts).createIndex({
        factory_id: 1
    });
    await db.collection(collections.alerts).createIndex({
        alert_status: 1
    });
    await db.collection(collections.readings).createIndex({
        timestamp: -1
    });
    console.log('✓ Database initialized');
}
}),
"[project]/src/app/api/init-db/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET
]);
// app/api/init-db/route.ts
// Database initialization with employee records
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$mongodb$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/mongodb.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$bcryptjs$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/bcryptjs/index.js [app-route] (ecmascript)");
;
;
;
async function GET() {
    try {
        const db = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$mongodb$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getDatabase"])();
        // Check if users already exist
        const existingUsers = await db.collection(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$mongodb$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["collections"].users).countDocuments();
        if (existingUsers > 0) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: true,
                message: 'Database already initialized',
                userCount: existingUsers
            });
        }
        // Create employee accounts
        const employees = [
            {
                username: 'emp001',
                password: await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$bcryptjs$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].hash('emp001@2024', 10),
                role: 'employee',
                employeeId: 'EMP-001',
                fullName: 'Rajesh Kumar',
                email: 'rajesh.kumar@cpcb.gov.in',
                department: 'Water Quality Monitoring',
                phone: '+91-9876543210',
                createdAt: new Date(),
                isActive: true
            },
            {
                username: 'emp002',
                password: await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$bcryptjs$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].hash('emp002@2024', 10),
                role: 'employee',
                employeeId: 'EMP-002',
                fullName: 'Priya Sharma',
                email: 'priya.sharma@cpcb.gov.in',
                department: 'Industrial Compliance',
                phone: '+91-9876543211',
                createdAt: new Date(),
                isActive: true
            },
            {
                username: 'emp003',
                password: await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$bcryptjs$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].hash('emp003@2024', 10),
                role: 'employee',
                employeeId: 'EMP-003',
                fullName: 'Amit Patel',
                email: 'amit.patel@cpcb.gov.in',
                department: 'Field Operations',
                phone: '+91-9876543212',
                createdAt: new Date(),
                isActive: true
            },
            {
                username: 'emp004',
                password: await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$bcryptjs$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].hash('emp004@2024', 10),
                role: 'employee',
                employeeId: 'EMP-004',
                fullName: 'Sneha Reddy',
                email: 'sneha.reddy@cpcb.gov.in',
                department: 'Data Analysis',
                phone: '+91-9876543213',
                createdAt: new Date(),
                isActive: true
            },
            {
                username: 'emp005',
                password: await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$bcryptjs$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].hash('emp005@2024', 10),
                role: 'employee',
                employeeId: 'EMP-005',
                fullName: 'Vikram Singh',
                email: 'vikram.singh@cpcb.gov.in',
                department: 'Environmental Safety',
                phone: '+91-9876543214',
                createdAt: new Date(),
                isActive: true
            },
            {
                username: 'supervisor',
                password: await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$bcryptjs$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].hash('super@2024', 10),
                role: 'supervisor',
                employeeId: 'SUP-001',
                fullName: 'Dr. Meera Iyer',
                email: 'meera.iyer@cpcb.gov.in',
                department: 'Quality Control',
                phone: '+91-9876543215',
                createdAt: new Date(),
                isActive: true
            },
            {
                username: 'admin',
                password: await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$bcryptjs$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].hash('admin@2024', 10),
                role: 'admin',
                employeeId: 'ADMIN-001',
                fullName: 'Administrator',
                email: 'admin@cpcb.gov.in',
                department: 'IT & Systems',
                phone: '+91-9876543216',
                createdAt: new Date(),
                isActive: true
            }
        ];
        // Insert employees
        const result = await db.collection(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$mongodb$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["collections"].users).insertMany(employees);
        // Create indexes
        await db.collection(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$mongodb$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["collections"].users).createIndex({
            username: 1
        }, {
            unique: true
        });
        await db.collection(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$mongodb$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["collections"].users).createIndex({
            employeeId: 1
        }, {
            unique: true
        });
        await db.collection(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$mongodb$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["collections"].users).createIndex({
            email: 1
        }, {
            unique: true
        });
        await db.collection(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$mongodb$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["collections"].alerts).createIndex({
            timestamp: -1
        });
        await db.collection(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$mongodb$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["collections"].alerts).createIndex({
            factory_id: 1
        });
        await db.collection(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$mongodb$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["collections"].alerts).createIndex({
            alert_status: 1
        });
        await db.collection(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$mongodb$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["collections"].alerts).createIndex({
            assigned_employee_id: 1
        });
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true,
            message: 'Database initialized successfully',
            employeesCreated: result.insertedCount,
            employees: employees.map((e)=>({
                    username: e.username,
                    employeeId: e.employeeId,
                    fullName: e.fullName,
                    role: e.role
                }))
        });
    } catch (error) {
        console.error('Database initialization error:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: false,
            error: 'Failed to initialize database',
            details: error.message
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__b53f7a03._.js.map
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
"[project]/cpcb-dashboard/src/lib/mongodb.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
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
var __TURBOPACK__imported__module__$5b$externals$5d2f$mongodb__$5b$external$5d$__$28$mongodb$2c$__cjs$2c$__$5b$project$5d2f$cpcb$2d$dashboard$2f$node_modules$2f$mongodb$29$__ = __turbopack_context__.i("[externals]/mongodb [external] (mongodb, cjs, [project]/cpcb-dashboard/node_modules/mongodb)");
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
        client = new __TURBOPACK__imported__module__$5b$externals$5d2f$mongodb__$5b$external$5d$__$28$mongodb$2c$__cjs$2c$__$5b$project$5d2f$cpcb$2d$dashboard$2f$node_modules$2f$mongodb$29$__["MongoClient"](uri, options);
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
        const bcrypt = __turbopack_context__.r("[project]/cpcb-dashboard/node_modules/bcryptjs/umd/index.js [app-route] (ecmascript)");
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
"[project]/cpcb-dashboard/src/app/api/auth/login/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "POST",
    ()=>POST
]);
// app/api/auth/login/route.ts
// MongoDB authentication
var __TURBOPACK__imported__module__$5b$project$5d2f$cpcb$2d$dashboard$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/cpcb-dashboard/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$cpcb$2d$dashboard$2f$src$2f$lib$2f$mongodb$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/cpcb-dashboard/src/lib/mongodb.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$cpcb$2d$dashboard$2f$node_modules$2f$bcryptjs$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/cpcb-dashboard/node_modules/bcryptjs/index.js [app-route] (ecmascript)");
;
;
;
async function POST(request) {
    try {
        const { username, password } = await request.json();
        if (!username || !password) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$cpcb$2d$dashboard$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: false,
                error: 'Username and password required'
            }, {
                status: 400
            });
        }
        const db = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$cpcb$2d$dashboard$2f$src$2f$lib$2f$mongodb$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getDatabase"])();
        const user = await db.collection(__TURBOPACK__imported__module__$5b$project$5d2f$cpcb$2d$dashboard$2f$src$2f$lib$2f$mongodb$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["collections"].users).findOne({
            username
        });
        if (!user) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$cpcb$2d$dashboard$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: false,
                error: 'Invalid credentials'
            }, {
                status: 401
            });
        }
        const isValid = await __TURBOPACK__imported__module__$5b$project$5d2f$cpcb$2d$dashboard$2f$node_modules$2f$bcryptjs$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].compare(password, user.password);
        if (!isValid) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$cpcb$2d$dashboard$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: false,
                error: 'Invalid credentials'
            }, {
                status: 401
            });
        }
        // Return user data (excluding password)
        const { password: _, ...userData } = user;
        return __TURBOPACK__imported__module__$5b$project$5d2f$cpcb$2d$dashboard$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true,
            user: {
                id: user._id.toString(),
                username: user.username,
                role: user.role,
                employeeId: user.employeeId
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$cpcb$2d$dashboard$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: false,
            error: 'Login failed'
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__ef925901._.js.map
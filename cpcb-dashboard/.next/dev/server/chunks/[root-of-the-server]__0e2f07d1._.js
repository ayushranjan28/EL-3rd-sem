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
"[externals]/stream [external] (stream, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("stream", () => require("stream"));

module.exports = mod;
}),
"[externals]/fs [external] (fs, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("fs", () => require("fs"));

module.exports = mod;
}),
"[externals]/path [external] (path, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("path", () => require("path"));

module.exports = mod;
}),
"[project]/src/lib/csv-reader.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "extractThresholds",
    ()=>extractThresholds,
    "filterByFactory",
    ()=>filterByFactory,
    "getColumnRange",
    ()=>getColumnRange,
    "getCsvMetadata",
    ()=>getCsvMetadata,
    "getFactories",
    ()=>getFactories,
    "getNumericColumns",
    ()=>getNumericColumns,
    "getRecentReadings",
    ()=>getRecentReadings,
    "getViolationRates",
    ()=>getViolationRates,
    "parseCsvFile",
    ()=>parseCsvFile
]);
// lib/csv-reader.ts
// CSV-first data loader with auto-detection
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$papaparse$2f$papaparse$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/papaparse/papaparse.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/fs [external] (fs, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/path [external] (path, cjs)");
;
;
;
async function parseCsvFile(filePath = '/public/data.csv') {
    const fullPath = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(process.cwd(), filePath);
    const fileContent = __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].readFileSync(fullPath, 'utf-8');
    return new Promise((resolve, reject)=>{
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$papaparse$2f$papaparse$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].parse(fileContent, {
            header: true,
            dynamicTyping: true,
            skipEmptyLines: true,
            complete: (results)=>{
                resolve(results.data);
            },
            error: (error)=>{
                reject(error);
            }
        });
    });
}
function getNumericColumns(data) {
    if (data.length === 0) return [];
    const firstRow = data[0];
    const numericCols = [];
    for (const [key, value] of Object.entries(firstRow)){
        if (typeof value === 'number' && !key.includes('id') && !key.includes('baseline') && !key.includes('violation')) {
            numericCols.push(key);
        }
    }
    return numericCols;
}
function getFactories(data) {
    const factories = new Set();
    data.forEach((row)=>{
        if (row.factory_id && row.factory_id !== '') {
            factories.add(row.factory_id);
        }
    });
    return Array.from(factories).sort();
}
function getViolationRates(data) {
    const factoryStats = {};
    data.forEach((row)=>{
        if (row.factory_id && row.factory_id !== '') {
            const factory = row.factory_id;
            if (!factoryStats[factory]) {
                factoryStats[factory] = {
                    total: 0,
                    violations: 0
                };
            }
            factoryStats[factory].total++;
            if (row.is_violation === 1) {
                factoryStats[factory].violations++;
            }
        }
    });
    return Object.entries(factoryStats).map(([factory, stats])=>({
            factory,
            rate: stats.violations / stats.total,
            count: stats.violations
        })).sort((a, b)=>b.rate - a.rate);
}
function extractThresholds(data) {
    const thresholds = {
        turbidity_ntu: 200,
        ph_low: 5.5,
        ph_high: 9.0,
        chromium_mg_l: 0.1,
        copper_mg_l: 3.0,
        tds_mg_l: 2100,
        uv_vis_absorbance: 1.0
    };
    // Could be enhanced to auto-detect from violation_reason patterns
    return thresholds;
}
async function getCsvMetadata() {
    const data = await parseCsvFile();
    const factories = getFactories(data);
    const numericColumns = getNumericColumns(data);
    const violationRates = getViolationRates(data);
    const thresholds = extractThresholds(data);
    const totalViolations = data.filter((row)=>row.is_violation === 1).length;
    const violationRate = totalViolations / data.length;
    // Get date range
    const timestamps = data.filter((row)=>row.timestamp).map((row)=>new Date(row.timestamp));
    const dateRange = {
        start: timestamps.length > 0 ? new Date(Math.min(...timestamps.map((d)=>d.getTime()))).toISOString() : '',
        end: timestamps.length > 0 ? new Date(Math.max(...timestamps.map((d)=>d.getTime()))).toISOString() : ''
    };
    // Sensor columns (exclude metadata columns)
    const excludeColumns = [
        'timestamp',
        'reading_id',
        'factory_id',
        'factory_type',
        'baseline_segment_id',
        'is_baseline',
        'is_violation',
        'violation_reason',
        'ai_violation_score',
        'assigned_employee_id',
        'alert_status'
    ];
    const sensors = numericColumns.filter((col)=>!excludeColumns.includes(col));
    return {
        factories,
        numericColumns,
        violationRate,
        topViolators: violationRates.slice(0, 5),
        thresholds,
        totalRows: data.length,
        dateRange,
        sensors
    };
}
function getColumnRange(data, column) {
    const values = data.map((row)=>row[column]).filter((val)=>typeof val === 'number');
    return {
        min: Math.min(...values),
        max: Math.max(...values)
    };
}
function filterByFactory(data, factoryId) {
    return data.filter((row)=>row.factory_id === factoryId);
}
function getRecentReadings(data, count = 100) {
    return data.sort((a, b)=>{
        const dateA = new Date(a.timestamp).getTime();
        const dateB = new Date(b.timestamp).getTime();
        return dateB - dateA;
    }).slice(0, count);
}
}),
"[project]/src/app/api/csv-info/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET,
    "POST",
    ()=>POST
]);
// app/api/csv-info/route.ts
// Auto-detect CSV structure and metadata
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$csv$2d$reader$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/csv-reader.ts [app-route] (ecmascript)");
;
;
async function GET() {
    try {
        const metadata = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$csv$2d$reader$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getCsvMetadata"])();
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true,
            data: metadata
        });
    } catch (error) {
        console.error('CSV info error:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: false,
            error: 'Failed to read CSV file'
        }, {
            status: 500
        });
    }
}
async function POST(request) {
    try {
        const body = await request.json();
        const { factory_id, limit = 100 } = body;
        let data = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$csv$2d$reader$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["parseCsvFile"])();
        // Filter by factory if specified
        if (factory_id) {
            data = data.filter((row)=>row.factory_id === factory_id);
        }
        // Limit results
        data = data.slice(0, limit);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true,
            data,
            count: data.length
        });
    } catch (error) {
        console.error('CSV data error:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: false,
            error: 'Failed to fetch CSV data'
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__0e2f07d1._.js.map
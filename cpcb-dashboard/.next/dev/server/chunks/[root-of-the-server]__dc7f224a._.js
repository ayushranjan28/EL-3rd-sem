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
"[externals]/child_process [external] (child_process, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("child_process", () => require("child_process"));

module.exports = mod;
}),
"[externals]/util [external] (util, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("util", () => require("util"));

module.exports = mod;
}),
"[externals]/path [external] (path, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("path", () => require("path"));

module.exports = mod;
}),
"[project]/cpcb-dashboard/src/app/api/predict/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "POST",
    ()=>POST
]);
// app/api/predict/route.ts
// Real-time AI violation prediction using trained model
var __TURBOPACK__imported__module__$5b$project$5d2f$cpcb$2d$dashboard$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/cpcb-dashboard/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$child_process__$5b$external$5d$__$28$child_process$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/child_process [external] (child_process, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$util__$5b$external$5d$__$28$util$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/util [external] (util, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/path [external] (path, cjs)");
;
;
;
;
const execAsync = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$util__$5b$external$5d$__$28$util$2c$__cjs$29$__["promisify"])(__TURBOPACK__imported__module__$5b$externals$5d2f$child_process__$5b$external$5d$__$28$child_process$2c$__cjs$29$__["exec"]);
// Fallback prediction function (rule-based)
function fallbackPrediction(sensorData) {
    const violations = [];
    let violationScore = 0;
    // Check thresholds
    if (sensorData.turbidity_ntu > 200) {
        violations.push('turbidity_high');
        violationScore += 0.3;
    }
    if (sensorData.ph < 5.5) {
        violations.push('ph_low');
        violationScore += 0.3;
    } else if (sensorData.ph > 9.0) {
        violations.push('ph_high');
        violationScore += 0.3;
    }
    if (sensorData.chromium_mg_l > 0.1) {
        violations.push('chromium_high');
        violationScore += 0.4;
    }
    if (sensorData.copper_mg_l > 3.0) {
        violations.push('copper_high');
        violationScore += 0.3;
    }
    if (sensorData.tds_mg_l > 2100) {
        violations.push('tds_high');
        violationScore += 0.2;
    }
    if (sensorData.uv_vis_absorbance && sensorData.uv_vis_absorbance > 1.0) {
        violations.push('uv_absorbance_high');
        violationScore += 0.2;
    }
    const isViolation = violations.length > 0;
    const probability = Math.min(violationScore, 1.0);
    let alertLevel;
    if (probability >= 0.8) alertLevel = 'critical';
    else if (probability >= 0.6) alertLevel = 'high';
    else if (probability >= 0.3) alertLevel = 'medium';
    else alertLevel = 'low';
    return {
        is_violation: isViolation,
        violation_probability: probability,
        confidence: 0.85,
        violation_reasons: violations,
        alert_level: alertLevel,
        factory_id: sensorData.factory_id,
        timestamp: new Date().toISOString()
    };
}
async function POST(request) {
    try {
        const sensorData = await request.json();
        // Validate required fields
        const required = [
            'factory_id',
            'factory_type',
            'turbidity_ntu',
            'ph',
            'chromium_mg_l'
        ];
        for (const field of required){
            if (sensorData[field] === undefined) {
                return __TURBOPACK__imported__module__$5b$project$5d2f$cpcb$2d$dashboard$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                    success: false,
                    error: `Missing required field: ${field}`
                }, {
                    status: 400
                });
            }
        }
        // Try Python prediction first
        try {
            const pythonScript = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(process.cwd(), '..', 'predict_pollution.py');
            const dataJson = JSON.stringify(sensorData);
            const { stdout, stderr } = await execAsync(`python "${pythonScript}" --predict '${dataJson.replace(/'/g, "\\'")}'`, {
                cwd: __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].dirname(pythonScript),
                timeout: 5000 // 5 second timeout
            });
            if (stderr && !stderr.includes('FutureWarning') && !stderr.includes('DeprecationWarning')) {
                console.warn('Python stderr:', stderr);
            }
            const prediction = JSON.parse(stdout.trim());
            return __TURBOPACK__imported__module__$5b$project$5d2f$cpcb$2d$dashboard$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: true,
                prediction: {
                    is_violation: prediction.is_violation,
                    violation_probability: prediction.violation_probability,
                    confidence: prediction.confidence,
                    violation_reasons: prediction.violation_reasons,
                    alert_level: prediction.alert_level,
                    factory_id: sensorData.factory_id,
                    timestamp: new Date().toISOString()
                },
                source: 'python_ml_model'
            });
        } catch (pythonError) {
            console.warn('Python prediction failed, using fallback:', pythonError.message);
            // Use fallback prediction
            const prediction = fallbackPrediction(sensorData);
            return __TURBOPACK__imported__module__$5b$project$5d2f$cpcb$2d$dashboard$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: true,
                prediction,
                source: 'fallback_rules',
                note: 'Using rule-based prediction (Python model unavailable)'
            });
        }
    } catch (error) {
        console.error('Prediction error:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$cpcb$2d$dashboard$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: false,
            error: 'Prediction failed',
            details: error.message
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__dc7f224a._.js.map
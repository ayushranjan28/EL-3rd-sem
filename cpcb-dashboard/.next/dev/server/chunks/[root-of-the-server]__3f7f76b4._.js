module.exports = [
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[project]/src/pages/api/socket.ts [api] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$socket$2e$io__$5b$external$5d$__$28$socket$2e$io$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$socket$2e$io$29$__ = __turbopack_context__.i("[externals]/socket.io [external] (socket.io, esm_import, [project]/node_modules/socket.io)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$externals$5d2f$socket$2e$io__$5b$external$5d$__$28$socket$2e$io$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$socket$2e$io$29$__
]);
[__TURBOPACK__imported__module__$5b$externals$5d2f$socket$2e$io__$5b$external$5d$__$28$socket$2e$io$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$socket$2e$io$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
// Global variable to track interval across hot reloads in dev
let interval = null;
const SocketHandler = (req, res)=>{
    if (res.socket.server.io) {
        // Already running
        res.end();
        return;
    }
    console.log("Initializing Socket.io server...");
    const io = new __TURBOPACK__imported__module__$5b$externals$5d2f$socket$2e$io__$5b$external$5d$__$28$socket$2e$io$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$socket$2e$io$29$__["Server"](res.socket.server, {
        path: "/api/socket",
        addTrailingSlash: false
    });
    res.socket.server.io = io;
    io.on("connection", (socket)=>{
        console.log("Client connected:", socket.id);
    });
    // Clear existing interval if any (for dev hot reload safety)
    if (interval) clearInterval(interval);
    // Simulate Industrial Data Stream
    interval = setInterval(()=>{
        const factories = [
            'A',
            'B',
            'C'
        ];
        const payload = factories.map((f)=>({
                factory: f,
                timestamp: new Date().toISOString(),
                // Simulation logic:
                // Factory A: High Turbidity often
                // Factory B: Acidic pH often
                // Factory C: Mostly Normal
                turbidity: f === 'A' ? 180 + Math.random() * 50 : 100 + Math.random() * 50,
                ph: f === 'B' ? 6.0 + Math.random() * 1.5 : 6.8 + Math.random() * 1.0,
                conductivity: 1200 + Math.random() * 300
            }));
        io.emit("sensor-data", payload);
    }, 5000);
    res.end();
};
const __TURBOPACK__default__export__ = SocketHandler;
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__3f7f76b4._.js.map
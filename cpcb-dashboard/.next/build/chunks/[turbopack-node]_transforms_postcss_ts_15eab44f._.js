module.exports = [
"[turbopack-node]/transforms/postcss.ts { CONFIG => \"[project]/cpcb-dashboard/postcss.config.mjs [postcss] (ecmascript)\" } [postcss] (ecmascript, async loader)", ((__turbopack_context__) => {

__turbopack_context__.v((parentImport) => {
    return Promise.all([
  "chunks/dc816_6805f860._.js",
  "chunks/[root-of-the-server]__d50ba43c._.js"
].map((chunk) => __turbopack_context__.l(chunk))).then(() => {
        return parentImport("[turbopack-node]/transforms/postcss.ts { CONFIG => \"[project]/cpcb-dashboard/postcss.config.mjs [postcss] (ecmascript)\" } [postcss] (ecmascript)");
    });
});
}),
];
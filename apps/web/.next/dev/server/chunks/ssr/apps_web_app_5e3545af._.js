module.exports = [
"[project]/apps/web/app/twitter-image.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "alt",
    ()=>alt,
    "contentType",
    ()=>contentType,
    "default",
    ()=>Image,
    "runtime",
    ()=>runtime,
    "size",
    ()=>size
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.6_@babel+core@7.29.0_react-dom@19.2.3_react@19.2.3__react@19.2.3/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$og$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.6_@babel+core@7.29.0_react-dom@19.2.3_react@19.2.3__react@19.2.3/node_modules/next/og.js [app-rsc] (ecmascript)");
;
;
const runtime = "edge";
const alt = "2022 Wizard - Token-2022 Anchor Program Generator";
const size = {
    width: 1200,
    height: 630
};
const contentType = "image/png";
async function loadFont() {
    // Use Inter SemiBold (600) from Google Fonts - reliable TTF source
    const fontResponse = await fetch("https://fonts.gstatic.com/s/inter/v20/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuGKYMZg.ttf");
    return fontResponse.arrayBuffer();
}
const codeLines = [
    {
        content: "use anchor_lang::prelude::*;",
        color: "#f5f5f5"
    },
    {
        content: "use anchor_spl::token_2022::Token2022;",
        color: "#f5f5f5"
    },
    {
        content: "",
        color: ""
    },
    {
        content: 'declare_id!("Wizard22...");',
        color: "#c084fc"
    },
    {
        content: "",
        color: ""
    },
    {
        content: "#[program]",
        color: "#fbbf24"
    },
    {
        content: "pub mod token_wizard {",
        color: "#f472b6"
    },
    {
        content: "    use super::*;",
        color: "#f5f5f5"
    },
    {
        content: "",
        color: ""
    },
    {
        content: "    pub fn initialize_mint(",
        color: "#f472b6"
    },
    {
        content: "        ctx: Context<InitializeMint>,",
        color: "#38bdf8"
    },
    {
        content: "        name: String,",
        color: "#38bdf8"
    },
    {
        content: "        symbol: String,",
        color: "#38bdf8"
    },
    {
        content: "        uri: String,",
        color: "#4ade80"
    },
    {
        content: "    ) -> Result<()> {",
        color: "#f472b6"
    },
    {
        content: "        // Initialize metadata",
        color: "#6b7280"
    },
    {
        content: "        init_metadata(&ctx, name)?;",
        color: "#a78bfa"
    },
    {
        content: "        Ok(())",
        color: "#f472b6"
    },
    {
        content: "    }",
        color: "#f5f5f5"
    },
    {
        content: "}",
        color: "#f5f5f5"
    }
];
// Brand color: oklch(0.55 0.2 25) ≈ #b84a3b
const BRAND_COLOR = "#b84a3b";
const BRAND_GRADIENT = `linear-gradient(135deg, ${BRAND_COLOR}, #c85a4a)`;
// Grid configuration
const SMALL_GRID_SIZE = 20;
const LARGE_GRID_SIZE = 100;
const WIDTH = 1200;
const HEIGHT = 630;
// Generate grid lines as divs (Satori doesn't support CSS gradient backgrounds for grids)
const smallVerticalLines = Array.from({
    length: Math.floor(WIDTH / SMALL_GRID_SIZE) + 1
}, (_, i)=>i * SMALL_GRID_SIZE);
const smallHorizontalLines = Array.from({
    length: Math.floor(HEIGHT / SMALL_GRID_SIZE) + 1
}, (_, i)=>i * SMALL_GRID_SIZE);
const largeVerticalLines = Array.from({
    length: Math.floor(WIDTH / LARGE_GRID_SIZE) + 1
}, (_, i)=>i * LARGE_GRID_SIZE);
const largeHorizontalLines = Array.from({
    length: Math.floor(HEIGHT / LARGE_GRID_SIZE) + 1
}, (_, i)=>i * LARGE_GRID_SIZE);
async function Image() {
    const fontData = await loadFont();
    return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$og$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ImageResponse"](/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#141414",
            padding: "60px",
            gap: "60px",
            position: "relative",
            overflow: "hidden"
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: WIDTH,
                    height: HEIGHT,
                    display: "flex"
                },
                children: [
                    smallVerticalLines.map((x)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                position: "absolute",
                                left: x,
                                top: 0,
                                width: 0,
                                height: HEIGHT,
                                borderLeft: "1px solid rgba(255,255,255,0.015)"
                            }
                        }, `sv-${x}`, false, {
                            fileName: "[project]/apps/web/app/twitter-image.tsx",
                            lineNumber: 104,
                            columnNumber: 13
                        }, this)),
                    smallHorizontalLines.map((y)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                position: "absolute",
                                left: 0,
                                top: y,
                                width: WIDTH,
                                height: 0,
                                borderTop: "1px solid rgba(255,255,255,0.015)"
                            }
                        }, `sh-${y}`, false, {
                            fileName: "[project]/apps/web/app/twitter-image.tsx",
                            lineNumber: 119,
                            columnNumber: 13
                        }, this)),
                    largeVerticalLines.map((x)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                position: "absolute",
                                left: x,
                                top: 0,
                                width: 0,
                                height: HEIGHT,
                                borderLeft: "1px solid rgba(255,255,255,0.035)"
                            }
                        }, `lv-${x}`, false, {
                            fileName: "[project]/apps/web/app/twitter-image.tsx",
                            lineNumber: 134,
                            columnNumber: 13
                        }, this)),
                    largeHorizontalLines.map((y)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                position: "absolute",
                                left: 0,
                                top: y,
                                width: WIDTH,
                                height: 0,
                                borderTop: "1px solid rgba(255,255,255,0.035)"
                            }
                        }, `lh-${y}`, false, {
                            fileName: "[project]/apps/web/app/twitter-image.tsx",
                            lineNumber: 149,
                            columnNumber: 13
                        }, this))
                ]
            }, void 0, true, {
                fileName: "[project]/apps/web/app/twitter-image.tsx",
                lineNumber: 92,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    position: "absolute",
                    top: 8,
                    left: 8,
                    width: 16,
                    height: 16,
                    borderLeft: "1.5px solid rgba(255,255,255,0.2)",
                    borderTop: "1.5px solid rgba(255,255,255,0.2)"
                }
            }, void 0, false, {
                fileName: "[project]/apps/web/app/twitter-image.tsx",
                lineNumber: 164,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                style: {
                    position: "absolute",
                    top: 30,
                    left: 36,
                    fontSize: 10,
                    color: "rgba(255,255,255,0.1)",
                    fontFamily: "sans-serif"
                },
                children: "cm"
            }, void 0, false, {
                fileName: "[project]/apps/web/app/twitter-image.tsx",
                lineNumber: 177,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    justifyContent: "center",
                    flex: 1,
                    zIndex: 10
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "flex-start",
                            lineHeight: 0.85
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                style: {
                                    fontSize: 120,
                                    fontWeight: 600,
                                    fontFamily: "Inter",
                                    color: "#f5f5f5",
                                    letterSpacing: "-0.04em"
                                },
                                children: "2022"
                            }, void 0, false, {
                                fileName: "[project]/apps/web/app/twitter-image.tsx",
                                lineNumber: 210,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                style: {
                                    fontSize: 120,
                                    fontWeight: 600,
                                    fontFamily: "Inter",
                                    background: BRAND_GRADIENT,
                                    backgroundClip: "text",
                                    color: "transparent",
                                    letterSpacing: "-0.04em"
                                },
                                children: "Wizard"
                            }, void 0, false, {
                                fileName: "[project]/apps/web/app/twitter-image.tsx",
                                lineNumber: 221,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/apps/web/app/twitter-image.tsx",
                        lineNumber: 202,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            fontSize: 20,
                            color: "rgba(255,255,255,0.4)",
                            letterSpacing: "0.25em",
                            textTransform: "uppercase",
                            marginTop: "24px"
                        },
                        children: "Anchor Program Generator"
                    }, void 0, false, {
                        fileName: "[project]/apps/web/app/twitter-image.tsx",
                        lineNumber: 237,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            fontSize: 18,
                            color: "rgba(255,255,255,0.5)",
                            maxWidth: "380px",
                            lineHeight: 1.6,
                            marginTop: "16px"
                        },
                        children: "Generate secure, production-ready Token-2022 programs from audited building blocks."
                    }, void 0, false, {
                        fileName: "[project]/apps/web/app/twitter-image.tsx",
                        lineNumber: 250,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                            marginTop: "32px"
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                style: {
                                    color: "rgba(255,255,255,0.4)",
                                    fontSize: 13,
                                    letterSpacing: "0.15em",
                                    textTransform: "uppercase"
                                },
                                children: "by"
                            }, void 0, false, {
                                fileName: "[project]/apps/web/app/twitter-image.tsx",
                                lineNumber: 272,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                width: "130",
                                height: "20",
                                viewBox: "0 0 2386 372",
                                fill: "none",
                                style: {
                                    opacity: 0.6
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                        d: "M1269.55 167.346C1269.55 120.088 1307.66 96.459 1383.89 96.459C1464.07 96.459 1504.15 117.454 1504.15 159.445C1504.15 163.249 1502.91 166.468 1500.42 169.101C1497.94 171.588 1494.72 172.832 1490.77 172.832H1458.07C1447.53 172.832 1438.68 168.443 1431.51 159.664C1424.34 150.739 1410.22 146.277 1389.16 146.277C1360.19 146.277 1345.7 153.3 1345.7 167.346C1345.7 173.929 1351.34 179.416 1362.6 183.805C1374.01 188.195 1387.84 192.072 1404.08 195.437C1420.47 198.656 1436.78 202.825 1453.02 207.946C1469.26 213.067 1483.01 221.26 1494.28 232.526C1505.69 243.645 1511.4 257.764 1511.4 274.882C1511.4 322.14 1471.16 345.769 1390.69 345.769C1310.22 345.769 1269.99 324.847 1269.99 283.003C1269.99 279.052 1271.23 275.833 1273.72 273.346C1276.35 270.713 1279.64 269.396 1283.59 269.396H1316.29C1326.83 269.396 1335.68 273.858 1342.85 282.783C1350.02 291.562 1364.14 295.951 1385.21 295.951C1418.71 295.951 1435.46 288.928 1435.46 274.882C1435.46 268.298 1429.76 262.812 1418.34 258.423C1407.08 254.033 1393.25 250.156 1376.87 246.791C1360.48 243.28 1344.17 239.037 1327.93 234.062C1311.83 228.941 1298.08 220.748 1286.67 209.482C1275.25 198.217 1269.55 184.171 1269.55 167.346Z",
                                        fill: "#EEEEEE"
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/app/twitter-image.tsx",
                                        lineNumber: 290,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                        d: "M1047.42 314.166C1024.59 293.098 1013.18 262.08 1013.18 221.114C1013.18 180.001 1024.59 148.984 1047.42 128.062C1070.24 106.993 1103.02 96.459 1145.74 96.459C1188.61 96.459 1221.45 106.993 1244.28 128.062C1267.1 148.984 1278.51 180.001 1278.51 221.114C1278.51 262.08 1267.1 293.098 1244.28 314.166C1221.45 335.235 1188.61 345.769 1145.74 345.769C1103.02 345.769 1070.24 335.235 1047.42 314.166ZM1102.94 164.054C1093.87 175.905 1089.34 194.852 1089.34 220.894C1089.34 246.937 1093.87 265.958 1102.94 277.955C1112.01 289.952 1126.28 295.951 1145.74 295.951C1165.34 295.951 1179.68 289.952 1188.75 277.955C1197.97 265.958 1202.58 246.937 1202.58 220.894C1202.58 194.852 1197.97 175.905 1188.75 164.054C1179.68 152.203 1165.34 146.277 1145.74 146.277C1126.28 146.277 1112.01 152.203 1102.94 164.054Z",
                                        fill: "#EEEEEE"
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/app/twitter-image.tsx",
                                        lineNumber: 291,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                        d: "M755.936 327.992V114.455C755.936 110.505 757.179 107.286 759.666 104.799C762.3 102.165 765.519 100.848 769.323 100.848H818.482C822.287 100.848 825.432 102.165 827.919 104.799C830.553 107.286 831.87 110.505 831.87 114.455V128.281C857.035 107.066 883.809 96.459 912.193 96.459C940.723 96.459 963.913 105.164 981.763 122.575C999.613 139.84 1008.54 166.321 1008.54 202.021V327.992C1008.54 331.796 1007.22 335.015 1004.59 337.649C1002.1 340.136 998.881 341.38 994.931 341.38H945.99C942.186 341.38 938.968 340.136 936.334 337.649C933.847 335.015 932.603 331.796 932.603 327.992V202.021C932.603 167.053 918.631 149.569 890.686 149.569C872.397 149.569 852.792 160.03 831.87 180.952V327.992C831.87 331.796 830.553 335.015 827.919 337.649C825.432 340.136 822.287 341.38 818.482 341.38H769.323C765.519 341.38 762.3 340.136 759.666 337.649C757.179 335.015 755.936 331.796 755.936 327.992Z",
                                        fill: "#EEEEEE"
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/app/twitter-image.tsx",
                                        lineNumber: 292,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                        d: "M520.197 314.166C497.373 293.098 485.961 262.08 485.961 221.114C485.961 180.001 497.373 148.984 520.197 128.062C543.021 106.993 575.794 96.459 618.517 96.459C661.385 96.459 694.231 106.993 717.055 128.062C739.88 148.984 751.292 180.001 751.292 221.114C751.292 262.08 739.88 293.098 717.055 314.166C694.231 335.235 661.385 345.769 618.517 345.769C575.794 345.769 543.021 335.235 520.197 314.166ZM575.721 164.054C566.65 175.905 562.115 194.852 562.115 220.894C562.115 246.937 566.65 265.958 575.721 277.955C584.792 289.952 599.057 295.951 618.517 295.951C638.122 295.951 652.46 289.952 661.531 277.955C670.749 265.958 675.357 246.937 675.357 220.894C675.357 194.852 670.749 175.905 661.531 164.054C652.46 152.203 638.122 146.277 618.517 146.277C599.057 146.277 584.792 152.203 575.721 164.054Z",
                                        fill: "#EEEEEE"
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/app/twitter-image.tsx",
                                        lineNumber: 293,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                        d: "M483.292 156.592L449.495 155.275C429.743 155.275 410.87 166.102 392.874 187.756V327.992C392.874 331.943 391.557 335.162 388.923 337.649C386.436 340.136 383.29 341.38 379.486 341.38H330.327C326.376 341.38 323.158 340.136 320.67 337.649C318.183 335.162 316.939 331.943 316.939 327.992V114.455C316.939 110.505 318.183 107.286 320.67 104.799C323.304 102.165 326.523 100.848 330.327 100.848H379.486C383.437 100.848 386.656 102.165 389.143 104.799C391.63 107.286 392.874 110.505 392.874 114.455V128.281C407.797 117.454 422.135 109.48 435.888 104.36C449.788 99.0925 467.93 96.459 490.315 96.459C494.265 96.459 497.484 97.7758 499.972 100.409C502.605 102.897 503.922 106.042 503.922 109.846V143.205C503.922 147.155 502.605 150.374 499.972 152.861C497.484 155.348 494.265 156.592 490.315 156.592H483.292Z",
                                        fill: "#EEEEEE"
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/app/twitter-image.tsx",
                                        lineNumber: 294,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                        d: "M325.683 331.723C325.683 338.161 321.879 341.38 314.271 341.38H264.014C258.308 341.38 252.163 339.405 245.579 335.454C238.995 331.358 233.874 326.456 230.217 320.75L191.591 259.52C182.374 244.597 173.083 233.404 163.719 225.942C154.356 218.334 143.09 214.53 129.922 214.53H82.7375V321.189C82.7375 326.895 80.6892 331.723 76.5926 335.674C72.6422 339.478 67.8141 341.38 62.108 341.38H20.849C15.1429 341.38 10.2416 339.331 6.14496 335.235C2.04832 330.992 0 326.017 0 320.311V47.5189C0 41.8128 2.04832 36.8383 6.14496 32.5954C10.2416 28.3524 15.1429 26.231 20.849 26.231H62.108C67.8141 26.231 72.6422 28.3524 76.5926 32.5954C80.6892 36.8383 82.7375 41.8128 82.7375 47.5189V152.642H129.922C142.797 152.642 154.063 149.13 163.719 142.107C173.522 135.085 182.813 123.746 191.591 108.091L225.608 47.5189C233.362 33.4732 243.896 26.3773 257.211 26.231H307.907C314.929 26.231 318.441 29.3034 318.441 35.4484C318.441 38.8135 317.197 42.837 314.71 47.5189L267.086 133.768C260.21 146.35 252.456 156.738 243.823 164.932C235.337 173.125 224.218 178.904 210.465 182.269C220.121 184.317 229.997 190.389 240.092 200.485C250.334 210.58 259.332 221.553 267.086 233.404L321.952 320.75C324.439 324.993 325.683 328.651 325.683 331.723Z",
                                        fill: "#EEEEEE"
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/app/twitter-image.tsx",
                                        lineNumber: 295,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                                        x: "1521.4",
                                        width: "863.709",
                                        height: "372",
                                        rx: "49.94",
                                        fill: "#EEEEEE"
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/app/twitter-image.tsx",
                                        lineNumber: 296,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                        d: "M2323.31 111.09C2330.8 111.09 2335.17 115.46 2335.17 122.951V249.049C2335.17 256.54 2330.8 260.91 2323.31 260.91H2310.35C2310.2 260.91 2310.2 260.91 2310.2 261.066V274.643C2310.2 281.51 2305.83 285.88 2298.96 285.88H2285.38C2285.23 285.88 2285.23 285.88 2285.23 286.036V298.989C2285.23 306.48 2280.86 310.85 2273.37 310.85H2172.86C2165.37 310.85 2160.38 305.856 2160.38 298.365V73.6349C2160.38 66.1439 2165.37 61.1499 2172.86 61.1499H2273.37C2280.86 61.1499 2285.23 65.5197 2285.23 73.0107V85.9639C2285.23 86.1199 2285.23 86.1199 2285.38 86.1199H2298.96C2305.83 86.1199 2310.2 90.4897 2310.2 97.3564V110.934C2310.2 111.09 2310.2 111.09 2310.35 111.09H2323.31ZM2310.2 111.246C2310.2 111.09 2310.2 111.09 2310.04 111.09H2296.46C2289.6 111.09 2285.23 106.72 2285.23 99.8534V86.276C2285.23 86.1199 2285.23 86.1199 2285.07 86.1199H2185.5C2185.35 86.1199 2185.35 86.1199 2185.35 86.276V285.724C2185.35 285.88 2185.35 285.88 2185.5 285.88H2285.07C2285.23 285.88 2285.23 285.88 2285.23 285.724V272.146C2285.23 265.28 2289.6 260.91 2296.46 260.91H2310.04C2310.2 260.91 2310.2 260.91 2310.2 260.754V111.246Z",
                                        fill: "#2C2C2C"
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/app/twitter-image.tsx",
                                        lineNumber: 297,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                        d: "M2138.57 285.88C2146.06 285.88 2150.43 290.25 2150.43 297.741V298.989C2150.43 306.48 2146.06 310.85 2138.57 310.85H2013.09C2005.6 310.85 2000.61 305.856 2000.61 298.365V73.0107C2000.61 65.5197 2004.98 61.1499 2012.47 61.1499H2013.72C2021.21 61.1499 2025.58 65.5197 2025.58 73.0107V285.724C2025.58 285.88 2025.58 285.88 2025.73 285.88H2138.57Z",
                                        fill: "#2C2C2C"
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/app/twitter-image.tsx",
                                        lineNumber: 298,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                        d: "M1978.9 61.1499C1986.39 61.1499 1990.76 65.5197 1990.76 73.0107V298.989C1990.76 306.48 1986.39 310.85 1978.9 310.85H1977.65C1970.16 310.85 1965.79 306.48 1965.79 298.989V73.0107C1965.79 65.5197 1970.16 61.1499 1977.65 61.1499H1978.9Z",
                                        fill: "#2C2C2C"
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/app/twitter-image.tsx",
                                        lineNumber: 299,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                        d: "M1944.07 61.1499C1951.56 61.1499 1955.93 65.5197 1955.93 73.0107V249.049C1955.93 256.54 1951.56 260.91 1944.07 260.91H1931.12C1930.96 260.91 1930.96 260.91 1930.96 261.066V274.643C1930.96 281.51 1926.59 285.88 1919.73 285.88H1906.15C1905.99 285.88 1905.99 285.88 1905.99 286.036V298.989C1905.99 306.48 1901.62 310.85 1894.13 310.85H1842.95C1835.45 310.85 1831.08 306.48 1831.08 298.989V286.036C1831.08 285.88 1831.08 285.88 1830.93 285.88H1817.35C1810.48 285.88 1806.11 281.51 1806.11 274.643V261.066C1806.11 260.91 1806.11 260.91 1805.96 260.91H1793.01C1785.51 260.91 1781.14 256.54 1781.14 249.049V73.0107C1781.14 65.5197 1785.51 61.1499 1793.01 61.1499H1794.25C1801.74 61.1499 1806.11 65.5197 1806.11 73.0107V260.754C1806.11 260.91 1806.11 260.91 1806.27 260.91H1819.85C1826.71 260.91 1831.08 265.28 1831.08 272.146V285.724C1831.08 285.88 1831.08 285.88 1831.24 285.88H1905.84C1905.99 285.88 1905.99 285.88 1905.99 285.724V272.146C1905.99 265.28 1910.36 260.91 1917.23 260.91H1930.81C1930.96 260.91 1930.96 260.91 1930.96 260.754V73.0107C1930.96 65.5197 1935.33 61.1499 1942.83 61.1499H1944.07Z",
                                        fill: "#2C2C2C"
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/app/twitter-image.tsx",
                                        lineNumber: 300,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                        d: "M1746.13 111.246C1746.13 111.09 1746.13 111.09 1745.97 111.09H1732.39C1725.53 111.09 1721.16 106.72 1721.16 99.8534V86.276C1721.16 86.1199 1721.16 86.1199 1721 86.1199H1621.43C1621.28 86.1199 1621.28 86.1199 1621.28 86.276V99.8534C1621.28 106.72 1616.91 111.09 1610.04 111.09H1596.46C1596.31 111.09 1596.31 111.09 1596.31 111.246V260.754C1596.31 260.91 1596.31 260.91 1596.46 260.91H1610.04C1616.91 260.91 1621.28 265.28 1621.28 272.146V285.724C1621.28 285.88 1621.28 285.88 1621.43 285.88H1721C1721.16 285.88 1721.16 285.88 1721.16 285.724V272.771C1721.16 265.28 1725.53 260.91 1733.02 260.91H1745.97C1746.13 260.91 1746.13 260.91 1746.13 260.754V211.126C1746.13 210.97 1746.13 210.97 1745.97 210.97H1683.08C1675.59 210.97 1671.22 206.6 1671.22 199.109V197.861C1671.22 190.37 1675.59 186 1683.08 186H1758.61C1766.1 186 1771.1 190.994 1771.1 198.485V298.989C1771.1 306.48 1766.73 310.85 1759.24 310.85H1757.99C1750.5 310.85 1746.13 306.48 1746.13 298.989V286.036C1746.13 285.88 1746.13 285.88 1745.97 285.88H1721.31C1721.16 285.88 1721.16 285.88 1721.16 286.036V298.989C1721.16 306.48 1716.79 310.85 1709.3 310.85H1633.14C1625.65 310.85 1621.28 306.48 1621.28 298.989V286.036C1621.28 285.88 1621.28 285.88 1621.12 285.88H1607.54C1600.68 285.88 1596.31 281.51 1596.31 274.643V261.066C1596.31 260.91 1596.31 260.91 1596.15 260.91H1583.2C1575.71 260.91 1571.34 256.54 1571.34 249.049V122.951C1571.34 115.46 1575.71 111.09 1583.2 111.09H1596.15C1596.31 111.09 1596.31 111.09 1596.31 110.934V97.3564C1596.31 90.4897 1600.68 86.1199 1607.54 86.1199H1621.12C1621.28 86.1199 1621.28 86.1199 1621.28 85.9639V73.0107C1621.28 65.5197 1625.65 61.1499 1633.14 61.1499H1709.3C1716.79 61.1499 1721.16 65.5197 1721.16 73.0107V85.9639C1721.16 86.1199 1721.16 86.1199 1721.31 86.1199H1734.89C1741.76 86.1199 1746.13 90.4897 1746.13 97.3564V110.934C1746.13 111.09 1746.13 111.09 1746.28 111.09H1759.86C1766.73 111.09 1771.1 115.46 1771.1 122.326V124.823C1771.1 131.69 1766.73 136.06 1759.86 136.06H1757.99C1750.5 136.06 1746.13 131.69 1746.13 124.199V111.246Z",
                                        fill: "#2C2C2C"
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/app/twitter-image.tsx",
                                        lineNumber: 301,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/apps/web/app/twitter-image.tsx",
                                lineNumber: 283,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/apps/web/app/twitter-image.tsx",
                        lineNumber: 264,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/apps/web/app/twitter-image.tsx",
                lineNumber: 191,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    display: "flex",
                    flexDirection: "column",
                    width: "520px",
                    backgroundColor: "rgba(255,255,255,0.03)",
                    borderRadius: "16px",
                    border: "1px solid rgba(255,255,255,0.1)",
                    overflow: "hidden",
                    zIndex: 10
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            padding: "12px 16px",
                            borderBottom: "1px solid rgba(255,255,255,0.1)",
                            backgroundColor: "rgba(255,255,255,0.02)"
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "8px"
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            display: "flex",
                                            gap: "6px"
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    width: "10px",
                                                    height: "10px",
                                                    borderRadius: "50%",
                                                    backgroundColor: "rgba(239,68,68,0.6)"
                                                }
                                            }, void 0, false, {
                                                fileName: "[project]/apps/web/app/twitter-image.tsx",
                                                lineNumber: 337,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    width: "10px",
                                                    height: "10px",
                                                    borderRadius: "50%",
                                                    backgroundColor: "rgba(234,179,8,0.6)"
                                                }
                                            }, void 0, false, {
                                                fileName: "[project]/apps/web/app/twitter-image.tsx",
                                                lineNumber: 345,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    width: "10px",
                                                    height: "10px",
                                                    borderRadius: "50%",
                                                    backgroundColor: "rgba(34,197,94,0.6)"
                                                }
                                            }, void 0, false, {
                                                fileName: "[project]/apps/web/app/twitter-image.tsx",
                                                lineNumber: 353,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/apps/web/app/twitter-image.tsx",
                                        lineNumber: 331,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        style: {
                                            marginLeft: "8px",
                                            fontSize: "12px",
                                            color: "rgba(255,255,255,0.4)",
                                            fontFamily: "monospace"
                                        },
                                        children: "lib.rs"
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/app/twitter-image.tsx",
                                        lineNumber: 362,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/apps/web/app/twitter-image.tsx",
                                lineNumber: 330,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                style: {
                                    fontSize: "11px",
                                    color: "rgba(255,255,255,0.5)",
                                    backgroundColor: "rgba(255,255,255,0.05)",
                                    padding: "4px 10px",
                                    borderRadius: "20px"
                                },
                                children: "+ Metadata"
                            }, void 0, false, {
                                fileName: "[project]/apps/web/app/twitter-image.tsx",
                                lineNumber: 373,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/apps/web/app/twitter-image.tsx",
                        lineNumber: 320,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: "flex",
                            flexDirection: "column",
                            padding: "16px",
                            fontFamily: "monospace",
                            fontSize: "11px",
                            lineHeight: 1.6
                        },
                        children: codeLines.map((line, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    display: "flex",
                                    color: line.color || "transparent",
                                    whiteSpace: "pre"
                                },
                                children: line.content || " "
                            }, i, false, {
                                fileName: "[project]/apps/web/app/twitter-image.tsx",
                                lineNumber: 398,
                                columnNumber: 15
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/apps/web/app/twitter-image.tsx",
                        lineNumber: 387,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/apps/web/app/twitter-image.tsx",
                lineNumber: 307,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/apps/web/app/twitter-image.tsx",
        lineNumber: 76,
        columnNumber: 7
    }, this), {
        ...size,
        fonts: [
            {
                name: "Inter",
                data: fontData,
                style: "normal",
                weight: 600
            }
        ]
    });
}
}),
"[project]/apps/web/app/twitter-image--metadata.js [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$app$2f$twitter$2d$image$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/app/twitter-image.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$lib$2f$metadata$2f$get$2d$metadata$2d$route$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.6_@babel+core@7.29.0_react-dom@19.2.3_react@19.2.3__react@19.2.3/node_modules/next/dist/lib/metadata/get-metadata-route.js [app-rsc] (ecmascript)");
;
;
const imageModule = {
    alt: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$app$2f$twitter$2d$image$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["alt"],
    contentType: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$app$2f$twitter$2d$image$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["contentType"],
    runtime: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$app$2f$twitter$2d$image$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["runtime"],
    size: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$app$2f$twitter$2d$image$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["size"]
};
async function __TURBOPACK__default__export__(props) {
    const { __metadata_id__: _, ...params } = await props.params;
    const imageUrl = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$lib$2f$metadata$2f$get$2d$metadata$2d$route$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["fillMetadataSegment"])("/", params, "twitter-image");
    function getImageMetadata(imageMetadata, idParam) {
        const data = {
            alt: imageMetadata.alt,
            type: imageMetadata.contentType || 'image/png',
            url: imageUrl + (idParam ? '/' + idParam : '') + "?dacfab4a25ff9c51"
        };
        const { size } = imageMetadata;
        if (size) {
            data.width = size.width;
            data.height = size.height;
        }
        return data;
    }
    return [
        getImageMetadata(imageModule, '')
    ];
}
}),
];

//# sourceMappingURL=apps_web_app_5e3545af._.js.map
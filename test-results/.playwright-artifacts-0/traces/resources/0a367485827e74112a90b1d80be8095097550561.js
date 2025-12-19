;!function(){try { var e="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof global?global:"undefined"!=typeof window?window:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&((e._debugIds|| (e._debugIds={}))[n]="f8ade18b-51c5-b160-61d5-01a40bbbb8ea")}catch(e){}}();
(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/lib/ui-mode.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * UI Mode Configuration
 * 
 * Reads NEXT_PUBLIC_UI_MODE environment variable to control app-wide UI state
 * for visual regression testing.
 * 
 * Modes:
 * - "suspense": Force all pages to show loading/suspense states
 * - "empty": Force all pages to show empty states (no contacts)
 * - "normal": Use real data (default)
 * 
 * If the variable is missing, commented out, or empty, defaults to "normal"
 */ __turbopack_context__.s([
    "getUIMode",
    ()=>getUIMode
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
function getUIMode() {
    const envValue = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.NEXT_PUBLIC_UI_MODE;
    // If undefined, empty string, or whitespace-only, default to "normal"
    if (!envValue || envValue.trim() === "") {
        return "normal";
    }
    const normalizedValue = envValue.trim().toLowerCase();
    // Validate and return the mode
    if (normalizedValue === "suspense" || normalizedValue === "empty" || normalizedValue === "normal") {
        return normalizedValue;
    }
    // Invalid value - warn and default to "normal"
    if ("TURBOPACK compile-time truthy", 1) {
        console.warn(`Invalid NEXT_PUBLIC_UI_MODE value: "${envValue}". ` + `Valid values are: "suspense", "empty", "normal". Defaulting to "normal".`);
    }
    return "normal";
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/hooks/useContacts.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useContacts",
    ()=>useContacts
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tanstack/react-query/build/modern/useQuery.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$ui$2d$mode$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/ui-mode.ts [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
function useContacts(userId, initialData) {
    _s();
    const query = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: [
            "contacts",
            userId
        ],
        queryFn: {
            "useContacts.useQuery[query]": async ()=>{
                // Force no-store to ensure fresh data from API (which also uses no-store)
                const response = await fetch("/api/contacts", {
                    cache: "no-store"
                });
                if (!response.ok) {
                    const errorData = await response.json().catch({
                        "useContacts.useQuery[query]": ()=>({})
                    }["useContacts.useQuery[query]"]);
                    throw new Error(errorData.error || "Failed to fetch contacts");
                }
                const data = await response.json();
                return data.contacts;
            }
        }["useContacts.useQuery[query]"],
        enabled: !!userId,
        staleTime: 0,
        refetchOnMount: true,
        refetchOnWindowFocus: true,
        // ONLY use initialData for SSR - do NOT use placeholderData
        // placeholderData was preventing React Query from recognizing fresh data
        initialData
    });
    const uiMode = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$ui$2d$mode$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getUIMode"])();
    // Override query result based on UI mode
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "useContacts.useMemo": ()=>{
            if (uiMode === "suspense") {
                return {
                    ...query,
                    data: undefined,
                    isLoading: true
                };
            }
            if (uiMode === "empty") {
                return {
                    ...query,
                    data: [],
                    isLoading: false
                };
            }
            return query;
        }
    }["useContacts.useMemo"], [
        query,
        uiMode
    ]);
}
_s(useContacts, "omorBNG7LLjf0qbKIPbzemu3vGA=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"]
    ];
});
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/hooks/useDashboardStats.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useDashboardStats",
    ()=>useDashboardStats
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tanstack/react-query/build/modern/useQuery.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$ui$2d$mode$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/ui-mode.ts [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
/**
 * Empty dashboard stats object for UI mode testing
 */ const emptyDashboardStats = {
    totalContacts: 0,
    contactsWithEmail: 0,
    contactsWithThreads: 0,
    averageEngagementScore: 0,
    segmentDistribution: {},
    leadSourceDistribution: {},
    tagDistribution: {},
    sentimentDistribution: {},
    engagementLevels: {
        high: 0,
        medium: 0,
        low: 0,
        none: 0
    },
    upcomingTouchpoints: 0
};
function useDashboardStats(userId, initialData) {
    _s();
    const query = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: [
            "dashboard-stats",
            userId
        ],
        queryFn: {
            "useDashboardStats.useQuery[query]": async ()=>{
                const response = await fetch("/api/dashboard-stats");
                if (!response.ok) {
                    const errorData = await response.json().catch({
                        "useDashboardStats.useQuery[query]": ()=>({})
                    }["useDashboardStats.useQuery[query]"]);
                    throw new Error(errorData.error || "Failed to fetch dashboard stats");
                }
                const data = await response.json();
                return data.stats;
            }
        }["useDashboardStats.useQuery[query]"],
        enabled: !!userId,
        initialData
    });
    const uiMode = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$ui$2d$mode$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getUIMode"])();
    // Override query result based on UI mode
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "useDashboardStats.useMemo": ()=>{
            if (uiMode === "suspense") {
                return {
                    ...query,
                    data: undefined,
                    isLoading: true
                };
            }
            if (uiMode === "empty") {
                return {
                    ...query,
                    data: emptyDashboardStats,
                    isLoading: false
                };
            }
            return query;
        }
    }["useDashboardStats.useMemo"], [
        query,
        uiMode
    ]);
}
_s(useDashboardStats, "omorBNG7LLjf0qbKIPbzemu3vGA=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"]
    ];
});
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/util/date-utils-server.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "computeIsOverdue",
    ()=>computeIsOverdue,
    "getDateCategory",
    ()=>getDateCategory,
    "getDaysUntilTouchpoint",
    ()=>getDaysUntilTouchpoint
]);
function computeIsOverdue(actionItem, serverTime) {
    if (actionItem.status !== "pending" || !actionItem.dueDate) {
        return false;
    }
    const dueDate = actionItem.dueDate;
    let date = null;
    if (dueDate instanceof Date) {
        date = dueDate;
    } else if (typeof dueDate === "string") {
        date = new Date(dueDate);
        if (isNaN(date.getTime())) {
            return false;
        }
    } else if (typeof dueDate === "object" && "toDate" in dueDate) {
        date = dueDate.toDate();
    } else if (typeof dueDate === "object" && "toMillis" in dueDate) {
        date = new Date(dueDate.toMillis());
    }
    return date ? date < serverTime : false;
}
function getDateCategory(dueDate, serverTime) {
    if (!dueDate) return "upcoming";
    let date = null;
    if (dueDate instanceof Date) {
        date = dueDate;
    } else if (typeof dueDate === "string") {
        // Handle ISO date strings (with or without time)
        const dateStr = dueDate.split("T")[0]; // Get just the date part
        date = new Date(dateStr + "T00:00:00"); // Add time to avoid timezone issues
        if (isNaN(date.getTime())) {
            return "upcoming";
        }
    } else if (typeof dueDate === "object" && "toDate" in dueDate) {
        date = dueDate.toDate();
    } else if (typeof dueDate === "object" && "toMillis" in dueDate) {
        date = new Date(dueDate.toMillis());
    } else {
        return "upcoming";
    }
    if (!date) return "upcoming";
    // Normalize to midnight for date comparison
    const today = new Date(serverTime.getFullYear(), serverTime.getMonth(), serverTime.getDate());
    const due = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    // Compare dates (ignoring time)
    if (due < today) return "overdue";
    if (due.getTime() === today.getTime()) return "today";
    const daysDiff = Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    if (daysDiff <= 7) return "thisWeek";
    return "upcoming";
}
function getDaysUntilTouchpoint(touchpointDate, serverTime) {
    if (!touchpointDate) return null;
    let date = null;
    if (touchpointDate instanceof Date) {
        date = touchpointDate;
    } else if (typeof touchpointDate === "string") {
        date = new Date(touchpointDate);
        if (isNaN(date.getTime())) {
            return null;
        }
    } else if (typeof touchpointDate === "object" && "toDate" in touchpointDate) {
        date = touchpointDate.toDate();
    } else if (typeof touchpointDate === "object" && "toMillis" in touchpointDate) {
        date = new Date(touchpointDate.toMillis());
    }
    if (!date) return null;
    const diffMs = date.getTime() - serverTime.getTime();
    return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/ThemedSuspense.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ThemedSuspense,
    "getThemedFallback",
    ()=>getThemedFallback
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
"use client";
;
;
function getThemedFallback(variant = "default") {
    switch(variant){
        case "simple":
            // Simple bar skeleton for small content
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "h-8 w-16 bg-theme-light rounded animate-pulse"
            }, void 0, false, {
                fileName: "[project]/components/ThemedSuspense.tsx",
                lineNumber: 20,
                columnNumber: 9
            }, this);
        case "card":
            // Single card skeleton
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "bg-card-highlight-light rounded-xl shadow p-4 animate-pulse",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center gap-4",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "w-12 h-12 bg-theme-light rounded-full shrink-0"
                        }, void 0, false, {
                            fileName: "[project]/components/ThemedSuspense.tsx",
                            lineNumber: 28,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex-1 space-y-2",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "h-5 bg-theme-light rounded w-2/3"
                                }, void 0, false, {
                                    fileName: "[project]/components/ThemedSuspense.tsx",
                                    lineNumber: 30,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "h-4 bg-theme-light rounded w-1/2"
                                }, void 0, false, {
                                    fileName: "[project]/components/ThemedSuspense.tsx",
                                    lineNumber: 31,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/ThemedSuspense.tsx",
                            lineNumber: 29,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/ThemedSuspense.tsx",
                    lineNumber: 27,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/ThemedSuspense.tsx",
                lineNumber: 26,
                columnNumber: 9
            }, this);
        case "list":
            // List skeleton without card wrapper
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "space-y-3",
                children: Array.from({
                    length: 3
                }).map((_, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-4 p-4 bg-card-highlight-light rounded-sm animate-pulse",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "w-12 h-12 bg-theme-light rounded-full shrink-0"
                            }, void 0, false, {
                                fileName: "[project]/components/ThemedSuspense.tsx",
                                lineNumber: 43,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex-1 space-y-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "h-5 bg-theme-light rounded w-2/3"
                                    }, void 0, false, {
                                        fileName: "[project]/components/ThemedSuspense.tsx",
                                        lineNumber: 45,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "h-4 bg-theme-light rounded w-1/2"
                                    }, void 0, false, {
                                        fileName: "[project]/components/ThemedSuspense.tsx",
                                        lineNumber: 46,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/ThemedSuspense.tsx",
                                lineNumber: 44,
                                columnNumber: 15
                            }, this)
                        ]
                    }, i, true, {
                        fileName: "[project]/components/ThemedSuspense.tsx",
                        lineNumber: 42,
                        columnNumber: 13
                    }, this))
            }, void 0, false, {
                fileName: "[project]/components/ThemedSuspense.tsx",
                lineNumber: 40,
                columnNumber: 9
            }, this);
        case "dashboard":
            // Dashboard loading skeleton
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "space-y-6",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "grid grid-cols-1 xl:grid-cols-[1fr_340px] gap-6",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "space-y-6",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "bg-card-highlight-light rounded-xl shadow p-6 animate-pulse",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "h-6 bg-theme-light rounded w-40 mb-4"
                                    }, void 0, false, {
                                        fileName: "[project]/components/ThemedSuspense.tsx",
                                        lineNumber: 60,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "space-y-3",
                                        children: Array.from({
                                            length: 3
                                        }).map((_, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center gap-4",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "w-12 h-12 bg-theme-light rounded-full shrink-0"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/ThemedSuspense.tsx",
                                                        lineNumber: 64,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex-1 space-y-2",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "h-5 bg-theme-light rounded w-2/3"
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/ThemedSuspense.tsx",
                                                                lineNumber: 66,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "h-4 bg-theme-light rounded w-1/2"
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/ThemedSuspense.tsx",
                                                                lineNumber: 67,
                                                                columnNumber: 25
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/components/ThemedSuspense.tsx",
                                                        lineNumber: 65,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, i, true, {
                                                fileName: "[project]/components/ThemedSuspense.tsx",
                                                lineNumber: 63,
                                                columnNumber: 21
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/components/ThemedSuspense.tsx",
                                        lineNumber: 61,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/ThemedSuspense.tsx",
                                lineNumber: 59,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/components/ThemedSuspense.tsx",
                            lineNumber: 58,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "space-y-6",
                            children: Array.from({
                                length: 4
                            }).map((_, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "bg-card-highlight-light rounded-xl shadow p-6 animate-pulse",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "h-6 bg-theme-light rounded w-32 mb-4"
                                        }, void 0, false, {
                                            fileName: "[project]/components/ThemedSuspense.tsx",
                                            lineNumber: 77,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "h-32 bg-theme-light rounded"
                                        }, void 0, false, {
                                            fileName: "[project]/components/ThemedSuspense.tsx",
                                            lineNumber: 78,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, i, true, {
                                    fileName: "[project]/components/ThemedSuspense.tsx",
                                    lineNumber: 76,
                                    columnNumber: 17
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/components/ThemedSuspense.tsx",
                            lineNumber: 74,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/ThemedSuspense.tsx",
                    lineNumber: 57,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/ThemedSuspense.tsx",
                lineNumber: 56,
                columnNumber: 9
            }, this);
        case "page":
            // Full page loading skeleton
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "space-y-8",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex justify-end",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "h-10 w-24 bg-theme-light rounded animate-pulse"
                        }, void 0, false, {
                            fileName: "[project]/components/ThemedSuspense.tsx",
                            lineNumber: 91,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/components/ThemedSuspense.tsx",
                        lineNumber: 90,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "space-y-8",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "bg-card-highlight-light rounded-xl shadow p-6 animate-pulse",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "h-6 bg-theme-light rounded w-32 mb-4"
                                    }, void 0, false, {
                                        fileName: "[project]/components/ThemedSuspense.tsx",
                                        lineNumber: 95,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "h-32 bg-theme-light rounded"
                                    }, void 0, false, {
                                        fileName: "[project]/components/ThemedSuspense.tsx",
                                        lineNumber: 96,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/ThemedSuspense.tsx",
                                lineNumber: 94,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "bg-card-highlight-light rounded-xl shadow p-6 animate-pulse",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "h-6 bg-theme-light rounded w-32 mb-4"
                                    }, void 0, false, {
                                        fileName: "[project]/components/ThemedSuspense.tsx",
                                        lineNumber: 99,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "h-64 bg-theme-light rounded"
                                    }, void 0, false, {
                                        fileName: "[project]/components/ThemedSuspense.tsx",
                                        lineNumber: 100,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/ThemedSuspense.tsx",
                                lineNumber: 98,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/ThemedSuspense.tsx",
                        lineNumber: 93,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/ThemedSuspense.tsx",
                lineNumber: 89,
                columnNumber: 9
            }, this);
        case "sync":
            // Sync page loading skeleton
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "space-y-8",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex justify-end",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "h-10 w-24 bg-theme-light rounded animate-pulse"
                        }, void 0, false, {
                            fileName: "[project]/components/ThemedSuspense.tsx",
                            lineNumber: 111,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/components/ThemedSuspense.tsx",
                        lineNumber: 110,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "space-y-8",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "bg-card-highlight-light rounded-xl shadow p-6 animate-pulse",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "h-6 bg-theme-light rounded w-32 mb-4"
                                    }, void 0, false, {
                                        fileName: "[project]/components/ThemedSuspense.tsx",
                                        lineNumber: 115,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "h-32 bg-theme-light rounded"
                                    }, void 0, false, {
                                        fileName: "[project]/components/ThemedSuspense.tsx",
                                        lineNumber: 116,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/ThemedSuspense.tsx",
                                lineNumber: 114,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "bg-card-highlight-light rounded-xl shadow p-6 animate-pulse",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "h-6 bg-theme-light rounded w-32 mb-4"
                                    }, void 0, false, {
                                        fileName: "[project]/components/ThemedSuspense.tsx",
                                        lineNumber: 119,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "h-64 bg-theme-light rounded"
                                    }, void 0, false, {
                                        fileName: "[project]/components/ThemedSuspense.tsx",
                                        lineNumber: 120,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/ThemedSuspense.tsx",
                                lineNumber: 118,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/ThemedSuspense.tsx",
                        lineNumber: 113,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/ThemedSuspense.tsx",
                lineNumber: 109,
                columnNumber: 9
            }, this);
        case "default":
        default:
            // Card-based list skeleton (default)
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "space-y-3",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "h-6 bg-card-highlight-light rounded w-32 mb-2 animate-pulse"
                    }, void 0, false, {
                        fileName: "[project]/components/ThemedSuspense.tsx",
                        lineNumber: 131,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "grid grid-cols-1 gap-3",
                        children: Array.from({
                            length: 5
                        }).map((_, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "bg-card-highlight-light rounded-xl shadow p-4 animate-pulse",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center gap-4",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "w-12 h-12 bg-theme-light rounded-full shrink-0"
                                        }, void 0, false, {
                                            fileName: "[project]/components/ThemedSuspense.tsx",
                                            lineNumber: 136,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex-1 space-y-2",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "h-5 bg-theme-light rounded w-2/3"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/ThemedSuspense.tsx",
                                                    lineNumber: 138,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "h-4 bg-theme-light rounded w-1/2"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/ThemedSuspense.tsx",
                                                    lineNumber: 139,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/ThemedSuspense.tsx",
                                            lineNumber: 137,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/ThemedSuspense.tsx",
                                    lineNumber: 135,
                                    columnNumber: 17
                                }, this)
                            }, i, false, {
                                fileName: "[project]/components/ThemedSuspense.tsx",
                                lineNumber: 134,
                                columnNumber: 15
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/components/ThemedSuspense.tsx",
                        lineNumber: 132,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/ThemedSuspense.tsx",
                lineNumber: 130,
                columnNumber: 9
            }, this);
    }
}
function ThemedSuspense({ children, fallback, variant = "default", isLoading = false }) {
    // If isLoading is true, show fallback immediately (for conditional rendering)
    if (isLoading) {
        if (fallback !== undefined) {
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                children: fallback
            }, void 0, false);
        }
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
            children: getThemedFallback(variant)
        }, void 0, false);
    }
    // For Suspense mode, children is required
    if (!children) {
        return null;
    }
    // If custom fallback provided, use it
    if (fallback !== undefined) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Suspense"], {
            fallback: fallback,
            children: children
        }, void 0, false, {
            fileName: "[project]/components/ThemedSuspense.tsx",
            lineNumber: 186,
            columnNumber: 12
        }, this);
    }
    // Use themed fallback based on variant
    const defaultFallback = getThemedFallback(variant);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Suspense"], {
        fallback: defaultFallback,
        children: children
    }, void 0, false, {
        fileName: "[project]/components/ThemedSuspense.tsx",
        lineNumber: 191,
        columnNumber: 10
    }, this);
}
_c = ThemedSuspense;
var _c;
__turbopack_context__.k.register(_c, "ThemedSuspense");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/Card.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Card
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
;
function Card({ children, className = "", padding = "md", hover = false }) {
    const paddingClasses = {
        none: "",
        sm: "p-3",
        md: "p-6",
        lg: "p-8",
        xl: "p-12",
        responsive: "p-3 xl:p-6"
    };
    const baseClasses = "bg-card-light rounded-sm shadow-sm border border-theme-lighter";
    const paddingClass = padding === "none" || className.includes("p-") ? "" : paddingClasses[padding];
    const hoverClasses = hover ? "hover:shadow-[0px_6px_16px_rgba(0,0,0,0.15)] transition-shadow duration-200" : "";
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: `${baseClasses} ${paddingClass} ${hoverClasses} ${className}`.trim(),
        children: children
    }, void 0, false, {
        fileName: "[project]/components/Card.tsx",
        lineNumber: 30,
        columnNumber: 5
    }, this);
}
_c = Card;
var _c;
__turbopack_context__.k.register(_c, "Card");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/util/contact-utils.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "formatContactDate",
    ()=>formatContactDate,
    "getDisplayName",
    ()=>getDisplayName,
    "getInitials",
    ()=>getInitials
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$firebase$2f$firestore$2f$dist$2f$esm$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/firebase/firestore/dist/esm/index.esm.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@firebase/firestore/dist/index.esm.js [app-client] (ecmascript)");
;
function getInitials(contact) {
    if (contact.firstName && contact.lastName) {
        return `${contact.firstName[0]}${contact.lastName[0]}`.toUpperCase();
    }
    if (contact.firstName) {
        return contact.firstName[0].toUpperCase();
    }
    if (contact.primaryEmail) {
        return contact.primaryEmail[0].toUpperCase();
    }
    return "?";
}
function getDisplayName(contact) {
    if (contact.firstName || contact.lastName) {
        return `${contact.firstName || ""} ${contact.lastName || ""}`.trim();
    }
    if (contact.company) {
        return contact.company;
    }
    return contact.primaryEmail;
}
function formatContactDate(date, options) {
    if (!date) return "N/A";
    let dateObj = null;
    // Handle ISO date strings (from API - timestamps converted to ISO strings)
    if (typeof date === "string") {
        dateObj = new Date(date);
        if (isNaN(dateObj.getTime())) {
            return "N/A";
        }
    } else if (date instanceof __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Timestamp"] || typeof date === "object" && date !== null && "toDate" in date) {
        dateObj = date.toDate();
    } else if (typeof date === "object" && date !== null && "seconds" in date && "nanoseconds" in date) {
        const timestamp = date;
        dateObj = new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000);
    } else if (typeof date === "object" && date !== null && "_seconds" in date && "_nanoseconds" in date) {
        const timestamp = date;
        dateObj = new Date(timestamp._seconds * 1000 + timestamp._nanoseconds / 1000000);
    } else if (date instanceof Date) {
        dateObj = date;
    } else if (typeof date === "number") {
        dateObj = new Date(date);
        if (isNaN(dateObj.getTime())) {
            return "N/A";
        }
    }
    if (!dateObj) return "N/A";
    // Relative time option (handles both past and future dates)
    if (options?.relative) {
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const dateToCompare = new Date(dateObj.getFullYear(), dateObj.getMonth(), dateObj.getDate());
        // Calculate difference in calendar days (positive = past, negative = future)
        const diffMs = today.getTime() - dateToCompare.getTime();
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        // Handle future dates (negative diffDays)
        if (diffDays < 0) {
            const absDays = Math.abs(diffDays);
            if (absDays === 0) {
                return "Today";
            } else if (absDays === 1) {
                return "Tomorrow";
            } else if (absDays < 7) {
                return `in ${absDays} days`;
            } else if (absDays < 30) {
                const weeks = Math.floor(absDays / 7);
                return `in ${weeks} ${weeks === 1 ? "week" : "weeks"}`;
            } else if (absDays < 365) {
                const months = Math.floor(absDays / 30);
                return `in ${months} ${months === 1 ? "month" : "months"}`;
            } else {
                const years = Math.floor(absDays / 365);
                return `in ${years} ${years === 1 ? "year" : "years"}`;
            }
        }
        // Handle past dates (positive diffDays)
        if (diffDays === 0) {
            return "Today";
        } else if (diffDays === 1) {
            return "Yesterday";
        } else if (diffDays < 7) {
            return `${diffDays} days ago`;
        } else if (diffDays < 30) {
            const weeks = Math.floor(diffDays / 7);
            return `${weeks} ${weeks === 1 ? "week" : "weeks"} ago`;
        } else if (diffDays < 365) {
            const months = Math.floor(diffDays / 30);
            return `${months} ${months === 1 ? "month" : "months"} ago`;
        } else {
            const years = Math.floor(diffDays / 365);
            return `${years} ${years === 1 ? "year" : "years"} ago`;
        }
    }
    // Standard formatting
    if (options?.includeTime) {
        return dateObj.toLocaleString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "numeric",
            minute: "2-digit"
        });
    }
    return dateObj.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric"
    });
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/Modal.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Modal
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2d$dom$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react-dom/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
function Modal({ isOpen, onClose, children, title, showBackdrop = true, closeOnBackdropClick = true, maxWidth = "md", className = "" }) {
    _s();
    const maxWidthClasses = {
        sm: "max-w-sm",
        md: "max-w-md",
        lg: "max-w-lg",
        xl: "max-w-xl",
        "2xl": "max-w-2xl",
        "4xl": "max-w-4xl",
        "5xl": "max-w-5xl"
    };
    const modalRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const titleId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useId"])();
    const previousActiveElementRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    // Get all focusable elements within the modal
    const getFocusableElements = ()=>{
        if (!modalRef.current) return [];
        const focusableSelectors = [
            'a[href]',
            'button:not([disabled])',
            'textarea:not([disabled])',
            'input:not([disabled])',
            'select:not([disabled])',
            '[tabindex]:not([tabindex="-1"])'
        ].join(', ');
        return Array.from(modalRef.current.querySelectorAll(focusableSelectors));
    };
    // Focus trap: keep focus within modal
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Modal.useEffect": ()=>{
            if (!isOpen || !modalRef.current) return;
            const handleTabKey = {
                "Modal.useEffect.handleTabKey": (e)=>{
                    if (e.key !== 'Tab') return;
                    const focusableElements = getFocusableElements();
                    if (focusableElements.length === 0) return;
                    const firstElement = focusableElements[0];
                    const lastElement = focusableElements[focusableElements.length - 1];
                    if (e.shiftKey) {
                        // Shift + Tab
                        if (document.activeElement === firstElement) {
                            e.preventDefault();
                            lastElement.focus();
                        }
                    } else {
                        // Tab
                        if (document.activeElement === lastElement) {
                            e.preventDefault();
                            firstElement.focus();
                        }
                    }
                }
            }["Modal.useEffect.handleTabKey"];
            document.addEventListener('keydown', handleTabKey);
            return ({
                "Modal.useEffect": ()=>{
                    document.removeEventListener('keydown', handleTabKey);
                }
            })["Modal.useEffect"];
        }
    }["Modal.useEffect"], [
        isOpen
    ]);
    // Handle escape key
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Modal.useEffect": ()=>{
            if (!isOpen) return;
            const handleEscape = {
                "Modal.useEffect.handleEscape": (e)=>{
                    if (e.key === "Escape") {
                        onClose();
                    }
                }
            }["Modal.useEffect.handleEscape"];
            document.addEventListener("keydown", handleEscape);
            return ({
                "Modal.useEffect": ()=>{
                    document.removeEventListener("keydown", handleEscape);
                }
            })["Modal.useEffect"];
        }
    }["Modal.useEffect"], [
        isOpen,
        onClose
    ]);
    // Focus management: move focus to modal on open, return on close
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Modal.useEffect": ()=>{
            if (isOpen) {
                // Store the previously focused element
                previousActiveElementRef.current = document.activeElement;
                // Move focus to modal after a brief delay to ensure it's rendered
                // Skip inputs that have data-no-autofocus attribute
                setTimeout({
                    "Modal.useEffect": ()=>{
                        const focusableElements = getFocusableElements().filter({
                            "Modal.useEffect.focusableElements": (el)=>!el.hasAttribute('data-no-autofocus')
                        }["Modal.useEffect.focusableElements"]);
                        if (focusableElements.length > 0) {
                            focusableElements[0].focus();
                        } else if (modalRef.current) {
                            modalRef.current.focus();
                        }
                    }
                }["Modal.useEffect"], 0);
            } else {
                // Return focus to the previously focused element
                if (previousActiveElementRef.current) {
                    previousActiveElementRef.current.focus();
                    previousActiveElementRef.current = null;
                }
            }
        }
    }["Modal.useEffect"], [
        isOpen
    ]);
    // Prevent body scroll when modal is open
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Modal.useEffect": ()=>{
            if (isOpen) {
                document.body.style.overflow = "hidden";
            } else {
                document.body.style.overflow = "";
            }
            return ({
                "Modal.useEffect": ()=>{
                    document.body.style.overflow = "";
                }
            })["Modal.useEffect"];
        }
    }["Modal.useEffect"], [
        isOpen
    ]);
    if (!isOpen) return null;
    const handleBackdropClick = (e)=>{
        if (closeOnBackdropClick && e.target === e.currentTarget) {
            onClose();
        }
    };
    const modalContent = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "fixed inset-0 z-200 flex items-center justify-center",
        onClick: handleBackdropClick,
        role: "presentation",
        children: [
            showBackdrop && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "absolute inset-0 bg-black/20 dark:bg-black/40",
                "aria-hidden": "true"
            }, void 0, false, {
                fileName: "[project]/components/Modal.tsx",
                lineNumber: 161,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                ref: modalRef,
                role: "dialog",
                "aria-modal": "true",
                "aria-labelledby": title ? titleId : undefined,
                tabIndex: -1,
                className: `relative rounded-xl p-6 ${maxWidthClasses[maxWidth]} w-full mx-4 z-10 focus:outline-none ${className}`,
                style: {
                    backgroundColor: 'var(--surface-modal)',
                    color: 'var(--foreground)',
                    boxShadow: 'var(--shadow-modal)',
                    border: '1px solid var(--border-subtle)'
                },
                onClick: (e)=>e.stopPropagation(),
                children: [
                    title && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                        id: titleId,
                        className: "text-lg font-semibold text-foreground mb-4",
                        children: title
                    }, void 0, false, {
                        fileName: "[project]/components/Modal.tsx",
                        lineNumber: 179,
                        columnNumber: 11
                    }, this),
                    children
                ]
            }, void 0, true, {
                fileName: "[project]/components/Modal.tsx",
                lineNumber: 163,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/Modal.tsx",
        lineNumber: 155,
        columnNumber: 5
    }, this);
    // Use portal to render modal at document body level
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2d$dom$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createPortal"])(modalContent, document.body);
}
_s(Modal, "Al4JN5XtBcZZvMhrMN2+23NTASM=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useId"]
    ];
});
_c = Modal;
var _c;
__turbopack_context__.k.register(_c, "Modal");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/Textarea.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Textarea
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
;
function Textarea({ className = "", ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
        ...props,
        className: `w-full px-4 py-3 border text-foreground placeholder:text-foreground border-gray-300 rounded-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 resize-none ${className}`
    }, void 0, false, {
        fileName: "[project]/components/Textarea.tsx",
        lineNumber: 9,
        columnNumber: 5
    }, this);
}
_c = Textarea;
var _c;
__turbopack_context__.k.register(_c, "Textarea");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/hooks/useContactMutations.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useArchiveContact",
    ()=>useArchiveContact,
    "useBulkArchiveContacts",
    ()=>useBulkArchiveContacts,
    "useBulkUpdateCompanies",
    ()=>useBulkUpdateCompanies,
    "useBulkUpdateSegments",
    ()=>useBulkUpdateSegments,
    "useBulkUpdateTags",
    ()=>useBulkUpdateTags,
    "useCreateContact",
    ()=>useCreateContact,
    "useDeleteContact",
    ()=>useDeleteContact,
    "useUpdateContact",
    ()=>useUpdateContact,
    "useUpdateTouchpointStatus",
    ()=>useUpdateTouchpointStatus
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tanstack/react-query/build/modern/useMutation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tanstack/react-query/build/modern/QueryClientProvider.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$error$2d$reporting$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/lib/error-reporting/index.ts [app-client] (ecmascript) <locals>");
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature(), _s2 = __turbopack_context__.k.signature(), _s3 = __turbopack_context__.k.signature(), _s4 = __turbopack_context__.k.signature(), _s5 = __turbopack_context__.k.signature(), _s6 = __turbopack_context__.k.signature(), _s7 = __turbopack_context__.k.signature(), _s8 = __turbopack_context__.k.signature();
"use client";
;
;
function useCreateContact() {
    _s();
    const queryClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"])();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: {
            "useCreateContact.useMutation": async (contactData)=>{
                const response = await fetch("/api/contacts", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(contactData)
                });
                if (!response.ok) {
                    const errorData = await response.json().catch({
                        "useCreateContact.useMutation": ()=>({})
                    }["useCreateContact.useMutation"]);
                    throw new Error(errorData.error || "Failed to create contact");
                }
                const data = await response.json();
                return data.contactId;
            }
        }["useCreateContact.useMutation"],
        onSuccess: {
            "useCreateContact.useMutation": ()=>{
                // Invalidate by prefixes → guarantees matching all screen variations
                queryClient.invalidateQueries({
                    queryKey: [
                        "contacts"
                    ]
                });
                queryClient.invalidateQueries({
                    queryKey: [
                        "dashboard-stats"
                    ]
                });
            }
        }["useCreateContact.useMutation"],
        onError: {
            "useCreateContact.useMutation": (error)=>{
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$error$2d$reporting$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["reportException"])(error, {
                    context: "Creating contact",
                    tags: {
                        component: "useCreateContact"
                    }
                });
            }
        }["useCreateContact.useMutation"]
    });
}
_s(useCreateContact, "YK0wzM21ECnncaq5SECwU+/SVdQ=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"]
    ];
});
function useUpdateContact(userId) {
    _s1();
    const queryClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"])();
    // Defensive contact matcher - handles contactId, id, or _id fields
    const isSameContact = (c, contactId)=>{
        return c.contactId === contactId || c.id === contactId || c._id === contactId;
    };
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: {
            "useUpdateContact.useMutation": async ({ contactId, updates })=>{
                const response = await fetch(`/api/contacts/${encodeURIComponent(contactId)}`, {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(updates)
                });
                if (!response.ok) {
                    const errorData = await response.json().catch({
                        "useUpdateContact.useMutation": ()=>({})
                    }["useUpdateContact.useMutation"]);
                    throw new Error(errorData.error || "Failed to update contact");
                }
                const data = await response.json();
                return data.contact; // API now returns { contact: Contact }
            }
        }["useUpdateContact.useMutation"],
        /**
     * OPTIMISTIC UPDATE
     * Immediately update both detail and ALL list caches so UI feels instant
     */ onMutate: {
            "useUpdateContact.useMutation": async ({ contactId, updates })=>{
                // Cancel all related queries
                await queryClient.cancelQueries({
                    queryKey: [
                        "contact"
                    ],
                    exact: false
                });
                await queryClient.cancelQueries({
                    queryKey: [
                        "contacts"
                    ],
                    exact: false
                });
                // Snapshot previous detail state (for this specific user+contact, if such a query exists)
                const prevDetail = userId ? queryClient.getQueryData([
                    "contact",
                    userId,
                    contactId
                ]) : undefined;
                // Snapshot ALL contacts lists (regardless of key shape)
                const prevLists = {};
                queryClient.getQueryCache().findAll({
                    queryKey: [
                        "contacts"
                    ],
                    exact: false
                }).forEach({
                    "useUpdateContact.useMutation": (q)=>{
                        const key = JSON.stringify(q.queryKey);
                        const data = q.state.data;
                        if (data) prevLists[key] = data;
                    }
                }["useUpdateContact.useMutation"]);
                // Optimistically update detail (if userId provided)
                if (userId) {
                    queryClient.setQueryData([
                        "contact",
                        userId,
                        contactId
                    ], {
                        "useUpdateContact.useMutation": (old)=>old ? {
                                ...old,
                                ...updates
                            } : old
                    }["useUpdateContact.useMutation"]);
                }
                // Optimistically update ALL contacts lists (regardless of key shape)
                queryClient.setQueriesData({
                    queryKey: [
                        "contacts"
                    ],
                    exact: false
                }, {
                    "useUpdateContact.useMutation": (old)=>{
                        if (!old || !Array.isArray(old)) return old;
                        return old.map({
                            "useUpdateContact.useMutation": (c)=>isSameContact(c, contactId) ? {
                                    ...c,
                                    ...updates
                                } : c
                        }["useUpdateContact.useMutation"]);
                    }
                }["useUpdateContact.useMutation"]);
                return {
                    prevDetail,
                    prevLists
                };
            }
        }["useUpdateContact.useMutation"],
        /**
     * SUCCESS — update detail only & delay list invalidation
     * Firestore eventual consistency means list queries might not see the update immediately
     * So we invalidate after a delay to let Firestore propagate the change
     */ onSuccess: {
            "useUpdateContact.useMutation": (updatedContact, variables)=>{
                const { contactId, updates } = variables;
                // Update detail cache with actual server result
                if (userId) {
                    queryClient.setQueryData([
                        "contact",
                        userId,
                        contactId
                    ], updatedContact);
                }
                // If touchpoint date was updated, invalidate calendar events
                if (updates.nextTouchpointDate !== undefined) {
                    queryClient.invalidateQueries({
                        queryKey: [
                            "calendar-events"
                        ],
                        exact: false
                    });
                }
                queryClient.invalidateQueries({
                    queryKey: [
                        "contacts"
                    ],
                    exact: false
                });
                // Invalidate dashboard stats to ensure consistency
                queryClient.invalidateQueries({
                    queryKey: [
                        "dashboard-stats"
                    ],
                    exact: false
                });
            }
        }["useUpdateContact.useMutation"],
        /**
     * Roll back if error
     */ onError: {
            "useUpdateContact.useMutation": (error, variables, context)=>{
                // Restore detail (if userId provided)
                if (userId && context?.prevDetail) {
                    queryClient.setQueryData([
                        "contact",
                        userId,
                        variables.contactId
                    ], context.prevDetail);
                }
                // Restore ALL contacts lists
                if (context?.prevLists) {
                    for (const [key, data] of Object.entries(context.prevLists)){
                        queryClient.setQueryData(JSON.parse(key), data);
                    }
                }
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$error$2d$reporting$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["reportException"])(error, {
                    context: "Updating contact",
                    tags: {
                        component: "useUpdateContact"
                    }
                });
            }
        }["useUpdateContact.useMutation"]
    });
}
_s1(useUpdateContact, "YK0wzM21ECnncaq5SECwU+/SVdQ=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"]
    ];
});
function useDeleteContact() {
    _s2();
    const queryClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"])();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: {
            "useDeleteContact.useMutation": async (contactId)=>{
                const response = await fetch(`/api/contacts/${encodeURIComponent(contactId)}`, {
                    method: "DELETE"
                });
                if (!response.ok) {
                    const errorData = await response.json().catch({
                        "useDeleteContact.useMutation": ()=>({})
                    }["useDeleteContact.useMutation"]);
                    throw new Error(errorData.error || "Failed to delete contact");
                }
                return response.json();
            }
        }["useDeleteContact.useMutation"],
        onSuccess: {
            "useDeleteContact.useMutation": ()=>{
                // Invalidate by prefixes → guarantees matching all screen variations
                queryClient.invalidateQueries({
                    queryKey: [
                        "contacts"
                    ]
                });
                queryClient.invalidateQueries({
                    queryKey: [
                        "contact"
                    ]
                });
                queryClient.invalidateQueries({
                    queryKey: [
                        "dashboard-stats"
                    ]
                });
                queryClient.invalidateQueries({
                    queryKey: [
                        "action-items"
                    ]
                });
            }
        }["useDeleteContact.useMutation"],
        onError: {
            "useDeleteContact.useMutation": (error)=>{
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$error$2d$reporting$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["reportException"])(error, {
                    context: "Deleting contact",
                    tags: {
                        component: "useDeleteContact"
                    }
                });
            }
        }["useDeleteContact.useMutation"]
    });
}
_s2(useDeleteContact, "YK0wzM21ECnncaq5SECwU+/SVdQ=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"]
    ];
});
function useArchiveContact(userId) {
    _s3();
    const queryClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"])();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: {
            "useArchiveContact.useMutation": async ({ contactId, archived })=>{
                const response = await fetch(`/api/contacts/${encodeURIComponent(contactId)}/archive`, {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        archived
                    })
                });
                if (!response.ok) {
                    const errorData = await response.json().catch({
                        "useArchiveContact.useMutation": ()=>({})
                    }["useArchiveContact.useMutation"]);
                    throw new Error(errorData.error || "Failed to archive contact");
                }
                return response.json();
            }
        }["useArchiveContact.useMutation"],
        /**
     * OPTIMISTIC UPDATE
     * Immediately update the cache so UI feels instant
     */ onMutate: {
            "useArchiveContact.useMutation": async ({ contactId, archived })=>{
                if (!userId) return;
                await queryClient.cancelQueries({
                    queryKey: [
                        "contact"
                    ]
                });
                await queryClient.cancelQueries({
                    queryKey: [
                        "contacts"
                    ]
                });
                // Snapshot previous value for rollback
                const prev = queryClient.getQueryData([
                    "contact",
                    userId,
                    contactId
                ]);
                // Update cache immediately - UI updates instantly
                queryClient.setQueryData([
                    "contact",
                    userId,
                    contactId
                ], {
                    "useArchiveContact.useMutation": (old)=>{
                        if (!old) return old;
                        return {
                            ...old,
                            archived
                        };
                    }
                }["useArchiveContact.useMutation"]);
                // Also update in contacts list
                queryClient.setQueryData([
                    "contacts",
                    userId
                ], {
                    "useArchiveContact.useMutation": (old)=>{
                        if (!old) return old;
                        return old.map({
                            "useArchiveContact.useMutation": (c)=>c.contactId === contactId ? {
                                    ...c,
                                    archived
                                } : c
                        }["useArchiveContact.useMutation"]);
                    }
                }["useArchiveContact.useMutation"]);
                return {
                    prev
                };
            }
        }["useArchiveContact.useMutation"],
        /**
     * Roll back if error
     */ onError: {
            "useArchiveContact.useMutation": (error, variables, context)=>{
                if (userId && context?.prev) {
                    queryClient.setQueryData([
                        "contact",
                        userId,
                        variables.contactId
                    ], context.prev);
                }
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$error$2d$reporting$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["reportException"])(error, {
                    context: "Archiving contact",
                    tags: {
                        component: "useArchiveContact"
                    }
                });
            }
        }["useArchiveContact.useMutation"],
        onSettled: {
            "useArchiveContact.useMutation": ()=>{
                queryClient.invalidateQueries({
                    queryKey: [
                        "contact"
                    ]
                });
                queryClient.invalidateQueries({
                    queryKey: [
                        "contacts"
                    ]
                });
                queryClient.invalidateQueries({
                    queryKey: [
                        "dashboard-stats"
                    ]
                });
            }
        }["useArchiveContact.useMutation"]
    });
}
_s3(useArchiveContact, "YK0wzM21ECnncaq5SECwU+/SVdQ=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"]
    ];
});
function useUpdateTouchpointStatus(userId) {
    _s4();
    const queryClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"])();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: {
            "useUpdateTouchpointStatus.useMutation": async ({ contactId, status, reason })=>{
                const response = await fetch(`/api/contacts/${encodeURIComponent(contactId)}/touchpoint-status`, {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        status,
                        reason
                    })
                });
                if (!response.ok) {
                    const errorData = await response.json().catch({
                        "useUpdateTouchpointStatus.useMutation": ()=>({})
                    }["useUpdateTouchpointStatus.useMutation"]);
                    // Throw user-friendly error message - will be extracted by component
                    const errorMessage = errorData.error || "Failed to update touchpoint status. Please try again.";
                    throw new Error(errorMessage);
                }
                const data = await response.json();
                return {
                    ...data,
                    contactId,
                    status,
                    reason
                };
            }
        }["useUpdateTouchpointStatus.useMutation"],
        /**
     * OPTIMISTIC UPDATE
     * Immediately update the cache so UI feels instant
     */ onMutate: {
            "useUpdateTouchpointStatus.useMutation": async ({ contactId, status, reason })=>{
                if (!userId) return;
                // Cancel outgoing refetches to avoid overwriting optimistic update
                await queryClient.cancelQueries({
                    queryKey: [
                        "contact",
                        userId,
                        contactId
                    ]
                });
                await queryClient.cancelQueries({
                    queryKey: [
                        "contacts",
                        userId
                    ]
                });
                // Snapshot previous value for rollback
                const prev = queryClient.getQueryData([
                    "contact",
                    userId,
                    contactId
                ]);
                // Update cache immediately - UI updates instantly
                queryClient.setQueryData([
                    "contact",
                    userId,
                    contactId
                ], {
                    "useUpdateTouchpointStatus.useMutation": (old)=>{
                        if (!old) return old;
                        return {
                            ...old,
                            touchpointStatus: status,
                            touchpointStatusUpdatedAt: status !== null ? new Date().toISOString() : null,
                            touchpointStatusReason: reason !== undefined ? reason : old.touchpointStatusReason
                        };
                    }
                }["useUpdateTouchpointStatus.useMutation"]);
                // Also update in contacts list
                queryClient.setQueryData([
                    "contacts",
                    userId
                ], {
                    "useUpdateTouchpointStatus.useMutation": (old)=>{
                        if (!old) return old;
                        return old.map({
                            "useUpdateTouchpointStatus.useMutation": (contact)=>contact.contactId === contactId ? {
                                    ...contact,
                                    touchpointStatus: status,
                                    touchpointStatusUpdatedAt: status !== null ? new Date().toISOString() : null,
                                    touchpointStatusReason: reason !== undefined ? reason : contact.touchpointStatusReason
                                } : contact
                        }["useUpdateTouchpointStatus.useMutation"]);
                    }
                }["useUpdateTouchpointStatus.useMutation"]);
                return {
                    prev
                };
            }
        }["useUpdateTouchpointStatus.useMutation"],
        /**
     * Roll back if error
     */ onError: {
            "useUpdateTouchpointStatus.useMutation": (error, variables, context)=>{
                if (userId && context?.prev) {
                    queryClient.setQueryData([
                        "contact",
                        userId,
                        variables.contactId
                    ], context.prev);
                }
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$error$2d$reporting$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["reportException"])(error, {
                    context: "Updating touchpoint status",
                    tags: {
                        component: "useUpdateTouchpointStatus"
                    }
                });
            }
        }["useUpdateTouchpointStatus.useMutation"],
        /**
     * Invalidate after success to ensure server consistency
     */ onSettled: {
            "useUpdateTouchpointStatus.useMutation": (_data, _error, vars)=>{
                if (!userId) return;
                queryClient.invalidateQueries({
                    queryKey: [
                        "contact",
                        userId,
                        vars.contactId
                    ]
                });
                queryClient.invalidateQueries({
                    queryKey: [
                        "contacts",
                        userId
                    ]
                });
                queryClient.invalidateQueries({
                    queryKey: [
                        "dashboard-stats"
                    ],
                    exact: false
                });
                // Invalidate calendar events when touchpoint status changes
                queryClient.invalidateQueries({
                    queryKey: [
                        "calendar-events"
                    ],
                    exact: false
                });
            }
        }["useUpdateTouchpointStatus.useMutation"]
    });
}
_s4(useUpdateTouchpointStatus, "YK0wzM21ECnncaq5SECwU+/SVdQ=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"]
    ];
});
function useBulkArchiveContacts() {
    _s5();
    const queryClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"])();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: {
            "useBulkArchiveContacts.useMutation": async ({ contactIds, archived })=>{
                const response = await fetch("/api/contacts/bulk-archive", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        contactIds,
                        archived
                    })
                });
                if (!response.ok) {
                    const errorData = await response.json().catch({
                        "useBulkArchiveContacts.useMutation": ()=>({})
                    }["useBulkArchiveContacts.useMutation"]);
                    throw new Error(errorData.error || "Failed to bulk archive contacts");
                }
                return response.json();
            }
        }["useBulkArchiveContacts.useMutation"],
        onSuccess: {
            "useBulkArchiveContacts.useMutation": ()=>{
                // Invalidate by prefixes → guarantees matching all screen variations
                queryClient.invalidateQueries({
                    queryKey: [
                        "contacts"
                    ]
                });
                queryClient.invalidateQueries({
                    queryKey: [
                        "contact"
                    ]
                });
                queryClient.invalidateQueries({
                    queryKey: [
                        "dashboard-stats"
                    ]
                });
            }
        }["useBulkArchiveContacts.useMutation"],
        onError: {
            "useBulkArchiveContacts.useMutation": (error)=>{
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$error$2d$reporting$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["reportException"])(error, {
                    context: "Bulk archiving contacts",
                    tags: {
                        component: "useBulkArchiveContacts"
                    }
                });
            }
        }["useBulkArchiveContacts.useMutation"]
    });
}
_s5(useBulkArchiveContacts, "YK0wzM21ECnncaq5SECwU+/SVdQ=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"]
    ];
});
function useBulkUpdateSegments() {
    _s6();
    const queryClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"])();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: {
            "useBulkUpdateSegments.useMutation": async ({ contactIds, segment })=>{
                const response = await fetch("/api/contacts/bulk-segment", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        contactIds,
                        segment
                    })
                });
                if (!response.ok) {
                    const errorData = await response.json().catch({
                        "useBulkUpdateSegments.useMutation": ()=>({})
                    }["useBulkUpdateSegments.useMutation"]);
                    throw new Error(errorData.error || "Failed to bulk update segments");
                }
                return response.json();
            }
        }["useBulkUpdateSegments.useMutation"],
        onSuccess: {
            "useBulkUpdateSegments.useMutation": ()=>{
                // Invalidate by prefixes → guarantees matching all screen variations
                queryClient.invalidateQueries({
                    queryKey: [
                        "contacts"
                    ]
                });
                queryClient.invalidateQueries({
                    queryKey: [
                        "contact"
                    ]
                });
                queryClient.invalidateQueries({
                    queryKey: [
                        "dashboard-stats"
                    ]
                });
            }
        }["useBulkUpdateSegments.useMutation"],
        onError: {
            "useBulkUpdateSegments.useMutation": (error)=>{
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$error$2d$reporting$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["reportException"])(error, {
                    context: "Bulk updating contact segments",
                    tags: {
                        component: "useBulkUpdateSegments"
                    }
                });
            }
        }["useBulkUpdateSegments.useMutation"]
    });
}
_s6(useBulkUpdateSegments, "YK0wzM21ECnncaq5SECwU+/SVdQ=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"]
    ];
});
function useBulkUpdateTags() {
    _s7();
    const queryClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"])();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: {
            "useBulkUpdateTags.useMutation": async ({ contactIds, tags })=>{
                const response = await fetch("/api/contacts/bulk-tags", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        contactIds,
                        tags
                    })
                });
                if (!response.ok) {
                    const errorData = await response.json().catch({
                        "useBulkUpdateTags.useMutation": ()=>({})
                    }["useBulkUpdateTags.useMutation"]);
                    throw new Error(errorData.error || "Failed to bulk update tags");
                }
                return response.json();
            }
        }["useBulkUpdateTags.useMutation"],
        onSuccess: {
            "useBulkUpdateTags.useMutation": ()=>{
                // Invalidate by prefixes → guarantees matching all screen variations
                queryClient.invalidateQueries({
                    queryKey: [
                        "contacts"
                    ]
                });
                queryClient.invalidateQueries({
                    queryKey: [
                        "contact"
                    ]
                });
                queryClient.invalidateQueries({
                    queryKey: [
                        "dashboard-stats"
                    ]
                });
            }
        }["useBulkUpdateTags.useMutation"],
        onError: {
            "useBulkUpdateTags.useMutation": (error)=>{
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$error$2d$reporting$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["reportException"])(error, {
                    context: "Bulk updating contact tags",
                    tags: {
                        component: "useBulkUpdateTags"
                    }
                });
            }
        }["useBulkUpdateTags.useMutation"]
    });
}
_s7(useBulkUpdateTags, "YK0wzM21ECnncaq5SECwU+/SVdQ=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"]
    ];
});
function useBulkUpdateCompanies() {
    _s8();
    const queryClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"])();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: {
            "useBulkUpdateCompanies.useMutation": async ({ contactIds, company })=>{
                const response = await fetch("/api/contacts/bulk-company", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        contactIds,
                        company
                    })
                });
                if (!response.ok) {
                    const errorData = await response.json().catch({
                        "useBulkUpdateCompanies.useMutation": ()=>({})
                    }["useBulkUpdateCompanies.useMutation"]);
                    throw new Error(errorData.error || "Failed to bulk update companies");
                }
                return response.json();
            }
        }["useBulkUpdateCompanies.useMutation"],
        onSuccess: {
            "useBulkUpdateCompanies.useMutation": ()=>{
                // Invalidate by prefixes → guarantees matching all screen variations
                queryClient.invalidateQueries({
                    queryKey: [
                        "contacts"
                    ]
                });
                queryClient.invalidateQueries({
                    queryKey: [
                        "contact"
                    ]
                });
                queryClient.invalidateQueries({
                    queryKey: [
                        "dashboard-stats"
                    ]
                });
            }
        }["useBulkUpdateCompanies.useMutation"],
        onError: {
            "useBulkUpdateCompanies.useMutation": (error)=>{
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$error$2d$reporting$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["reportException"])(error, {
                    context: "Bulk updating contact companies",
                    tags: {
                        component: "useBulkUpdateCompanies"
                    }
                });
            }
        }["useBulkUpdateCompanies.useMutation"]
    });
}
_s8(useBulkUpdateCompanies, "YK0wzM21ECnncaq5SECwU+/SVdQ=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"]
    ];
});
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/hooks/useContact.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useContact",
    ()=>useContact
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tanstack/react-query/build/modern/useQuery.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tanstack/react-query/build/modern/QueryClientProvider.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$ui$2d$mode$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/ui-mode.ts [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
function useContact(userId, contactId) {
    _s();
    const queryClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"])();
    const query = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: [
            "contact",
            userId,
            contactId
        ],
        queryFn: {
            "useContact.useQuery[query]": async ()=>{
                const response = await fetch(`/api/contacts/${encodeURIComponent(contactId)}`);
                if (!response.ok) {
                    if (response.status === 404) {
                        return null;
                    }
                    const errorData = await response.json().catch({
                        "useContact.useQuery[query]": ()=>({})
                    }["useContact.useQuery[query]"]);
                    throw new Error(errorData.error || "Failed to fetch contact");
                }
                const data = await response.json();
                return data.contact;
            }
        }["useContact.useQuery[query]"],
        staleTime: 0,
        enabled: !!userId && !!contactId,
        // ⭐ ONLY placeholderData — NO initialData
        // This ensures optimistic updates persist during refetches
        placeholderData: {
            "useContact.useQuery[query]": ()=>{
                // First check if we have the individual contact query data (includes optimistic updates)
                const detail = queryClient.getQueryData([
                    "contact",
                    userId,
                    contactId
                ]);
                if (detail) return detail;
                // Otherwise fall back to contacts list
                const list = queryClient.getQueryData([
                    "contacts",
                    userId
                ]);
                return list?.find({
                    "useContact.useQuery[query]": (c)=>c.contactId === contactId
                }["useContact.useQuery[query]"]);
            }
        }["useContact.useQuery[query]"]
    });
    const uiMode = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$ui$2d$mode$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getUIMode"])();
    // Override query result based on UI mode
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "useContact.useMemo": ()=>{
            if (uiMode === "suspense") {
                return {
                    ...query,
                    data: undefined,
                    isLoading: true
                };
            }
            if (uiMode === "empty") {
                return {
                    ...query,
                    data: undefined,
                    isLoading: false
                };
            }
            return query;
        }
    }["useContact.useMemo"], [
        query,
        uiMode
    ]);
}
_s(useContact, "wZf+12UpbbP5RRtCZ5pP5uR42PI=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"]
    ];
});
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/(crm)/_components/TouchpointStatusActions.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>TouchpointStatusActions
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Modal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/Modal.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/Button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ErrorMessage$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/components/ErrorMessage.tsx [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$error$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/error-utils.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Textarea$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/Textarea.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useContactMutations$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hooks/useContactMutations.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useAuth$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hooks/useAuth.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useContact$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hooks/useContact.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$error$2d$reporting$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/lib/error-reporting/index.ts [app-client] (ecmascript) <locals>");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
;
;
;
function TouchpointStatusActions({ contactId, contactName, userId, onStatusUpdate, compact = false, currentStatus: fallbackStatus }) {
    _s();
    const { user } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useAuth$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"])();
    // Use userId prop if provided, otherwise fall back to user?.uid
    const effectiveUserId = userId || user?.uid || "";
    // Read contact directly from React Query cache for optimistic updates
    // Fall back to prop if contact isn't in cache (e.g., in ContactCard list view)
    const { data: contact } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useContact$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContact"])(effectiveUserId, contactId);
    const prevContactIdRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const [currentStatus, setCurrentStatus] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(contact?.touchpointStatus ?? fallbackStatus ?? null);
    const [showCancelModal, setShowCancelModal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [showCompleteModal, setShowCompleteModal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [reason, setReason] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const mutation = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useContactMutations$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useUpdateTouchpointStatus"])(effectiveUserId);
    // Reset state ONLY when contactId changes (switching to a different contact)
    // We don't update when updatedAt changes because that would reset our local state
    // during optimistic updates and refetches. The local state is the source of truth
    // until we switch to a different contact.
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "TouchpointStatusActions.useEffect": ()=>{
            if (!contact && !fallbackStatus) return;
            // Only update if we're switching to a different contact
            if (prevContactIdRef.current !== contactId) {
                prevContactIdRef.current = contactId;
                const statusToUse = contact?.touchpointStatus ?? fallbackStatus ?? null;
                // Batch state updates to avoid cascading renders
                setCurrentStatus(statusToUse);
            }
        // eslint-disable-next-line react-hooks/exhaustive-deps
        }
    }["TouchpointStatusActions.useEffect"], [
        contactId,
        fallbackStatus
    ]);
    const handleUpdateStatus = async (status, reason)=>{
        setError(null);
        setCurrentStatus(status);
        mutation.mutate({
            contactId,
            status,
            reason: reason || null
        }, {
            onSuccess: ()=>{
                setShowCancelModal(false);
                setShowCompleteModal(false);
                setReason("");
                onStatusUpdate?.();
            },
            onError: (error)=>{
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$error$2d$reporting$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["reportException"])(error, {
                    context: "Updating touchpoint status in TouchpointStatusActions",
                    tags: {
                        component: "TouchpointStatusActions",
                        contactId
                    }
                });
                setError((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$error$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["extractErrorMessage"])(error));
            }
        });
    };
    if (compact) {
        // Compact view for dashboard cards
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "space-y-2",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex flex-col sm:flex-row items-stretch sm:items-center gap-2",
                    children: [
                        currentStatus !== "completed" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                            variant: "secondary",
                            onClick: ()=>setShowCompleteModal(true),
                            disabled: mutation.isPending,
                            className: "flex-1 cursor-pointer sm:flex-none px-3 py-2 sm:px-2 sm:py-1 text-xs disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5 sm:gap-1",
                            title: "I've contacted this person",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                    className: "w-3.5 h-3.5 shrink-0",
                                    fill: "none",
                                    stroke: "currentColor",
                                    viewBox: "0 0 24 24",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                        strokeLinecap: "round",
                                        strokeLinejoin: "round",
                                        strokeWidth: 2,
                                        d: "M5 13l4 4L19 7"
                                    }, void 0, false, {
                                        fileName: "[project]/app/(crm)/_components/TouchpointStatusActions.tsx",
                                        lineNumber: 114,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/app/(crm)/_components/TouchpointStatusActions.tsx",
                                    lineNumber: 108,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "whitespace-nowrap",
                                    children: "Mark as Contacted"
                                }, void 0, false, {
                                    fileName: "[project]/app/(crm)/_components/TouchpointStatusActions.tsx",
                                    lineNumber: 121,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/(crm)/_components/TouchpointStatusActions.tsx",
                            lineNumber: 101,
                            columnNumber: 13
                        }, this),
                        currentStatus !== "cancelled" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                            variant: "outline",
                            onClick: ()=>setShowCancelModal(true),
                            disabled: mutation.isPending,
                            className: "flex-1 sm:flex-none px-3 py-2 sm:px-2 sm:py-1 text-xs font-medium text-foreground border border-theme-medium rounded hover:bg-theme-medium cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5 sm:gap-1",
                            title: "Skip this touchpoint - no action needed",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                    className: "w-3.5 h-3.5 shrink-0",
                                    fill: "none",
                                    stroke: "currentColor",
                                    viewBox: "0 0 24 24",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                        strokeLinecap: "round",
                                        strokeLinejoin: "round",
                                        strokeWidth: 2,
                                        d: "M6 18L18 6M6 6l12 12"
                                    }, void 0, false, {
                                        fileName: "[project]/app/(crm)/_components/TouchpointStatusActions.tsx",
                                        lineNumber: 138,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/app/(crm)/_components/TouchpointStatusActions.tsx",
                                    lineNumber: 132,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "whitespace-nowrap",
                                    children: "Skip Touchpoint"
                                }, void 0, false, {
                                    fileName: "[project]/app/(crm)/_components/TouchpointStatusActions.tsx",
                                    lineNumber: 145,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/(crm)/_components/TouchpointStatusActions.tsx",
                            lineNumber: 125,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/(crm)/_components/TouchpointStatusActions.tsx",
                    lineNumber: 99,
                    columnNumber: 9
                }, this),
                error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ErrorMessage$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["ErrorMessage"], {
                    message: error,
                    dismissible: true,
                    onDismiss: ()=>setError(null)
                }, void 0, false, {
                    fileName: "[project]/app/(crm)/_components/TouchpointStatusActions.tsx",
                    lineNumber: 150,
                    columnNumber: 11
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Modal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                    isOpen: showCompleteModal,
                    onClose: ()=>{
                        if (!mutation.isPending) {
                            setShowCompleteModal(false);
                            setReason("");
                            setError(null);
                        }
                    },
                    title: "Mark as Contacted",
                    closeOnBackdropClick: !mutation.isPending,
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-sm text-theme-dark mb-4",
                            children: [
                                "Mark the touchpoint for ",
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                    children: contactName
                                }, void 0, false, {
                                    fileName: "[project]/app/(crm)/_components/TouchpointStatusActions.tsx",
                                    lineNumber: 169,
                                    columnNumber: 37
                                }, this),
                                " as contacted? This indicates you've reached out to them."
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/(crm)/_components/TouchpointStatusActions.tsx",
                            lineNumber: 168,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "mb-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    htmlFor: "touchpoint-complete-note-compact",
                                    className: "block text-sm font-medium text-theme-darker mb-2",
                                    children: [
                                        "Note (optional)",
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-xs text-gray-500 font-normal ml-1",
                                            children: "— This will be saved and displayed on the contact page"
                                        }, void 0, false, {
                                            fileName: "[project]/app/(crm)/_components/TouchpointStatusActions.tsx",
                                            lineNumber: 174,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/(crm)/_components/TouchpointStatusActions.tsx",
                                    lineNumber: 172,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Textarea$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                    id: "touchpoint-complete-note-compact",
                                    name: "touchpoint-complete-note-compact",
                                    value: reason,
                                    onChange: (e)=>setReason(e.target.value),
                                    placeholder: "e.g., Discussed proposal, scheduled follow-up, sent quote...",
                                    className: "px-3 py-2 text-theme-darkest disabled:text-theme-dark",
                                    rows: 3,
                                    disabled: mutation.isPending,
                                    autoComplete: "off",
                                    "data-form-type": "other",
                                    "data-lpignore": "true",
                                    "data-1p-ignore": "true"
                                }, void 0, false, {
                                    fileName: "[project]/app/(crm)/_components/TouchpointStatusActions.tsx",
                                    lineNumber: 178,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/(crm)/_components/TouchpointStatusActions.tsx",
                            lineNumber: 171,
                            columnNumber: 11
                        }, this),
                        error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "mb-4",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ErrorMessage$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["ErrorMessage"], {
                                message: error,
                                dismissible: true,
                                onDismiss: ()=>setError(null)
                            }, void 0, false, {
                                fileName: "[project]/app/(crm)/_components/TouchpointStatusActions.tsx",
                                lineNumber: 195,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/app/(crm)/_components/TouchpointStatusActions.tsx",
                            lineNumber: 194,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex gap-3 justify-end",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                    onClick: ()=>{
                                        setShowCompleteModal(false);
                                        setReason("");
                                        setError(null);
                                    },
                                    disabled: mutation.isPending,
                                    variant: "outline",
                                    size: "sm",
                                    children: "Cancel"
                                }, void 0, false, {
                                    fileName: "[project]/app/(crm)/_components/TouchpointStatusActions.tsx",
                                    lineNumber: 203,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                    onClick: ()=>handleUpdateStatus("completed", reason),
                                    disabled: mutation.isPending,
                                    loading: mutation.isPending,
                                    variant: "secondary",
                                    size: "sm",
                                    children: "Mark as Contacted"
                                }, void 0, false, {
                                    fileName: "[project]/app/(crm)/_components/TouchpointStatusActions.tsx",
                                    lineNumber: 215,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/(crm)/_components/TouchpointStatusActions.tsx",
                            lineNumber: 202,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/(crm)/_components/TouchpointStatusActions.tsx",
                    lineNumber: 156,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Modal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                    isOpen: showCancelModal,
                    onClose: ()=>{
                        if (!mutation.isPending) {
                            setShowCancelModal(false);
                            setReason("");
                            setError(null);
                        }
                    },
                    title: "Skip Touchpoint",
                    closeOnBackdropClick: !mutation.isPending,
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-sm text-theme-dark mb-4",
                            children: [
                                "Skip the touchpoint for ",
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                    children: contactName
                                }, void 0, false, {
                                    fileName: "[project]/app/(crm)/_components/TouchpointStatusActions.tsx",
                                    lineNumber: 239,
                                    columnNumber: 37
                                }, this),
                                "? This indicates no action is needed at this time."
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/(crm)/_components/TouchpointStatusActions.tsx",
                            lineNumber: 238,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "mb-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    htmlFor: "touchpoint-skip-reason-compact",
                                    className: "block text-sm font-medium text-theme-darker mb-2",
                                    children: [
                                        "Reason (optional)",
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-xs text-gray-500 font-normal ml-1",
                                            children: "— This will be saved and displayed on the contact page"
                                        }, void 0, false, {
                                            fileName: "[project]/app/(crm)/_components/TouchpointStatusActions.tsx",
                                            lineNumber: 244,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/(crm)/_components/TouchpointStatusActions.tsx",
                                    lineNumber: 242,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Textarea$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                    id: "touchpoint-skip-reason-compact",
                                    name: "touchpoint-skip-reason-compact",
                                    value: reason,
                                    onChange: (e)=>setReason(e.target.value),
                                    placeholder: "e.g., Not relevant, contact inactive, wrong contact...",
                                    className: "px-3 py-2 text-theme-darkest disabled:text-theme-dark",
                                    rows: 3,
                                    disabled: mutation.isPending,
                                    autoComplete: "off",
                                    "data-form-type": "other",
                                    "data-lpignore": "true",
                                    "data-1p-ignore": "true"
                                }, void 0, false, {
                                    fileName: "[project]/app/(crm)/_components/TouchpointStatusActions.tsx",
                                    lineNumber: 248,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/(crm)/_components/TouchpointStatusActions.tsx",
                            lineNumber: 241,
                            columnNumber: 11
                        }, this),
                        error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "mb-4",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ErrorMessage$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["ErrorMessage"], {
                                message: error,
                                dismissible: true,
                                onDismiss: ()=>setError(null)
                            }, void 0, false, {
                                fileName: "[project]/app/(crm)/_components/TouchpointStatusActions.tsx",
                                lineNumber: 265,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/app/(crm)/_components/TouchpointStatusActions.tsx",
                            lineNumber: 264,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex gap-3 justify-end",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                    onClick: ()=>{
                                        setShowCancelModal(false);
                                        setReason("");
                                        setError(null);
                                    },
                                    disabled: mutation.isPending,
                                    size: "sm",
                                    children: "Keep Touchpoint"
                                }, void 0, false, {
                                    fileName: "[project]/app/(crm)/_components/TouchpointStatusActions.tsx",
                                    lineNumber: 273,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                    onClick: ()=>handleUpdateStatus("cancelled", reason),
                                    disabled: mutation.isPending,
                                    loading: mutation.isPending,
                                    variant: "outline",
                                    size: "sm",
                                    children: "Skip Touchpoint"
                                }, void 0, false, {
                                    fileName: "[project]/app/(crm)/_components/TouchpointStatusActions.tsx",
                                    lineNumber: 284,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/(crm)/_components/TouchpointStatusActions.tsx",
                            lineNumber: 272,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/(crm)/_components/TouchpointStatusActions.tsx",
                    lineNumber: 226,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/app/(crm)/_components/TouchpointStatusActions.tsx",
            lineNumber: 98,
            columnNumber: 7
        }, this);
    }
    // Full view for contact detail page
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "space-y-3",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center gap-3",
                children: [
                    currentStatus === "completed" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "px-3 py-1 text-sm font-medium text-green-700 bg-green-50 border border-green-200 rounded-full",
                        children: "✓ Contacted"
                    }, void 0, false, {
                        fileName: "[project]/app/(crm)/_components/TouchpointStatusActions.tsx",
                        lineNumber: 304,
                        columnNumber: 11
                    }, this),
                    currentStatus === "cancelled" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "px-3 py-1 text-sm font-medium text-[#eeeeec] bg-theme-medium rounded-full",
                        children: "✕ Skipped"
                    }, void 0, false, {
                        fileName: "[project]/app/(crm)/_components/TouchpointStatusActions.tsx",
                        lineNumber: 309,
                        columnNumber: 11
                    }, this),
                    (!currentStatus || currentStatus === "pending") && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "px-3 py-1 text-sm font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-full",
                        children: "Pending"
                    }, void 0, false, {
                        fileName: "[project]/app/(crm)/_components/TouchpointStatusActions.tsx",
                        lineNumber: 314,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/(crm)/_components/TouchpointStatusActions.tsx",
                lineNumber: 302,
                columnNumber: 7
            }, this),
            (!currentStatus || currentStatus === "pending") && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex gap-2",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                        onClick: ()=>setShowCompleteModal(true),
                        disabled: mutation.isPending,
                        variant: "secondary",
                        size: "sm",
                        children: "Mark as Contacted"
                    }, void 0, false, {
                        fileName: "[project]/app/(crm)/_components/TouchpointStatusActions.tsx",
                        lineNumber: 322,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                        onClick: ()=>setShowCancelModal(true),
                        disabled: mutation.isPending,
                        variant: "outline",
                        size: "sm",
                        children: "Skip Touchpoint"
                    }, void 0, false, {
                        fileName: "[project]/app/(crm)/_components/TouchpointStatusActions.tsx",
                        lineNumber: 330,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/(crm)/_components/TouchpointStatusActions.tsx",
                lineNumber: 321,
                columnNumber: 9
            }, this),
            (currentStatus === "completed" || currentStatus === "cancelled") && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                onClick: ()=>handleUpdateStatus(null),
                disabled: mutation.isPending,
                loading: mutation.isPending,
                variant: "outline",
                size: "sm",
                className: "text-blue-700 bg-blue-50 hover:bg-blue-100",
                children: "Restore to Pending"
            }, void 0, false, {
                fileName: "[project]/app/(crm)/_components/TouchpointStatusActions.tsx",
                lineNumber: 342,
                columnNumber: 9
            }, this),
            error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ErrorMessage$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["ErrorMessage"], {
                message: error,
                dismissible: true,
                onDismiss: ()=>setError(null)
            }, void 0, false, {
                fileName: "[project]/app/(crm)/_components/TouchpointStatusActions.tsx",
                lineNumber: 355,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Modal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                isOpen: showCompleteModal,
                onClose: ()=>{
                    if (!mutation.isPending) {
                        setShowCompleteModal(false);
                        setReason("");
                        setError(null);
                    }
                },
                title: "Mark as Contacted",
                closeOnBackdropClick: !mutation.isPending,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-sm text-theme-dark mb-4",
                        children: [
                            "Mark the touchpoint for ",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                children: contactName
                            }, void 0, false, {
                                fileName: "[project]/app/(crm)/_components/TouchpointStatusActions.tsx",
                                lineNumber: 376,
                                columnNumber: 35
                            }, this),
                            " as contacted? This indicates you've reached out to them."
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/(crm)/_components/TouchpointStatusActions.tsx",
                        lineNumber: 375,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mb-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                htmlFor: "touchpoint-complete-note",
                                className: "block text-sm font-medium text-theme-darker mb-2",
                                children: [
                                    "Note (optional)",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-xs text-gray-500 font-normal ml-1",
                                        children: "— This will be saved and displayed on the contact page"
                                    }, void 0, false, {
                                        fileName: "[project]/app/(crm)/_components/TouchpointStatusActions.tsx",
                                        lineNumber: 381,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/(crm)/_components/TouchpointStatusActions.tsx",
                                lineNumber: 379,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Textarea$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                id: "touchpoint-complete-note",
                                name: "touchpoint-complete-note",
                                value: reason,
                                onChange: (e)=>setReason(e.target.value),
                                placeholder: "e.g., Discussed proposal, scheduled follow-up, sent quote...",
                                className: "px-3 py-2 text-theme-darkest disabled:text-theme-dark",
                                rows: 3,
                                disabled: mutation.isPending,
                                autoComplete: "off",
                                "data-form-type": "other",
                                "data-lpignore": "true",
                                "data-1p-ignore": "true"
                            }, void 0, false, {
                                fileName: "[project]/app/(crm)/_components/TouchpointStatusActions.tsx",
                                lineNumber: 385,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/(crm)/_components/TouchpointStatusActions.tsx",
                        lineNumber: 378,
                        columnNumber: 9
                    }, this),
                    error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mb-4",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ErrorMessage$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["ErrorMessage"], {
                            message: error,
                            dismissible: true,
                            onDismiss: ()=>setError(null)
                        }, void 0, false, {
                            fileName: "[project]/app/(crm)/_components/TouchpointStatusActions.tsx",
                            lineNumber: 402,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/(crm)/_components/TouchpointStatusActions.tsx",
                        lineNumber: 401,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex gap-3 justify-end",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                onClick: ()=>{
                                    setShowCompleteModal(false);
                                    setReason("");
                                    setError(null);
                                },
                                disabled: mutation.isPending,
                                variant: "outline",
                                size: "sm",
                                children: "Cancel"
                            }, void 0, false, {
                                fileName: "[project]/app/(crm)/_components/TouchpointStatusActions.tsx",
                                lineNumber: 410,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                onClick: ()=>handleUpdateStatus("completed", reason),
                                disabled: mutation.isPending,
                                loading: mutation.isPending,
                                variant: "secondary",
                                size: "sm",
                                children: "Mark Completed"
                            }, void 0, false, {
                                fileName: "[project]/app/(crm)/_components/TouchpointStatusActions.tsx",
                                lineNumber: 422,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/(crm)/_components/TouchpointStatusActions.tsx",
                        lineNumber: 409,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/(crm)/_components/TouchpointStatusActions.tsx",
                lineNumber: 363,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Modal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                isOpen: showCancelModal,
                onClose: ()=>{
                    if (!mutation.isPending) {
                        setShowCancelModal(false);
                        setReason("");
                        setError(null);
                    }
                },
                title: "Skip Touchpoint",
                closeOnBackdropClick: !mutation.isPending,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-sm text-theme-dark mb-4",
                        children: [
                            "Skip the touchpoint for ",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                children: contactName
                            }, void 0, false, {
                                fileName: "[project]/app/(crm)/_components/TouchpointStatusActions.tsx",
                                lineNumber: 447,
                                columnNumber: 35
                            }, this),
                            "? This indicates no action is needed at this time."
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/(crm)/_components/TouchpointStatusActions.tsx",
                        lineNumber: 446,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mb-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                htmlFor: "touchpoint-skip-reason",
                                className: "block text-sm font-medium text-theme-darker mb-2",
                                children: [
                                    "Reason (optional)",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-xs text-gray-500 font-normal ml-1",
                                        children: "— This will be saved and displayed on the contact page"
                                    }, void 0, false, {
                                        fileName: "[project]/app/(crm)/_components/TouchpointStatusActions.tsx",
                                        lineNumber: 452,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/(crm)/_components/TouchpointStatusActions.tsx",
                                lineNumber: 450,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Textarea$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                id: "touchpoint-skip-reason",
                                name: "touchpoint-skip-reason",
                                value: reason,
                                onChange: (e)=>setReason(e.target.value),
                                placeholder: "e.g., Not relevant, contact inactive, wrong contact...",
                                className: "px-3 py-2 text-theme-darkest disabled:text-theme-dark",
                                rows: 3,
                                disabled: mutation.isPending,
                                autoComplete: "off",
                                "data-form-type": "other",
                                "data-lpignore": "true",
                                "data-1p-ignore": "true"
                            }, void 0, false, {
                                fileName: "[project]/app/(crm)/_components/TouchpointStatusActions.tsx",
                                lineNumber: 456,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/(crm)/_components/TouchpointStatusActions.tsx",
                        lineNumber: 449,
                        columnNumber: 9
                    }, this),
                    error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mb-4",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ErrorMessage$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["ErrorMessage"], {
                            message: error,
                            dismissible: true,
                            onDismiss: ()=>setError(null)
                        }, void 0, false, {
                            fileName: "[project]/app/(crm)/_components/TouchpointStatusActions.tsx",
                            lineNumber: 473,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/(crm)/_components/TouchpointStatusActions.tsx",
                        lineNumber: 472,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex gap-3 justify-end",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                onClick: ()=>{
                                    setShowCancelModal(false);
                                    setReason("");
                                    setError(null);
                                },
                                disabled: mutation.isPending,
                                size: "sm",
                                children: "Keep Touchpoint"
                            }, void 0, false, {
                                fileName: "[project]/app/(crm)/_components/TouchpointStatusActions.tsx",
                                lineNumber: 481,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                onClick: ()=>handleUpdateStatus("cancelled", reason),
                                disabled: mutation.isPending,
                                loading: mutation.isPending,
                                variant: "outline",
                                size: "sm",
                                children: "Skip Touchpoint"
                            }, void 0, false, {
                                fileName: "[project]/app/(crm)/_components/TouchpointStatusActions.tsx",
                                lineNumber: 492,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/(crm)/_components/TouchpointStatusActions.tsx",
                        lineNumber: 480,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/(crm)/_components/TouchpointStatusActions.tsx",
                lineNumber: 434,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/(crm)/_components/TouchpointStatusActions.tsx",
        lineNumber: 301,
        columnNumber: 5
    }, this);
}
_s(TouchpointStatusActions, "1Jh2UPZgvdtuvTUSRXwI+3BTGhA=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useAuth$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"],
        __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useContact$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContact"],
        __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useContactMutations$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useUpdateTouchpointStatus"]
    ];
});
_c = TouchpointStatusActions;
var _c;
__turbopack_context__.k.register(_c, "TouchpointStatusActions");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/Input.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
;
/**
 * Reusable Input component with consistent styling
 * Provides consistent styling across all text input elements in the application
 */ const Input = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].forwardRef(_c = ({ className = "", ...props }, ref)=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
        ref: ref,
        ...props,
        className: `w-full px-4 py-2 border border-theme-darker placeholder:text-foreground rounded-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${className}`
    }, void 0, false, {
        fileName: "[project]/components/Input.tsx",
        lineNumber: 10,
        columnNumber: 7
    }, ("TURBOPACK compile-time value", void 0));
});
_c1 = Input;
Input.displayName = "Input";
const __TURBOPACK__default__export__ = Input;
var _c, _c1;
__turbopack_context__.k.register(_c, "Input$React.forwardRef");
__turbopack_context__.k.register(_c1, "Input");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/(crm)/_components/QuickTag.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>QuickTag
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useContactMutations$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hooks/useContactMutations.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/Input.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
function QuickTag({ contactId, userId, existingTags = [], onTagAdded }) {
    _s();
    const [isExpanded, setIsExpanded] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [tagValue, setTagValue] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const inputRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const updateContact = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useContactMutations$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useUpdateContact"])(userId);
    // Focus input when expanded
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "QuickTag.useEffect": ()=>{
            if (isExpanded && inputRef.current) {
                inputRef.current.focus();
            }
        }
    }["QuickTag.useEffect"], [
        isExpanded
    ]);
    const handlePlusClick = (e)=>{
        e.preventDefault();
        e.stopPropagation();
        setIsExpanded(true);
        setError(null);
    };
    const handleCancel = (e)=>{
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        setIsExpanded(false);
        setTagValue("");
        setError(null);
    };
    const handleSubmit = async (e)=>{
        e.preventDefault();
        e.stopPropagation();
        const trimmedTag = tagValue.trim();
        // Validate: empty tag
        if (!trimmedTag) {
            setError("Tag cannot be empty");
            return;
        }
        // Validate: duplicate tag (case-insensitive)
        const normalizedExisting = existingTags.map((tag)=>tag.toLowerCase().trim());
        if (normalizedExisting.includes(trimmedTag.toLowerCase())) {
            setError("Tag already exists");
            return;
        }
        setError(null);
        // Prepare updated tags array - add new tag to the beginning
        const updatedTags = [
            trimmedTag,
            ...existingTags
        ];
        try {
            await updateContact.mutateAsync({
                contactId,
                updates: {
                    tags: updatedTags
                }
            });
            // Success - reset and close
            setTagValue("");
            setIsExpanded(false);
            onTagAdded?.();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to add tag");
        }
    };
    const handleKeyDown = (e)=>{
        if (e.key === "Escape") {
            handleCancel();
        }
    };
    if (!isExpanded) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
            type: "button",
            onClick: handlePlusClick,
            className: "cursor-pointer px-2 py-1 text-xs font-medium border border-card-tag rounded-sm transition-colors flex items-center justify-center shrink-0",
            style: {
                color: 'var(--foreground)'
            },
            onMouseEnter: (e)=>{
                e.currentTarget.style.backgroundColor = 'var(--surface-hover)';
            },
            onMouseLeave: (e)=>{
                e.currentTarget.style.backgroundColor = 'transparent';
            },
            "aria-label": "Add tag",
            title: "Add tag",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                className: "w-3 h-3",
                fill: "none",
                stroke: "currentColor",
                viewBox: "0 0 24 24",
                strokeWidth: 2,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                    strokeLinecap: "round",
                    strokeLinejoin: "round",
                    d: "M12 4v16m8-8H4"
                }, void 0, false, {
                    fileName: "[project]/app/(crm)/_components/QuickTag.tsx",
                    lineNumber: 122,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/(crm)/_components/QuickTag.tsx",
                lineNumber: 115,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/app/(crm)/_components/QuickTag.tsx",
            lineNumber: 99,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
        onSubmit: handleSubmit,
        className: "flex items-center gap-1 shrink-0",
        onClick: (e)=>e.stopPropagation(),
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center gap-1",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        ref: inputRef,
                        type: "text",
                        value: tagValue,
                        onChange: (e)=>{
                            setTagValue(e.target.value);
                            setError(null);
                        },
                        onKeyDown: handleKeyDown,
                        placeholder: "Tag name",
                        className: "w-24 h-7 px-2 py-1 text-xs",
                        disabled: updateContact.isPending
                    }, void 0, false, {
                        fileName: "[project]/app/(crm)/_components/QuickTag.tsx",
                        lineNumber: 139,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "submit",
                        disabled: updateContact.isPending || !tagValue.trim(),
                        className: "cursor-pointer px-2 py-1 text-xs font-medium bg-blue-600 text-white rounded-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors",
                        "aria-label": "Add tag",
                        children: updateContact.isPending ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                            className: "animate-spin h-3 w-3",
                            xmlns: "http://www.w3.org/2000/svg",
                            fill: "none",
                            viewBox: "0 0 24 24",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                                    className: "opacity-25",
                                    cx: "12",
                                    cy: "12",
                                    r: "10",
                                    stroke: "currentColor",
                                    strokeWidth: "4"
                                }, void 0, false, {
                                    fileName: "[project]/app/(crm)/_components/QuickTag.tsx",
                                    lineNumber: 165,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                    className: "opacity-75",
                                    fill: "currentColor",
                                    d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                }, void 0, false, {
                                    fileName: "[project]/app/(crm)/_components/QuickTag.tsx",
                                    lineNumber: 173,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/(crm)/_components/QuickTag.tsx",
                            lineNumber: 159,
                            columnNumber: 13
                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                            className: "w-3 h-3",
                            fill: "none",
                            stroke: "currentColor",
                            viewBox: "0 0 24 24",
                            strokeWidth: 2,
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                strokeLinecap: "round",
                                strokeLinejoin: "round",
                                d: "M5 13l4 4L19 7"
                            }, void 0, false, {
                                fileName: "[project]/app/(crm)/_components/QuickTag.tsx",
                                lineNumber: 187,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/app/(crm)/_components/QuickTag.tsx",
                            lineNumber: 180,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/(crm)/_components/QuickTag.tsx",
                        lineNumber: 152,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        onClick: handleCancel,
                        disabled: updateContact.isPending,
                        className: "cursor-pointer px-2 py-1 text-xs font-medium border border-theme-light rounded-sm disabled:opacity-50 disabled:cursor-not-allowed transition-colors",
                        style: {
                            color: 'var(--foreground)'
                        },
                        onMouseEnter: (e)=>{
                            if (!updateContact.isPending) {
                                e.currentTarget.style.backgroundColor = 'var(--surface-hover)';
                            }
                        },
                        onMouseLeave: (e)=>{
                            e.currentTarget.style.backgroundColor = 'transparent';
                        },
                        "aria-label": "Cancel",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                            className: "w-3 h-3",
                            fill: "none",
                            stroke: "currentColor",
                            viewBox: "0 0 24 24",
                            strokeWidth: 2,
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                strokeLinecap: "round",
                                strokeLinejoin: "round",
                                d: "M6 18L18 6M6 6l12 12"
                            }, void 0, false, {
                                fileName: "[project]/app/(crm)/_components/QuickTag.tsx",
                                lineNumber: 220,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/app/(crm)/_components/QuickTag.tsx",
                            lineNumber: 213,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/(crm)/_components/QuickTag.tsx",
                        lineNumber: 195,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/(crm)/_components/QuickTag.tsx",
                lineNumber: 138,
                columnNumber: 7
            }, this),
            error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "text-xs text-red-600 whitespace-nowrap",
                role: "alert",
                children: error
            }, void 0, false, {
                fileName: "[project]/app/(crm)/_components/QuickTag.tsx",
                lineNumber: 229,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/(crm)/_components/QuickTag.tsx",
        lineNumber: 133,
        columnNumber: 5
    }, this);
}
_s(QuickTag, "sUo0v2pnxVXdhnk347aH79yANkY=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useContactMutations$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useUpdateContact"]
    ];
});
_c = QuickTag;
var _c;
__turbopack_context__.k.register(_c, "QuickTag");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/(crm)/_components/ContactMenuDropdown.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ContactMenuDropdown
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useContactMutations$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hooks/useContactMutations.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useAuth$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hooks/useAuth.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Modal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/Modal.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/Button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ErrorMessage$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/components/ErrorMessage.tsx [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$error$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/error-utils.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$error$2d$reporting$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/lib/error-reporting/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$util$2f$contact$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/util/contact-utils.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
;
;
function ContactMenuDropdown({ contact, onArchiveComplete, onDeleteComplete }) {
    _s();
    const [isOpen, setIsOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [showDeleteModal, setShowDeleteModal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [showArchiveModal, setShowArchiveModal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [deleteError, setDeleteError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [archiveError, setArchiveError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const dropdownRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const { user } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useAuth$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"])();
    const userId = user?.uid;
    const deleteContactMutation = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useContactMutations$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useDeleteContact"])();
    const archiveContactMutation = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useContactMutations$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useArchiveContact"])(userId);
    // Close dropdown when clicking outside
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ContactMenuDropdown.useEffect": ()=>{
            const handleClickOutside = {
                "ContactMenuDropdown.useEffect.handleClickOutside": (event)=>{
                    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                        setIsOpen(false);
                    }
                }
            }["ContactMenuDropdown.useEffect.handleClickOutside"];
            if (isOpen) {
                document.addEventListener("mousedown", handleClickOutside);
            }
            return ({
                "ContactMenuDropdown.useEffect": ()=>{
                    document.removeEventListener("mousedown", handleClickOutside);
                }
            })["ContactMenuDropdown.useEffect"];
        }
    }["ContactMenuDropdown.useEffect"], [
        isOpen
    ]);
    const handleArchive = ()=>{
        setArchiveError(null);
        archiveContactMutation.mutate({
            contactId: contact.id,
            archived: !contact.archived
        }, {
            onSuccess: ()=>{
                setShowArchiveModal(false);
                setIsOpen(false);
                onArchiveComplete?.();
            },
            onError: (error)=>{
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$error$2d$reporting$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["reportException"])(error, {
                    context: "Archiving contact in ContactMenuDropdown",
                    tags: {
                        component: "ContactMenuDropdown",
                        contactId: contact.id
                    }
                });
                setArchiveError((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$error$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["extractErrorMessage"])(error));
            }
        });
    };
    const handleDelete = ()=>{
        setDeleteError(null);
        deleteContactMutation.mutate(contact.id, {
            onSuccess: ()=>{
                setShowDeleteModal(false);
                setIsOpen(false);
                onDeleteComplete?.();
                // Navigate to contacts page if on a detail page
                if (window.location.pathname.startsWith("/contacts/") && window.location.pathname !== "/contacts") {
                    window.location.href = "/contacts";
                }
            },
            onError: (error)=>{
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$error$2d$reporting$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["reportException"])(error, {
                    context: "Deleting contact in ContactMenuDropdown",
                    tags: {
                        component: "ContactMenuDropdown",
                        contactId: contact.id
                    }
                });
                setDeleteError((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$error$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["extractErrorMessage"])(error));
            }
        });
    };
    const contactName = (0, __TURBOPACK__imported__module__$5b$project$5d2f$util$2f$contact$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getDisplayName"])(contact);
    const isArchived = contact.archived || false;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Modal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                isOpen: showDeleteModal,
                onClose: ()=>setShowDeleteModal(false),
                title: "Delete Contact",
                closeOnBackdropClick: !deleteContactMutation.isPending,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-theme-dark mb-6",
                        children: [
                            "Are you sure you want to delete ",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                children: contactName
                            }, void 0, false, {
                                fileName: "[project]/app/(crm)/_components/ContactMenuDropdown.tsx",
                                lineNumber: 116,
                                columnNumber: 43
                            }, this),
                            "? This action cannot be undone."
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/(crm)/_components/ContactMenuDropdown.tsx",
                        lineNumber: 115,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex gap-3 justify-end",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                onClick: ()=>setShowDeleteModal(false),
                                disabled: deleteContactMutation.isPending,
                                variant: "outline",
                                size: "sm",
                                children: "Cancel"
                            }, void 0, false, {
                                fileName: "[project]/app/(crm)/_components/ContactMenuDropdown.tsx",
                                lineNumber: 119,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                onClick: handleDelete,
                                disabled: deleteContactMutation.isPending,
                                loading: deleteContactMutation.isPending,
                                variant: "danger",
                                size: "sm",
                                error: deleteError,
                                children: "Delete"
                            }, void 0, false, {
                                fileName: "[project]/app/(crm)/_components/ContactMenuDropdown.tsx",
                                lineNumber: 127,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/(crm)/_components/ContactMenuDropdown.tsx",
                        lineNumber: 118,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/(crm)/_components/ContactMenuDropdown.tsx",
                lineNumber: 109,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Modal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                isOpen: showArchiveModal,
                onClose: ()=>setShowArchiveModal(false),
                title: isArchived ? "Unarchive Contact" : "Archive Contact",
                closeOnBackdropClick: !archiveContactMutation.isPending,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-theme-dark mb-6",
                        children: isArchived ? `Are you sure you want to unarchive ${contactName}? They will appear in your contacts list again.` : `Are you sure you want to archive ${contactName}? They will be hidden from your main contacts view but can be restored later.`
                    }, void 0, false, {
                        fileName: "[project]/app/(crm)/_components/ContactMenuDropdown.tsx",
                        lineNumber: 147,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex gap-3 justify-end",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                onClick: ()=>setShowArchiveModal(false),
                                disabled: archiveContactMutation.isPending,
                                variant: "outline",
                                size: "sm",
                                children: "Cancel"
                            }, void 0, false, {
                                fileName: "[project]/app/(crm)/_components/ContactMenuDropdown.tsx",
                                lineNumber: 153,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                onClick: handleArchive,
                                disabled: archiveContactMutation.isPending,
                                loading: archiveContactMutation.isPending,
                                variant: "primary",
                                size: "sm",
                                error: archiveError,
                                children: isArchived ? "Unarchive" : "Archive"
                            }, void 0, false, {
                                fileName: "[project]/app/(crm)/_components/ContactMenuDropdown.tsx",
                                lineNumber: 161,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/(crm)/_components/ContactMenuDropdown.tsx",
                        lineNumber: 152,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/(crm)/_components/ContactMenuDropdown.tsx",
                lineNumber: 141,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "relative",
                ref: dropdownRef,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: (e)=>{
                            e.stopPropagation();
                            setIsOpen(!isOpen);
                        },
                        className: `p-1.5 rounded-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 ${isOpen ? "bg-card-light" : "hover:bg-card-light"}`,
                        "aria-label": "Contact options",
                        "aria-expanded": isOpen,
                        "aria-haspopup": "true",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                            className: "w-5 h-5 text-foreground",
                            fill: "none",
                            stroke: "currentColor",
                            viewBox: "0 0 24 24",
                            "aria-hidden": "true",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                strokeLinecap: "round",
                                strokeLinejoin: "round",
                                strokeWidth: 2,
                                d: "M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                            }, void 0, false, {
                                fileName: "[project]/app/(crm)/_components/ContactMenuDropdown.tsx",
                                lineNumber: 197,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/app/(crm)/_components/ContactMenuDropdown.tsx",
                            lineNumber: 190,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/(crm)/_components/ContactMenuDropdown.tsx",
                        lineNumber: 176,
                        columnNumber: 9
                    }, this),
                    isOpen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "fixed inset-0 z-10",
                                onClick: ()=>setIsOpen(false),
                                "aria-hidden": "true"
                            }, void 0, false, {
                                fileName: "[project]/app/(crm)/_components/ContactMenuDropdown.tsx",
                                lineNumber: 210,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "absolute right-0 bottom-full mb-1 z-20 w-48 bg-card-highlight-light border border-theme-lighter rounded-sm shadow-lg py-1",
                                role: "menu",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: (e)=>{
                                            e.stopPropagation();
                                            setIsOpen(false);
                                            setShowArchiveModal(true);
                                        },
                                        className: "w-full text-left px-4 py-2 text-sm text-foreground hover:bg-selected-active transition-colors",
                                        role: "menuitem",
                                        children: isArchived ? "Unarchive" : "Archive"
                                    }, void 0, false, {
                                        fileName: "[project]/app/(crm)/_components/ContactMenuDropdown.tsx",
                                        lineNumber: 219,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: (e)=>{
                                            e.stopPropagation();
                                            setIsOpen(false);
                                            setShowDeleteModal(true);
                                        },
                                        className: "w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-selected-active transition-colors",
                                        role: "menuitem",
                                        children: "Delete"
                                    }, void 0, false, {
                                        fileName: "[project]/app/(crm)/_components/ContactMenuDropdown.tsx",
                                        lineNumber: 230,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/(crm)/_components/ContactMenuDropdown.tsx",
                                lineNumber: 215,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true)
                ]
            }, void 0, true, {
                fileName: "[project]/app/(crm)/_components/ContactMenuDropdown.tsx",
                lineNumber: 175,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true);
}
_s(ContactMenuDropdown, "ku/zGgqj7YdzZyHE5Sf69k3+H8o=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useAuth$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"],
        __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useContactMutations$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useDeleteContact"],
        __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useContactMutations$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useArchiveContact"]
    ];
});
_c = ContactMenuDropdown;
var _c;
__turbopack_context__.k.register(_c, "ContactMenuDropdown");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/(crm)/_components/ContactCard.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ContactCard
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$util$2f$contact$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/util/contact-utils.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$crm$292f$_components$2f$TouchpointStatusActions$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/(crm)/_components/TouchpointStatusActions.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$crm$292f$_components$2f$QuickTag$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/(crm)/_components/QuickTag.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$crm$292f$_components$2f$ContactMenuDropdown$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/(crm)/_components/ContactMenuDropdown.tsx [app-client] (ecmascript)");
"use client";
;
;
;
;
;
;
function ContactCard({ contact, showCheckbox = false, isSelected = false, onSelectChange, variant = "default", showArrow = true, touchpointDate, daysUntil, needsReminder = false, showTouchpointActions = false, onTouchpointStatusUpdate, userId }) {
    const isTouchpointVariant = variant === "touchpoint-upcoming" || variant === "touchpoint-overdue";
    const getVariantStyles = ()=>{
        if (isSelected) return "ring-2 ring-blue-500 bg-card-active";
        switch(variant){
            case "selected":
                return "ring-2 ring-blue-500 bg-card-active";
            case "touchpoint-upcoming":
                return needsReminder ? "bg-card-upcoming border border-card-upcoming-dark" : "border border-theme-light";
            case "touchpoint-overdue":
                return "bg-card-overdue border border-card-overdue-dark";
            default:
                return "border border-theme-light";
        }
    };
    const formatTouchpointDate = ()=>{
        if (!touchpointDate || daysUntil === null || daysUntil === undefined) return null;
        if (variant === "touchpoint-overdue") {
            return daysUntil < 0 ? `Overdue ${Math.abs(daysUntil)} day${Math.abs(daysUntil) !== 1 ? "s" : ""}` : "Overdue";
        }
        if (daysUntil === 0) return "Today";
        if (daysUntil === 1) return "Tomorrow";
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$util$2f$contact$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatContactDate"])(touchpointDate, {
            relative: true
        });
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: `rounded-sm p-4 transition-all duration-200 ${getVariantStyles()} relative`,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-start gap-3",
                children: [
                    showCheckbox && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                        className: "flex items-center pt-1 cursor-pointer",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                            type: "checkbox",
                            checked: isSelected,
                            onChange: ()=>onSelectChange?.(contact.id),
                            onClick: (e)=>e.stopPropagation(),
                            className: "w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        }, void 0, false, {
                            fileName: "[project]/app/(crm)/_components/ContactCard.tsx",
                            lineNumber: 81,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/(crm)/_components/ContactCard.tsx",
                        lineNumber: 80,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex-1 min-w-0 flex items-start xl:items-stretch gap-3",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                href: `/contacts/${contact.id}`,
                                className: "flex items-start gap-3 flex-1 min-w-0 xl:flex-[1_1_60%] xl:max-w-[60%] group",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "shrink-0",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: `w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm shadow-sm bg-linear-to-br from-blue-500 to-purple-600`,
                                            children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$util$2f$contact$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getInitials"])(contact)
                                        }, void 0, false, {
                                            fileName: "[project]/app/(crm)/_components/ContactCard.tsx",
                                            lineNumber: 100,
                                            columnNumber: 15
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/app/(crm)/_components/ContactCard.tsx",
                                        lineNumber: 99,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex-1 min-w-0",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex flex-col xxl:flex-row items-start justify-between gap-2 mb-1",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex-1 min-w-0",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                                className: `text-sm font-semibold group-hover:text-theme-darker transition-colors text-theme-darkest wrap-break-word`,
                                                                children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$util$2f$contact$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getDisplayName"])(contact)
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/(crm)/_components/ContactCard.tsx",
                                                                lineNumber: 109,
                                                                columnNumber: 19
                                                            }, this),
                                                            contact.company && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "text-xs text-theme-dark mt-0.5 wrap-break-word",
                                                                children: contact.company
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/(crm)/_components/ContactCard.tsx",
                                                                lineNumber: 113,
                                                                columnNumber: 21
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/(crm)/_components/ContactCard.tsx",
                                                        lineNumber: 108,
                                                        columnNumber: 17
                                                    }, this),
                                                    isTouchpointVariant && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex items-center gap-1.5 sm:gap-2 shrink-0 flex-wrap",
                                                        children: [
                                                            variant === "touchpoint-upcoming" && needsReminder && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "px-2 py-1 text-xs font-medium text-theme-darker border border-theme-medium rounded-sm whitespace-nowrap",
                                                                children: "Due Soon"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/(crm)/_components/ContactCard.tsx",
                                                                lineNumber: 122,
                                                                columnNumber: 23
                                                            }, this),
                                                            variant === "touchpoint-overdue" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "px-2 py-1 text-xs font-medium text-theme-darker border border-theme-medium rounded-sm whitespace-nowrap",
                                                                children: "Overdue"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/(crm)/_components/ContactCard.tsx",
                                                                lineNumber: 127,
                                                                columnNumber: 23
                                                            }, this),
                                                            formatTouchpointDate() && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: `text-xs font-medium px-2 py-1 rounded-sm whitespace-nowrap ${variant === "touchpoint-overdue" ? "text-theme-darker border border-theme-medium" : daysUntil !== null && daysUntil !== undefined && daysUntil <= 3 ? "text-theme-darker border border-theme-medium" : "text-theme-darker border border-theme-medium"}`,
                                                                children: formatTouchpointDate()
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/(crm)/_components/ContactCard.tsx",
                                                                lineNumber: 132,
                                                                columnNumber: 23
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/(crm)/_components/ContactCard.tsx",
                                                        lineNumber: 120,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/(crm)/_components/ContactCard.tsx",
                                                lineNumber: 107,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: `text-xs truncate mb-2 text-theme-dark`,
                                                children: contact.primaryEmail
                                            }, void 0, false, {
                                                fileName: "[project]/app/(crm)/_components/ContactCard.tsx",
                                                lineNumber: 145,
                                                columnNumber: 15
                                            }, this),
                                            !isTouchpointVariant && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex flex-col gap-0.5 mb-2",
                                                children: [
                                                    contact.lastEmailDate != null && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-xs text-gray-400 flex items-center gap-1",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                                className: "w-3 h-3 shrink-0",
                                                                fill: "none",
                                                                stroke: "currentColor",
                                                                viewBox: "0 0 24 24",
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                                    strokeLinecap: "round",
                                                                    strokeLinejoin: "round",
                                                                    strokeWidth: 2,
                                                                    d: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/(crm)/_components/ContactCard.tsx",
                                                                    lineNumber: 160,
                                                                    columnNumber: 25
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/(crm)/_components/ContactCard.tsx",
                                                                lineNumber: 154,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "truncate",
                                                                children: [
                                                                    "Last email: ",
                                                                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$util$2f$contact$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatContactDate"])(contact.lastEmailDate, {
                                                                        relative: true
                                                                    })
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/app/(crm)/_components/ContactCard.tsx",
                                                                lineNumber: 167,
                                                                columnNumber: 23
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/(crm)/_components/ContactCard.tsx",
                                                        lineNumber: 153,
                                                        columnNumber: 21
                                                    }, this),
                                                    contact.updatedAt != null && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-xs text-gray-400 flex items-center gap-1",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                                className: "w-3 h-3 shrink-0",
                                                                fill: "none",
                                                                stroke: "currentColor",
                                                                viewBox: "0 0 24 24",
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                                    strokeLinecap: "round",
                                                                    strokeLinejoin: "round",
                                                                    strokeWidth: 2,
                                                                    d: "M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/(crm)/_components/ContactCard.tsx",
                                                                    lineNumber: 178,
                                                                    columnNumber: 25
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/(crm)/_components/ContactCard.tsx",
                                                                lineNumber: 172,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "truncate",
                                                                children: [
                                                                    "Updated: ",
                                                                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$util$2f$contact$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatContactDate"])(contact.updatedAt, {
                                                                        relative: true
                                                                    })
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/app/(crm)/_components/ContactCard.tsx",
                                                                lineNumber: 185,
                                                                columnNumber: 23
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/(crm)/_components/ContactCard.tsx",
                                                        lineNumber: 171,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/(crm)/_components/ContactCard.tsx",
                                                lineNumber: 151,
                                                columnNumber: 17
                                            }, this),
                                            !isTouchpointVariant && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex flex-wrap items-center gap-1.5 mt-1.5 xl:hidden",
                                                children: [
                                                    contact.segment && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "px-2 py-1 text-xs font-medium text-theme-darkest rounded whitespace-nowrap border border-theme-dark",
                                                        children: contact.segment
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/(crm)/_components/ContactCard.tsx",
                                                        lineNumber: 195,
                                                        columnNumber: 21
                                                    }, this),
                                                    contact.tags && contact.tags.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                        children: [
                                                            contact.tags.slice(0, 3).map((tag, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "px-2 py-1 text-xs font-medium border border-card-tag rounded-sm",
                                                                    style: {
                                                                        color: 'var(--foreground)'
                                                                    },
                                                                    children: tag
                                                                }, idx, false, {
                                                                    fileName: "[project]/app/(crm)/_components/ContactCard.tsx",
                                                                    lineNumber: 203,
                                                                    columnNumber: 25
                                                                }, this)),
                                                            contact.tags.length > 3 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "px-2 py-1 text-xs font-medium text-theme-dark",
                                                                children: [
                                                                    "+",
                                                                    contact.tags.length - 3
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/app/(crm)/_components/ContactCard.tsx",
                                                                lineNumber: 212,
                                                                columnNumber: 25
                                                            }, this)
                                                        ]
                                                    }, void 0, true)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/(crm)/_components/ContactCard.tsx",
                                                lineNumber: 193,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/(crm)/_components/ContactCard.tsx",
                                        lineNumber: 106,
                                        columnNumber: 13
                                    }, this),
                                    showArrow && !isTouchpointVariant && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "hidden xl:block shrink-0 opacity-0 group-hover:opacity-100 transition-opacity",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                            className: "w-5 h-5 text-gray-400",
                                            fill: "none",
                                            stroke: "currentColor",
                                            viewBox: "0 0 24 24",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                strokeLinecap: "round",
                                                strokeLinejoin: "round",
                                                strokeWidth: 2,
                                                d: "M9 5l7 7-7 7"
                                            }, void 0, false, {
                                                fileName: "[project]/app/(crm)/_components/ContactCard.tsx",
                                                lineNumber: 231,
                                                columnNumber: 19
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/app/(crm)/_components/ContactCard.tsx",
                                            lineNumber: 225,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/app/(crm)/_components/ContactCard.tsx",
                                        lineNumber: 224,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/(crm)/_components/ContactCard.tsx",
                                lineNumber: 94,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "hidden xl:flex items-stretch shrink-0 px-2",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "w-px bg-theme-light/30 my-2"
                                }, void 0, false, {
                                    fileName: "[project]/app/(crm)/_components/ContactCard.tsx",
                                    lineNumber: 244,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/app/(crm)/_components/ContactCard.tsx",
                                lineNumber: 243,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "hidden xl:flex flex-col items-end gap-2 shrink-0 ml-auto",
                                children: [
                                    !isTouchpointVariant && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "z-10",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$crm$292f$_components$2f$ContactMenuDropdown$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                            contact: contact
                                        }, void 0, false, {
                                            fileName: "[project]/app/(crm)/_components/ContactCard.tsx",
                                            lineNumber: 252,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/app/(crm)/_components/ContactCard.tsx",
                                        lineNumber: 251,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: `flex ${isTouchpointVariant ? 'items-center' : 'flex-col items-end'} gap-2`,
                                        children: [
                                            contact.segment && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: `px-2 py-1 text-xs font-medium text-theme-darkest rounded whitespace-nowrap border border-theme-dark`,
                                                children: contact.segment
                                            }, void 0, false, {
                                                fileName: "[project]/app/(crm)/_components/ContactCard.tsx",
                                                lineNumber: 259,
                                                columnNumber: 17
                                            }, this),
                                            !isTouchpointVariant && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex flex-wrap gap-1 justify-end items-center",
                                                children: [
                                                    userId && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$crm$292f$_components$2f$QuickTag$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                        contactId: contact.id,
                                                        userId: userId,
                                                        existingTags: contact.tags
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/(crm)/_components/ContactCard.tsx",
                                                        lineNumber: 268,
                                                        columnNumber: 21
                                                    }, this),
                                                    contact.tags && contact.tags.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                        children: [
                                                            contact.tags.slice(0, 2).map((tag, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "px-2 py-1 text-xs font-medium border border-card-tag rounded-sm",
                                                                    style: {
                                                                        color: 'var(--foreground)'
                                                                    },
                                                                    children: tag
                                                                }, idx, false, {
                                                                    fileName: "[project]/app/(crm)/_components/ContactCard.tsx",
                                                                    lineNumber: 278,
                                                                    columnNumber: 25
                                                                }, this)),
                                                            contact.tags.length > 2 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "px-2 py-1 text-xs font-medium text-theme-dark",
                                                                children: [
                                                                    "+",
                                                                    contact.tags.length - 2
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/app/(crm)/_components/ContactCard.tsx",
                                                                lineNumber: 287,
                                                                columnNumber: 25
                                                            }, this)
                                                        ]
                                                    }, void 0, true)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/(crm)/_components/ContactCard.tsx",
                                                lineNumber: 265,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/(crm)/_components/ContactCard.tsx",
                                        lineNumber: 257,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/(crm)/_components/ContactCard.tsx",
                                lineNumber: 248,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/(crm)/_components/ContactCard.tsx",
                        lineNumber: 92,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/(crm)/_components/ContactCard.tsx",
                lineNumber: 77,
                columnNumber: 7
            }, this),
            !isTouchpointVariant && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "xl:hidden absolute top-3 right-3 z-10",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$crm$292f$_components$2f$ContactMenuDropdown$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                    contact: contact
                }, void 0, false, {
                    fileName: "[project]/app/(crm)/_components/ContactCard.tsx",
                    lineNumber: 303,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/(crm)/_components/ContactCard.tsx",
                lineNumber: 302,
                columnNumber: 9
            }, this),
            isTouchpointVariant && contact.nextTouchpointMessage && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mt-2 mb-3",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: `text-xs sm:text-sm rounded px-2.5 sm:px-3 py-2 sm:py-1.5 line-clamp-2 sm:line-clamp-none w-full block wrap-break-word`,
                    children: contact.nextTouchpointMessage
                }, void 0, false, {
                    fileName: "[project]/app/(crm)/_components/ContactCard.tsx",
                    lineNumber: 310,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/(crm)/_components/ContactCard.tsx",
                lineNumber: 309,
                columnNumber: 9
            }, this),
            showTouchpointActions && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: `pt-3 border-t ${variant === "touchpoint-overdue" ? "border-red-200" : needsReminder ? "border-amber-200" : "border-gray-200"}`,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$crm$292f$_components$2f$TouchpointStatusActions$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                    contactId: contact.id,
                    contactName: (0, __TURBOPACK__imported__module__$5b$project$5d2f$util$2f$contact$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getDisplayName"])(contact),
                    userId: userId || "",
                    currentStatus: contact.touchpointStatus,
                    compact: true,
                    onStatusUpdate: onTouchpointStatusUpdate
                }, void 0, false, {
                    fileName: "[project]/app/(crm)/_components/ContactCard.tsx",
                    lineNumber: 325,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/(crm)/_components/ContactCard.tsx",
                lineNumber: 318,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/(crm)/_components/ContactCard.tsx",
        lineNumber: 74,
        columnNumber: 5
    }, this);
}
_c = ContactCard;
var _c;
__turbopack_context__.k.register(_c, "ContactCard");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/ViewAllLink.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ViewAllLink
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
;
;
function ViewAllLink({ href, label = "View All →" }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
        href: href,
        className: "text-sm text-blue-600 hover:text-blue-800 hover:underline font-medium ml-auto",
        children: label
    }, void 0, false, {
        fileName: "[project]/components/ViewAllLink.tsx",
        lineNumber: 10,
        columnNumber: 5
    }, this);
}
_c = ViewAllLink;
var _c;
__turbopack_context__.k.register(_c, "ViewAllLink");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/BulkActionsBar.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>BulkActionsBar
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/Card.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/Button.tsx [app-client] (ecmascript)");
"use client";
;
;
;
function BulkActionsBar({ selectedCount, itemLabel, actions, className = "" }) {
    if (selectedCount === 0) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
        padding: "md",
        className: `bg-blue-50 border-blue-200 mb-4 ${className}`,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "text-sm font-medium text-theme-darkest whitespace-nowrap",
                        children: [
                            selectedCount,
                            " ",
                            itemLabel,
                            selectedCount !== 1 ? "s" : "",
                            " selected"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/BulkActionsBar.tsx",
                        lineNumber: 37,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/components/BulkActionsBar.tsx",
                    lineNumber: 36,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex flex-col sm:flex-row gap-2 w-full xl:w-auto",
                    children: actions.map((action, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                            onClick: action.onClick,
                            disabled: action.disabled,
                            loading: action.loading,
                            variant: action.variant,
                            size: "sm",
                            fullWidth: true,
                            className: "sm:w-auto whitespace-nowrap shrink-0",
                            icon: action.icon,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "hidden sm:inline",
                                    children: action.label
                                }, void 0, false, {
                                    fileName: "[project]/components/BulkActionsBar.tsx",
                                    lineNumber: 54,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "sm:hidden",
                                    children: action.labelMobile || action.label
                                }, void 0, false, {
                                    fileName: "[project]/components/BulkActionsBar.tsx",
                                    lineNumber: 55,
                                    columnNumber: 15
                                }, this),
                                action.showCount && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "ml-1 font-semibold",
                                    children: [
                                        "(",
                                        selectedCount,
                                        ")"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/BulkActionsBar.tsx",
                                    lineNumber: 56,
                                    columnNumber: 36
                                }, this)
                            ]
                        }, index, true, {
                            fileName: "[project]/components/BulkActionsBar.tsx",
                            lineNumber: 43,
                            columnNumber: 13
                        }, this))
                }, void 0, false, {
                    fileName: "[project]/components/BulkActionsBar.tsx",
                    lineNumber: 41,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/components/BulkActionsBar.tsx",
            lineNumber: 35,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/BulkActionsBar.tsx",
        lineNumber: 34,
        columnNumber: 5
    }, this);
}
_c = BulkActionsBar;
var _c;
__turbopack_context__.k.register(_c, "BulkActionsBar");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/(crm)/_components/TouchpointBulkActions.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>TouchpointBulkActions
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$BulkActionsBar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/BulkActionsBar.tsx [app-client] (ecmascript)");
"use client";
;
;
function TouchpointBulkActions({ selectedCount, onMarkAsContacted, onSkip, isLoading = false }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$BulkActionsBar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
        selectedCount: selectedCount,
        itemLabel: "touchpoint",
        actions: [
            {
                label: "Mark as Contacted",
                labelMobile: "Mark Contacted",
                onClick: onMarkAsContacted,
                variant: "secondary",
                disabled: isLoading,
                loading: isLoading,
                showCount: true,
                icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                    className: "w-4 h-4 shrink-0",
                    fill: "none",
                    stroke: "currentColor",
                    viewBox: "0 0 24 24",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                        strokeLinecap: "round",
                        strokeLinejoin: "round",
                        strokeWidth: 2,
                        d: "M5 13l4 4L19 7"
                    }, void 0, false, {
                        fileName: "[project]/app/(crm)/_components/TouchpointBulkActions.tsx",
                        lineNumber: 33,
                        columnNumber: 15
                    }, void 0)
                }, void 0, false, {
                    fileName: "[project]/app/(crm)/_components/TouchpointBulkActions.tsx",
                    lineNumber: 32,
                    columnNumber: 13
                }, void 0)
            },
            {
                label: "Skip Touchpoint",
                labelMobile: "Skip",
                onClick: onSkip,
                variant: "outline",
                disabled: isLoading,
                loading: isLoading,
                showCount: true,
                icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                    className: "w-4 h-4 shrink-0",
                    fill: "none",
                    stroke: "currentColor",
                    viewBox: "0 0 24 24",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                        strokeLinecap: "round",
                        strokeLinejoin: "round",
                        strokeWidth: 2,
                        d: "M6 18L18 6M6 6l12 12"
                    }, void 0, false, {
                        fileName: "[project]/app/(crm)/_components/TouchpointBulkActions.tsx",
                        lineNumber: 47,
                        columnNumber: 15
                    }, void 0)
                }, void 0, false, {
                    fileName: "[project]/app/(crm)/_components/TouchpointBulkActions.tsx",
                    lineNumber: 46,
                    columnNumber: 13
                }, void 0)
            }
        ]
    }, void 0, false, {
        fileName: "[project]/app/(crm)/_components/TouchpointBulkActions.tsx",
        lineNumber: 19,
        columnNumber: 5
    }, this);
}
_c = TouchpointBulkActions;
var _c;
__turbopack_context__.k.register(_c, "TouchpointBulkActions");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/Checkbox.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Checkbox
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
;
function Checkbox({ label, labelClassName = "", className = "", ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
        className: `flex items-center gap-3 cursor-pointer ${labelClassName}`,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                type: "checkbox",
                ...props,
                className: `w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 ${className}`
            }, void 0, false, {
                fileName: "[project]/components/Checkbox.tsx",
                lineNumber: 18,
                columnNumber: 7
            }, this),
            label && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "text-sm text-theme-darker select-none",
                children: label
            }, void 0, false, {
                fileName: "[project]/components/Checkbox.tsx",
                lineNumber: 24,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/Checkbox.tsx",
        lineNumber: 17,
        columnNumber: 5
    }, this);
}
_c = Checkbox;
var _c;
__turbopack_context__.k.register(_c, "Checkbox");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/dashboard/EmptyState.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>EmptyState
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/Card.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/Button.tsx [app-client] (ecmascript)");
"use client";
;
;
;
;
function EmptyState({ message = "No contacts yet", description = "Get started by importing your contacts or adding your first contact", showActions = true, wrapInCard = false, size = "sm", className = "" }) {
    const iconSize = size === "lg" ? "w-16 h-16" : "w-12 h-12";
    const headingSize = size === "lg" ? "text-lg font-semibold" : "text-sm font-medium";
    const padding = size === "lg" ? "xl" : "md";
    const iconMargin = size === "lg" ? "mb-4" : "mb-3";
    const textMargin = size === "lg" ? "mb-2" : "mb-1";
    const descriptionMargin = size === "lg" ? "mb-6" : "mb-4";
    const buttonGap = size === "lg" ? "gap-3" : "gap-2";
    const content = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                className: `${iconSize} mx-auto ${iconMargin} text-gray-300`,
                fill: "none",
                stroke: "currentColor",
                viewBox: "0 0 24 24",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                    strokeLinecap: "round",
                    strokeLinejoin: "round",
                    strokeWidth: 2,
                    d: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                }, void 0, false, {
                    fileName: "[project]/components/dashboard/EmptyState.tsx",
                    lineNumber: 40,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/dashboard/EmptyState.tsx",
                lineNumber: 34,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: `${headingSize} text-theme-darkest ${textMargin}`,
                children: message
            }, void 0, false, {
                fileName: "[project]/components/dashboard/EmptyState.tsx",
                lineNumber: 47,
                columnNumber: 7
            }, this),
            description && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: `text-xs text-gray-500 ${descriptionMargin}`,
                children: description
            }, void 0, false, {
                fileName: "[project]/components/dashboard/EmptyState.tsx",
                lineNumber: 49,
                columnNumber: 9
            }, this),
            showActions && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: `flex flex-col sm:flex-row ${buttonGap} justify-center`,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        href: "/contacts/import",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                            size: "sm",
                            children: [
                                size === "lg" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                    className: "w-4 h-4",
                                    fill: "none",
                                    stroke: "currentColor",
                                    viewBox: "0 0 24 24",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                        strokeLinecap: "round",
                                        strokeLinejoin: "round",
                                        strokeWidth: 2,
                                        d: "M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                                    }, void 0, false, {
                                        fileName: "[project]/components/dashboard/EmptyState.tsx",
                                        lineNumber: 57,
                                        columnNumber: 19
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/components/dashboard/EmptyState.tsx",
                                    lineNumber: 56,
                                    columnNumber: 17
                                }, this),
                                "Import Contacts"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/dashboard/EmptyState.tsx",
                            lineNumber: 54,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/components/dashboard/EmptyState.tsx",
                        lineNumber: 53,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        href: "/contacts/new",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                            variant: "outline",
                            size: "sm",
                            children: [
                                size === "lg" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                    className: "w-4 h-4",
                                    fill: "none",
                                    stroke: "currentColor",
                                    viewBox: "0 0 24 24",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                        strokeLinecap: "round",
                                        strokeLinejoin: "round",
                                        strokeWidth: 2,
                                        d: "M12 4v16m8-8H4"
                                    }, void 0, false, {
                                        fileName: "[project]/components/dashboard/EmptyState.tsx",
                                        lineNumber: 72,
                                        columnNumber: 19
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/components/dashboard/EmptyState.tsx",
                                    lineNumber: 71,
                                    columnNumber: 17
                                }, this),
                                "Add Contact"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/dashboard/EmptyState.tsx",
                            lineNumber: 69,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/components/dashboard/EmptyState.tsx",
                        lineNumber: 68,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/dashboard/EmptyState.tsx",
                lineNumber: 52,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true);
    if (wrapInCard) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
            padding: padding,
            className: `text-center ${className}`,
            children: content
        }, void 0, false, {
            fileName: "[project]/components/dashboard/EmptyState.tsx",
            lineNumber: 90,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: `text-center ${size === "lg" ? "py-0" : "py-6"} ${className}`,
        children: content
    }, void 0, false, {
        fileName: "[project]/components/dashboard/EmptyState.tsx",
        lineNumber: 97,
        columnNumber: 5
    }, this);
}
_c = EmptyState;
var _c;
__turbopack_context__.k.register(_c, "EmptyState");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/(crm)/_components/DashboardTouchpoints.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>DashboardTouchpoints
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ThemedSuspense$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ThemedSuspense.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/Card.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$crm$292f$_components$2f$ContactCard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/(crm)/_components/ContactCard.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useContacts$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hooks/useContacts.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$util$2f$date$2d$utils$2d$server$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/util/date-utils-server.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useContactMutations$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hooks/useContactMutations.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useAuth$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hooks/useAuth.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$error$2d$reporting$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/lib/error-reporting/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ViewAllLink$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ViewAllLink.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$crm$292f$_components$2f$TouchpointBulkActions$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/(crm)/_components/TouchpointBulkActions.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Checkbox$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/Checkbox.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$dashboard$2f$EmptyState$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/dashboard/EmptyState.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
;
;
;
;
;
;
;
function TouchpointsContent({ userId }) {
    _s();
    const { user } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useAuth$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"])();
    const { data: contacts = [], isLoading: contactsLoading } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useContacts$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContacts"])(userId);
    const [selectedTouchpointIds, setSelectedTouchpointIds] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(new Set());
    const [bulkUpdating, setBulkUpdating] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const updateTouchpointStatusMutation = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useContactMutations$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useUpdateTouchpointStatus"])(user?.uid);
    // Show loading state if contacts are loading (suspense mode)
    if (contactsLoading) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
            padding: "sm",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center justify-between mb-4",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        className: "text-xl font-semibold text-theme-darkest",
                        children: "Recent Contacts"
                    }, void 0, false, {
                        fileName: "[project]/app/(crm)/_components/DashboardTouchpoints.tsx",
                        lineNumber: 37,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/app/(crm)/_components/DashboardTouchpoints.tsx",
                    lineNumber: 36,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ThemedSuspense$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                    isLoading: true,
                    variant: "list"
                }, void 0, false, {
                    fileName: "[project]/app/(crm)/_components/DashboardTouchpoints.tsx",
                    lineNumber: 39,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/app/(crm)/_components/DashboardTouchpoints.tsx",
            lineNumber: 35,
            columnNumber: 7
        }, this);
    }
    const toggleTouchpointSelection = (contactId)=>{
        setSelectedTouchpointIds((prev)=>{
            const newSet = new Set(prev);
            if (newSet.has(contactId)) {
                newSet.delete(contactId);
            } else {
                newSet.add(contactId);
            }
            return newSet;
        });
    };
    const handleBulkStatusUpdate = async (status)=>{
        if (selectedTouchpointIds.size === 0) return;
        const selectedIds = Array.from(selectedTouchpointIds);
        setBulkUpdating(true);
        try {
            const updates = selectedIds.map((contactId)=>updateTouchpointStatusMutation.mutateAsync({
                    contactId,
                    status
                }));
            const results = await Promise.allSettled(updates);
            const failures = results.filter((r)=>r.status === "rejected");
            const failureCount = failures.length;
            const successCount = selectedIds.length - failureCount;
            // Report all failures to Sentry
            failures.forEach((result, index)=>{
                if (result.status === "rejected") {
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$error$2d$reporting$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["reportException"])(result.reason, {
                        context: "Bulk updating touchpoint status in DashboardTouchpoints",
                        tags: {
                            component: "DashboardTouchpoints",
                            contactId: selectedIds[index],
                            status
                        }
                    });
                }
            });
            setSelectedTouchpointIds(new Set());
            if (failureCount > 0) {
                alert(`Updated ${successCount} of ${selectedIds.length} touchpoints. Some updates failed.`);
            }
        } catch (error) {
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$error$2d$reporting$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["reportException"])(error, {
                context: "Bulk updating touchpoint status in DashboardTouchpoints",
                tags: {
                    component: "DashboardTouchpoints",
                    status
                }
            });
            alert("Failed to update touchpoints. Please try again.");
        } finally{
            setBulkUpdating(false);
        }
    };
    const serverTime = new Date();
    const getTouchpointDate = (date)=>{
        if (!date) return null;
        if (date instanceof Date) return date;
        if (typeof date === "string") return new Date(date);
        if (typeof date === "object" && "toDate" in date) {
            return date.toDate();
        }
        return null;
    };
    const maxDaysAhead = 60;
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + maxDaysAhead);
    // Get today's date boundaries
    const todayStart = new Date(serverTime);
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date(serverTime);
    todayEnd.setHours(23, 59, 59, 999);
    // Filter for due today
    const contactsWithTodayTouchpoints = contacts.filter((contact)=>{
        if (contact.archived) return false;
        const touchpointDate = getTouchpointDate(contact.nextTouchpointDate);
        if (!touchpointDate) return false;
        const status = contact.touchpointStatus;
        if (status === "completed" || status === "cancelled") return false;
        return touchpointDate >= todayStart && touchpointDate <= todayEnd;
    }).map((contact)=>{
        const touchpointDate = getTouchpointDate(contact.nextTouchpointDate);
        const daysUntil = (0, __TURBOPACK__imported__module__$5b$project$5d2f$util$2f$date$2d$utils$2d$server$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getDaysUntilTouchpoint"])(contact.nextTouchpointDate, serverTime) || 0;
        return {
            ...contact,
            id: contact.contactId,
            touchpointDate,
            daysUntil,
            needsReminder: false
        };
    }).sort((a, b)=>a.touchpointDate.getTime() - b.touchpointDate.getTime()).slice(0, 3);
    // Calculate 30 days ago for overdue touchpoint limit
    const thirtyDaysAgo = new Date(serverTime);
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const contactsWithOverdueTouchpoints = contacts.filter((contact)=>{
        if (contact.archived) return false;
        const touchpointDate = getTouchpointDate(contact.nextTouchpointDate);
        if (!touchpointDate) return false;
        const status = contact.touchpointStatus;
        // Filter out completed, cancelled (skipped), and very old touchpoints
        if (status === "completed" || status === "cancelled") return false;
        // Only show overdue touchpoints within the last 30 days
        return touchpointDate < serverTime && touchpointDate >= thirtyDaysAgo;
    }).map((contact)=>{
        const touchpointDate = getTouchpointDate(contact.nextTouchpointDate);
        const daysUntil = (0, __TURBOPACK__imported__module__$5b$project$5d2f$util$2f$date$2d$utils$2d$server$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getDaysUntilTouchpoint"])(contact.nextTouchpointDate, serverTime) || 0;
        return {
            ...contact,
            id: contact.contactId,
            touchpointDate,
            daysUntil,
            needsReminder: false
        };
    }).sort((a, b)=>a.touchpointDate.getTime() - b.touchpointDate.getTime()).slice(0, 3);
    const contactsWithUpcomingTouchpoints = contacts.filter((contact)=>{
        if (contact.archived) return false;
        const touchpointDate = getTouchpointDate(contact.nextTouchpointDate);
        if (!touchpointDate) return false;
        const status = contact.touchpointStatus;
        if (status === "completed" || status === "cancelled") return false;
        return touchpointDate >= serverTime && touchpointDate <= maxDate;
    }).map((contact)=>{
        const touchpointDate = getTouchpointDate(contact.nextTouchpointDate);
        const daysUntil = (0, __TURBOPACK__imported__module__$5b$project$5d2f$util$2f$date$2d$utils$2d$server$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getDaysUntilTouchpoint"])(contact.nextTouchpointDate, serverTime) || 0;
        return {
            ...contact,
            id: contact.contactId,
            touchpointDate,
            daysUntil,
            needsReminder: daysUntil <= 7 && daysUntil >= 0
        };
    }).sort((a, b)=>a.touchpointDate.getTime() - b.touchpointDate.getTime()).slice(0, 3);
    const recentContacts = contacts.filter((contact)=>!contact.archived).map((contact)=>({
            ...contact,
            id: contact.contactId
        })).slice(0, 5);
    const renderBulkActions = (contactList)=>{
        const selectedInSection = Array.from(selectedTouchpointIds).filter((id)=>contactList.some((c)=>c.id === id));
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$crm$292f$_components$2f$TouchpointBulkActions$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
            selectedCount: selectedInSection.length,
            onMarkAsContacted: ()=>handleBulkStatusUpdate("completed"),
            onSkip: ()=>handleBulkStatusUpdate("cancelled"),
            isLoading: bulkUpdating
        }, void 0, false, {
            fileName: "[project]/app/(crm)/_components/DashboardTouchpoints.tsx",
            lineNumber: 219,
            columnNumber: 7
        }, this);
    };
    // Calculate total counts for headers
    const totalTodayCount = contacts.filter((contact)=>{
        if (contact.archived) return false;
        const touchpointDate = getTouchpointDate(contact.nextTouchpointDate);
        if (!touchpointDate) return false;
        const status = contact.touchpointStatus;
        if (status === "completed" || status === "cancelled") return false;
        return touchpointDate >= todayStart && touchpointDate <= todayEnd;
    }).length;
    const totalOverdueCount = contacts.filter((contact)=>{
        if (contact.archived) return false;
        const touchpointDate = getTouchpointDate(contact.nextTouchpointDate);
        if (!touchpointDate) return false;
        const status = contact.touchpointStatus;
        // Filter out completed, cancelled (skipped), and very old touchpoints
        if (status === "completed" || status === "cancelled") return false;
        // Only count overdue touchpoints within the last 30 days
        return touchpointDate < serverTime && touchpointDate >= thirtyDaysAgo;
    }).length;
    const totalUpcomingCount = contacts.filter((contact)=>{
        if (contact.archived) return false;
        const touchpointDate = getTouchpointDate(contact.nextTouchpointDate);
        if (!touchpointDate) return false;
        const status = contact.touchpointStatus;
        if (status === "completed" || status === "cancelled") return false;
        return touchpointDate >= serverTime && touchpointDate <= maxDate;
    }).length;
    const totalTodayPriorities = totalTodayCount + totalOverdueCount;
    // Show empty state when no contacts at all
    if (contacts.length === 0) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
            padding: "sm",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center justify-between mb-4",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        className: "text-xl font-semibold text-theme-darkest",
                        children: "Recent Contacts"
                    }, void 0, false, {
                        fileName: "[project]/app/(crm)/_components/DashboardTouchpoints.tsx",
                        lineNumber: 265,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/app/(crm)/_components/DashboardTouchpoints.tsx",
                    lineNumber: 264,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$dashboard$2f$EmptyState$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                    message: "No contacts yet",
                    description: "Get started by importing your contacts or adding your first contact",
                    showActions: true,
                    wrapInCard: false,
                    size: "sm"
                }, void 0, false, {
                    fileName: "[project]/app/(crm)/_components/DashboardTouchpoints.tsx",
                    lineNumber: 267,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/app/(crm)/_components/DashboardTouchpoints.tsx",
            lineNumber: 263,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "space-y-6",
        children: [
            (contactsWithTodayTouchpoints.length > 0 || contactsWithOverdueTouchpoints.length > 0) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                padding: "sm",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center justify-between mb-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                className: "text-xl font-semibold text-theme-darkest",
                                children: [
                                    "Today's Priorities (",
                                    totalTodayPriorities,
                                    " total)"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/(crm)/_components/DashboardTouchpoints.tsx",
                                lineNumber: 284,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ViewAllLink$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                href: "/touchpoints/today"
                            }, void 0, false, {
                                fileName: "[project]/app/(crm)/_components/DashboardTouchpoints.tsx",
                                lineNumber: 287,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/(crm)/_components/DashboardTouchpoints.tsx",
                        lineNumber: 283,
                        columnNumber: 11
                    }, this),
                    (contactsWithTodayTouchpoints.length > 0 || contactsWithOverdueTouchpoints.length > 0) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-2 sm:gap-3 pb-3 mb-3 border-b border-gray-200",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Checkbox$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            checked: [
                                ...contactsWithTodayTouchpoints,
                                ...contactsWithOverdueTouchpoints
                            ].every((c)=>selectedTouchpointIds.has(c.id)) && [
                                ...contactsWithTodayTouchpoints,
                                ...contactsWithOverdueTouchpoints
                            ].length > 0,
                            onChange: ()=>{
                                const allTodayPriorities = [
                                    ...contactsWithTodayTouchpoints,
                                    ...contactsWithOverdueTouchpoints
                                ];
                                const allSelected = allTodayPriorities.every((c)=>selectedTouchpointIds.has(c.id));
                                setSelectedTouchpointIds((prev)=>{
                                    const newSet = new Set(prev);
                                    if (allSelected) {
                                        allTodayPriorities.forEach((c)=>newSet.delete(c.id));
                                    } else {
                                        allTodayPriorities.forEach((c)=>newSet.add(c.id));
                                    }
                                    return newSet;
                                });
                            },
                            label: `Select all ${contactsWithTodayTouchpoints.length + contactsWithOverdueTouchpoints.length} priorit${contactsWithTodayTouchpoints.length + contactsWithOverdueTouchpoints.length === 1 ? "y" : "ies"} for bulk actions`,
                            labelClassName: "text-sm font-medium text-theme-darker break-words flex-1 min-w-0"
                        }, void 0, false, {
                            fileName: "[project]/app/(crm)/_components/DashboardTouchpoints.tsx",
                            lineNumber: 293,
                            columnNumber: 15
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/(crm)/_components/DashboardTouchpoints.tsx",
                        lineNumber: 292,
                        columnNumber: 13
                    }, this),
                    renderBulkActions([
                        ...contactsWithTodayTouchpoints,
                        ...contactsWithOverdueTouchpoints
                    ]),
                    contactsWithTodayTouchpoints.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mb-6",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                className: "text-sm font-medium text-theme-darker mb-3",
                                children: "Due Today"
                            }, void 0, false, {
                                fileName: "[project]/app/(crm)/_components/DashboardTouchpoints.tsx",
                                lineNumber: 327,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "grid grid-cols-1 gap-4",
                                children: contactsWithTodayTouchpoints.map((contact)=>{
                                    const isSelected = selectedTouchpointIds.has(contact.id);
                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$crm$292f$_components$2f$ContactCard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                        contact: contact,
                                        showCheckbox: true,
                                        isSelected: isSelected,
                                        onSelectChange: toggleTouchpointSelection,
                                        variant: isSelected ? "selected" : "touchpoint-upcoming",
                                        showArrow: false,
                                        touchpointDate: contact.touchpointDate,
                                        daysUntil: contact.daysUntil,
                                        needsReminder: contact.needsReminder,
                                        showTouchpointActions: true,
                                        userId: userId,
                                        onTouchpointStatusUpdate: ()=>{}
                                    }, contact.id, false, {
                                        fileName: "[project]/app/(crm)/_components/DashboardTouchpoints.tsx",
                                        lineNumber: 332,
                                        columnNumber: 21
                                    }, this);
                                })
                            }, void 0, false, {
                                fileName: "[project]/app/(crm)/_components/DashboardTouchpoints.tsx",
                                lineNumber: 328,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/(crm)/_components/DashboardTouchpoints.tsx",
                        lineNumber: 326,
                        columnNumber: 13
                    }, this),
                    contactsWithOverdueTouchpoints.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: contactsWithTodayTouchpoints.length > 0 ? "border-t border-gray-200 pt-6" : "",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center justify-between mb-3",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                        className: "text-sm font-medium text-red-700",
                                        children: "Overdue"
                                    }, void 0, false, {
                                        fileName: "[project]/app/(crm)/_components/DashboardTouchpoints.tsx",
                                        lineNumber: 357,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ViewAllLink$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                        href: "/touchpoints/overdue"
                                    }, void 0, false, {
                                        fileName: "[project]/app/(crm)/_components/DashboardTouchpoints.tsx",
                                        lineNumber: 358,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/(crm)/_components/DashboardTouchpoints.tsx",
                                lineNumber: 356,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "grid grid-cols-1 gap-4",
                                children: contactsWithOverdueTouchpoints.map((contact)=>{
                                    const isSelected = selectedTouchpointIds.has(contact.id);
                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$crm$292f$_components$2f$ContactCard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                        contact: contact,
                                        showCheckbox: true,
                                        isSelected: isSelected,
                                        onSelectChange: toggleTouchpointSelection,
                                        variant: isSelected ? "selected" : "touchpoint-overdue",
                                        showArrow: false,
                                        touchpointDate: contact.touchpointDate,
                                        daysUntil: contact.daysUntil,
                                        needsReminder: false,
                                        showTouchpointActions: true,
                                        onTouchpointStatusUpdate: ()=>{},
                                        userId: userId
                                    }, contact.id, false, {
                                        fileName: "[project]/app/(crm)/_components/DashboardTouchpoints.tsx",
                                        lineNumber: 364,
                                        columnNumber: 21
                                    }, this);
                                })
                            }, void 0, false, {
                                fileName: "[project]/app/(crm)/_components/DashboardTouchpoints.tsx",
                                lineNumber: 360,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/(crm)/_components/DashboardTouchpoints.tsx",
                        lineNumber: 355,
                        columnNumber: 13
                    }, this),
                    contactsWithTodayTouchpoints.length === 0 && contactsWithOverdueTouchpoints.length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "text-center py-6",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-sm text-gray-500",
                            children: "🎉 You're all caught up today!"
                        }, void 0, false, {
                            fileName: "[project]/app/(crm)/_components/DashboardTouchpoints.tsx",
                            lineNumber: 388,
                            columnNumber: 15
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/(crm)/_components/DashboardTouchpoints.tsx",
                        lineNumber: 387,
                        columnNumber: 13
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/(crm)/_components/DashboardTouchpoints.tsx",
                lineNumber: 282,
                columnNumber: 9
            }, this),
            contactsWithUpcomingTouchpoints.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                padding: "sm",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                className: "text-xl font-semibold text-theme-darkest",
                                children: [
                                    "Upcoming Touchpoints (",
                                    totalUpcomingCount,
                                    " total)"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/(crm)/_components/DashboardTouchpoints.tsx",
                                lineNumber: 398,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-2",
                                children: [
                                    contactsWithUpcomingTouchpoints.filter((c)=>c.needsReminder).length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "px-2.5 py-1 text-xs font-medium text-amber-700 bg-amber-100 rounded-full",
                                        children: [
                                            contactsWithUpcomingTouchpoints.filter((c)=>c.needsReminder).length,
                                            " need attention"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/(crm)/_components/DashboardTouchpoints.tsx",
                                        lineNumber: 403,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ViewAllLink$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                        href: "/touchpoints/upcoming"
                                    }, void 0, false, {
                                        fileName: "[project]/app/(crm)/_components/DashboardTouchpoints.tsx",
                                        lineNumber: 407,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/(crm)/_components/DashboardTouchpoints.tsx",
                                lineNumber: 401,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/(crm)/_components/DashboardTouchpoints.tsx",
                        lineNumber: 397,
                        columnNumber: 11
                    }, this),
                    contactsWithUpcomingTouchpoints.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-2 sm:gap-3 pb-3 mb-3 border-b border-gray-200",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Checkbox$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            checked: contactsWithUpcomingTouchpoints.every((c)=>selectedTouchpointIds.has(c.id)),
                            onChange: ()=>{
                                if (contactsWithUpcomingTouchpoints.every((c)=>selectedTouchpointIds.has(c.id))) {
                                    setSelectedTouchpointIds((prev)=>{
                                        const newSet = new Set(prev);
                                        contactsWithUpcomingTouchpoints.forEach((c)=>newSet.delete(c.id));
                                        return newSet;
                                    });
                                } else {
                                    setSelectedTouchpointIds((prev)=>{
                                        const newSet = new Set(prev);
                                        contactsWithUpcomingTouchpoints.forEach((c)=>newSet.add(c.id));
                                        return newSet;
                                    });
                                }
                            },
                            label: `Select all ${contactsWithUpcomingTouchpoints.length} upcoming touchpoint${contactsWithUpcomingTouchpoints.length !== 1 ? "s" : ""}`,
                            labelClassName: "text-sm font-medium text-theme-darker break-words flex-1 min-w-0"
                        }, void 0, false, {
                            fileName: "[project]/app/(crm)/_components/DashboardTouchpoints.tsx",
                            lineNumber: 413,
                            columnNumber: 15
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/(crm)/_components/DashboardTouchpoints.tsx",
                        lineNumber: 412,
                        columnNumber: 13
                    }, this),
                    renderBulkActions(contactsWithUpcomingTouchpoints),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "grid grid-cols-1 gap-4",
                        children: contactsWithUpcomingTouchpoints.map((contact)=>{
                            const isSelected = selectedTouchpointIds.has(contact.id);
                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$crm$292f$_components$2f$ContactCard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                contact: contact,
                                showCheckbox: true,
                                isSelected: isSelected,
                                onSelectChange: toggleTouchpointSelection,
                                variant: isSelected ? "selected" : "touchpoint-upcoming",
                                showArrow: false,
                                touchpointDate: contact.touchpointDate,
                                daysUntil: contact.daysUntil,
                                needsReminder: contact.needsReminder,
                                showTouchpointActions: true,
                                userId: userId,
                                onTouchpointStatusUpdate: ()=>{}
                            }, contact.id, false, {
                                fileName: "[project]/app/(crm)/_components/DashboardTouchpoints.tsx",
                                lineNumber: 442,
                                columnNumber: 17
                            }, this);
                        })
                    }, void 0, false, {
                        fileName: "[project]/app/(crm)/_components/DashboardTouchpoints.tsx",
                        lineNumber: 438,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/(crm)/_components/DashboardTouchpoints.tsx",
                lineNumber: 396,
                columnNumber: 9
            }, this),
            recentContacts.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                padding: "sm",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center justify-between mb-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                className: "text-xl font-semibold text-theme-darkest",
                                children: "Recent Contacts"
                            }, void 0, false, {
                                fileName: "[project]/app/(crm)/_components/DashboardTouchpoints.tsx",
                                lineNumber: 467,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ViewAllLink$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                href: "/contacts"
                            }, void 0, false, {
                                fileName: "[project]/app/(crm)/_components/DashboardTouchpoints.tsx",
                                lineNumber: 468,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/(crm)/_components/DashboardTouchpoints.tsx",
                        lineNumber: 466,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "grid grid-cols-1 gap-4",
                        children: recentContacts.map((contact)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$crm$292f$_components$2f$ContactCard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                contact: {
                                    ...contact,
                                    id: contact.contactId
                                },
                                showArrow: true,
                                userId: userId
                            }, contact.contactId, false, {
                                fileName: "[project]/app/(crm)/_components/DashboardTouchpoints.tsx",
                                lineNumber: 472,
                                columnNumber: 15
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/app/(crm)/_components/DashboardTouchpoints.tsx",
                        lineNumber: 470,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/(crm)/_components/DashboardTouchpoints.tsx",
                lineNumber: 465,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/(crm)/_components/DashboardTouchpoints.tsx",
        lineNumber: 279,
        columnNumber: 5
    }, this);
}
_s(TouchpointsContent, "KPjveOtMWIPcTUJ+hx23b5LWn/g=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useAuth$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"],
        __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useContacts$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContacts"],
        __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useContactMutations$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useUpdateTouchpointStatus"]
    ];
});
_c = TouchpointsContent;
function DashboardTouchpoints({ userId }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ThemedSuspense$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
        fallback: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
            padding: "sm",
            className: "animate-pulse",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "h-6 bg-card-highlight-light rounded w-48 mb-4"
                }, void 0, false, {
                    fileName: "[project]/app/(crm)/_components/DashboardTouchpoints.tsx",
                    lineNumber: 486,
                    columnNumber: 11
                }, void 0),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "space-y-3",
                    children: Array.from({
                        length: 3
                    }).map((_, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center gap-4 p-4 bg-card-highlight-light rounded-sm",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "w-12 h-12 bg-theme-light rounded-full shrink-0"
                                }, void 0, false, {
                                    fileName: "[project]/app/(crm)/_components/DashboardTouchpoints.tsx",
                                    lineNumber: 490,
                                    columnNumber: 17
                                }, void 0),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex-1 space-y-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "h-5 bg-theme-light rounded w-2/3"
                                        }, void 0, false, {
                                            fileName: "[project]/app/(crm)/_components/DashboardTouchpoints.tsx",
                                            lineNumber: 492,
                                            columnNumber: 19
                                        }, void 0),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "h-4 bg-theme-light rounded w-1/2"
                                        }, void 0, false, {
                                            fileName: "[project]/app/(crm)/_components/DashboardTouchpoints.tsx",
                                            lineNumber: 493,
                                            columnNumber: 19
                                        }, void 0)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/(crm)/_components/DashboardTouchpoints.tsx",
                                    lineNumber: 491,
                                    columnNumber: 17
                                }, void 0)
                            ]
                        }, i, true, {
                            fileName: "[project]/app/(crm)/_components/DashboardTouchpoints.tsx",
                            lineNumber: 489,
                            columnNumber: 15
                        }, void 0))
                }, void 0, false, {
                    fileName: "[project]/app/(crm)/_components/DashboardTouchpoints.tsx",
                    lineNumber: 487,
                    columnNumber: 11
                }, void 0)
            ]
        }, void 0, true, {
            fileName: "[project]/app/(crm)/_components/DashboardTouchpoints.tsx",
            lineNumber: 485,
            columnNumber: 9
        }, void 0),
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(TouchpointsContent, {
            userId: userId
        }, void 0, false, {
            fileName: "[project]/app/(crm)/_components/DashboardTouchpoints.tsx",
            lineNumber: 501,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/app/(crm)/_components/DashboardTouchpoints.tsx",
        lineNumber: 483,
        columnNumber: 5
    }, this);
}
_c1 = DashboardTouchpoints;
var _c, _c1;
__turbopack_context__.k.register(_c, "TouchpointsContent");
__turbopack_context__.k.register(_c1, "DashboardTouchpoints");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/dashboard/RightColumnMetrics.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>RightColumnMetrics
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useDashboardStats$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hooks/useDashboardStats.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/Card.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
function RightColumnMetrics({ userId, initialStats }) {
    _s();
    const { data: stats } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useDashboardStats$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useDashboardStats"])(userId, initialStats);
    if (!stats) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "space-y-3",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                    className: "p-4",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "h-16 bg-card-highlight-light animate-pulse rounded"
                    }, void 0, false, {
                        fileName: "[project]/components/dashboard/RightColumnMetrics.tsx",
                        lineNumber: 18,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/components/dashboard/RightColumnMetrics.tsx",
                    lineNumber: 17,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                    className: "p-4",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "h-16 bg-card-highlight-light animate-pulse rounded"
                    }, void 0, false, {
                        fileName: "[project]/components/dashboard/RightColumnMetrics.tsx",
                        lineNumber: 21,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/components/dashboard/RightColumnMetrics.tsx",
                    lineNumber: 20,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                    className: "p-4",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "h-16 bg-card-highlight-light animate-pulse rounded"
                    }, void 0, false, {
                        fileName: "[project]/components/dashboard/RightColumnMetrics.tsx",
                        lineNumber: 24,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/components/dashboard/RightColumnMetrics.tsx",
                    lineNumber: 23,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/components/dashboard/RightColumnMetrics.tsx",
            lineNumber: 16,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "space-y-3",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                className: "p-4",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center gap-3",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                className: "w-6 h-6 text-blue-600",
                                fill: "none",
                                stroke: "currentColor",
                                viewBox: "0 0 24 24",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                    strokeLinecap: "round",
                                    strokeLinejoin: "round",
                                    strokeWidth: 2,
                                    d: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                                }, void 0, false, {
                                    fileName: "[project]/components/dashboard/RightColumnMetrics.tsx",
                                    lineNumber: 42,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/components/dashboard/RightColumnMetrics.tsx",
                                lineNumber: 36,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/components/dashboard/RightColumnMetrics.tsx",
                            lineNumber: 35,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-sm text-theme-dark",
                                    children: "Total Contacts"
                                }, void 0, false, {
                                    fileName: "[project]/components/dashboard/RightColumnMetrics.tsx",
                                    lineNumber: 51,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-2xl font-bold text-theme-darkest",
                                    children: stats.totalContacts.toLocaleString()
                                }, void 0, false, {
                                    fileName: "[project]/components/dashboard/RightColumnMetrics.tsx",
                                    lineNumber: 52,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/dashboard/RightColumnMetrics.tsx",
                            lineNumber: 50,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/dashboard/RightColumnMetrics.tsx",
                    lineNumber: 34,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/dashboard/RightColumnMetrics.tsx",
                lineNumber: 33,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                className: "p-4",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center gap-3",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "w-10 h-10 rounded-full bg-green-100 flex items-center justify-center",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                className: "w-6 h-6 text-green-600",
                                fill: "none",
                                stroke: "currentColor",
                                viewBox: "0 0 24 24",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                    strokeLinecap: "round",
                                    strokeLinejoin: "round",
                                    strokeWidth: 2,
                                    d: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                }, void 0, false, {
                                    fileName: "[project]/components/dashboard/RightColumnMetrics.tsx",
                                    lineNumber: 67,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/components/dashboard/RightColumnMetrics.tsx",
                                lineNumber: 61,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/components/dashboard/RightColumnMetrics.tsx",
                            lineNumber: 60,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-sm text-theme-dark",
                                    children: "Active Threads"
                                }, void 0, false, {
                                    fileName: "[project]/components/dashboard/RightColumnMetrics.tsx",
                                    lineNumber: 76,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-2xl font-bold text-theme-darkest",
                                    children: stats.contactsWithThreads.toLocaleString()
                                }, void 0, false, {
                                    fileName: "[project]/components/dashboard/RightColumnMetrics.tsx",
                                    lineNumber: 77,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/dashboard/RightColumnMetrics.tsx",
                            lineNumber: 75,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/dashboard/RightColumnMetrics.tsx",
                    lineNumber: 59,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/dashboard/RightColumnMetrics.tsx",
                lineNumber: 58,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                className: "p-4",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center gap-3",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                className: "w-6 h-6 text-purple-600",
                                fill: "none",
                                stroke: "currentColor",
                                viewBox: "0 0 24 24",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                    strokeLinecap: "round",
                                    strokeLinejoin: "round",
                                    strokeWidth: 2,
                                    d: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                                }, void 0, false, {
                                    fileName: "[project]/components/dashboard/RightColumnMetrics.tsx",
                                    lineNumber: 92,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/components/dashboard/RightColumnMetrics.tsx",
                                lineNumber: 86,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/components/dashboard/RightColumnMetrics.tsx",
                            lineNumber: 85,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-sm text-theme-dark",
                                    children: "Avg Engagement"
                                }, void 0, false, {
                                    fileName: "[project]/components/dashboard/RightColumnMetrics.tsx",
                                    lineNumber: 101,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-2xl font-bold text-theme-darkest",
                                    children: stats.averageEngagementScore.toFixed(1)
                                }, void 0, false, {
                                    fileName: "[project]/components/dashboard/RightColumnMetrics.tsx",
                                    lineNumber: 102,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/dashboard/RightColumnMetrics.tsx",
                            lineNumber: 100,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/dashboard/RightColumnMetrics.tsx",
                    lineNumber: 84,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/dashboard/RightColumnMetrics.tsx",
                lineNumber: 83,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/dashboard/RightColumnMetrics.tsx",
        lineNumber: 31,
        columnNumber: 5
    }, this);
}
_s(RightColumnMetrics, "ibyUsDKM9Bw1kCT9hLn4D72vYzg=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useDashboardStats$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useDashboardStats"]
    ];
});
_c = RightColumnMetrics;
var _c;
__turbopack_context__.k.register(_c, "RightColumnMetrics");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/hooks/usePipelineCounts.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "usePipelineCounts",
    ()=>usePipelineCounts
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tanstack/react-query/build/modern/useQuery.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$ui$2d$mode$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/ui-mode.ts [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
function usePipelineCounts(userId) {
    _s();
    const query = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: [
            "pipeline-counts",
            userId
        ],
        queryFn: {
            "usePipelineCounts.useQuery[query]": async ()=>{
                const response = await fetch("/api/pipeline-counts");
                if (!response.ok) {
                    const errorData = await response.json().catch({
                        "usePipelineCounts.useQuery[query]": ()=>({})
                    }["usePipelineCounts.useQuery[query]"]);
                    throw new Error(errorData.error || "Failed to fetch pipeline counts");
                }
                const data = await response.json();
                return data.counts;
            }
        }["usePipelineCounts.useQuery[query]"],
        enabled: !!userId,
        staleTime: 1000 * 60
    });
    const uiMode = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$ui$2d$mode$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getUIMode"])();
    // Override query result based on UI mode
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "usePipelineCounts.useMemo": ()=>{
            if (uiMode === "suspense") {
                return {
                    ...query,
                    data: undefined,
                    isLoading: true
                };
            }
            if (uiMode === "empty") {
                return {
                    ...query,
                    data: {},
                    isLoading: false
                };
            }
            return query;
        }
    }["usePipelineCounts.useMemo"], [
        query,
        uiMode
    ]);
}
_s(usePipelineCounts, "omorBNG7LLjf0qbKIPbzemu3vGA=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"]
    ];
});
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/Skeleton.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Skeleton
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
"use client";
;
function Skeleton({ className = "", variant = "default", width, height, rounded = "md" }) {
    // Base classes - always use theme-aware colors
    const baseClasses = "animate-pulse";
    // Variant-specific background colors
    let bgClass = "";
    switch(variant){
        case "card":
            bgClass = "bg-card-highlight-light";
            break;
        case "circle":
            bgClass = "bg-theme-light";
            break;
        case "text":
            bgClass = "bg-theme-light";
            break;
        default:
            bgClass = "bg-theme-light";
            break;
    }
    // Rounded classes
    const roundedClass = variant === "circle" ? "rounded-full" : rounded === "none" ? "" : `rounded-${rounded}`;
    // Height default for text variant
    const heightClass = height || (variant === "text" ? "h-4" : "");
    // Combine all classes
    const combinedClasses = [
        baseClasses,
        bgClass,
        width,
        heightClass,
        roundedClass,
        className
    ].filter(Boolean).join(" ");
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: combinedClasses
    }, void 0, false, {
        fileName: "[project]/components/Skeleton.tsx",
        lineNumber: 76,
        columnNumber: 10
    }, this);
}
_c = Skeleton;
var _c;
__turbopack_context__.k.register(_c, "Skeleton");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/dashboard/PipelineSnapshot.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>PipelineSnapshot
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$usePipelineCounts$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hooks/usePipelineCounts.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useDashboardStats$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hooks/useDashboardStats.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/Card.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$dashboard$2f$EmptyState$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/dashboard/EmptyState.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Skeleton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/Skeleton.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
function PipelineSnapshot({ userId }) {
    _s();
    const { data: counts, isLoading } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$usePipelineCounts$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePipelineCounts"])(userId);
    const { data: stats } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useDashboardStats$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useDashboardStats"])(userId);
    if (isLoading || !counts) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
            className: "p-4",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                    className: "text-lg font-semibold text-theme-darkest mb-4",
                    children: "Pipeline Snapshot"
                }, void 0, false, {
                    fileName: "[project]/components/dashboard/PipelineSnapshot.tsx",
                    lineNumber: 21,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "grid grid-cols-2 gap-3",
                    children: [
                        1,
                        2,
                        3,
                        4
                    ].map((i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Skeleton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            height: "h-20"
                        }, i, false, {
                            fileName: "[project]/components/dashboard/PipelineSnapshot.tsx",
                            lineNumber: 24,
                            columnNumber: 13
                        }, this))
                }, void 0, false, {
                    fileName: "[project]/components/dashboard/PipelineSnapshot.tsx",
                    lineNumber: 22,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/components/dashboard/PipelineSnapshot.tsx",
            lineNumber: 20,
            columnNumber: 7
        }, this);
    }
    // Get top 4 segments by count
    const topSegments = Object.entries(counts).sort(([, a], [, b])=>b - a).slice(0, 4);
    // Color mapping for segments
    const getSegmentColor = (index)=>{
        const colors = [
            "bg-green-50 border-green-200 text-green-900",
            "bg-blue-50 border-blue-200 text-blue-900",
            "bg-yellow-50 border-yellow-200 text-yellow-900",
            "bg-red-50 border-red-200 text-red-900"
        ];
        return colors[index % colors.length];
    };
    // Show empty state when no contacts
    if (stats && stats.totalContacts === 0) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
            className: "p-4",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                    className: "text-lg font-semibold text-theme-darkest mb-4",
                    children: "Pipeline Snapshot"
                }, void 0, false, {
                    fileName: "[project]/components/dashboard/PipelineSnapshot.tsx",
                    lineNumber: 51,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$dashboard$2f$EmptyState$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                    message: "No segments yet",
                    description: "Import contacts to see your pipeline",
                    showActions: false,
                    wrapInCard: false,
                    size: "sm"
                }, void 0, false, {
                    fileName: "[project]/components/dashboard/PipelineSnapshot.tsx",
                    lineNumber: 52,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/components/dashboard/PipelineSnapshot.tsx",
            lineNumber: 50,
            columnNumber: 7
        }, this);
    }
    if (topSegments.length === 0) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
            className: "p-4",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                    className: "text-lg font-semibold text-theme-darkest mb-4",
                    children: "Pipeline Snapshot"
                }, void 0, false, {
                    fileName: "[project]/components/dashboard/PipelineSnapshot.tsx",
                    lineNumber: 66,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "text-sm text-gray-500",
                    children: "No segments found"
                }, void 0, false, {
                    fileName: "[project]/components/dashboard/PipelineSnapshot.tsx",
                    lineNumber: 67,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/components/dashboard/PipelineSnapshot.tsx",
            lineNumber: 65,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
        className: "p-4",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                className: "text-lg font-semibold text-theme-darkest mb-4",
                children: "Pipeline Snapshot"
            }, void 0, false, {
                fileName: "[project]/components/dashboard/PipelineSnapshot.tsx",
                lineNumber: 74,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "grid grid-cols-2 gap-3",
                children: topSegments.map(([segment, count], index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        href: `/contacts?segment=${encodeURIComponent(segment)}`,
                        className: `p-3 rounded-sm border-2 ${getSegmentColor(index)} hover:opacity-80 transition-opacity`,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-xs font-medium mb-1 truncate",
                                children: segment
                            }, void 0, false, {
                                fileName: "[project]/components/dashboard/PipelineSnapshot.tsx",
                                lineNumber: 82,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-2xl font-bold",
                                children: count.toLocaleString()
                            }, void 0, false, {
                                fileName: "[project]/components/dashboard/PipelineSnapshot.tsx",
                                lineNumber: 83,
                                columnNumber: 13
                            }, this)
                        ]
                    }, segment, true, {
                        fileName: "[project]/components/dashboard/PipelineSnapshot.tsx",
                        lineNumber: 77,
                        columnNumber: 11
                    }, this))
            }, void 0, false, {
                fileName: "[project]/components/dashboard/PipelineSnapshot.tsx",
                lineNumber: 75,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/dashboard/PipelineSnapshot.tsx",
        lineNumber: 73,
        columnNumber: 5
    }, this);
}
_s(PipelineSnapshot, "u3q0gZImOEW/BmBoBVWJkreLSVg=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$usePipelineCounts$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePipelineCounts"],
        __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useDashboardStats$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useDashboardStats"]
    ];
});
_c = PipelineSnapshot;
var _c;
__turbopack_context__.k.register(_c, "PipelineSnapshot");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/hooks/useAiInsights.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useAiInsights",
    ()=>useAiInsights
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tanstack/react-query/build/modern/useQuery.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$ui$2d$mode$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/ui-mode.ts [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
function useAiInsights(userId) {
    _s();
    const query = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: [
            "ai-insights",
            userId
        ],
        queryFn: {
            "useAiInsights.useQuery[query]": async ()=>{
                const response = await fetch("/api/insights");
                if (!response.ok) {
                    const errorData = await response.json().catch({
                        "useAiInsights.useQuery[query]": ()=>({})
                    }["useAiInsights.useQuery[query]"]);
                    throw new Error(errorData.error || "Failed to fetch AI insights");
                }
                const data = await response.json();
                return data.insights;
            }
        }["useAiInsights.useQuery[query]"],
        enabled: !!userId,
        staleTime: 1000 * 60 * 5
    });
    const uiMode = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$ui$2d$mode$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getUIMode"])();
    // Override query result based on UI mode
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "useAiInsights.useMemo": ()=>{
            if (uiMode === "suspense") {
                return {
                    ...query,
                    data: undefined,
                    isLoading: true
                };
            }
            if (uiMode === "empty") {
                return {
                    ...query,
                    data: [],
                    isLoading: false
                };
            }
            return query;
        }
    }["useAiInsights.useMemo"], [
        query,
        uiMode
    ]);
}
_s(useAiInsights, "omorBNG7LLjf0qbKIPbzemu3vGA=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"]
    ];
});
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/dashboard/AiInsights.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>AiInsights
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useAiInsights$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hooks/useAiInsights.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useDashboardStats$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hooks/useDashboardStats.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/Card.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/Button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$dashboard$2f$EmptyState$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/dashboard/EmptyState.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Skeleton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/Skeleton.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
;
function AiInsights({ userId }) {
    _s();
    const { data: insights, isLoading, isError } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useAiInsights$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAiInsights"])(userId);
    const { data: stats } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useDashboardStats$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useDashboardStats"])(userId);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
        className: "p-4",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center gap-2 mb-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                        className: "w-5 h-5 text-purple-600",
                        fill: "none",
                        stroke: "currentColor",
                        viewBox: "0 0 24 24",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                            strokeLinecap: "round",
                            strokeLinejoin: "round",
                            strokeWidth: 2,
                            d: "M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                        }, void 0, false, {
                            fileName: "[project]/components/dashboard/AiInsights.tsx",
                            lineNumber: 28,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/components/dashboard/AiInsights.tsx",
                        lineNumber: 22,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                        className: "text-lg font-semibold text-theme-darkest",
                        children: "AI Insights"
                    }, void 0, false, {
                        fileName: "[project]/components/dashboard/AiInsights.tsx",
                        lineNumber: 35,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/dashboard/AiInsights.tsx",
                lineNumber: 21,
                columnNumber: 7
            }, this),
            !isLoading && stats && stats.totalContacts === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$dashboard$2f$EmptyState$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                message: "No insights yet",
                description: "Import contacts to get AI-powered insights",
                showActions: false,
                wrapInCard: false,
                size: "sm"
            }, void 0, false, {
                fileName: "[project]/components/dashboard/AiInsights.tsx",
                lineNumber: 40,
                columnNumber: 9
            }, this),
            isLoading && stats && stats.totalContacts > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "space-y-3",
                children: [
                    1,
                    2,
                    3
                ].map((i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "space-y-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Skeleton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                variant: "text",
                                width: "w-3/4"
                            }, void 0, false, {
                                fileName: "[project]/components/dashboard/AiInsights.tsx",
                                lineNumber: 53,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Skeleton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                variant: "text",
                                width: "w-full",
                                height: "h-3"
                            }, void 0, false, {
                                fileName: "[project]/components/dashboard/AiInsights.tsx",
                                lineNumber: 54,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Skeleton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                variant: "text",
                                width: "w-2/3",
                                height: "h-3"
                            }, void 0, false, {
                                fileName: "[project]/components/dashboard/AiInsights.tsx",
                                lineNumber: 55,
                                columnNumber: 15
                            }, this)
                        ]
                    }, i, true, {
                        fileName: "[project]/components/dashboard/AiInsights.tsx",
                        lineNumber: 52,
                        columnNumber: 13
                    }, this))
            }, void 0, false, {
                fileName: "[project]/components/dashboard/AiInsights.tsx",
                lineNumber: 50,
                columnNumber: 9
            }, this),
            isError && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-sm text-red-600",
                children: "Unable to load insights. Try again later."
            }, void 0, false, {
                fileName: "[project]/components/dashboard/AiInsights.tsx",
                lineNumber: 62,
                columnNumber: 9
            }, this),
            !isLoading && !isError && stats && stats.totalContacts > 0 && (!insights || insights.length === 0) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-center py-6",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-sm text-gray-500 mb-2",
                        children: "🎉"
                    }, void 0, false, {
                        fileName: "[project]/components/dashboard/AiInsights.tsx",
                        lineNumber: 67,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-sm text-gray-500",
                        children: "You're all caught up!"
                    }, void 0, false, {
                        fileName: "[project]/components/dashboard/AiInsights.tsx",
                        lineNumber: 68,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-xs text-gray-400 mt-1",
                        children: "No insights at the moment."
                    }, void 0, false, {
                        fileName: "[project]/components/dashboard/AiInsights.tsx",
                        lineNumber: 69,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/dashboard/AiInsights.tsx",
                lineNumber: 66,
                columnNumber: 9
            }, this),
            !isLoading && !isError && stats && stats.totalContacts > 0 && insights && insights.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "space-y-4",
                children: insights.slice(0, 3).map((insight)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "border-b border-gray-200 last:border-0 pb-3 last:pb-0",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                className: "font-semibold text-theme-darkest text-sm mb-1",
                                children: insight.title
                            }, void 0, false, {
                                fileName: "[project]/components/dashboard/AiInsights.tsx",
                                lineNumber: 77,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-xs text-theme-dark mb-2",
                                children: insight.description
                            }, void 0, false, {
                                fileName: "[project]/components/dashboard/AiInsights.tsx",
                                lineNumber: 78,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                href: insight.actionHref,
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                    size: "sm",
                                    variant: "outline",
                                    className: "text-xs",
                                    children: "View"
                                }, void 0, false, {
                                    fileName: "[project]/components/dashboard/AiInsights.tsx",
                                    lineNumber: 80,
                                    columnNumber: 17
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/components/dashboard/AiInsights.tsx",
                                lineNumber: 79,
                                columnNumber: 15
                            }, this)
                        ]
                    }, insight.id, true, {
                        fileName: "[project]/components/dashboard/AiInsights.tsx",
                        lineNumber: 76,
                        columnNumber: 13
                    }, this))
            }, void 0, false, {
                fileName: "[project]/components/dashboard/AiInsights.tsx",
                lineNumber: 74,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/dashboard/AiInsights.tsx",
        lineNumber: 20,
        columnNumber: 5
    }, this);
}
_s(AiInsights, "KJwHOtR9BDFI+IwFGzm9fk1pxKE=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useAiInsights$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAiInsights"],
        __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useDashboardStats$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useDashboardStats"]
    ];
});
_c = AiInsights;
var _c;
__turbopack_context__.k.register(_c, "AiInsights");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/dashboard/SavedSegments.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>SavedSegments
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$usePipelineCounts$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hooks/usePipelineCounts.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useDashboardStats$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hooks/useDashboardStats.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/Card.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$dashboard$2f$EmptyState$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/dashboard/EmptyState.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Skeleton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/Skeleton.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
function SavedSegments({ userId }) {
    _s();
    const { data: counts, isLoading } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$usePipelineCounts$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePipelineCounts"])(userId);
    const { data: stats } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useDashboardStats$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useDashboardStats"])(userId);
    if (isLoading || !counts) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
            className: "p-4",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                    className: "text-lg font-semibold text-theme-darkest mb-4",
                    children: "Saved Segments"
                }, void 0, false, {
                    fileName: "[project]/components/dashboard/SavedSegments.tsx",
                    lineNumber: 21,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "space-y-2",
                    children: [
                        1,
                        2,
                        3
                    ].map((i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Skeleton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            height: "h-12"
                        }, i, false, {
                            fileName: "[project]/components/dashboard/SavedSegments.tsx",
                            lineNumber: 24,
                            columnNumber: 13
                        }, this))
                }, void 0, false, {
                    fileName: "[project]/components/dashboard/SavedSegments.tsx",
                    lineNumber: 22,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/components/dashboard/SavedSegments.tsx",
            lineNumber: 20,
            columnNumber: 7
        }, this);
    }
    // Get top 3 segments by count
    const topSegments = Object.entries(counts).sort(([, a], [, b])=>b - a).slice(0, 3);
    // Show empty state when no contacts
    if (stats && stats.totalContacts === 0) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
            className: "p-4",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                    className: "text-lg font-semibold text-theme-darkest mb-4",
                    children: "Saved Segments"
                }, void 0, false, {
                    fileName: "[project]/components/dashboard/SavedSegments.tsx",
                    lineNumber: 40,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$dashboard$2f$EmptyState$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                    message: "No segments yet",
                    description: "Import contacts to see saved segments",
                    showActions: false,
                    wrapInCard: false,
                    size: "sm"
                }, void 0, false, {
                    fileName: "[project]/components/dashboard/SavedSegments.tsx",
                    lineNumber: 41,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/components/dashboard/SavedSegments.tsx",
            lineNumber: 39,
            columnNumber: 7
        }, this);
    }
    if (topSegments.length === 0) {
        return null; // Don't show if no segments
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
        className: "p-4",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                className: "text-lg font-semibold text-theme-darkest mb-4",
                children: "Saved Segments"
            }, void 0, false, {
                fileName: "[project]/components/dashboard/SavedSegments.tsx",
                lineNumber: 58,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "space-y-2",
                children: topSegments.map(([segment, count])=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        href: `/contacts?segment=${encodeURIComponent(segment)}`,
                        className: "block p-3 rounded-sm border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-colors",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center justify-between",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "text-sm font-medium text-theme-darkest",
                                    children: segment
                                }, void 0, false, {
                                    fileName: "[project]/components/dashboard/SavedSegments.tsx",
                                    lineNumber: 67,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "text-sm text-theme-dark",
                                    children: [
                                        "(",
                                        count,
                                        ")"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/dashboard/SavedSegments.tsx",
                                    lineNumber: 68,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/dashboard/SavedSegments.tsx",
                            lineNumber: 66,
                            columnNumber: 13
                        }, this)
                    }, segment, false, {
                        fileName: "[project]/components/dashboard/SavedSegments.tsx",
                        lineNumber: 61,
                        columnNumber: 11
                    }, this))
            }, void 0, false, {
                fileName: "[project]/components/dashboard/SavedSegments.tsx",
                lineNumber: 59,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/dashboard/SavedSegments.tsx",
        lineNumber: 57,
        columnNumber: 5
    }, this);
}
_s(SavedSegments, "u3q0gZImOEW/BmBoBVWJkreLSVg=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$usePipelineCounts$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePipelineCounts"],
        __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useDashboardStats$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useDashboardStats"]
    ];
});
_c = SavedSegments;
var _c;
__turbopack_context__.k.register(_c, "SavedSegments");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/(crm)/DashboardPageClient.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>DashboardPageClient
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useAuth$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hooks/useAuth.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$crm$292f$_components$2f$DashboardTouchpoints$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/(crm)/_components/DashboardTouchpoints.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$dashboard$2f$RightColumnMetrics$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/dashboard/RightColumnMetrics.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$dashboard$2f$PipelineSnapshot$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/dashboard/PipelineSnapshot.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$dashboard$2f$AiInsights$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/dashboard/AiInsights.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$dashboard$2f$SavedSegments$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/dashboard/SavedSegments.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
function DashboardPageClient({ userId, initialStats }) {
    _s();
    const { user, loading } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useAuth$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"])();
    // Wait for auth to load before checking for user
    // In production, user should be available after Google login
    // In E2E mode, we might not have Firebase user but session cookie is valid
    // If we have userId from SSR, we can render even without Firebase user (data will load via session cookie)
    if (loading && !userId) {
        // Only wait if we don't have userId from SSR
        return null;
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "space-y-6",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                        className: "text-4xl font-bold text-theme-darkest mb-2",
                        children: [
                            "Welcome back, ",
                            user?.displayName?.split(" ")[0] || "User",
                            "!"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/(crm)/DashboardPageClient.tsx",
                        lineNumber: 35,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-theme-dark text-lg",
                        children: "Here's what's happening with your contacts today"
                    }, void 0, false, {
                        fileName: "[project]/app/(crm)/DashboardPageClient.tsx",
                        lineNumber: 38,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/(crm)/DashboardPageClient.tsx",
                lineNumber: 34,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "grid grid-cols-1 xl:grid-cols-[1fr_340px] gap-6",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "space-y-6",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$crm$292f$_components$2f$DashboardTouchpoints$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            userId: userId
                        }, void 0, false, {
                            fileName: "[project]/app/(crm)/DashboardPageClient.tsx",
                            lineNumber: 48,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/(crm)/DashboardPageClient.tsx",
                        lineNumber: 46,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "space-y-6",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$dashboard$2f$RightColumnMetrics$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                userId: userId,
                                initialStats: initialStats
                            }, void 0, false, {
                                fileName: "[project]/app/(crm)/DashboardPageClient.tsx",
                                lineNumber: 53,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$dashboard$2f$AiInsights$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                userId: userId
                            }, void 0, false, {
                                fileName: "[project]/app/(crm)/DashboardPageClient.tsx",
                                lineNumber: 54,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$dashboard$2f$PipelineSnapshot$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                userId: userId
                            }, void 0, false, {
                                fileName: "[project]/app/(crm)/DashboardPageClient.tsx",
                                lineNumber: 55,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$dashboard$2f$SavedSegments$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                userId: userId
                            }, void 0, false, {
                                fileName: "[project]/app/(crm)/DashboardPageClient.tsx",
                                lineNumber: 56,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/(crm)/DashboardPageClient.tsx",
                        lineNumber: 52,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/(crm)/DashboardPageClient.tsx",
                lineNumber: 44,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/(crm)/DashboardPageClient.tsx",
        lineNumber: 32,
        columnNumber: 5
    }, this);
}
_s(DashboardPageClient, "EmJkapf7qiLC5Br5eCoEq4veZes=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useAuth$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"]
    ];
});
_c = DashboardPageClient;
var _c;
__turbopack_context__.k.register(_c, "DashboardPageClient");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/(crm)/_components/DashboardPageClientWrapper.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>DashboardPageClientWrapper
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useContacts$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hooks/useContacts.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useDashboardStats$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hooks/useDashboardStats.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useAuth$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hooks/useAuth.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$util$2f$date$2d$utils$2d$server$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/util/date-utils-server.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$crm$292f$DashboardPageClient$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/(crm)/DashboardPageClient.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ThemedSuspense$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ThemedSuspense.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
function DashboardPageClientWrapper({ userId }) {
    _s();
    const { user, loading: authLoading } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useAuth$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"])();
    // Prioritize userId prop from SSR (production should always have this)
    // Only fallback to client auth if userId prop is empty (E2E mode)
    const effectiveUserId = userId || (!authLoading && user?.uid ? user.uid : "");
    const { data: contacts = [], isLoading: contactsLoading } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useContacts$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContacts"])(effectiveUserId);
    const { data: stats, isLoading: statsLoading } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useDashboardStats$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useDashboardStats"])(effectiveUserId);
    // Show loading if we don't have userId yet OR if stats/contacts are loading (suspense mode)
    // In production, this should only be true briefly during initial render
    if (!effectiveUserId || statsLoading && !stats || contactsLoading && contacts.length === 0) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "space-y-6",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                            className: "text-4xl font-bold text-theme-darkest mb-2",
                            children: "Welcome back!"
                        }, void 0, false, {
                            fileName: "[project]/app/(crm)/_components/DashboardPageClientWrapper.tsx",
                            lineNumber: 34,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-theme-dark text-lg",
                            children: "Loading dashboard..."
                        }, void 0, false, {
                            fileName: "[project]/app/(crm)/_components/DashboardPageClientWrapper.tsx",
                            lineNumber: 35,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/(crm)/_components/DashboardPageClientWrapper.tsx",
                    lineNumber: 33,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ThemedSuspense$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                    isLoading: true,
                    variant: "dashboard"
                }, void 0, false, {
                    fileName: "[project]/app/(crm)/_components/DashboardPageClientWrapper.tsx",
                    lineNumber: 37,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/app/(crm)/_components/DashboardPageClientWrapper.tsx",
            lineNumber: 32,
            columnNumber: 7
        }, this);
    }
    // Use consistent server time for all calculations
    const serverTime = new Date();
    // Helper function to safely get touchpoint date
    const getTouchpointDate = (date)=>{
        if (!date) return null;
        if (date instanceof Date) return date;
        if (typeof date === "string") return new Date(date);
        if (typeof date === "object" && "toDate" in date) {
            return date.toDate();
        }
        return null;
    };
    // Filter for upcoming touchpoints within the next 60 days (including overdue)
    const maxDaysAhead = 60;
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + maxDaysAhead);
    // Separate overdue and upcoming touchpoints
    const contactsWithOverdueTouchpoints = contacts.filter((contact)=>{
        // Exclude archived contacts
        if (contact.archived) return false;
        const touchpointDate = getTouchpointDate(contact.nextTouchpointDate);
        if (!touchpointDate) return false;
        // Exclude completed or cancelled touchpoints
        const status = contact.touchpointStatus;
        if (status === "completed" || status === "cancelled") return false;
        // Only include overdue (past dates)
        return touchpointDate < serverTime;
    }).map((contact)=>{
        const touchpointDate = getTouchpointDate(contact.nextTouchpointDate);
        const daysUntil = (0, __TURBOPACK__imported__module__$5b$project$5d2f$util$2f$date$2d$utils$2d$server$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getDaysUntilTouchpoint"])(contact.nextTouchpointDate, serverTime) || 0;
        return {
            ...contact,
            id: contact.contactId,
            touchpointDate,
            daysUntil,
            needsReminder: false
        };
    }).sort((a, b)=>{
        // Sort by most overdue first
        return a.touchpointDate.getTime() - b.touchpointDate.getTime();
    }).slice(0, 5); // Limit to 5 most overdue
    const contactsWithUpcomingTouchpoints = contacts.filter((contact)=>{
        // Exclude archived contacts
        if (contact.archived) return false;
        const touchpointDate = getTouchpointDate(contact.nextTouchpointDate);
        if (!touchpointDate) return false;
        // Exclude completed or cancelled touchpoints
        const status = contact.touchpointStatus;
        if (status === "completed" || status === "cancelled") return false;
        // Only include future dates (not overdue) within next 60 days
        return touchpointDate >= serverTime && touchpointDate <= maxDate;
    }).map((contact)=>{
        const touchpointDate = getTouchpointDate(contact.nextTouchpointDate);
        const daysUntil = (0, __TURBOPACK__imported__module__$5b$project$5d2f$util$2f$date$2d$utils$2d$server$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getDaysUntilTouchpoint"])(contact.nextTouchpointDate, serverTime) || 0;
        const needsReminder = daysUntil <= 7 && daysUntil >= 0;
        return {
            ...contact,
            id: contact.contactId,
            touchpointDate,
            daysUntil,
            needsReminder
        };
    }).sort((a, b)=>{
        // Sort by soonest first
        return a.touchpointDate.getTime() - b.touchpointDate.getTime();
    }).slice(0, 5); // Limit to 5 soonest
    // Get the 5 most recently updated contacts (excluding archived)
    const recentContacts = contacts.filter((contact)=>!contact.archived).map((contact)=>({
            ...contact,
            id: contact.contactId
        })).slice(0, 5);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$crm$292f$DashboardPageClient$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
        userId: effectiveUserId,
        initialStats: stats,
        contactsWithUpcomingTouchpoints: contactsWithUpcomingTouchpoints,
        contactsWithOverdueTouchpoints: contactsWithOverdueTouchpoints,
        recentContacts: recentContacts
    }, void 0, false, {
        fileName: "[project]/app/(crm)/_components/DashboardPageClientWrapper.tsx",
        lineNumber: 139,
        columnNumber: 5
    }, this);
}
_s(DashboardPageClientWrapper, "YBn5PMoToqxRGzDvp7Jf2BUflmk=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useAuth$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"],
        __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useContacts$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContacts"],
        __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useDashboardStats$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useDashboardStats"]
    ];
});
_c = DashboardPageClientWrapper;
var _c;
__turbopack_context__.k.register(_c, "DashboardPageClientWrapper");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# debugId=f8ade18b-51c5-b160-61d5-01a40bbbb8ea
//# sourceMappingURL=_e8d4d024._.js.map
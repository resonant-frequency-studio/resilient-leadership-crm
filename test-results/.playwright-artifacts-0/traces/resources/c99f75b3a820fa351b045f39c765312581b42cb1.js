;!function(){try { var e="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof global?global:"undefined"!=typeof window?window:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&((e._debugIds|| (e._debugIds={}))[n]="8aa80f12-3919-d71e-3212-b3aafe505862")}catch(e){}}();
(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/lib/firebase-client.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "auth",
    ()=>auth,
    "db",
    ()=>db,
    "googleProvider",
    ()=>googleProvider
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$firebase$2f$app$2f$dist$2f$esm$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/firebase/app/dist/esm/index.esm.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$app$2f$dist$2f$esm$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@firebase/app/dist/esm/index.esm.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$firebase$2f$auth$2f$dist$2f$esm$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/firebase/auth/dist/esm/index.esm.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$auth$2f$dist$2f$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@firebase/auth/dist/esm/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$firebase$2f$firestore$2f$dist$2f$esm$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/firebase/firestore/dist/esm/index.esm.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@firebase/firestore/dist/index.esm.js [app-client] (ecmascript)");
;
;
;
// Validate required environment variables
const requiredEnvVars = {
    apiKey: ("TURBOPACK compile-time value", "AIzaSyAu5_Vv871ysZcURvnGJyZh6qkuy1qcw6Y"),
    authDomain: ("TURBOPACK compile-time value", "crm-coaching-app.firebaseapp.com"),
    projectId: ("TURBOPACK compile-time value", "crm-coaching-app"),
    storageBucket: ("TURBOPACK compile-time value", "crm-coaching-app.firebasestorage.app"),
    messagingSenderId: ("TURBOPACK compile-time value", "206658035320"),
    appId: ("TURBOPACK compile-time value", "1:206658035320:web:409ffb60230e3406ea978d")
};
// Check for missing environment variables
const envVarNames = {
    apiKey: "NEXT_PUBLIC_FIREBASE_API_KEY",
    authDomain: "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN",
    projectId: "NEXT_PUBLIC_FIREBASE_PROJECT_ID",
    storageBucket: "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET",
    messagingSenderId: "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID",
    appId: "NEXT_PUBLIC_FIREBASE_APP_ID"
};
const missingVars = Object.entries(requiredEnvVars).filter(([, value])=>!value || value.trim() === "").map(([key])=>envVarNames[key]);
if (missingVars.length > 0) {
    throw new Error(`Missing required Firebase environment variables: ${missingVars.join(", ")}\n` + `Please check your .env.local file and ensure all Firebase configuration values are set.\n` + `See env.example for reference.`);
}
const firebaseConfig = {
    apiKey: requiredEnvVars.apiKey,
    authDomain: requiredEnvVars.authDomain,
    projectId: requiredEnvVars.projectId,
    storageBucket: requiredEnvVars.storageBucket,
    messagingSenderId: requiredEnvVars.messagingSenderId,
    appId: requiredEnvVars.appId
};
const app = !(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$app$2f$dist$2f$esm$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getApps"])().length ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$app$2f$dist$2f$esm$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["initializeApp"])(firebaseConfig) : (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$app$2f$dist$2f$esm$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getApps"])()[0];
const auth = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$auth$2f$dist$2f$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getAuth"])(app);
const googleProvider = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$auth$2f$dist$2f$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GoogleAuthProvider"]();
const db = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getFirestore"])(app);
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/hooks/useAuth.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useAuth",
    ()=>useAuth
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$firebase$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/firebase-client.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$firebase$2f$auth$2f$dist$2f$esm$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/firebase/auth/dist/esm/index.esm.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$auth$2f$dist$2f$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@firebase/auth/dist/esm/index.js [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
function useAuth() {
    _s();
    const [user, setUser] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useAuth.useEffect": ()=>{
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$auth$2f$dist$2f$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["onAuthStateChanged"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$firebase$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["auth"], {
                "useAuth.useEffect": (u)=>{
                    setUser(u);
                    setLoading(false);
                }
            }["useAuth.useEffect"]);
        }
    }["useAuth.useEffect"], []);
    return {
        user,
        loading
    };
}
_s(useAuth, "NiO5z6JIqzX62LS5UWDgIqbZYyY=");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/HamburgerMenu.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>HamburgerMenu
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
"use client";
;
function HamburgerMenu({ isOpen, onClick }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
        onClick: onClick,
        className: "p-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 rounded-sm",
        "aria-label": "Toggle menu",
        "aria-expanded": isOpen,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex items-center justify-center gap-2 relative",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "relative w-12 h-5 overflow-hidden",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: `absolute inset-0 text-sm font-medium text-foreground transition-transform duration-500 ease-in-out flex items-center justify-center ${isOpen ? "-translate-y-full opacity-0" : "translate-y-0 opacity-100"}`,
                            children: "Menu"
                        }, void 0, false, {
                            fileName: "[project]/components/HamburgerMenu.tsx",
                            lineNumber: 20,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: `absolute inset-0 text-xs font-medium text-foreground transition-transform duration-500 ease-in-out flex items-center justify-center ${isOpen ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"}`,
                            children: "Close"
                        }, void 0, false, {
                            fileName: "[project]/components/HamburgerMenu.tsx",
                            lineNumber: 28,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/HamburgerMenu.tsx",
                    lineNumber: 18,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "relative w-6 h-6 flex items-center justify-center",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                        className: `w-6 h-6 text-foreground transition-transform duration-500 ease-in-out ${isOpen ? "rotate-45" : "rotate-0"}`,
                        fill: "none",
                        stroke: "currentColor",
                        viewBox: "0 0 24 24",
                        strokeWidth: 2.5,
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                            strokeLinecap: "round",
                            strokeLinejoin: "round",
                            d: "M12 4v16m8-8H4"
                        }, void 0, false, {
                            fileName: "[project]/components/HamburgerMenu.tsx",
                            lineNumber: 48,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/components/HamburgerMenu.tsx",
                        lineNumber: 39,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/components/HamburgerMenu.tsx",
                    lineNumber: 38,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/components/HamburgerMenu.tsx",
            lineNumber: 16,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/HamburgerMenu.tsx",
        lineNumber: 10,
        columnNumber: 5
    }, this);
}
_c = HamburgerMenu;
var _c;
__turbopack_context__.k.register(_c, "HamburgerMenu");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/app-config.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Application configuration
 * Reads from environment variables with sensible defaults
 */ __turbopack_context__.s([
    "appConfig",
    ()=>appConfig
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
const appConfig = {
    /**
   * The name of the CRM application
   * Can be overridden via NEXT_PUBLIC_CRM_NAME environment variable
   */ crmName: ("TURBOPACK compile-time value", "Resilient Leadership CRM") || "Insight Loop CRM"
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/MobileHeader.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>MobileHeader
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$HamburgerMenu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/HamburgerMenu.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$app$2d$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/app-config.ts [app-client] (ecmascript)");
"use client";
;
;
;
;
function MobileHeader({ isMenuOpen, onMenuToggle }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
        className: "xl:hidden fixed top-0 left-0 right-0 h-16 bg-background border-b border-theme-medium z-50 flex items-center justify-between px-4",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                href: "/",
                className: "text-sm font-semibold text-theme-darkest hover:text-theme-darker transition-colors truncate max-w-[calc(100%-4rem)]",
                children: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$app$2d$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["appConfig"].crmName
            }, void 0, false, {
                fileName: "[project]/components/MobileHeader.tsx",
                lineNumber: 16,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$HamburgerMenu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                isOpen: isMenuOpen,
                onClick: onMenuToggle
            }, void 0, false, {
                fileName: "[project]/components/MobileHeader.tsx",
                lineNumber: 23,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/MobileHeader.tsx",
        lineNumber: 14,
        columnNumber: 5
    }, this);
}
_c = MobileHeader;
var _c;
__turbopack_context__.k.register(_c, "MobileHeader");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/error-utils.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Server-safe error utility functions
 * These can be used in both client and server components/API routes
 */ /**
 * Helper function to extract error message from various error types
 * Converts technical errors to customer-friendly messages
 */ __turbopack_context__.s([
    "extractErrorMessage",
    ()=>extractErrorMessage,
    "toUserFriendlyError",
    ()=>toUserFriendlyError
]);
function extractErrorMessage(error) {
    let errorMessage = "";
    if (error instanceof Error) {
        errorMessage = error.message;
    } else if (typeof error === "string") {
        errorMessage = error;
    } else {
        return "An unexpected error occurred. Please try again.";
    }
    // Firestore errors
    if (errorMessage.includes("RESOURCE_EXHAUSTED") || errorMessage.includes("Quota exceeded")) {
        return "Database quota exceeded. Please wait a few hours or upgrade your plan.";
    }
    if (errorMessage.includes("Update() requires") || errorMessage.includes("not a valid Firestore value")) {
        return "An error occurred while saving data. Please try again.";
    }
    if (errorMessage.includes("Cannot use") && errorMessage.includes("as a Firestore value")) {
        return "An error occurred while saving data. Please try again.";
    }
    if (errorMessage.includes("requires an index")) {
        return "Database configuration needed. Please contact support.";
    }
    // Network errors - but be more specific, don't catch Gmail-specific errors
    if ((errorMessage.includes("Failed to fetch") || errorMessage.includes("NetworkError")) && !errorMessage.includes("Gmail") && !errorMessage.includes("reconnect") && !errorMessage.includes("token")) {
        return "Network error. Please check your connection and try again.";
    }
    // Only catch generic "network" if it's clearly a network issue, not a Gmail auth issue
    if (errorMessage.toLowerCase().includes("network") && !errorMessage.includes("Gmail") && !errorMessage.includes("reconnect") && !errorMessage.includes("token") && !errorMessage.includes("authentication")) {
        return "Network error. Please check your connection and try again.";
    }
    // Calendar API errors - check these FIRST before generic permission errors
    // Preserve specific, user-friendly Calendar error messages
    if (errorMessage.includes("Calendar access not granted") || errorMessage.includes("reconnect your Google account with Calendar permissions") || errorMessage.includes("Calendar scope missing") || errorMessage.includes("Calendar authentication scopes are insufficient") || errorMessage.includes("Google Calendar API has not been used") || errorMessage.includes("calendar-json.googleapis.com") || errorMessage.includes("Enable it by visiting")) {
        // These are already user-friendly, preserve them
        return errorMessage;
    }
    // Gmail API errors - check these FIRST before generic permission errors
    // Preserve specific, user-friendly Gmail error messages
    if (errorMessage.includes("reconnect your Gmail account") || errorMessage.includes("Gmail authentication scopes are insufficient") || errorMessage.includes("Gmail access token has expired") || errorMessage.includes("insufficient authentication scopes") || errorMessage.includes("Gmail authentication scopes")) {
        // These are already user-friendly, preserve them
        return errorMessage;
    }
    // Convert generic Gmail API errors to user-friendly messages
    if (errorMessage.includes("Gmail API") || errorMessage.toLowerCase().includes("gmail") || errorMessage.includes("Gmail access token")) {
        return "Email sync error. Please try again or contact support if the issue persists.";
    }
    // Permission/authentication errors (but not Gmail-related)
    if (errorMessage.includes("permission") || errorMessage.includes("Permission") || errorMessage.includes("PERMISSION_DENIED")) {
        return "Permission denied. Please ensure you're logged in and have access.";
    }
    if (errorMessage.includes("UNAUTHENTICATED") || errorMessage.includes("authentication")) {
        return "Authentication required. Please log in and try again.";
    }
    // Generic technical error patterns - convert to friendly messages
    if (errorMessage.includes("TypeError") || errorMessage.includes("ReferenceError") || errorMessage.includes("SyntaxError")) {
        return "An unexpected error occurred. Please refresh the page and try again.";
    }
    if (errorMessage.includes("undefined") && errorMessage.includes("is not a function")) {
        return "An error occurred. Please refresh the page and try again.";
    }
    // If the error message looks technical (contains common technical terms), provide a generic message
    const technicalPatterns = [
        /\.tsx?:\d+:\d+/i,
        /at \w+\.\w+/,
        /Error: /i,
        /Exception: /i,
        /\[object Object\]/i
    ];
    if (technicalPatterns.some((pattern)=>pattern.test(errorMessage))) {
        return "An error occurred. Please try again or contact support if the issue persists.";
    }
    // If error message is already user-friendly (short, no technical jargon), return it
    if (errorMessage.length < 100 && !errorMessage.includes(".") && !errorMessage.includes("Error")) {
        return errorMessage;
    }
    // Default fallback for any remaining technical errors
    return "An error occurred. Please try again or contact support if the issue persists.";
}
function toUserFriendlyError(error) {
    return extractErrorMessage(error);
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/ErrorMessage.tsx [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ErrorMessage",
    ()=>ErrorMessage,
    "extractApiError",
    ()=>extractApiError
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$error$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/error-utils.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
function ErrorMessage({ message, className = "", dismissible = false, onDismiss }) {
    _s();
    const [dismissed, setDismissed] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].useState(false);
    const handleDismiss = ()=>{
        setDismissed(true);
        onDismiss?.();
    };
    if (dismissed) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: `flex items-start gap-2 p-3 bg-theme-medium border border-red-200 rounded-sm ${className}`,
        role: "alert",
        "aria-live": "polite",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                className: "w-5 h-5 text-red-600 shrink-0 mt-0.5",
                fill: "none",
                stroke: "currentColor",
                viewBox: "0 0 24 24",
                "aria-hidden": "true",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                    strokeLinecap: "round",
                    strokeLinejoin: "round",
                    strokeWidth: 2,
                    d: "M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                }, void 0, false, {
                    fileName: "[project]/components/ErrorMessage.tsx",
                    lineNumber: 41,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/ErrorMessage.tsx",
                lineNumber: 34,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "flex-1 text-sm text-red-800 font-medium",
                children: message
            }, void 0, false, {
                fileName: "[project]/components/ErrorMessage.tsx",
                lineNumber: 48,
                columnNumber: 7
            }, this),
            dismissible && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                onClick: handleDismiss,
                className: "text-red-600 hover:text-red-800 focus:outline-none focus:ring-2 focus:ring-red-500 rounded",
                "aria-label": "Dismiss error message",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                    className: "w-4 h-4",
                    fill: "none",
                    stroke: "currentColor",
                    viewBox: "0 0 24 24",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                        strokeLinecap: "round",
                        strokeLinejoin: "round",
                        strokeWidth: 2,
                        d: "M6 18L18 6M6 6l12 12"
                    }, void 0, false, {
                        fileName: "[project]/components/ErrorMessage.tsx",
                        lineNumber: 61,
                        columnNumber: 13
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/components/ErrorMessage.tsx",
                    lineNumber: 55,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/ErrorMessage.tsx",
                lineNumber: 50,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/ErrorMessage.tsx",
        lineNumber: 29,
        columnNumber: 5
    }, this);
}
_s(ErrorMessage, "QAOOD081Jhe76HGRMdQoGotM9i0=");
_c = ErrorMessage;
;
async function extractApiError(response) {
    try {
        const errorData = await response.json();
        if (errorData.error) {
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$error$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["extractErrorMessage"])(errorData.error);
        }
        if (errorData.message) {
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$error$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["extractErrorMessage"])(errorData.message);
        }
    } catch  {
    // If JSON parsing fails, use status text
    }
    // Use status text as fallback
    if (response.status === 429) {
        return "Too many requests. Please wait a moment and try again.";
    }
    if (response.status === 503) {
        return "Service temporarily unavailable. Please try again later.";
    }
    if (response.status >= 500) {
        return "Server error. Please try again later.";
    }
    if (response.status === 401 || response.status === 403) {
        return "Authentication required. Please log in and try again.";
    }
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$error$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["extractErrorMessage"])(`Request failed: ${response.statusText || "Unknown error"}`);
}
var _c;
__turbopack_context__.k.register(_c, "ErrorMessage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/Button.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Button",
    ()=>Button
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ErrorMessage$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/components/ErrorMessage.tsx [app-client] (ecmascript) <locals>");
"use client";
;
;
const variantStyles = {
    primary: "bg-btn-primary-bg border-2 border-btn-primary-border text-btn-primary-fg hover:bg-btn-primary-bg-hover focus:ring-btn-primary-focus-ring disabled:bg-btn-primary-bg-disabled disabled:text-btn-primary-fg-disabled",
    danger: "bg-red-600 text-[#eeeeec] hover:bg-red-700 focus:ring-red-500 disabled:bg-red-400",
    secondary: "bg-btn-secondary-bg text-btn-secondary-fg border-2 border-btn-secondary-border hover:bg-btn-secondary-bg-hover focus:ring-btn-secondary-focus-ring disabled:bg-btn-secondary-bg-disabled disabled:text-btn-secondary-fg-disabled",
    outline: "bg-transparent border-2 border-theme-dark text-theme-darker hover:bg-theme-light focus:ring-gray-500 disabled:border-gray-300 disabled:text-gray-400",
    link: "bg-transparent text-blue-600 hover:text-blue-700 underline focus:ring-blue-500 disabled:text-blue-400"
};
const sizeStyles = {
    xs: "px-2 py-1 text-sm",
    sm: "px-3 py-1.5 text-base",
    md: "px-4 py-2.5 text-base",
    lg: "px-6 py-3 text-lg"
};
function Button({ variant = "primary", size = "md", loading = false, error = null, disabled = false, fullWidth = false, icon, iconPosition = "left", className = "", children, ...props }) {
    const isDisabled = disabled || loading;
    const baseStyles = "cursor-pointer inline-flex items-center justify-center gap-2 font-medium rounded-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";
    const variantStyle = variantStyles[variant];
    const sizeStyle = sizeStyles[size];
    // Check if className includes w-full to determine if button should be full width
    const hasFullWidthClass = className.includes("w-full");
    const shouldBeFullWidth = fullWidth || hasFullWidthClass;
    const widthStyle = shouldBeFullWidth ? "w-full" : "";
    // Add active scale effect for interactive buttons (can be overridden with className)
    const activeScale = className.includes("active:scale") ? "" : "active:scale-95";
    const combinedClassName = `${baseStyles} ${variantStyle} ${sizeStyle} ${widthStyle} ${activeScale} ${className}`.trim();
    const renderIcon = ()=>{
        if (loading) {
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                className: "animate-spin h-4 w-4",
                xmlns: "http://www.w3.org/2000/svg",
                fill: "none",
                viewBox: "0 0 24 24",
                "aria-hidden": "true",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                        className: "opacity-25",
                        cx: "12",
                        cy: "12",
                        r: "10",
                        stroke: "currentColor",
                        strokeWidth: "4"
                    }, void 0, false, {
                        fileName: "[project]/components/Button.tsx",
                        lineNumber: 87,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                        className: "opacity-75",
                        fill: "currentColor",
                        d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    }, void 0, false, {
                        fileName: "[project]/components/Button.tsx",
                        lineNumber: 95,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/Button.tsx",
                lineNumber: 80,
                columnNumber: 9
            }, this);
        }
        return icon;
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: shouldBeFullWidth ? "w-full" : "inline-block",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                type: props.type || "button",
                disabled: isDisabled,
                "aria-busy": loading,
                "aria-disabled": isDisabled,
                className: combinedClassName,
                ...props,
                children: [
                    iconPosition === "left" && renderIcon(),
                    loading && !icon ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "sr-only",
                        children: "Loading..."
                    }, void 0, false, {
                        fileName: "[project]/components/Button.tsx",
                        lineNumber: 118,
                        columnNumber: 11
                    }, this) : children,
                    iconPosition === "right" && renderIcon()
                ]
            }, void 0, true, {
                fileName: "[project]/components/Button.tsx",
                lineNumber: 108,
                columnNumber: 7
            }, this),
            error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ErrorMessage$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["ErrorMessage"], {
                message: error,
                className: "mt-2"
            }, void 0, false, {
                fileName: "[project]/components/Button.tsx",
                lineNumber: 124,
                columnNumber: 17
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/Button.tsx",
        lineNumber: 107,
        columnNumber: 5
    }, this);
}
_c = Button;
var _c;
__turbopack_context__.k.register(_c, "Button");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/error-reporting/noop-reporter.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "NoopReporter",
    ()=>NoopReporter
]);
class NoopReporter {
    captureException(_error, _context) {
    // No-op
    }
    captureMessage(_message, _level, _context) {
    // No-op
    }
    setUser(_user) {
    // No-op
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/error-reporting/types.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Error reporting abstraction types
 * Provides a pluggable interface for error reporting providers
 */ __turbopack_context__.s([
    "ErrorLevel",
    ()=>ErrorLevel
]);
var ErrorLevel = /*#__PURE__*/ function(ErrorLevel) {
    ErrorLevel["DEBUG"] = "debug";
    ErrorLevel["INFO"] = "info";
    ErrorLevel["WARNING"] = "warning";
    ErrorLevel["ERROR"] = "error";
    ErrorLevel["FATAL"] = "fatal";
    return ErrorLevel;
}({});
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/error-reporting/console-reporter.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ConsoleReporter",
    ()=>ConsoleReporter
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$error$2d$reporting$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/error-reporting/types.ts [app-client] (ecmascript)");
;
class ConsoleReporter {
    captureException(error, context) {
        const errorObj = error instanceof Error ? error : new Error(String(error));
        console.error("Error captured:", errorObj.message, {
            error: errorObj,
            stack: errorObj.stack,
            ...context
        });
    }
    captureMessage(message, level = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$error$2d$reporting$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ErrorLevel"].INFO, context) {
        const logData = {
            message,
            level,
            ...context
        };
        switch(level){
            case __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$error$2d$reporting$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ErrorLevel"].DEBUG:
                console.debug("Debug:", message, logData);
                break;
            case __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$error$2d$reporting$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ErrorLevel"].INFO:
                console.info("Info:", message, logData);
                break;
            case __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$error$2d$reporting$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ErrorLevel"].WARNING:
                console.warn("Warning:", message, logData);
                break;
            case __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$error$2d$reporting$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ErrorLevel"].ERROR:
            case __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$error$2d$reporting$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ErrorLevel"].FATAL:
                console.error("Error:", message, logData);
                break;
            default:
                console.log("Log:", message, logData);
        }
    }
    setUser(user) {
        if (user) {
            console.info("Error reporter user context set:", {
                id: user.id,
                email: user.email,
                username: user.username
            });
        } else {
            console.info("Error reporter user context cleared");
        }
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/error-reporting/sentry-reporter.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SentryReporter",
    ()=>SentryReporter
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$error$2d$reporting$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/error-reporting/types.ts [app-client] (ecmascript)");
;
class SentryReporter {
    getSentry() {
        try {
            // Dynamic import to avoid requiring Sentry at build time
            // This will only work if Sentry is actually installed
            // eslint-disable-next-line @typescript-eslint/no-require-imports
            return __turbopack_context__.r("[project]/node_modules/@sentry/nextjs/build/cjs/index.client.js [app-client] (ecmascript)");
        } catch  {
            return null;
        }
    }
    mapLevelToSentrySeverity(level) {
        switch(level){
            case __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$error$2d$reporting$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ErrorLevel"].DEBUG:
                return "debug";
            case __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$error$2d$reporting$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ErrorLevel"].INFO:
                return "info";
            case __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$error$2d$reporting$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ErrorLevel"].WARNING:
                return "warning";
            case __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$error$2d$reporting$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ErrorLevel"].ERROR:
                return "error";
            case __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$error$2d$reporting$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ErrorLevel"].FATAL:
                return "fatal";
            default:
                return "error";
        }
    }
    captureException(error, context) {
        try {
            const Sentry = this.getSentry();
            if (!Sentry) {
                // Fallback to console if Sentry is not available
                console.error("Sentry not available. Error:", error, context);
                return;
            }
            const errorObj = error instanceof Error ? error : new Error(String(error));
            Sentry.withScope((scope)=>{
                if (context?.level) {
                    scope.setLevel(this.mapLevelToSentrySeverity(context.level));
                } else {
                    scope.setLevel("error");
                }
                if (context?.tags) {
                    Object.entries(context.tags).forEach(([key, value])=>{
                        scope.setTag(key, value);
                    });
                }
                if (context?.extra) {
                    Object.entries(context.extra).forEach(([key, value])=>{
                        scope.setExtra(key, value);
                    });
                }
                if (context?.userId) {
                    scope.setUser({
                        id: context.userId
                    });
                }
                if (context?.context) {
                    scope.setContext("custom", {
                        context: context.context
                    });
                }
                Sentry.captureException(errorObj);
            });
        } catch (err) {
            // Fail silently - don't crash the app if Sentry fails
            console.error("Failed to report error to Sentry:", err);
        }
    }
    captureMessage(message, level = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$error$2d$reporting$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ErrorLevel"].INFO, context) {
        try {
            const Sentry = this.getSentry();
            if (!Sentry) {
                // Fallback to console if Sentry is not available
                console.log(`[${level}] ${message}`, context);
                return;
            }
            Sentry.withScope((scope)=>{
                scope.setLevel(this.mapLevelToSentrySeverity(level));
                if (context?.tags) {
                    Object.entries(context.tags).forEach(([key, value])=>{
                        scope.setTag(key, value);
                    });
                }
                if (context?.extra) {
                    Object.entries(context.extra).forEach(([key, value])=>{
                        scope.setExtra(key, value);
                    });
                }
                if (context?.userId) {
                    scope.setUser({
                        id: context.userId
                    });
                }
                if (context?.context) {
                    scope.setContext("custom", {
                        context: context.context
                    });
                }
                Sentry.captureMessage(message, this.mapLevelToSentrySeverity(level));
            });
        } catch (err) {
            // Fail silently - don't crash the app if Sentry fails
            console.error("Failed to report message to Sentry:", err);
        }
    }
    setUser(user) {
        try {
            const Sentry = this.getSentry();
            if (!Sentry) {
                return;
            }
            if (user) {
                Sentry.setUser({
                    id: user.id,
                    email: user.email,
                    username: user.username
                });
            } else {
                Sentry.setUser(null);
            }
        } catch (err) {
            // Fail silently - don't crash the app if Sentry fails
            console.error("Failed to set Sentry user:", err);
        }
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/error-reporting/index.ts [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "clearCustomReporter",
    ()=>clearCustomReporter,
    "getErrorReporter",
    ()=>getErrorReporter,
    "registerErrorReporter",
    ()=>registerErrorReporter,
    "reportException",
    ()=>reportException,
    "reportMessage",
    ()=>reportMessage,
    "setErrorUser",
    ()=>setErrorUser
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$error$2d$reporting$2f$noop$2d$reporter$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/error-reporting/noop-reporter.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$error$2d$reporting$2f$console$2d$reporter$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/error-reporting/console-reporter.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$error$2d$reporting$2f$sentry$2d$reporter$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/error-reporting/sentry-reporter.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$error$2d$reporting$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/error-reporting/types.ts [app-client] (ecmascript)");
;
;
;
let cachedReporter = null;
let customReporter = null;
/**
 * Create an error reporter based on environment configuration
 */ function createReporter() {
    // Check for runtime override first
    if (customReporter) {
        return customReporter;
    }
    // Use cached instance if available
    if (cachedReporter) {
        return cachedReporter;
    }
    // Determine provider from environment variable
    const provider = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.NEXT_PUBLIC_ERROR_REPORTING_PROVIDER?.toLowerCase() || "console";
    switch(provider){
        case "sentry":
            cachedReporter = new __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$error$2d$reporting$2f$sentry$2d$reporter$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SentryReporter"]();
            break;
        case "none":
            cachedReporter = new __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$error$2d$reporting$2f$noop$2d$reporter$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NoopReporter"]();
            break;
        case "console":
        default:
            cachedReporter = new __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$error$2d$reporting$2f$console$2d$reporter$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ConsoleReporter"]();
            break;
    }
    return cachedReporter;
}
function getErrorReporter() {
    return createReporter();
}
function registerErrorReporter(reporter) {
    customReporter = reporter;
}
function clearCustomReporter() {
    customReporter = null;
}
function reportException(error, context) {
    getErrorReporter().captureException(error, context);
}
function reportMessage(message, level, context) {
    getErrorReporter().captureMessage(message, level, context);
}
function setErrorUser(user) {
    getErrorReporter().setUser(user);
}
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/contexts/SavingStateContext.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SavingStateProvider",
    ()=>SavingStateProvider,
    "useSavingState",
    ()=>useSavingState
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
"use client";
;
const SavingStateContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])(undefined);
function SavingStateProvider({ children }) {
    _s();
    // Track save statuses by component ID
    const [saveStatuses, setSaveStatuses] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(new Map());
    const registerSaveStatus = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "SavingStateProvider.useCallback[registerSaveStatus]": (id, status)=>{
            setSaveStatuses({
                "SavingStateProvider.useCallback[registerSaveStatus]": (prev)=>{
                    const next = new Map(prev);
                    next.set(id, status);
                    return next;
                }
            }["SavingStateProvider.useCallback[registerSaveStatus]"]);
        }
    }["SavingStateProvider.useCallback[registerSaveStatus]"], []);
    const unregisterSaveStatus = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "SavingStateProvider.useCallback[unregisterSaveStatus]": (id)=>{
            setSaveStatuses({
                "SavingStateProvider.useCallback[unregisterSaveStatus]": (prev)=>{
                    const next = new Map(prev);
                    next.delete(id);
                    return next;
                }
            }["SavingStateProvider.useCallback[unregisterSaveStatus]"]);
        }
    }["SavingStateProvider.useCallback[unregisterSaveStatus]"], []);
    // Determine if any component is currently saving
    const isSaving = Array.from(saveStatuses.values()).some((status)=>status === "saving");
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SavingStateContext.Provider, {
        value: {
            isSaving,
            registerSaveStatus,
            unregisterSaveStatus
        },
        children: children
    }, void 0, false, {
        fileName: "[project]/contexts/SavingStateContext.tsx",
        lineNumber: 39,
        columnNumber: 5
    }, this);
}
_s(SavingStateProvider, "41YsY2Ou8e7UUHS7BUcsJ/iN9QY=");
_c = SavingStateProvider;
function useSavingState() {
    _s1();
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(SavingStateContext);
    // Provide default values if context is not available (shouldn't happen, but be defensive)
    if (context === undefined) {
        return {
            isSaving: false,
            registerSaveStatus: ()=>{},
            unregisterSaveStatus: ()=>{}
        };
    }
    return context;
}
_s1(useSavingState, "b9L3QQ+jgeyIrH0NfHrJ8nn7VMU=");
var _c;
__turbopack_context__.k.register(_c, "SavingStateProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/ThemeProvider.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ThemeProvider",
    ()=>ThemeProvider,
    "useTheme",
    ()=>useTheme
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
'use client';
;
const ThemeContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])(undefined);
function ThemeProvider({ children }) {
    _s();
    // Get system preference
    const getSystemTheme = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "ThemeProvider.useCallback[getSystemTheme]": ()=>{
            if ("TURBOPACK compile-time truthy", 1) {
                return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
            }
            //TURBOPACK unreachable
            ;
        }
    }["ThemeProvider.useCallback[getSystemTheme]"], []);
    // Initialize theme from localStorage or detect system preference
    const [theme, setThemeState] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        "ThemeProvider.useState": ()=>{
            if ("TURBOPACK compile-time truthy", 1) {
                const savedTheme = localStorage.getItem('theme');
                // If no saved theme or saved theme is 'system', detect system preference and set to 'light' or 'dark' directly
                if (!savedTheme || savedTheme === 'system') {
                    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                    // Save the detected theme to localStorage
                    localStorage.setItem('theme', systemTheme);
                    return systemTheme;
                }
                return savedTheme;
            }
            //TURBOPACK unreachable
            ;
        }
    }["ThemeProvider.useState"]);
    const [mounted, setMounted] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    // Compute resolved theme from current theme state
    // Since we no longer use 'system', resolvedTheme is just the theme
    const resolvedTheme = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "ThemeProvider.useMemo[resolvedTheme]": ()=>{
            // If somehow theme is 'system', fallback to system detection
            // (This should not happen since we migrate 'system' in initial state)
            if (theme === 'system') {
                return getSystemTheme();
            }
            return theme;
        }
    }["ThemeProvider.useMemo[resolvedTheme]"], [
        theme,
        getSystemTheme
    ]);
    // Apply theme to DOM (no state updates)
    const applyThemeToDOM = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "ThemeProvider.useCallback[applyThemeToDOM]": (appliedTheme)=>{
            const root = document.documentElement;
            if (appliedTheme === 'dark') {
                root.setAttribute('data-theme', 'dark');
            } else {
                root.setAttribute('data-theme', 'light');
            }
        }
    }["ThemeProvider.useCallback[applyThemeToDOM]"], []);
    // Set theme and persist to localStorage
    const setTheme = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "ThemeProvider.useCallback[setTheme]": (newTheme)=>{
            setThemeState(newTheme);
            localStorage.setItem('theme', newTheme);
        }
    }["ThemeProvider.useCallback[setTheme]"], []);
    // Apply theme to DOM when resolved theme changes
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ThemeProvider.useEffect": ()=>{
            if (mounted) {
                applyThemeToDOM(resolvedTheme);
            }
        }
    }["ThemeProvider.useEffect"], [
        resolvedTheme,
        mounted,
        applyThemeToDOM
    ]);
    // Initialize on mount and listen for system theme changes
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ThemeProvider.useEffect": ()=>{
            // Apply initial theme
            // applyThemeToDOM(resolvedTheme); // Handled by the other useEffect when mounted becomes true
            setTimeout({
                "ThemeProvider.useEffect": ()=>setMounted(true)
            }["ThemeProvider.useEffect"], 0);
        // No longer need to listen for system theme changes since we don't use 'system'
        // Users explicitly choose 'light' or 'dark'
        }
    }["ThemeProvider.useEffect"], [
        theme,
        resolvedTheme,
        applyThemeToDOM
    ]);
    // Prevent flash of unstyled content
    if (!mounted) {
        return null;
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ThemeContext.Provider, {
        value: {
            theme,
            setTheme,
            resolvedTheme
        },
        children: children
    }, void 0, false, {
        fileName: "[project]/components/ThemeProvider.tsx",
        lineNumber: 104,
        columnNumber: 5
    }, this);
}
_s(ThemeProvider, "zuNl5PQgB3LgN9xl03ztIuRqViA=");
_c = ThemeProvider;
function useTheme() {
    _s1();
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
}
_s1(useTheme, "b9L3QQ+jgeyIrH0NfHrJ8nn7VMU=");
var _c;
__turbopack_context__.k.register(_c, "ThemeProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/ThemeToggle.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ThemeToggle
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ThemeProvider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ThemeProvider.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
function ThemeToggle() {
    _s();
    const { theme, setTheme, resolvedTheme } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ThemeProvider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTheme"])();
    const cycleTheme = ()=>{
        // Only toggle between light and dark
        const themes = [
            'light',
            'dark'
        ];
        const currentIndex = themes.indexOf(theme);
        const nextIndex = (currentIndex + 1) % themes.length;
        setTheme(themes[nextIndex]);
    };
    const getIcon = ()=>{
        // Use resolvedTheme to determine icon (handles 'system' case if it exists)
        if (resolvedTheme === 'dark') {
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                className: "w-4 h-4",
                xmlns: "http://www.w3.org/2000/svg",
                fill: "none",
                stroke: "currentColor",
                strokeWidth: "2",
                strokeLinecap: "round",
                strokeLinejoin: "round",
                viewBox: "0 0 24 24",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                    d: "M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
                }, void 0, false, {
                    fileName: "[project]/components/ThemeToggle.tsx",
                    lineNumber: 30,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/ThemeToggle.tsx",
                lineNumber: 20,
                columnNumber: 9
            }, this);
        }
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
            className: "w-4 h-4",
            xmlns: "http://www.w3.org/2000/svg",
            fill: "none",
            stroke: "currentColor",
            strokeWidth: "2",
            strokeLinecap: "round",
            strokeLinejoin: "round",
            viewBox: "0 0 24 24",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                    cx: "12",
                    cy: "12",
                    r: "4"
                }, void 0, false, {
                    fileName: "[project]/components/ThemeToggle.tsx",
                    lineNumber: 46,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                    d: "M12 2v2"
                }, void 0, false, {
                    fileName: "[project]/components/ThemeToggle.tsx",
                    lineNumber: 47,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                    d: "M12 20v2"
                }, void 0, false, {
                    fileName: "[project]/components/ThemeToggle.tsx",
                    lineNumber: 48,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                    d: "m4.93 4.93 1.41 1.41"
                }, void 0, false, {
                    fileName: "[project]/components/ThemeToggle.tsx",
                    lineNumber: 49,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                    d: "m17.66 17.66 1.41 1.41"
                }, void 0, false, {
                    fileName: "[project]/components/ThemeToggle.tsx",
                    lineNumber: 50,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                    d: "M2 12h2"
                }, void 0, false, {
                    fileName: "[project]/components/ThemeToggle.tsx",
                    lineNumber: 51,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                    d: "M20 12h2"
                }, void 0, false, {
                    fileName: "[project]/components/ThemeToggle.tsx",
                    lineNumber: 52,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                    d: "m6.34 17.66-1.41 1.41"
                }, void 0, false, {
                    fileName: "[project]/components/ThemeToggle.tsx",
                    lineNumber: 53,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                    d: "m19.07 4.93-1.41 1.41"
                }, void 0, false, {
                    fileName: "[project]/components/ThemeToggle.tsx",
                    lineNumber: 54,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/components/ThemeToggle.tsx",
            lineNumber: 36,
            columnNumber: 7
        }, this);
    };
    const getLabel = ()=>{
        // Show the opposite theme - what clicking will switch to
        if (resolvedTheme === 'dark') {
            return 'Light Mode';
        }
        return 'Dark Mode';
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
        onClick: cycleTheme,
        className: "flex items-center justify-center gap-2 w-full px-3 py-1.5 text-sm font-medium rounded-sm bg-card-highlight-light hover:bg-theme-light text-foreground transition-colors duration-200 cursor-pointer mb-3",
        "aria-label": `Switch to ${getLabel()}`,
        title: `Switch to ${getLabel()}`,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "flex items-center justify-center shrink-0",
                children: getIcon()
            }, void 0, false, {
                fileName: "[project]/components/ThemeToggle.tsx",
                lineNumber: 74,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "font-medium",
                children: getLabel()
            }, void 0, false, {
                fileName: "[project]/components/ThemeToggle.tsx",
                lineNumber: 75,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/ThemeToggle.tsx",
        lineNumber: 68,
        columnNumber: 5
    }, this);
}
_s(ThemeToggle, "5puWP7kDS4+x9mvfqm7YZ5g0Rcw=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ThemeProvider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTheme"]
    ];
});
_c = ThemeToggle;
var _c;
__turbopack_context__.k.register(_c, "ThemeToggle");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/CrmLayoutWrapper.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "CrmLayoutWrapper",
    ()=>CrmLayoutWrapper
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useAuth$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hooks/useAuth.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$firebase$2f$auth$2f$dist$2f$esm$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/firebase/auth/dist/esm/index.esm.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$auth$2f$dist$2f$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@firebase/auth/dist/esm/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$firebase$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/firebase-client.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$MobileHeader$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/MobileHeader.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/Button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$app$2d$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/app-config.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$error$2d$reporting$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/lib/error-reporting/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$SavingStateContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/contexts/SavingStateContext.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ThemeToggle$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ThemeToggle.tsx [app-client] (ecmascript)");
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
const navigationLinks = [
    {
        href: "/",
        label: "Dashboard",
        iconPath: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
            strokeLinecap: "round",
            strokeLinejoin: "round",
            strokeWidth: 2,
            d: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
        }, void 0, false, {
            fileName: "[project]/components/CrmLayoutWrapper.tsx",
            lineNumber: 21,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0))
    },
    {
        href: "/calendar",
        label: "Calendar",
        iconPath: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
            strokeLinecap: "round",
            strokeLinejoin: "round",
            strokeWidth: 2,
            d: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
        }, void 0, false, {
            fileName: "[project]/components/CrmLayoutWrapper.tsx",
            lineNumber: 33,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0))
    },
    {
        href: "/contacts",
        label: "Contacts",
        iconPath: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
            strokeLinecap: "round",
            strokeLinejoin: "round",
            strokeWidth: 2,
            d: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
        }, void 0, false, {
            fileName: "[project]/components/CrmLayoutWrapper.tsx",
            lineNumber: 45,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0)),
        hasSubmenu: true
    },
    {
        href: "/action-items",
        label: "Action Items",
        iconPath: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
            strokeLinecap: "round",
            strokeLinejoin: "round",
            strokeWidth: 2,
            d: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
        }, void 0, false, {
            fileName: "[project]/components/CrmLayoutWrapper.tsx",
            lineNumber: 58,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0))
    },
    {
        href: "#",
        label: "Touchpoints",
        iconPath: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
            strokeLinecap: "round",
            strokeLinejoin: "round",
            strokeWidth: 2,
            d: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
        }, void 0, false, {
            fileName: "[project]/components/CrmLayoutWrapper.tsx",
            lineNumber: 70,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0)),
        hasSubmenu: true,
        isButtonOnly: true
    },
    {
        href: "/charts",
        label: "Charts",
        iconPath: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
            strokeLinecap: "round",
            strokeLinejoin: "round",
            strokeWidth: 2,
            d: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
        }, void 0, false, {
            fileName: "[project]/components/CrmLayoutWrapper.tsx",
            lineNumber: 84,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0))
    },
    {
        href: "/sync",
        label: "Sync Status",
        iconPath: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
            strokeLinecap: "round",
            strokeLinejoin: "round",
            strokeWidth: 2,
            d: "M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
        }, void 0, false, {
            fileName: "[project]/components/CrmLayoutWrapper.tsx",
            lineNumber: 96,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0))
    },
    {
        href: "/faq",
        label: "FAQ",
        iconPath: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
            strokeLinecap: "round",
            strokeLinejoin: "round",
            strokeWidth: 2,
            d: "M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        }, void 0, false, {
            fileName: "[project]/components/CrmLayoutWrapper.tsx",
            lineNumber: 108,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0))
    }
];
const contactsSubmenuLinks = [
    {
        href: "/contacts/new",
        label: "Add Contact",
        iconPath: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
            strokeLinecap: "round",
            strokeLinejoin: "round",
            strokeWidth: 2,
            d: "M12 4v16m8-8H4"
        }, void 0, false, {
            fileName: "[project]/components/CrmLayoutWrapper.tsx",
            lineNumber: 123,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0))
    },
    {
        href: "/contacts/import",
        label: "Import Contacts",
        iconPath: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
            strokeLinecap: "round",
            strokeLinejoin: "round",
            strokeWidth: 2,
            d: "M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
        }, void 0, false, {
            fileName: "[project]/components/CrmLayoutWrapper.tsx",
            lineNumber: 135,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0))
    }
];
const touchpointsSubmenuLinks = [
    {
        href: "/touchpoints/today",
        label: "Today",
        iconPath: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
            strokeLinecap: "round",
            strokeLinejoin: "round",
            strokeWidth: 2,
            d: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
        }, void 0, false, {
            fileName: "[project]/components/CrmLayoutWrapper.tsx",
            lineNumber: 150,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0))
    },
    {
        href: "/touchpoints/overdue",
        label: "Overdue",
        iconPath: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
            strokeLinecap: "round",
            strokeLinejoin: "round",
            strokeWidth: 2,
            d: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
        }, void 0, false, {
            fileName: "[project]/components/CrmLayoutWrapper.tsx",
            lineNumber: 162,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0))
    },
    {
        href: "/touchpoints/upcoming",
        label: "Upcoming",
        iconPath: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
            strokeLinecap: "round",
            strokeLinejoin: "round",
            strokeWidth: 2,
            d: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
        }, void 0, false, {
            fileName: "[project]/components/CrmLayoutWrapper.tsx",
            lineNumber: 174,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0))
    }
];
function CrmLayoutWrapper({ children }) {
    _s();
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"])();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const { user, loading } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useAuth$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"])();
    const { isSaving } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$SavingStateContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSavingState"])();
    const isLoginPage = pathname === "/login";
    const showUserElements = user && !loading;
    const [isMobileMenuOpen, setIsMobileMenuOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [signingOut, setSigningOut] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const previousPathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(pathname);
    const [hasSessionCookie, setHasSessionCookie] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [isTouchpointsOpen, setIsTouchpointsOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isContactsOpen, setIsContactsOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const isActive = (path)=>{
        if (path === "/") {
            return pathname === "/";
        }
        return pathname?.startsWith(path);
    };
    // Auto-expand Touchpoints submenu if on a touchpoint page
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "CrmLayoutWrapper.useEffect": ()=>{
            if (pathname?.startsWith("/touchpoints/")) {
                setIsTouchpointsOpen(true);
            }
        }
    }["CrmLayoutWrapper.useEffect"], [
        pathname
    ]);
    // Auto-expand Contacts submenu if on a contacts submenu page
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "CrmLayoutWrapper.useEffect": ()=>{
            if (pathname === "/contacts/new" || pathname === "/contacts/import") {
                setIsContactsOpen(true);
            }
        }
    }["CrmLayoutWrapper.useEffect"], [
        pathname
    ]);
    // Close mobile menu when pathname changes
    // This closes the menu on navigation (e.g., browser back/forward, programmatic navigation)
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "CrmLayoutWrapper.useEffect": ()=>{
            if (previousPathname.current !== pathname) {
                previousPathname.current = pathname;
                // Close menu on navigation - defer to avoid cascading renders
                const timer = setTimeout({
                    "CrmLayoutWrapper.useEffect.timer": ()=>{
                        setIsMobileMenuOpen(false);
                    }
                }["CrmLayoutWrapper.useEffect.timer"], 0);
                return ({
                    "CrmLayoutWrapper.useEffect": ()=>clearTimeout(timer)
                })["CrmLayoutWrapper.useEffect"];
            }
        }
    }["CrmLayoutWrapper.useEffect"], [
        pathname
    ]);
    // Prevent body scroll when mobile menu is open
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "CrmLayoutWrapper.useEffect": ()=>{
            if (isMobileMenuOpen) {
                document.body.style.overflow = "hidden";
            } else {
                document.body.style.overflow = "";
            }
            return ({
                "CrmLayoutWrapper.useEffect": ()=>{
                    document.body.style.overflow = "";
                }
            })["CrmLayoutWrapper.useEffect"];
        }
    }["CrmLayoutWrapper.useEffect"], [
        isMobileMenuOpen
    ]);
    // Check session validity periodically (not immediately to avoid race conditions after login)
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "CrmLayoutWrapper.useEffect": ()=>{
            if (isLoginPage || loading || !user) return;
            let intervalId = null;
            let failureCount = 0;
            const MAX_FAILURES = 2; // Allow 2 failures before redirecting (to account for timing issues)
            const checkSession = {
                "CrmLayoutWrapper.useEffect.checkSession": async ()=>{
                    try {
                        const res = await fetch("/api/auth/check", {
                            credentials: "include"
                        });
                        if (!res.ok) {
                            failureCount++;
                            // Only redirect after multiple failures (to avoid false positives after login)
                            if (failureCount >= MAX_FAILURES) {
                                router.push("/login?expired=true");
                            }
                        } else {
                            // Reset failure count on success
                            failureCount = 0;
                        }
                    } catch (error) {
                        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$error$2d$reporting$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["reportException"])(error, {
                            context: "Session check failed",
                            tags: {
                                component: "CrmLayoutWrapper"
                            }
                        });
                    // Don't increment failure count on network errors
                    }
                }
            }["CrmLayoutWrapper.useEffect.checkSession"];
            // Delay initial check to avoid race condition with cookie being set after login
            // Longer delay to ensure cookie is fully available
            const initialDelay = setTimeout({
                "CrmLayoutWrapper.useEffect.initialDelay": ()=>{
                    checkSession();
                    // Check session every 5 minutes
                    intervalId = setInterval(checkSession, 5 * 60 * 1000);
                }
            }["CrmLayoutWrapper.useEffect.initialDelay"], 2000); // Wait 2 seconds after mount before first check
            return ({
                "CrmLayoutWrapper.useEffect": ()=>{
                    clearTimeout(initialDelay);
                    if (intervalId) {
                        clearInterval(intervalId);
                    }
                }
            })["CrmLayoutWrapper.useEffect"];
        }
    }["CrmLayoutWrapper.useEffect"], [
        isLoginPage,
        loading,
        user,
        router
    ]);
    // Handle sign out with session cleanup
    const handleSignOut = async ()=>{
        setSigningOut(true);
        try {
            // Clear Firebase auth
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$auth$2f$dist$2f$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["signOut"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$firebase$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["auth"]);
            // Clear session cookie
            await fetch("/api/auth/session", {
                method: "DELETE"
            });
            // Redirect to login
            router.push("/login");
        } catch (error) {
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$error$2d$reporting$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["reportException"])(error, {
                context: "Sign out error",
                tags: {
                    component: "CrmLayoutWrapper"
                }
            });
            // Still redirect even if cleanup fails
            router.push("/login");
        }
    };
    // Check session cookie when there's no Firebase user (for E2E tests that use session cookies only)
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "CrmLayoutWrapper.useEffect": ()=>{
            if (!user && !loading) {
                fetch("/api/auth/check", {
                    credentials: "include"
                }).then({
                    "CrmLayoutWrapper.useEffect": (response)=>{
                        setHasSessionCookie(response.ok);
                    }
                }["CrmLayoutWrapper.useEffect"]).catch({
                    "CrmLayoutWrapper.useEffect": ()=>{
                        setHasSessionCookie(false);
                    }
                }["CrmLayoutWrapper.useEffect"]);
            } else {
                setHasSessionCookie(user ? true : null);
            }
        }
    }["CrmLayoutWrapper.useEffect"], [
        user,
        loading
    ]);
    // Redirect to login if not authenticated and not on login page
    // Allow page to render if session cookie is valid (for E2E tests)
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "CrmLayoutWrapper.useEffect": ()=>{
            if (isLoginPage) return;
            // Wait for auth state and session cookie check to complete
            if (loading || hasSessionCookie === null && !user) {
                return; // Still checking
            }
            // Redirect if not authenticated (no Firebase user and no valid session cookie)
            if (!user && hasSessionCookie !== true) {
                router.push("/login");
            }
        }
    }["CrmLayoutWrapper.useEffect"], [
        isLoginPage,
        loading,
        user,
        router,
        hasSessionCookie
    ]);
    // Always show sidebar if not on login page (prevents flash)
    if (isLoginPage) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
            children: children
        }, void 0, false);
    }
    const handleLinkClick = (e)=>{
        if (isSaving) {
            e.preventDefault();
            return;
        }
        setIsMobileMenuOpen(false);
    };
    // Helper to get link classes with disabled state styling
    const getLinkClasses = (isActive, isSaving)=>{
        const baseClasses = "flex items-center px-4 py-3 rounded-sm transition-colors duration-200 font-medium";
        if (isSaving) {
            return `${baseClasses} text-theme-medium cursor-not-allowed pointer-events-none`;
        }
        if (isActive) {
            return `${baseClasses} bg-card-light text-foreground`;
        }
        return `${baseClasses} text-foreground hover:bg-card-light`;
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex h-screen overflow-hidden",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                href: "#main-content",
                className: "sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-100 focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-foreground focus:rounded-sm focus:font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
                children: "Skip to main content"
            }, void 0, false, {
                fileName: "[project]/components/CrmLayoutWrapper.tsx",
                lineNumber: 373,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$MobileHeader$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                isMenuOpen: isMobileMenuOpen,
                onMenuToggle: ()=>setIsMobileMenuOpen(!isMobileMenuOpen)
            }, void 0, false, {
                fileName: "[project]/components/CrmLayoutWrapper.tsx",
                lineNumber: 380,
                columnNumber: 7
            }, this),
            isMobileMenuOpen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "fixed inset-0 bg-black/20 z-40 xl:hidden",
                onClick: ()=>setIsMobileMenuOpen(false)
            }, void 0, false, {
                fileName: "[project]/components/CrmLayoutWrapper.tsx",
                lineNumber: 384,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
                className: `w-full xl:w-64 bg-background p-6 border-r border-theme-light shadow-lg flex flex-col h-[calc(100dvh-4rem)] xl:h-screen fixed right-0 xl:left-0 top-16 xl:top-0 z-50 transition-transform duration-500 ease-in-out ${isMobileMenuOpen ? "translate-x-0" : "translate-x-full xl:translate-x-0"}`,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        className: "hidden xl:block text-base font-semibold mb-8 text-foreground",
                        children: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$app$2d$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["appConfig"].crmName
                    }, void 0, false, {
                        fileName: "[project]/components/CrmLayoutWrapper.tsx",
                        lineNumber: 397,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex-1 overflow-y-auto -mx-6 px-6",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                            className: "space-y-2",
                            children: navigationLinks.map((link)=>{
                                const linkIsActive = isActive(link.href);
                                // Handle links with submenu (like Contacts or Touchpoints)
                                if (link.hasSubmenu) {
                                    // Touchpoints - button only (no link)
                                    if (link.isButtonOnly) {
                                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    onClick: ()=>setIsTouchpointsOpen(!isTouchpointsOpen),
                                                    disabled: isSaving,
                                                    className: `${getLinkClasses(pathname?.startsWith("/touchpoints/") || false, isSaving)} ${!isSaving ? "cursor-pointer" : ""} w-full`,
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                            className: "w-5 h-5 mr-3",
                                                            fill: "none",
                                                            stroke: "currentColor",
                                                            viewBox: "0 0 24 24",
                                                            children: link.iconPath
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/CrmLayoutWrapper.tsx",
                                                            lineNumber: 419,
                                                            columnNumber: 23
                                                        }, this),
                                                        link.label,
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                            className: `w-4 h-4 ml-auto transition-transform duration-200 ${isTouchpointsOpen ? "rotate-90" : ""}`,
                                                            fill: "none",
                                                            stroke: "currentColor",
                                                            viewBox: "0 0 24 24",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                                strokeLinecap: "round",
                                                                strokeLinejoin: "round",
                                                                strokeWidth: 2,
                                                                d: "M9 5l7 7-7 7"
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/CrmLayoutWrapper.tsx",
                                                                lineNumber: 436,
                                                                columnNumber: 25
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/CrmLayoutWrapper.tsx",
                                                            lineNumber: 428,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/CrmLayoutWrapper.tsx",
                                                    lineNumber: 411,
                                                    columnNumber: 21
                                                }, this),
                                                isTouchpointsOpen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                                    className: "ml-8 mt-2 space-y-1",
                                                    children: touchpointsSubmenuLinks.map((subLink)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                                href: subLink.href,
                                                                onClick: handleLinkClick,
                                                                prefetch: true,
                                                                className: getLinkClasses(isActive(subLink.href), isSaving),
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                                        className: "w-4 h-4 mr-3",
                                                                        fill: "none",
                                                                        stroke: "currentColor",
                                                                        viewBox: "0 0 24 24",
                                                                        children: subLink.iconPath
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/components/CrmLayoutWrapper.tsx",
                                                                        lineNumber: 454,
                                                                        columnNumber: 31
                                                                    }, this),
                                                                    subLink.label
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/components/CrmLayoutWrapper.tsx",
                                                                lineNumber: 448,
                                                                columnNumber: 29
                                                            }, this)
                                                        }, subLink.href, false, {
                                                            fileName: "[project]/components/CrmLayoutWrapper.tsx",
                                                            lineNumber: 447,
                                                            columnNumber: 27
                                                        }, this))
                                                }, void 0, false, {
                                                    fileName: "[project]/components/CrmLayoutWrapper.tsx",
                                                    lineNumber: 445,
                                                    columnNumber: 23
                                                }, this)
                                            ]
                                        }, link.href, true, {
                                            fileName: "[project]/components/CrmLayoutWrapper.tsx",
                                            lineNumber: 410,
                                            columnNumber: 19
                                        }, this);
                                    }
                                    // Contacts - clickable link with submenu toggle
                                    const isContactsActive = pathname?.startsWith("/contacts") && !pathname?.startsWith("/contacts/new") && !pathname?.startsWith("/contacts/import");
                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                        href: link.href,
                                                        onClick: handleLinkClick,
                                                        prefetch: true,
                                                        className: `${getLinkClasses(isContactsActive, isSaving)} flex-1`,
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                                className: "w-5 h-5 mr-3",
                                                                fill: "none",
                                                                stroke: "currentColor",
                                                                viewBox: "0 0 24 24",
                                                                children: link.iconPath
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/CrmLayoutWrapper.tsx",
                                                                lineNumber: 485,
                                                                columnNumber: 23
                                                            }, this),
                                                            link.label
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/components/CrmLayoutWrapper.tsx",
                                                        lineNumber: 479,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        onClick: (e)=>{
                                                            e.preventDefault();
                                                            setIsContactsOpen(!isContactsOpen);
                                                        },
                                                        disabled: isSaving,
                                                        className: `p-2 -mr-2 rounded-sm transition-colors duration-200 ${isSaving ? "text-theme-medium cursor-not-allowed" : "text-foreground hover:bg-card-light"}`,
                                                        "aria-label": "Toggle Contacts submenu",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                            className: `w-4 h-4 transition-transform duration-200 ${isContactsOpen ? "rotate-90" : ""}`,
                                                            fill: "none",
                                                            stroke: "currentColor",
                                                            viewBox: "0 0 24 24",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                                strokeLinecap: "round",
                                                                strokeLinejoin: "round",
                                                                strokeWidth: 2,
                                                                d: "M9 5l7 7-7 7"
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/CrmLayoutWrapper.tsx",
                                                                lineNumber: 516,
                                                                columnNumber: 25
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/CrmLayoutWrapper.tsx",
                                                            lineNumber: 508,
                                                            columnNumber: 23
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/CrmLayoutWrapper.tsx",
                                                        lineNumber: 495,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/CrmLayoutWrapper.tsx",
                                                lineNumber: 478,
                                                columnNumber: 19
                                            }, this),
                                            isContactsOpen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                                className: "ml-8 mt-2 space-y-1",
                                                children: contactsSubmenuLinks.map((subLink)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                            href: subLink.href,
                                                            onClick: handleLinkClick,
                                                            prefetch: true,
                                                            className: getLinkClasses(isActive(subLink.href), isSaving),
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                                    className: "w-4 h-4 mr-3",
                                                                    fill: "none",
                                                                    stroke: "currentColor",
                                                                    viewBox: "0 0 24 24",
                                                                    children: subLink.iconPath
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/CrmLayoutWrapper.tsx",
                                                                    lineNumber: 535,
                                                                    columnNumber: 29
                                                                }, this),
                                                                subLink.label
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/components/CrmLayoutWrapper.tsx",
                                                            lineNumber: 529,
                                                            columnNumber: 27
                                                        }, this)
                                                    }, subLink.href, false, {
                                                        fileName: "[project]/components/CrmLayoutWrapper.tsx",
                                                        lineNumber: 528,
                                                        columnNumber: 25
                                                    }, this))
                                            }, void 0, false, {
                                                fileName: "[project]/components/CrmLayoutWrapper.tsx",
                                                lineNumber: 526,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, link.href, true, {
                                        fileName: "[project]/components/CrmLayoutWrapper.tsx",
                                        lineNumber: 477,
                                        columnNumber: 17
                                    }, this);
                                }
                                // Regular links without submenu
                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                        href: link.href,
                                        onClick: handleLinkClick,
                                        prefetch: link.href !== "#",
                                        className: getLinkClasses(linkIsActive, isSaving),
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                className: "w-5 h-5 mr-3",
                                                fill: "none",
                                                stroke: "currentColor",
                                                viewBox: "0 0 24 24",
                                                children: link.iconPath
                                            }, void 0, false, {
                                                fileName: "[project]/components/CrmLayoutWrapper.tsx",
                                                lineNumber: 562,
                                                columnNumber: 19
                                            }, this),
                                            link.label
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/CrmLayoutWrapper.tsx",
                                        lineNumber: 556,
                                        columnNumber: 17
                                    }, this)
                                }, link.href, false, {
                                    fileName: "[project]/components/CrmLayoutWrapper.tsx",
                                    lineNumber: 555,
                                    columnNumber: 15
                                }, this);
                            })
                        }, void 0, false, {
                            fileName: "[project]/components/CrmLayoutWrapper.tsx",
                            lineNumber: 401,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/components/CrmLayoutWrapper.tsx",
                        lineNumber: 400,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ThemeToggle$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                        fileName: "[project]/components/CrmLayoutWrapper.tsx",
                        lineNumber: 577,
                        columnNumber: 9
                    }, this),
                    showUserElements && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mt-auto space-y-3",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "px-4 py-3 bg-card-highlight-light rounded-sm",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center gap-3",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "w-10 h-10 bg-theme-light rounded-full flex items-center justify-center shrink-0",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-foreground font-semibold text-sm",
                                                children: user?.displayName?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || "U"
                                            }, void 0, false, {
                                                fileName: "[project]/components/CrmLayoutWrapper.tsx",
                                                lineNumber: 585,
                                                columnNumber: 19
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/components/CrmLayoutWrapper.tsx",
                                            lineNumber: 584,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex-1 min-w-0",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-foreground font-medium text-sm truncate",
                                                    children: user?.displayName || "User"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/CrmLayoutWrapper.tsx",
                                                    lineNumber: 590,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-theme-dark text-xs truncate",
                                                    children: user?.email
                                                }, void 0, false, {
                                                    fileName: "[project]/components/CrmLayoutWrapper.tsx",
                                                    lineNumber: 593,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/CrmLayoutWrapper.tsx",
                                            lineNumber: 589,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/CrmLayoutWrapper.tsx",
                                    lineNumber: 583,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/components/CrmLayoutWrapper.tsx",
                                lineNumber: 582,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                onClick: handleSignOut,
                                disabled: signingOut,
                                loading: signingOut,
                                size: "sm",
                                fullWidth: true,
                                icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                    className: "w-4 h-4",
                                    fill: "none",
                                    stroke: "currentColor",
                                    viewBox: "0 0 24 24",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                        strokeLinecap: "round",
                                        strokeLinejoin: "round",
                                        strokeWidth: 2,
                                        d: "M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                                    }, void 0, false, {
                                        fileName: "[project]/components/CrmLayoutWrapper.tsx",
                                        lineNumber: 613,
                                        columnNumber: 19
                                    }, void 0)
                                }, void 0, false, {
                                    fileName: "[project]/components/CrmLayoutWrapper.tsx",
                                    lineNumber: 607,
                                    columnNumber: 17
                                }, void 0),
                                children: "Sign Out"
                            }, void 0, false, {
                                fileName: "[project]/components/CrmLayoutWrapper.tsx",
                                lineNumber: 600,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/CrmLayoutWrapper.tsx",
                        lineNumber: 580,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/CrmLayoutWrapper.tsx",
                lineNumber: 391,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
                id: "main-content",
                className: "flex-1 xl:ml-64 pt-20 xl:pt-10 px-6 xl:px-10 pb-6 xl:pb-10 bg-background text-foreground overflow-y-auto h-screen",
                children: children
            }, void 0, false, {
                fileName: "[project]/components/CrmLayoutWrapper.tsx",
                lineNumber: 629,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/CrmLayoutWrapper.tsx",
        lineNumber: 371,
        columnNumber: 5
    }, this);
}
_s(CrmLayoutWrapper, "wef5bAhMioWd/rlP0OC+xAwt4T4=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useAuth$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"],
        __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$SavingStateContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSavingState"]
    ];
});
_c = CrmLayoutWrapper;
var _c;
__turbopack_context__.k.register(_c, "CrmLayoutWrapper");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/providers.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Providers",
    ()=>Providers
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$queryClient$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tanstack/query-core/build/modern/queryClient.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tanstack/react-query/build/modern/QueryClientProvider.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2d$devtools$2f$build$2f$modern$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tanstack/react-query-devtools/build/modern/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$SavingStateContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/contexts/SavingStateContext.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ThemeProvider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ThemeProvider.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
function Providers({ children }) {
    _s();
    const [queryClient] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        "Providers.useState": ()=>new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$queryClient$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["QueryClient"]({
                defaultOptions: {
                    queries: {
                        staleTime: 0,
                        gcTime: 5 * 60 * 1000,
                        refetchOnWindowFocus: true,
                        refetchOnReconnect: true,
                        refetchOnMount: true,
                        retry: 1
                    }
                }
            })
    }["Providers.useState"]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["QueryClientProvider"], {
        client: queryClient,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$SavingStateContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SavingStateProvider"], {
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ThemeProvider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ThemeProvider"], {
                children: [
                    children,
                    ("TURBOPACK compile-time value", "development") === "development" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2d$devtools$2f$build$2f$modern$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ReactQueryDevtools"], {
                        initialIsOpen: false
                    }, void 0, false, {
                        fileName: "[project]/app/providers.tsx",
                        lineNumber: 32,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/providers.tsx",
                lineNumber: 29,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/app/providers.tsx",
            lineNumber: 28,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/app/providers.tsx",
        lineNumber: 27,
        columnNumber: 5
    }, this);
}
_s(Providers, "uBi1Ln9iWtDx2kyLnIExNaEsWbI=");
_c = Providers;
var _c;
__turbopack_context__.k.register(_c, "Providers");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# debugId=8aa80f12-3919-d71e-3212-b3aafe505862
//# sourceMappingURL=_82fb71aa._.js.map
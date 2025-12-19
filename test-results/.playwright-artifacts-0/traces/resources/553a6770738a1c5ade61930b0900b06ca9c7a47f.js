;!function(){try { var e="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof global?global:"undefined"!=typeof window?window:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&((e._debugIds|| (e._debugIds={}))[n]="04ecf328-eed9-57e4-6b19-8d0609bf2f73")}catch(e){}}();
(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/node_modules/@sentry/nextjs/build/cjs/common/debug-build.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
/**
 * This serves as a build time flag that will be true by default, but false in non-debug builds or if users replace `__SENTRY_DEBUG__` in their generated code.
 *
 * ATTENTION: This constant must never cross package boundaries (i.e. be exported) to guarantee that it can be used for tree shaking.
 */ const DEBUG_BUILD = typeof __SENTRY_DEBUG__ === 'undefined' || __SENTRY_DEBUG__;
exports.DEBUG_BUILD = DEBUG_BUILD; //# sourceMappingURL=debug-build.js.map
}),
"[project]/node_modules/@sentry/nextjs/build/cjs/common/devErrorSymbolicationEventProcessor.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {

var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const core = __turbopack_context__.r("[project]/node_modules/@sentry/core/build/cjs/index.js [app-client] (ecmascript)");
const stackTraceParser = __turbopack_context__.r("[project]/node_modules/stacktrace-parser/dist/stack-trace-parser.esm.js [app-client] (ecmascript)");
const debugBuild = __turbopack_context__.r("[project]/node_modules/@sentry/nextjs/build/cjs/common/debug-build.js [app-client] (ecmascript)");
const globalWithInjectedValues = core.GLOBAL_OBJ;
/**
 * Constructs the base URL for the Next.js dev server, including the port and base path.
 * Returns only the base path when running in the browser (client-side) for relative URLs.
 */ function getDevServerBaseUrl() {
    let basePath = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env._sentryBasePath ?? globalWithInjectedValues._sentryBasePath ?? '';
    // Prefix the basepath with a slash if it doesn't have one
    if (basePath !== '' && !basePath.match(/^\//)) {
        basePath = `/${basePath}`;
    }
    // eslint-disable-next-line no-restricted-globals
    if (typeof window !== 'undefined') {
        return basePath;
    }
    const devServerPort = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.PORT || '3000';
    return `http://localhost:${devServerPort}${basePath}`;
}
/**
 * Fetches a URL with a 3-second timeout using AbortController.
 */ async function fetchWithTimeout(url, options = {}) {
    const controller = new AbortController();
    const timer = setTimeout(()=>controller.abort(), 3000);
    return core.suppressTracing(()=>fetch(url, {
            ...options,
            signal: controller.signal
        }).finally(()=>{
            clearTimeout(timer);
        }));
}
/**
 * Event processor that will symbolicate errors by using the webpack/nextjs dev server that is used to show stack traces
 * in the dev overlay.
 */ async function devErrorSymbolicationEventProcessor(event, hint) {
    // Filter out spans for requests resolving source maps for stack frames in dev mode
    if (event.type === 'transaction') {
        event.spans = event.spans?.filter((span)=>{
            const httpUrlAttribute = span.data?.['http.url'];
            if (typeof httpUrlAttribute === 'string') {
                return !httpUrlAttribute.includes('__nextjs_original-stack-frame'); // could also be __nextjs_original-stack-frames (plural)
            }
            return true;
        });
    }
    // Due to changes across Next.js versions, there are a million things that can go wrong here so we just try-catch the
    // entire event processor. Symbolicated stack traces are just a nice to have.
    try {
        if (hint.originalException && hint.originalException instanceof Error && hint.originalException.stack) {
            const frames = stackTraceParser.parse(hint.originalException.stack);
            const nextJsVersion = globalWithInjectedValues._sentryNextJsVersion;
            // If we for whatever reason don't have a Next.js version,
            // we don't want to symbolicate as this previously lead to infinite loops
            if (!nextJsVersion) {
                return event;
            }
            const parsedNextjsVersion = core.parseSemver(nextJsVersion);
            let resolvedFrames;
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            if (parsedNextjsVersion.major > 15 || parsedNextjsVersion.major === 15 && parsedNextjsVersion.minor >= 2) {
                const r = await resolveStackFrames(frames);
                if (r === null) {
                    return event;
                }
                resolvedFrames = r;
            } else {
                resolvedFrames = await Promise.all(frames.map((frame)=>resolveStackFrame(frame, hint.originalException)));
            }
            if (event.exception?.values?.[0]?.stacktrace?.frames) {
                event.exception.values[0].stacktrace.frames = event.exception.values[0].stacktrace.frames.map((frame, i, frames)=>{
                    const resolvedFrame = resolvedFrames[frames.length - 1 - i];
                    if (!resolvedFrame?.originalStackFrame || !resolvedFrame.originalCodeFrame) {
                        return {
                            ...frame,
                            platform: frame.filename?.startsWith('node:internal') ? 'nodejs' : undefined,
                            in_app: false
                        };
                    }
                    const { contextLine, preContextLines, postContextLines } = parseOriginalCodeFrame(resolvedFrame.originalCodeFrame);
                    return {
                        ...frame,
                        pre_context: preContextLines,
                        context_line: contextLine,
                        post_context: postContextLines,
                        function: resolvedFrame.originalStackFrame.methodName,
                        filename: resolvedFrame.originalStackFrame.file ? stripWebpackInternalPrefix(resolvedFrame.originalStackFrame.file) : undefined,
                        lineno: resolvedFrame.originalStackFrame.lineNumber || resolvedFrame.originalStackFrame.line1 || undefined,
                        colno: resolvedFrame.originalStackFrame.column || resolvedFrame.originalStackFrame.column1 || undefined
                    };
                });
            }
        }
    } catch  {
        return event;
    }
    return event;
}
async function resolveStackFrame(frame, error) {
    try {
        if (!(frame.file?.startsWith('webpack-internal:') || frame.file?.startsWith('file:'))) {
            return null;
        }
        const params = new URLSearchParams();
        params.append('isServer', String(false)); // doesn't matter since it is overwritten by isAppDirectory
        params.append('isEdgeServer', String(false)); // doesn't matter since it is overwritten by isAppDirectory
        params.append('isAppDirectory', String(true)); // will force server to do more thorough checking
        params.append('errorMessage', error.toString());
        Object.keys(frame).forEach((key)=>{
            params.append(key, (frame[key] ?? '').toString());
        });
        const baseUrl = getDevServerBaseUrl();
        const res = await fetchWithTimeout(`${baseUrl}/__nextjs_original-stack-frame?${params.toString()}`);
        if (!res.ok || res.status === 204) {
            return null;
        }
        const body = await res.json();
        return {
            originalCodeFrame: body.originalCodeFrame,
            originalStackFrame: body.originalStackFrame
        };
    } catch (e) {
        debugBuild.DEBUG_BUILD && core.debug.error('Failed to symbolicate event with Next.js dev server', e);
        return null;
    }
}
async function resolveStackFrames(frames) {
    try {
        const postBody = {
            frames: frames.filter((frame)=>{
                return !!frame.file;
            }).map((frame)=>{
                // https://github.com/vercel/next.js/blob/df0573a478baa8b55478a7963c473dddd59a5e40/packages/next/src/client/components/react-dev-overlay/server/middleware-turbopack.ts#L129
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                frame.file = frame.file.replace(/^rsc:\/\/React\/[^/]+\//, '').replace(/\?\d+$/, '');
                return {
                    file: frame.file,
                    methodName: frame.methodName ?? '<unknown>',
                    arguments: [],
                    lineNumber: frame.lineNumber ?? 0,
                    column: frame.column ?? 0,
                    line1: frame.lineNumber ?? 0,
                    column1: frame.column ?? 0
                };
            }),
            isServer: false,
            isEdgeServer: false,
            isAppDirectory: true
        };
        const baseUrl = getDevServerBaseUrl();
        const res = await fetchWithTimeout(`${baseUrl}/__nextjs_original-stack-frames`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(postBody)
        });
        if (!res.ok || res.status === 204) {
            return null;
        }
        const body = await res.json();
        return body.map((frame)=>{
            return {
                originalCodeFrame: frame.value.originalCodeFrame,
                originalStackFrame: frame.value.originalStackFrame
            };
        });
    } catch (e) {
        debugBuild.DEBUG_BUILD && core.debug.error('Failed to symbolicate event with Next.js dev server', e);
        return null;
    }
}
function parseOriginalCodeFrame(codeFrame) {
    const preProcessedLines = codeFrame// Remove ASCII control characters that are used for syntax highlighting
    .replace(// eslint-disable-next-line no-control-regex
    /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g, '').split('\n')// Remove line that is supposed to indicate where the error happened
    .filter((line)=>!line.match(/^\s*\|/))// Find the error line
    .map((line)=>({
            line,
            isErrorLine: !!line.match(/^>/)
        }))// Remove the leading part that is just for prettier output
    .map((lineObj)=>({
            ...lineObj,
            line: lineObj.line.replace(/^.*\|/, '')
        }));
    const preContextLines = [];
    let contextLine = undefined;
    const postContextLines = [];
    let reachedContextLine = false;
    for (const preProcessedLine of preProcessedLines){
        if (preProcessedLine.isErrorLine) {
            contextLine = preProcessedLine.line;
            reachedContextLine = true;
        } else if (reachedContextLine) {
            postContextLines.push(preProcessedLine.line);
        } else {
            preContextLines.push(preProcessedLine.line);
        }
    }
    return {
        contextLine,
        preContextLines,
        postContextLines
    };
}
/**
 * Strips webpack-internal prefixes from filenames to clean up stack traces.
 *
 * Examples:
 * - "webpack-internal:///./components/file.tsx" -> "./components/file.tsx"
 * - "webpack-internal:///(app-pages-browser)/./components/file.tsx" -> "./components/file.tsx"
 */ function stripWebpackInternalPrefix(filename) {
    if (!filename) {
        return filename;
    }
    const webpackInternalRegex = /^webpack-internal:(?:\/+)?(?:\([^)]*\)\/)?(.+)$/;
    const match = filename.match(webpackInternalRegex);
    return match ? match[1] : filename;
}
exports.devErrorSymbolicationEventProcessor = devErrorSymbolicationEventProcessor; //# sourceMappingURL=devErrorSymbolicationEventProcessor.js.map
}),
"[project]/node_modules/@sentry/nextjs/build/cjs/common/getVercelEnv.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {

var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
/**
 * Returns an environment setting value determined by Vercel's `VERCEL_ENV` environment variable.
 *
 * @param isClient Flag to indicate whether to use the `NEXT_PUBLIC_` prefixed version of the environment variable.
 */ function getVercelEnv(isClient) {
    const vercelEnvVar = isClient ? __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.NEXT_PUBLIC_VERCEL_ENV : __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.VERCEL_ENV;
    return vercelEnvVar ? `vercel-${vercelEnvVar}` : undefined;
}
exports.getVercelEnv = getVercelEnv; //# sourceMappingURL=getVercelEnv.js.map
}),
"[project]/node_modules/@sentry/nextjs/build/cjs/common/nextNavigationErrorUtils.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const core = __turbopack_context__.r("[project]/node_modules/@sentry/core/build/cjs/index.js [app-client] (ecmascript)");
/**
 * Determines whether input is a Next.js not-found error.
 * https://beta.nextjs.org/docs/api-reference/notfound#notfound
 */ function isNotFoundNavigationError(subject) {
    return core.isError(subject) && [
        'NEXT_NOT_FOUND',
        'NEXT_HTTP_ERROR_FALLBACK;404'
    ].includes(subject.digest);
}
/**
 * Determines whether input is a Next.js redirect error.
 * https://beta.nextjs.org/docs/api-reference/redirect#redirect
 */ function isRedirectNavigationError(subject) {
    return core.isError(subject) && typeof subject.digest === 'string' && subject.digest.startsWith('NEXT_REDIRECT;') // a redirect digest looks like "NEXT_REDIRECT;[redirect path]"
    ;
}
exports.isNotFoundNavigationError = isNotFoundNavigationError;
exports.isRedirectNavigationError = isRedirectNavigationError; //# sourceMappingURL=nextNavigationErrorUtils.js.map
}),
"[project]/node_modules/@sentry/nextjs/build/cjs/client/routing/parameterization.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const core = __turbopack_context__.r("[project]/node_modules/@sentry/core/build/cjs/index.js [app-client] (ecmascript)");
const debugBuild = __turbopack_context__.r("[project]/node_modules/@sentry/nextjs/build/cjs/common/debug-build.js [app-client] (ecmascript)");
const globalWithInjectedManifest = core.GLOBAL_OBJ;
// Some performance caches
let cachedManifest = null;
let cachedManifestString = undefined;
const compiledRegexCache = new Map();
const routeResultCache = new Map();
/**
 * Calculate the specificity score for a route path.
 * Lower scores indicate more specific routes.
 */ function getRouteSpecificity(routePath) {
    const segments = routePath.split('/').filter(Boolean);
    let score = 0;
    for (const segment of segments){
        if (segment.startsWith(':')) {
            const paramName = segment.substring(1);
            if (paramName.endsWith('*?')) {
                // Optional catch-all: [[...param]]
                score += 1000;
            } else if (paramName.endsWith('*')) {
                // Required catch-all: [...param]
                score += 100;
            } else {
                // Regular dynamic segment: [param]
                score += 10;
            }
        }
    // Static segments add 0 to score as they are most specific
    }
    if (segments.length > 0) {
        // Add a small penalty based on inverse of segment count
        // This ensures that routes with more segments are preferred
        // e.g., '/:locale/foo' is more specific than '/:locale'
        // We use a small value (1 / segments.length) so it doesn't override the main scoring
        // but breaks ties between routes with the same number of dynamic segments
        const segmentCountPenalty = 1 / segments.length;
        score += segmentCountPenalty;
    }
    return score;
}
/**
 * Get compiled regex from cache or create and cache it.
 */ function getCompiledRegex(regexString) {
    if (compiledRegexCache.has(regexString)) {
        return compiledRegexCache.get(regexString) ?? null;
    }
    try {
        // eslint-disable-next-line @sentry-internal/sdk/no-regexp-constructor -- regex patterns are from build-time route manifest, not user input
        const regex = new RegExp(regexString);
        compiledRegexCache.set(regexString, regex);
        return regex;
    } catch (error) {
        debugBuild.DEBUG_BUILD && core.debug.warn('Could not compile regex', {
            regexString,
            error
        });
        // Cache the failure to avoid repeated attempts by storing undefined
        return null;
    }
}
/**
 * Get and cache the route manifest from the global object.
 * @returns The parsed route manifest or null if not available/invalid.
 */ function getManifest() {
    if (!globalWithInjectedManifest?._sentryRouteManifest || typeof globalWithInjectedManifest._sentryRouteManifest !== 'string') {
        return null;
    }
    const currentManifestString = globalWithInjectedManifest._sentryRouteManifest;
    // Return cached manifest if the string hasn't changed
    if (cachedManifest && cachedManifestString === currentManifestString) {
        return cachedManifest;
    }
    // Clear caches when manifest changes
    compiledRegexCache.clear();
    routeResultCache.clear();
    let manifest = {
        staticRoutes: [],
        dynamicRoutes: [],
        isrRoutes: []
    };
    // Shallow check if the manifest is actually what we expect it to be
    try {
        manifest = JSON.parse(currentManifestString);
        if (!Array.isArray(manifest.staticRoutes) || !Array.isArray(manifest.dynamicRoutes)) {
            return null;
        }
        // Cache the successfully parsed manifest
        cachedManifest = manifest;
        cachedManifestString = currentManifestString;
        return manifest;
    } catch  {
        // Something went wrong while parsing the manifest, so we'll fallback to no parameterization
        debugBuild.DEBUG_BUILD && core.debug.warn('Could not extract route manifest');
        return null;
    }
}
/**
 * Find matching routes from static and dynamic route collections.
 * @param route - The route to match against.
 * @param staticRoutes - Array of static route objects.
 * @param dynamicRoutes - Array of dynamic route objects.
 * @returns Array of matching route paths.
 */ function findMatchingRoutes(route, staticRoutes, dynamicRoutes) {
    const matches = [];
    // Static path: no parameterization needed, return empty array
    if (staticRoutes.some((r)=>r.path === route)) {
        return matches;
    }
    // Dynamic path: find the route pattern that matches the concrete route
    for (const dynamicRoute of dynamicRoutes){
        if (dynamicRoute.regex) {
            const regex = getCompiledRegex(dynamicRoute.regex);
            if (regex?.test(route)) {
                matches.push(dynamicRoute.path);
            }
        }
    }
    // Try matching with optional prefix segments (for i18n routing patterns)
    // This handles cases like '/foo' matching '/:locale/foo' when using next-intl with localePrefix: "as-needed"
    // We do this regardless of whether we found direct matches, as we want the most specific match
    if (!route.startsWith('/:')) {
        for (const dynamicRoute of dynamicRoutes){
            if (dynamicRoute.hasOptionalPrefix && dynamicRoute.regex) {
                // Prepend a placeholder segment to simulate the optional prefix
                // e.g., '/foo' becomes '/PLACEHOLDER/foo' to match '/:locale/foo'
                // Special case: '/' becomes '/PLACEHOLDER' (not '/PLACEHOLDER/') to match '/:locale' pattern
                const routeWithPrefix = route === '/' ? '/SENTRY_OPTIONAL_PREFIX' : `/SENTRY_OPTIONAL_PREFIX${route}`;
                const regex = getCompiledRegex(dynamicRoute.regex);
                if (regex?.test(routeWithPrefix)) {
                    matches.push(dynamicRoute.path);
                }
            }
        }
    }
    return matches;
}
/**
 * Parameterize a route using the route manifest.
 *
 * @param route - The route to parameterize.
 * @returns The parameterized route or undefined if no parameterization is needed.
 */ const maybeParameterizeRoute = (route)=>{
    const manifest = getManifest();
    if (!manifest) {
        return undefined;
    }
    // Check route result cache after manifest validation
    if (routeResultCache.has(route)) {
        return routeResultCache.get(route);
    }
    const { staticRoutes, dynamicRoutes } = manifest;
    if (!Array.isArray(staticRoutes) || !Array.isArray(dynamicRoutes)) {
        return undefined;
    }
    const matches = findMatchingRoutes(route, staticRoutes, dynamicRoutes);
    // We can always do the `sort()` call, it will short-circuit when it has one array item
    const result = matches.sort((a, b)=>getRouteSpecificity(a) - getRouteSpecificity(b))[0];
    routeResultCache.set(route, result);
    return result;
};
exports.getManifest = getManifest;
exports.maybeParameterizeRoute = maybeParameterizeRoute; //# sourceMappingURL=parameterization.js.map
}),
"[project]/node_modules/@sentry/nextjs/build/cjs/client/routing/appRouterRoutingInstrumentation.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {

var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const core = __turbopack_context__.r("[project]/node_modules/@sentry/core/build/cjs/index.js [app-client] (ecmascript)");
const react = __turbopack_context__.r("[project]/node_modules/@sentry/react/build/cjs/index.js [app-client] (ecmascript)");
const parameterization = __turbopack_context__.r("[project]/node_modules/@sentry/nextjs/build/cjs/client/routing/parameterization.js [app-client] (ecmascript)");
const INCOMPLETE_APP_ROUTER_INSTRUMENTATION_TRANSACTION_NAME = 'incomplete-app-router-transaction';
/**
 * This mutable keeps track of what router navigation instrumentation mechanism we are using.
 *
 * The default one is 'router-patch' which is a way of instrumenting that worked up until Next.js 15.3.0 was released.
 * For this method we took the global router instance and simply monkey patched all the router methods like push(), replace(), and so on.
 * This worked because Next.js itself called the router methods for things like the <Link /> component.
 * Vercel decided that it is not good to call these public API methods from within the framework so they switched to an internal system that completely bypasses our monkey patching. This happened in 15.3.0.
 *
 * We raised with Vercel that this breaks our SDK so together with them we came up with an API for `instrumentation-client.ts` called `onRouterTransitionStart` that is called whenever a navigation is kicked off.
 *
 * Now we have the problem of version compatibility.
 * For older Next.js versions we cannot use the new hook so we need to always patch the router.
 * For newer Next.js versions we cannot know whether the user actually registered our handler for the `onRouterTransitionStart` hook, so we need to wait until it was called at least once before switching the instrumentation mechanism.
 * The problem is, that the user may still have registered a hook and then call a patched router method.
 * First, the monkey patched router method will be called, starting a navigation span, then the hook will also called.
 * We need to handle this case and not create two separate navigation spans but instead update the current navigation span and then switch to the new instrumentation mode.
 * This is all denoted by this `navigationRoutingMode` variable.
 */ let navigationRoutingMode = 'router-patch';
const currentRouterPatchingNavigationSpanRef = {
    current: undefined
};
/** Instruments the Next.js app router for pageloads. */ function appRouterInstrumentPageLoad(client) {
    const parameterizedPathname = parameterization.maybeParameterizeRoute(react.WINDOW.location.pathname);
    const origin = core.browserPerformanceTimeOrigin();
    react.startBrowserTracingPageLoadSpan(client, {
        name: parameterizedPathname ?? react.WINDOW.location.pathname,
        // pageload should always start at timeOrigin (and needs to be in s, not ms)
        startTime: origin ? origin / 1000 : undefined,
        attributes: {
            [core.SEMANTIC_ATTRIBUTE_SENTRY_OP]: 'pageload',
            [core.SEMANTIC_ATTRIBUTE_SENTRY_ORIGIN]: 'auto.pageload.nextjs.app_router_instrumentation',
            [core.SEMANTIC_ATTRIBUTE_SENTRY_SOURCE]: parameterizedPathname ? 'route' : 'url'
        }
    });
}
// Yes, yes, I know we shouldn't depend on these internals. But that's where we are at. We write the ugly code, so you don't have to.
const GLOBAL_OBJ_WITH_NEXT_ROUTER = core.GLOBAL_OBJ;
const globalWithInjectedBasePath = core.GLOBAL_OBJ;
/*
 * The routing instrumentation needs to handle a few cases:
 * - Router operations:
 *  - router.push() (either explicitly called or implicitly through <Link /> tags)
 *  - router.replace() (either explicitly called or implicitly through <Link replace /> tags)
 *  - router.back()
 *  - router.forward()
 * - Browser operations:
 *  - native Browser-back / popstate event (implicitly called by router.back())
 *  - native Browser-forward / popstate event (implicitly called by router.forward())
 */ /** Instruments the Next.js app router for navigation. */ function appRouterInstrumentNavigation(client) {
    routerTransitionHandler = (href, navigationType)=>{
        const basePath = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env._sentryBasePath ?? globalWithInjectedBasePath._sentryBasePath;
        const normalizedHref = basePath && !href.startsWith(basePath) ? `${basePath}${href}` : href;
        const unparameterizedPathname = new URL(normalizedHref, react.WINDOW.location.href).pathname;
        const parameterizedPathname = parameterization.maybeParameterizeRoute(unparameterizedPathname);
        const pathname = parameterizedPathname ?? unparameterizedPathname;
        if (navigationRoutingMode === 'router-patch') {
            navigationRoutingMode = 'transition-start-hook';
        }
        const currentNavigationSpan = currentRouterPatchingNavigationSpanRef.current;
        if (currentNavigationSpan) {
            currentNavigationSpan.updateName(pathname);
            currentNavigationSpan.setAttributes({
                'navigation.type': `router.${navigationType}`,
                [core.SEMANTIC_ATTRIBUTE_SENTRY_SOURCE]: parameterizedPathname ? 'route' : 'url'
            });
            currentRouterPatchingNavigationSpanRef.current = undefined;
        } else {
            react.startBrowserTracingNavigationSpan(client, {
                name: pathname,
                attributes: {
                    [core.SEMANTIC_ATTRIBUTE_SENTRY_OP]: 'navigation',
                    [core.SEMANTIC_ATTRIBUTE_SENTRY_ORIGIN]: 'auto.navigation.nextjs.app_router_instrumentation',
                    [core.SEMANTIC_ATTRIBUTE_SENTRY_SOURCE]: parameterizedPathname ? 'route' : 'url',
                    'navigation.type': `router.${navigationType}`
                }
            });
        }
    };
    react.WINDOW.addEventListener('popstate', ()=>{
        const parameterizedPathname = parameterization.maybeParameterizeRoute(react.WINDOW.location.pathname);
        if (currentRouterPatchingNavigationSpanRef.current?.isRecording()) {
            currentRouterPatchingNavigationSpanRef.current.updateName(parameterizedPathname ?? react.WINDOW.location.pathname);
            currentRouterPatchingNavigationSpanRef.current.setAttribute(core.SEMANTIC_ATTRIBUTE_SENTRY_SOURCE, parameterizedPathname ? 'route' : 'url');
        } else {
            currentRouterPatchingNavigationSpanRef.current = react.startBrowserTracingNavigationSpan(client, {
                name: parameterizedPathname ?? react.WINDOW.location.pathname,
                attributes: {
                    [core.SEMANTIC_ATTRIBUTE_SENTRY_ORIGIN]: 'auto.navigation.nextjs.app_router_instrumentation',
                    [core.SEMANTIC_ATTRIBUTE_SENTRY_SOURCE]: parameterizedPathname ? 'route' : 'url',
                    'navigation.type': 'browser.popstate'
                }
            });
        }
    });
    let routerPatched = false;
    let triesToFindRouter = 0;
    const MAX_TRIES_TO_FIND_ROUTER = 500;
    const ROUTER_AVAILABILITY_CHECK_INTERVAL_MS = 20;
    const checkForRouterAvailabilityInterval = setInterval(()=>{
        triesToFindRouter++;
        const router = GLOBAL_OBJ_WITH_NEXT_ROUTER?.next?.router ?? GLOBAL_OBJ_WITH_NEXT_ROUTER?.nd?.router;
        if (routerPatched || triesToFindRouter > MAX_TRIES_TO_FIND_ROUTER) {
            clearInterval(checkForRouterAvailabilityInterval);
        } else if (router) {
            clearInterval(checkForRouterAvailabilityInterval);
            routerPatched = true;
            patchRouter(client, router, currentRouterPatchingNavigationSpanRef);
            // If the router at any point gets overridden - patch again
            [
                'nd',
                'next'
            ].forEach((globalValueName)=>{
                const globalValue = GLOBAL_OBJ_WITH_NEXT_ROUTER[globalValueName];
                if (globalValue) {
                    GLOBAL_OBJ_WITH_NEXT_ROUTER[globalValueName] = new Proxy(globalValue, {
                        set (target, p, newValue) {
                            if (p === 'router' && typeof newValue === 'object' && newValue !== null) {
                                patchRouter(client, newValue, currentRouterPatchingNavigationSpanRef);
                            }
                            // @ts-expect-error we cannot possibly type this
                            target[p] = newValue;
                            return true;
                        }
                    });
                }
            });
        }
    }, ROUTER_AVAILABILITY_CHECK_INTERVAL_MS);
}
function transactionNameifyRouterArgument(target) {
    try {
        // We provide an arbitrary base because we only care about the pathname and it makes URL parsing more resilient.
        return new URL(target, 'http://example.com/').pathname;
    } catch  {
        return '/';
    }
}
const patchedRouters = new WeakSet();
function patchRouter(client, router, currentNavigationSpanRef) {
    if (patchedRouters.has(router)) {
        return;
    }
    patchedRouters.add(router);
    [
        'back',
        'forward',
        'push',
        'replace'
    ].forEach((routerFunctionName)=>{
        if (router?.[routerFunctionName]) {
            // @ts-expect-error Weird type error related to not knowing how to associate return values with the individual functions - we can just ignore
            router[routerFunctionName] = new Proxy(router[routerFunctionName], {
                apply (target, thisArg, argArray) {
                    if (navigationRoutingMode !== 'router-patch') {
                        return target.apply(thisArg, argArray);
                    }
                    let transactionName = INCOMPLETE_APP_ROUTER_INSTRUMENTATION_TRANSACTION_NAME;
                    const transactionAttributes = {
                        [core.SEMANTIC_ATTRIBUTE_SENTRY_OP]: 'navigation',
                        [core.SEMANTIC_ATTRIBUTE_SENTRY_ORIGIN]: 'auto.navigation.nextjs.app_router_instrumentation',
                        [core.SEMANTIC_ATTRIBUTE_SENTRY_SOURCE]: 'url'
                    };
                    const href = argArray[0];
                    const basePath = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env._sentryBasePath ?? globalWithInjectedBasePath._sentryBasePath;
                    const normalizedHref = basePath && typeof href === 'string' && !href.startsWith(basePath) ? `${basePath}${href}` : href;
                    if (routerFunctionName === 'push') {
                        transactionName = transactionNameifyRouterArgument(normalizedHref);
                        transactionAttributes['navigation.type'] = 'router.push';
                    } else if (routerFunctionName === 'replace') {
                        transactionName = transactionNameifyRouterArgument(normalizedHref);
                        transactionAttributes['navigation.type'] = 'router.replace';
                    } else if (routerFunctionName === 'back') {
                        transactionAttributes['navigation.type'] = 'router.back';
                    } else if (routerFunctionName === 'forward') {
                        transactionAttributes['navigation.type'] = 'router.forward';
                    }
                    const parameterizedPathname = parameterization.maybeParameterizeRoute(transactionName);
                    currentNavigationSpanRef.current = react.startBrowserTracingNavigationSpan(client, {
                        name: parameterizedPathname ?? transactionName,
                        attributes: {
                            ...transactionAttributes,
                            [core.SEMANTIC_ATTRIBUTE_SENTRY_SOURCE]: parameterizedPathname ? 'route' : 'url'
                        }
                    });
                    return target.apply(thisArg, argArray);
                }
            });
        }
    });
}
let routerTransitionHandler = undefined;
/**
 * A handler for Next.js' `onRouterTransitionStart` hook in `instrumentation-client.ts` to record navigation spans in Sentry.
 */ function captureRouterTransitionStart(href, navigationType) {
    if (routerTransitionHandler) {
        routerTransitionHandler(href, navigationType);
    }
}
exports.INCOMPLETE_APP_ROUTER_INSTRUMENTATION_TRANSACTION_NAME = INCOMPLETE_APP_ROUTER_INSTRUMENTATION_TRANSACTION_NAME;
exports.appRouterInstrumentNavigation = appRouterInstrumentNavigation;
exports.appRouterInstrumentPageLoad = appRouterInstrumentPageLoad;
exports.captureRouterTransitionStart = captureRouterTransitionStart; //# sourceMappingURL=appRouterRoutingInstrumentation.js.map
}),
"[project]/node_modules/@sentry/nextjs/build/cjs/client/routing/pagesRouterRoutingInstrumentation.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const core = __turbopack_context__.r("[project]/node_modules/@sentry/core/build/cjs/index.js [app-client] (ecmascript)");
const react = __turbopack_context__.r("[project]/node_modules/@sentry/react/build/cjs/index.js [app-client] (ecmascript)");
const RouterImport = __turbopack_context__.r("[project]/node_modules/next/router.js [app-client] (ecmascript)");
const debugBuild = __turbopack_context__.r("[project]/node_modules/@sentry/nextjs/build/cjs/common/debug-build.js [app-client] (ecmascript)");
// next/router v10 is CJS
//
// For ESM/CJS interoperability 'reasons', depending on how this file is loaded, Router might be on the default export
const Router = RouterImport.default.events ? RouterImport.default : RouterImport.default.default;
const globalObject = react.WINDOW;
/**
 * Describes data located in the __NEXT_DATA__ script tag. This tag is present on every page of a Next.js app.
 */ /**
 * Every Next.js page (static and dynamic ones) comes with a script tag with the id "__NEXT_DATA__". This script tag
 * contains a JSON object with data that was either generated at build time for static pages (`getStaticProps`), or at
 * runtime with data fetchers like `getServerSideProps.`.
 *
 * We can use this information to:
 * - Always get the parameterized route we're in when loading a page.
 * - Send trace information (trace-id, baggage) from the server to the client.
 *
 * This function extracts this information.
 */ function extractNextDataTagInformation() {
    let nextData;
    // Let's be on the safe side and actually check first if there is really a __NEXT_DATA__ script tag on the page.
    // Theoretically this should always be the case though.
    const nextDataTag = globalObject.document.getElementById('__NEXT_DATA__');
    if (nextDataTag?.innerHTML) {
        try {
            nextData = JSON.parse(nextDataTag.innerHTML);
        } catch  {
            debugBuild.DEBUG_BUILD && core.debug.warn('Could not extract __NEXT_DATA__');
        }
    }
    if (!nextData) {
        return {};
    }
    const nextDataTagInfo = {};
    const { page, query, props } = nextData;
    // `nextData.page` always contains the parameterized route - except for when an error occurs in a data fetching
    // function, then it is "/_error", but that isn't a problem since users know which route threw by looking at the
    // parent transaction
    // TODO: Actually this is a problem (even though it is not that big), because the DSC and the transaction payload will contain
    // a different transaction name. Maybe we can fix this. Idea: Also send transaction name via pageProps when available.
    nextDataTagInfo.route = page;
    nextDataTagInfo.params = query;
    if (props?.pageProps) {
        nextDataTagInfo.sentryTrace = props.pageProps._sentryTraceData;
        nextDataTagInfo.baggage = props.pageProps._sentryBaggage;
    }
    return nextDataTagInfo;
}
/**
 * Instruments the Next.js pages router for pageloads.
 * Only supported for client side routing. Works for Next >= 10.
 *
 * Leverages the SingletonRouter from the `next/router` to
 * generate pageload/navigation transactions and parameterize
 * transaction names.
 */ function pagesRouterInstrumentPageLoad(client) {
    const { route, params, sentryTrace, baggage } = extractNextDataTagInformation();
    const parsedBaggage = core.parseBaggageHeader(baggage);
    let name = route || globalObject.location.pathname;
    // /_error is the fallback page for all errors. If there is a transaction name for /_error, use that instead
    if (parsedBaggage?.['sentry-transaction'] && name === '/_error') {
        name = parsedBaggage['sentry-transaction'];
        // Strip any HTTP method from the span name
        name = name.replace(/^(GET|POST|PUT|DELETE|PATCH|HEAD|OPTIONS|TRACE|CONNECT)\s+/i, '');
    }
    const origin = core.browserPerformanceTimeOrigin();
    react.startBrowserTracingPageLoadSpan(client, {
        name,
        // pageload should always start at timeOrigin (and needs to be in s, not ms)
        startTime: origin ? origin / 1000 : undefined,
        attributes: {
            [core.SEMANTIC_ATTRIBUTE_SENTRY_OP]: 'pageload',
            [core.SEMANTIC_ATTRIBUTE_SENTRY_ORIGIN]: 'auto.pageload.nextjs.pages_router_instrumentation',
            [core.SEMANTIC_ATTRIBUTE_SENTRY_SOURCE]: route ? 'route' : 'url',
            ...params && client.getOptions().sendDefaultPii && {
                ...params
            }
        }
    }, {
        sentryTrace,
        baggage
    });
}
/**
 * Instruments the Next.js pages router for navigation.
 * Only supported for client side routing. Works for Next >= 10.
 *
 * Leverages the SingletonRouter from the `next/router` to
 * generate pageload/navigation transactions and parameterize
 * transaction names.
 */ function pagesRouterInstrumentNavigation(client) {
    Router.events.on('routeChangeStart', (navigationTarget)=>{
        const strippedNavigationTarget = core.stripUrlQueryAndFragment(navigationTarget);
        const matchedRoute = getNextRouteFromPathname(strippedNavigationTarget);
        let newLocation;
        let spanSource;
        if (matchedRoute) {
            newLocation = matchedRoute;
            spanSource = 'route';
        } else {
            newLocation = strippedNavigationTarget;
            spanSource = 'url';
        }
        react.startBrowserTracingNavigationSpan(client, {
            name: newLocation,
            attributes: {
                [core.SEMANTIC_ATTRIBUTE_SENTRY_OP]: 'navigation',
                [core.SEMANTIC_ATTRIBUTE_SENTRY_ORIGIN]: 'auto.navigation.nextjs.pages_router_instrumentation',
                [core.SEMANTIC_ATTRIBUTE_SENTRY_SOURCE]: spanSource
            }
        });
    });
}
function getNextRouteFromPathname(pathname) {
    const pageRoutes = globalObject.__BUILD_MANIFEST?.sortedPages;
    // Page route should in 99.999% of the cases be defined by now but just to be sure we make a check here
    if (!pageRoutes) {
        return;
    }
    return pageRoutes.find((route)=>{
        const routeRegExp = convertNextRouteToRegExp(route);
        return pathname.match(routeRegExp);
    });
}
/**
 * Converts a Next.js style route to a regular expression that matches on pathnames (no query params or URL fragments).
 *
 * In general this involves replacing any instances of square brackets in a route with a wildcard:
 * e.g. "/users/[id]/info" becomes /\/users\/([^/]+?)\/info/
 *
 * Some additional edgecases need to be considered:
 * - All routes have an optional slash at the end, meaning users can navigate to "/users/[id]/info" or
 *   "/users/[id]/info/" - both will be resolved to "/users/[id]/info".
 * - Non-optional "catchall"s at the end of a route must be considered when matching (e.g. "/users/[...params]").
 * - Optional "catchall"s at the end of a route must be considered when matching (e.g. "/users/[[...params]]").
 *
 * @param route A Next.js style route as it is found in `global.__BUILD_MANIFEST.sortedPages`
 */ function convertNextRouteToRegExp(route) {
    // We can assume a route is at least "/".
    const routeParts = route.split('/');
    let optionalCatchallWildcardRegex = '';
    if (routeParts[routeParts.length - 1]?.match(/^\[\[\.\.\..+\]\]$/)) {
        // If last route part has pattern "[[...xyz]]" we pop the latest route part to get rid of the required trailing
        // slash that would come before it if we didn't pop it.
        routeParts.pop();
        optionalCatchallWildcardRegex = '(?:/(.+?))?';
    }
    const rejoinedRouteParts = routeParts.map((routePart)=>routePart.replace(/^\[\.\.\..+\]$/, '(.+?)') // Replace catch all wildcard with regex wildcard
        .replace(/^\[.*\]$/, '([^/]+?)')).join('/');
    // eslint-disable-next-line @sentry-internal/sdk/no-regexp-constructor -- routeParts are from the build manifest, so no raw user input
    return new RegExp(`^${rejoinedRouteParts}${optionalCatchallWildcardRegex}(?:/)?$`);
}
exports.pagesRouterInstrumentNavigation = pagesRouterInstrumentNavigation;
exports.pagesRouterInstrumentPageLoad = pagesRouterInstrumentPageLoad; //# sourceMappingURL=pagesRouterRoutingInstrumentation.js.map
}),
"[project]/node_modules/@sentry/nextjs/build/cjs/client/routing/nextRoutingInstrumentation.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const react = __turbopack_context__.r("[project]/node_modules/@sentry/react/build/cjs/index.js [app-client] (ecmascript)");
const appRouterRoutingInstrumentation = __turbopack_context__.r("[project]/node_modules/@sentry/nextjs/build/cjs/client/routing/appRouterRoutingInstrumentation.js [app-client] (ecmascript)");
const pagesRouterRoutingInstrumentation = __turbopack_context__.r("[project]/node_modules/@sentry/nextjs/build/cjs/client/routing/pagesRouterRoutingInstrumentation.js [app-client] (ecmascript)");
/**
 * Instruments the Next.js Client Router for page loads.
 */ function nextRouterInstrumentPageLoad(client) {
    const isAppRouter = !react.WINDOW.document.getElementById('__NEXT_DATA__');
    if (isAppRouter) {
        appRouterRoutingInstrumentation.appRouterInstrumentPageLoad(client);
    } else {
        pagesRouterRoutingInstrumentation.pagesRouterInstrumentPageLoad(client);
    }
}
/**
 * Instruments the Next.js Client Router for navigation.
 */ function nextRouterInstrumentNavigation(client) {
    const isAppRouter = !react.WINDOW.document.getElementById('__NEXT_DATA__');
    if (isAppRouter) {
        appRouterRoutingInstrumentation.appRouterInstrumentNavigation(client);
    } else {
        pagesRouterRoutingInstrumentation.pagesRouterInstrumentNavigation(client);
    }
}
exports.nextRouterInstrumentNavigation = nextRouterInstrumentNavigation;
exports.nextRouterInstrumentPageLoad = nextRouterInstrumentPageLoad; //# sourceMappingURL=nextRoutingInstrumentation.js.map
}),
"[project]/node_modules/@sentry/nextjs/build/cjs/client/browserTracingIntegration.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const react = __turbopack_context__.r("[project]/node_modules/@sentry/react/build/cjs/index.js [app-client] (ecmascript)");
const nextRoutingInstrumentation = __turbopack_context__.r("[project]/node_modules/@sentry/nextjs/build/cjs/client/routing/nextRoutingInstrumentation.js [app-client] (ecmascript)");
/**
 * A custom browser tracing integration for Next.js.
 */ function browserTracingIntegration(options = {}) {
    const browserTracingIntegrationInstance = react.browserTracingIntegration({
        ...options,
        instrumentNavigation: false,
        instrumentPageLoad: false,
        onRequestSpanStart (...args) {
            const [span, { headers }] = args;
            // Next.js prefetch requests have a `next-router-prefetch` header
            if (headers?.get('next-router-prefetch')) {
                span?.setAttribute('http.request.prefetch', true);
            }
            return options.onRequestSpanStart?.(...args);
        }
    });
    const { instrumentPageLoad = true, instrumentNavigation = true } = options;
    return {
        ...browserTracingIntegrationInstance,
        afterAllSetup (client) {
            // We need to run the navigation span instrumentation before the `afterAllSetup` hook on the normal browser
            // tracing integration because we need to ensure the order of execution is as follows:
            // Instrumentation to start span on RSC fetch request runs -> Instrumentation to put tracing headers from active span on fetch runs
            // If it were the other way around, the RSC fetch request would not receive the tracing headers from the navigation transaction.
            if (instrumentNavigation) {
                nextRoutingInstrumentation.nextRouterInstrumentNavigation(client);
            }
            browserTracingIntegrationInstance.afterAllSetup(client);
            if (instrumentPageLoad) {
                nextRoutingInstrumentation.nextRouterInstrumentPageLoad(client);
            }
        }
    };
}
exports.browserTracingIntegration = browserTracingIntegration; //# sourceMappingURL=browserTracingIntegration.js.map
}),
"[project]/node_modules/@sentry/nextjs/build/cjs/client/clientNormalizationIntegration.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const core = __turbopack_context__.r("[project]/node_modules/@sentry/core/build/cjs/index.js [app-client] (ecmascript)");
const react = __turbopack_context__.r("[project]/node_modules/@sentry/react/build/cjs/index.js [app-client] (ecmascript)");
const nextjsClientStackFrameNormalizationIntegration = core.defineIntegration(({ assetPrefix, basePath, rewriteFramesAssetPrefixPath, experimentalThirdPartyOriginStackFrames })=>{
    const rewriteFramesInstance = react.rewriteFramesIntegration({
        // Turn `<origin>/<path>/_next/static/...` into `app:///_next/static/...`
        iteratee: (frame)=>{
            if (experimentalThirdPartyOriginStackFrames) {
                // Not sure why but access to global WINDOW from @sentry/Browser causes hideous ci errors
                // eslint-disable-next-line no-restricted-globals
                const windowOrigin = typeof window !== 'undefined' && window.location ? window.location.origin : '';
                // A filename starting with the local origin and not ending with JS is most likely JS in HTML which we do not want to rewrite
                if (frame.filename?.startsWith(windowOrigin) && !frame.filename.endsWith('.js')) {
                    return frame;
                }
                if (assetPrefix) {
                    // If the user defined an asset prefix, we need to strip it so that we can match it with uploaded sourcemaps.
                    // assetPrefix always takes priority over basePath.
                    if (frame.filename?.startsWith(assetPrefix)) {
                        frame.filename = frame.filename.replace(assetPrefix, 'app://');
                    }
                } else if (basePath) {
                    // If the user defined a base path, we need to strip it to match with uploaded sourcemaps.
                    // We should only do this for same-origin filenames though, so that third party assets are not rewritten.
                    try {
                        const { origin: frameOrigin } = new URL(frame.filename);
                        if (frameOrigin === windowOrigin) {
                            frame.filename = frame.filename?.replace(frameOrigin, 'app://').replace(basePath, '');
                        }
                    } catch  {
                    // Filename wasn't a properly formed URL, so there's nothing we can do
                    }
                }
            } else {
                try {
                    const { origin } = new URL(frame.filename);
                    frame.filename = frame.filename?.replace(origin, 'app://').replace(rewriteFramesAssetPrefixPath, '');
                } catch  {
                // Filename wasn't a properly formed URL, so there's nothing we can do
                }
            }
            // We need to URI-decode the filename because Next.js has wildcard routes like "/users/[id].js" which show up as "/users/%5id%5.js" in Error stacktraces.
            // The corresponding sources that Next.js generates have proper brackets so we also need proper brackets in the frame so that source map resolving works.
            if (experimentalThirdPartyOriginStackFrames) {
                if (frame.filename?.includes('/_next')) {
                    frame.filename = decodeURI(frame.filename);
                }
                if (frame.filename?.match(/\/_next\/static\/chunks\/(main-|main-app-|polyfills-|webpack-|framework-|framework\.)[0-9a-f]+\.js$/)) {
                    // We don't care about these frames. It's Next.js internal code.
                    frame.in_app = false;
                }
            } else {
                if (frame.filename?.startsWith('app:///_next')) {
                    frame.filename = decodeURI(frame.filename);
                }
                if (frame.filename?.match(/^app:\/\/\/_next\/static\/chunks\/(main-|main-app-|polyfills-|webpack-|framework-|framework\.)[0-9a-f]+\.js$/)) {
                    // We don't care about these frames. It's Next.js internal code.
                    frame.in_app = false;
                }
            }
            return frame;
        }
    });
    return {
        ...rewriteFramesInstance,
        name: 'NextjsClientStackFrameNormalization'
    };
});
exports.nextjsClientStackFrameNormalizationIntegration = nextjsClientStackFrameNormalizationIntegration; //# sourceMappingURL=clientNormalizationIntegration.js.map
}),
"[project]/node_modules/@sentry/nextjs/build/cjs/client/routing/isrRoutingTracing.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const core = __turbopack_context__.r("[project]/node_modules/@sentry/core/build/cjs/index.js [app-client] (ecmascript)");
const react = __turbopack_context__.r("[project]/node_modules/@sentry/react/build/cjs/index.js [app-client] (ecmascript)");
const parameterization = __turbopack_context__.r("[project]/node_modules/@sentry/nextjs/build/cjs/client/routing/parameterization.js [app-client] (ecmascript)");
/**
 * Cache for ISR/SSG route checks. Exported for testing purposes.
 * @internal
 */ const IS_ISR_SSG_ROUTE_CACHE = new core.LRUMap(100);
/**
 * Check if the current page is an ISR/SSG route by checking the route manifest.
 * @internal Exported for testing purposes.
 */ function isIsrSsgRoute(pathname) {
    // Early parameterization to get the cache key
    const parameterizedPath = parameterization.maybeParameterizeRoute(pathname);
    const pathToCheck = parameterizedPath || pathname;
    // Check cache using the parameterized path as the key
    const cachedResult = IS_ISR_SSG_ROUTE_CACHE.get(pathToCheck);
    if (cachedResult !== undefined) {
        return cachedResult;
    }
    // Cache miss get the manifest
    const manifest = parameterization.getManifest();
    if (!manifest?.isrRoutes || !Array.isArray(manifest.isrRoutes) || manifest.isrRoutes.length === 0) {
        IS_ISR_SSG_ROUTE_CACHE.set(pathToCheck, false);
        return false;
    }
    const isIsrSsgRoute = manifest.isrRoutes.includes(pathToCheck);
    IS_ISR_SSG_ROUTE_CACHE.set(pathToCheck, isIsrSsgRoute);
    return isIsrSsgRoute;
}
/**
 * Remove sentry-trace and baggage meta tags from the DOM if this is an ISR/SSG page.
 * This prevents the browser tracing integration from using stale/cached trace IDs.
 */ function removeIsrSsgTraceMetaTags() {
    if (!react.WINDOW.document || !isIsrSsgRoute(react.WINDOW.location.pathname)) {
        return;
    }
    // Helper function to remove a meta tag
    function removeMetaTag(metaName) {
        try {
            const meta = react.WINDOW.document.querySelector(`meta[name="${metaName}"]`);
            if (meta) {
                meta.remove();
            }
        } catch  {
        // ignore errors when removing the meta tag
        }
    }
    // Remove the meta tags so browserTracingIntegration won't pick them up
    removeMetaTag('sentry-trace');
    removeMetaTag('baggage');
}
exports.IS_ISR_SSG_ROUTE_CACHE = IS_ISR_SSG_ROUTE_CACHE;
exports.isIsrSsgRoute = isIsrSsgRoute;
exports.removeIsrSsgTraceMetaTags = removeIsrSsgTraceMetaTags; //# sourceMappingURL=isrRoutingTracing.js.map
}),
"[project]/node_modules/@sentry/nextjs/build/cjs/client/tunnelRoute.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {

var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const core = __turbopack_context__.r("[project]/node_modules/@sentry/core/build/cjs/index.js [app-client] (ecmascript)");
const debugBuild = __turbopack_context__.r("[project]/node_modules/@sentry/nextjs/build/cjs/common/debug-build.js [app-client] (ecmascript)");
const globalWithInjectedValues = core.GLOBAL_OBJ;
/**
 * Applies the `tunnel` option to the Next.js SDK options based on `withSentryConfig`'s `tunnelRoute` option.
 */ function applyTunnelRouteOption(options) {
    const tunnelRouteOption = ("TURBOPACK compile-time value", "/monitoring") || globalWithInjectedValues._sentryRewritesTunnelPath;
    if (tunnelRouteOption && options.dsn) {
        const dsnComponents = core.dsnFromString(options.dsn);
        if (!dsnComponents) {
            return;
        }
        const sentrySaasDsnMatch = dsnComponents.host.match(/^o(\d+)\.ingest(?:\.([a-z]{2}))?\.sentry\.io$/);
        if (sentrySaasDsnMatch) {
            const orgId = sentrySaasDsnMatch[1];
            const regionCode = sentrySaasDsnMatch[2];
            let tunnelPath = `${tunnelRouteOption}?o=${orgId}&p=${dsnComponents.projectId}`;
            if (regionCode) {
                tunnelPath += `&r=${regionCode}`;
            }
            options.tunnel = tunnelPath;
            debugBuild.DEBUG_BUILD && core.debug.log(`Tunneling events to "${tunnelPath}"`);
        } else {
            debugBuild.DEBUG_BUILD && core.debug.warn('Provided DSN is not a Sentry SaaS DSN. Will not tunnel events.');
        }
    }
}
exports.applyTunnelRouteOption = applyTunnelRouteOption; //# sourceMappingURL=tunnelRoute.js.map
}),
"[project]/node_modules/@sentry/nextjs/build/cjs/common/utils/isBuild.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {

var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const constants = __turbopack_context__.r("[project]/node_modules/next/constants.js [app-client] (ecmascript)");
/**
 * Decide if the currently running process is part of the build phase or happening at runtime.
 */ function isBuild() {
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.NEXT_PHASE === constants.PHASE_PRODUCTION_BUILD;
}
exports.isBuild = isBuild; //# sourceMappingURL=isBuild.js.map
}),
"[project]/node_modules/@sentry/nextjs/build/cjs/common/span-attributes-with-logic-attached.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
/**
 * If this attribute is attached to a transaction, the Next.js SDK will drop that transaction.
 */ const TRANSACTION_ATTR_SHOULD_DROP_TRANSACTION = 'sentry.drop_transaction';
const TRANSACTION_ATTR_SENTRY_TRACE_BACKFILL = 'sentry.sentry_trace_backfill';
const TRANSACTION_ATTR_SENTRY_ROUTE_BACKFILL = 'sentry.route_backfill';
exports.TRANSACTION_ATTR_SENTRY_ROUTE_BACKFILL = TRANSACTION_ATTR_SENTRY_ROUTE_BACKFILL;
exports.TRANSACTION_ATTR_SENTRY_TRACE_BACKFILL = TRANSACTION_ATTR_SENTRY_TRACE_BACKFILL;
exports.TRANSACTION_ATTR_SHOULD_DROP_TRANSACTION = TRANSACTION_ATTR_SHOULD_DROP_TRANSACTION; //# sourceMappingURL=span-attributes-with-logic-attached.js.map
}),
"[project]/node_modules/@sentry/nextjs/build/cjs/common/utils/wrapperUtils.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const core = __turbopack_context__.r("[project]/node_modules/@sentry/core/build/cjs/index.js [app-client] (ecmascript)");
const spanAttributesWithLogicAttached = __turbopack_context__.r("[project]/node_modules/@sentry/nextjs/build/cjs/common/span-attributes-with-logic-attached.js [app-client] (ecmascript)");
/**
 * Wraps a function that potentially throws. If it does, the error is passed to `captureException` and rethrown.
 *
 * Note: This function turns the wrapped function into an asynchronous one.
 */ // eslint-disable-next-line @typescript-eslint/no-explicit-any
function withErrorInstrumentation(origFunction) {
    return async function(...origFunctionArguments) {
        try {
            return await origFunction.apply(this, origFunctionArguments);
        } catch (e) {
            // TODO: Extract error logic from `withSentry` in here or create a new wrapper with said logic or something like that.
            core.captureException(e, {
                // TODO: check if origFunction.name actually returns the correct name or minified garbage
                // in this case, we can add another argument to this wrapper with the respective function name
                mechanism: {
                    handled: false,
                    type: 'auto.function.nextjs.wrapped',
                    data: {
                        function: origFunction.name
                    }
                }
            });
            throw e;
        }
    };
}
/**
 * Calls a server-side data fetching function (that takes a `req` and `res` object in its context) with tracing
 * instrumentation. A transaction will be created for the incoming request (if it doesn't already exist) in addition to
 * a span for the wrapped data fetching function.
 *
 * All of the above happens in an isolated domain, meaning all thrown errors will be associated with the correct span.
 *
 * @param origDataFetcher The data fetching method to call.
 * @param origFunctionArguments The arguments to call the data fetching method with.
 * @param req The data fetching function's request object.
 * @param res The data fetching function's response object.
 * @param options Options providing details for the created transaction and span.
 * @returns what the data fetching method call returned.
 */ // eslint-disable-next-line @typescript-eslint/no-explicit-any
function withTracedServerSideDataFetcher(origDataFetcher, req, res, options) {
    return async function(...args) {
        const normalizedRequest = core.httpRequestToRequestData(req);
        core.getCurrentScope().setTransactionName(`${options.dataFetchingMethodName} (${options.dataFetcherRouteName})`);
        core.getIsolationScope().setSDKProcessingMetadata({
            normalizedRequest
        });
        const span = core.getActiveSpan();
        // Only set the route backfill if the span is not for /_error
        if (span && options.requestedRouteName !== '/_error') {
            const root = core.getRootSpan(span);
            root.setAttribute(spanAttributesWithLogicAttached.TRANSACTION_ATTR_SENTRY_ROUTE_BACKFILL, options.requestedRouteName);
        }
        const { 'sentry-trace': sentryTrace, baggage } = core.getTraceData();
        return {
            sentryTrace: sentryTrace,
            baggage: baggage,
            data: await origDataFetcher.apply(this, args)
        };
    };
}
/**
 * Call a data fetcher and trace it. Only traces the function if there is an active transaction on the scope.
 *
 * We only do the following until we move transaction creation into this function: When called, the wrapped function
 * will also update the name of the active transaction with a parameterized route provided via the `options` argument.
 */ // eslint-disable-next-line @typescript-eslint/no-explicit-any
async function callDataFetcherTraced(origFunction, origFunctionArgs) {
    try {
        return await origFunction(...origFunctionArgs);
    } catch (e) {
        core.captureException(e, {
            mechanism: {
                handled: false,
                type: 'auto.function.nextjs.data_fetcher'
            }
        });
        throw e;
    }
}
exports.callDataFetcherTraced = callDataFetcherTraced;
exports.withErrorInstrumentation = withErrorInstrumentation;
exports.withTracedServerSideDataFetcher = withTracedServerSideDataFetcher; //# sourceMappingURL=wrapperUtils.js.map
}),
"[project]/node_modules/@sentry/nextjs/build/cjs/common/pages-router-instrumentation/wrapGetStaticPropsWithSentry.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const isBuild = __turbopack_context__.r("[project]/node_modules/@sentry/nextjs/build/cjs/common/utils/isBuild.js [app-client] (ecmascript)");
const wrapperUtils = __turbopack_context__.r("[project]/node_modules/@sentry/nextjs/build/cjs/common/utils/wrapperUtils.js [app-client] (ecmascript)");
/**
 * Create a wrapped version of the user's exported `getStaticProps` function
 *
 * @param origGetStaticProps The user's `getStaticProps` function
 * @param parameterizedRoute The page's parameterized route
 * @returns A wrapped version of the function
 */ function wrapGetStaticPropsWithSentry(origGetStaticPropsa, _parameterizedRoute) {
    return new Proxy(origGetStaticPropsa, {
        apply: async (wrappingTarget, thisArg, args)=>{
            if (isBuild.isBuild()) {
                return wrappingTarget.apply(thisArg, args);
            }
            const errorWrappedGetStaticProps = wrapperUtils.withErrorInstrumentation(wrappingTarget);
            return wrapperUtils.callDataFetcherTraced(errorWrappedGetStaticProps, args);
        }
    });
}
exports.wrapGetStaticPropsWithSentry = wrapGetStaticPropsWithSentry; //# sourceMappingURL=wrapGetStaticPropsWithSentry.js.map
}),
"[project]/node_modules/@sentry/nextjs/build/cjs/common/pages-router-instrumentation/wrapGetInitialPropsWithSentry.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const isBuild = __turbopack_context__.r("[project]/node_modules/@sentry/nextjs/build/cjs/common/utils/isBuild.js [app-client] (ecmascript)");
const wrapperUtils = __turbopack_context__.r("[project]/node_modules/@sentry/nextjs/build/cjs/common/utils/wrapperUtils.js [app-client] (ecmascript)");
/**
 * Create a wrapped version of the user's exported `getInitialProps` function
 *
 * @param origGetInitialProps The user's `getInitialProps` function
 * @param parameterizedRoute The page's parameterized route
 * @returns A wrapped version of the function
 */ function wrapGetInitialPropsWithSentry(origGetInitialProps) {
    return new Proxy(origGetInitialProps, {
        apply: async (wrappingTarget, thisArg, args)=>{
            if (isBuild.isBuild()) {
                return wrappingTarget.apply(thisArg, args);
            }
            const [context] = args;
            const { req, res } = context;
            const errorWrappedGetInitialProps = wrapperUtils.withErrorInstrumentation(wrappingTarget);
            // Generally we can assume that `req` and `res` are always defined on the server:
            // https://nextjs.org/docs/api-reference/data-fetching/get-initial-props#context-object
            // This does not seem to be the case in dev mode. Because we have no clean way of associating the the data fetcher
            // span with each other when there are no req or res objects, we simply do not trace them at all here.
            if (req && res) {
                const tracedGetInitialProps = wrapperUtils.withTracedServerSideDataFetcher(errorWrappedGetInitialProps, req, res, {
                    dataFetcherRouteName: context.pathname,
                    requestedRouteName: context.pathname,
                    dataFetchingMethodName: 'getInitialProps'
                });
                const { data: initialProps, baggage, sentryTrace } = await tracedGetInitialProps.apply(thisArg, args) ?? {}; // Next.js allows undefined to be returned from a getInitialPropsFunction.
                if (typeof initialProps === 'object' && initialProps !== null) {
                    // The Next.js serializer throws on undefined values so we need to guard for it (#12102)
                    if (sentryTrace) {
                        initialProps._sentryTraceData = sentryTrace;
                    }
                    // The Next.js serializer throws on undefined values so we need to guard for it (#12102)
                    if (baggage) {
                        initialProps._sentryBaggage = baggage;
                    }
                }
                return initialProps;
            } else {
                return errorWrappedGetInitialProps.apply(thisArg, args);
            }
        }
    });
}
exports.wrapGetInitialPropsWithSentry = wrapGetInitialPropsWithSentry; //# sourceMappingURL=wrapGetInitialPropsWithSentry.js.map
}),
"[project]/node_modules/@sentry/nextjs/build/cjs/common/pages-router-instrumentation/wrapAppGetInitialPropsWithSentry.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const isBuild = __turbopack_context__.r("[project]/node_modules/@sentry/nextjs/build/cjs/common/utils/isBuild.js [app-client] (ecmascript)");
const wrapperUtils = __turbopack_context__.r("[project]/node_modules/@sentry/nextjs/build/cjs/common/utils/wrapperUtils.js [app-client] (ecmascript)");
/**
 * Create a wrapped version of the user's exported `getInitialProps` function in
 * a custom app ("_app.js").
 *
 * @param origAppGetInitialProps The user's `getInitialProps` function
 * @param parameterizedRoute The page's parameterized route
 * @returns A wrapped version of the function
 */ function wrapAppGetInitialPropsWithSentry(origAppGetInitialProps) {
    return new Proxy(origAppGetInitialProps, {
        apply: async (wrappingTarget, thisArg, args)=>{
            if (isBuild.isBuild()) {
                return wrappingTarget.apply(thisArg, args);
            }
            const [context] = args;
            const { req, res } = context.ctx;
            const errorWrappedAppGetInitialProps = wrapperUtils.withErrorInstrumentation(wrappingTarget);
            // Generally we can assume that `req` and `res` are always defined on the server:
            // https://nextjs.org/docs/api-reference/data-fetching/get-initial-props#context-object
            // This does not seem to be the case in dev mode. Because we have no clean way of associating the the data fetcher
            // span with each other when there are no req or res objects, we simply do not trace them at all here.
            if (req && res) {
                const tracedGetInitialProps = wrapperUtils.withTracedServerSideDataFetcher(errorWrappedAppGetInitialProps, req, res, {
                    dataFetcherRouteName: '/_app',
                    requestedRouteName: context.ctx.pathname,
                    dataFetchingMethodName: 'getInitialProps'
                });
                const { data: appGetInitialProps, sentryTrace, baggage } = await tracedGetInitialProps.apply(thisArg, args);
                if (typeof appGetInitialProps === 'object' && appGetInitialProps !== null) {
                    // Per definition, `pageProps` is not optional, however an increased amount of users doesn't seem to call
                    // `App.getInitialProps(appContext)` in their custom `_app` pages which is required as per
                    // https://nextjs.org/docs/advanced-features/custom-app - resulting in missing `pageProps`.
                    // For this reason, we just handle the case where `pageProps` doesn't exist explicitly.
                    if (!appGetInitialProps.pageProps) {
                        appGetInitialProps.pageProps = {};
                    }
                    // The Next.js serializer throws on undefined values so we need to guard for it (#12102)
                    if (sentryTrace) {
                        appGetInitialProps.pageProps._sentryTraceData = sentryTrace;
                    }
                    // The Next.js serializer throws on undefined values so we need to guard for it (#12102)
                    if (baggage) {
                        appGetInitialProps.pageProps._sentryBaggage = baggage;
                    }
                }
                return appGetInitialProps;
            } else {
                return errorWrappedAppGetInitialProps.apply(thisArg, args);
            }
        }
    });
}
exports.wrapAppGetInitialPropsWithSentry = wrapAppGetInitialPropsWithSentry; //# sourceMappingURL=wrapAppGetInitialPropsWithSentry.js.map
}),
"[project]/node_modules/@sentry/nextjs/build/cjs/common/pages-router-instrumentation/wrapDocumentGetInitialPropsWithSentry.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const isBuild = __turbopack_context__.r("[project]/node_modules/@sentry/nextjs/build/cjs/common/utils/isBuild.js [app-client] (ecmascript)");
const wrapperUtils = __turbopack_context__.r("[project]/node_modules/@sentry/nextjs/build/cjs/common/utils/wrapperUtils.js [app-client] (ecmascript)");
/**
 * Create a wrapped version of the user's exported `getInitialProps` function in
 * a custom document ("_document.js").
 *
 * @param origDocumentGetInitialProps The user's `getInitialProps` function
 * @param parameterizedRoute The page's parameterized route
 * @returns A wrapped version of the function
 */ function wrapDocumentGetInitialPropsWithSentry(origDocumentGetInitialProps) {
    return new Proxy(origDocumentGetInitialProps, {
        apply: async (wrappingTarget, thisArg, args)=>{
            if (isBuild.isBuild()) {
                return wrappingTarget.apply(thisArg, args);
            }
            const [context] = args;
            const { req, res } = context;
            const errorWrappedGetInitialProps = wrapperUtils.withErrorInstrumentation(wrappingTarget);
            // Generally we can assume that `req` and `res` are always defined on the server:
            // https://nextjs.org/docs/api-reference/data-fetching/get-initial-props#context-object
            // This does not seem to be the case in dev mode. Because we have no clean way of associating the the data fetcher
            // span with each other when there are no req or res objects, we simply do not trace them at all here.
            if (req && res) {
                const tracedGetInitialProps = wrapperUtils.withTracedServerSideDataFetcher(errorWrappedGetInitialProps, req, res, {
                    dataFetcherRouteName: '/_document',
                    requestedRouteName: context.pathname,
                    dataFetchingMethodName: 'getInitialProps'
                });
                const { data } = await tracedGetInitialProps.apply(thisArg, args);
                return data;
            } else {
                return errorWrappedGetInitialProps.apply(thisArg, args);
            }
        }
    });
}
exports.wrapDocumentGetInitialPropsWithSentry = wrapDocumentGetInitialPropsWithSentry; //# sourceMappingURL=wrapDocumentGetInitialPropsWithSentry.js.map
}),
"[project]/node_modules/@sentry/nextjs/build/cjs/common/pages-router-instrumentation/wrapErrorGetInitialPropsWithSentry.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const isBuild = __turbopack_context__.r("[project]/node_modules/@sentry/nextjs/build/cjs/common/utils/isBuild.js [app-client] (ecmascript)");
const wrapperUtils = __turbopack_context__.r("[project]/node_modules/@sentry/nextjs/build/cjs/common/utils/wrapperUtils.js [app-client] (ecmascript)");
/**
 * Create a wrapped version of the user's exported `getInitialProps` function in
 * a custom error page ("_error.js").
 *
 * @param origErrorGetInitialProps The user's `getInitialProps` function
 * @param parameterizedRoute The page's parameterized route
 * @returns A wrapped version of the function
 */ function wrapErrorGetInitialPropsWithSentry(origErrorGetInitialProps) {
    return new Proxy(origErrorGetInitialProps, {
        apply: async (wrappingTarget, thisArg, args)=>{
            if (isBuild.isBuild()) {
                return wrappingTarget.apply(thisArg, args);
            }
            const [context] = args;
            const { req, res } = context;
            const errorWrappedGetInitialProps = wrapperUtils.withErrorInstrumentation(wrappingTarget);
            // Generally we can assume that `req` and `res` are always defined on the server:
            // https://nextjs.org/docs/api-reference/data-fetching/get-initial-props#context-object
            // This does not seem to be the case in dev mode. Because we have no clean way of associating the the data fetcher
            // span with each other when there are no req or res objects, we simply do not trace them at all here.
            if (req && res) {
                const tracedGetInitialProps = wrapperUtils.withTracedServerSideDataFetcher(errorWrappedGetInitialProps, req, res, {
                    dataFetcherRouteName: '/_error',
                    requestedRouteName: context.pathname,
                    dataFetchingMethodName: 'getInitialProps'
                });
                const { data: errorGetInitialProps, baggage, sentryTrace } = await tracedGetInitialProps.apply(thisArg, args);
                if (typeof errorGetInitialProps === 'object' && errorGetInitialProps !== null) {
                    if (sentryTrace) {
                        // The Next.js serializer throws on undefined values so we need to guard for it (#12102)
                        errorGetInitialProps._sentryTraceData = sentryTrace;
                    }
                    // The Next.js serializer throws on undefined values so we need to guard for it (#12102)
                    if (baggage) {
                        errorGetInitialProps._sentryBaggage = baggage;
                    }
                }
                return errorGetInitialProps;
            } else {
                return errorWrappedGetInitialProps.apply(thisArg, args);
            }
        }
    });
}
exports.wrapErrorGetInitialPropsWithSentry = wrapErrorGetInitialPropsWithSentry; //# sourceMappingURL=wrapErrorGetInitialPropsWithSentry.js.map
}),
"[project]/node_modules/@sentry/nextjs/build/cjs/common/pages-router-instrumentation/wrapGetServerSidePropsWithSentry.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const isBuild = __turbopack_context__.r("[project]/node_modules/@sentry/nextjs/build/cjs/common/utils/isBuild.js [app-client] (ecmascript)");
const wrapperUtils = __turbopack_context__.r("[project]/node_modules/@sentry/nextjs/build/cjs/common/utils/wrapperUtils.js [app-client] (ecmascript)");
/**
 * Create a wrapped version of the user's exported `getServerSideProps` function
 *
 * @param origGetServerSideProps The user's `getServerSideProps` function
 * @param parameterizedRoute The page's parameterized route
 * @returns A wrapped version of the function
 */ function wrapGetServerSidePropsWithSentry(origGetServerSideProps, parameterizedRoute) {
    return new Proxy(origGetServerSideProps, {
        apply: async (wrappingTarget, thisArg, args)=>{
            if (isBuild.isBuild()) {
                return wrappingTarget.apply(thisArg, args);
            }
            const [context] = args;
            const { req, res } = context;
            const errorWrappedGetServerSideProps = wrapperUtils.withErrorInstrumentation(wrappingTarget);
            const tracedGetServerSideProps = wrapperUtils.withTracedServerSideDataFetcher(errorWrappedGetServerSideProps, req, res, {
                dataFetcherRouteName: parameterizedRoute,
                requestedRouteName: parameterizedRoute,
                dataFetchingMethodName: 'getServerSideProps'
            });
            const { data: serverSideProps, baggage, sentryTrace } = await tracedGetServerSideProps.apply(thisArg, args);
            if (typeof serverSideProps === 'object' && serverSideProps !== null && 'props' in serverSideProps) {
                // The Next.js serializer throws on undefined values so we need to guard for it (#12102)
                if (sentryTrace) {
                    serverSideProps.props._sentryTraceData = sentryTrace;
                }
                // The Next.js serializer throws on undefined values so we need to guard for it (#12102)
                if (baggage) {
                    serverSideProps.props._sentryBaggage = baggage;
                }
            }
            return serverSideProps;
        }
    });
}
exports.wrapGetServerSidePropsWithSentry = wrapGetServerSidePropsWithSentry; //# sourceMappingURL=wrapGetServerSidePropsWithSentry.js.map
}),
"[project]/node_modules/@sentry/nextjs/build/cjs/common/utils/responseEnd.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const core = __turbopack_context__.r("[project]/node_modules/@sentry/core/build/cjs/index.js [app-client] (ecmascript)");
const debugBuild = __turbopack_context__.r("[project]/node_modules/@sentry/nextjs/build/cjs/common/debug-build.js [app-client] (ecmascript)");
/**
 * Flushes pending Sentry events with a 2 second timeout and in a way that cannot create unhandled promise rejections.
 */ async function flushSafelyWithTimeout() {
    try {
        debugBuild.DEBUG_BUILD && core.debug.log('Flushing events...');
        await core.flush(2000);
        debugBuild.DEBUG_BUILD && core.debug.log('Done flushing events');
    } catch (e) {
        debugBuild.DEBUG_BUILD && core.debug.log('Error while flushing events:\n', e);
    }
}
/**
 * Uses platform-specific waitUntil function to wait for the provided task to complete without blocking.
 */ function waitUntil(task) {
    // If deployed on Cloudflare, use the Cloudflare waitUntil function to flush the events
    if (isCloudflareWaitUntilAvailable()) {
        cloudflareWaitUntil(task);
        return;
    }
    // otherwise, use vercel's
    core.vercelWaitUntil(task);
}
/**
 * Gets the Cloudflare context from the global object.
 * Relevant to opennext
 * https://github.com/opennextjs/opennextjs-cloudflare/blob/b53a046bd5c30e94a42e36b67747cefbf7785f9a/packages/cloudflare/src/cli/templates/init.ts#L17
 */ function _getOpenNextCloudflareContext() {
    const openNextCloudflareContextSymbol = Symbol.for('__cloudflare-context__');
    return core.GLOBAL_OBJ[openNextCloudflareContextSymbol]?.ctx;
}
/**
 * Function that delays closing of a Cloudflare lambda until the provided promise is resolved.
 */ function cloudflareWaitUntil(task) {
    _getOpenNextCloudflareContext()?.waitUntil(task);
}
/**
 * Checks if the Cloudflare waitUntil function is available globally.
 */ function isCloudflareWaitUntilAvailable() {
    return typeof _getOpenNextCloudflareContext()?.waitUntil === 'function';
}
exports.cloudflareWaitUntil = cloudflareWaitUntil;
exports.flushSafelyWithTimeout = flushSafelyWithTimeout;
exports.isCloudflareWaitUntilAvailable = isCloudflareWaitUntilAvailable;
exports.waitUntil = waitUntil; //# sourceMappingURL=responseEnd.js.map
}),
"[project]/node_modules/@sentry/nextjs/build/cjs/common/utils/tracingUtils.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const core = __turbopack_context__.r("[project]/node_modules/@sentry/core/build/cjs/index.js [app-client] (ecmascript)");
const debugBuild = __turbopack_context__.r("[project]/node_modules/@sentry/nextjs/build/cjs/common/debug-build.js [app-client] (ecmascript)");
const spanAttributesWithLogicAttached = __turbopack_context__.r("[project]/node_modules/@sentry/nextjs/build/cjs/common/span-attributes-with-logic-attached.js [app-client] (ecmascript)");
const commonPropagationContextMap = new WeakMap();
/**
 * Takes a shared (garbage collectable) object between resources, e.g. a headers object shared between Next.js server components and returns a common propagation context.
 *
 * @param commonObject The shared object.
 * @param propagationContext The propagation context that should be shared between all the resources if no propagation context was registered yet.
 * @returns the shared propagation context.
 */ function commonObjectToPropagationContext(commonObject, propagationContext) {
    if (typeof commonObject === 'object' && commonObject) {
        const memoPropagationContext = commonPropagationContextMap.get(commonObject);
        if (memoPropagationContext) {
            return memoPropagationContext;
        } else {
            commonPropagationContextMap.set(commonObject, propagationContext);
            return propagationContext;
        }
    } else {
        return propagationContext;
    }
}
const commonIsolationScopeMap = new WeakMap();
/**
 * Takes a shared (garbage collectable) object between resources, e.g. a headers object shared between Next.js server components and returns a common propagation context.
 *
 * @param commonObject The shared object.
 * @param isolationScope The isolationScope that should be shared between all the resources if no isolation scope was created yet.
 * @returns the shared isolation scope.
 */ function commonObjectToIsolationScope(commonObject) {
    if (typeof commonObject === 'object' && commonObject) {
        const memoIsolationScope = commonIsolationScopeMap.get(commonObject);
        if (memoIsolationScope) {
            return memoIsolationScope;
        } else {
            const newIsolationScope = new core.Scope();
            commonIsolationScopeMap.set(commonObject, newIsolationScope);
            return newIsolationScope;
        }
    } else {
        return new core.Scope();
    }
}
let nextjsEscapedAsyncStorage;
/**
 * Will mark the execution context of the callback as "escaped" from Next.js internal tracing by unsetting the active
 * span and propagation context. When an execution passes through this function multiple times, it is a noop after the
 * first time.
 */ function escapeNextjsTracing(cb) {
    const MaybeGlobalAsyncLocalStorage = core.GLOBAL_OBJ.AsyncLocalStorage;
    if (!MaybeGlobalAsyncLocalStorage) {
        debugBuild.DEBUG_BUILD && core.debug.warn("Tried to register AsyncLocalStorage async context strategy in a runtime that doesn't support AsyncLocalStorage.");
        return cb();
    }
    if (!nextjsEscapedAsyncStorage) {
        nextjsEscapedAsyncStorage = new MaybeGlobalAsyncLocalStorage();
    }
    if (nextjsEscapedAsyncStorage.getStore()) {
        return cb();
    } else {
        return core.startNewTrace(()=>{
            return nextjsEscapedAsyncStorage.run(true, ()=>{
                return cb();
            });
        });
    }
}
/**
 * Ideally this function never lands in the develop branch.
 *
 * Drops the entire span tree this function was called in, if it was a span tree created by Next.js.
 */ function dropNextjsRootContext() {
    const nextJsOwnedSpan = core.getActiveSpan();
    if (nextJsOwnedSpan) {
        const rootSpan = core.getRootSpan(nextJsOwnedSpan);
        const rootSpanAttributes = core.spanToJSON(rootSpan).data;
        if (rootSpanAttributes?.['next.span_type']) {
            core.getRootSpan(nextJsOwnedSpan)?.setAttribute(spanAttributesWithLogicAttached.TRANSACTION_ATTR_SHOULD_DROP_TRANSACTION, true);
        }
    }
}
exports.commonObjectToIsolationScope = commonObjectToIsolationScope;
exports.commonObjectToPropagationContext = commonObjectToPropagationContext;
exports.dropNextjsRootContext = dropNextjsRootContext;
exports.escapeNextjsTracing = escapeNextjsTracing; //# sourceMappingURL=tracingUtils.js.map
}),
"[project]/node_modules/@sentry/nextjs/build/cjs/common/wrapServerComponentWithSentry.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {

var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const core = __turbopack_context__.r("[project]/node_modules/@sentry/core/build/cjs/index.js [app-client] (ecmascript)");
const nextNavigationErrorUtils = __turbopack_context__.r("[project]/node_modules/@sentry/nextjs/build/cjs/common/nextNavigationErrorUtils.js [app-client] (ecmascript)");
const responseEnd = __turbopack_context__.r("[project]/node_modules/@sentry/nextjs/build/cjs/common/utils/responseEnd.js [app-client] (ecmascript)");
const spanAttributesWithLogicAttached = __turbopack_context__.r("[project]/node_modules/@sentry/nextjs/build/cjs/common/span-attributes-with-logic-attached.js [app-client] (ecmascript)");
const tracingUtils = __turbopack_context__.r("[project]/node_modules/@sentry/nextjs/build/cjs/common/utils/tracingUtils.js [app-client] (ecmascript)");
/**
 * Wraps an `app` directory server component with Sentry error instrumentation.
 */ // eslint-disable-next-line @typescript-eslint/no-explicit-any
function wrapServerComponentWithSentry(appDirComponent, context) {
    const { componentRoute, componentType } = context;
    // Even though users may define server components as async functions, for the client bundles
    // Next.js will turn them into synchronous functions and it will transform any `await`s into instances of the `use`
    // hook. 🤯
    return new Proxy(appDirComponent, {
        apply: (originalFunction, thisArg, args)=>{
            const requestTraceId = core.getActiveSpan()?.spanContext().traceId;
            const isolationScope = tracingUtils.commonObjectToIsolationScope(context.headers);
            const activeSpan = core.getActiveSpan();
            if (activeSpan) {
                const rootSpan = core.getRootSpan(activeSpan);
                const { scope } = core.getCapturedScopesOnSpan(rootSpan);
                core.setCapturedScopesOnSpan(rootSpan, scope ?? new core.Scope(), isolationScope);
            }
            const headersDict = context.headers ? core.winterCGHeadersToDict(context.headers) : undefined;
            isolationScope.setSDKProcessingMetadata({
                normalizedRequest: {
                    headers: headersDict
                }
            });
            return core.withIsolationScope(isolationScope, ()=>{
                return core.withScope((scope)=>{
                    scope.setTransactionName(`${componentType} Server Component (${componentRoute})`);
                    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
                    ;
                    const activeSpan = core.getActiveSpan();
                    if (activeSpan) {
                        const rootSpan = core.getRootSpan(activeSpan);
                        const sentryTrace = headersDict?.['sentry-trace'];
                        if (sentryTrace) {
                            rootSpan.setAttribute(spanAttributesWithLogicAttached.TRANSACTION_ATTR_SENTRY_TRACE_BACKFILL, sentryTrace);
                        }
                    }
                    return core.startSpanManual({
                        op: 'function.nextjs',
                        name: `${componentType} Server Component (${componentRoute})`,
                        attributes: {
                            [core.SEMANTIC_ATTRIBUTE_SENTRY_SOURCE]: 'component',
                            [core.SEMANTIC_ATTRIBUTE_SENTRY_ORIGIN]: 'auto.function.nextjs.server_component',
                            'sentry.nextjs.ssr.function.type': componentType,
                            'sentry.nextjs.ssr.function.route': componentRoute
                        }
                    }, (span)=>{
                        return core.handleCallbackErrors(()=>originalFunction.apply(thisArg, args), (error)=>{
                            // When you read this code you might think: "Wait a minute, shouldn't we set the status on the root span too?"
                            // The answer is: "No." - The status of the root span is determined by whatever status code Next.js decides to put on the response.
                            if (nextNavigationErrorUtils.isNotFoundNavigationError(error)) {
                                // We don't want to report "not-found"s
                                span.setStatus({
                                    code: core.SPAN_STATUS_ERROR,
                                    message: 'not_found'
                                });
                            } else if (nextNavigationErrorUtils.isRedirectNavigationError(error)) {
                                // We don't want to report redirects
                                span.setStatus({
                                    code: core.SPAN_STATUS_OK
                                });
                            } else {
                                span.setStatus({
                                    code: core.SPAN_STATUS_ERROR,
                                    message: 'internal_error'
                                });
                                core.captureException(error, {
                                    mechanism: {
                                        handled: false,
                                        type: 'auto.function.nextjs.server_component'
                                    }
                                });
                            }
                        }, ()=>{
                            span.end();
                            responseEnd.waitUntil(responseEnd.flushSafelyWithTimeout());
                        });
                    });
                });
            });
        }
    });
}
exports.wrapServerComponentWithSentry = wrapServerComponentWithSentry; //# sourceMappingURL=wrapServerComponentWithSentry.js.map
}),
"[project]/node_modules/@sentry/nextjs/build/cjs/common/wrapRouteHandlerWithSentry.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {

var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const core = __turbopack_context__.r("[project]/node_modules/@sentry/core/build/cjs/index.js [app-client] (ecmascript)");
const nextNavigationErrorUtils = __turbopack_context__.r("[project]/node_modules/@sentry/nextjs/build/cjs/common/nextNavigationErrorUtils.js [app-client] (ecmascript)");
const responseEnd = __turbopack_context__.r("[project]/node_modules/@sentry/nextjs/build/cjs/common/utils/responseEnd.js [app-client] (ecmascript)");
const tracingUtils = __turbopack_context__.r("[project]/node_modules/@sentry/nextjs/build/cjs/common/utils/tracingUtils.js [app-client] (ecmascript)");
/**
 * Wraps a Next.js App Router Route handler with Sentry error and performance instrumentation.
 *
 * NOTICE: This wrapper is for App Router API routes. If you are looking to wrap Pages Router API routes use `wrapApiHandlerWithSentry` instead.
 */ // eslint-disable-next-line @typescript-eslint/no-explicit-any
function wrapRouteHandlerWithSentry(routeHandler, context) {
    const { method, parameterizedRoute, headers } = context;
    return new Proxy(routeHandler, {
        apply: async (originalFunction, thisArg, args)=>{
            const activeSpan = core.getActiveSpan();
            const rootSpan = activeSpan ? core.getRootSpan(activeSpan) : undefined;
            let edgeRuntimeIsolationScopeOverride;
            if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
            ;
            return core.withIsolationScope(("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : core.getIsolationScope(), ()=>{
                return core.withScope(async (scope)=>{
                    scope.setTransactionName(`${method} ${parameterizedRoute}`);
                    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
                    ;
                    const response = await core.handleCallbackErrors(()=>originalFunction.apply(thisArg, args), (error)=>{
                        // Next.js throws errors when calling `redirect()`. We don't wanna report these.
                        if (nextNavigationErrorUtils.isRedirectNavigationError(error)) ;
                        else if (nextNavigationErrorUtils.isNotFoundNavigationError(error)) {
                            if (activeSpan) {
                                core.setHttpStatus(activeSpan, 404);
                            }
                            if (rootSpan) {
                                core.setHttpStatus(rootSpan, 404);
                            }
                        } else {
                            core.captureException(error, {
                                mechanism: {
                                    handled: false,
                                    type: 'auto.function.nextjs.route_handler'
                                }
                            });
                        }
                    }, ()=>{
                        responseEnd.waitUntil(responseEnd.flushSafelyWithTimeout());
                    });
                    try {
                        if (response.status) {
                            if (activeSpan) {
                                core.setHttpStatus(activeSpan, response.status);
                            }
                            if (rootSpan) {
                                core.setHttpStatus(rootSpan, response.status);
                            }
                        }
                    } catch  {
                    // best effort - response may be undefined?
                    }
                    return response;
                });
            });
        }
    });
}
exports.wrapRouteHandlerWithSentry = wrapRouteHandlerWithSentry; //# sourceMappingURL=wrapRouteHandlerWithSentry.js.map
}),
"[project]/node_modules/@sentry/nextjs/build/cjs/common/pages-router-instrumentation/wrapApiHandlerWithSentryVercelCrons.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const core = __turbopack_context__.r("[project]/node_modules/@sentry/core/build/cjs/index.js [app-client] (ecmascript)");
/**
 * Wraps a function with Sentry crons instrumentation by automatically sending check-ins for the given Vercel crons config.
 */ // eslint-disable-next-line @typescript-eslint/no-explicit-any
function wrapApiHandlerWithSentryVercelCrons(handler, vercelCronsConfig) {
    return new Proxy(handler, {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        apply: (originalFunction, thisArg, args)=>{
            if (!args?.[0]) {
                return originalFunction.apply(thisArg, args);
            }
            const [req] = args;
            let maybePromiseResult;
            const cronsKey = 'nextUrl' in req ? req.nextUrl.pathname : req.url;
            const userAgentHeader = 'nextUrl' in req ? req.headers.get('user-agent') : req.headers['user-agent'];
            if (!vercelCronsConfig || // do nothing if vercel crons config is missing
            !userAgentHeader?.includes('vercel-cron') // do nothing if endpoint is not called from vercel crons
            ) {
                return originalFunction.apply(thisArg, args);
            }
            const vercelCron = vercelCronsConfig.find((vercelCron)=>vercelCron.path === cronsKey);
            if (!vercelCron?.path || !vercelCron.schedule) {
                return originalFunction.apply(thisArg, args);
            }
            const monitorSlug = vercelCron.path;
            const checkInId = core.captureCheckIn({
                monitorSlug,
                status: 'in_progress'
            }, {
                maxRuntime: 60 * 12,
                schedule: {
                    type: 'crontab',
                    value: vercelCron.schedule
                }
            });
            const startTime = Date.now() / 1000;
            const handleErrorCase = ()=>{
                core.captureCheckIn({
                    checkInId,
                    monitorSlug,
                    status: 'error',
                    duration: Date.now() / 1000 - startTime
                });
            };
            try {
                maybePromiseResult = originalFunction.apply(thisArg, args);
            } catch (e) {
                handleErrorCase();
                throw e;
            }
            if (typeof maybePromiseResult === 'object' && maybePromiseResult !== null && 'then' in maybePromiseResult) {
                Promise.resolve(maybePromiseResult).then(()=>{
                    core.captureCheckIn({
                        checkInId,
                        monitorSlug,
                        status: 'ok',
                        duration: Date.now() / 1000 - startTime
                    });
                }, ()=>{
                    handleErrorCase();
                });
                // It is very important that we return the original promise here, because Next.js attaches various properties
                // to that promise and will throw if they are not on the returned value.
                return maybePromiseResult;
            } else {
                core.captureCheckIn({
                    checkInId,
                    monitorSlug,
                    status: 'ok',
                    duration: Date.now() / 1000 - startTime
                });
                return maybePromiseResult;
            }
        }
    });
}
exports.wrapApiHandlerWithSentryVercelCrons = wrapApiHandlerWithSentryVercelCrons; //# sourceMappingURL=wrapApiHandlerWithSentryVercelCrons.js.map
}),
"[project]/node_modules/@sentry/nextjs/build/cjs/common/wrapMiddlewareWithSentry.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const core = __turbopack_context__.r("[project]/node_modules/@sentry/core/build/cjs/index.js [app-client] (ecmascript)");
const responseEnd = __turbopack_context__.r("[project]/node_modules/@sentry/nextjs/build/cjs/common/utils/responseEnd.js [app-client] (ecmascript)");
/**
 * Wraps Next.js middleware with Sentry error and performance instrumentation.
 *
 * @param middleware The middleware handler.
 * @returns a wrapped middleware handler.
 */ function wrapMiddlewareWithSentry(middleware) {
    return new Proxy(middleware, {
        apply: async (wrappingTarget, thisArg, args)=>{
            const tunnelRoute = '_sentryRewritesTunnelPath' in globalThis ? globalThis._sentryRewritesTunnelPath : undefined;
            if (tunnelRoute && typeof tunnelRoute === 'string') {
                const req = args[0];
                // Check if the current request matches the tunnel route
                if (req instanceof Request) {
                    const url = new URL(req.url);
                    const isTunnelRequest = url.pathname.startsWith(tunnelRoute);
                    if (isTunnelRequest) {
                        // Create a simple response that mimics NextResponse.next() so we don't need to import internals here
                        // which breaks next 13 apps
                        // https://github.com/vercel/next.js/blob/c12c9c1f78ad384270902f0890dc4cd341408105/packages/next/src/server/web/spec-extension/response.ts#L146
                        return new Response(null, {
                            status: 200,
                            headers: {
                                'x-middleware-next': '1'
                            }
                        });
                    }
                }
            }
            // TODO: We still should add central isolation scope creation for when our build-time instrumentation does not work anymore with turbopack.
            return core.withIsolationScope((isolationScope)=>{
                const req = args[0];
                const currentScope = core.getCurrentScope();
                let spanName;
                let spanSource;
                if (req instanceof Request) {
                    isolationScope.setSDKProcessingMetadata({
                        normalizedRequest: core.winterCGRequestToRequestData(req)
                    });
                    spanName = `middleware ${req.method}`;
                    spanSource = 'url';
                } else {
                    spanName = 'middleware';
                    spanSource = 'component';
                }
                currentScope.setTransactionName(spanName);
                const activeSpan = core.getActiveSpan();
                if (activeSpan) {
                    // If there is an active span, it likely means that the automatic Next.js OTEL instrumentation worked and we can
                    // rely on that for parameterization.
                    spanName = 'middleware';
                    spanSource = 'component';
                    const rootSpan = core.getRootSpan(activeSpan);
                    if (rootSpan) {
                        core.setCapturedScopesOnSpan(rootSpan, currentScope, isolationScope);
                    }
                }
                return core.startSpan({
                    name: spanName,
                    op: 'http.server.middleware',
                    attributes: {
                        [core.SEMANTIC_ATTRIBUTE_SENTRY_SOURCE]: spanSource,
                        [core.SEMANTIC_ATTRIBUTE_SENTRY_ORIGIN]: 'auto.function.nextjs.wrap_middleware'
                    }
                }, ()=>{
                    return core.handleCallbackErrors(()=>wrappingTarget.apply(thisArg, args), (error)=>{
                        core.captureException(error, {
                            mechanism: {
                                type: 'auto.function.nextjs.wrap_middleware',
                                handled: false
                            }
                        });
                    }, ()=>{
                        responseEnd.waitUntil(responseEnd.flushSafelyWithTimeout());
                    });
                });
            });
        }
    });
}
exports.wrapMiddlewareWithSentry = wrapMiddlewareWithSentry; //# sourceMappingURL=wrapMiddlewareWithSentry.js.map
}),
"[project]/node_modules/@sentry/nextjs/build/cjs/common/pages-router-instrumentation/wrapPageComponentWithSentry.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const core = __turbopack_context__.r("[project]/node_modules/@sentry/core/build/cjs/index.js [app-client] (ecmascript)");
function isReactClassComponent(target) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    return typeof target === 'function' && target?.prototype?.isReactComponent;
}
/**
 * Wraps a page component with Sentry error instrumentation.
 */ function wrapPageComponentWithSentry(pageComponent) {
    if (isReactClassComponent(pageComponent)) {
        return class SentryWrappedPageComponent extends pageComponent {
            render(...args) {
                return core.withIsolationScope(()=>{
                    const scope = core.getCurrentScope();
                    // We extract the sentry trace data that is put in the component props by datafetcher wrappers
                    const sentryTraceData = typeof this.props === 'object' && this.props !== null && '_sentryTraceData' in this.props && typeof this.props._sentryTraceData === 'string' ? this.props._sentryTraceData : undefined;
                    if (sentryTraceData) {
                        const traceparentData = core.extractTraceparentData(sentryTraceData);
                        scope.setContext('trace', {
                            span_id: traceparentData?.parentSpanId,
                            trace_id: traceparentData?.traceId
                        });
                    }
                    try {
                        return super.render(...args);
                    } catch (e) {
                        core.captureException(e, {
                            mechanism: {
                                handled: false,
                                type: 'auto.function.nextjs.page_class'
                            }
                        });
                        throw e;
                    }
                });
            }
        };
    } else if (typeof pageComponent === 'function') {
        return new Proxy(pageComponent, {
            apply (target, thisArg, argArray) {
                return core.withIsolationScope(()=>{
                    const scope = core.getCurrentScope();
                    // We extract the sentry trace data that is put in the component props by datafetcher wrappers
                    const sentryTraceData = argArray?.[0]?._sentryTraceData;
                    if (sentryTraceData) {
                        const traceparentData = core.extractTraceparentData(sentryTraceData);
                        scope.setContext('trace', {
                            span_id: traceparentData?.parentSpanId,
                            trace_id: traceparentData?.traceId
                        });
                    }
                    try {
                        return target.apply(thisArg, argArray);
                    } catch (e) {
                        core.captureException(e, {
                            mechanism: {
                                handled: false,
                                type: 'auto.function.nextjs.page_function'
                            }
                        });
                        throw e;
                    }
                });
            }
        });
    } else {
        return pageComponent;
    }
}
exports.wrapPageComponentWithSentry = wrapPageComponentWithSentry; //# sourceMappingURL=wrapPageComponentWithSentry.js.map
}),
"[project]/node_modules/@sentry/nextjs/build/cjs/common/wrapGenerationFunctionWithSentry.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const core = __turbopack_context__.r("[project]/node_modules/@sentry/core/build/cjs/index.js [app-client] (ecmascript)");
const nextNavigationErrorUtils = __turbopack_context__.r("[project]/node_modules/@sentry/nextjs/build/cjs/common/nextNavigationErrorUtils.js [app-client] (ecmascript)");
const spanAttributesWithLogicAttached = __turbopack_context__.r("[project]/node_modules/@sentry/nextjs/build/cjs/common/span-attributes-with-logic-attached.js [app-client] (ecmascript)");
const tracingUtils = __turbopack_context__.r("[project]/node_modules/@sentry/nextjs/build/cjs/common/utils/tracingUtils.js [app-client] (ecmascript)");
/**
 * Wraps a generation function (e.g. generateMetadata) with Sentry error and performance instrumentation.
 */ // eslint-disable-next-line @typescript-eslint/no-explicit-any
function wrapGenerationFunctionWithSentry(generationFunction, context) {
    const { requestAsyncStorage, componentRoute, componentType, generationFunctionIdentifier } = context;
    return new Proxy(generationFunction, {
        apply: (originalFunction, thisArg, args)=>{
            const requestTraceId = core.getActiveSpan()?.spanContext().traceId;
            let headers = undefined;
            // We try-catch here just in case anything goes wrong with the async storage here goes wrong since it is Next.js internal API
            try {
                headers = requestAsyncStorage?.getStore()?.headers;
            } catch  {
            /** empty */ }
            const isolationScope = tracingUtils.commonObjectToIsolationScope(headers);
            const activeSpan = core.getActiveSpan();
            if (activeSpan) {
                const rootSpan = core.getRootSpan(activeSpan);
                const { scope } = core.getCapturedScopesOnSpan(rootSpan);
                core.setCapturedScopesOnSpan(rootSpan, scope ?? new core.Scope(), isolationScope);
            }
            const headersDict = headers ? core.winterCGHeadersToDict(headers) : undefined;
            return core.withIsolationScope(isolationScope, ()=>{
                return core.withScope((scope)=>{
                    scope.setTransactionName(`${componentType}.${generationFunctionIdentifier} (${componentRoute})`);
                    isolationScope.setSDKProcessingMetadata({
                        normalizedRequest: {
                            headers: headersDict
                        }
                    });
                    const activeSpan = core.getActiveSpan();
                    if (activeSpan) {
                        const rootSpan = core.getRootSpan(activeSpan);
                        const sentryTrace = headersDict?.['sentry-trace'];
                        if (sentryTrace) {
                            rootSpan.setAttribute(spanAttributesWithLogicAttached.TRANSACTION_ATTR_SENTRY_TRACE_BACKFILL, sentryTrace);
                        }
                    }
                    const propagationContext = tracingUtils.commonObjectToPropagationContext(headers, core.propagationContextFromHeaders(headersDict?.['sentry-trace'], headersDict?.['baggage']));
                    if (requestTraceId) {
                        propagationContext.traceId = requestTraceId;
                    }
                    scope.setPropagationContext(propagationContext);
                    return core.startSpanManual({
                        op: 'function.nextjs',
                        name: `${componentType}.${generationFunctionIdentifier} (${componentRoute})`,
                        attributes: {
                            [core.SEMANTIC_ATTRIBUTE_SENTRY_SOURCE]: 'route',
                            [core.SEMANTIC_ATTRIBUTE_SENTRY_ORIGIN]: 'auto.function.nextjs',
                            'sentry.nextjs.ssr.function.type': generationFunctionIdentifier,
                            'sentry.nextjs.ssr.function.route': componentRoute
                        }
                    }, (span)=>{
                        return core.handleCallbackErrors(()=>originalFunction.apply(thisArg, args), (err)=>{
                            // When you read this code you might think: "Wait a minute, shouldn't we set the status on the root span too?"
                            // The answer is: "No." - The status of the root span is determined by whatever status code Next.js decides to put on the response.
                            if (nextNavigationErrorUtils.isNotFoundNavigationError(err)) {
                                // We don't want to report "not-found"s
                                span.setStatus({
                                    code: core.SPAN_STATUS_ERROR,
                                    message: 'not_found'
                                });
                                core.getRootSpan(span).setStatus({
                                    code: core.SPAN_STATUS_ERROR,
                                    message: 'not_found'
                                });
                            } else if (nextNavigationErrorUtils.isRedirectNavigationError(err)) {
                                // We don't want to report redirects
                                span.setStatus({
                                    code: core.SPAN_STATUS_OK
                                });
                            } else {
                                span.setStatus({
                                    code: core.SPAN_STATUS_ERROR,
                                    message: 'internal_error'
                                });
                                core.getRootSpan(span).setStatus({
                                    code: core.SPAN_STATUS_ERROR,
                                    message: 'internal_error'
                                });
                                core.captureException(err, {
                                    mechanism: {
                                        handled: false,
                                        type: 'auto.function.nextjs.generation_function',
                                        data: {
                                            function: generationFunctionIdentifier
                                        }
                                    }
                                });
                            }
                        }, ()=>{
                            span.end();
                        });
                    });
                });
            });
        }
    });
}
exports.wrapGenerationFunctionWithSentry = wrapGenerationFunctionWithSentry; //# sourceMappingURL=wrapGenerationFunctionWithSentry.js.map
}),
"[project]/node_modules/@sentry/nextjs/build/cjs/common/withServerActionInstrumentation.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const core = __turbopack_context__.r("[project]/node_modules/@sentry/core/build/cjs/index.js [app-client] (ecmascript)");
const responseEnd = __turbopack_context__.r("[project]/node_modules/@sentry/nextjs/build/cjs/common/utils/responseEnd.js [app-client] (ecmascript)");
const debugBuild = __turbopack_context__.r("[project]/node_modules/@sentry/nextjs/build/cjs/common/debug-build.js [app-client] (ecmascript)");
const nextNavigationErrorUtils = __turbopack_context__.r("[project]/node_modules/@sentry/nextjs/build/cjs/common/nextNavigationErrorUtils.js [app-client] (ecmascript)");
/**
 * Wraps a Next.js Server Action implementation with Sentry Error and Performance instrumentation.
 */ function withServerActionInstrumentation(...args) {
    if (typeof args[1] === 'function') {
        const [serverActionName, callback] = args;
        return withServerActionInstrumentationImplementation(serverActionName, {}, callback);
    } else {
        const [serverActionName, options, callback] = args;
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        return withServerActionInstrumentationImplementation(serverActionName, options, callback);
    }
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function withServerActionInstrumentationImplementation(serverActionName, options, callback) {
    return core.withIsolationScope(async (isolationScope)=>{
        const sendDefaultPii = core.getClient()?.getOptions().sendDefaultPii;
        let sentryTraceHeader;
        let baggageHeader;
        const fullHeadersObject = {};
        try {
            const awaitedHeaders = await options.headers;
            sentryTraceHeader = awaitedHeaders?.get('sentry-trace') ?? undefined;
            baggageHeader = awaitedHeaders?.get('baggage');
            awaitedHeaders?.forEach((value, key)=>{
                fullHeadersObject[key] = value;
            });
        } catch  {
            debugBuild.DEBUG_BUILD && core.debug.warn("Sentry wasn't able to extract the tracing headers for a server action. Will not trace this request.");
        }
        isolationScope.setTransactionName(`serverAction/${serverActionName}`);
        isolationScope.setSDKProcessingMetadata({
            normalizedRequest: {
                headers: fullHeadersObject
            }
        });
        // Normally, there is an active span here (from Next.js OTEL) and we just use that as parent
        // Else, we manually continueTrace from the incoming headers
        const continueTraceIfNoActiveSpan = core.getActiveSpan() ? (_opts, callback)=>callback() : core.continueTrace;
        return continueTraceIfNoActiveSpan({
            sentryTrace: sentryTraceHeader,
            baggage: baggageHeader
        }, async ()=>{
            try {
                return await core.startSpan({
                    op: 'function.server_action',
                    name: `serverAction/${serverActionName}`,
                    forceTransaction: true,
                    attributes: {
                        [core.SEMANTIC_ATTRIBUTE_SENTRY_SOURCE]: 'route',
                        [core.SEMANTIC_ATTRIBUTE_SENTRY_ORIGIN]: 'auto.function.nextjs.server_action'
                    }
                }, async (span)=>{
                    const result = await core.handleCallbackErrors(callback, (error)=>{
                        if (nextNavigationErrorUtils.isNotFoundNavigationError(error)) {
                            // We don't want to report "not-found"s
                            span.setStatus({
                                code: core.SPAN_STATUS_ERROR,
                                message: 'not_found'
                            });
                        } else if (nextNavigationErrorUtils.isRedirectNavigationError(error)) {
                        // Don't do anything for redirects
                        } else {
                            span.setStatus({
                                code: core.SPAN_STATUS_ERROR,
                                message: 'internal_error'
                            });
                            core.captureException(error, {
                                mechanism: {
                                    handled: false,
                                    type: 'auto.function.nextjs.server_action'
                                }
                            });
                        }
                    });
                    if (options.recordResponse !== undefined ? options.recordResponse : sendDefaultPii) {
                        core.getIsolationScope().setExtra('server_action_result', result);
                    }
                    if (options.formData) {
                        options.formData.forEach((value, key)=>{
                            core.getIsolationScope().setExtra(`server_action_form_data.${key}`, typeof value === 'string' ? value : '[non-string value]');
                        });
                    }
                    return result;
                });
            } finally{
                responseEnd.waitUntil(responseEnd.flushSafelyWithTimeout());
            }
        });
    });
}
exports.withServerActionInstrumentation = withServerActionInstrumentation; //# sourceMappingURL=withServerActionInstrumentation.js.map
}),
"[project]/node_modules/@sentry/nextjs/build/cjs/common/captureRequestError.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const core = __turbopack_context__.r("[project]/node_modules/@sentry/core/build/cjs/index.js [app-client] (ecmascript)");
const responseEnd = __turbopack_context__.r("[project]/node_modules/@sentry/nextjs/build/cjs/common/utils/responseEnd.js [app-client] (ecmascript)");
/**
 * Reports errors passed to the the Next.js `onRequestError` instrumentation hook.
 */ function captureRequestError(error, request, errorContext) {
    core.withScope((scope)=>{
        scope.setSDKProcessingMetadata({
            normalizedRequest: {
                headers: core.headersToDict(request.headers),
                method: request.method
            }
        });
        scope.setContext('nextjs', {
            request_path: request.path,
            router_kind: errorContext.routerKind,
            router_path: errorContext.routePath,
            route_type: errorContext.routeType
        });
        scope.setTransactionName(errorContext.routePath);
        core.captureException(error, {
            mechanism: {
                handled: false,
                type: 'auto.function.nextjs.on_request_error'
            }
        });
        responseEnd.waitUntil(responseEnd.flushSafelyWithTimeout());
    });
}
exports.captureRequestError = captureRequestError; //# sourceMappingURL=captureRequestError.js.map
}),
"[project]/node_modules/@sentry/nextjs/build/cjs/common/pages-router-instrumentation/_error.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const core = __turbopack_context__.r("[project]/node_modules/@sentry/core/build/cjs/index.js [app-client] (ecmascript)");
const responseEnd = __turbopack_context__.r("[project]/node_modules/@sentry/nextjs/build/cjs/common/utils/responseEnd.js [app-client] (ecmascript)");
/**
 * Capture the exception passed by nextjs to the `_error` page, adding context data as appropriate.
 *
 * @param contextOrProps The data passed to either `getInitialProps` or `render` by nextjs
 */ async function captureUnderscoreErrorException(contextOrProps) {
    const { req, res, err } = contextOrProps;
    // 404s (and other 400-y friends) can trigger `_error`, but we don't want to send them to Sentry
    const statusCode = res?.statusCode || contextOrProps.statusCode;
    if (statusCode && statusCode < 500) {
        return Promise.resolve();
    }
    // In previous versions of the suggested `_error.js` page in which this function is meant to be used, there was a
    // workaround for https://github.com/vercel/next.js/issues/8592 which involved an extra call to this function, in the
    // custom error component's `render` method, just in case it hadn't been called by `getInitialProps`. Now that that
    // issue has been fixed, the second call is unnecessary, but since it lives in user code rather than our code, users
    // have to be the ones to get rid of it, and guaraneteedly, not all of them will. So, rather than capture the error
    // twice, we just bail if we sense we're in that now-extraneous second call. (We can tell which function we're in
    // because Nextjs passes `pathname` to `getInitialProps` but not to `render`.)
    if (!contextOrProps.pathname) {
        return Promise.resolve();
    }
    core.withScope((scope)=>{
        if (req) {
            const normalizedRequest = core.httpRequestToRequestData(req);
            scope.setSDKProcessingMetadata({
                normalizedRequest
            });
        }
        // If third-party libraries (or users themselves) throw something falsy, we want to capture it as a message (which
        // is what passing a string to `captureException` will wind up doing)
        core.captureException(err || `_error.js called with falsy error (${err})`, {
            mechanism: {
                type: 'auto.function.nextjs.underscore_error',
                handled: false,
                data: {
                    function: '_error.getInitialProps'
                }
            }
        });
    });
    responseEnd.waitUntil(responseEnd.flushSafelyWithTimeout());
}
exports.captureUnderscoreErrorException = captureUnderscoreErrorException; //# sourceMappingURL=_error.js.map
}),
"[project]/node_modules/@sentry/nextjs/build/cjs/common/utils/isUseCacheFunction.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
// Vendored from: https://github.com/vercel/next.js/blob/canary/packages/next/src/lib/client-and-server-references.ts
function extractInfoFromServerReferenceId(id) {
    const infoByte = parseInt(id.slice(0, 2), 16);
    // eslint-disable-next-line no-bitwise
    const typeBit = infoByte >> 7 & 0x1;
    // eslint-disable-next-line no-bitwise
    const argMask = infoByte >> 1 & 0x3f;
    // eslint-disable-next-line no-bitwise
    const restArgs = infoByte & 0x1;
    const usedArgs = Array(6);
    for(let index = 0; index < 6; index++){
        const bitPosition = 5 - index;
        // eslint-disable-next-line no-bitwise
        const bit = argMask >> bitPosition & 0x1;
        usedArgs[index] = bit === 1;
    }
    return {
        type: typeBit === 1 ? 'use-cache' : 'server-action',
        usedArgs: usedArgs,
        hasRestArgs: restArgs === 1
    };
}
function isServerReference(value) {
    return value.$$typeof === Symbol.for('react.server.reference');
}
/**
 * Check if the function is a use cache function.
 *
 * @param value - The function to check.
 * @returns true if the function is a use cache function, false otherwise.
 */ function isUseCacheFunction(value) {
    if (!isServerReference(value)) {
        return false;
    }
    const { type } = extractInfoFromServerReferenceId(value.$$id);
    return type === 'use-cache';
}
exports.isUseCacheFunction = isUseCacheFunction; //# sourceMappingURL=isUseCacheFunction.js.map
}),
"[project]/node_modules/@sentry/nextjs/build/cjs/common/utils/nextSpan.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const core = __turbopack_context__.r("[project]/node_modules/@sentry/core/build/cjs/index.js [app-client] (ecmascript)");
const debugBuild = __turbopack_context__.r("[project]/node_modules/@sentry/nextjs/build/cjs/common/debug-build.js [app-client] (ecmascript)");
const isBuild = __turbopack_context__.r("[project]/node_modules/@sentry/nextjs/build/cjs/common/utils/isBuild.js [app-client] (ecmascript)");
const isUseCacheFunction = __turbopack_context__.r("[project]/node_modules/@sentry/nextjs/build/cjs/common/utils/isUseCacheFunction.js [app-client] (ecmascript)");
function shouldNoopSpan(callback) {
    const isBuildContext = isBuild.isBuild();
    const isUseCacheFunctionContext = callback ? isUseCacheFunction.isUseCacheFunction(callback) : false;
    if (isUseCacheFunctionContext) {
        debugBuild.DEBUG_BUILD && core.debug.log('Skipping span creation in Cache Components context');
    }
    return isBuildContext || isUseCacheFunctionContext;
}
function createNonRecordingSpan() {
    return new core.SentryNonRecordingSpan({
        traceId: '00000000000000000000000000000000',
        spanId: '0000000000000000'
    });
}
/**
 * Next.js-specific implementation of `startSpan` that skips span creation
 * in Cache Components contexts (which render at build time).
 *
 * When in a Cache Components context, we execute the callback with a non-recording span
 * and return early without creating an actual span, since spans don't make sense at build/cache time.
 *
 * @param options - Options for starting the span
 * @param callback - Callback function that receives the span
 * @returns The return value of the callback
 */ function startSpan(options, callback) {
    if (shouldNoopSpan(callback)) {
        return callback(createNonRecordingSpan());
    }
    return core.startSpan(options, callback);
}
/**
 *
 * When in a Cache Components context, we execute the callback with a non-recording span
 * and return early without creating an actual span, since spans don't make sense at build/cache time.
 *
 * @param options - Options for starting the span
 * @param callback - Callback function that receives the span and finish function
 * @returns The return value of the callback
 */ function startSpanManual(options, callback) {
    if (shouldNoopSpan(callback)) {
        const nonRecordingSpan = createNonRecordingSpan();
        return callback(nonRecordingSpan, ()=>nonRecordingSpan.end());
    }
    return core.startSpanManual(options, callback);
}
/**
 *
 * When in a Cache Components context, we return a non-recording span and return early
 * without creating an actual span, since spans don't make sense at build/cache time.
 *
 * @param options - Options for starting the span
 * @returns A non-recording span (in Cache Components context) or the created span
 */ function startInactiveSpan(options) {
    if (shouldNoopSpan()) {
        return createNonRecordingSpan();
    }
    return core.startInactiveSpan(options);
}
exports.startInactiveSpan = startInactiveSpan;
exports.startSpan = startSpan;
exports.startSpanManual = startSpanManual; //# sourceMappingURL=nextSpan.js.map
}),
"[project]/node_modules/@sentry/nextjs/build/cjs/client/index.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {

var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
"use client";
Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const core = __turbopack_context__.r("[project]/node_modules/@sentry/core/build/cjs/index.js [app-client] (ecmascript)");
const react = __turbopack_context__.r("[project]/node_modules/@sentry/react/build/cjs/index.js [app-client] (ecmascript)");
const devErrorSymbolicationEventProcessor = __turbopack_context__.r("[project]/node_modules/@sentry/nextjs/build/cjs/common/devErrorSymbolicationEventProcessor.js [app-client] (ecmascript)");
const getVercelEnv = __turbopack_context__.r("[project]/node_modules/@sentry/nextjs/build/cjs/common/getVercelEnv.js [app-client] (ecmascript)");
const nextNavigationErrorUtils = __turbopack_context__.r("[project]/node_modules/@sentry/nextjs/build/cjs/common/nextNavigationErrorUtils.js [app-client] (ecmascript)");
const browserTracingIntegration = __turbopack_context__.r("[project]/node_modules/@sentry/nextjs/build/cjs/client/browserTracingIntegration.js [app-client] (ecmascript)");
const clientNormalizationIntegration = __turbopack_context__.r("[project]/node_modules/@sentry/nextjs/build/cjs/client/clientNormalizationIntegration.js [app-client] (ecmascript)");
const appRouterRoutingInstrumentation = __turbopack_context__.r("[project]/node_modules/@sentry/nextjs/build/cjs/client/routing/appRouterRoutingInstrumentation.js [app-client] (ecmascript)");
const isrRoutingTracing = __turbopack_context__.r("[project]/node_modules/@sentry/nextjs/build/cjs/client/routing/isrRoutingTracing.js [app-client] (ecmascript)");
const tunnelRoute = __turbopack_context__.r("[project]/node_modules/@sentry/nextjs/build/cjs/client/tunnelRoute.js [app-client] (ecmascript)");
const wrapGetStaticPropsWithSentry = __turbopack_context__.r("[project]/node_modules/@sentry/nextjs/build/cjs/common/pages-router-instrumentation/wrapGetStaticPropsWithSentry.js [app-client] (ecmascript)");
const wrapGetInitialPropsWithSentry = __turbopack_context__.r("[project]/node_modules/@sentry/nextjs/build/cjs/common/pages-router-instrumentation/wrapGetInitialPropsWithSentry.js [app-client] (ecmascript)");
const wrapAppGetInitialPropsWithSentry = __turbopack_context__.r("[project]/node_modules/@sentry/nextjs/build/cjs/common/pages-router-instrumentation/wrapAppGetInitialPropsWithSentry.js [app-client] (ecmascript)");
const wrapDocumentGetInitialPropsWithSentry = __turbopack_context__.r("[project]/node_modules/@sentry/nextjs/build/cjs/common/pages-router-instrumentation/wrapDocumentGetInitialPropsWithSentry.js [app-client] (ecmascript)");
const wrapErrorGetInitialPropsWithSentry = __turbopack_context__.r("[project]/node_modules/@sentry/nextjs/build/cjs/common/pages-router-instrumentation/wrapErrorGetInitialPropsWithSentry.js [app-client] (ecmascript)");
const wrapGetServerSidePropsWithSentry = __turbopack_context__.r("[project]/node_modules/@sentry/nextjs/build/cjs/common/pages-router-instrumentation/wrapGetServerSidePropsWithSentry.js [app-client] (ecmascript)");
const wrapServerComponentWithSentry = __turbopack_context__.r("[project]/node_modules/@sentry/nextjs/build/cjs/common/wrapServerComponentWithSentry.js [app-client] (ecmascript)");
const wrapRouteHandlerWithSentry = __turbopack_context__.r("[project]/node_modules/@sentry/nextjs/build/cjs/common/wrapRouteHandlerWithSentry.js [app-client] (ecmascript)");
const wrapApiHandlerWithSentryVercelCrons = __turbopack_context__.r("[project]/node_modules/@sentry/nextjs/build/cjs/common/pages-router-instrumentation/wrapApiHandlerWithSentryVercelCrons.js [app-client] (ecmascript)");
const wrapMiddlewareWithSentry = __turbopack_context__.r("[project]/node_modules/@sentry/nextjs/build/cjs/common/wrapMiddlewareWithSentry.js [app-client] (ecmascript)");
const wrapPageComponentWithSentry = __turbopack_context__.r("[project]/node_modules/@sentry/nextjs/build/cjs/common/pages-router-instrumentation/wrapPageComponentWithSentry.js [app-client] (ecmascript)");
const wrapGenerationFunctionWithSentry = __turbopack_context__.r("[project]/node_modules/@sentry/nextjs/build/cjs/common/wrapGenerationFunctionWithSentry.js [app-client] (ecmascript)");
const withServerActionInstrumentation = __turbopack_context__.r("[project]/node_modules/@sentry/nextjs/build/cjs/common/withServerActionInstrumentation.js [app-client] (ecmascript)");
const captureRequestError = __turbopack_context__.r("[project]/node_modules/@sentry/nextjs/build/cjs/common/captureRequestError.js [app-client] (ecmascript)");
const _error = __turbopack_context__.r("[project]/node_modules/@sentry/nextjs/build/cjs/common/pages-router-instrumentation/_error.js [app-client] (ecmascript)");
const nextSpan = __turbopack_context__.r("[project]/node_modules/@sentry/nextjs/build/cjs/common/utils/nextSpan.js [app-client] (ecmascript)");
let clientIsInitialized = false;
const globalWithInjectedValues = core.GLOBAL_OBJ;
// Treeshakable guard to remove all code related to tracing
/** Inits the Sentry NextJS SDK on the browser with the React SDK. */ function init(options) {
    if (clientIsInitialized) {
        core.consoleSandbox(()=>{
            // eslint-disable-next-line no-console
            console.warn('[@sentry/nextjs] You are calling `Sentry.init()` more than once on the client. This can happen if you have both a `sentry.client.config.ts` and a `instrumentation-client.ts` file with `Sentry.init()` calls. It is recommended to call `Sentry.init()` once in `instrumentation-client.ts`.');
        });
    }
    clientIsInitialized = true;
    // Remove cached trace meta tags for ISR/SSG pages before initializing
    // This prevents the browser tracing integration from using stale trace IDs
    if (typeof __SENTRY_TRACING__ === 'undefined' || __SENTRY_TRACING__) {
        isrRoutingTracing.removeIsrSsgTraceMetaTags();
    }
    const opts = {
        environment: getVercelEnv.getVercelEnv(true) || ("TURBOPACK compile-time value", "development"),
        defaultIntegrations: getDefaultIntegrations(options),
        release: ("TURBOPACK compile-time value", "9be295abfd55d60008ceea23903cef096a584ead") || globalWithInjectedValues._sentryRelease,
        ...options
    };
    tunnelRoute.applyTunnelRouteOption(opts);
    core.applySdkMetadata(opts, 'nextjs', [
        'nextjs',
        'react'
    ]);
    const client = react.init(opts);
    const filterTransactions = (event)=>event.type === 'transaction' && event.transaction === '/404' ? null : event;
    filterTransactions.id = 'NextClient404Filter';
    core.addEventProcessor(filterTransactions);
    const filterIncompleteNavigationTransactions = (event)=>event.type === 'transaction' && event.transaction === appRouterRoutingInstrumentation.INCOMPLETE_APP_ROUTER_INSTRUMENTATION_TRANSACTION_NAME ? null : event;
    filterIncompleteNavigationTransactions.id = 'IncompleteTransactionFilter';
    core.addEventProcessor(filterIncompleteNavigationTransactions);
    const filterNextRedirectError = (event, hint)=>nextNavigationErrorUtils.isRedirectNavigationError(hint?.originalException) || event.exception?.values?.[0]?.value === 'NEXT_REDIRECT' ? null : event;
    filterNextRedirectError.id = 'NextRedirectErrorFilter';
    core.addEventProcessor(filterNextRedirectError);
    if ("TURBOPACK compile-time truthy", 1) {
        core.addEventProcessor(devErrorSymbolicationEventProcessor.devErrorSymbolicationEventProcessor);
    }
    try {
        // @ts-expect-error `process.turbopack` is a magic string that will be replaced by Next.js
        if ("TURBOPACK compile-time truthy", 1) {
            core.getGlobalScope().setTag('turbopack', true);
        }
    } catch  {
    // Noop
    // The statement above can throw because process is not defined on the client
    }
    return client;
}
function getDefaultIntegrations(options) {
    const customDefaultIntegrations = react.getDefaultIntegrations(options);
    // This evaluates to true unless __SENTRY_TRACING__ is text-replaced with "false",
    // in which case everything inside will get tree-shaken away
    if (typeof __SENTRY_TRACING__ === 'undefined' || __SENTRY_TRACING__) {
        customDefaultIntegrations.push(browserTracingIntegration.browserTracingIntegration());
    }
    // These values are injected at build time, based on the output directory specified in the build config. Though a default
    // is set there, we set it here as well, just in case something has gone wrong with the injection.
    const rewriteFramesAssetPrefixPath = ("TURBOPACK compile-time value", "") || globalWithInjectedValues._sentryRewriteFramesAssetPrefixPath || '';
    const assetPrefix = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env._sentryAssetPrefix || globalWithInjectedValues._sentryAssetPrefix;
    const basePath = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env._sentryBasePath || globalWithInjectedValues._sentryBasePath;
    const experimentalThirdPartyOriginStackFrames = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env._experimentalThirdPartyOriginStackFrames === 'true' || globalWithInjectedValues._experimentalThirdPartyOriginStackFrames === 'true';
    customDefaultIntegrations.push(clientNormalizationIntegration.nextjsClientStackFrameNormalizationIntegration({
        assetPrefix,
        basePath,
        rewriteFramesAssetPrefixPath,
        experimentalThirdPartyOriginStackFrames
    }));
    return customDefaultIntegrations;
}
/**
 * Just a passthrough in case this is imported from the client.
 */ function withSentryConfig(exportedUserNextConfig) {
    return exportedUserNextConfig;
}
exports.browserTracingIntegration = browserTracingIntegration.browserTracingIntegration;
exports.captureRouterTransitionStart = appRouterRoutingInstrumentation.captureRouterTransitionStart;
exports.wrapGetStaticPropsWithSentry = wrapGetStaticPropsWithSentry.wrapGetStaticPropsWithSentry;
exports.wrapGetInitialPropsWithSentry = wrapGetInitialPropsWithSentry.wrapGetInitialPropsWithSentry;
exports.wrapAppGetInitialPropsWithSentry = wrapAppGetInitialPropsWithSentry.wrapAppGetInitialPropsWithSentry;
exports.wrapDocumentGetInitialPropsWithSentry = wrapDocumentGetInitialPropsWithSentry.wrapDocumentGetInitialPropsWithSentry;
exports.wrapErrorGetInitialPropsWithSentry = wrapErrorGetInitialPropsWithSentry.wrapErrorGetInitialPropsWithSentry;
exports.wrapGetServerSidePropsWithSentry = wrapGetServerSidePropsWithSentry.wrapGetServerSidePropsWithSentry;
exports.wrapServerComponentWithSentry = wrapServerComponentWithSentry.wrapServerComponentWithSentry;
exports.wrapRouteHandlerWithSentry = wrapRouteHandlerWithSentry.wrapRouteHandlerWithSentry;
exports.wrapApiHandlerWithSentryVercelCrons = wrapApiHandlerWithSentryVercelCrons.wrapApiHandlerWithSentryVercelCrons;
exports.wrapMiddlewareWithSentry = wrapMiddlewareWithSentry.wrapMiddlewareWithSentry;
exports.wrapPageComponentWithSentry = wrapPageComponentWithSentry.wrapPageComponentWithSentry;
exports.wrapGenerationFunctionWithSentry = wrapGenerationFunctionWithSentry.wrapGenerationFunctionWithSentry;
exports.withServerActionInstrumentation = withServerActionInstrumentation.withServerActionInstrumentation;
exports.captureRequestError = captureRequestError.captureRequestError;
exports.captureUnderscoreErrorException = _error.captureUnderscoreErrorException;
exports.startInactiveSpan = nextSpan.startInactiveSpan;
exports.startSpan = nextSpan.startSpan;
exports.startSpanManual = nextSpan.startSpanManual;
exports.init = init;
exports.withSentryConfig = withSentryConfig;
Object.prototype.hasOwnProperty.call(react, '__proto__') && !Object.prototype.hasOwnProperty.call(exports, '__proto__') && Object.defineProperty(exports, '__proto__', {
    enumerable: true,
    value: react['__proto__']
});
Object.keys(react).forEach((k)=>{
    if (k !== 'default' && !Object.prototype.hasOwnProperty.call(exports, k)) exports[k] = react[k];
}); //# sourceMappingURL=index.js.map
}),
"[project]/node_modules/@sentry/nextjs/build/cjs/index.client.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const index = __turbopack_context__.r("[project]/node_modules/@sentry/nextjs/build/cjs/client/index.js [app-client] (ecmascript)");
const _error = __turbopack_context__.r("[project]/node_modules/@sentry/nextjs/build/cjs/common/pages-router-instrumentation/_error.js [app-client] (ecmascript)");
const nextSpan = __turbopack_context__.r("[project]/node_modules/@sentry/nextjs/build/cjs/common/utils/nextSpan.js [app-client] (ecmascript)");
const browserTracingIntegration = __turbopack_context__.r("[project]/node_modules/@sentry/nextjs/build/cjs/client/browserTracingIntegration.js [app-client] (ecmascript)");
const appRouterRoutingInstrumentation = __turbopack_context__.r("[project]/node_modules/@sentry/nextjs/build/cjs/client/routing/appRouterRoutingInstrumentation.js [app-client] (ecmascript)");
const wrapGetStaticPropsWithSentry = __turbopack_context__.r("[project]/node_modules/@sentry/nextjs/build/cjs/common/pages-router-instrumentation/wrapGetStaticPropsWithSentry.js [app-client] (ecmascript)");
const wrapGetInitialPropsWithSentry = __turbopack_context__.r("[project]/node_modules/@sentry/nextjs/build/cjs/common/pages-router-instrumentation/wrapGetInitialPropsWithSentry.js [app-client] (ecmascript)");
const wrapAppGetInitialPropsWithSentry = __turbopack_context__.r("[project]/node_modules/@sentry/nextjs/build/cjs/common/pages-router-instrumentation/wrapAppGetInitialPropsWithSentry.js [app-client] (ecmascript)");
const wrapDocumentGetInitialPropsWithSentry = __turbopack_context__.r("[project]/node_modules/@sentry/nextjs/build/cjs/common/pages-router-instrumentation/wrapDocumentGetInitialPropsWithSentry.js [app-client] (ecmascript)");
const wrapErrorGetInitialPropsWithSentry = __turbopack_context__.r("[project]/node_modules/@sentry/nextjs/build/cjs/common/pages-router-instrumentation/wrapErrorGetInitialPropsWithSentry.js [app-client] (ecmascript)");
const wrapGetServerSidePropsWithSentry = __turbopack_context__.r("[project]/node_modules/@sentry/nextjs/build/cjs/common/pages-router-instrumentation/wrapGetServerSidePropsWithSentry.js [app-client] (ecmascript)");
const wrapServerComponentWithSentry = __turbopack_context__.r("[project]/node_modules/@sentry/nextjs/build/cjs/common/wrapServerComponentWithSentry.js [app-client] (ecmascript)");
const wrapRouteHandlerWithSentry = __turbopack_context__.r("[project]/node_modules/@sentry/nextjs/build/cjs/common/wrapRouteHandlerWithSentry.js [app-client] (ecmascript)");
const wrapApiHandlerWithSentryVercelCrons = __turbopack_context__.r("[project]/node_modules/@sentry/nextjs/build/cjs/common/pages-router-instrumentation/wrapApiHandlerWithSentryVercelCrons.js [app-client] (ecmascript)");
const wrapMiddlewareWithSentry = __turbopack_context__.r("[project]/node_modules/@sentry/nextjs/build/cjs/common/wrapMiddlewareWithSentry.js [app-client] (ecmascript)");
const wrapPageComponentWithSentry = __turbopack_context__.r("[project]/node_modules/@sentry/nextjs/build/cjs/common/pages-router-instrumentation/wrapPageComponentWithSentry.js [app-client] (ecmascript)");
const wrapGenerationFunctionWithSentry = __turbopack_context__.r("[project]/node_modules/@sentry/nextjs/build/cjs/common/wrapGenerationFunctionWithSentry.js [app-client] (ecmascript)");
const withServerActionInstrumentation = __turbopack_context__.r("[project]/node_modules/@sentry/nextjs/build/cjs/common/withServerActionInstrumentation.js [app-client] (ecmascript)");
const captureRequestError = __turbopack_context__.r("[project]/node_modules/@sentry/nextjs/build/cjs/common/captureRequestError.js [app-client] (ecmascript)");
const react = __turbopack_context__.r("[project]/node_modules/@sentry/react/build/cjs/index.js [app-client] (ecmascript)");
exports.init = index.init;
exports.withSentryConfig = index.withSentryConfig;
exports.captureUnderscoreErrorException = _error.captureUnderscoreErrorException;
exports.startInactiveSpan = nextSpan.startInactiveSpan;
exports.startSpan = nextSpan.startSpan;
exports.startSpanManual = nextSpan.startSpanManual;
exports.browserTracingIntegration = browserTracingIntegration.browserTracingIntegration;
exports.captureRouterTransitionStart = appRouterRoutingInstrumentation.captureRouterTransitionStart;
exports.wrapGetStaticPropsWithSentry = wrapGetStaticPropsWithSentry.wrapGetStaticPropsWithSentry;
exports.wrapGetInitialPropsWithSentry = wrapGetInitialPropsWithSentry.wrapGetInitialPropsWithSentry;
exports.wrapAppGetInitialPropsWithSentry = wrapAppGetInitialPropsWithSentry.wrapAppGetInitialPropsWithSentry;
exports.wrapDocumentGetInitialPropsWithSentry = wrapDocumentGetInitialPropsWithSentry.wrapDocumentGetInitialPropsWithSentry;
exports.wrapErrorGetInitialPropsWithSentry = wrapErrorGetInitialPropsWithSentry.wrapErrorGetInitialPropsWithSentry;
exports.wrapGetServerSidePropsWithSentry = wrapGetServerSidePropsWithSentry.wrapGetServerSidePropsWithSentry;
exports.wrapServerComponentWithSentry = wrapServerComponentWithSentry.wrapServerComponentWithSentry;
exports.wrapRouteHandlerWithSentry = wrapRouteHandlerWithSentry.wrapRouteHandlerWithSentry;
exports.wrapApiHandlerWithSentryVercelCrons = wrapApiHandlerWithSentryVercelCrons.wrapApiHandlerWithSentryVercelCrons;
exports.wrapMiddlewareWithSentry = wrapMiddlewareWithSentry.wrapMiddlewareWithSentry;
exports.wrapPageComponentWithSentry = wrapPageComponentWithSentry.wrapPageComponentWithSentry;
exports.wrapGenerationFunctionWithSentry = wrapGenerationFunctionWithSentry.wrapGenerationFunctionWithSentry;
exports.withServerActionInstrumentation = withServerActionInstrumentation.withServerActionInstrumentation;
exports.captureRequestError = captureRequestError.captureRequestError;
Object.prototype.hasOwnProperty.call(react, '__proto__') && !Object.prototype.hasOwnProperty.call(exports, '__proto__') && Object.defineProperty(exports, '__proto__', {
    enumerable: true,
    value: react['__proto__']
});
Object.keys(react).forEach((k)=>{
    if (k !== 'default' && !Object.prototype.hasOwnProperty.call(exports, k)) exports[k] = react[k];
}); //# sourceMappingURL=index.client.js.map
}),
]);

//# debugId=04ecf328-eed9-57e4-6b19-8d0609bf2f73
//# sourceMappingURL=node_modules_%40sentry_nextjs_build_cjs_f98684cb._.js.map
;!function(){try { var e="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof global?global:"undefined"!=typeof window?window:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&((e._debugIds|| (e._debugIds={}))[n]="ea8d426d-8960-4844-d9be-41253f792205")}catch(e){}}();
(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/node_modules/@sentry/browser/build/npm/cjs/dev/helpers.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const core = __turbopack_context__.r("[project]/node_modules/@sentry/core/build/cjs/index.js [app-client] (ecmascript)");
const WINDOW = core.GLOBAL_OBJ;
let ignoreOnError = 0;
/**
 * @hidden
 */ function shouldIgnoreOnError() {
    return ignoreOnError > 0;
}
/**
 * @hidden
 */ function ignoreNextOnError() {
    // onerror should trigger before setTimeout
    ignoreOnError++;
    setTimeout(()=>{
        ignoreOnError--;
    });
}
// eslint-disable-next-line @typescript-eslint/ban-types
/**
 * Instruments the given function and sends an event to Sentry every time the
 * function throws an exception.
 *
 * @param fn A function to wrap. It is generally safe to pass an unbound function, because the returned wrapper always
 * has a correct `this` context.
 * @returns The wrapped function.
 * @hidden
 */ function wrap(fn, options = {}) {
    // for future readers what this does is wrap a function and then create
    // a bi-directional wrapping between them.
    //
    // example: wrapped = wrap(original);
    //  original.__sentry_wrapped__ -> wrapped
    //  wrapped.__sentry_original__ -> original
    function isFunction(fn) {
        return typeof fn === 'function';
    }
    if (!isFunction(fn)) {
        return fn;
    }
    try {
        // if we're dealing with a function that was previously wrapped, return
        // the original wrapper.
        const wrapper = fn.__sentry_wrapped__;
        if (wrapper) {
            if (typeof wrapper === 'function') {
                return wrapper;
            } else {
                // If we find that the `__sentry_wrapped__` function is not a function at the time of accessing it, it means
                // that something messed with it. In that case we want to return the originally passed function.
                return fn;
            }
        }
        // We don't wanna wrap it twice
        if (core.getOriginalFunction(fn)) {
            return fn;
        }
    } catch  {
        // Just accessing custom props in some Selenium environments
        // can cause a "Permission denied" exception (see raven-js#495).
        // Bail on wrapping and return the function as-is (defers to window.onerror).
        return fn;
    }
    // Wrap the function itself
    // It is important that `sentryWrapped` is not an arrow function to preserve the context of `this`
    const sentryWrapped = function(...args) {
        try {
            // Also wrap arguments that are themselves functions
            const wrappedArguments = args.map((arg)=>wrap(arg, options));
            // Attempt to invoke user-land function
            // NOTE: If you are a Sentry user, and you are seeing this stack frame, it
            //       means the sentry.javascript SDK caught an error invoking your application code. This
            //       is expected behavior and NOT indicative of a bug with sentry.javascript.
            return fn.apply(this, wrappedArguments);
        } catch (ex) {
            ignoreNextOnError();
            core.withScope((scope)=>{
                scope.addEventProcessor((event)=>{
                    if (options.mechanism) {
                        core.addExceptionTypeValue(event, undefined, undefined);
                        core.addExceptionMechanism(event, options.mechanism);
                    }
                    event.extra = {
                        ...event.extra,
                        arguments: args
                    };
                    return event;
                });
                // no need to add a mechanism here, we already add it via an event processor above
                core.captureException(ex);
            });
            throw ex;
        }
    };
    // Wrap the wrapped function in a proxy, to ensure any other properties of the original function remain available
    try {
        for(const property in fn){
            if (Object.prototype.hasOwnProperty.call(fn, property)) {
                sentryWrapped[property] = fn[property];
            }
        }
    } catch  {
    // Accessing some objects may throw
    // ref: https://github.com/getsentry/sentry-javascript/issues/1168
    }
    // Signal that this function has been wrapped/filled already
    // for both debugging and to prevent it to being wrapped/filled twice
    core.markFunctionWrapped(sentryWrapped, fn);
    core.addNonEnumerableProperty(fn, '__sentry_wrapped__', sentryWrapped);
    // Restore original function name (not all browsers allow that)
    try {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const descriptor = Object.getOwnPropertyDescriptor(sentryWrapped, 'name');
        if (descriptor.configurable) {
            Object.defineProperty(sentryWrapped, 'name', {
                get () {
                    return fn.name;
                }
            });
        }
    } catch  {
    // This may throw if e.g. the descriptor does not exist, or a browser does not allow redefining `name`.
    // to save some bytes we simply try-catch this
    }
    return sentryWrapped;
}
/**
 * Get HTTP request data from the current page.
 */ function getHttpRequestData() {
    // grab as much info as exists and add it to the event
    const url = core.getLocationHref();
    const { referrer } = WINDOW.document || {};
    const { userAgent } = WINDOW.navigator || {};
    const headers = {
        ...referrer && {
            Referer: referrer
        },
        ...userAgent && {
            'User-Agent': userAgent
        }
    };
    const request = {
        url,
        headers
    };
    return request;
}
exports.WINDOW = WINDOW;
exports.getHttpRequestData = getHttpRequestData;
exports.ignoreNextOnError = ignoreNextOnError;
exports.shouldIgnoreOnError = shouldIgnoreOnError;
exports.wrap = wrap; //# sourceMappingURL=helpers.js.map
}),
"[project]/node_modules/@sentry/browser/build/npm/cjs/dev/utils/lazyLoadIntegration.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const core = __turbopack_context__.r("[project]/node_modules/@sentry/core/build/cjs/index.js [app-client] (ecmascript)");
const helpers = __turbopack_context__.r("[project]/node_modules/@sentry/browser/build/npm/cjs/dev/helpers.js [app-client] (ecmascript)");
// This is a map of integration function method to bundle file name.
const LazyLoadableIntegrations = {
    replayIntegration: 'replay',
    replayCanvasIntegration: 'replay-canvas',
    feedbackIntegration: 'feedback',
    feedbackModalIntegration: 'feedback-modal',
    feedbackScreenshotIntegration: 'feedback-screenshot',
    captureConsoleIntegration: 'captureconsole',
    contextLinesIntegration: 'contextlines',
    linkedErrorsIntegration: 'linkederrors',
    dedupeIntegration: 'dedupe',
    extraErrorDataIntegration: 'extraerrordata',
    graphqlClientIntegration: 'graphqlclient',
    httpClientIntegration: 'httpclient',
    reportingObserverIntegration: 'reportingobserver',
    rewriteFramesIntegration: 'rewriteframes',
    browserProfilingIntegration: 'browserprofiling',
    moduleMetadataIntegration: 'modulemetadata',
    instrumentAnthropicAiClient: 'instrumentanthropicaiclient',
    instrumentOpenAiClient: 'instrumentopenaiclient',
    instrumentGoogleGenAIClient: 'instrumentgooglegenaiclient',
    instrumentLangGraph: 'instrumentlanggraph',
    createLangChainCallbackHandler: 'createlangchaincallbackhandler'
};
const WindowWithMaybeIntegration = helpers.WINDOW;
/**
 * Lazy load an integration from the CDN.
 * Rejects if the integration cannot be loaded.
 */ async function lazyLoadIntegration(name, scriptNonce) {
    const bundle = LazyLoadableIntegrations[name];
    // `window.Sentry` is only set when using a CDN bundle, but this method can also be used via the NPM package
    const sentryOnWindow = WindowWithMaybeIntegration.Sentry = WindowWithMaybeIntegration.Sentry || {};
    if (!bundle) {
        throw new Error(`Cannot lazy load integration: ${name}`);
    }
    // Bail if the integration already exists
    const existing = sentryOnWindow[name];
    // The `feedbackIntegration` is loaded by default in the CDN bundles,
    // so we need to differentiate between the real integration and the shim.
    // if only the shim exists, we still want to lazy load the real integration.
    if (typeof existing === 'function' && !('_isShim' in existing)) {
        return existing;
    }
    const url = getScriptURL(bundle);
    const script = helpers.WINDOW.document.createElement('script');
    script.src = url;
    script.crossOrigin = 'anonymous';
    script.referrerPolicy = 'strict-origin';
    if (scriptNonce) {
        script.setAttribute('nonce', scriptNonce);
    }
    const waitForLoad = new Promise((resolve, reject)=>{
        script.addEventListener('load', ()=>resolve());
        script.addEventListener('error', reject);
    });
    const currentScript = helpers.WINDOW.document.currentScript;
    const parent = helpers.WINDOW.document.body || helpers.WINDOW.document.head || currentScript?.parentElement;
    if (parent) {
        parent.appendChild(script);
    } else {
        throw new Error(`Could not find parent element to insert lazy-loaded ${name} script`);
    }
    try {
        await waitForLoad;
    } catch  {
        throw new Error(`Error when loading integration: ${name}`);
    }
    const integrationFn = sentryOnWindow[name];
    if (typeof integrationFn !== 'function') {
        throw new Error(`Could not load integration: ${name}`);
    }
    return integrationFn;
}
function getScriptURL(bundle) {
    const client = core.getClient();
    const baseURL = client?.getOptions()?.cdnBaseUrl || 'https://browser.sentry-cdn.com';
    return new URL(`/${core.SDK_VERSION}/${bundle}.min.js`, baseURL).toString();
}
exports.lazyLoadIntegration = lazyLoadIntegration; //# sourceMappingURL=lazyLoadIntegration.js.map
}),
"[project]/node_modules/@sentry/browser/build/npm/cjs/dev/feedbackAsync.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const feedback = __turbopack_context__.r("[project]/node_modules/@sentry-internal/feedback/build/npm/cjs/index.js [app-client] (ecmascript)");
const lazyLoadIntegration = __turbopack_context__.r("[project]/node_modules/@sentry/browser/build/npm/cjs/dev/utils/lazyLoadIntegration.js [app-client] (ecmascript)");
/**
 * An integration to add user feedback to your application,
 * while loading most of the code lazily only when it's needed.
 */ const feedbackAsyncIntegration = feedback.buildFeedbackIntegration({
    lazyLoadIntegration: lazyLoadIntegration.lazyLoadIntegration
});
exports.feedbackAsyncIntegration = feedbackAsyncIntegration; //# sourceMappingURL=feedbackAsync.js.map
}),
"[project]/node_modules/@sentry/browser/build/npm/cjs/dev/feedbackSync.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const feedback = __turbopack_context__.r("[project]/node_modules/@sentry-internal/feedback/build/npm/cjs/index.js [app-client] (ecmascript)");
/** Add a widget to capture user feedback to your application. */ const feedbackSyncIntegration = feedback.buildFeedbackIntegration({
    getModalIntegration: ()=>feedback.feedbackModalIntegration,
    getScreenshotIntegration: ()=>feedback.feedbackScreenshotIntegration
});
exports.feedbackSyncIntegration = feedbackSyncIntegration; //# sourceMappingURL=feedbackSync.js.map
}),
"[project]/node_modules/@sentry/browser/build/npm/cjs/dev/eventbuilder.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const core = __turbopack_context__.r("[project]/node_modules/@sentry/core/build/cjs/index.js [app-client] (ecmascript)");
/**
 * This function creates an exception from a JavaScript Error
 */ function exceptionFromError(stackParser, ex) {
    // Get the frames first since Opera can lose the stack if we touch anything else first
    const frames = parseStackFrames(stackParser, ex);
    const exception = {
        type: extractType(ex),
        value: extractMessage(ex)
    };
    if (frames.length) {
        exception.stacktrace = {
            frames
        };
    }
    if (exception.type === undefined && exception.value === '') {
        exception.value = 'Unrecoverable error caught';
    }
    return exception;
}
function eventFromPlainObject(stackParser, exception, syntheticException, isUnhandledRejection) {
    const client = core.getClient();
    const normalizeDepth = client?.getOptions().normalizeDepth;
    // If we can, we extract an exception from the object properties
    const errorFromProp = getErrorPropertyFromObject(exception);
    const extra = {
        __serialized__: core.normalizeToSize(exception, normalizeDepth)
    };
    if (errorFromProp) {
        return {
            exception: {
                values: [
                    exceptionFromError(stackParser, errorFromProp)
                ]
            },
            extra
        };
    }
    const event = {
        exception: {
            values: [
                {
                    type: core.isEvent(exception) ? exception.constructor.name : isUnhandledRejection ? 'UnhandledRejection' : 'Error',
                    value: getNonErrorObjectExceptionValue(exception, {
                        isUnhandledRejection
                    })
                }
            ]
        },
        extra
    };
    if (syntheticException) {
        const frames = parseStackFrames(stackParser, syntheticException);
        if (frames.length) {
            // event.exception.values[0] has been set above
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            event.exception.values[0].stacktrace = {
                frames
            };
        }
    }
    return event;
}
function eventFromError(stackParser, ex) {
    return {
        exception: {
            values: [
                exceptionFromError(stackParser, ex)
            ]
        }
    };
}
/** Parses stack frames from an error */ function parseStackFrames(stackParser, ex) {
    // Access and store the stacktrace property before doing ANYTHING
    // else to it because Opera is not very good at providing it
    // reliably in other circumstances.
    const stacktrace = ex.stacktrace || ex.stack || '';
    const skipLines = getSkipFirstStackStringLines(ex);
    const framesToPop = getPopFirstTopFrames(ex);
    try {
        return stackParser(stacktrace, skipLines, framesToPop);
    } catch  {
    // no-empty
    }
    return [];
}
// Based on our own mapping pattern - https://github.com/getsentry/sentry/blob/9f08305e09866c8bd6d0c24f5b0aabdd7dd6c59c/src/sentry/lang/javascript/errormapping.py#L83-L108
const reactMinifiedRegexp = /Minified React error #\d+;/i;
/**
 * Certain known React errors contain links that would be falsely
 * parsed as frames. This function check for these errors and
 * returns number of the stack string lines to skip.
 */ function getSkipFirstStackStringLines(ex) {
    if (ex && reactMinifiedRegexp.test(ex.message)) {
        return 1;
    }
    return 0;
}
/**
 * If error has `framesToPop` property, it means that the
 * creator tells us the first x frames will be useless
 * and should be discarded. Typically error from wrapper function
 * which don't point to the actual location in the developer's code.
 *
 * Example: https://github.com/zertosh/invariant/blob/master/invariant.js#L46
 */ function getPopFirstTopFrames(ex) {
    if (typeof ex.framesToPop === 'number') {
        return ex.framesToPop;
    }
    return 0;
}
// https://developer.mozilla.org/en-US/docs/WebAssembly/JavaScript_interface/Exception
// @ts-expect-error - WebAssembly.Exception is a valid class
function isWebAssemblyException(exception) {
    // Check for support
    // @ts-expect-error - WebAssembly.Exception is a valid class
    if (typeof WebAssembly !== 'undefined' && typeof WebAssembly.Exception !== 'undefined') {
        // @ts-expect-error - WebAssembly.Exception is a valid class
        return exception instanceof WebAssembly.Exception;
    } else {
        return false;
    }
}
/**
 * Extracts from errors what we use as the exception `type` in error events.
 *
 * Usually, this is the `name` property on Error objects but WASM errors need to be treated differently.
 */ function extractType(ex) {
    const name = ex?.name;
    // The name for WebAssembly.Exception Errors needs to be extracted differently.
    // Context: https://github.com/getsentry/sentry-javascript/issues/13787
    if (!name && isWebAssemblyException(ex)) {
        // Emscripten sets array[type, message] to the "message" property on the WebAssembly.Exception object
        const hasTypeInMessage = ex.message && Array.isArray(ex.message) && ex.message.length == 2;
        return hasTypeInMessage ? ex.message[0] : 'WebAssembly.Exception';
    }
    return name;
}
/**
 * There are cases where stacktrace.message is an Event object
 * https://github.com/getsentry/sentry-javascript/issues/1949
 * In this specific case we try to extract stacktrace.message.error.message
 */ function extractMessage(ex) {
    const message = ex?.message;
    if (isWebAssemblyException(ex)) {
        // For Node 18, Emscripten sets array[type, message] to the "message" property on the WebAssembly.Exception object
        if (Array.isArray(ex.message) && ex.message.length == 2) {
            return ex.message[1];
        }
        return 'wasm exception';
    }
    if (!message) {
        return 'No error message';
    }
    if (message.error && typeof message.error.message === 'string') {
        return message.error.message;
    }
    return message;
}
/**
 * Creates an {@link Event} from all inputs to `captureException` and non-primitive inputs to `captureMessage`.
 * @hidden
 */ function eventFromException(stackParser, exception, hint, attachStacktrace) {
    const syntheticException = hint?.syntheticException || undefined;
    const event = eventFromUnknownInput(stackParser, exception, syntheticException, attachStacktrace);
    core.addExceptionMechanism(event); // defaults to { type: 'generic', handled: true }
    event.level = 'error';
    if (hint?.event_id) {
        event.event_id = hint.event_id;
    }
    return core.resolvedSyncPromise(event);
}
/**
 * Builds and Event from a Message
 * @hidden
 */ function eventFromMessage(stackParser, message, level = 'info', hint, attachStacktrace) {
    const syntheticException = hint?.syntheticException || undefined;
    const event = eventFromString(stackParser, message, syntheticException, attachStacktrace);
    event.level = level;
    if (hint?.event_id) {
        event.event_id = hint.event_id;
    }
    return core.resolvedSyncPromise(event);
}
/**
 * @hidden
 */ function eventFromUnknownInput(stackParser, exception, syntheticException, attachStacktrace, isUnhandledRejection) {
    let event;
    if (core.isErrorEvent(exception) && exception.error) {
        // If it is an ErrorEvent with `error` property, extract it to get actual Error
        const errorEvent = exception;
        return eventFromError(stackParser, errorEvent.error);
    }
    // If it is a `DOMError` (which is a legacy API, but still supported in some browsers) then we just extract the name
    // and message, as it doesn't provide anything else. According to the spec, all `DOMExceptions` should also be
    // `Error`s, but that's not the case in IE11, so in that case we treat it the same as we do a `DOMError`.
    //
    // https://developer.mozilla.org/en-US/docs/Web/API/DOMError
    // https://developer.mozilla.org/en-US/docs/Web/API/DOMException
    // https://webidl.spec.whatwg.org/#es-DOMException-specialness
    if (core.isDOMError(exception) || core.isDOMException(exception)) {
        const domException = exception;
        if ('stack' in exception) {
            event = eventFromError(stackParser, exception);
        } else {
            const name = domException.name || (core.isDOMError(domException) ? 'DOMError' : 'DOMException');
            const message = domException.message ? `${name}: ${domException.message}` : name;
            event = eventFromString(stackParser, message, syntheticException, attachStacktrace);
            core.addExceptionTypeValue(event, message);
        }
        if ('code' in domException) {
            // eslint-disable-next-line deprecation/deprecation
            event.tags = {
                ...event.tags,
                'DOMException.code': `${domException.code}`
            };
        }
        return event;
    }
    if (core.isError(exception)) {
        // we have a real Error object, do nothing
        return eventFromError(stackParser, exception);
    }
    if (core.isPlainObject(exception) || core.isEvent(exception)) {
        // If it's a plain object or an instance of `Event` (the built-in JS kind, not this SDK's `Event` type), serialize
        // it manually. This will allow us to group events based on top-level keys which is much better than creating a new
        // group on any key/value change.
        const objectException = exception;
        event = eventFromPlainObject(stackParser, objectException, syntheticException, isUnhandledRejection);
        core.addExceptionMechanism(event, {
            synthetic: true
        });
        return event;
    }
    // If none of previous checks were valid, then it means that it's not:
    // - an instance of DOMError
    // - an instance of DOMException
    // - an instance of Event
    // - an instance of Error
    // - a valid ErrorEvent (one with an error property)
    // - a plain Object
    //
    // So bail out and capture it as a simple message:
    event = eventFromString(stackParser, exception, syntheticException, attachStacktrace);
    core.addExceptionTypeValue(event, `${exception}`, undefined);
    core.addExceptionMechanism(event, {
        synthetic: true
    });
    return event;
}
function eventFromString(stackParser, message, syntheticException, attachStacktrace) {
    const event = {};
    if (attachStacktrace && syntheticException) {
        const frames = parseStackFrames(stackParser, syntheticException);
        if (frames.length) {
            event.exception = {
                values: [
                    {
                        value: message,
                        stacktrace: {
                            frames
                        }
                    }
                ]
            };
        }
        core.addExceptionMechanism(event, {
            synthetic: true
        });
    }
    if (core.isParameterizedString(message)) {
        const { __sentry_template_string__, __sentry_template_values__ } = message;
        event.logentry = {
            message: __sentry_template_string__,
            params: __sentry_template_values__
        };
        return event;
    }
    event.message = message;
    return event;
}
function getNonErrorObjectExceptionValue(exception, { isUnhandledRejection }) {
    const keys = core.extractExceptionKeysForMessage(exception);
    const captureType = isUnhandledRejection ? 'promise rejection' : 'exception';
    // Some ErrorEvent instances do not have an `error` property, which is why they are not handled before
    // We still want to try to get a decent message for these cases
    if (core.isErrorEvent(exception)) {
        return `Event \`ErrorEvent\` captured as ${captureType} with message \`${exception.message}\``;
    }
    if (core.isEvent(exception)) {
        const className = getObjectClassName(exception);
        return `Event \`${className}\` (type=${exception.type}) captured as ${captureType}`;
    }
    return `Object captured as ${captureType} with keys: ${keys}`;
}
function getObjectClassName(obj) {
    try {
        const prototype = Object.getPrototypeOf(obj);
        return prototype ? prototype.constructor.name : undefined;
    } catch  {
    // ignore errors here
    }
}
/** If a plain object has a property that is an `Error`, return this error. */ function getErrorPropertyFromObject(obj) {
    for(const prop in obj){
        if (Object.prototype.hasOwnProperty.call(obj, prop)) {
            const value = obj[prop];
            if (value instanceof Error) {
                return value;
            }
        }
    }
    return undefined;
}
exports.eventFromException = eventFromException;
exports.eventFromMessage = eventFromMessage;
exports.eventFromUnknownInput = eventFromUnknownInput;
exports.exceptionFromError = exceptionFromError;
exports.extractMessage = extractMessage;
exports.extractType = extractType; //# sourceMappingURL=eventbuilder.js.map
}),
"[project]/node_modules/@sentry/browser/build/npm/cjs/dev/client.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const core = __turbopack_context__.r("[project]/node_modules/@sentry/core/build/cjs/index.js [app-client] (ecmascript)");
const eventbuilder = __turbopack_context__.r("[project]/node_modules/@sentry/browser/build/npm/cjs/dev/eventbuilder.js [app-client] (ecmascript)");
const helpers = __turbopack_context__.r("[project]/node_modules/@sentry/browser/build/npm/cjs/dev/helpers.js [app-client] (ecmascript)");
/**
 * A magic string that build tooling can leverage in order to inject a release value into the SDK.
 */ /**
 * The Sentry Browser SDK Client.
 *
 * @see BrowserOptions for documentation on configuration options.
 * @see SentryClient for usage documentation.
 */ class BrowserClient extends core.Client {
    /**
   * Creates a new Browser SDK instance.
   *
   * @param options Configuration options for this SDK.
   */ constructor(options){
        const opts = applyDefaultOptions(options);
        const sdkSource = helpers.WINDOW.SENTRY_SDK_SOURCE || core.getSDKSource();
        core.applySdkMetadata(opts, 'browser', [
            'browser'
        ], sdkSource);
        // Only allow IP inferral by Relay if sendDefaultPii is true
        if (opts._metadata?.sdk) {
            opts._metadata.sdk.settings = {
                infer_ip: opts.sendDefaultPii ? 'auto' : 'never',
                // purposefully allowing already passed settings to override the default
                ...opts._metadata.sdk.settings
            };
        }
        super(opts);
        const { sendDefaultPii, sendClientReports, enableLogs, _experiments, enableMetrics: enableMetricsOption } = this._options;
        // todo(v11): Remove the experimental flag
        // eslint-disable-next-line deprecation/deprecation
        const enableMetrics = enableMetricsOption ?? _experiments?.enableMetrics ?? true;
        // Flush logs and metrics when page becomes hidden (e.g., tab switch, navigation)
        // todo(v11): Remove the experimental flag
        if (helpers.WINDOW.document && (sendClientReports || enableLogs || enableMetrics)) {
            helpers.WINDOW.document.addEventListener('visibilitychange', ()=>{
                if (helpers.WINDOW.document.visibilityState === 'hidden') {
                    if (sendClientReports) {
                        this._flushOutcomes();
                    }
                    if (enableLogs) {
                        core._INTERNAL_flushLogsBuffer(this);
                    }
                    if (enableMetrics) {
                        core._INTERNAL_flushMetricsBuffer(this);
                    }
                }
            });
        }
        if (sendDefaultPii) {
            this.on('beforeSendSession', core.addAutoIpAddressToSession);
        }
    }
    /**
   * @inheritDoc
   */ eventFromException(exception, hint) {
        return eventbuilder.eventFromException(this._options.stackParser, exception, hint, this._options.attachStacktrace);
    }
    /**
   * @inheritDoc
   */ eventFromMessage(message, level = 'info', hint) {
        return eventbuilder.eventFromMessage(this._options.stackParser, message, level, hint, this._options.attachStacktrace);
    }
    /**
   * @inheritDoc
   */ _prepareEvent(event, hint, currentScope, isolationScope) {
        event.platform = event.platform || 'javascript';
        return super._prepareEvent(event, hint, currentScope, isolationScope);
    }
}
/** Exported only for tests. */ function applyDefaultOptions(optionsArg) {
    return {
        release: typeof __SENTRY_RELEASE__ === 'string' // This allows build tooling to find-and-replace __SENTRY_RELEASE__ to inject a release value
         ? __SENTRY_RELEASE__ : helpers.WINDOW.SENTRY_RELEASE?.id,
        sendClientReports: true,
        // We default this to true, as it is the safer scenario
        parentSpanIsAlwaysRootSpan: true,
        ...optionsArg
    };
}
exports.BrowserClient = BrowserClient;
exports.applyDefaultOptions = applyDefaultOptions; //# sourceMappingURL=client.js.map
}),
"[project]/node_modules/@sentry/browser/build/npm/cjs/dev/transports/fetch.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const core = __turbopack_context__.r("[project]/node_modules/@sentry/core/build/cjs/index.js [app-client] (ecmascript)");
const browserUtils = __turbopack_context__.r("[project]/node_modules/@sentry-internal/browser-utils/build/cjs/index.js [app-client] (ecmascript)");
const DEFAULT_BROWSER_TRANSPORT_BUFFER_SIZE = 40;
/**
 * Creates a Transport that uses the Fetch API to send events to Sentry.
 */ function makeFetchTransport(options, nativeFetch = browserUtils.getNativeImplementation('fetch')) {
    let pendingBodySize = 0;
    let pendingCount = 0;
    async function makeRequest(request) {
        const requestSize = request.body.length;
        pendingBodySize += requestSize;
        pendingCount++;
        const requestOptions = {
            body: request.body,
            method: 'POST',
            referrerPolicy: 'strict-origin',
            headers: options.headers,
            // Outgoing requests are usually cancelled when navigating to a different page, causing a "TypeError: Failed to
            // fetch" error and sending a "network_error" client-outcome - in Chrome, the request status shows "(cancelled)".
            // The `keepalive` flag keeps outgoing requests alive, even when switching pages. We want this since we're
            // frequently sending events right before the user is switching pages (eg. when finishing navigation transactions).
            // Gotchas:
            // - `keepalive` isn't supported by Firefox
            // - As per spec (https://fetch.spec.whatwg.org/#http-network-or-cache-fetch):
            //   If the sum of contentLength and inflightKeepaliveBytes is greater than 64 kibibytes, then return a network error.
            //   We will therefore only activate the flag when we're below that limit.
            // There is also a limit of requests that can be open at the same time, so we also limit this to 15
            // See https://github.com/getsentry/sentry-javascript/pull/7553 for details
            keepalive: pendingBodySize <= 60000 && pendingCount < 15,
            ...options.fetchOptions
        };
        try {
            // Note: We do not need to suppress tracing here, because we are using the native fetch, instead of our wrapped one.
            const response = await nativeFetch(options.url, requestOptions);
            return {
                statusCode: response.status,
                headers: {
                    'x-sentry-rate-limits': response.headers.get('X-Sentry-Rate-Limits'),
                    'retry-after': response.headers.get('Retry-After')
                }
            };
        } catch (e) {
            browserUtils.clearCachedImplementation('fetch');
            throw e;
        } finally{
            pendingBodySize -= requestSize;
            pendingCount--;
        }
    }
    return core.createTransport(options, makeRequest, core.makePromiseBuffer(options.bufferSize || DEFAULT_BROWSER_TRANSPORT_BUFFER_SIZE));
}
exports.makeFetchTransport = makeFetchTransport; //# sourceMappingURL=fetch.js.map
}),
"[project]/node_modules/@sentry/browser/build/npm/cjs/dev/debug-build.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {

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
"[project]/node_modules/@sentry/browser/build/npm/cjs/dev/profiling/index.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const core = __turbopack_context__.r("[project]/node_modules/@sentry/core/build/cjs/index.js [app-client] (ecmascript)");
const debugBuild = __turbopack_context__.r("[project]/node_modules/@sentry/browser/build/npm/cjs/dev/debug-build.js [app-client] (ecmascript)");
/**
 * Starts the Sentry UI profiler.
 * This mode is exclusive with the transaction profiler and will only work if the profilesSampleRate is set to a falsy value.
 * In UI profiling mode, the profiler will keep reporting profile chunks to Sentry until it is stopped, which allows for continuous profiling of the application.
 */ function startProfiler() {
    const client = core.getClient();
    if (!client) {
        debugBuild.DEBUG_BUILD && core.debug.warn('No Sentry client available, profiling is not started');
        return;
    }
    const integration = client.getIntegrationByName('BrowserProfiling');
    if (!integration) {
        debugBuild.DEBUG_BUILD && core.debug.warn('BrowserProfiling integration is not available');
        return;
    }
    client.emit('startUIProfiler');
}
/**
 * Stops the Sentry UI profiler.
 * Calls to stop will stop the profiler and flush the currently collected profile data to Sentry.
 */ function stopProfiler() {
    const client = core.getClient();
    if (!client) {
        debugBuild.DEBUG_BUILD && core.debug.warn('No Sentry client available, profiling is not started');
        return;
    }
    const integration = client.getIntegrationByName('BrowserProfiling');
    if (!integration) {
        debugBuild.DEBUG_BUILD && core.debug.warn('ProfilingIntegration is not available');
        return;
    }
    client.emit('stopUIProfiler');
}
/**
 * Profiler namespace for controlling the JS profiler in 'manual' mode.
 *
 * Requires the `browserProfilingIntegration` from the `@sentry/browser` package.
 */ const uiProfiler = {
    startProfiler,
    stopProfiler
};
exports.uiProfiler = uiProfiler; //# sourceMappingURL=index.js.map
}),
"[project]/node_modules/@sentry/browser/build/npm/cjs/dev/stack-parsers.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const core = __turbopack_context__.r("[project]/node_modules/@sentry/core/build/cjs/index.js [app-client] (ecmascript)");
const OPERA10_PRIORITY = 10;
const OPERA11_PRIORITY = 20;
const CHROME_PRIORITY = 30;
const WINJS_PRIORITY = 40;
const GECKO_PRIORITY = 50;
function createFrame(filename, func, lineno, colno) {
    const frame = {
        filename,
        function: func === '<anonymous>' ? core.UNKNOWN_FUNCTION : func,
        in_app: true
    };
    if (lineno !== undefined) {
        frame.lineno = lineno;
    }
    if (colno !== undefined) {
        frame.colno = colno;
    }
    return frame;
}
// This regex matches frames that have no function name (ie. are at the top level of a module).
// For example "at http://localhost:5000//script.js:1:126"
// Frames _with_ function names usually look as follows: "at commitLayoutEffects (react-dom.development.js:23426:1)"
const chromeRegexNoFnName = /^\s*at (\S+?)(?::(\d+))(?::(\d+))\s*$/i;
// This regex matches all the frames that have a function name.
const chromeRegex = /^\s*at (?:(.+?\)(?: \[.+\])?|.*?) ?\((?:address at )?)?(?:async )?((?:<anonymous>|[-a-z]+:|.*bundle|\/)?.*?)(?::(\d+))?(?::(\d+))?\)?\s*$/i;
const chromeEvalRegex = /\((\S*)(?::(\d+))(?::(\d+))\)/;
// Matches stack frames with data URIs instead of filename so we can still get the function name
// Example: "at dynamicFn (data:application/javascript,export function dynamicFn() {..."
const chromeDataUriRegex = /at (.+?) ?\(data:(.+?),/;
// Chromium based browsers: Chrome, Brave, new Opera, new Edge
// We cannot call this variable `chrome` because it can conflict with global `chrome` variable in certain environments
// See: https://github.com/getsentry/sentry-javascript/issues/6880
const chromeStackParserFn = (line)=>{
    const dataUriMatch = line.match(chromeDataUriRegex);
    if (dataUriMatch) {
        return {
            filename: `<data:${dataUriMatch[2]}>`,
            function: dataUriMatch[1]
        };
    }
    // If the stack line has no function name, we need to parse it differently
    const noFnParts = chromeRegexNoFnName.exec(line);
    if (noFnParts) {
        const [, filename, line, col] = noFnParts;
        return createFrame(filename, core.UNKNOWN_FUNCTION, +line, +col);
    }
    const parts = chromeRegex.exec(line);
    if (parts) {
        const isEval = parts[2] && parts[2].indexOf('eval') === 0; // start of line
        if (isEval) {
            const subMatch = chromeEvalRegex.exec(parts[2]);
            if (subMatch) {
                // throw out eval line/column and use top-most line/column number
                parts[2] = subMatch[1]; // url
                parts[3] = subMatch[2]; // line
                parts[4] = subMatch[3]; // column
            }
        }
        // Kamil: One more hack won't hurt us right? Understanding and adding more rules on top of these regexps right now
        // would be way too time consuming. (TODO: Rewrite whole RegExp to be more readable)
        const [func, filename] = extractSafariExtensionDetails(parts[1] || core.UNKNOWN_FUNCTION, parts[2]);
        return createFrame(filename, func, parts[3] ? +parts[3] : undefined, parts[4] ? +parts[4] : undefined);
    }
    return;
};
const chromeStackLineParser = [
    CHROME_PRIORITY,
    chromeStackParserFn
];
// gecko regex: `(?:bundle|\d+\.js)`: `bundle` is for react native, `\d+\.js` also but specifically for ram bundles because it
// generates filenames without a prefix like `file://` the filenames in the stacktrace are just 42.js
// We need this specific case for now because we want no other regex to match.
const geckoREgex = /^\s*(.*?)(?:\((.*?)\))?(?:^|@)?((?:[-a-z]+)?:\/.*?|\[native code\]|[^@]*(?:bundle|\d+\.js)|\/[\w\-. /=]+)(?::(\d+))?(?::(\d+))?\s*$/i;
const geckoEvalRegex = /(\S+) line (\d+)(?: > eval line \d+)* > eval/i;
const gecko = (line)=>{
    const parts = geckoREgex.exec(line);
    if (parts) {
        const isEval = parts[3] && parts[3].indexOf(' > eval') > -1;
        if (isEval) {
            const subMatch = geckoEvalRegex.exec(parts[3]);
            if (subMatch) {
                // throw out eval line/column and use top-most line number
                parts[1] = parts[1] || 'eval';
                parts[3] = subMatch[1];
                parts[4] = subMatch[2];
                parts[5] = ''; // no column when eval
            }
        }
        let filename = parts[3];
        let func = parts[1] || core.UNKNOWN_FUNCTION;
        [func, filename] = extractSafariExtensionDetails(func, filename);
        return createFrame(filename, func, parts[4] ? +parts[4] : undefined, parts[5] ? +parts[5] : undefined);
    }
    return;
};
const geckoStackLineParser = [
    GECKO_PRIORITY,
    gecko
];
const winjsRegex = /^\s*at (?:((?:\[object object\])?.+) )?\(?((?:[-a-z]+):.*?):(\d+)(?::(\d+))?\)?\s*$/i;
const winjs = (line)=>{
    const parts = winjsRegex.exec(line);
    return parts ? createFrame(parts[2], parts[1] || core.UNKNOWN_FUNCTION, +parts[3], parts[4] ? +parts[4] : undefined) : undefined;
};
const winjsStackLineParser = [
    WINJS_PRIORITY,
    winjs
];
const opera10Regex = / line (\d+).*script (?:in )?(\S+)(?:: in function (\S+))?$/i;
const opera10 = (line)=>{
    const parts = opera10Regex.exec(line);
    return parts ? createFrame(parts[2], parts[3] || core.UNKNOWN_FUNCTION, +parts[1]) : undefined;
};
const opera10StackLineParser = [
    OPERA10_PRIORITY,
    opera10
];
const opera11Regex = / line (\d+), column (\d+)\s*(?:in (?:<anonymous function: ([^>]+)>|([^)]+))\(.*\))? in (.*):\s*$/i;
const opera11 = (line)=>{
    const parts = opera11Regex.exec(line);
    return parts ? createFrame(parts[5], parts[3] || parts[4] || core.UNKNOWN_FUNCTION, +parts[1], +parts[2]) : undefined;
};
const opera11StackLineParser = [
    OPERA11_PRIORITY,
    opera11
];
const defaultStackLineParsers = [
    chromeStackLineParser,
    geckoStackLineParser
];
const defaultStackParser = core.createStackParser(...defaultStackLineParsers);
/**
 * Safari web extensions, starting version unknown, can produce "frames-only" stacktraces.
 * What it means, is that instead of format like:
 *
 * Error: wat
 *   at function@url:row:col
 *   at function@url:row:col
 *   at function@url:row:col
 *
 * it produces something like:
 *
 *   function@url:row:col
 *   function@url:row:col
 *   function@url:row:col
 *
 * Because of that, it won't be captured by `chrome` RegExp and will fall into `Gecko` branch.
 * This function is extracted so that we can use it in both places without duplicating the logic.
 * Unfortunately "just" changing RegExp is too complicated now and making it pass all tests
 * and fix this case seems like an impossible, or at least way too time-consuming task.
 */ const extractSafariExtensionDetails = (func, filename)=>{
    const isSafariExtension = func.indexOf('safari-extension') !== -1;
    const isSafariWebExtension = func.indexOf('safari-web-extension') !== -1;
    return isSafariExtension || isSafariWebExtension ? [
        func.indexOf('@') !== -1 ? func.split('@')[0] : core.UNKNOWN_FUNCTION,
        isSafariExtension ? `safari-extension:${filename}` : `safari-web-extension:${filename}`
    ] : [
        func,
        filename
    ];
};
exports.chromeStackLineParser = chromeStackLineParser;
exports.defaultStackLineParsers = defaultStackLineParsers;
exports.defaultStackParser = defaultStackParser;
exports.geckoStackLineParser = geckoStackLineParser;
exports.opera10StackLineParser = opera10StackLineParser;
exports.opera11StackLineParser = opera11StackLineParser;
exports.winjsStackLineParser = winjsStackLineParser; //# sourceMappingURL=stack-parsers.js.map
}),
"[project]/node_modules/@sentry/browser/build/npm/cjs/dev/userfeedback.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const core = __turbopack_context__.r("[project]/node_modules/@sentry/core/build/cjs/index.js [app-client] (ecmascript)");
/**
 * Creates an envelope from a user feedback.
 */ function createUserFeedbackEnvelope(feedback, { metadata, tunnel, dsn }) {
    const headers = {
        event_id: feedback.event_id,
        sent_at: new Date().toISOString(),
        ...metadata?.sdk && {
            sdk: {
                name: metadata.sdk.name,
                version: metadata.sdk.version
            }
        },
        ...!!tunnel && !!dsn && {
            dsn: core.dsnToString(dsn)
        }
    };
    const item = createUserFeedbackEnvelopeItem(feedback);
    return core.createEnvelope(headers, [
        item
    ]);
}
function createUserFeedbackEnvelopeItem(feedback) {
    const feedbackHeaders = {
        type: 'user_report'
    };
    return [
        feedbackHeaders,
        feedback
    ];
}
exports.createUserFeedbackEnvelope = createUserFeedbackEnvelope; //# sourceMappingURL=userfeedback.js.map
}),
"[project]/node_modules/@sentry/browser/build/npm/cjs/dev/integrations/breadcrumbs.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const core = __turbopack_context__.r("[project]/node_modules/@sentry/core/build/cjs/index.js [app-client] (ecmascript)");
const browserUtils = __turbopack_context__.r("[project]/node_modules/@sentry-internal/browser-utils/build/cjs/index.js [app-client] (ecmascript)");
const debugBuild = __turbopack_context__.r("[project]/node_modules/@sentry/browser/build/npm/cjs/dev/debug-build.js [app-client] (ecmascript)");
const helpers = __turbopack_context__.r("[project]/node_modules/@sentry/browser/build/npm/cjs/dev/helpers.js [app-client] (ecmascript)");
/** maxStringLength gets capped to prevent 100 breadcrumbs exceeding 1MB event payload size */ const MAX_ALLOWED_STRING_LENGTH = 1024;
const INTEGRATION_NAME = 'Breadcrumbs';
const _breadcrumbsIntegration = (options = {})=>{
    const _options = {
        console: true,
        dom: true,
        fetch: true,
        history: true,
        sentry: true,
        xhr: true,
        ...options
    };
    return {
        name: INTEGRATION_NAME,
        setup (client) {
            // TODO(v11): Remove this functionality and use `consoleIntegration` from @sentry/core instead.
            if (_options.console) {
                core.addConsoleInstrumentationHandler(_getConsoleBreadcrumbHandler(client));
            }
            if (_options.dom) {
                browserUtils.addClickKeypressInstrumentationHandler(_getDomBreadcrumbHandler(client, _options.dom));
            }
            if (_options.xhr) {
                browserUtils.addXhrInstrumentationHandler(_getXhrBreadcrumbHandler(client));
            }
            if (_options.fetch) {
                core.addFetchInstrumentationHandler(_getFetchBreadcrumbHandler(client));
            }
            if (_options.history) {
                browserUtils.addHistoryInstrumentationHandler(_getHistoryBreadcrumbHandler(client));
            }
            if (_options.sentry) {
                client.on('beforeSendEvent', _getSentryBreadcrumbHandler(client));
            }
        }
    };
};
const breadcrumbsIntegration = core.defineIntegration(_breadcrumbsIntegration);
/**
 * Adds a breadcrumb for Sentry events or transactions if this option is enabled.
 */ function _getSentryBreadcrumbHandler(client) {
    return function addSentryBreadcrumb(event) {
        if (core.getClient() !== client) {
            return;
        }
        core.addBreadcrumb({
            category: `sentry.${event.type === 'transaction' ? 'transaction' : 'event'}`,
            event_id: event.event_id,
            level: event.level,
            message: core.getEventDescription(event)
        }, {
            event
        });
    };
}
/**
 * A HOC that creates a function that creates breadcrumbs from DOM API calls.
 * This is a HOC so that we get access to dom options in the closure.
 */ function _getDomBreadcrumbHandler(client, dom) {
    return function _innerDomBreadcrumb(handlerData) {
        if (core.getClient() !== client) {
            return;
        }
        let target;
        let componentName;
        let keyAttrs = typeof dom === 'object' ? dom.serializeAttribute : undefined;
        let maxStringLength = typeof dom === 'object' && typeof dom.maxStringLength === 'number' ? dom.maxStringLength : undefined;
        if (maxStringLength && maxStringLength > MAX_ALLOWED_STRING_LENGTH) {
            debugBuild.DEBUG_BUILD && core.debug.warn(`\`dom.maxStringLength\` cannot exceed ${MAX_ALLOWED_STRING_LENGTH}, but a value of ${maxStringLength} was configured. Sentry will use ${MAX_ALLOWED_STRING_LENGTH} instead.`);
            maxStringLength = MAX_ALLOWED_STRING_LENGTH;
        }
        if (typeof keyAttrs === 'string') {
            keyAttrs = [
                keyAttrs
            ];
        }
        // Accessing event.target can throw (see getsentry/raven-js#838, #768)
        try {
            const event = handlerData.event;
            const element = _isEvent(event) ? event.target : event;
            target = core.htmlTreeAsString(element, {
                keyAttrs,
                maxStringLength
            });
            componentName = core.getComponentName(element);
        } catch  {
            target = '<unknown>';
        }
        if (target.length === 0) {
            return;
        }
        const breadcrumb = {
            category: `ui.${handlerData.name}`,
            message: target
        };
        if (componentName) {
            breadcrumb.data = {
                'ui.component_name': componentName
            };
        }
        core.addBreadcrumb(breadcrumb, {
            event: handlerData.event,
            name: handlerData.name,
            global: handlerData.global
        });
    };
}
/**
 * Creates breadcrumbs from console API calls
 */ function _getConsoleBreadcrumbHandler(client) {
    return function _consoleBreadcrumb(handlerData) {
        if (core.getClient() !== client) {
            return;
        }
        const breadcrumb = {
            category: 'console',
            data: {
                arguments: handlerData.args,
                logger: 'console'
            },
            level: core.severityLevelFromString(handlerData.level),
            message: core.safeJoin(handlerData.args, ' ')
        };
        if (handlerData.level === 'assert') {
            if (handlerData.args[0] === false) {
                breadcrumb.message = `Assertion failed: ${core.safeJoin(handlerData.args.slice(1), ' ') || 'console.assert'}`;
                breadcrumb.data.arguments = handlerData.args.slice(1);
            } else {
                // Don't capture a breadcrumb for passed assertions
                return;
            }
        }
        core.addBreadcrumb(breadcrumb, {
            input: handlerData.args,
            level: handlerData.level
        });
    };
}
/**
 * Creates breadcrumbs from XHR API calls
 */ function _getXhrBreadcrumbHandler(client) {
    return function _xhrBreadcrumb(handlerData) {
        if (core.getClient() !== client) {
            return;
        }
        const { startTimestamp, endTimestamp } = handlerData;
        const sentryXhrData = handlerData.xhr[browserUtils.SENTRY_XHR_DATA_KEY];
        // We only capture complete, non-sentry requests
        if (!startTimestamp || !endTimestamp || !sentryXhrData) {
            return;
        }
        const { method, url, status_code, body } = sentryXhrData;
        const data = {
            method,
            url,
            status_code
        };
        const hint = {
            xhr: handlerData.xhr,
            input: body,
            startTimestamp,
            endTimestamp
        };
        const breadcrumb = {
            category: 'xhr',
            data,
            type: 'http',
            level: core.getBreadcrumbLogLevelFromHttpStatusCode(status_code)
        };
        client.emit('beforeOutgoingRequestBreadcrumb', breadcrumb, hint);
        core.addBreadcrumb(breadcrumb, hint);
    };
}
/**
 * Creates breadcrumbs from fetch API calls
 */ function _getFetchBreadcrumbHandler(client) {
    return function _fetchBreadcrumb(handlerData) {
        if (core.getClient() !== client) {
            return;
        }
        const { startTimestamp, endTimestamp } = handlerData;
        // We only capture complete fetch requests
        if (!endTimestamp) {
            return;
        }
        if (handlerData.fetchData.url.match(/sentry_key/) && handlerData.fetchData.method === 'POST') {
            // We will not create breadcrumbs for fetch requests that contain `sentry_key` (internal sentry requests)
            return;
        }
        ({
            method: handlerData.fetchData.method,
            url: handlerData.fetchData.url
        });
        if (handlerData.error) {
            const data = handlerData.fetchData;
            const hint = {
                data: handlerData.error,
                input: handlerData.args,
                startTimestamp,
                endTimestamp
            };
            const breadcrumb = {
                category: 'fetch',
                data,
                level: 'error',
                type: 'http'
            };
            client.emit('beforeOutgoingRequestBreadcrumb', breadcrumb, hint);
            core.addBreadcrumb(breadcrumb, hint);
        } else {
            const response = handlerData.response;
            const data = {
                ...handlerData.fetchData,
                status_code: response?.status
            };
            handlerData.fetchData.request_body_size;
            handlerData.fetchData.response_body_size;
            response?.status;
            const hint = {
                input: handlerData.args,
                response,
                startTimestamp,
                endTimestamp
            };
            const breadcrumb = {
                category: 'fetch',
                data,
                type: 'http',
                level: core.getBreadcrumbLogLevelFromHttpStatusCode(data.status_code)
            };
            client.emit('beforeOutgoingRequestBreadcrumb', breadcrumb, hint);
            core.addBreadcrumb(breadcrumb, hint);
        }
    };
}
/**
 * Creates breadcrumbs from history API calls
 */ function _getHistoryBreadcrumbHandler(client) {
    return function _historyBreadcrumb(handlerData) {
        if (core.getClient() !== client) {
            return;
        }
        let from = handlerData.from;
        let to = handlerData.to;
        const parsedLoc = core.parseUrl(helpers.WINDOW.location.href);
        let parsedFrom = from ? core.parseUrl(from) : undefined;
        const parsedTo = core.parseUrl(to);
        // Initial pushState doesn't provide `from` information
        if (!parsedFrom?.path) {
            parsedFrom = parsedLoc;
        }
        // Use only the path component of the URL if the URL matches the current
        // document (almost all the time when using pushState)
        if (parsedLoc.protocol === parsedTo.protocol && parsedLoc.host === parsedTo.host) {
            to = parsedTo.relative;
        }
        if (parsedLoc.protocol === parsedFrom.protocol && parsedLoc.host === parsedFrom.host) {
            from = parsedFrom.relative;
        }
        core.addBreadcrumb({
            category: 'navigation',
            data: {
                from,
                to
            }
        });
    };
}
function _isEvent(event) {
    return !!event && !!event.target;
}
exports.breadcrumbsIntegration = breadcrumbsIntegration; //# sourceMappingURL=breadcrumbs.js.map
}),
"[project]/node_modules/@sentry/browser/build/npm/cjs/dev/integrations/browserapierrors.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const core = __turbopack_context__.r("[project]/node_modules/@sentry/core/build/cjs/index.js [app-client] (ecmascript)");
const helpers = __turbopack_context__.r("[project]/node_modules/@sentry/browser/build/npm/cjs/dev/helpers.js [app-client] (ecmascript)");
const DEFAULT_EVENT_TARGET = [
    'EventTarget',
    'Window',
    'Node',
    'ApplicationCache',
    'AudioTrackList',
    'BroadcastChannel',
    'ChannelMergerNode',
    'CryptoOperation',
    'EventSource',
    'FileReader',
    'HTMLUnknownElement',
    'IDBDatabase',
    'IDBRequest',
    'IDBTransaction',
    'KeyOperation',
    'MediaController',
    'MessagePort',
    'ModalWindow',
    'Notification',
    'SVGElementInstance',
    'Screen',
    'SharedWorker',
    'TextTrack',
    'TextTrackCue',
    'TextTrackList',
    'WebSocket',
    'WebSocketWorker',
    'Worker',
    'XMLHttpRequest',
    'XMLHttpRequestEventTarget',
    'XMLHttpRequestUpload'
];
const INTEGRATION_NAME = 'BrowserApiErrors';
const _browserApiErrorsIntegration = (options = {})=>{
    const _options = {
        XMLHttpRequest: true,
        eventTarget: true,
        requestAnimationFrame: true,
        setInterval: true,
        setTimeout: true,
        unregisterOriginalCallbacks: false,
        ...options
    };
    return {
        name: INTEGRATION_NAME,
        // TODO: This currently only works for the first client this is setup
        // We may want to adjust this to check for client etc.
        setupOnce () {
            if (_options.setTimeout) {
                core.fill(helpers.WINDOW, 'setTimeout', _wrapTimeFunction);
            }
            if (_options.setInterval) {
                core.fill(helpers.WINDOW, 'setInterval', _wrapTimeFunction);
            }
            if (_options.requestAnimationFrame) {
                core.fill(helpers.WINDOW, 'requestAnimationFrame', _wrapRAF);
            }
            if (_options.XMLHttpRequest && 'XMLHttpRequest' in helpers.WINDOW) {
                core.fill(XMLHttpRequest.prototype, 'send', _wrapXHR);
            }
            const eventTargetOption = _options.eventTarget;
            if (eventTargetOption) {
                const eventTarget = Array.isArray(eventTargetOption) ? eventTargetOption : DEFAULT_EVENT_TARGET;
                eventTarget.forEach((target)=>_wrapEventTarget(target, _options));
            }
        }
    };
};
/**
 * Wrap timer functions and event targets to catch errors and provide better meta data.
 */ const browserApiErrorsIntegration = core.defineIntegration(_browserApiErrorsIntegration);
function _wrapTimeFunction(original) {
    return function(...args) {
        const originalCallback = args[0];
        args[0] = helpers.wrap(originalCallback, {
            mechanism: {
                handled: false,
                type: `auto.browser.browserapierrors.${core.getFunctionName(original)}`
            }
        });
        return original.apply(this, args);
    };
}
function _wrapRAF(original) {
    return function(callback) {
        return original.apply(this, [
            helpers.wrap(callback, {
                mechanism: {
                    data: {
                        handler: core.getFunctionName(original)
                    },
                    handled: false,
                    type: 'auto.browser.browserapierrors.requestAnimationFrame'
                }
            })
        ]);
    };
}
function _wrapXHR(originalSend) {
    return function(...args) {
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const xhr = this;
        const xmlHttpRequestProps = [
            'onload',
            'onerror',
            'onprogress',
            'onreadystatechange'
        ];
        xmlHttpRequestProps.forEach((prop)=>{
            if (prop in xhr && typeof xhr[prop] === 'function') {
                core.fill(xhr, prop, function(original) {
                    const wrapOptions = {
                        mechanism: {
                            data: {
                                handler: core.getFunctionName(original)
                            },
                            handled: false,
                            type: `auto.browser.browserapierrors.xhr.${prop}`
                        }
                    };
                    // If Instrument integration has been called before BrowserApiErrors, get the name of original function
                    const originalFunction = core.getOriginalFunction(original);
                    if (originalFunction) {
                        wrapOptions.mechanism.data.handler = core.getFunctionName(originalFunction);
                    }
                    // Otherwise wrap directly
                    return helpers.wrap(original, wrapOptions);
                });
            }
        });
        return originalSend.apply(this, args);
    };
}
function _wrapEventTarget(target, integrationOptions) {
    const globalObject = helpers.WINDOW;
    const proto = globalObject[target]?.prototype;
    // eslint-disable-next-line no-prototype-builtins
    if (!proto?.hasOwnProperty?.('addEventListener')) {
        return;
    }
    core.fill(proto, 'addEventListener', function(original) {
        return function(eventName, fn, options) {
            try {
                if (isEventListenerObject(fn)) {
                    // ESlint disable explanation:
                    //  First, it is generally safe to call `wrap` with an unbound function. Furthermore, using `.bind()` would
                    //  introduce a bug here, because bind returns a new function that doesn't have our
                    //  flags(like __sentry_original__) attached. `wrap` checks for those flags to avoid unnecessary wrapping.
                    //  Without those flags, every call to addEventListener wraps the function again, causing a memory leak.
                    // eslint-disable-next-line @typescript-eslint/unbound-method
                    fn.handleEvent = helpers.wrap(fn.handleEvent, {
                        mechanism: {
                            data: {
                                handler: core.getFunctionName(fn),
                                target
                            },
                            handled: false,
                            type: 'auto.browser.browserapierrors.handleEvent'
                        }
                    });
                }
            } catch  {
            // can sometimes get 'Permission denied to access property "handle Event'
            }
            if (integrationOptions.unregisterOriginalCallbacks) {
                unregisterOriginalCallback(this, eventName, fn);
            }
            return original.apply(this, [
                eventName,
                helpers.wrap(fn, {
                    mechanism: {
                        data: {
                            handler: core.getFunctionName(fn),
                            target
                        },
                        handled: false,
                        type: 'auto.browser.browserapierrors.addEventListener'
                    }
                }),
                options
            ]);
        };
    });
    core.fill(proto, 'removeEventListener', function(originalRemoveEventListener) {
        return function(eventName, fn, options) {
            /**
       * There are 2 possible scenarios here:
       *
       * 1. Someone passes a callback, which was attached prior to Sentry initialization, or by using unmodified
       * method, eg. `document.addEventListener.call(el, name, handler). In this case, we treat this function
       * as a pass-through, and call original `removeEventListener` with it.
       *
       * 2. Someone passes a callback, which was attached after Sentry was initialized, which means that it was using
       * our wrapped version of `addEventListener`, which internally calls `wrap` helper.
       * This helper "wraps" whole callback inside a try/catch statement, and attached appropriate metadata to it,
       * in order for us to make a distinction between wrapped/non-wrapped functions possible.
       * If a function was wrapped, it has additional property of `__sentry_wrapped__`, holding the handler.
       *
       * When someone adds a handler prior to initialization, and then do it again, but after,
       * then we have to detach both of them. Otherwise, if we'd detach only wrapped one, it'd be impossible
       * to get rid of the initial handler and it'd stick there forever.
       */ try {
                const originalEventHandler = fn.__sentry_wrapped__;
                if (originalEventHandler) {
                    originalRemoveEventListener.call(this, eventName, originalEventHandler, options);
                }
            } catch  {
            // ignore, accessing __sentry_wrapped__ will throw in some Selenium environments
            }
            return originalRemoveEventListener.call(this, eventName, fn, options);
        };
    });
}
function isEventListenerObject(obj) {
    return typeof obj.handleEvent === 'function';
}
function unregisterOriginalCallback(target, eventName, fn) {
    if (target && typeof target === 'object' && 'removeEventListener' in target && typeof target.removeEventListener === 'function') {
        target.removeEventListener(eventName, fn);
    }
}
exports.browserApiErrorsIntegration = browserApiErrorsIntegration; //# sourceMappingURL=browserapierrors.js.map
}),
"[project]/node_modules/@sentry/browser/build/npm/cjs/dev/integrations/browsersession.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const core = __turbopack_context__.r("[project]/node_modules/@sentry/core/build/cjs/index.js [app-client] (ecmascript)");
const browserUtils = __turbopack_context__.r("[project]/node_modules/@sentry-internal/browser-utils/build/cjs/index.js [app-client] (ecmascript)");
const debugBuild = __turbopack_context__.r("[project]/node_modules/@sentry/browser/build/npm/cjs/dev/debug-build.js [app-client] (ecmascript)");
const helpers = __turbopack_context__.r("[project]/node_modules/@sentry/browser/build/npm/cjs/dev/helpers.js [app-client] (ecmascript)");
/**
 * When added, automatically creates sessions which allow you to track adoption and crashes (crash free rate) in your Releases in Sentry.
 * More information: https://docs.sentry.io/product/releases/health/
 *
 * Note: In order for session tracking to work, you need to set up Releases: https://docs.sentry.io/product/releases/
 */ const browserSessionIntegration = core.defineIntegration(()=>{
    return {
        name: 'BrowserSession',
        setupOnce () {
            if (typeof helpers.WINDOW.document === 'undefined') {
                debugBuild.DEBUG_BUILD && core.debug.warn('Using the `browserSessionIntegration` in non-browser environments is not supported.');
                return;
            }
            // The session duration for browser sessions does not track a meaningful
            // concept that can be used as a metric.
            // Automatically captured sessions are akin to page views, and thus we
            // discard their duration.
            core.startSession({
                ignoreDuration: true
            });
            core.captureSession();
            // We want to create a session for every navigation as well
            browserUtils.addHistoryInstrumentationHandler(({ from, to })=>{
                // Don't create an additional session for the initial route or if the location did not change
                if (from !== undefined && from !== to) {
                    core.startSession({
                        ignoreDuration: true
                    });
                    core.captureSession();
                }
            });
        }
    };
});
exports.browserSessionIntegration = browserSessionIntegration; //# sourceMappingURL=browsersession.js.map
}),
"[project]/node_modules/@sentry/browser/build/npm/cjs/dev/integrations/globalhandlers.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const core = __turbopack_context__.r("[project]/node_modules/@sentry/core/build/cjs/index.js [app-client] (ecmascript)");
const debugBuild = __turbopack_context__.r("[project]/node_modules/@sentry/browser/build/npm/cjs/dev/debug-build.js [app-client] (ecmascript)");
const eventbuilder = __turbopack_context__.r("[project]/node_modules/@sentry/browser/build/npm/cjs/dev/eventbuilder.js [app-client] (ecmascript)");
const helpers = __turbopack_context__.r("[project]/node_modules/@sentry/browser/build/npm/cjs/dev/helpers.js [app-client] (ecmascript)");
const INTEGRATION_NAME = 'GlobalHandlers';
const _globalHandlersIntegration = (options = {})=>{
    const _options = {
        onerror: true,
        onunhandledrejection: true,
        ...options
    };
    return {
        name: INTEGRATION_NAME,
        setupOnce () {
            Error.stackTraceLimit = 50;
        },
        setup (client) {
            if (_options.onerror) {
                _installGlobalOnErrorHandler(client);
                globalHandlerLog('onerror');
            }
            if (_options.onunhandledrejection) {
                _installGlobalOnUnhandledRejectionHandler(client);
                globalHandlerLog('onunhandledrejection');
            }
        }
    };
};
const globalHandlersIntegration = core.defineIntegration(_globalHandlersIntegration);
function _installGlobalOnErrorHandler(client) {
    core.addGlobalErrorInstrumentationHandler((data)=>{
        const { stackParser, attachStacktrace } = getOptions();
        if (core.getClient() !== client || helpers.shouldIgnoreOnError()) {
            return;
        }
        const { msg, url, line, column, error } = data;
        const event = _enhanceEventWithInitialFrame(eventbuilder.eventFromUnknownInput(stackParser, error || msg, undefined, attachStacktrace, false), url, line, column);
        event.level = 'error';
        core.captureEvent(event, {
            originalException: error,
            mechanism: {
                handled: false,
                type: 'auto.browser.global_handlers.onerror'
            }
        });
    });
}
function _installGlobalOnUnhandledRejectionHandler(client) {
    core.addGlobalUnhandledRejectionInstrumentationHandler((e)=>{
        const { stackParser, attachStacktrace } = getOptions();
        if (core.getClient() !== client || helpers.shouldIgnoreOnError()) {
            return;
        }
        const error = _getUnhandledRejectionError(e);
        const event = core.isPrimitive(error) ? _eventFromRejectionWithPrimitive(error) : eventbuilder.eventFromUnknownInput(stackParser, error, undefined, attachStacktrace, true);
        event.level = 'error';
        core.captureEvent(event, {
            originalException: error,
            mechanism: {
                handled: false,
                type: 'auto.browser.global_handlers.onunhandledrejection'
            }
        });
    });
}
/**
 *
 */ function _getUnhandledRejectionError(error) {
    if (core.isPrimitive(error)) {
        return error;
    }
    // dig the object of the rejection out of known event types
    try {
        // PromiseRejectionEvents store the object of the rejection under 'reason'
        // see https://developer.mozilla.org/en-US/docs/Web/API/PromiseRejectionEvent
        if ('reason' in error) {
            return error.reason;
        }
        // something, somewhere, (likely a browser extension) effectively casts PromiseRejectionEvents
        // to CustomEvents, moving the `promise` and `reason` attributes of the PRE into
        // the CustomEvent's `detail` attribute, since they're not part of CustomEvent's spec
        // see https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent and
        // https://github.com/getsentry/sentry-javascript/issues/2380
        if ('detail' in error && 'reason' in error.detail) {
            return error.detail.reason;
        }
    } catch  {} // eslint-disable-line no-empty
    return error;
}
/**
 * Create an event from a promise rejection where the `reason` is a primitive.
 *
 * @param reason: The `reason` property of the promise rejection
 * @returns An Event object with an appropriate `exception` value
 */ function _eventFromRejectionWithPrimitive(reason) {
    return {
        exception: {
            values: [
                {
                    type: 'UnhandledRejection',
                    // String() is needed because the Primitive type includes symbols (which can't be automatically stringified)
                    value: `Non-Error promise rejection captured with value: ${String(reason)}`
                }
            ]
        }
    };
}
function _enhanceEventWithInitialFrame(event, url, line, column) {
    // event.exception
    const e = event.exception = event.exception || {};
    // event.exception.values
    const ev = e.values = e.values || [];
    // event.exception.values[0]
    const ev0 = ev[0] = ev[0] || {};
    // event.exception.values[0].stacktrace
    const ev0s = ev0.stacktrace = ev0.stacktrace || {};
    // event.exception.values[0].stacktrace.frames
    const ev0sf = ev0s.frames = ev0s.frames || [];
    const colno = column;
    const lineno = line;
    const filename = getFilenameFromUrl(url) ?? core.getLocationHref();
    // event.exception.values[0].stacktrace.frames
    if (ev0sf.length === 0) {
        ev0sf.push({
            colno,
            filename,
            function: core.UNKNOWN_FUNCTION,
            in_app: true,
            lineno
        });
    }
    return event;
}
function globalHandlerLog(type) {
    debugBuild.DEBUG_BUILD && core.debug.log(`Global Handler attached: ${type}`);
}
function getOptions() {
    const client = core.getClient();
    const options = client?.getOptions() || {
        stackParser: ()=>[],
        attachStacktrace: false
    };
    return options;
}
function getFilenameFromUrl(url) {
    if (!core.isString(url) || url.length === 0) {
        return undefined;
    }
    // stack frame urls can be data urls, for example when initializing a Worker with a base64 encoded script
    // in this case we just show the data prefix and mime type to avoid too long raw data urls
    if (url.startsWith('data:')) {
        const match = url.match(/^data:([^;]+)/);
        const mimeType = match ? match[1] : 'text/javascript';
        const isBase64 = url.includes('base64,');
        return `<data:${mimeType}${isBase64 ? ',base64' : ''}>`;
    }
    return url; // it's fine to not truncate it as it's not put in a regex (https://codeql.github.com/codeql-query-help/javascript/js-polynomial-redos)
}
exports._eventFromRejectionWithPrimitive = _eventFromRejectionWithPrimitive;
exports._getUnhandledRejectionError = _getUnhandledRejectionError;
exports.globalHandlersIntegration = globalHandlersIntegration; //# sourceMappingURL=globalhandlers.js.map
}),
"[project]/node_modules/@sentry/browser/build/npm/cjs/dev/integrations/httpcontext.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const core = __turbopack_context__.r("[project]/node_modules/@sentry/core/build/cjs/index.js [app-client] (ecmascript)");
const helpers = __turbopack_context__.r("[project]/node_modules/@sentry/browser/build/npm/cjs/dev/helpers.js [app-client] (ecmascript)");
/**
 * Collects information about HTTP request headers and
 * attaches them to the event.
 */ const httpContextIntegration = core.defineIntegration(()=>{
    return {
        name: 'HttpContext',
        preprocessEvent (event) {
            // if none of the information we want exists, don't bother
            if (!helpers.WINDOW.navigator && !helpers.WINDOW.location && !helpers.WINDOW.document) {
                return;
            }
            const reqData = helpers.getHttpRequestData();
            const headers = {
                ...reqData.headers,
                ...event.request?.headers
            };
            event.request = {
                ...reqData,
                ...event.request,
                headers
            };
        }
    };
});
exports.httpContextIntegration = httpContextIntegration; //# sourceMappingURL=httpcontext.js.map
}),
"[project]/node_modules/@sentry/browser/build/npm/cjs/dev/integrations/linkederrors.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const core = __turbopack_context__.r("[project]/node_modules/@sentry/core/build/cjs/index.js [app-client] (ecmascript)");
const eventbuilder = __turbopack_context__.r("[project]/node_modules/@sentry/browser/build/npm/cjs/dev/eventbuilder.js [app-client] (ecmascript)");
const DEFAULT_KEY = 'cause';
const DEFAULT_LIMIT = 5;
const INTEGRATION_NAME = 'LinkedErrors';
const _linkedErrorsIntegration = (options = {})=>{
    const limit = options.limit || DEFAULT_LIMIT;
    const key = options.key || DEFAULT_KEY;
    return {
        name: INTEGRATION_NAME,
        preprocessEvent (event, hint, client) {
            const options = client.getOptions();
            core.applyAggregateErrorsToEvent(// This differs from the LinkedErrors integration in core by using a different exceptionFromError function
            eventbuilder.exceptionFromError, options.stackParser, key, limit, event, hint);
        }
    };
};
/**
 * Aggregrate linked errors in an event.
 */ const linkedErrorsIntegration = core.defineIntegration(_linkedErrorsIntegration);
exports.linkedErrorsIntegration = linkedErrorsIntegration; //# sourceMappingURL=linkederrors.js.map
}),
"[project]/node_modules/@sentry/browser/build/npm/cjs/dev/integrations/spotlight.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const core = __turbopack_context__.r("[project]/node_modules/@sentry/core/build/cjs/index.js [app-client] (ecmascript)");
const browserUtils = __turbopack_context__.r("[project]/node_modules/@sentry-internal/browser-utils/build/cjs/index.js [app-client] (ecmascript)");
const debugBuild = __turbopack_context__.r("[project]/node_modules/@sentry/browser/build/npm/cjs/dev/debug-build.js [app-client] (ecmascript)");
const INTEGRATION_NAME = 'SpotlightBrowser';
const _spotlightIntegration = (options = {})=>{
    const sidecarUrl = options.sidecarUrl || 'http://localhost:8969/stream';
    return {
        name: INTEGRATION_NAME,
        setup: ()=>{
            debugBuild.DEBUG_BUILD && core.debug.log('Using Sidecar URL', sidecarUrl);
        },
        // We don't want to send interaction transactions/root spans created from
        // clicks within Spotlight to Sentry. Neither do we want them to be sent to
        // spotlight.
        processEvent: (event)=>isSpotlightInteraction(event) ? null : event,
        afterAllSetup: (client)=>{
            setupSidecarForwarding(client, sidecarUrl);
        }
    };
};
function setupSidecarForwarding(client, sidecarUrl) {
    const makeFetch = browserUtils.getNativeImplementation('fetch');
    let failCount = 0;
    client.on('beforeEnvelope', (envelope)=>{
        if (failCount > 3) {
            core.debug.warn('[Spotlight] Disabled Sentry -> Spotlight integration due to too many failed requests:', failCount);
            return;
        }
        makeFetch(sidecarUrl, {
            method: 'POST',
            body: core.serializeEnvelope(envelope),
            headers: {
                'Content-Type': 'application/x-sentry-envelope'
            },
            mode: 'cors'
        }).then((res)=>{
            if (res.status >= 200 && res.status < 400) {
                // Reset failed requests counter on success
                failCount = 0;
            }
        }, (err)=>{
            failCount++;
            core.debug.error("Sentry SDK can't connect to Sidecar is it running? See: https://spotlightjs.com/sidecar/npx/", err);
        });
    });
}
/**
 * Use this integration to send errors and transactions to Spotlight.
 *
 * Learn more about spotlight at https://spotlightjs.com
 */ const spotlightBrowserIntegration = core.defineIntegration(_spotlightIntegration);
/**
 * Flags if the event is a transaction created from an interaction with the spotlight UI.
 */ function isSpotlightInteraction(event) {
    return Boolean(event.type === 'transaction' && event.spans && event.contexts?.trace && event.contexts.trace.op === 'ui.action.click' && event.spans.some(({ description })=>description?.includes('#sentry-spotlight')));
}
exports.INTEGRATION_NAME = INTEGRATION_NAME;
exports.isSpotlightInteraction = isSpotlightInteraction;
exports.spotlightBrowserIntegration = spotlightBrowserIntegration; //# sourceMappingURL=spotlight.js.map
}),
"[project]/node_modules/@sentry/browser/build/npm/cjs/dev/utils/detectBrowserExtension.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const core = __turbopack_context__.r("[project]/node_modules/@sentry/core/build/cjs/index.js [app-client] (ecmascript)");
const debugBuild = __turbopack_context__.r("[project]/node_modules/@sentry/browser/build/npm/cjs/dev/debug-build.js [app-client] (ecmascript)");
const helpers = __turbopack_context__.r("[project]/node_modules/@sentry/browser/build/npm/cjs/dev/helpers.js [app-client] (ecmascript)");
/**
 * Returns true if the SDK is running in an embedded browser extension.
 * Stand-alone browser extensions (which do not share the same data as the main browser page) are fine.
 */ function checkAndWarnIfIsEmbeddedBrowserExtension() {
    if (_isEmbeddedBrowserExtension()) {
        if (debugBuild.DEBUG_BUILD) {
            core.consoleSandbox(()=>{
                // eslint-disable-next-line no-console
                console.error('[Sentry] You cannot use Sentry.init() in a browser extension, see: https://docs.sentry.io/platforms/javascript/best-practices/browser-extensions/');
            });
        }
        return true;
    }
    return false;
}
function _isEmbeddedBrowserExtension() {
    if (typeof helpers.WINDOW.window === 'undefined') {
        // No need to show the error if we're not in a browser window environment (e.g. service workers)
        return false;
    }
    const _window = helpers.WINDOW;
    // Running the SDK in NW.js, which appears like a browser extension but isn't, is also fine
    // see: https://github.com/getsentry/sentry-javascript/issues/12668
    if (_window.nw) {
        return false;
    }
    const extensionObject = _window['chrome'] || _window['browser'];
    if (!extensionObject?.runtime?.id) {
        return false;
    }
    const href = core.getLocationHref();
    const extensionProtocols = [
        'chrome-extension',
        'moz-extension',
        'ms-browser-extension',
        'safari-web-extension'
    ];
    // Running the SDK in a dedicated extension page and calling Sentry.init is fine; no risk of data leakage
    const isDedicatedExtensionPage = helpers.WINDOW === helpers.WINDOW.top && extensionProtocols.some((protocol)=>href.startsWith(`${protocol}://`));
    return !isDedicatedExtensionPage;
}
exports.checkAndWarnIfIsEmbeddedBrowserExtension = checkAndWarnIfIsEmbeddedBrowserExtension; //# sourceMappingURL=detectBrowserExtension.js.map
}),
"[project]/node_modules/@sentry/browser/build/npm/cjs/dev/sdk.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const core = __turbopack_context__.r("[project]/node_modules/@sentry/core/build/cjs/index.js [app-client] (ecmascript)");
const client = __turbopack_context__.r("[project]/node_modules/@sentry/browser/build/npm/cjs/dev/client.js [app-client] (ecmascript)");
const breadcrumbs = __turbopack_context__.r("[project]/node_modules/@sentry/browser/build/npm/cjs/dev/integrations/breadcrumbs.js [app-client] (ecmascript)");
const browserapierrors = __turbopack_context__.r("[project]/node_modules/@sentry/browser/build/npm/cjs/dev/integrations/browserapierrors.js [app-client] (ecmascript)");
const browsersession = __turbopack_context__.r("[project]/node_modules/@sentry/browser/build/npm/cjs/dev/integrations/browsersession.js [app-client] (ecmascript)");
const globalhandlers = __turbopack_context__.r("[project]/node_modules/@sentry/browser/build/npm/cjs/dev/integrations/globalhandlers.js [app-client] (ecmascript)");
const httpcontext = __turbopack_context__.r("[project]/node_modules/@sentry/browser/build/npm/cjs/dev/integrations/httpcontext.js [app-client] (ecmascript)");
const linkederrors = __turbopack_context__.r("[project]/node_modules/@sentry/browser/build/npm/cjs/dev/integrations/linkederrors.js [app-client] (ecmascript)");
const spotlight = __turbopack_context__.r("[project]/node_modules/@sentry/browser/build/npm/cjs/dev/integrations/spotlight.js [app-client] (ecmascript)");
const stackParsers = __turbopack_context__.r("[project]/node_modules/@sentry/browser/build/npm/cjs/dev/stack-parsers.js [app-client] (ecmascript)");
const fetch = __turbopack_context__.r("[project]/node_modules/@sentry/browser/build/npm/cjs/dev/transports/fetch.js [app-client] (ecmascript)");
const detectBrowserExtension = __turbopack_context__.r("[project]/node_modules/@sentry/browser/build/npm/cjs/dev/utils/detectBrowserExtension.js [app-client] (ecmascript)");
/** Get the default integrations for the browser SDK. */ function getDefaultIntegrations(_options) {
    /**
   * Note: Please make sure this stays in sync with Angular SDK, which re-exports
   * `getDefaultIntegrations` but with an adjusted set of integrations.
   */ return [
        // TODO(v11): Replace with `eventFiltersIntegration` once we remove the deprecated `inboundFiltersIntegration`
        // eslint-disable-next-line deprecation/deprecation
        core.inboundFiltersIntegration(),
        core.functionToStringIntegration(),
        browserapierrors.browserApiErrorsIntegration(),
        breadcrumbs.breadcrumbsIntegration(),
        globalhandlers.globalHandlersIntegration(),
        linkederrors.linkedErrorsIntegration(),
        core.dedupeIntegration(),
        httpcontext.httpContextIntegration(),
        browsersession.browserSessionIntegration()
    ];
}
/**
 * The Sentry Browser SDK Client.
 *
 * To use this SDK, call the {@link init} function as early as possible when
 * loading the web page. To set context information or send manual events, use
 * the provided methods.
 *
 * @example
 *
 * ```
 *
 * import { init } from '@sentry/browser';
 *
 * init({
 *   dsn: '__DSN__',
 *   // ...
 * });
 * ```
 *
 * @example
 * ```
 *
 * import { addBreadcrumb } from '@sentry/browser';
 * addBreadcrumb({
 *   message: 'My Breadcrumb',
 *   // ...
 * });
 * ```
 *
 * @example
 *
 * ```
 *
 * import * as Sentry from '@sentry/browser';
 * Sentry.captureMessage('Hello, world!');
 * Sentry.captureException(new Error('Good bye'));
 * Sentry.captureEvent({
 *   message: 'Manual',
 *   stacktrace: [
 *     // ...
 *   ],
 * });
 * ```
 *
 * @see {@link BrowserOptions} for documentation on configuration options.
 */ function init(options = {}) {
    const shouldDisableBecauseIsBrowserExtenstion = !options.skipBrowserExtensionCheck && detectBrowserExtension.checkAndWarnIfIsEmbeddedBrowserExtension();
    let defaultIntegrations = options.defaultIntegrations == null ? getDefaultIntegrations() : options.defaultIntegrations;
    /* rollup-include-development-only */ if (options.spotlight) {
        if (!defaultIntegrations) {
            defaultIntegrations = [];
        }
        const args = typeof options.spotlight === 'string' ? {
            sidecarUrl: options.spotlight
        } : undefined;
        defaultIntegrations.push(spotlight.spotlightBrowserIntegration(args));
    }
    /* rollup-include-development-only-end */ const clientOptions = {
        ...options,
        enabled: shouldDisableBecauseIsBrowserExtenstion ? false : options.enabled,
        stackParser: core.stackParserFromStackParserOptions(options.stackParser || stackParsers.defaultStackParser),
        integrations: core.getIntegrationsToSetup({
            integrations: options.integrations,
            defaultIntegrations
        }),
        transport: options.transport || fetch.makeFetchTransport
    };
    return core.initAndBind(client.BrowserClient, clientOptions);
}
/**
 * This function is here to be API compatible with the loader.
 * @hidden
 */ function forceLoad() {
// Noop
}
/**
 * This function is here to be API compatible with the loader.
 * @hidden
 */ function onLoad(callback) {
    callback();
}
exports.forceLoad = forceLoad;
exports.getDefaultIntegrations = getDefaultIntegrations;
exports.init = init;
exports.onLoad = onLoad; //# sourceMappingURL=sdk.js.map
}),
"[project]/node_modules/@sentry/browser/build/npm/cjs/dev/report-dialog.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const core = __turbopack_context__.r("[project]/node_modules/@sentry/core/build/cjs/index.js [app-client] (ecmascript)");
const debugBuild = __turbopack_context__.r("[project]/node_modules/@sentry/browser/build/npm/cjs/dev/debug-build.js [app-client] (ecmascript)");
const helpers = __turbopack_context__.r("[project]/node_modules/@sentry/browser/build/npm/cjs/dev/helpers.js [app-client] (ecmascript)");
/**
 * Present the user with a report dialog.
 *
 * @param options Everything is optional, we try to fetch all info need from the current scope.
 */ function showReportDialog(options = {}) {
    const optionalDocument = helpers.WINDOW.document;
    const injectionPoint = optionalDocument?.head || optionalDocument?.body;
    // doesn't work without a document (React Native)
    if (!injectionPoint) {
        debugBuild.DEBUG_BUILD && core.debug.error('[showReportDialog] Global document not defined');
        return;
    }
    const scope = core.getCurrentScope();
    const client = core.getClient();
    const dsn = client?.getDsn();
    if (!dsn) {
        debugBuild.DEBUG_BUILD && core.debug.error('[showReportDialog] DSN not configured');
        return;
    }
    const mergedOptions = {
        ...options,
        user: {
            ...scope.getUser(),
            ...options.user
        },
        eventId: options.eventId || core.lastEventId()
    };
    const script = helpers.WINDOW.document.createElement('script');
    script.async = true;
    script.crossOrigin = 'anonymous';
    script.src = core.getReportDialogEndpoint(dsn, mergedOptions);
    const { onLoad, onClose } = mergedOptions;
    if (onLoad) {
        script.onload = onLoad;
    }
    if (onClose) {
        const reportDialogClosedMessageHandler = (event)=>{
            if (event.data === '__sentry_reportdialog_closed__') {
                try {
                    onClose();
                } finally{
                    helpers.WINDOW.removeEventListener('message', reportDialogClosedMessageHandler);
                }
            }
        };
        helpers.WINDOW.addEventListener('message', reportDialogClosedMessageHandler);
    }
    injectionPoint.appendChild(script);
}
exports.showReportDialog = showReportDialog; //# sourceMappingURL=report-dialog.js.map
}),
"[project]/node_modules/@sentry/browser/build/npm/cjs/dev/integrations/reportingobserver.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const core = __turbopack_context__.r("[project]/node_modules/@sentry/core/build/cjs/index.js [app-client] (ecmascript)");
const WINDOW = core.GLOBAL_OBJ;
const INTEGRATION_NAME = 'ReportingObserver';
const SETUP_CLIENTS = new WeakMap();
const _reportingObserverIntegration = (options = {})=>{
    const types = options.types || [
        'crash',
        'deprecation',
        'intervention'
    ];
    /** Handler for the reporting observer. */ function handler(reports) {
        if (!SETUP_CLIENTS.has(core.getClient())) {
            return;
        }
        for (const report of reports){
            core.withScope((scope)=>{
                scope.setExtra('url', report.url);
                const label = `ReportingObserver [${report.type}]`;
                let details = 'No details available';
                if (report.body) {
                    // Object.keys doesn't work on ReportBody, as all properties are inherited
                    const plainBody = {};
                    // eslint-disable-next-line guard-for-in
                    for(const prop in report.body){
                        plainBody[prop] = report.body[prop];
                    }
                    scope.setExtra('body', plainBody);
                    if (report.type === 'crash') {
                        const body = report.body;
                        // A fancy way to create a message out of crashId OR reason OR both OR fallback
                        details = [
                            body.crashId || '',
                            body.reason || ''
                        ].join(' ').trim() || details;
                    } else {
                        const body = report.body;
                        details = body.message || details;
                    }
                }
                core.captureMessage(`${label}: ${details}`);
            });
        }
    }
    return {
        name: INTEGRATION_NAME,
        setupOnce () {
            if (!core.supportsReportingObserver()) {
                return;
            }
            const observer = new WINDOW.ReportingObserver(handler, {
                buffered: true,
                types
            });
            observer.observe();
        },
        setup (client) {
            SETUP_CLIENTS.set(client, true);
        }
    };
};
/**
 * Reporting API integration - https://w3c.github.io/reporting/
 */ const reportingObserverIntegration = core.defineIntegration(_reportingObserverIntegration);
exports.reportingObserverIntegration = reportingObserverIntegration; //# sourceMappingURL=reportingobserver.js.map
}),
"[project]/node_modules/@sentry/browser/build/npm/cjs/dev/integrations/httpclient.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const core = __turbopack_context__.r("[project]/node_modules/@sentry/core/build/cjs/index.js [app-client] (ecmascript)");
const browserUtils = __turbopack_context__.r("[project]/node_modules/@sentry-internal/browser-utils/build/cjs/index.js [app-client] (ecmascript)");
const debugBuild = __turbopack_context__.r("[project]/node_modules/@sentry/browser/build/npm/cjs/dev/debug-build.js [app-client] (ecmascript)");
const INTEGRATION_NAME = 'HttpClient';
const _httpClientIntegration = (options = {})=>{
    const _options = {
        failedRequestStatusCodes: [
            [
                500,
                599
            ]
        ],
        failedRequestTargets: [
            /.*/
        ],
        ...options
    };
    return {
        name: INTEGRATION_NAME,
        setup (client) {
            _wrapFetch(client, _options);
            _wrapXHR(client, _options);
        }
    };
};
/**
 * Create events for failed client side HTTP requests.
 */ const httpClientIntegration = core.defineIntegration(_httpClientIntegration);
/**
 * Interceptor function for fetch requests
 *
 * @param requestInfo The Fetch API request info
 * @param response The Fetch API response
 * @param requestInit The request init object
 */ function _fetchResponseHandler(options, requestInfo, response, requestInit, error) {
    if (_shouldCaptureResponse(options, response.status, response.url)) {
        const request = _getRequest(requestInfo, requestInit);
        let requestHeaders, responseHeaders, requestCookies, responseCookies;
        if (_shouldSendDefaultPii()) {
            [requestHeaders, requestCookies] = _parseCookieHeaders('Cookie', request);
            [responseHeaders, responseCookies] = _parseCookieHeaders('Set-Cookie', response);
        }
        const event = _createEvent({
            url: request.url,
            method: request.method,
            status: response.status,
            requestHeaders,
            responseHeaders,
            requestCookies,
            responseCookies,
            error,
            type: 'fetch'
        });
        core.captureEvent(event);
    }
}
function _parseCookieHeaders(cookieHeader, obj) {
    const headers = _extractFetchHeaders(obj.headers);
    let cookies;
    try {
        const cookieString = headers[cookieHeader] || headers[cookieHeader.toLowerCase()] || undefined;
        if (cookieString) {
            cookies = _parseCookieString(cookieString);
        }
    } catch  {
    // ignore it if parsing fails
    }
    return [
        headers,
        cookies
    ];
}
/**
 * Interceptor function for XHR requests
 *
 * @param xhr The XHR request
 * @param method The HTTP method
 * @param headers The HTTP headers
 */ function _xhrResponseHandler(options, xhr, method, headers, error) {
    if (_shouldCaptureResponse(options, xhr.status, xhr.responseURL)) {
        let requestHeaders, responseCookies, responseHeaders;
        if (_shouldSendDefaultPii()) {
            try {
                const cookieString = xhr.getResponseHeader('Set-Cookie') || xhr.getResponseHeader('set-cookie') || undefined;
                if (cookieString) {
                    responseCookies = _parseCookieString(cookieString);
                }
            } catch  {
            // ignore it if parsing fails
            }
            try {
                responseHeaders = _getXHRResponseHeaders(xhr);
            } catch  {
            // ignore it if parsing fails
            }
            requestHeaders = headers;
        }
        const event = _createEvent({
            url: xhr.responseURL,
            method,
            status: xhr.status,
            requestHeaders,
            // Can't access request cookies from XHR
            responseHeaders,
            responseCookies,
            error,
            type: 'xhr'
        });
        core.captureEvent(event);
    }
}
/**
 * Extracts response size from `Content-Length` header when possible
 *
 * @param headers
 * @returns The response size in bytes or undefined
 */ function _getResponseSizeFromHeaders(headers) {
    if (headers) {
        const contentLength = headers['Content-Length'] || headers['content-length'];
        if (contentLength) {
            return parseInt(contentLength, 10);
        }
    }
    return undefined;
}
/**
 * Creates an object containing cookies from the given cookie string
 *
 * @param cookieString The cookie string to parse
 * @returns The parsed cookies
 */ function _parseCookieString(cookieString) {
    return cookieString.split('; ').reduce((acc, cookie)=>{
        const [key, value] = cookie.split('=');
        if (key && value) {
            acc[key] = value;
        }
        return acc;
    }, {});
}
/**
 * Extracts the headers as an object from the given Fetch API request or response object
 *
 * @param headers The headers to extract
 * @returns The extracted headers as an object
 */ function _extractFetchHeaders(headers) {
    const result = {};
    headers.forEach((value, key)=>{
        result[key] = value;
    });
    return result;
}
/**
 * Extracts the response headers as an object from the given XHR object
 *
 * @param xhr The XHR object to extract the response headers from
 * @returns The response headers as an object
 */ function _getXHRResponseHeaders(xhr) {
    const headers = xhr.getAllResponseHeaders();
    if (!headers) {
        return {};
    }
    return headers.split('\r\n').reduce((acc, line)=>{
        const [key, value] = line.split(': ');
        if (key && value) {
            acc[key] = value;
        }
        return acc;
    }, {});
}
/**
 * Checks if the given target url is in the given list of targets
 *
 * @param target The target url to check
 * @returns true if the target url is in the given list of targets, false otherwise
 */ function _isInGivenRequestTargets(failedRequestTargets, target) {
    return failedRequestTargets.some((givenRequestTarget)=>{
        if (typeof givenRequestTarget === 'string') {
            return target.includes(givenRequestTarget);
        }
        return givenRequestTarget.test(target);
    });
}
/**
 * Checks if the given status code is in the given range
 *
 * @param status The status code to check
 * @returns true if the status code is in the given range, false otherwise
 */ function _isInGivenStatusRanges(failedRequestStatusCodes, status) {
    return failedRequestStatusCodes.some((range)=>{
        if (typeof range === 'number') {
            return range === status;
        }
        return status >= range[0] && status <= range[1];
    });
}
/**
 * Wraps `fetch` function to capture request and response data
 */ function _wrapFetch(client, options) {
    if (!core.supportsNativeFetch()) {
        return;
    }
    core.addFetchInstrumentationHandler((handlerData)=>{
        if (core.getClient() !== client) {
            return;
        }
        const { response, args, error, virtualError } = handlerData;
        const [requestInfo, requestInit] = args;
        if (!response) {
            return;
        }
        _fetchResponseHandler(options, requestInfo, response, requestInit, error || virtualError);
    }, false);
}
/**
 * Wraps XMLHttpRequest to capture request and response data
 */ function _wrapXHR(client, options) {
    if (!('XMLHttpRequest' in core.GLOBAL_OBJ)) {
        return;
    }
    browserUtils.addXhrInstrumentationHandler((handlerData)=>{
        if (core.getClient() !== client) {
            return;
        }
        const { error, virtualError } = handlerData;
        const xhr = handlerData.xhr;
        const sentryXhrData = xhr[browserUtils.SENTRY_XHR_DATA_KEY];
        if (!sentryXhrData) {
            return;
        }
        const { method, request_headers: headers } = sentryXhrData;
        try {
            _xhrResponseHandler(options, xhr, method, headers, error || virtualError);
        } catch (e) {
            debugBuild.DEBUG_BUILD && core.debug.warn('Error while extracting response event form XHR response', e);
        }
    });
}
/**
 * Checks whether to capture given response as an event
 *
 * @param status response status code
 * @param url response url
 */ function _shouldCaptureResponse(options, status, url) {
    return _isInGivenStatusRanges(options.failedRequestStatusCodes, status) && _isInGivenRequestTargets(options.failedRequestTargets, url) && !core.isSentryRequestUrl(url, core.getClient());
}
/**
 * Creates a synthetic Sentry event from given response data
 *
 * @param data response data
 * @returns event
 */ function _createEvent(data) {
    const client = core.getClient();
    const virtualStackTrace = client && data.error && data.error instanceof Error ? data.error.stack : undefined;
    // Remove the first frame from the stack as it's the HttpClient call
    const stack = virtualStackTrace && client ? client.getOptions().stackParser(virtualStackTrace, 0, 1) : undefined;
    const message = `HTTP Client Error with status code: ${data.status}`;
    const event = {
        message,
        exception: {
            values: [
                {
                    type: 'Error',
                    value: message,
                    stacktrace: stack ? {
                        frames: stack
                    } : undefined
                }
            ]
        },
        request: {
            url: data.url,
            method: data.method,
            headers: data.requestHeaders,
            cookies: data.requestCookies
        },
        contexts: {
            response: {
                status_code: data.status,
                headers: data.responseHeaders,
                cookies: data.responseCookies,
                body_size: _getResponseSizeFromHeaders(data.responseHeaders)
            }
        }
    };
    core.addExceptionMechanism(event, {
        type: `auto.http.client.${data.type}`,
        handled: false
    });
    return event;
}
function _getRequest(requestInfo, requestInit) {
    if (!requestInit && requestInfo instanceof Request) {
        return requestInfo;
    }
    // If both are set, we try to construct a new Request with the given arguments
    // However, if e.g. the original request has a `body`, this will throw an error because it was already accessed
    // In this case, as a fallback, we just use the original request - using both is rather an edge case
    if (requestInfo instanceof Request && requestInfo.bodyUsed) {
        return requestInfo;
    }
    return new Request(requestInfo, requestInit);
}
function _shouldSendDefaultPii() {
    const client = core.getClient();
    return client ? Boolean(client.getOptions().sendDefaultPii) : false;
}
exports.httpClientIntegration = httpClientIntegration; //# sourceMappingURL=httpclient.js.map
}),
"[project]/node_modules/@sentry/browser/build/npm/cjs/dev/integrations/contextlines.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const core = __turbopack_context__.r("[project]/node_modules/@sentry/core/build/cjs/index.js [app-client] (ecmascript)");
const WINDOW = core.GLOBAL_OBJ;
const DEFAULT_LINES_OF_CONTEXT = 7;
const INTEGRATION_NAME = 'ContextLines';
const _contextLinesIntegration = (options = {})=>{
    const contextLines = options.frameContextLines != null ? options.frameContextLines : DEFAULT_LINES_OF_CONTEXT;
    return {
        name: INTEGRATION_NAME,
        processEvent (event) {
            return addSourceContext(event, contextLines);
        }
    };
};
/**
 * Collects source context lines around the lines of stackframes pointing to JS embedded in
 * the current page's HTML.
 *
 * This integration DOES NOT work for stack frames pointing to JS files that are loaded by the browser.
 * For frames pointing to files, context lines are added during ingestion and symbolication
 * by attempting to download the JS files to the Sentry backend.
 *
 * Use this integration if you have inline JS code in HTML pages that can't be accessed
 * by our backend (e.g. due to a login-protected page).
 */ const contextLinesIntegration = core.defineIntegration(_contextLinesIntegration);
/**
 * Processes an event and adds context lines.
 */ function addSourceContext(event, contextLines) {
    const doc = WINDOW.document;
    const htmlFilename = WINDOW.location && core.stripUrlQueryAndFragment(WINDOW.location.href);
    if (!doc || !htmlFilename) {
        return event;
    }
    const exceptions = event.exception?.values;
    if (!exceptions?.length) {
        return event;
    }
    const html = doc.documentElement.innerHTML;
    if (!html) {
        return event;
    }
    const htmlLines = [
        '<!DOCTYPE html>',
        '<html>',
        ...html.split('\n'),
        '</html>'
    ];
    exceptions.forEach((exception)=>{
        const stacktrace = exception.stacktrace;
        if (stacktrace?.frames) {
            stacktrace.frames = stacktrace.frames.map((frame)=>applySourceContextToFrame(frame, htmlLines, htmlFilename, contextLines));
        }
    });
    return event;
}
/**
 * Only exported for testing
 */ function applySourceContextToFrame(frame, htmlLines, htmlFilename, linesOfContext) {
    if (frame.filename !== htmlFilename || !frame.lineno || !htmlLines.length) {
        return frame;
    }
    core.addContextToFrame(htmlLines, frame, linesOfContext);
    return frame;
}
exports.applySourceContextToFrame = applySourceContextToFrame;
exports.contextLinesIntegration = contextLinesIntegration; //# sourceMappingURL=contextlines.js.map
}),
"[project]/node_modules/@sentry/browser/build/npm/cjs/dev/integrations/graphqlClient.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const core = __turbopack_context__.r("[project]/node_modules/@sentry/core/build/cjs/index.js [app-client] (ecmascript)");
const browserUtils = __turbopack_context__.r("[project]/node_modules/@sentry-internal/browser-utils/build/cjs/index.js [app-client] (ecmascript)");
const INTEGRATION_NAME = 'GraphQLClient';
const _graphqlClientIntegration = (options)=>{
    return {
        name: INTEGRATION_NAME,
        setup (client) {
            _updateSpanWithGraphQLData(client, options);
            _updateBreadcrumbWithGraphQLData(client, options);
        }
    };
};
function _updateSpanWithGraphQLData(client, options) {
    client.on('beforeOutgoingRequestSpan', (span, hint)=>{
        const spanJSON = core.spanToJSON(span);
        const spanAttributes = spanJSON.data || {};
        const spanOp = spanAttributes[core.SEMANTIC_ATTRIBUTE_SENTRY_OP];
        const isHttpClientSpan = spanOp === 'http.client';
        if (!isHttpClientSpan) {
            return;
        }
        const httpUrl = spanAttributes[core.SEMANTIC_ATTRIBUTE_URL_FULL] || spanAttributes['http.url'];
        const httpMethod = spanAttributes[core.SEMANTIC_ATTRIBUTE_HTTP_REQUEST_METHOD] || spanAttributes['http.method'];
        if (!core.isString(httpUrl) || !core.isString(httpMethod)) {
            return;
        }
        const { endpoints } = options;
        const isTracedGraphqlEndpoint = core.stringMatchesSomePattern(httpUrl, endpoints);
        const payload = getRequestPayloadXhrOrFetch(hint);
        if (isTracedGraphqlEndpoint && payload) {
            const graphqlBody = getGraphQLRequestPayload(payload);
            if (graphqlBody) {
                const operationInfo = _getGraphQLOperation(graphqlBody);
                span.updateName(`${httpMethod} ${httpUrl} (${operationInfo})`);
                span.setAttribute('graphql.document', payload);
            }
        }
    });
}
function _updateBreadcrumbWithGraphQLData(client, options) {
    client.on('beforeOutgoingRequestBreadcrumb', (breadcrumb, handlerData)=>{
        const { category, type, data } = breadcrumb;
        const isFetch = category === 'fetch';
        const isXhr = category === 'xhr';
        const isHttpBreadcrumb = type === 'http';
        if (isHttpBreadcrumb && (isFetch || isXhr)) {
            const httpUrl = data?.url;
            const { endpoints } = options;
            const isTracedGraphqlEndpoint = core.stringMatchesSomePattern(httpUrl, endpoints);
            const payload = getRequestPayloadXhrOrFetch(handlerData);
            if (isTracedGraphqlEndpoint && data && payload) {
                const graphqlBody = getGraphQLRequestPayload(payload);
                if (!data.graphql && graphqlBody) {
                    const operationInfo = _getGraphQLOperation(graphqlBody);
                    data['graphql.document'] = graphqlBody.query;
                    data['graphql.operation'] = operationInfo;
                }
            }
        }
    });
}
/**
 * @param requestBody - GraphQL request
 * @returns A formatted version of the request: 'TYPE NAME' or 'TYPE'
 */ function _getGraphQLOperation(requestBody) {
    const { query: graphqlQuery, operationName: graphqlOperationName } = requestBody;
    const { operationName = graphqlOperationName, operationType } = parseGraphQLQuery(graphqlQuery);
    const operationInfo = operationName ? `${operationType} ${operationName}` : `${operationType}`;
    return operationInfo;
}
/**
 * Get the request body/payload based on the shape of the hint.
 *
 * Exported for tests only.
 */ function getRequestPayloadXhrOrFetch(hint) {
    const isXhr = 'xhr' in hint;
    let body;
    if (isXhr) {
        const sentryXhrData = hint.xhr[browserUtils.SENTRY_XHR_DATA_KEY];
        body = sentryXhrData && browserUtils.getBodyString(sentryXhrData.body)[0];
    } else {
        const sentryFetchData = browserUtils.getFetchRequestArgBody(hint.input);
        body = browserUtils.getBodyString(sentryFetchData)[0];
    }
    return body;
}
/**
 * Extract the name and type of the operation from the GraphQL query.
 *
 * Exported for tests only.
 */ function parseGraphQLQuery(query) {
    const namedQueryRe = /^(?:\s*)(query|mutation|subscription)(?:\s*)(\w+)(?:\s*)[{(]/;
    const unnamedQueryRe = /^(?:\s*)(query|mutation|subscription)(?:\s*)[{(]/;
    const namedMatch = query.match(namedQueryRe);
    if (namedMatch) {
        return {
            operationType: namedMatch[1],
            operationName: namedMatch[2]
        };
    }
    const unnamedMatch = query.match(unnamedQueryRe);
    if (unnamedMatch) {
        return {
            operationType: unnamedMatch[1],
            operationName: undefined
        };
    }
    return {
        operationType: undefined,
        operationName: undefined
    };
}
/**
 * Extract the payload of a request if it's GraphQL.
 * Exported for tests only.
 * @param payload - A valid JSON string
 * @returns A POJO or undefined
 */ function getGraphQLRequestPayload(payload) {
    let graphqlBody = undefined;
    try {
        const requestBody = JSON.parse(payload);
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        const isGraphQLRequest = !!requestBody['query'];
        if (isGraphQLRequest) {
            graphqlBody = requestBody;
        }
    } finally{
        // Fallback to undefined if payload is an invalid JSON (SyntaxError)
        /* eslint-disable no-unsafe-finally */ return graphqlBody;
    }
}
/**
 * This integration ensures that GraphQL requests made in the browser
 * have their GraphQL-specific data captured and attached to spans and breadcrumbs.
 */ const graphqlClientIntegration = core.defineIntegration(_graphqlClientIntegration);
exports.getGraphQLRequestPayload = getGraphQLRequestPayload;
exports.getRequestPayloadXhrOrFetch = getRequestPayloadXhrOrFetch;
exports.graphqlClientIntegration = graphqlClientIntegration;
exports.parseGraphQLQuery = parseGraphQLQuery; //# sourceMappingURL=graphqlClient.js.map
}),
"[project]/node_modules/@sentry/browser/build/npm/cjs/dev/tracing/utils.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const helpers = __turbopack_context__.r("[project]/node_modules/@sentry/browser/build/npm/cjs/dev/helpers.js [app-client] (ecmascript)");
/**
 * Checks if the baggage header has Sentry values.
 */ function baggageHeaderHasSentryValues(baggageHeader) {
    return baggageHeader.split(',').some((value)=>value.trim().startsWith('sentry-'));
}
/**
 * Gets the full URL from a given URL string.
 */ function getFullURL(url) {
    try {
        // By adding a base URL to new URL(), this will also work for relative urls
        // If `url` is a full URL, the base URL is ignored anyhow
        const parsed = new URL(url, helpers.WINDOW.location.origin);
        return parsed.href;
    } catch  {
        return undefined;
    }
}
/**
 * Checks if the entry is a PerformanceResourceTiming.
 */ function isPerformanceResourceTiming(entry) {
    return entry.entryType === 'resource' && 'initiatorType' in entry && typeof entry.nextHopProtocol === 'string' && (entry.initiatorType === 'fetch' || entry.initiatorType === 'xmlhttprequest');
}
/**
 * Creates a Headers object from a record of string key-value pairs, and returns undefined if it fails.
 */ function createHeadersSafely(headers) {
    try {
        return new Headers(headers);
    } catch  {
        // noop
        return undefined;
    }
}
exports.baggageHeaderHasSentryValues = baggageHeaderHasSentryValues;
exports.createHeadersSafely = createHeadersSafely;
exports.getFullURL = getFullURL;
exports.isPerformanceResourceTiming = isPerformanceResourceTiming; //# sourceMappingURL=utils.js.map
}),
"[project]/node_modules/@sentry/browser/build/npm/cjs/dev/tracing/request.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const core = __turbopack_context__.r("[project]/node_modules/@sentry/core/build/cjs/index.js [app-client] (ecmascript)");
const browserUtils = __turbopack_context__.r("[project]/node_modules/@sentry-internal/browser-utils/build/cjs/index.js [app-client] (ecmascript)");
const utils = __turbopack_context__.r("[project]/node_modules/@sentry/browser/build/npm/cjs/dev/tracing/utils.js [app-client] (ecmascript)");
/** Options for Request Instrumentation */ const responseToSpanId = new WeakMap();
const spanIdToEndTimestamp = new Map();
const defaultRequestInstrumentationOptions = {
    traceFetch: true,
    traceXHR: true,
    enableHTTPTimings: true,
    trackFetchStreamPerformance: false
};
/** Registers span creators for xhr and fetch requests  */ function instrumentOutgoingRequests(client, _options) {
    const { traceFetch, traceXHR, trackFetchStreamPerformance, shouldCreateSpanForRequest, enableHTTPTimings, tracePropagationTargets, onRequestSpanStart, onRequestSpanEnd } = {
        ...defaultRequestInstrumentationOptions,
        ..._options
    };
    const shouldCreateSpan = typeof shouldCreateSpanForRequest === 'function' ? shouldCreateSpanForRequest : (_)=>true;
    const shouldAttachHeadersWithTargets = (url)=>shouldAttachHeaders(url, tracePropagationTargets);
    const spans = {};
    const propagateTraceparent = client.getOptions().propagateTraceparent;
    if (traceFetch) {
        // Keeping track of http requests, whose body payloads resolved later than the initial resolved request
        // e.g. streaming using server sent events (SSE)
        client.addEventProcessor((event)=>{
            if (event.type === 'transaction' && event.spans) {
                event.spans.forEach((span)=>{
                    if (span.op === 'http.client') {
                        const updatedTimestamp = spanIdToEndTimestamp.get(span.span_id);
                        if (updatedTimestamp) {
                            span.timestamp = updatedTimestamp / 1000;
                            spanIdToEndTimestamp.delete(span.span_id);
                        }
                    }
                });
            }
            return event;
        });
        if (trackFetchStreamPerformance) {
            core.addFetchEndInstrumentationHandler((handlerData)=>{
                if (handlerData.response) {
                    const span = responseToSpanId.get(handlerData.response);
                    if (span && handlerData.endTimestamp) {
                        spanIdToEndTimestamp.set(span, handlerData.endTimestamp);
                    }
                }
            });
        }
        core.addFetchInstrumentationHandler((handlerData)=>{
            const createdSpan = core.instrumentFetchRequest(handlerData, shouldCreateSpan, shouldAttachHeadersWithTargets, spans, {
                propagateTraceparent,
                onRequestSpanEnd
            });
            if (handlerData.response && handlerData.fetchData.__span) {
                responseToSpanId.set(handlerData.response, handlerData.fetchData.__span);
            }
            // We cannot use `window.location` in the generic fetch instrumentation,
            // but we need it for reliable `server.address` attribute.
            // so we extend this in here
            if (createdSpan) {
                const fullUrl = utils.getFullURL(handlerData.fetchData.url);
                const host = fullUrl ? core.parseUrl(fullUrl).host : undefined;
                createdSpan.setAttributes({
                    'http.url': fullUrl,
                    'server.address': host
                });
                if (enableHTTPTimings) {
                    addHTTPTimings(createdSpan);
                }
                onRequestSpanStart?.(createdSpan, {
                    headers: handlerData.headers
                });
            }
        });
    }
    if (traceXHR) {
        browserUtils.addXhrInstrumentationHandler((handlerData)=>{
            const createdSpan = xhrCallback(handlerData, shouldCreateSpan, shouldAttachHeadersWithTargets, spans, propagateTraceparent, onRequestSpanEnd);
            if (createdSpan) {
                if (enableHTTPTimings) {
                    addHTTPTimings(createdSpan);
                }
                onRequestSpanStart?.(createdSpan, {
                    headers: utils.createHeadersSafely(handlerData.xhr.__sentry_xhr_v3__?.request_headers)
                });
            }
        });
    }
}
/**
 * Creates a temporary observer to listen to the next fetch/xhr resourcing timings,
 * so that when timings hit their per-browser limit they don't need to be removed.
 *
 * @param span A span that has yet to be finished, must contain `url` on data.
 */ function addHTTPTimings(span) {
    const { url } = core.spanToJSON(span).data;
    if (!url || typeof url !== 'string') {
        return;
    }
    const cleanup = browserUtils.addPerformanceInstrumentationHandler('resource', ({ entries })=>{
        entries.forEach((entry)=>{
            if (utils.isPerformanceResourceTiming(entry) && entry.name.endsWith(url)) {
                span.setAttributes(browserUtils.resourceTimingToSpanAttributes(entry));
                // In the next tick, clean this handler up
                // We have to wait here because otherwise this cleans itself up before it is fully done
                setTimeout(cleanup);
            }
        });
    });
}
/**
 * A function that determines whether to attach tracing headers to a request.
 * We only export this function for testing purposes.
 */ function shouldAttachHeaders(targetUrl, tracePropagationTargets) {
    // window.location.href not being defined is an edge case in the browser but we need to handle it.
    // Potentially dangerous situations where it may not be defined: Browser Extensions, Web Workers, patching of the location obj
    const href = core.getLocationHref();
    if (!href) {
        // If there is no window.location.origin, we default to only attaching tracing headers to relative requests, i.e. ones that start with `/`
        // BIG DISCLAIMER: Users can call URLs with a double slash (fetch("//example.com/api")), this is a shorthand for "send to the same protocol",
        // so we need a to exclude those requests, because they might be cross origin.
        const isRelativeSameOriginRequest = !!targetUrl.match(/^\/(?!\/)/);
        if (!tracePropagationTargets) {
            return isRelativeSameOriginRequest;
        } else {
            return core.stringMatchesSomePattern(targetUrl, tracePropagationTargets);
        }
    } else {
        let resolvedUrl;
        let currentOrigin;
        // URL parsing may fail, we default to not attaching trace headers in that case.
        try {
            resolvedUrl = new URL(targetUrl, href);
            currentOrigin = new URL(href).origin;
        } catch  {
            return false;
        }
        const isSameOriginRequest = resolvedUrl.origin === currentOrigin;
        if (!tracePropagationTargets) {
            return isSameOriginRequest;
        } else {
            return core.stringMatchesSomePattern(resolvedUrl.toString(), tracePropagationTargets) || isSameOriginRequest && core.stringMatchesSomePattern(resolvedUrl.pathname, tracePropagationTargets);
        }
    }
}
/**
 * Create and track xhr request spans
 *
 * @returns Span if a span was created, otherwise void.
 */ function xhrCallback(handlerData, shouldCreateSpan, shouldAttachHeaders, spans, propagateTraceparent, onRequestSpanEnd) {
    const xhr = handlerData.xhr;
    const sentryXhrData = xhr?.[browserUtils.SENTRY_XHR_DATA_KEY];
    if (!xhr || xhr.__sentry_own_request__ || !sentryXhrData) {
        return undefined;
    }
    const { url, method } = sentryXhrData;
    const shouldCreateSpanResult = core.hasSpansEnabled() && shouldCreateSpan(url);
    // check first if the request has finished and is tracked by an existing span which should now end
    if (handlerData.endTimestamp && shouldCreateSpanResult) {
        const spanId = xhr.__sentry_xhr_span_id__;
        if (!spanId) return;
        const span = spans[spanId];
        if (span && sentryXhrData.status_code !== undefined) {
            core.setHttpStatus(span, sentryXhrData.status_code);
            span.end();
            onRequestSpanEnd?.(span, {
                headers: utils.createHeadersSafely(browserUtils.parseXhrResponseHeaders(xhr)),
                error: handlerData.error
            });
            // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
            delete spans[spanId];
        }
        return undefined;
    }
    const fullUrl = utils.getFullURL(url);
    const parsedUrl = fullUrl ? core.parseUrl(fullUrl) : core.parseUrl(url);
    const urlForSpanName = core.stripUrlQueryAndFragment(url);
    const hasParent = !!core.getActiveSpan();
    const span = shouldCreateSpanResult && hasParent ? core.startInactiveSpan({
        name: `${method} ${urlForSpanName}`,
        attributes: {
            url,
            type: 'xhr',
            'http.method': method,
            'http.url': fullUrl,
            'server.address': parsedUrl?.host,
            [core.SEMANTIC_ATTRIBUTE_SENTRY_ORIGIN]: 'auto.http.browser',
            [core.SEMANTIC_ATTRIBUTE_SENTRY_OP]: 'http.client',
            ...parsedUrl?.search && {
                'http.query': parsedUrl?.search
            },
            ...parsedUrl?.hash && {
                'http.fragment': parsedUrl?.hash
            }
        }
    }) : new core.SentryNonRecordingSpan();
    xhr.__sentry_xhr_span_id__ = span.spanContext().spanId;
    spans[xhr.__sentry_xhr_span_id__] = span;
    if (shouldAttachHeaders(url)) {
        addTracingHeadersToXhrRequest(xhr, // If performance is disabled (TWP) or there's no active root span (pageload/navigation/interaction),
        // we do not want to use the span as base for the trace headers,
        // which means that the headers will be generated from the scope and the sampling decision is deferred
        core.hasSpansEnabled() && hasParent ? span : undefined, propagateTraceparent);
    }
    const client = core.getClient();
    if (client) {
        client.emit('beforeOutgoingRequestSpan', span, handlerData);
    }
    return span;
}
function addTracingHeadersToXhrRequest(xhr, span, propagateTraceparent) {
    const { 'sentry-trace': sentryTrace, baggage, traceparent } = core.getTraceData({
        span,
        propagateTraceparent
    });
    if (sentryTrace) {
        setHeaderOnXhr(xhr, sentryTrace, baggage, traceparent);
    }
}
function setHeaderOnXhr(xhr, sentryTraceHeader, sentryBaggageHeader, traceparentHeader) {
    const originalHeaders = xhr.__sentry_xhr_v3__?.request_headers;
    if (originalHeaders?.['sentry-trace'] || !xhr.setRequestHeader) {
        // bail if a sentry-trace header is already set
        return;
    }
    try {
        xhr.setRequestHeader('sentry-trace', sentryTraceHeader);
        if (traceparentHeader && !originalHeaders?.['traceparent']) {
            xhr.setRequestHeader('traceparent', traceparentHeader);
        }
        if (sentryBaggageHeader) {
            // only add our headers if
            // - no pre-existing baggage header exists
            // - or it is set and doesn't yet contain sentry values
            const originalBaggageHeader = originalHeaders?.['baggage'];
            if (!originalBaggageHeader || !utils.baggageHeaderHasSentryValues(originalBaggageHeader)) {
                // From MDN: "If this method is called several times with the same header, the values are merged into one single request header."
                // We can therefore simply set a baggage header without checking what was there before
                // https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/setRequestHeader
                xhr.setRequestHeader('baggage', sentryBaggageHeader);
            }
        }
    } catch  {
    // Error: InvalidStateError: Failed to execute 'setRequestHeader' on 'XMLHttpRequest': The object's state must be OPENED.
    }
}
exports.defaultRequestInstrumentationOptions = defaultRequestInstrumentationOptions;
exports.instrumentOutgoingRequests = instrumentOutgoingRequests;
exports.shouldAttachHeaders = shouldAttachHeaders; //# sourceMappingURL=request.js.map
}),
"[project]/node_modules/@sentry/browser/build/npm/cjs/dev/tracing/backgroundtab.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const core = __turbopack_context__.r("[project]/node_modules/@sentry/core/build/cjs/index.js [app-client] (ecmascript)");
const debugBuild = __turbopack_context__.r("[project]/node_modules/@sentry/browser/build/npm/cjs/dev/debug-build.js [app-client] (ecmascript)");
const helpers = __turbopack_context__.r("[project]/node_modules/@sentry/browser/build/npm/cjs/dev/helpers.js [app-client] (ecmascript)");
/**
 * Add a listener that cancels and finishes a transaction when the global
 * document is hidden.
 */ function registerBackgroundTabDetection() {
    if (helpers.WINDOW.document) {
        helpers.WINDOW.document.addEventListener('visibilitychange', ()=>{
            const activeSpan = core.getActiveSpan();
            if (!activeSpan) {
                return;
            }
            const rootSpan = core.getRootSpan(activeSpan);
            if (helpers.WINDOW.document.hidden && rootSpan) {
                const cancelledStatus = 'cancelled';
                const { op, status } = core.spanToJSON(rootSpan);
                if (debugBuild.DEBUG_BUILD) {
                    core.debug.log(`[Tracing] Transaction: ${cancelledStatus} -> since tab moved to the background, op: ${op}`);
                }
                // We should not set status if it is already set, this prevent important statuses like
                // error or data loss from being overwritten on transaction.
                if (!status) {
                    rootSpan.setStatus({
                        code: core.SPAN_STATUS_ERROR,
                        message: cancelledStatus
                    });
                }
                rootSpan.setAttribute('sentry.cancellation_reason', 'document.hidden');
                rootSpan.end();
            }
        });
    } else {
        debugBuild.DEBUG_BUILD && core.debug.warn('[Tracing] Could not set up background tab detection due to lack of global document');
    }
}
exports.registerBackgroundTabDetection = registerBackgroundTabDetection; //# sourceMappingURL=backgroundtab.js.map
}),
"[project]/node_modules/@sentry/browser/build/npm/cjs/dev/tracing/linkedTraces.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const core = __turbopack_context__.r("[project]/node_modules/@sentry/core/build/cjs/index.js [app-client] (ecmascript)");
const debugBuild = __turbopack_context__.r("[project]/node_modules/@sentry/browser/build/npm/cjs/dev/debug-build.js [app-client] (ecmascript)");
const helpers = __turbopack_context__.r("[project]/node_modules/@sentry/browser/build/npm/cjs/dev/helpers.js [app-client] (ecmascript)");
__turbopack_context__.r("[project]/node_modules/@sentry-internal/browser-utils/build/cjs/index.js [app-client] (ecmascript)");
__turbopack_context__.r("[project]/node_modules/@sentry/browser/build/npm/cjs/dev/stack-parsers.js [app-client] (ecmascript)");
__turbopack_context__.r("[project]/node_modules/@sentry/browser/build/npm/cjs/dev/integrations/breadcrumbs.js [app-client] (ecmascript)");
__turbopack_context__.r("[project]/node_modules/@sentry/browser/build/npm/cjs/dev/integrations/browserapierrors.js [app-client] (ecmascript)");
__turbopack_context__.r("[project]/node_modules/@sentry/browser/build/npm/cjs/dev/integrations/browsersession.js [app-client] (ecmascript)");
__turbopack_context__.r("[project]/node_modules/@sentry/browser/build/npm/cjs/dev/integrations/globalhandlers.js [app-client] (ecmascript)");
__turbopack_context__.r("[project]/node_modules/@sentry/browser/build/npm/cjs/dev/integrations/httpcontext.js [app-client] (ecmascript)");
__turbopack_context__.r("[project]/node_modules/@sentry/browser/build/npm/cjs/dev/integrations/linkederrors.js [app-client] (ecmascript)");
__turbopack_context__.r("[project]/node_modules/@sentry/browser/build/npm/cjs/dev/integrations/spotlight.js [app-client] (ecmascript)");
// 1h in seconds
const PREVIOUS_TRACE_MAX_DURATION = 3600;
// session storage key
const PREVIOUS_TRACE_KEY = 'sentry_previous_trace';
const PREVIOUS_TRACE_TMP_SPAN_ATTRIBUTE = 'sentry.previous_trace';
/**
 * Takes care of linking traces and applying the (consistent) sampling behavoiour based on the passed options
 * @param options - options for linking traces and consistent trace sampling (@see BrowserTracingOptions)
 * @param client - Sentry client
 */ function linkTraces(client, { linkPreviousTrace, consistentTraceSampling }) {
    const useSessionStorage = linkPreviousTrace === 'session-storage';
    let inMemoryPreviousTraceInfo = useSessionStorage ? getPreviousTraceFromSessionStorage() : undefined;
    client.on('spanStart', (span)=>{
        if (core.getRootSpan(span) !== span) {
            return;
        }
        const oldPropagationContext = core.getCurrentScope().getPropagationContext();
        inMemoryPreviousTraceInfo = addPreviousTraceSpanLink(inMemoryPreviousTraceInfo, span, oldPropagationContext);
        if (useSessionStorage) {
            storePreviousTraceInSessionStorage(inMemoryPreviousTraceInfo);
        }
    });
    let isFirstTraceOnPageload = true;
    if (consistentTraceSampling) {
        /*
    When users opt into `consistentTraceSampling`, we need to ensure that we propagate
    the previous trace's sample rate and rand to the current trace. This is necessary because otherwise, span
    metric extrapolation is inaccurate, as we'd propagate too high of a sample rate for the subsequent traces.

    So therefore, we pretend that the previous trace was the parent trace of the newly started trace. To do that,
    we mutate the propagation context of the current trace and set the sample rate and sample rand of the previous trace.
    Timing-wise, it is fine because it happens before we even sample the root span.

    @see https://github.com/getsentry/sentry-javascript/issues/15754
    */ client.on('beforeSampling', (mutableSamplingContextData)=>{
            if (!inMemoryPreviousTraceInfo) {
                return;
            }
            const scope = core.getCurrentScope();
            const currentPropagationContext = scope.getPropagationContext();
            // We do not want to force-continue the sampling decision if we continue a trace
            // that was started on the backend. Most prominently, this will happen in MPAs where
            // users hard-navigate between pages. In this case, the sampling decision of a potentially
            // started trace on the server takes precedence.
            // Why? We want to prioritize inter-trace consistency over intra-trace consistency.
            if (isFirstTraceOnPageload && currentPropagationContext.parentSpanId) {
                isFirstTraceOnPageload = false;
                return;
            }
            scope.setPropagationContext({
                ...currentPropagationContext,
                dsc: {
                    ...currentPropagationContext.dsc,
                    sample_rate: String(inMemoryPreviousTraceInfo.sampleRate),
                    sampled: String(spanContextSampled(inMemoryPreviousTraceInfo.spanContext))
                },
                sampleRand: inMemoryPreviousTraceInfo.sampleRand
            });
            mutableSamplingContextData.parentSampled = spanContextSampled(inMemoryPreviousTraceInfo.spanContext);
            mutableSamplingContextData.parentSampleRate = inMemoryPreviousTraceInfo.sampleRate;
            mutableSamplingContextData.spanAttributes = {
                ...mutableSamplingContextData.spanAttributes,
                [core.SEMANTIC_ATTRIBUTE_SENTRY_PREVIOUS_TRACE_SAMPLE_RATE]: inMemoryPreviousTraceInfo.sampleRate
            };
        });
    }
}
/**
 * Adds a previous_trace span link to the passed span if the passed
 * previousTraceInfo is still valid.
 *
 * @returns the updated previous trace info (based on the current span/trace) to
 * be used on the next call
 */ function addPreviousTraceSpanLink(previousTraceInfo, span, oldPropagationContext) {
    const spanJson = core.spanToJSON(span);
    function getSampleRate() {
        try {
            return Number(oldPropagationContext.dsc?.sample_rate) ?? Number(spanJson.data?.[core.SEMANTIC_ATTRIBUTE_SENTRY_SAMPLE_RATE]);
        } catch  {
            return 0;
        }
    }
    const updatedPreviousTraceInfo = {
        spanContext: span.spanContext(),
        startTimestamp: spanJson.start_timestamp,
        sampleRate: getSampleRate(),
        sampleRand: oldPropagationContext.sampleRand
    };
    if (!previousTraceInfo) {
        return updatedPreviousTraceInfo;
    }
    const previousTraceSpanCtx = previousTraceInfo.spanContext;
    if (previousTraceSpanCtx.traceId === spanJson.trace_id) {
        // This means, we're still in the same trace so let's not update the previous trace info
        // or add a link to the current span.
        // Once we move away from the long-lived, route-based trace model, we can remove this cases
        return previousTraceInfo;
    }
    // Only add the link if the startTimeStamp of the previous trace's root span is within
    // PREVIOUS_TRACE_MAX_DURATION (1h) of the current root span's startTimestamp
    // This is done to
    // - avoid adding links to "stale" traces
    // - enable more efficient querying for previous/next traces in Sentry
    if (Date.now() / 1000 - previousTraceInfo.startTimestamp <= PREVIOUS_TRACE_MAX_DURATION) {
        if (debugBuild.DEBUG_BUILD) {
            core.debug.log(`Adding previous_trace ${previousTraceSpanCtx} link to span ${{
                op: spanJson.op,
                ...span.spanContext()
            }}`);
        }
        span.addLink({
            context: previousTraceSpanCtx,
            attributes: {
                [core.SEMANTIC_LINK_ATTRIBUTE_LINK_TYPE]: 'previous_trace'
            }
        });
        // TODO: Remove this once EAP can store span links. We currently only set this attribute so that we
        // can obtain the previous trace information from the EAP store. Long-term, EAP will handle
        // span links and then we should remove this again. Also throwing in a TODO(v11), to remind us
        // to check this at v11 time :)
        span.setAttribute(PREVIOUS_TRACE_TMP_SPAN_ATTRIBUTE, `${previousTraceSpanCtx.traceId}-${previousTraceSpanCtx.spanId}-${spanContextSampled(previousTraceSpanCtx) ? 1 : 0}`);
    }
    return updatedPreviousTraceInfo;
}
/**
 * Stores @param previousTraceInfo in sessionStorage.
 */ function storePreviousTraceInSessionStorage(previousTraceInfo) {
    try {
        helpers.WINDOW.sessionStorage.setItem(PREVIOUS_TRACE_KEY, JSON.stringify(previousTraceInfo));
    } catch (e) {
        // Ignore potential errors (e.g. if sessionStorage is not available)
        debugBuild.DEBUG_BUILD && core.debug.warn('Could not store previous trace in sessionStorage', e);
    }
}
/**
 * Retrieves the previous trace from sessionStorage if available.
 */ function getPreviousTraceFromSessionStorage() {
    try {
        const previousTraceInfo = helpers.WINDOW.sessionStorage?.getItem(PREVIOUS_TRACE_KEY);
        // @ts-expect-error - intentionally risking JSON.parse throwing when previousTraceInfo is null to save bundle size
        return JSON.parse(previousTraceInfo);
    } catch  {
        return undefined;
    }
}
/**
 * see {@link import('@sentry/core').spanIsSampled}
 */ function spanContextSampled(ctx) {
    return ctx.traceFlags === 0x1;
}
exports.PREVIOUS_TRACE_KEY = PREVIOUS_TRACE_KEY;
exports.PREVIOUS_TRACE_MAX_DURATION = PREVIOUS_TRACE_MAX_DURATION;
exports.PREVIOUS_TRACE_TMP_SPAN_ATTRIBUTE = PREVIOUS_TRACE_TMP_SPAN_ATTRIBUTE;
exports.addPreviousTraceSpanLink = addPreviousTraceSpanLink;
exports.getPreviousTraceFromSessionStorage = getPreviousTraceFromSessionStorage;
exports.linkTraces = linkTraces;
exports.spanContextSampled = spanContextSampled;
exports.storePreviousTraceInSessionStorage = storePreviousTraceInSessionStorage; //# sourceMappingURL=linkedTraces.js.map
}),
"[project]/node_modules/@sentry/browser/build/npm/cjs/dev/tracing/browserTracingIntegration.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const core = __turbopack_context__.r("[project]/node_modules/@sentry/core/build/cjs/index.js [app-client] (ecmascript)");
const browserUtils = __turbopack_context__.r("[project]/node_modules/@sentry-internal/browser-utils/build/cjs/index.js [app-client] (ecmascript)");
const debugBuild = __turbopack_context__.r("[project]/node_modules/@sentry/browser/build/npm/cjs/dev/debug-build.js [app-client] (ecmascript)");
const helpers = __turbopack_context__.r("[project]/node_modules/@sentry/browser/build/npm/cjs/dev/helpers.js [app-client] (ecmascript)");
const backgroundtab = __turbopack_context__.r("[project]/node_modules/@sentry/browser/build/npm/cjs/dev/tracing/backgroundtab.js [app-client] (ecmascript)");
const linkedTraces = __turbopack_context__.r("[project]/node_modules/@sentry/browser/build/npm/cjs/dev/tracing/linkedTraces.js [app-client] (ecmascript)");
const request = __turbopack_context__.r("[project]/node_modules/@sentry/browser/build/npm/cjs/dev/tracing/request.js [app-client] (ecmascript)");
const BROWSER_TRACING_INTEGRATION_ID = 'BrowserTracing';
const DEFAULT_BROWSER_TRACING_OPTIONS = {
    ...core.TRACING_DEFAULTS,
    instrumentNavigation: true,
    instrumentPageLoad: true,
    markBackgroundSpan: true,
    enableLongTask: true,
    enableLongAnimationFrame: true,
    enableInp: true,
    enableElementTiming: true,
    ignoreResourceSpans: [],
    ignorePerformanceApiSpans: [],
    detectRedirects: true,
    linkPreviousTrace: 'in-memory',
    consistentTraceSampling: false,
    enableReportPageLoaded: false,
    _experiments: {},
    ...request.defaultRequestInstrumentationOptions
};
/**
 * The Browser Tracing integration automatically instruments browser pageload/navigation
 * actions as transactions, and captures requests, metrics and errors as spans.
 *
 * The integration can be configured with a variety of options, and can be extended to use
 * any routing library.
 *
 * We explicitly export the proper type here, as this has to be extended in some cases.
 */ const browserTracingIntegration = (options = {})=>{
    const latestRoute = {
        name: undefined,
        source: undefined
    };
    /**
   * This is just a small wrapper that makes `document` optional.
   * We want to be extra-safe and always check that this exists, to ensure weird environments do not blow up.
   */ const optionalWindowDocument = helpers.WINDOW.document;
    const { enableInp, enableElementTiming, enableLongTask, enableLongAnimationFrame, _experiments: { enableInteractions, enableStandaloneClsSpans, enableStandaloneLcpSpans }, beforeStartSpan, idleTimeout, finalTimeout, childSpanTimeout, markBackgroundSpan, traceFetch, traceXHR, trackFetchStreamPerformance, shouldCreateSpanForRequest, enableHTTPTimings, ignoreResourceSpans, ignorePerformanceApiSpans, instrumentPageLoad, instrumentNavigation, detectRedirects, linkPreviousTrace, consistentTraceSampling, enableReportPageLoaded, onRequestSpanStart, onRequestSpanEnd } = {
        ...DEFAULT_BROWSER_TRACING_OPTIONS,
        ...options
    };
    let _collectWebVitals;
    let lastInteractionTimestamp;
    let _pageloadSpan;
    /** Create routing idle transaction. */ function _createRouteSpan(client, startSpanOptions, makeActive = true) {
        const isPageloadSpan = startSpanOptions.op === 'pageload';
        const initialSpanName = startSpanOptions.name;
        const finalStartSpanOptions = beforeStartSpan ? beforeStartSpan(startSpanOptions) : startSpanOptions;
        const attributes = finalStartSpanOptions.attributes || {};
        // If `finalStartSpanOptions.name` is different than `startSpanOptions.name`
        // it is because `beforeStartSpan` set a custom name. Therefore we set the source to 'custom'.
        if (initialSpanName !== finalStartSpanOptions.name) {
            attributes[core.SEMANTIC_ATTRIBUTE_SENTRY_SOURCE] = 'custom';
            finalStartSpanOptions.attributes = attributes;
        }
        if (!makeActive) {
            // We want to ensure this has 0s duration
            const now = core.dateTimestampInSeconds();
            core.startInactiveSpan({
                ...finalStartSpanOptions,
                startTime: now
            }).end(now);
            return;
        }
        latestRoute.name = finalStartSpanOptions.name;
        latestRoute.source = attributes[core.SEMANTIC_ATTRIBUTE_SENTRY_SOURCE];
        const idleSpan = core.startIdleSpan(finalStartSpanOptions, {
            idleTimeout,
            finalTimeout,
            childSpanTimeout,
            // should wait for finish signal if it's a pageload transaction
            disableAutoFinish: isPageloadSpan,
            beforeSpanEnd: (span)=>{
                // This will generally always be defined here, because it is set in `setup()` of the integration
                // but technically, it is optional, so we guard here to be extra safe
                _collectWebVitals?.();
                browserUtils.addPerformanceEntries(span, {
                    recordClsOnPageloadSpan: !enableStandaloneClsSpans,
                    recordLcpOnPageloadSpan: !enableStandaloneLcpSpans,
                    ignoreResourceSpans,
                    ignorePerformanceApiSpans
                });
                setActiveIdleSpan(client, undefined);
                // A trace should stay consistent over the entire timespan of one route - even after the pageload/navigation ended.
                // Only when another navigation happens, we want to create a new trace.
                // This way, e.g. errors that occur after the pageload span ended are still associated to the pageload trace.
                const scope = core.getCurrentScope();
                const oldPropagationContext = scope.getPropagationContext();
                scope.setPropagationContext({
                    ...oldPropagationContext,
                    traceId: idleSpan.spanContext().traceId,
                    sampled: core.spanIsSampled(idleSpan),
                    dsc: core.getDynamicSamplingContextFromSpan(span)
                });
                if (isPageloadSpan) {
                    // clean up the stored pageload span on the intergration.
                    _pageloadSpan = undefined;
                }
            },
            trimIdleSpanEndTimestamp: !enableReportPageLoaded
        });
        if (isPageloadSpan && enableReportPageLoaded) {
            _pageloadSpan = idleSpan;
        }
        setActiveIdleSpan(client, idleSpan);
        function emitFinish() {
            if (optionalWindowDocument && [
                'interactive',
                'complete'
            ].includes(optionalWindowDocument.readyState)) {
                client.emit('idleSpanEnableAutoFinish', idleSpan);
            }
        }
        // Enable auto finish of the pageload span if users are not explicitly ending it
        if (isPageloadSpan && !enableReportPageLoaded && optionalWindowDocument) {
            optionalWindowDocument.addEventListener('readystatechange', ()=>{
                emitFinish();
            });
            emitFinish();
        }
    }
    return {
        name: BROWSER_TRACING_INTEGRATION_ID,
        setup (client) {
            core.registerSpanErrorInstrumentation();
            _collectWebVitals = browserUtils.startTrackingWebVitals({
                recordClsStandaloneSpans: enableStandaloneClsSpans || false,
                recordLcpStandaloneSpans: enableStandaloneLcpSpans || false,
                client
            });
            if (enableInp) {
                browserUtils.startTrackingINP();
            }
            if (enableElementTiming) {
                browserUtils.startTrackingElementTiming();
            }
            if (enableLongAnimationFrame && core.GLOBAL_OBJ.PerformanceObserver && PerformanceObserver.supportedEntryTypes && PerformanceObserver.supportedEntryTypes.includes('long-animation-frame')) {
                browserUtils.startTrackingLongAnimationFrames();
            } else if (enableLongTask) {
                browserUtils.startTrackingLongTasks();
            }
            if (enableInteractions) {
                browserUtils.startTrackingInteractions();
            }
            if (detectRedirects && optionalWindowDocument) {
                const interactionHandler = ()=>{
                    lastInteractionTimestamp = core.timestampInSeconds();
                };
                addEventListener('click', interactionHandler, {
                    capture: true
                });
                addEventListener('keydown', interactionHandler, {
                    capture: true,
                    passive: true
                });
            }
            function maybeEndActiveSpan() {
                const activeSpan = getActiveIdleSpan(client);
                if (activeSpan && !core.spanToJSON(activeSpan).timestamp) {
                    debugBuild.DEBUG_BUILD && core.debug.log(`[Tracing] Finishing current active span with op: ${core.spanToJSON(activeSpan).op}`);
                    // If there's an open active span, we need to finish it before creating an new one.
                    activeSpan.setAttribute(core.SEMANTIC_ATTRIBUTE_SENTRY_IDLE_SPAN_FINISH_REASON, 'cancelled');
                    activeSpan.end();
                }
            }
            client.on('startNavigationSpan', (startSpanOptions, navigationOptions)=>{
                if (core.getClient() !== client) {
                    return;
                }
                if (navigationOptions?.isRedirect) {
                    debugBuild.DEBUG_BUILD && core.debug.warn('[Tracing] Detected redirect, navigation span will not be the root span, but a child span.');
                    _createRouteSpan(client, {
                        op: 'navigation.redirect',
                        ...startSpanOptions
                    }, false);
                    return;
                }
                // Reset the last interaction timestamp since we now start a new navigation.
                // Any subsequent navigation span starts could again be a redirect, so we
                // should reset our heuristic detectors.
                lastInteractionTimestamp = undefined;
                maybeEndActiveSpan();
                core.getIsolationScope().setPropagationContext({
                    traceId: core.generateTraceId(),
                    sampleRand: Math.random(),
                    propagationSpanId: core.hasSpansEnabled() ? undefined : core.generateSpanId()
                });
                const scope = core.getCurrentScope();
                scope.setPropagationContext({
                    traceId: core.generateTraceId(),
                    sampleRand: Math.random(),
                    propagationSpanId: core.hasSpansEnabled() ? undefined : core.generateSpanId()
                });
                // We reset this to ensure we do not have lingering incorrect data here
                // places that call this hook may set this where appropriate - else, the URL at span sending time is used
                scope.setSDKProcessingMetadata({
                    normalizedRequest: undefined
                });
                _createRouteSpan(client, {
                    op: 'navigation',
                    ...startSpanOptions,
                    // Navigation starts a new trace and is NOT parented under any active interaction (e.g. ui.action.click)
                    parentSpan: null,
                    forceTransaction: true
                });
            });
            client.on('startPageLoadSpan', (startSpanOptions, traceOptions = {})=>{
                if (core.getClient() !== client) {
                    return;
                }
                maybeEndActiveSpan();
                const sentryTrace = traceOptions.sentryTrace || getMetaContent('sentry-trace');
                const baggage = traceOptions.baggage || getMetaContent('baggage');
                const propagationContext = core.propagationContextFromHeaders(sentryTrace, baggage);
                const scope = core.getCurrentScope();
                scope.setPropagationContext(propagationContext);
                if (!core.hasSpansEnabled()) {
                    // for browser, we wanna keep the spanIds consistent during the entire lifetime of the trace
                    // this works by setting the propagationSpanId to a random spanId so that we have a consistent
                    // span id to propagate in TwP mode (!hasSpansEnabled())
                    scope.getPropagationContext().propagationSpanId = core.generateSpanId();
                }
                // We store the normalized request data on the scope, so we get the request data at time of span creation
                // otherwise, the URL etc. may already be of the following navigation, and we'd report the wrong URL
                scope.setSDKProcessingMetadata({
                    normalizedRequest: helpers.getHttpRequestData()
                });
                _createRouteSpan(client, {
                    op: 'pageload',
                    ...startSpanOptions
                });
            });
            client.on('endPageloadSpan', ()=>{
                if (enableReportPageLoaded && _pageloadSpan) {
                    _pageloadSpan.setAttribute(core.SEMANTIC_ATTRIBUTE_SENTRY_IDLE_SPAN_FINISH_REASON, 'reportPageLoaded');
                    _pageloadSpan.end();
                }
            });
        },
        afterAllSetup (client) {
            let startingUrl = core.getLocationHref();
            if (linkPreviousTrace !== 'off') {
                linkedTraces.linkTraces(client, {
                    linkPreviousTrace,
                    consistentTraceSampling
                });
            }
            if (helpers.WINDOW.location) {
                if (instrumentPageLoad) {
                    const origin = core.browserPerformanceTimeOrigin();
                    startBrowserTracingPageLoadSpan(client, {
                        name: helpers.WINDOW.location.pathname,
                        // pageload should always start at timeOrigin (and needs to be in s, not ms)
                        startTime: origin ? origin / 1000 : undefined,
                        attributes: {
                            [core.SEMANTIC_ATTRIBUTE_SENTRY_SOURCE]: 'url',
                            [core.SEMANTIC_ATTRIBUTE_SENTRY_ORIGIN]: 'auto.pageload.browser'
                        }
                    });
                }
                if (instrumentNavigation) {
                    browserUtils.addHistoryInstrumentationHandler(({ to, from })=>{
                        /**
             * This early return is there to account for some cases where a navigation transaction starts right after
             * long-running pageload. We make sure that if `from` is undefined and a valid `startingURL` exists, we don't
             * create an uneccessary navigation transaction.
             *
             * This was hard to duplicate, but this behavior stopped as soon as this fix was applied. This issue might also
             * only be caused in certain development environments where the usage of a hot module reloader is causing
             * errors.
             */ if (from === undefined && startingUrl?.indexOf(to) !== -1) {
                            startingUrl = undefined;
                            return;
                        }
                        startingUrl = undefined;
                        const parsed = core.parseStringToURLObject(to);
                        const activeSpan = getActiveIdleSpan(client);
                        const navigationIsRedirect = activeSpan && detectRedirects && isRedirect(activeSpan, lastInteractionTimestamp);
                        startBrowserTracingNavigationSpan(client, {
                            name: parsed?.pathname || helpers.WINDOW.location.pathname,
                            attributes: {
                                [core.SEMANTIC_ATTRIBUTE_SENTRY_SOURCE]: 'url',
                                [core.SEMANTIC_ATTRIBUTE_SENTRY_ORIGIN]: 'auto.navigation.browser'
                            }
                        }, {
                            url: to,
                            isRedirect: navigationIsRedirect
                        });
                    });
                }
            }
            if (markBackgroundSpan) {
                backgroundtab.registerBackgroundTabDetection();
            }
            if (enableInteractions) {
                registerInteractionListener(client, idleTimeout, finalTimeout, childSpanTimeout, latestRoute);
            }
            if (enableInp) {
                browserUtils.registerInpInteractionListener();
            }
            request.instrumentOutgoingRequests(client, {
                traceFetch,
                traceXHR,
                trackFetchStreamPerformance,
                tracePropagationTargets: client.getOptions().tracePropagationTargets,
                shouldCreateSpanForRequest,
                enableHTTPTimings,
                onRequestSpanStart,
                onRequestSpanEnd
            });
        }
    };
};
/**
 * Manually start a page load span.
 * This will only do something if a browser tracing integration integration has been setup.
 *
 * If you provide a custom `traceOptions` object, it will be used to continue the trace
 * instead of the default behavior, which is to look it up on the <meta> tags.
 */ function startBrowserTracingPageLoadSpan(client, spanOptions, traceOptions) {
    client.emit('startPageLoadSpan', spanOptions, traceOptions);
    core.getCurrentScope().setTransactionName(spanOptions.name);
    const pageloadSpan = getActiveIdleSpan(client);
    if (pageloadSpan) {
        client.emit('afterStartPageLoadSpan', pageloadSpan);
    }
    return pageloadSpan;
}
/**
 * Manually start a navigation span.
 * This will only do something if a browser tracing integration has been setup.
 */ function startBrowserTracingNavigationSpan(client, spanOptions, options) {
    const { url, isRedirect } = options || {};
    client.emit('beforeStartNavigationSpan', spanOptions, {
        isRedirect
    });
    client.emit('startNavigationSpan', spanOptions, {
        isRedirect
    });
    const scope = core.getCurrentScope();
    scope.setTransactionName(spanOptions.name);
    // We store the normalized request data on the scope, so we get the request data at time of span creation
    // otherwise, the URL etc. may already be of the following navigation, and we'd report the wrong URL
    if (url && !isRedirect) {
        scope.setSDKProcessingMetadata({
            normalizedRequest: {
                ...helpers.getHttpRequestData(),
                url
            }
        });
    }
    return getActiveIdleSpan(client);
}
/** Returns the value of a meta tag */ function getMetaContent(metaName) {
    /**
   * This is just a small wrapper that makes `document` optional.
   * We want to be extra-safe and always check that this exists, to ensure weird environments do not blow up.
   */ const optionalWindowDocument = helpers.WINDOW.document;
    const metaTag = optionalWindowDocument?.querySelector(`meta[name=${metaName}]`);
    return metaTag?.getAttribute('content') || undefined;
}
/** Start listener for interaction transactions */ function registerInteractionListener(client, idleTimeout, finalTimeout, childSpanTimeout, latestRoute) {
    /**
   * This is just a small wrapper that makes `document` optional.
   * We want to be extra-safe and always check that this exists, to ensure weird environments do not blow up.
   */ const optionalWindowDocument = helpers.WINDOW.document;
    let inflightInteractionSpan;
    const registerInteractionTransaction = ()=>{
        const op = 'ui.action.click';
        const activeIdleSpan = getActiveIdleSpan(client);
        if (activeIdleSpan) {
            const currentRootSpanOp = core.spanToJSON(activeIdleSpan).op;
            if ([
                'navigation',
                'pageload'
            ].includes(currentRootSpanOp)) {
                debugBuild.DEBUG_BUILD && core.debug.warn(`[Tracing] Did not create ${op} span because a pageload or navigation span is in progress.`);
                return undefined;
            }
        }
        if (inflightInteractionSpan) {
            inflightInteractionSpan.setAttribute(core.SEMANTIC_ATTRIBUTE_SENTRY_IDLE_SPAN_FINISH_REASON, 'interactionInterrupted');
            inflightInteractionSpan.end();
            inflightInteractionSpan = undefined;
        }
        if (!latestRoute.name) {
            debugBuild.DEBUG_BUILD && core.debug.warn(`[Tracing] Did not create ${op} transaction because _latestRouteName is missing.`);
            return undefined;
        }
        inflightInteractionSpan = core.startIdleSpan({
            name: latestRoute.name,
            op,
            attributes: {
                [core.SEMANTIC_ATTRIBUTE_SENTRY_SOURCE]: latestRoute.source || 'url'
            }
        }, {
            idleTimeout,
            finalTimeout,
            childSpanTimeout
        });
    };
    if (optionalWindowDocument) {
        addEventListener('click', registerInteractionTransaction, {
            capture: true
        });
    }
}
// We store the active idle span on the client object, so we can access it from exported functions
const ACTIVE_IDLE_SPAN_PROPERTY = '_sentry_idleSpan';
function getActiveIdleSpan(client) {
    return client[ACTIVE_IDLE_SPAN_PROPERTY];
}
function setActiveIdleSpan(client, span) {
    core.addNonEnumerableProperty(client, ACTIVE_IDLE_SPAN_PROPERTY, span);
}
// The max. time in seconds between two pageload/navigation spans that makes us consider the second one a redirect
const REDIRECT_THRESHOLD = 1.5;
function isRedirect(activeSpan, lastInteractionTimestamp) {
    const spanData = core.spanToJSON(activeSpan);
    const now = core.dateTimestampInSeconds();
    // More than REDIRECT_THRESHOLD seconds since last navigation/pageload span?
    // --> never consider this a redirect
    const startTimestamp = spanData.start_timestamp;
    if (now - startTimestamp > REDIRECT_THRESHOLD) {
        return false;
    }
    // A click happened in the last REDIRECT_THRESHOLD seconds?
    // --> never consider this a redirect
    if (lastInteractionTimestamp && now - lastInteractionTimestamp <= REDIRECT_THRESHOLD) {
        return false;
    }
    return true;
}
exports.BROWSER_TRACING_INTEGRATION_ID = BROWSER_TRACING_INTEGRATION_ID;
exports.browserTracingIntegration = browserTracingIntegration;
exports.getMetaContent = getMetaContent;
exports.startBrowserTracingNavigationSpan = startBrowserTracingNavigationSpan;
exports.startBrowserTracingPageLoadSpan = startBrowserTracingPageLoadSpan; //# sourceMappingURL=browserTracingIntegration.js.map
}),
"[project]/node_modules/@sentry/browser/build/npm/cjs/dev/tracing/reportPageLoaded.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const core = __turbopack_context__.r("[project]/node_modules/@sentry/core/build/cjs/index.js [app-client] (ecmascript)");
/**
 * Manually report the end of the page load, resulting in the SDK ending the pageload span.
 * This only works if {@link BrowserTracingOptions.enableReportPageLoaded} is set to `true`.
 * Otherwise, the pageload span will end itself based on the {@link BrowserTracingOptions.finalTimeout},
 * {@link BrowserTracingOptions.idleTimeout} and {@link BrowserTracingOptions.childSpanTimeout}.
 *
 * @param client - The client to use. If not provided, the global client will be used.
 */ function reportPageLoaded(client = core.getClient()) {
    client?.emit('endPageloadSpan');
}
exports.reportPageLoaded = reportPageLoaded; //# sourceMappingURL=reportPageLoaded.js.map
}),
"[project]/node_modules/@sentry/browser/build/npm/cjs/dev/tracing/setActiveSpan.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const core = __turbopack_context__.r("[project]/node_modules/@sentry/core/build/cjs/index.js [app-client] (ecmascript)");
/**
 * Sets an inactive span active on the current scope.
 *
 * This is useful in browser applications, if you want to create a span that cannot be finished
 * within its callback. Any spans started while the given span is active, will be children of the span.
 *
 * If there already was an active span on the scope prior to calling this function, it is replaced
 * with the given span and restored after the span ended. Otherwise, the span will simply be
 * removed, resulting in no active span on the scope.
 *
 * IMPORTANT: This function can ONLY be used in the browser! Calling this function in a server
 * environment (for example in a server-side rendered component) will result in undefined behaviour
 * and is not supported.
 * You MUST call `span.end()` manually, otherwise the span will never be finished.
 *
 * @example
 * ```js
 * let checkoutSpan;
 *
 * on('checkoutStarted', () => {
 *  checkoutSpan = Sentry.startInactiveSpan({ name: 'checkout-flow' });
 *  Sentry.setActiveSpanInBrowser(checkoutSpan);
 * })
 *
 * // during this time, any spans started will be children of `checkoutSpan`:
 * Sentry.startSpan({ name: 'checkout-step-1' }, () => {
 *  // ... `
 * })
 *
 * on('checkoutCompleted', () => {
 *  checkoutSpan?.end();
 * })
 * ```
 *
 * @param span - the span to set active
 */ function setActiveSpanInBrowser(span) {
    const maybePreviousActiveSpan = core.getActiveSpan();
    // If the span is already active, there's no need to double-patch or set it again.
    // This also guards against users (for whatever reason) calling setActiveSpanInBrowser on SDK-started
    // idle spans like pageload or navigation spans. These will already be handled correctly by the SDK.
    // For nested situations, we have to double-patch to ensure we restore the correct previous span (see tests)
    if (maybePreviousActiveSpan === span) {
        return;
    }
    const scope = core.getCurrentScope();
    // Putting a small patch onto the span.end method to ensure we
    // remove the span from the scope when it ends.
    // eslint-disable-next-line @typescript-eslint/unbound-method
    span.end = new Proxy(span.end, {
        apply (target, thisArg, args) {
            core._INTERNAL_setSpanForScope(scope, maybePreviousActiveSpan);
            return Reflect.apply(target, thisArg, args);
        }
    });
    core._INTERNAL_setSpanForScope(scope, span);
}
exports.setActiveSpanInBrowser = setActiveSpanInBrowser; //# sourceMappingURL=setActiveSpan.js.map
}),
"[project]/node_modules/@sentry/browser/build/npm/cjs/dev/transports/offline.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const core = __turbopack_context__.r("[project]/node_modules/@sentry/core/build/cjs/index.js [app-client] (ecmascript)");
const helpers = __turbopack_context__.r("[project]/node_modules/@sentry/browser/build/npm/cjs/dev/helpers.js [app-client] (ecmascript)");
const fetch = __turbopack_context__.r("[project]/node_modules/@sentry/browser/build/npm/cjs/dev/transports/fetch.js [app-client] (ecmascript)");
// 'Store', 'promisifyRequest' and 'createStore' were originally copied from the 'idb-keyval' package before being
// modified and simplified: https://github.com/jakearchibald/idb-keyval
//
// At commit: 0420a704fd6cbb4225429c536b1f61112d012fca
// Original license:
// Copyright 2016, Jake Archibald
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//   http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
function promisifyRequest(request) {
    return new Promise((resolve, reject)=>{
        // @ts-expect-error - file size hacks
        request.oncomplete = request.onsuccess = ()=>resolve(request.result);
        // @ts-expect-error - file size hacks
        request.onabort = request.onerror = ()=>reject(request.error);
    });
}
/** Create or open an IndexedDb store */ function createStore(dbName, storeName) {
    const request = indexedDB.open(dbName);
    request.onupgradeneeded = ()=>request.result.createObjectStore(storeName);
    const dbp = promisifyRequest(request);
    return (callback)=>dbp.then((db)=>callback(db.transaction(storeName, 'readwrite').objectStore(storeName)));
}
function keys(store) {
    return promisifyRequest(store.getAllKeys());
}
/** Insert into the end of the store */ function push(store, value, maxQueueSize) {
    return store((store)=>{
        return keys(store).then((keys)=>{
            if (keys.length >= maxQueueSize) {
                return;
            }
            // We insert with an incremented key so that the entries are popped in order
            store.put(value, Math.max(...keys, 0) + 1);
            return promisifyRequest(store.transaction);
        });
    });
}
/** Insert into the front of the store */ function unshift(store, value, maxQueueSize) {
    return store((store)=>{
        return keys(store).then((keys)=>{
            if (keys.length >= maxQueueSize) {
                return;
            }
            // We insert with an decremented key so that the entries are popped in order
            store.put(value, Math.min(...keys, 0) - 1);
            return promisifyRequest(store.transaction);
        });
    });
}
/** Pop the oldest value from the store */ function shift(store) {
    return store((store)=>{
        return keys(store).then((keys)=>{
            const firstKey = keys[0];
            if (firstKey == null) {
                return undefined;
            }
            return promisifyRequest(store.get(firstKey)).then((value)=>{
                store.delete(firstKey);
                return promisifyRequest(store.transaction).then(()=>value);
            });
        });
    });
}
function createIndexedDbStore(options) {
    let store;
    // Lazily create the store only when it's needed
    function getStore() {
        if (store == undefined) {
            store = createStore(options.dbName || 'sentry-offline', options.storeName || 'queue');
        }
        return store;
    }
    return {
        push: async (env)=>{
            try {
                const serialized = await core.serializeEnvelope(env);
                await push(getStore(), serialized, options.maxQueueSize || 30);
            } catch  {
            //
            }
        },
        unshift: async (env)=>{
            try {
                const serialized = await core.serializeEnvelope(env);
                await unshift(getStore(), serialized, options.maxQueueSize || 30);
            } catch  {
            //
            }
        },
        shift: async ()=>{
            try {
                const deserialized = await shift(getStore());
                if (deserialized) {
                    return core.parseEnvelope(deserialized);
                }
            } catch  {
            //
            }
            return undefined;
        }
    };
}
function makeIndexedDbOfflineTransport(createTransport) {
    return (options)=>{
        const transport = createTransport({
            ...options,
            createStore: createIndexedDbStore
        });
        helpers.WINDOW.addEventListener('online', async (_)=>{
            await transport.flush();
        });
        return transport;
    };
}
/**
 * Creates a transport that uses IndexedDb to store events when offline.
 */ function makeBrowserOfflineTransport(createTransport = fetch.makeFetchTransport) {
    return makeIndexedDbOfflineTransport(core.makeOfflineTransport(createTransport));
}
exports.createStore = createStore;
exports.makeBrowserOfflineTransport = makeBrowserOfflineTransport;
exports.push = push;
exports.shift = shift;
exports.unshift = unshift; //# sourceMappingURL=offline.js.map
}),
"[project]/node_modules/@sentry/browser/build/npm/cjs/dev/profiling/utils.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const core = __turbopack_context__.r("[project]/node_modules/@sentry/core/build/cjs/index.js [app-client] (ecmascript)");
const debugBuild = __turbopack_context__.r("[project]/node_modules/@sentry/browser/build/npm/cjs/dev/debug-build.js [app-client] (ecmascript)");
const helpers = __turbopack_context__.r("[project]/node_modules/@sentry/browser/build/npm/cjs/dev/helpers.js [app-client] (ecmascript)");
const MS_TO_NS = 1e6;
// Checking if we are in Main or Worker thread: `self` (not `window`) is the `globalThis` in Web Workers and `importScripts` are only available in Web Workers
const isMainThread = 'window' in core.GLOBAL_OBJ && core.GLOBAL_OBJ.window === core.GLOBAL_OBJ && typeof importScripts === 'undefined';
// Setting ID to 0 as we cannot get an ID from Web Workers
const PROFILER_THREAD_ID_STRING = String(0);
const PROFILER_THREAD_NAME = isMainThread ? 'main' : 'worker';
// We force make this optional to be on the safe side...
const navigator = helpers.WINDOW.navigator;
// Machine properties (eval only once)
let OS_PLATFORM = '';
let OS_PLATFORM_VERSION = '';
let OS_ARCH = '';
let OS_BROWSER = navigator?.userAgent || '';
let OS_MODEL = '';
const OS_LOCALE = navigator?.language || navigator?.languages?.[0] || '';
function isUserAgentData(data) {
    return typeof data === 'object' && data !== null && 'getHighEntropyValues' in data;
}
// @ts-expect-error userAgentData is not part of the navigator interface yet
const userAgentData = navigator?.userAgentData;
if (isUserAgentData(userAgentData)) {
    userAgentData.getHighEntropyValues([
        'architecture',
        'model',
        'platform',
        'platformVersion',
        'fullVersionList'
    ]).then((ua)=>{
        OS_PLATFORM = ua.platform || '';
        OS_ARCH = ua.architecture || '';
        OS_MODEL = ua.model || '';
        OS_PLATFORM_VERSION = ua.platformVersion || '';
        if (ua.fullVersionList?.length) {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            const firstUa = ua.fullVersionList[ua.fullVersionList.length - 1];
            OS_BROWSER = `${firstUa.brand} ${firstUa.version}`;
        }
    }).catch((e)=>void 0);
}
function isProcessedJSSelfProfile(profile) {
    return !('thread_metadata' in profile);
}
// Enriches the profile with threadId of the current thread.
// This is done in node as we seem to not be able to get the info from C native code.
/**
 *
 */ function enrichWithThreadInformation(profile) {
    if (!isProcessedJSSelfProfile(profile)) {
        return profile;
    }
    return convertJSSelfProfileToSampledFormat(profile);
}
// Profile is marked as optional because it is deleted from the metadata
// by the integration before the event is processed by other integrations.
function getTraceId(event) {
    const traceId = event.contexts?.trace?.trace_id;
    // Log a warning if the profile has an invalid traceId (should be uuidv4).
    // All profiles and transactions are rejected if this is the case and we want to
    // warn users that this is happening if they enable debug flag
    if (typeof traceId === 'string' && traceId.length !== 32) {
        if (debugBuild.DEBUG_BUILD) {
            core.debug.log(`[Profiling] Invalid traceId: ${traceId} on profiled event`);
        }
    }
    if (typeof traceId !== 'string') {
        return '';
    }
    return traceId;
}
/**
 * Creates a profiling event envelope from a Sentry event. If profile does not pass
 * validation, returns null.
 * @param event
 * @param dsn
 * @param metadata
 * @param tunnel
 * @returns {EventEnvelope | null}
 */ /**
 * Creates a profiling event envelope from a Sentry event.
 */ function createProfilePayload(profile_id, start_timestamp, processed_profile, event) {
    if (event.type !== 'transaction') {
        // createProfilingEventEnvelope should only be called for transactions,
        // we type guard this behavior with isProfiledTransactionEvent.
        throw new TypeError('Profiling events may only be attached to transactions, this should never occur.');
    }
    if (processed_profile === undefined || processed_profile === null) {
        throw new TypeError(`Cannot construct profiling event envelope without a valid profile. Got ${processed_profile} instead.`);
    }
    const traceId = getTraceId(event);
    const enrichedThreadProfile = enrichWithThreadInformation(processed_profile);
    const transactionStartMs = start_timestamp ? start_timestamp : typeof event.start_timestamp === 'number' ? event.start_timestamp * 1000 : core.timestampInSeconds() * 1000;
    const transactionEndMs = typeof event.timestamp === 'number' ? event.timestamp * 1000 : core.timestampInSeconds() * 1000;
    const profile = {
        event_id: profile_id,
        timestamp: new Date(transactionStartMs).toISOString(),
        platform: 'javascript',
        version: '1',
        release: event.release || '',
        environment: event.environment || core.DEFAULT_ENVIRONMENT,
        runtime: {
            name: 'javascript',
            version: helpers.WINDOW.navigator.userAgent
        },
        os: {
            name: OS_PLATFORM,
            version: OS_PLATFORM_VERSION,
            build_number: OS_BROWSER
        },
        device: {
            locale: OS_LOCALE,
            model: OS_MODEL,
            manufacturer: OS_BROWSER,
            architecture: OS_ARCH,
            is_emulator: false
        },
        debug_meta: {
            images: applyDebugMetadata(processed_profile.resources)
        },
        profile: enrichedThreadProfile,
        transactions: [
            {
                name: event.transaction || '',
                id: event.event_id || core.uuid4(),
                trace_id: traceId,
                active_thread_id: PROFILER_THREAD_ID_STRING,
                relative_start_ns: '0',
                relative_end_ns: ((transactionEndMs - transactionStartMs) * 1e6).toFixed(0)
            }
        ]
    };
    return profile;
}
/**
 * Create a profile chunk envelope item
 */ function createProfileChunkPayload(jsSelfProfile, client, profilerId) {
    // only == to catch null and undefined
    if (jsSelfProfile == null) {
        throw new TypeError(`Cannot construct profiling event envelope without a valid profile. Got ${jsSelfProfile} instead.`);
    }
    const continuousProfile = convertToContinuousProfile(jsSelfProfile);
    const options = client.getOptions();
    const sdk = client.getSdkMetadata?.()?.sdk;
    return {
        chunk_id: core.uuid4(),
        client_sdk: {
            name: sdk?.name ?? 'sentry.javascript.browser',
            version: sdk?.version ?? '0.0.0'
        },
        profiler_id: profilerId || core.uuid4(),
        platform: 'javascript',
        version: '2',
        release: options.release ?? '',
        environment: options.environment ?? 'production',
        debug_meta: {
            // function name obfuscation
            images: applyDebugMetadata(jsSelfProfile.resources)
        },
        profile: continuousProfile
    };
}
/**
 * Validate a profile chunk against the Sample Format V2 requirements.
 * https://develop.sentry.dev/sdk/telemetry/profiles/sample-format-v2/
 * - Presence of samples, stacks, frames
 * - Required metadata fields
 */ function validateProfileChunk(chunk) {
    try {
        // Required metadata
        if (!chunk || typeof chunk !== 'object') {
            return {
                reason: 'chunk is not an object'
            };
        }
        // profiler_id and chunk_id must be 32 lowercase hex chars
        const isHex32 = (val)=>typeof val === 'string' && /^[a-f0-9]{32}$/.test(val);
        if (!isHex32(chunk.profiler_id)) {
            return {
                reason: 'missing or invalid profiler_id'
            };
        }
        if (!isHex32(chunk.chunk_id)) {
            return {
                reason: 'missing or invalid chunk_id'
            };
        }
        if (!chunk.client_sdk) {
            return {
                reason: 'missing client_sdk metadata'
            };
        }
        // Profile data must have frames, stacks, samples
        const profile = chunk.profile;
        if (!profile) {
            return {
                reason: 'missing profile data'
            };
        }
        if (!Array.isArray(profile.frames) || !profile.frames.length) {
            return {
                reason: 'profile has no frames'
            };
        }
        if (!Array.isArray(profile.stacks) || !profile.stacks.length) {
            return {
                reason: 'profile has no stacks'
            };
        }
        if (!Array.isArray(profile.samples) || !profile.samples.length) {
            return {
                reason: 'profile has no samples'
            };
        }
        return {
            valid: true
        };
    } catch (e) {
        return {
            reason: `unknown validation error: ${e}`
        };
    }
}
/**
 * Convert from JSSelfProfile format to ContinuousThreadCpuProfile format.
 */ function convertToContinuousProfile(input) {
    // Frames map 1:1 by index; fill only when present to avoid sparse writes
    const frames = [];
    for(let i = 0; i < input.frames.length; i++){
        const frame = input.frames[i];
        if (!frame) {
            continue;
        }
        frames[i] = {
            function: frame.name,
            abs_path: typeof frame.resourceId === 'number' ? input.resources[frame.resourceId] : undefined,
            lineno: frame.line,
            colno: frame.column
        };
    }
    // Build stacks by following parent links, top->down order (root last)
    const stacks = [];
    for(let i = 0; i < input.stacks.length; i++){
        const stackHead = input.stacks[i];
        if (!stackHead) {
            continue;
        }
        const list = [];
        let current = stackHead;
        while(current){
            list.push(current.frameId);
            current = current.parentId === undefined ? undefined : input.stacks[current.parentId];
        }
        stacks[i] = list;
    }
    // Align timestamps to SDK time origin to match span/event timelines
    const perfOrigin = core.browserPerformanceTimeOrigin();
    const origin = typeof performance.timeOrigin === 'number' ? performance.timeOrigin : perfOrigin || 0;
    const adjustForOriginChange = origin - (perfOrigin || origin);
    const samples = [];
    for(let i = 0; i < input.samples.length; i++){
        const sample = input.samples[i];
        if (!sample) {
            continue;
        }
        // Convert ms to seconds epoch-based timestamp
        const timestampSeconds = (origin + (sample.timestamp - adjustForOriginChange)) / 1000;
        samples[i] = {
            stack_id: sample.stackId ?? 0,
            thread_id: PROFILER_THREAD_ID_STRING,
            timestamp: timestampSeconds
        };
    }
    return {
        frames,
        stacks,
        samples,
        thread_metadata: {
            [PROFILER_THREAD_ID_STRING]: {
                name: PROFILER_THREAD_NAME
            }
        }
    };
}
/*
  See packages/browser-utils/src/browser/router.ts
*/ /**
 *
 */ function isAutomatedPageLoadSpan(span) {
    return core.spanToJSON(span).op === 'pageload';
}
/**
 * Converts a JSSelfProfile to a our sampled format.
 * Does not currently perform stack indexing.
 */ function convertJSSelfProfileToSampledFormat(input) {
    let EMPTY_STACK_ID = undefined;
    let STACK_ID = 0;
    // Initialize the profile that we will fill with data
    const profile = {
        samples: [],
        stacks: [],
        frames: [],
        thread_metadata: {
            [PROFILER_THREAD_ID_STRING]: {
                name: PROFILER_THREAD_NAME
            }
        }
    };
    const firstSample = input.samples[0];
    if (!firstSample) {
        return profile;
    }
    // We assert samples.length > 0 above and timestamp should always be present
    const start = firstSample.timestamp;
    // The JS SDK might change it's time origin based on some heuristic (see See packages/utils/src/time.ts)
    // when that happens, we need to ensure we are correcting the profile timings so the two timelines stay in sync.
    // Since JS self profiling time origin is always initialized to performance.timeOrigin, we need to adjust for
    // the drift between the SDK selected value and our profile time origin.
    const perfOrigin = core.browserPerformanceTimeOrigin();
    const origin = typeof performance.timeOrigin === 'number' ? performance.timeOrigin : perfOrigin || 0;
    const adjustForOriginChange = origin - (perfOrigin || origin);
    input.samples.forEach((jsSample, i)=>{
        // If sample has no stack, add an empty sample
        if (jsSample.stackId === undefined) {
            if (EMPTY_STACK_ID === undefined) {
                EMPTY_STACK_ID = STACK_ID;
                profile.stacks[EMPTY_STACK_ID] = [];
                STACK_ID++;
            }
            profile['samples'][i] = {
                // convert ms timestamp to ns
                elapsed_since_start_ns: ((jsSample.timestamp + adjustForOriginChange - start) * MS_TO_NS).toFixed(0),
                stack_id: EMPTY_STACK_ID,
                thread_id: PROFILER_THREAD_ID_STRING
            };
            return;
        }
        let stackTop = input.stacks[jsSample.stackId];
        // Functions in top->down order (root is last)
        // We follow the stackTop.parentId trail and collect each visited frameId
        const stack = [];
        while(stackTop){
            stack.push(stackTop.frameId);
            const frame = input.frames[stackTop.frameId];
            // If our frame has not been indexed yet, index it
            if (frame && profile.frames[stackTop.frameId] === undefined) {
                profile.frames[stackTop.frameId] = {
                    function: frame.name,
                    abs_path: typeof frame.resourceId === 'number' ? input.resources[frame.resourceId] : undefined,
                    lineno: frame.line,
                    colno: frame.column
                };
            }
            stackTop = stackTop.parentId === undefined ? undefined : input.stacks[stackTop.parentId];
        }
        const sample = {
            // convert ms timestamp to ns
            elapsed_since_start_ns: ((jsSample.timestamp + adjustForOriginChange - start) * MS_TO_NS).toFixed(0),
            stack_id: STACK_ID,
            thread_id: PROFILER_THREAD_ID_STRING
        };
        profile['stacks'][STACK_ID] = stack;
        profile['samples'][i] = sample;
        STACK_ID++;
    });
    return profile;
}
/**
 * Adds items to envelope if they are not already present - mutates the envelope.
 * @param envelope
 */ function addProfilesToEnvelope(envelope, profiles) {
    if (!profiles.length) {
        return envelope;
    }
    for (const profile of profiles){
        envelope[1].push([
            {
                type: 'profile'
            },
            profile
        ]);
    }
    return envelope;
}
/**
 * Finds transactions with profile_id context in the envelope
 * @param envelope
 * @returns
 */ function findProfiledTransactionsFromEnvelope(envelope) {
    const events = [];
    core.forEachEnvelopeItem(envelope, (item, type)=>{
        if (type !== 'transaction') {
            return;
        }
        for(let j = 1; j < item.length; j++){
            const event = item[j];
            if (event?.contexts?.profile?.profile_id) {
                events.push(item[j]);
            }
        }
    });
    return events;
}
/**
 * Applies debug meta data to an event from a list of paths to resources (sourcemaps)
 */ function applyDebugMetadata(resource_paths) {
    const client = core.getClient();
    const options = client?.getOptions();
    const stackParser = options?.stackParser;
    if (!stackParser) {
        return [];
    }
    return core.getDebugImagesForResources(stackParser, resource_paths);
}
/**
 * Checks the given sample rate to make sure it is valid type and value (a boolean, or a number between 0 and 1).
 */ function isValidSampleRate(rate) {
    // we need to check NaN explicitly because it's of type 'number' and therefore wouldn't get caught by this typecheck
    if (typeof rate !== 'number' && typeof rate !== 'boolean' || typeof rate === 'number' && isNaN(rate)) {
        debugBuild.DEBUG_BUILD && core.debug.warn(`[Profiling] Invalid sample rate. Sample rate must be a boolean or a number between 0 and 1. Got ${JSON.stringify(rate)} of type ${JSON.stringify(typeof rate)}.`);
        return false;
    }
    // Boolean sample rates are always valid
    if (rate === true || rate === false) {
        return true;
    }
    // in case sampleRate is a boolean, it will get automatically cast to 1 if it's true and 0 if it's false
    if (rate < 0 || rate > 1) {
        debugBuild.DEBUG_BUILD && core.debug.warn(`[Profiling] Invalid sample rate. Sample rate must be between 0 and 1. Got ${rate}.`);
        return false;
    }
    return true;
}
function isValidProfile(profile) {
    if (profile.samples.length < 2) {
        if (debugBuild.DEBUG_BUILD) {
            // Log a warning if the profile has less than 2 samples so users can know why
            // they are not seeing any profiling data and we cant avoid the back and forth
            // of asking them to provide us with a dump of the profile data.
            core.debug.log('[Profiling] Discarding profile because it contains less than 2 samples');
        }
        return false;
    }
    if (!profile.frames.length) {
        if (debugBuild.DEBUG_BUILD) {
            core.debug.log('[Profiling] Discarding profile because it contains no frames');
        }
        return false;
    }
    return true;
}
// Keep a flag value to avoid re-initializing the profiler constructor. If it fails
// once, it will always fail and this allows us to early return.
let PROFILING_CONSTRUCTOR_FAILED = false;
const MAX_PROFILE_DURATION_MS = 30000;
/**
 * Check if profiler constructor is available.
 * @param maybeProfiler
 */ function isJSProfilerSupported(maybeProfiler) {
    return typeof maybeProfiler === 'function';
}
/**
 * Starts the profiler and returns the profiler instance.
 */ function startJSSelfProfile() {
    // Feature support check first
    const JSProfilerConstructor = helpers.WINDOW.Profiler;
    if (!isJSProfilerSupported(JSProfilerConstructor)) {
        if (debugBuild.DEBUG_BUILD) {
            core.debug.log('[Profiling] Profiling is not supported by this browser, Profiler interface missing on window object.');
        }
        return;
    }
    // From initial testing, it seems that the minimum value for sampleInterval is 10ms.
    const samplingIntervalMS = 10;
    // Start the profiler
    const maxSamples = Math.floor(MAX_PROFILE_DURATION_MS / samplingIntervalMS);
    // Attempt to initialize the profiler constructor, if it fails, we disable profiling for the current user session.
    // This is likely due to a missing 'Document-Policy': 'js-profiling' header. We do not want to throw an error if this happens
    // as we risk breaking the user's application, so just disable profiling and log an error.
    try {
        return new JSProfilerConstructor({
            sampleInterval: samplingIntervalMS,
            maxBufferSize: maxSamples
        });
    } catch (e) {
        if (debugBuild.DEBUG_BUILD) {
            core.debug.log("[Profiling] Failed to initialize the Profiling constructor, this is likely due to a missing 'Document-Policy': 'js-profiling' header.");
            core.debug.log('[Profiling] Disabling profiling for current user session.');
        }
        PROFILING_CONSTRUCTOR_FAILED = true;
    }
    return;
}
/**
 * Determine if a profile should be profiled.
 */ function shouldProfileSpanLegacy(span) {
    // If constructor failed once, it will always fail, so we can early return.
    if (PROFILING_CONSTRUCTOR_FAILED) {
        if (debugBuild.DEBUG_BUILD) {
            core.debug.log('[Profiling] Profiling has been disabled for the duration of the current user session.');
        }
        return false;
    }
    if (!span.isRecording()) {
        debugBuild.DEBUG_BUILD && core.debug.log('[Profiling] Discarding profile because root span was not sampled.');
        return false;
    }
    const client = core.getClient();
    const options = client?.getOptions();
    if (!options) {
        debugBuild.DEBUG_BUILD && core.debug.log('[Profiling] Profiling disabled, no options found.');
        return false;
    }
    // eslint-disable-next-line deprecation/deprecation
    const profilesSampleRate = options.profilesSampleRate;
    // Since this is coming from the user (or from a function provided by the user), who knows what we might get. (The
    // only valid values are booleans or numbers between 0 and 1.)
    if (!isValidSampleRate(profilesSampleRate)) {
        debugBuild.DEBUG_BUILD && core.debug.warn('[Profiling] Discarding profile because of invalid sample rate.');
        return false;
    }
    // if the function returned 0 (or false), or if `profileSampleRate` is 0, it's a sign the profile should be dropped
    if (!profilesSampleRate) {
        debugBuild.DEBUG_BUILD && core.debug.log('[Profiling] Discarding profile because a negative sampling decision was inherited or profileSampleRate is set to 0');
        return false;
    }
    // Now we roll the dice. Math.random is inclusive of 0, but not of 1, so strict < is safe here. In case sampleRate is
    // a boolean, the < comparison will cause it to be automatically cast to 1 if it's true and 0 if it's false.
    const sampled = profilesSampleRate === true ? true : Math.random() < profilesSampleRate;
    // Check if we should sample this profile
    if (!sampled) {
        debugBuild.DEBUG_BUILD && core.debug.log(`[Profiling] Discarding profile because it's not included in the random sample (sampling rate = ${Number(profilesSampleRate)})`);
        return false;
    }
    return true;
}
/**
 * Determine if a profile should be created for the current session.
 */ function shouldProfileSession(options) {
    // If constructor failed once, it will always fail, so we can early return.
    if (PROFILING_CONSTRUCTOR_FAILED) {
        if (debugBuild.DEBUG_BUILD) {
            core.debug.log('[Profiling] Profiling has been disabled for the duration of the current user session as the JS Profiler could not be started.');
        }
        return false;
    }
    if (options.profileLifecycle !== 'trace' && options.profileLifecycle !== 'manual') {
        debugBuild.DEBUG_BUILD && core.debug.warn('[Profiling] Session not sampled. Invalid `profileLifecycle` option.');
        return false;
    }
    //  Session sampling: profileSessionSampleRate gates whether profiling is enabled for this session
    const profileSessionSampleRate = options.profileSessionSampleRate;
    if (!isValidSampleRate(profileSessionSampleRate)) {
        debugBuild.DEBUG_BUILD && core.debug.warn('[Profiling] Discarding profile because of invalid profileSessionSampleRate.');
        return false;
    }
    if (!profileSessionSampleRate) {
        debugBuild.DEBUG_BUILD && core.debug.log('[Profiling] Discarding profile because profileSessionSampleRate is not defined or set to 0');
        return false;
    }
    return Math.random() <= profileSessionSampleRate;
}
/**
 * Checks if legacy profiling is configured.
 */ function hasLegacyProfiling(options) {
    // eslint-disable-next-line deprecation/deprecation
    return typeof options.profilesSampleRate !== 'undefined';
}
/**
 * Creates a profiling envelope item, if the profile does not pass validation, returns null.
 * @param event
 * @returns {Profile | null}
 */ function createProfilingEvent(profile_id, start_timestamp, profile, event) {
    if (!isValidProfile(profile)) {
        return null;
    }
    return createProfilePayload(profile_id, start_timestamp, profile, event);
}
// TODO (v8): We need to obtain profile ids in @sentry-internal/tracing,
// but we don't have access to this map because importing this map would
// cause a circular dependency. We need to resolve this in v8.
const PROFILE_MAP = new Map();
/**
 *
 */ function getActiveProfilesCount() {
    return PROFILE_MAP.size;
}
/**
 * Retrieves profile from global cache and removes it.
 */ function takeProfileFromGlobalCache(profile_id) {
    const profile = PROFILE_MAP.get(profile_id);
    if (profile) {
        PROFILE_MAP.delete(profile_id);
    }
    return profile;
}
/**
 * Adds profile to global cache and evicts the oldest profile if the cache is full.
 */ function addProfileToGlobalCache(profile_id, profile) {
    PROFILE_MAP.set(profile_id, profile);
    if (PROFILE_MAP.size > 30) {
        const last = PROFILE_MAP.keys().next().value;
        if (last !== undefined) {
            PROFILE_MAP.delete(last);
        }
    }
}
/**
 * Attaches the profiled thread information to the event's trace context.
 */ function attachProfiledThreadToEvent(event) {
    if (!event?.contexts?.profile) {
        return event;
    }
    if (!event.contexts) {
        return event;
    }
    // @ts-expect-error the trace fallback value is wrong, though it should never happen
    // and in case it does, we dont want to override whatever was passed initially.
    event.contexts.trace = {
        ...event.contexts?.trace ?? {},
        data: {
            ...event.contexts?.trace?.data ?? {},
            ['thread.id']: PROFILER_THREAD_ID_STRING,
            ['thread.name']: PROFILER_THREAD_NAME
        }
    };
    // Attach thread info to individual spans so that spans can be associated with the profiled thread on the UI even if contexts are missing.
    event.spans?.forEach((span)=>{
        span.data = {
            ...span.data || {},
            ['thread.id']: PROFILER_THREAD_ID_STRING,
            ['thread.name']: PROFILER_THREAD_NAME
        };
    });
    return event;
}
exports.MAX_PROFILE_DURATION_MS = MAX_PROFILE_DURATION_MS;
exports.PROFILER_THREAD_ID_STRING = PROFILER_THREAD_ID_STRING;
exports.PROFILER_THREAD_NAME = PROFILER_THREAD_NAME;
exports.addProfileToGlobalCache = addProfileToGlobalCache;
exports.addProfilesToEnvelope = addProfilesToEnvelope;
exports.applyDebugMetadata = applyDebugMetadata;
exports.attachProfiledThreadToEvent = attachProfiledThreadToEvent;
exports.convertJSSelfProfileToSampledFormat = convertJSSelfProfileToSampledFormat;
exports.createProfileChunkPayload = createProfileChunkPayload;
exports.createProfilePayload = createProfilePayload;
exports.createProfilingEvent = createProfilingEvent;
exports.enrichWithThreadInformation = enrichWithThreadInformation;
exports.findProfiledTransactionsFromEnvelope = findProfiledTransactionsFromEnvelope;
exports.getActiveProfilesCount = getActiveProfilesCount;
exports.hasLegacyProfiling = hasLegacyProfiling;
exports.isAutomatedPageLoadSpan = isAutomatedPageLoadSpan;
exports.isValidSampleRate = isValidSampleRate;
exports.shouldProfileSession = shouldProfileSession;
exports.shouldProfileSpanLegacy = shouldProfileSpanLegacy;
exports.startJSSelfProfile = startJSSelfProfile;
exports.takeProfileFromGlobalCache = takeProfileFromGlobalCache;
exports.validateProfileChunk = validateProfileChunk; //# sourceMappingURL=utils.js.map
}),
"[project]/node_modules/@sentry/browser/build/npm/cjs/dev/profiling/startProfileForSpan.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const core = __turbopack_context__.r("[project]/node_modules/@sentry/core/build/cjs/index.js [app-client] (ecmascript)");
const debugBuild = __turbopack_context__.r("[project]/node_modules/@sentry/browser/build/npm/cjs/dev/debug-build.js [app-client] (ecmascript)");
const helpers = __turbopack_context__.r("[project]/node_modules/@sentry/browser/build/npm/cjs/dev/helpers.js [app-client] (ecmascript)");
const utils = __turbopack_context__.r("[project]/node_modules/@sentry/browser/build/npm/cjs/dev/profiling/utils.js [app-client] (ecmascript)");
/**
 * Wraps startTransaction and stopTransaction with profiling related logic.
 * startProfileForTransaction is called after the call to startTransaction in order to avoid our own code from
 * being profiled. Because of that same reason, stopProfiling is called before the call to stopTransaction.
 */ function startProfileForSpan(span) {
    // Start the profiler and get the profiler instance.
    let startTimestamp;
    if (utils.isAutomatedPageLoadSpan(span)) {
        startTimestamp = core.timestampInSeconds() * 1000;
    }
    const profiler = utils.startJSSelfProfile();
    // We failed to construct the profiler, so we skip.
    // No need to log anything as this has already been logged in startProfile.
    if (!profiler) {
        return;
    }
    if (debugBuild.DEBUG_BUILD) {
        core.debug.log(`[Profiling] started profiling span: ${core.spanToJSON(span).description}`);
    }
    // We create "unique" span names to avoid concurrent spans with same names
    // from being ignored by the profiler. From here on, only this span name should be used when
    // calling the profiler methods. Note: we log the original name to the user to avoid confusion.
    const profileId = core.uuid4();
    // A couple of important things to note here:
    // `CpuProfilerBindings.stopProfiling` will be scheduled to run in 30seconds in order to exceed max profile duration.
    // Whichever of the two (span.finish/timeout) is first to run, the profiling will be stopped and the gathered profile
    // will be processed when the original span is finished. Since onProfileHandler can be invoked multiple times in the
    // event of an error or user mistake (calling span.finish multiple times), it is important that the behavior of onProfileHandler
    // is idempotent as we do not want any timings or profiles to be overridden by the last call to onProfileHandler.
    // After the original finish method is called, the event will be reported through the integration and delegated to transport.
    let processedProfile = null;
    core.getCurrentScope().setContext('profile', {
        profile_id: profileId,
        start_timestamp: startTimestamp
    });
    /**
   * Idempotent handler for profile stop
   */ async function onProfileHandler() {
        // Check if the profile exists and return it the behavior has to be idempotent as users may call span.finish multiple times.
        if (!span) {
            return;
        }
        // Satisfy the type checker, but profiler will always be defined here.
        if (!profiler) {
            return;
        }
        if (processedProfile) {
            if (debugBuild.DEBUG_BUILD) {
                core.debug.log('[Profiling] profile for:', core.spanToJSON(span).description, 'already exists, returning early');
            }
            return;
        }
        return profiler.stop().then((profile)=>{
            if (maxDurationTimeoutID) {
                helpers.WINDOW.clearTimeout(maxDurationTimeoutID);
                maxDurationTimeoutID = undefined;
            }
            if (debugBuild.DEBUG_BUILD) {
                core.debug.log(`[Profiling] stopped profiling of span: ${core.spanToJSON(span).description}`);
            }
            // In case of an overlapping span, stopProfiling may return null and silently ignore the overlapping profile.
            if (!profile) {
                if (debugBuild.DEBUG_BUILD) {
                    core.debug.log(`[Profiling] profiler returned null profile for: ${core.spanToJSON(span).description}`, 'this may indicate an overlapping span or a call to stopProfiling with a profile title that was never started');
                }
                return;
            }
            processedProfile = profile;
            utils.addProfileToGlobalCache(profileId, profile);
        }).catch((error)=>{
            if (debugBuild.DEBUG_BUILD) {
                core.debug.log('[Profiling] error while stopping profiler:', error);
            }
        });
    }
    // Enqueue a timeout to prevent profiles from running over max duration.
    let maxDurationTimeoutID = helpers.WINDOW.setTimeout(()=>{
        if (debugBuild.DEBUG_BUILD) {
            core.debug.log('[Profiling] max profile duration elapsed, stopping profiling for:', core.spanToJSON(span).description);
        }
        // If the timeout exceeds, we want to stop profiling, but not finish the span
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        onProfileHandler();
    }, utils.MAX_PROFILE_DURATION_MS);
    // We need to reference the original end call to avoid creating an infinite loop
    const originalEnd = span.end.bind(span);
    /**
   * Wraps span `end()` with profiling related logic.
   * startProfiling is called after the call to spanStart in order to avoid our own code from
   * being profiled. Because of that same reason, stopProfiling is called before the call to spanEnd.
   */ function profilingWrappedSpanEnd() {
        if (!span) {
            return originalEnd();
        }
        // onProfileHandler should always return the same profile even if this is called multiple times.
        // Always call onProfileHandler to ensure stopProfiling is called and the timeout is cleared.
        void onProfileHandler().then(()=>{
            originalEnd();
        }, ()=>{
            // If onProfileHandler fails, we still want to call the original finish method.
            originalEnd();
        });
        return span;
    }
    span.end = profilingWrappedSpanEnd;
}
exports.startProfileForSpan = startProfileForSpan; //# sourceMappingURL=startProfileForSpan.js.map
}),
"[project]/node_modules/@sentry/browser/build/npm/cjs/dev/profiling/UIProfiler.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const core = __turbopack_context__.r("[project]/node_modules/@sentry/core/build/cjs/index.js [app-client] (ecmascript)");
const debugBuild = __turbopack_context__.r("[project]/node_modules/@sentry/browser/build/npm/cjs/dev/debug-build.js [app-client] (ecmascript)");
const utils = __turbopack_context__.r("[project]/node_modules/@sentry/browser/build/npm/cjs/dev/profiling/utils.js [app-client] (ecmascript)");
const CHUNK_INTERVAL_MS = 60000; // 1 minute
// Maximum length for trace lifecycle profiling per root span (e.g. if spanEnd never fires)
const MAX_ROOT_SPAN_PROFILE_MS = 300000; // 5 minutes max per root span in trace mode
/**
 * UIProfiler (Profiling V2):
 * Supports two lifecycle modes:
 *  - 'manual': controlled explicitly via start()/stop()
 *  - 'trace': automatically runs while there are active sampled root spans
 *
 * Profiles are emitted as standalone `profile_chunk` envelopes either when:
 * - there are no more sampled root spans, or
 * - the 60s chunk timer elapses while profiling is running.
 */ class UIProfiler {
    // Manual + Trace
    // one per Profiler session
    // current profiler instance active flag
    // sampling decision for entire session
    // Trace-only
    constructor(){
        this._client = undefined;
        this._profiler = undefined;
        this._chunkTimer = undefined;
        this._profilerId = undefined;
        this._isRunning = false;
        this._sessionSampled = false;
        this._lifecycleMode = undefined;
        this._activeRootSpanIds = new Set();
        this._rootSpanTimeouts = new Map();
    }
    /**
   * Initialize the profiler with client, session sampling and lifecycle mode.
   */ initialize(client) {
        const lifecycleMode = client.getOptions().profileLifecycle;
        const sessionSampled = utils.shouldProfileSession(client.getOptions());
        debugBuild.DEBUG_BUILD && core.debug.log(`[Profiling] Initializing profiler (lifecycle='${lifecycleMode}').`);
        if (!sessionSampled) {
            debugBuild.DEBUG_BUILD && core.debug.log('[Profiling] Session not sampled. Skipping lifecycle profiler initialization.');
        }
        // One Profiler ID per profiling session (user session)
        this._profilerId = core.uuid4();
        this._client = client;
        this._sessionSampled = sessionSampled;
        this._lifecycleMode = lifecycleMode;
        if (lifecycleMode === 'trace') {
            this._setupTraceLifecycleListeners(client);
        }
    }
    /** Starts UI profiling (only effective in 'manual' mode and when sampled). */ start() {
        if (this._lifecycleMode === 'trace') {
            debugBuild.DEBUG_BUILD && core.debug.warn('[Profiling] `profileLifecycle` is set to "trace". Calls to `uiProfiler.start()` are ignored in trace mode.');
            return;
        }
        if (this._isRunning) {
            debugBuild.DEBUG_BUILD && core.debug.warn('[Profiling] Profile session is already running, `uiProfiler.start()` is a no-op.');
            return;
        }
        if (!this._sessionSampled) {
            debugBuild.DEBUG_BUILD && core.debug.warn('[Profiling] Session is not sampled, `uiProfiler.start()` is a no-op.');
            return;
        }
        this._beginProfiling();
    }
    /** Stops UI profiling (only effective in 'manual' mode). */ stop() {
        if (this._lifecycleMode === 'trace') {
            debugBuild.DEBUG_BUILD && core.debug.warn('[Profiling] `profileLifecycle` is set to "trace". Calls to `uiProfiler.stop()` are ignored in trace mode.');
            return;
        }
        if (!this._isRunning) {
            debugBuild.DEBUG_BUILD && core.debug.warn('[Profiling] Profiler is not running, `uiProfiler.stop()` is a no-op.');
            return;
        }
        this._endProfiling();
    }
    /** Handle an already-active root span at integration setup time (used only in trace mode). */ notifyRootSpanActive(rootSpan) {
        if (this._lifecycleMode !== 'trace' || !this._sessionSampled) {
            return;
        }
        const spanId = rootSpan.spanContext().spanId;
        if (!spanId || this._activeRootSpanIds.has(spanId)) {
            return;
        }
        this._registerTraceRootSpan(spanId);
        const rootSpanCount = this._activeRootSpanIds.size;
        if (rootSpanCount === 1) {
            debugBuild.DEBUG_BUILD && core.debug.log('[Profiling] Detected already active root span during setup. Active root spans now:', rootSpanCount);
            this._beginProfiling();
        }
    }
    /**
   * Begin profiling if not already running.
   */ _beginProfiling() {
        if (this._isRunning) {
            return;
        }
        this._isRunning = true;
        debugBuild.DEBUG_BUILD && core.debug.log('[Profiling] Started profiling with profiler ID:', this._profilerId);
        // Expose profiler_id to match root spans with profiles
        core.getGlobalScope().setContext('profile', {
            profiler_id: this._profilerId
        });
        this._startProfilerInstance();
        if (!this._profiler) {
            debugBuild.DEBUG_BUILD && core.debug.log('[Profiling] Failed to start JS Profiler; stopping.');
            this._resetProfilerInfo();
            return;
        }
        this._startPeriodicChunking();
    }
    /** End profiling session; final chunk will be collected and sent. */ _endProfiling() {
        if (!this._isRunning) {
            return;
        }
        this._isRunning = false;
        if (this._chunkTimer) {
            clearTimeout(this._chunkTimer);
            this._chunkTimer = undefined;
        }
        this._clearAllRootSpanTimeouts();
        // Collect whatever was currently recording
        this._collectCurrentChunk().catch((e)=>{
            debugBuild.DEBUG_BUILD && core.debug.error('[Profiling] Failed to collect current profile chunk on `stop()`:', e);
        });
        // Manual: Clear profiling context so spans outside start()/stop() aren't marked as profiled
        // Trace: Profile context is kept for the whole session duration
        if (this._lifecycleMode === 'manual') {
            core.getGlobalScope().setContext('profile', {});
        }
    }
    /** Trace-mode: attach spanStart/spanEnd listeners. */ _setupTraceLifecycleListeners(client) {
        client.on('spanStart', (span)=>{
            if (!this._sessionSampled) {
                debugBuild.DEBUG_BUILD && core.debug.log('[Profiling] Session not sampled because of negative sampling decision.');
                return;
            }
            if (span !== core.getRootSpan(span)) {
                return; // only care about root spans
            }
            // Only count sampled root spans
            if (!span.isRecording()) {
                debugBuild.DEBUG_BUILD && core.debug.log('[Profiling] Discarding profile because root span was not sampled.');
                return;
            }
            const spanId = span.spanContext().spanId;
            if (!spanId || this._activeRootSpanIds.has(spanId)) {
                return;
            }
            this._registerTraceRootSpan(spanId);
            const rootSpanCount = this._activeRootSpanIds.size;
            if (rootSpanCount === 1) {
                debugBuild.DEBUG_BUILD && core.debug.log(`[Profiling] Root span ${spanId} started. Profiling active while there are active root spans (count=${rootSpanCount}).`);
                this._beginProfiling();
            }
        });
        client.on('spanEnd', (span)=>{
            if (!this._sessionSampled) {
                return;
            }
            const spanId = span.spanContext().spanId;
            if (!spanId || !this._activeRootSpanIds.has(spanId)) {
                return;
            }
            this._activeRootSpanIds.delete(spanId);
            const rootSpanCount = this._activeRootSpanIds.size;
            debugBuild.DEBUG_BUILD && core.debug.log(`[Profiling] Root span with ID ${spanId} ended. Will continue profiling for as long as there are active root spans (currently: ${rootSpanCount}).`);
            if (rootSpanCount === 0) {
                this._collectCurrentChunk().catch((e)=>{
                    debugBuild.DEBUG_BUILD && core.debug.error('[Profiling] Failed to collect current profile chunk on last `spanEnd`:', e);
                });
                this._endProfiling();
            }
        });
    }
    /**
   * Resets profiling information from scope and resets running state (used on failure)
   */ _resetProfilerInfo() {
        this._isRunning = false;
        core.getGlobalScope().setContext('profile', {});
    }
    /**
   * Clear and reset all per-root-span timeouts.
   */ _clearAllRootSpanTimeouts() {
        this._rootSpanTimeouts.forEach((timeout)=>clearTimeout(timeout));
        this._rootSpanTimeouts.clear();
    }
    /** Keep track of root spans and schedule safeguard timeout (trace mode). */ _registerTraceRootSpan(spanId) {
        this._activeRootSpanIds.add(spanId);
        const timeout = setTimeout(()=>this._onRootSpanTimeout(spanId), MAX_ROOT_SPAN_PROFILE_MS);
        this._rootSpanTimeouts.set(spanId, timeout);
    }
    /**
   * Start a profiler instance if needed.
   */ _startProfilerInstance() {
        if (this._profiler?.stopped === false) {
            return; // already running
        }
        const profiler = utils.startJSSelfProfile();
        if (!profiler) {
            debugBuild.DEBUG_BUILD && core.debug.log('[Profiling] Failed to start JS Profiler.');
            return;
        }
        this._profiler = profiler;
    }
    /**
   * Schedule the next 60s chunk while running.
   * Each tick collects a chunk and restarts the profiler.
   * A chunk should be closed when there are no active root spans anymore OR when the maximum chunk interval is reached.
   */ _startPeriodicChunking() {
        if (!this._isRunning) {
            return;
        }
        this._chunkTimer = setTimeout(()=>{
            this._collectCurrentChunk().catch((e)=>{
                debugBuild.DEBUG_BUILD && core.debug.error('[Profiling] Failed to collect current profile chunk during periodic chunking:', e);
            });
            if (this._isRunning) {
                this._startProfilerInstance();
                if (!this._profiler) {
                    // If restart failed, stop scheduling further chunks and reset context.
                    this._resetProfilerInfo();
                    return;
                }
                this._startPeriodicChunking();
            }
        }, CHUNK_INTERVAL_MS);
    }
    /**
   * Handle timeout for a specific root span ID to avoid indefinitely running profiler if `spanEnd` never fires.
   * If this was the last active root span, collect the current chunk and stop profiling.
   */ _onRootSpanTimeout(rootSpanId) {
        // If span already ended, ignore
        if (!this._rootSpanTimeouts.has(rootSpanId)) {
            return;
        }
        this._rootSpanTimeouts.delete(rootSpanId);
        if (!this._activeRootSpanIds.has(rootSpanId)) {
            return;
        }
        debugBuild.DEBUG_BUILD && core.debug.log(`[Profiling] Reached 5-minute timeout for root span ${rootSpanId}. You likely started a manual root span that never called \`.end()\`.`);
        this._activeRootSpanIds.delete(rootSpanId);
        if (this._activeRootSpanIds.size === 0) {
            this._endProfiling();
        }
    }
    /**
   * Stop current profiler instance, convert profile to chunk & send.
   */ async _collectCurrentChunk() {
        const prevProfiler = this._profiler;
        this._profiler = undefined;
        if (!prevProfiler) {
            return;
        }
        try {
            const profile = await prevProfiler.stop();
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            const chunk = utils.createProfileChunkPayload(profile, this._client, this._profilerId);
            // Validate chunk before sending
            const validationReturn = utils.validateProfileChunk(chunk);
            if ('reason' in validationReturn) {
                debugBuild.DEBUG_BUILD && core.debug.log('[Profiling] Discarding invalid profile chunk (this is probably a bug in the SDK):', validationReturn.reason);
                return;
            }
            this._sendProfileChunk(chunk);
            debugBuild.DEBUG_BUILD && core.debug.log('[Profiling] Collected browser profile chunk.');
        } catch (e) {
            debugBuild.DEBUG_BUILD && core.debug.log('[Profiling] Error while stopping JS Profiler for chunk:', e);
        }
    }
    /**
   * Send a profile chunk as a standalone envelope.
   */ _sendProfileChunk(chunk) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const client = this._client;
        const sdkInfo = core.getSdkMetadataForEnvelopeHeader(client.getSdkMetadata?.());
        const dsn = client.getDsn();
        const tunnel = client.getOptions().tunnel;
        const envelope = core.createEnvelope({
            event_id: core.uuid4(),
            sent_at: new Date().toISOString(),
            ...sdkInfo && {
                sdk: sdkInfo
            },
            ...!!tunnel && dsn && {
                dsn: core.dsnToString(dsn)
            }
        }, [
            [
                {
                    type: 'profile_chunk'
                },
                chunk
            ]
        ]);
        client.sendEnvelope(envelope).then(null, (reason)=>{
            debugBuild.DEBUG_BUILD && core.debug.error('Error while sending profile chunk envelope:', reason);
        });
    }
}
exports.UIProfiler = UIProfiler; //# sourceMappingURL=UIProfiler.js.map
}),
"[project]/node_modules/@sentry/browser/build/npm/cjs/dev/profiling/integration.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const core = __turbopack_context__.r("[project]/node_modules/@sentry/core/build/cjs/index.js [app-client] (ecmascript)");
const debugBuild = __turbopack_context__.r("[project]/node_modules/@sentry/browser/build/npm/cjs/dev/debug-build.js [app-client] (ecmascript)");
const helpers = __turbopack_context__.r("[project]/node_modules/@sentry/browser/build/npm/cjs/dev/helpers.js [app-client] (ecmascript)");
const startProfileForSpan = __turbopack_context__.r("[project]/node_modules/@sentry/browser/build/npm/cjs/dev/profiling/startProfileForSpan.js [app-client] (ecmascript)");
const UIProfiler = __turbopack_context__.r("[project]/node_modules/@sentry/browser/build/npm/cjs/dev/profiling/UIProfiler.js [app-client] (ecmascript)");
const utils = __turbopack_context__.r("[project]/node_modules/@sentry/browser/build/npm/cjs/dev/profiling/utils.js [app-client] (ecmascript)");
const INTEGRATION_NAME = 'BrowserProfiling';
const _browserProfilingIntegration = ()=>{
    return {
        name: INTEGRATION_NAME,
        setup (client) {
            const options = client.getOptions();
            const profiler = new UIProfiler.UIProfiler();
            if (!utils.hasLegacyProfiling(options) && !options.profileLifecycle) {
                // Set default lifecycle mode
                options.profileLifecycle = 'manual';
            }
            // eslint-disable-next-line deprecation/deprecation
            if (utils.hasLegacyProfiling(options) && !options.profilesSampleRate) {
                debugBuild.DEBUG_BUILD && core.debug.log('[Profiling] Profiling disabled, no profiling options found.');
                return;
            }
            const activeSpan = core.getActiveSpan();
            const rootSpan = activeSpan && core.getRootSpan(activeSpan);
            if (utils.hasLegacyProfiling(options) && options.profileSessionSampleRate !== undefined) {
                debugBuild.DEBUG_BUILD && core.debug.warn('[Profiling] Both legacy profiling (`profilesSampleRate`) and UI profiling settings are defined. `profileSessionSampleRate` has no effect when legacy profiling is enabled.');
            }
            // UI PROFILING (Profiling V2)
            if (!utils.hasLegacyProfiling(options)) {
                const lifecycleMode = options.profileLifecycle;
                // Registering hooks in all lifecycle modes to be able to notify users in case they want to start/stop the profiler manually in `trace` mode
                client.on('startUIProfiler', ()=>profiler.start());
                client.on('stopUIProfiler', ()=>profiler.stop());
                if (lifecycleMode === 'manual') {
                    profiler.initialize(client);
                } else if (lifecycleMode === 'trace') {
                    if (!core.hasSpansEnabled(options)) {
                        debugBuild.DEBUG_BUILD && core.debug.warn("[Profiling] `profileLifecycle` is 'trace' but tracing is disabled. Set a `tracesSampleRate` or `tracesSampler` to enable span tracing.");
                        return;
                    }
                    profiler.initialize(client);
                    // If there is an active, sampled root span already, notify the profiler
                    if (rootSpan) {
                        profiler.notifyRootSpanActive(rootSpan);
                    }
                    // In case rootSpan is created slightly after setup -> schedule microtask to re-check and notify.
                    helpers.WINDOW.setTimeout(()=>{
                        const laterActiveSpan = core.getActiveSpan();
                        const laterRootSpan = laterActiveSpan && core.getRootSpan(laterActiveSpan);
                        if (laterRootSpan) {
                            profiler.notifyRootSpanActive(laterRootSpan);
                        }
                    }, 0);
                }
            } else {
                // LEGACY PROFILING (v1)
                if (rootSpan && utils.isAutomatedPageLoadSpan(rootSpan)) {
                    if (utils.shouldProfileSpanLegacy(rootSpan)) {
                        startProfileForSpan.startProfileForSpan(rootSpan);
                    }
                }
                client.on('spanStart', (span)=>{
                    if (span === core.getRootSpan(span) && utils.shouldProfileSpanLegacy(span)) {
                        startProfileForSpan.startProfileForSpan(span);
                    }
                });
                client.on('beforeEnvelope', (envelope)=>{
                    // if not profiles are in queue, there is nothing to add to the envelope.
                    if (!utils.getActiveProfilesCount()) {
                        return;
                    }
                    const profiledTransactionEvents = utils.findProfiledTransactionsFromEnvelope(envelope);
                    if (!profiledTransactionEvents.length) {
                        return;
                    }
                    const profilesToAddToEnvelope = [];
                    for (const profiledTransaction of profiledTransactionEvents){
                        const context = profiledTransaction?.contexts;
                        const profile_id = context?.profile?.['profile_id'];
                        const start_timestamp = context?.profile?.['start_timestamp'];
                        if (typeof profile_id !== 'string') {
                            debugBuild.DEBUG_BUILD && core.debug.log('[Profiling] cannot find profile for a span without a profile context');
                            continue;
                        }
                        if (!profile_id) {
                            debugBuild.DEBUG_BUILD && core.debug.log('[Profiling] cannot find profile for a span without a profile context');
                            continue;
                        }
                        // Remove the profile from the span context before sending, relay will take care of the rest.
                        if (context?.profile) {
                            delete context.profile;
                        }
                        const profile = utils.takeProfileFromGlobalCache(profile_id);
                        if (!profile) {
                            debugBuild.DEBUG_BUILD && core.debug.log(`[Profiling] Could not retrieve profile for span: ${profile_id}`);
                            continue;
                        }
                        const profileEvent = utils.createProfilingEvent(profile_id, start_timestamp, profile, profiledTransaction);
                        if (profileEvent) {
                            profilesToAddToEnvelope.push(profileEvent);
                        }
                    }
                    utils.addProfilesToEnvelope(envelope, profilesToAddToEnvelope);
                });
            }
        },
        processEvent (event) {
            return utils.attachProfiledThreadToEvent(event);
        }
    };
};
const browserProfilingIntegration = core.defineIntegration(_browserProfilingIntegration);
exports.browserProfilingIntegration = browserProfilingIntegration; //# sourceMappingURL=integration.js.map
}),
"[project]/node_modules/@sentry/browser/build/npm/cjs/dev/integrations/featureFlags/launchdarkly/integration.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const core = __turbopack_context__.r("[project]/node_modules/@sentry/core/build/cjs/index.js [app-client] (ecmascript)");
/**
 * Sentry integration for capturing feature flag evaluations from LaunchDarkly.
 *
 * See the [feature flag documentation](https://develop.sentry.dev/sdk/expected-features/#feature-flags) for more information.
 *
 * @example
 * ```
 * import * as Sentry from '@sentry/browser';
 * import {launchDarklyIntegration, buildLaunchDarklyFlagUsedInspector} from '@sentry/browser';
 * import * as LaunchDarkly from 'launchdarkly-js-client-sdk';
 *
 * Sentry.init(..., integrations: [launchDarklyIntegration()])
 * const ldClient = LaunchDarkly.initialize(..., {inspectors: [buildLaunchDarklyFlagUsedHandler()]});
 * ```
 */ const launchDarklyIntegration = core.defineIntegration(()=>{
    return {
        name: 'LaunchDarkly',
        processEvent (event, _hint, _client) {
            return core._INTERNAL_copyFlagsFromScopeToEvent(event);
        }
    };
});
/**
 * LaunchDarkly hook to listen for and buffer flag evaluations. This needs to
 * be registered as an 'inspector' in LaunchDarkly initialize() options,
 * separately from `launchDarklyIntegration`. Both the hook and the integration
 * are needed to capture LaunchDarkly flags.
 */ function buildLaunchDarklyFlagUsedHandler() {
    return {
        name: 'sentry-flag-auditor',
        type: 'flag-used',
        synchronous: true,
        /**
     * Handle a flag evaluation by storing its name and value on the current scope.
     */ method: (flagKey, flagDetail, _context)=>{
            core._INTERNAL_insertFlagToScope(flagKey, flagDetail.value);
            core._INTERNAL_addFeatureFlagToActiveSpan(flagKey, flagDetail.value);
        }
    };
}
exports.buildLaunchDarklyFlagUsedHandler = buildLaunchDarklyFlagUsedHandler;
exports.launchDarklyIntegration = launchDarklyIntegration; //# sourceMappingURL=integration.js.map
}),
"[project]/node_modules/@sentry/browser/build/npm/cjs/dev/integrations/featureFlags/openfeature/integration.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const core = __turbopack_context__.r("[project]/node_modules/@sentry/core/build/cjs/index.js [app-client] (ecmascript)");
const openFeatureIntegration = core.defineIntegration(()=>{
    return {
        name: 'OpenFeature',
        processEvent (event, _hint, _client) {
            return core._INTERNAL_copyFlagsFromScopeToEvent(event);
        }
    };
});
/**
 * OpenFeature Hook class implementation.
 */ class OpenFeatureIntegrationHook {
    /**
   * Successful evaluation result.
   */ after(_hookContext, evaluationDetails) {
        core._INTERNAL_insertFlagToScope(evaluationDetails.flagKey, evaluationDetails.value);
        core._INTERNAL_addFeatureFlagToActiveSpan(evaluationDetails.flagKey, evaluationDetails.value);
    }
    /**
   * On error evaluation result.
   */ error(hookContext, _error, _hookHints) {
        core._INTERNAL_insertFlagToScope(hookContext.flagKey, hookContext.defaultValue);
        core._INTERNAL_addFeatureFlagToActiveSpan(hookContext.flagKey, hookContext.defaultValue);
    }
}
exports.OpenFeatureIntegrationHook = OpenFeatureIntegrationHook;
exports.openFeatureIntegration = openFeatureIntegration; //# sourceMappingURL=integration.js.map
}),
"[project]/node_modules/@sentry/browser/build/npm/cjs/dev/integrations/featureFlags/unleash/integration.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const core = __turbopack_context__.r("[project]/node_modules/@sentry/core/build/cjs/index.js [app-client] (ecmascript)");
const debugBuild = __turbopack_context__.r("[project]/node_modules/@sentry/browser/build/npm/cjs/dev/debug-build.js [app-client] (ecmascript)");
/**
 * Sentry integration for capturing feature flag evaluations from the Unleash SDK.
 *
 * See the [feature flag documentation](https://develop.sentry.dev/sdk/expected-features/#feature-flags) for more information.
 *
 * @example
 * ```
 * import { UnleashClient } from 'unleash-proxy-client';
 * import * as Sentry from '@sentry/browser';
 *
 * Sentry.init({
 *   dsn: '___PUBLIC_DSN___',
 *   integrations: [Sentry.unleashIntegration({featureFlagClientClass: UnleashClient})],
 * });
 *
 * const unleash = new UnleashClient(...);
 * unleash.start();
 *
 * unleash.isEnabled('my-feature');
 * Sentry.captureException(new Error('something went wrong'));
 * ```
 */ const unleashIntegration = core.defineIntegration(({ featureFlagClientClass: unleashClientClass })=>{
    return {
        name: 'Unleash',
        setupOnce () {
            const unleashClientPrototype = unleashClientClass.prototype;
            core.fill(unleashClientPrototype, 'isEnabled', _wrappedIsEnabled);
        },
        processEvent (event, _hint, _client) {
            return core._INTERNAL_copyFlagsFromScopeToEvent(event);
        }
    };
});
/**
 * Wraps the UnleashClient.isEnabled method to capture feature flag evaluations. Its only side effect is writing to Sentry scope.
 *
 * This wrapper is safe for all isEnabled signatures. If the signature does not match (this: UnleashClient, toggleName: string, ...args: unknown[]) => boolean,
 * we log an error and return the original result.
 *
 * @param original - The original method.
 * @returns Wrapped method. Results should match the original.
 */ function _wrappedIsEnabled(original) {
    return function(...args) {
        const toggleName = args[0];
        const result = original.apply(this, args);
        if (typeof toggleName === 'string' && typeof result === 'boolean') {
            core._INTERNAL_insertFlagToScope(toggleName, result);
            core._INTERNAL_addFeatureFlagToActiveSpan(toggleName, result);
        } else if (debugBuild.DEBUG_BUILD) {
            core.debug.error(`[Feature Flags] UnleashClient.isEnabled does not match expected signature. arg0: ${toggleName} (${typeof toggleName}), result: ${result} (${typeof result})`);
        }
        return result;
    };
}
exports.unleashIntegration = unleashIntegration; //# sourceMappingURL=integration.js.map
}),
"[project]/node_modules/@sentry/browser/build/npm/cjs/dev/integrations/featureFlags/growthbook/integration.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const core = __turbopack_context__.r("[project]/node_modules/@sentry/core/build/cjs/index.js [app-client] (ecmascript)");
/**
 * Sentry integration for capturing feature flag evaluations from GrowthBook.
 *
 * See the feature flag documentation: https://develop.sentry.dev/sdk/expected-features/#feature-flags
 *
 * @example
 * ```
 * import { GrowthBook } from '@growthbook/growthbook';
 * import * as Sentry from '@sentry/browser';
 *
 * Sentry.init({
 *   dsn: '___PUBLIC_DSN___',
 *   integrations: [Sentry.growthbookIntegration({ growthbookClass: GrowthBook })],
 * });
 *
 * const gb = new GrowthBook();
 * gb.isOn('my-feature');
 * Sentry.captureException(new Error('something went wrong'));
 * ```
 */ const growthbookIntegration = ({ growthbookClass })=>core.growthbookIntegration({
        growthbookClass
    });
exports.growthbookIntegration = growthbookIntegration; //# sourceMappingURL=integration.js.map
}),
"[project]/node_modules/@sentry/browser/build/npm/cjs/dev/integrations/featureFlags/statsig/integration.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const core = __turbopack_context__.r("[project]/node_modules/@sentry/core/build/cjs/index.js [app-client] (ecmascript)");
/**
 * Sentry integration for capturing feature flag evaluations from the Statsig js-client SDK.
 *
 * See the [feature flag documentation](https://develop.sentry.dev/sdk/expected-features/#feature-flags) for more information.
 *
 * @example
 * ```
 * import { StatsigClient } from '@statsig/js-client';
 * import * as Sentry from '@sentry/browser';
 *
 * const statsigClient = new StatsigClient();
 *
 * Sentry.init({
 *   dsn: '___PUBLIC_DSN___',
 *   integrations: [Sentry.statsigIntegration({featureFlagClient: statsigClient})],
 * });
 *
 * await statsigClient.initializeAsync();  // or statsigClient.initializeSync();
 *
 * const result = statsigClient.checkGate('my-feature-gate');
 * Sentry.captureException(new Error('something went wrong'));
 * ```
 */ const statsigIntegration = core.defineIntegration(({ featureFlagClient: statsigClient })=>{
    return {
        name: 'Statsig',
        setup (_client) {
            statsigClient.on('gate_evaluation', (event)=>{
                core._INTERNAL_insertFlagToScope(event.gate.name, event.gate.value);
                core._INTERNAL_addFeatureFlagToActiveSpan(event.gate.name, event.gate.value);
            });
        },
        processEvent (event, _hint, _client) {
            return core._INTERNAL_copyFlagsFromScopeToEvent(event);
        }
    };
});
exports.statsigIntegration = statsigIntegration; //# sourceMappingURL=integration.js.map
}),
"[project]/node_modules/@sentry/browser/build/npm/cjs/dev/diagnose-sdk.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const core = __turbopack_context__.r("[project]/node_modules/@sentry/core/build/cjs/index.js [app-client] (ecmascript)");
/**
 * A function to diagnose why the SDK might not be successfully sending data.
 *
 * Possible return values wrapped in a Promise:
 * - `"no-client-active"` - There was no active client when the function was called. This possibly means that the SDK was not initialized yet.
 * - `"sentry-unreachable"` - The Sentry SaaS servers were not reachable. This likely means that there is an ad blocker active on the page or that there are other connection issues.
 *
 * If the function doesn't detect an issue it resolves to `undefined`.
 */ async function diagnoseSdkConnectivity() {
    const client = core.getClient();
    if (!client) {
        return 'no-client-active';
    }
    if (!client.getDsn()) {
        return 'no-dsn-configured';
    }
    try {
        await core.suppressTracing(()=>// If fetch throws, there is likely an ad blocker active or there are other connective issues.
            fetch(// We are using the
            // - "sentry-sdks" org with id 447951 not to pollute any actual organizations.
            // - "diagnose-sdk-connectivity" project with id 4509632503087104
            // - the public key of said org/project, which is disabled in the project settings
            // => this DSN: https://c1dfb07d783ad5325c245c1fd3725390@o447951.ingest.us.sentry.io/4509632503087104 (i.e. disabled)
            'https://o447951.ingest.sentry.io/api/4509632503087104/envelope/?sentry_version=7&sentry_key=c1dfb07d783ad5325c245c1fd3725390&sentry_client=sentry.javascript.browser%2F1.33.7', {
                body: '{}',
                method: 'POST',
                mode: 'cors',
                credentials: 'omit'
            }));
    } catch  {
        return 'sentry-unreachable';
    }
}
exports.diagnoseSdkConnectivity = diagnoseSdkConnectivity; //# sourceMappingURL=diagnose-sdk.js.map
}),
"[project]/node_modules/@sentry/browser/build/npm/cjs/dev/integrations/webWorker.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const core = __turbopack_context__.r("[project]/node_modules/@sentry/core/build/cjs/index.js [app-client] (ecmascript)");
const debugBuild = __turbopack_context__.r("[project]/node_modules/@sentry/browser/build/npm/cjs/dev/debug-build.js [app-client] (ecmascript)");
const eventbuilder = __turbopack_context__.r("[project]/node_modules/@sentry/browser/build/npm/cjs/dev/eventbuilder.js [app-client] (ecmascript)");
const helpers = __turbopack_context__.r("[project]/node_modules/@sentry/browser/build/npm/cjs/dev/helpers.js [app-client] (ecmascript)");
const globalhandlers = __turbopack_context__.r("[project]/node_modules/@sentry/browser/build/npm/cjs/dev/integrations/globalhandlers.js [app-client] (ecmascript)");
const INTEGRATION_NAME = 'WebWorker';
/**
 * Use this integration to set up Sentry with web workers.
 *
 * IMPORTANT: This integration must be added **before** you start listening to
 * any messages from the worker. Otherwise, your message handlers will receive
 * messages from the Sentry SDK which you need to ignore.
 *
 * This integration only has an effect, if you call `Sentry.registerWebWorker(self)`
 * from within the worker(s) you're adding to the integration.
 *
 * Given that you want to initialize the SDK as early as possible, you most likely
 * want to add this integration **after** initializing the SDK:
 *
 * @example:
 * ```ts filename={main.js}
 * import * as Sentry from '@sentry/<your-sdk>';
 *
 * // some time earlier:
 * Sentry.init(...)
 *
 * // 1. Initialize the worker
 * const worker = new Worker(new URL('./worker.ts', import.meta.url));
 *
 * // 2. Add the integration
 * const webWorkerIntegration = Sentry.webWorkerIntegration({ worker });
 * Sentry.addIntegration(webWorkerIntegration);
 *
 * // 3. Register message listeners on the worker
 * worker.addEventListener('message', event => {
 *  // ...
 * });
 * ```
 *
 * If you initialize multiple workers at the same time, you can also pass an array of workers
 * to the integration:
 *
 * ```ts filename={main.js}
 * const webWorkerIntegration = Sentry.webWorkerIntegration({ worker: [worker1, worker2] });
 * Sentry.addIntegration(webWorkerIntegration);
 * ```
 *
 * If you have any additional workers that you initialize at a later point,
 * you can add them to the integration as follows:
 *
 * ```ts filename={main.js}
 * const webWorkerIntegration = Sentry.webWorkerIntegration({ worker: worker1 });
 * Sentry.addIntegration(webWorkerIntegration);
 *
 * // sometime later:
 * webWorkerIntegration.addWorker(worker2);
 * ```
 *
 * Of course, you can also directly add the integration in Sentry.init:
 * ```ts filename={main.js}
 * import * as Sentry from '@sentry/<your-sdk>';
 *
 * // 1. Initialize the worker
 * const worker = new Worker(new URL('./worker.ts', import.meta.url));
 *
 * // 2. Initialize the SDK
 * Sentry.init({
 *  integrations: [Sentry.webWorkerIntegration({ worker })]
 * });
 *
 * // 3. Register message listeners on the worker
 * worker.addEventListener('message', event => {
 *  // ...
 * });
 * ```
 *
 * @param options {WebWorkerIntegrationOptions} Integration options:
 *   - `worker`: The worker instance.
 */ const webWorkerIntegration = core.defineIntegration(({ worker })=>({
        name: INTEGRATION_NAME,
        setupOnce: ()=>{
            (Array.isArray(worker) ? worker : [
                worker
            ]).forEach((w)=>listenForSentryMessages(w));
        },
        addWorker: (worker)=>listenForSentryMessages(worker)
    }));
function listenForSentryMessages(worker) {
    worker.addEventListener('message', (event)=>{
        if (isSentryMessage(event.data)) {
            event.stopImmediatePropagation(); // other listeners should not receive this message
            // Handle debug IDs
            if (event.data._sentryDebugIds) {
                debugBuild.DEBUG_BUILD && core.debug.log('Sentry debugId web worker message received', event.data);
                helpers.WINDOW._sentryDebugIds = {
                    ...event.data._sentryDebugIds,
                    // debugIds of the main thread have precedence over the worker's in case of a collision.
                    ...helpers.WINDOW._sentryDebugIds
                };
            }
            // Handle unhandled rejections forwarded from worker
            if (event.data._sentryWorkerError) {
                debugBuild.DEBUG_BUILD && core.debug.log('Sentry worker rejection message received', event.data._sentryWorkerError);
                handleForwardedWorkerRejection(event.data._sentryWorkerError);
            }
        }
    });
}
function handleForwardedWorkerRejection(workerError) {
    const client = core.getClient();
    if (!client) {
        return;
    }
    const stackParser = client.getOptions().stackParser;
    const attachStacktrace = client.getOptions().attachStacktrace;
    const error = workerError.reason;
    // Follow same pattern as globalHandlers for unhandledrejection
    // Handle both primitives and errors the same way
    const event = core.isPrimitive(error) ? globalhandlers._eventFromRejectionWithPrimitive(error) : eventbuilder.eventFromUnknownInput(stackParser, error, undefined, attachStacktrace, true);
    event.level = 'error';
    // Add worker-specific context
    if (workerError.filename) {
        event.contexts = {
            ...event.contexts,
            worker: {
                filename: workerError.filename
            }
        };
    }
    core.captureEvent(event, {
        originalException: error,
        mechanism: {
            handled: false,
            type: 'auto.browser.web_worker.onunhandledrejection'
        }
    });
    debugBuild.DEBUG_BUILD && core.debug.log('Captured worker unhandled rejection', error);
}
/**
 * Minimal interface for DedicatedWorkerGlobalScope, only requiring the postMessage method.
 * (which is the only thing we need from the worker's global object)
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/DedicatedWorkerGlobalScope
 *
 * We can't use the actual type because it breaks everyone who doesn't have {"lib": ["WebWorker"]}
 * but uses {"skipLibCheck": true} in their tsconfig.json.
 */ /**
 * Use this function to register the worker with the Sentry SDK.
 *
 * This function will:
 * - Send debug IDs to the parent thread
 * - Set up a handler for unhandled rejections in the worker
 * - Forward unhandled rejections to the parent thread for capture
 *
 * Note: Synchronous errors in workers are already captured by globalHandlers.
 * This only handles unhandled promise rejections which don't bubble to the parent.
 *
 * @example
 * ```ts filename={worker.js}
 * import * as Sentry from '@sentry/<your-sdk>';
 *
 * // Do this as early as possible in your worker.
 * Sentry.registerWebWorker({ self });
 *
 * // continue setting up your worker
 * self.postMessage(...)
 * ```
 * @param options {RegisterWebWorkerOptions} Integration options:
 *   - `self`: The worker instance you're calling this function from (self).
 */ function registerWebWorker({ self }) {
    // Send debug IDs to parent thread
    self.postMessage({
        _sentryMessage: true,
        _sentryDebugIds: self._sentryDebugIds ?? undefined
    });
    // Set up unhandledrejection handler inside the worker
    // Following the same pattern as globalHandlers
    // unhandled rejections don't bubble to the parent thread, so we need to handle them here
    self.addEventListener('unhandledrejection', (event)=>{
        const reason = globalhandlers._getUnhandledRejectionError(event);
        // Forward the raw reason to parent thread
        // The parent will handle primitives vs errors the same way globalHandlers does
        const serializedError = {
            reason: reason,
            filename: self.location?.href
        };
        // Forward to parent thread
        self.postMessage({
            _sentryMessage: true,
            _sentryWorkerError: serializedError
        });
        debugBuild.DEBUG_BUILD && core.debug.log('[Sentry Worker] Forwarding unhandled rejection to parent', serializedError);
    });
    debugBuild.DEBUG_BUILD && core.debug.log('[Sentry Worker] Registered worker with unhandled rejection handling');
}
function isSentryMessage(eventData) {
    if (!core.isPlainObject(eventData) || eventData._sentryMessage !== true) {
        return false;
    }
    // Must have at least one of: debug IDs or worker error
    const hasDebugIds = '_sentryDebugIds' in eventData;
    const hasWorkerError = '_sentryWorkerError' in eventData;
    if (!hasDebugIds && !hasWorkerError) {
        return false;
    }
    // Validate debug IDs if present
    if (hasDebugIds && !(core.isPlainObject(eventData._sentryDebugIds) || eventData._sentryDebugIds === undefined)) {
        return false;
    }
    // Validate worker error if present
    if (hasWorkerError && !core.isPlainObject(eventData._sentryWorkerError)) {
        return false;
    }
    return true;
}
exports.INTEGRATION_NAME = INTEGRATION_NAME;
exports.registerWebWorker = registerWebWorker;
exports.webWorkerIntegration = webWorkerIntegration; //# sourceMappingURL=webWorker.js.map
}),
"[project]/node_modules/@sentry/browser/build/npm/cjs/dev/index.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const feedbackAsync = __turbopack_context__.r("[project]/node_modules/@sentry/browser/build/npm/cjs/dev/feedbackAsync.js [app-client] (ecmascript)");
const feedbackSync = __turbopack_context__.r("[project]/node_modules/@sentry/browser/build/npm/cjs/dev/feedbackSync.js [app-client] (ecmascript)");
const core = __turbopack_context__.r("[project]/node_modules/@sentry/core/build/cjs/index.js [app-client] (ecmascript)");
const helpers = __turbopack_context__.r("[project]/node_modules/@sentry/browser/build/npm/cjs/dev/helpers.js [app-client] (ecmascript)");
const client = __turbopack_context__.r("[project]/node_modules/@sentry/browser/build/npm/cjs/dev/client.js [app-client] (ecmascript)");
const fetch = __turbopack_context__.r("[project]/node_modules/@sentry/browser/build/npm/cjs/dev/transports/fetch.js [app-client] (ecmascript)");
const index = __turbopack_context__.r("[project]/node_modules/@sentry/browser/build/npm/cjs/dev/profiling/index.js [app-client] (ecmascript)");
const stackParsers = __turbopack_context__.r("[project]/node_modules/@sentry/browser/build/npm/cjs/dev/stack-parsers.js [app-client] (ecmascript)");
const eventbuilder = __turbopack_context__.r("[project]/node_modules/@sentry/browser/build/npm/cjs/dev/eventbuilder.js [app-client] (ecmascript)");
const userfeedback = __turbopack_context__.r("[project]/node_modules/@sentry/browser/build/npm/cjs/dev/userfeedback.js [app-client] (ecmascript)");
const sdk = __turbopack_context__.r("[project]/node_modules/@sentry/browser/build/npm/cjs/dev/sdk.js [app-client] (ecmascript)");
const reportDialog = __turbopack_context__.r("[project]/node_modules/@sentry/browser/build/npm/cjs/dev/report-dialog.js [app-client] (ecmascript)");
const breadcrumbs = __turbopack_context__.r("[project]/node_modules/@sentry/browser/build/npm/cjs/dev/integrations/breadcrumbs.js [app-client] (ecmascript)");
const globalhandlers = __turbopack_context__.r("[project]/node_modules/@sentry/browser/build/npm/cjs/dev/integrations/globalhandlers.js [app-client] (ecmascript)");
const httpcontext = __turbopack_context__.r("[project]/node_modules/@sentry/browser/build/npm/cjs/dev/integrations/httpcontext.js [app-client] (ecmascript)");
const linkederrors = __turbopack_context__.r("[project]/node_modules/@sentry/browser/build/npm/cjs/dev/integrations/linkederrors.js [app-client] (ecmascript)");
const browserapierrors = __turbopack_context__.r("[project]/node_modules/@sentry/browser/build/npm/cjs/dev/integrations/browserapierrors.js [app-client] (ecmascript)");
const lazyLoadIntegration = __turbopack_context__.r("[project]/node_modules/@sentry/browser/build/npm/cjs/dev/utils/lazyLoadIntegration.js [app-client] (ecmascript)");
const reportingobserver = __turbopack_context__.r("[project]/node_modules/@sentry/browser/build/npm/cjs/dev/integrations/reportingobserver.js [app-client] (ecmascript)");
const httpclient = __turbopack_context__.r("[project]/node_modules/@sentry/browser/build/npm/cjs/dev/integrations/httpclient.js [app-client] (ecmascript)");
const contextlines = __turbopack_context__.r("[project]/node_modules/@sentry/browser/build/npm/cjs/dev/integrations/contextlines.js [app-client] (ecmascript)");
const graphqlClient = __turbopack_context__.r("[project]/node_modules/@sentry/browser/build/npm/cjs/dev/integrations/graphqlClient.js [app-client] (ecmascript)");
const replay = __turbopack_context__.r("[project]/node_modules/@sentry-internal/replay/build/npm/cjs/index.js [app-client] (ecmascript)");
const replayCanvas = __turbopack_context__.r("[project]/node_modules/@sentry-internal/replay-canvas/build/npm/cjs/index.js [app-client] (ecmascript)");
const feedback = __turbopack_context__.r("[project]/node_modules/@sentry-internal/feedback/build/npm/cjs/index.js [app-client] (ecmascript)");
const request = __turbopack_context__.r("[project]/node_modules/@sentry/browser/build/npm/cjs/dev/tracing/request.js [app-client] (ecmascript)");
const browserTracingIntegration = __turbopack_context__.r("[project]/node_modules/@sentry/browser/build/npm/cjs/dev/tracing/browserTracingIntegration.js [app-client] (ecmascript)");
const reportPageLoaded = __turbopack_context__.r("[project]/node_modules/@sentry/browser/build/npm/cjs/dev/tracing/reportPageLoaded.js [app-client] (ecmascript)");
const setActiveSpan = __turbopack_context__.r("[project]/node_modules/@sentry/browser/build/npm/cjs/dev/tracing/setActiveSpan.js [app-client] (ecmascript)");
const offline = __turbopack_context__.r("[project]/node_modules/@sentry/browser/build/npm/cjs/dev/transports/offline.js [app-client] (ecmascript)");
const integration = __turbopack_context__.r("[project]/node_modules/@sentry/browser/build/npm/cjs/dev/profiling/integration.js [app-client] (ecmascript)");
const spotlight = __turbopack_context__.r("[project]/node_modules/@sentry/browser/build/npm/cjs/dev/integrations/spotlight.js [app-client] (ecmascript)");
const browsersession = __turbopack_context__.r("[project]/node_modules/@sentry/browser/build/npm/cjs/dev/integrations/browsersession.js [app-client] (ecmascript)");
const integration$1 = __turbopack_context__.r("[project]/node_modules/@sentry/browser/build/npm/cjs/dev/integrations/featureFlags/launchdarkly/integration.js [app-client] (ecmascript)");
const integration$2 = __turbopack_context__.r("[project]/node_modules/@sentry/browser/build/npm/cjs/dev/integrations/featureFlags/openfeature/integration.js [app-client] (ecmascript)");
const integration$3 = __turbopack_context__.r("[project]/node_modules/@sentry/browser/build/npm/cjs/dev/integrations/featureFlags/unleash/integration.js [app-client] (ecmascript)");
const integration$4 = __turbopack_context__.r("[project]/node_modules/@sentry/browser/build/npm/cjs/dev/integrations/featureFlags/growthbook/integration.js [app-client] (ecmascript)");
const integration$5 = __turbopack_context__.r("[project]/node_modules/@sentry/browser/build/npm/cjs/dev/integrations/featureFlags/statsig/integration.js [app-client] (ecmascript)");
const diagnoseSdk = __turbopack_context__.r("[project]/node_modules/@sentry/browser/build/npm/cjs/dev/diagnose-sdk.js [app-client] (ecmascript)");
const webWorker = __turbopack_context__.r("[project]/node_modules/@sentry/browser/build/npm/cjs/dev/integrations/webWorker.js [app-client] (ecmascript)");
exports.feedbackAsyncIntegration = feedbackAsync.feedbackAsyncIntegration;
exports.feedbackIntegration = feedbackSync.feedbackSyncIntegration;
exports.feedbackSyncIntegration = feedbackSync.feedbackSyncIntegration;
exports.MULTIPLEXED_TRANSPORT_EXTRA_KEY = core.MULTIPLEXED_TRANSPORT_EXTRA_KEY;
exports.SDK_VERSION = core.SDK_VERSION;
exports.SEMANTIC_ATTRIBUTE_SENTRY_OP = core.SEMANTIC_ATTRIBUTE_SENTRY_OP;
exports.SEMANTIC_ATTRIBUTE_SENTRY_ORIGIN = core.SEMANTIC_ATTRIBUTE_SENTRY_ORIGIN;
exports.SEMANTIC_ATTRIBUTE_SENTRY_SAMPLE_RATE = core.SEMANTIC_ATTRIBUTE_SENTRY_SAMPLE_RATE;
exports.SEMANTIC_ATTRIBUTE_SENTRY_SOURCE = core.SEMANTIC_ATTRIBUTE_SENTRY_SOURCE;
exports.Scope = core.Scope;
exports.addBreadcrumb = core.addBreadcrumb;
exports.addEventProcessor = core.addEventProcessor;
exports.addIntegration = core.addIntegration;
exports.captureConsoleIntegration = core.captureConsoleIntegration;
exports.captureEvent = core.captureEvent;
exports.captureException = core.captureException;
exports.captureFeedback = core.captureFeedback;
exports.captureMessage = core.captureMessage;
exports.captureSession = core.captureSession;
exports.close = core.close;
exports.consoleLoggingIntegration = core.consoleLoggingIntegration;
exports.continueTrace = core.continueTrace;
exports.createConsolaReporter = core.createConsolaReporter;
exports.createLangChainCallbackHandler = core.createLangChainCallbackHandler;
exports.createTransport = core.createTransport;
exports.dedupeIntegration = core.dedupeIntegration;
exports.endSession = core.endSession;
exports.eventFiltersIntegration = core.eventFiltersIntegration;
exports.extraErrorDataIntegration = core.extraErrorDataIntegration;
exports.featureFlagsIntegration = core.featureFlagsIntegration;
exports.flush = core.flush;
exports.functionToStringIntegration = core.functionToStringIntegration;
exports.getActiveSpan = core.getActiveSpan;
exports.getClient = core.getClient;
exports.getCurrentScope = core.getCurrentScope;
exports.getGlobalScope = core.getGlobalScope;
exports.getIsolationScope = core.getIsolationScope;
exports.getRootSpan = core.getRootSpan;
exports.getSpanDescendants = core.getSpanDescendants;
exports.getSpanStatusFromHttpCode = core.getSpanStatusFromHttpCode;
exports.getTraceData = core.getTraceData;
exports.inboundFiltersIntegration = core.inboundFiltersIntegration;
exports.instrumentAnthropicAiClient = core.instrumentAnthropicAiClient;
exports.instrumentGoogleGenAIClient = core.instrumentGoogleGenAIClient;
exports.instrumentLangGraph = core.instrumentLangGraph;
exports.instrumentOpenAiClient = core.instrumentOpenAiClient;
exports.instrumentSupabaseClient = core.instrumentSupabaseClient;
exports.isEnabled = core.isEnabled;
exports.isInitialized = core.isInitialized;
exports.lastEventId = core.lastEventId;
exports.logger = core.logger;
exports.makeMultiplexedTransport = core.makeMultiplexedTransport;
exports.metrics = core.metrics;
exports.moduleMetadataIntegration = core.moduleMetadataIntegration;
exports.parameterize = core.parameterize;
exports.registerSpanErrorInstrumentation = core.registerSpanErrorInstrumentation;
exports.rewriteFramesIntegration = core.rewriteFramesIntegration;
exports.setContext = core.setContext;
exports.setCurrentClient = core.setCurrentClient;
exports.setExtra = core.setExtra;
exports.setExtras = core.setExtras;
exports.setHttpStatus = core.setHttpStatus;
exports.setMeasurement = core.setMeasurement;
exports.setTag = core.setTag;
exports.setTags = core.setTags;
exports.setUser = core.setUser;
exports.spanToBaggageHeader = core.spanToBaggageHeader;
exports.spanToJSON = core.spanToJSON;
exports.spanToTraceHeader = core.spanToTraceHeader;
exports.startInactiveSpan = core.startInactiveSpan;
exports.startNewTrace = core.startNewTrace;
exports.startSession = core.startSession;
exports.startSpan = core.startSpan;
exports.startSpanManual = core.startSpanManual;
exports.supabaseIntegration = core.supabaseIntegration;
exports.suppressTracing = core.suppressTracing;
exports.thirdPartyErrorFilterIntegration = core.thirdPartyErrorFilterIntegration;
exports.updateSpanName = core.updateSpanName;
exports.withActiveSpan = core.withActiveSpan;
exports.withIsolationScope = core.withIsolationScope;
exports.withScope = core.withScope;
exports.zodErrorsIntegration = core.zodErrorsIntegration;
exports.WINDOW = helpers.WINDOW;
exports.BrowserClient = client.BrowserClient;
exports.makeFetchTransport = fetch.makeFetchTransport;
exports.uiProfiler = index.uiProfiler;
exports.chromeStackLineParser = stackParsers.chromeStackLineParser;
exports.defaultStackLineParsers = stackParsers.defaultStackLineParsers;
exports.defaultStackParser = stackParsers.defaultStackParser;
exports.geckoStackLineParser = stackParsers.geckoStackLineParser;
exports.opera10StackLineParser = stackParsers.opera10StackLineParser;
exports.opera11StackLineParser = stackParsers.opera11StackLineParser;
exports.winjsStackLineParser = stackParsers.winjsStackLineParser;
exports.eventFromException = eventbuilder.eventFromException;
exports.eventFromMessage = eventbuilder.eventFromMessage;
exports.exceptionFromError = eventbuilder.exceptionFromError;
exports.createUserFeedbackEnvelope = userfeedback.createUserFeedbackEnvelope;
exports.forceLoad = sdk.forceLoad;
exports.getDefaultIntegrations = sdk.getDefaultIntegrations;
exports.init = sdk.init;
exports.onLoad = sdk.onLoad;
exports.showReportDialog = reportDialog.showReportDialog;
exports.breadcrumbsIntegration = breadcrumbs.breadcrumbsIntegration;
exports.globalHandlersIntegration = globalhandlers.globalHandlersIntegration;
exports.httpContextIntegration = httpcontext.httpContextIntegration;
exports.linkedErrorsIntegration = linkederrors.linkedErrorsIntegration;
exports.browserApiErrorsIntegration = browserapierrors.browserApiErrorsIntegration;
exports.lazyLoadIntegration = lazyLoadIntegration.lazyLoadIntegration;
exports.reportingObserverIntegration = reportingobserver.reportingObserverIntegration;
exports.httpClientIntegration = httpclient.httpClientIntegration;
exports.contextLinesIntegration = contextlines.contextLinesIntegration;
exports.graphqlClientIntegration = graphqlClient.graphqlClientIntegration;
exports.getReplay = replay.getReplay;
exports.replayIntegration = replay.replayIntegration;
exports.replayCanvasIntegration = replayCanvas.replayCanvasIntegration;
exports.getFeedback = feedback.getFeedback;
exports.sendFeedback = feedback.sendFeedback;
exports.defaultRequestInstrumentationOptions = request.defaultRequestInstrumentationOptions;
exports.instrumentOutgoingRequests = request.instrumentOutgoingRequests;
exports.browserTracingIntegration = browserTracingIntegration.browserTracingIntegration;
exports.startBrowserTracingNavigationSpan = browserTracingIntegration.startBrowserTracingNavigationSpan;
exports.startBrowserTracingPageLoadSpan = browserTracingIntegration.startBrowserTracingPageLoadSpan;
exports.reportPageLoaded = reportPageLoaded.reportPageLoaded;
exports.setActiveSpanInBrowser = setActiveSpan.setActiveSpanInBrowser;
exports.makeBrowserOfflineTransport = offline.makeBrowserOfflineTransport;
exports.browserProfilingIntegration = integration.browserProfilingIntegration;
exports.spotlightBrowserIntegration = spotlight.spotlightBrowserIntegration;
exports.browserSessionIntegration = browsersession.browserSessionIntegration;
exports.buildLaunchDarklyFlagUsedHandler = integration$1.buildLaunchDarklyFlagUsedHandler;
exports.launchDarklyIntegration = integration$1.launchDarklyIntegration;
exports.OpenFeatureIntegrationHook = integration$2.OpenFeatureIntegrationHook;
exports.openFeatureIntegration = integration$2.openFeatureIntegration;
exports.unleashIntegration = integration$3.unleashIntegration;
exports.growthbookIntegration = integration$4.growthbookIntegration;
exports.statsigIntegration = integration$5.statsigIntegration;
exports.diagnoseSdkConnectivity = diagnoseSdk.diagnoseSdkConnectivity;
exports.registerWebWorker = webWorker.registerWebWorker;
exports.webWorkerIntegration = webWorker.webWorkerIntegration; //# sourceMappingURL=index.js.map
}),
]);

//# debugId=ea8d426d-8960-4844-d9be-41253f792205
//# sourceMappingURL=node_modules_%40sentry_browser_build_npm_cjs_dev_0b137fc6._.js.map
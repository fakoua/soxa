// Copyright 2018-2019 the Deno authors. All rights reserved. MIT license.

// A script preamble that provides the ability to load a single outfile
// TypeScript "bundle" where a main module is loaded which recursively
// instantiates all the other modules in the bundle.  This code is used to load
// bundles when creating snapshots, but is also used when emitting bundles from
// Deno cli.

// @ts-nocheck

/**
 * @type {(name: string, deps: ReadonlyArray<string>, factory: (...deps: any[]) => void) => void=}
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
let define;

/**
 * @type {(mod: string) => any=}
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
let instantiate;

/**
 * @callback Factory
 * @argument {...any[]} args
 * @returns {object | void}
 */

/**
 * @typedef ModuleMetaData
 * @property {ReadonlyArray<string>} dependencies
 * @property {(Factory | object)=} factory
 * @property {object} exports
 */

(function() {
  /**
   * @type {Map<string, ModuleMetaData>}
   */
  const modules = new Map();

  /**
   * Bundles in theory can support "dynamic" imports, but for internal bundles
   * we can't go outside to fetch any modules that haven't been statically
   * defined.
   * @param {string[]} deps
   * @param {(...deps: any[]) => void} resolve
   * @param {(err: any) => void} reject
   */
  const require = (deps, resolve, reject) => {
    try {
      if (deps.length !== 1) {
        throw new TypeError("Expected only a single module specifier.");
      }
      if (!modules.has(deps[0])) {
        throw new RangeError(`Module "${deps[0]}" not defined.`);
      }
      resolve(getExports(deps[0]));
    } catch (e) {
      if (reject) {
        reject(e);
      } else {
        throw e;
      }
    }
  };

  define = (id, dependencies, factory) => {
    if (modules.has(id)) {
      throw new RangeError(`Module "${id}" has already been defined.`);
    }
    modules.set(id, {
      dependencies,
      factory,
      exports: {}
    });
  };

  /**
   * @param {string} id
   * @returns {any}
   */
  function getExports(id) {
    const module = modules.get(id);
    if (!module) {
      // because `$deno$/ts_global.d.ts` looks like a real script, it doesn't
      // get erased from output as an import, but it doesn't get defined, so
      // we don't have a cache for it, so because this is an internal bundle
      // we can just safely return an empty object literal.
      return {};
    }
    if (!module.factory) {
      return module.exports;
    } else if (module.factory) {
      const { factory, exports } = module;
      delete module.factory;
      if (typeof factory === "function") {
        const dependencies = module.dependencies.map(id => {
          if (id === "require") {
            return require;
          } else if (id === "exports") {
            return exports;
          }
          return getExports(id);
        });
        factory(...dependencies);
      } else {
        Object.assign(exports, factory);
      }
      return exports;
    }
  }

  instantiate = dep => {
    define = undefined;
    const result = getExports(dep);
    // clean up, or otherwise these end up in the runtime environment
    instantiate = undefined;
    return result;
  };
})();

var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
// utils is a library of generic helper functions non-specific to soxa
define("src/utils", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var toString = Object.prototype.toString;
    /**
     * Determine if a value is an Array
     *
     * @param {Object} val The value to test
     * @returns {boolean} True if value is an Array, otherwise false
     */
    function isArray(val) {
        return toString.call(val) === '[object Array]';
    }
    exports.isArray = isArray;
    /**
     * Determine if a value is undefined
     *
     * @param {Object} val The value to test
     * @returns {boolean} True if the value is undefined, otherwise false
     */
    function isUndefined(val) {
        return typeof val === 'undefined';
    }
    exports.isUndefined = isUndefined;
    /**
     * Determine if a value is a Buffer
     *
     * @param {Object} val The value to test
     * @returns {boolean} True if value is a Buffer, otherwise false
     */
    function isBuffer(val) {
        return val !== null && !isUndefined(val) && val.constructor !== null && !isUndefined(val.constructor)
            && typeof val.constructor.isBuffer === 'function' && val.constructor.isBuffer(val);
    }
    exports.isBuffer = isBuffer;
    /**
     * Determine if a value is an ArrayBuffer
     *
     * @param {Object} val The value to test
     * @returns {boolean} True if value is an ArrayBuffer, otherwise false
     */
    function isArrayBuffer(val) {
        return toString.call(val) === '[object ArrayBuffer]';
    }
    exports.isArrayBuffer = isArrayBuffer;
    /**
     * Determine if a value is a FormData
     *
     * @param {Object} val The value to test
     * @returns {boolean} True if value is an FormData, otherwise false
     */
    function isFormData(val) {
        return (typeof FormData !== 'undefined') && (val instanceof FormData);
    }
    exports.isFormData = isFormData;
    /**
     * Determine if a value is a view on an ArrayBuffer
     *
     * @param {Object} val The value to test
     * @returns {boolean} True if value is a view on an ArrayBuffer, otherwise false
     */
    function isArrayBufferView(val) {
        var result;
        if ((typeof ArrayBuffer !== 'undefined') && (ArrayBuffer.isView)) {
            result = ArrayBuffer.isView(val);
        }
        else {
            result = (val) && (val.buffer) && (val.buffer instanceof ArrayBuffer);
        }
        return result;
    }
    exports.isArrayBufferView = isArrayBufferView;
    /**
     * Determine if a value is an Object
     *
     * @param {Object} val The value to test
     * @returns {boolean} True if value is an Object, otherwise false
     */
    function isObject(val) {
        return val !== null && typeof val === 'object';
    }
    exports.isObject = isObject;
    /**
     * Determine if a value is a Date
     *
     * @param {Object} val The value to test
     * @returns {boolean} True if value is a Date, otherwise false
     */
    function isDate(val) {
        return toString.call(val) === '[object Date]';
    }
    exports.isDate = isDate;
    /**
     * Determine if a value is a File
     *
     * @param {Object} val The value to test
     * @returns {boolean} True if value is a File, otherwise false
     */
    function isFile(val) {
        return toString.call(val) === '[object File]';
    }
    exports.isFile = isFile;
    /**
     * Determine if a value is a Blob
     *
     * @param {Object} val The value to test
     * @returns {boolean} True if value is a Blob, otherwise false
     */
    function isBlob(val) {
        return toString.call(val) === '[object Blob]';
    }
    exports.isBlob = isBlob;
    /**
     * Determine if a value is a Function
     *
     * @param {Object} val The value to test
     * @returns {boolean} True if value is a Function, otherwise false
     */
    function isFunction(val) {
        return toString.call(val) === '[object Function]';
    }
    /**
     * Determine if a value is a Stream
     *
     * @param {Object} val The value to test
     * @returns {boolean} True if value is a Stream, otherwise false
     */
    function isStream(val) {
        return isObject(val) && isFunction(val.pipe);
    }
    exports.isStream = isStream;
    /**
     * Determine if a value is a URLSearchParams object
     *
     * @param {Object} val The value to test
     * @returns {boolean} True if value is a URLSearchParams object, otherwise false
     */
    function isURLSearchParams(val) {
        return typeof URLSearchParams !== 'undefined' && val instanceof URLSearchParams;
    }
    exports.isURLSearchParams = isURLSearchParams;
    /**
     * Iterate over an Array or an Object invoking a function for each item.
     *
     * If `obj` is an Array callback will be called passing
     * the value, index, and complete array for each item.
     *
     * If 'obj' is an Object callback will be called passing
     * the value, key, and complete object for each property.
     *
     * @param {Object|Array} obj The object to iterate
     * @param {Function} fn The callback to invoke for each item
     */
    function forEach(obj, fn) {
        // Don't bother if no value provided
        if (obj === null || typeof obj === 'undefined') {
            return;
        }
        // Force an array if not already something iterable
        if (typeof obj !== 'object') {
            /*eslint no-param-reassign:0*/
            obj = [obj];
        }
        if (isArray(obj)) {
            // Iterate over array values
            for (var i = 0, l = obj.length; i < l; i++) {
                fn.call(null, obj[i], i, obj);
            }
        }
        else {
            // Iterate over object keys
            for (var key in obj) {
                if (Object.prototype.hasOwnProperty.call(obj, key)) {
                    fn.call(null, obj[key], key, obj);
                }
            }
        }
    }
    exports.forEach = forEach;
    /**
     * Accepts varargs expecting each argument to be an object, then
     * immutably merges the properties of each object and returns result.
     *
     * When multiple objects contain the same key the later object in
     * the arguments list will take precedence.
     *
     * Example:
     *
     * ```js
     * var result = merge({foo: 123}, {foo: 456});
     * console.log(result.foo); // outputs 456
     * ```
     *
     * @param {Object} obj1 Object to merge
     * @returns {Object} Result of all merge properties
     */
    function merge(...args) {
        var result = {};
        function assignValue(val, key) {
            if (typeof result[key] === 'object' && typeof val === 'object') {
                result[key] = merge(result[key], val);
            }
            else {
                result[key] = val;
            }
        }
        for (var i = 0, l = arguments.length; i < l; i++) {
            forEach(arguments[i], assignValue);
        }
        return result;
    }
    exports.merge = merge;
    /**
     * Function equal to merge with the difference being that no reference
     * to original objects is kept.
     *
     * @see merge
     * @param {Object} obj1 Object to merge
     * @returns {Object} Result of all merge properties
     */
    function deepMerge(...args) {
        var result = {};
        function assignValue(val, key) {
            if (typeof result[key] === 'object' && typeof val === 'object') {
                result[key] = deepMerge(result[key], val);
            }
            else if (typeof val === 'object') {
                result[key] = deepMerge({}, val);
            }
            else {
                result[key] = val;
            }
        }
        for (var i = 0, l = arguments.length; i < l; i++) {
            forEach(arguments[i], assignValue);
        }
        return result;
    }
    exports.deepMerge = deepMerge;
});
define("src/helpers/buildURL", ["require", "exports", "src/utils"], function (require, exports, utils) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    utils = __importStar(utils);
    function encode(val) {
        return encodeURIComponent(val).
            replace(/%40/gi, '@').
            replace(/%3A/gi, ':').
            replace(/%24/g, '$').
            replace(/%2C/gi, ',').
            replace(/%20/g, '+').
            replace(/%5B/gi, '[').
            replace(/%5D/gi, ']');
    }
    /**
     * Build a URL by appending params to the end
     *
     * @param {string} url The base of the url (e.g., http://www.google.com)
     * @param {object} [params] The params to be appended
     * @returns {string} The formatted url
     */
    const buildURL = function (url, params, paramsSerializer) {
        /*eslint no-param-reassign:0*/
        if (!params) {
            return url;
        }
        let serializedParams;
        if (paramsSerializer) {
            serializedParams = paramsSerializer(params);
        }
        else if (utils.isURLSearchParams(params)) {
            serializedParams = params.toString();
        }
        else {
            var parts = [];
            utils.forEach(params, function serialize(val, key) {
                if (val === null || typeof val === 'undefined') {
                    return;
                }
                if (utils.isArray(val)) {
                    key = key + '[]';
                }
                else {
                    val = [val];
                }
                utils.forEach(val, function parseValue(v) {
                    if (utils.isDate(v)) {
                        v = v.toISOString();
                    }
                    else if (utils.isObject(v)) {
                        v = JSON.stringify(v);
                    }
                    parts.push(encode(key) + '=' + encode(v));
                });
            });
            serializedParams = parts.join('&');
        }
        if (serializedParams) {
            var hashmarkIndex = url.indexOf('#');
            if (hashmarkIndex !== -1) {
                url = url.slice(0, hashmarkIndex);
            }
            url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams;
        }
        return url;
    };
    exports.buildURL = buildURL;
});
define("src/core/InterceptorManager", ["require", "exports", "src/utils"], function (require, exports, utils) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    utils = __importStar(utils);
    class InterceptorManager {
        constructor() {
            this.handlers = [];
        }
        use(fulfilled, rejected) {
            this.handlers.push({
                fulfilled: fulfilled,
                rejected: rejected
            });
            return this.handlers.length - 1;
        }
        eject(id) {
            if (this.handlers[id]) {
                this.handlers[id] = null;
            }
        }
        forEach(fn) {
            utils.forEach(this.handlers, function forEachHandler(h) {
                if (h !== null) {
                    fn(h);
                }
            });
        }
    }
    exports.InterceptorManager = InterceptorManager;
});
define("src/core/transformData", ["require", "exports", "src/utils"], function (require, exports, utils) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    utils = __importStar(utils);
    /**
     * Transform the data for a request or a response
     *
     * @param {Object|String} data The data to be transformed
     * @param {Array} headers The headers for the request or response
     * @param {Array|Function} fns A single function or Array of functions
     * @returns {*} The resulting transformed data
     */
    const transformData = function (data, headers, fns) {
        /*eslint no-param-reassign:0*/
        utils.forEach(fns, function transform(fn) {
            data = fn(data, headers);
        });
        return data;
    };
    exports.transformData = transformData;
});
define("src/cancel/isCancel", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const isCancel = function (value) {
        return !!(value && value.__CANCEL__);
    };
    exports.isCancel = isCancel;
});
define("src/helpers/normalizeHeaderName", ["require", "exports", "src/utils"], function (require, exports, utils) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    utils = __importStar(utils);
    const normalizeHeaderName = function (headers, normalizedName) {
        utils.forEach(headers, function processHeader(value, name) {
            if (name !== normalizedName && name.toUpperCase() === normalizedName.toUpperCase()) {
                headers[normalizedName] = value;
                delete headers[name];
            }
        });
    };
    exports.normalizeHeaderName = normalizeHeaderName;
});
define("src/core/enhanceError", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * Update an Error with the specified config, error code, and response.
     *
     * @param {Error} error The error to update.
     * @param {Object} config The config.
     * @param {string} [code] The error code (for example, 'ECONNABORTED').
     * @param {Object} [request] The request.
     * @param {Object} [response] The response.
     * @returns {Error} The error.
     */
    const enhanceError = function (error, config, code, request, response) {
        error.config = config;
        if (code) {
            error.code = code;
        }
        error.request = request;
        error.response = response;
        error.isSoxaError = true;
        error.toJSON = function () {
            return {
                // Standard
                message: this.message,
                name: this.name,
                // Microsoft
                description: this.description,
                number: this.number,
                // Mozilla
                fileName: this.fileName,
                lineNumber: this.lineNumber,
                columnNumber: this.columnNumber,
                stack: this.stack,
                // Soxa
                config: this.config,
                code: this.code
            };
        };
        return error;
    };
    exports.enhanceError = enhanceError;
});
define("src/core/createError", ["require", "exports", "src/core/enhanceError"], function (require, exports, enhanceError_ts_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * Create an Error with the specified message, config, error code, request and response.
     *
     * @param {string} message The error message.
     * @param {Object} config The config.
     * @param {string} [code] The error code (for example, 'ECONNABORTED').
     * @param {Object} [request] The request.
     * @param {Object} [response] The response.
     * @returns {Error} The created error.
     */
    const createError = function (message, config, code, request, response) {
        var error = new Error(message);
        return enhanceError_ts_1.enhanceError(error, config, code, request, response);
    };
    exports.createError = createError;
});
define("src/core/settle", ["require", "exports", "src/core/createError"], function (require, exports, createError_ts_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * Resolve or reject a Promise based on response status.
     *
     * @param {Function} resolve A function that resolves the promise.
     * @param {Function} reject A function that rejects the promise.
     * @param {object} response The response.
     */
    const settle = function (resolve, reject, response) {
        var validateStatus = response.config.validateStatus;
        if (!validateStatus || validateStatus(response.status)) {
            resolve(response);
        }
        else {
            reject(createError_ts_1.createError('Request failed with status code ' + response.status, response.config, null, response.request, response));
        }
    };
    exports.settle = settle;
});
define("src/helpers/isAbsoluteURL", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * Determines whether the specified URL is absolute
     *
     * @param {string} url The URL to test
     * @returns {boolean} True if the specified URL is absolute, otherwise false
     */
    const isAbsoluteURL = function (url) {
        // A URL is considered absolute if it begins with "<scheme>://" or "//" (protocol-relative URL).
        // RFC 3986 defines scheme name as a sequence of characters beginning with a letter and followed
        // by any combination of letters, digits, plus, period, or hyphen.
        return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(url);
    };
    exports.isAbsoluteURL = isAbsoluteURL;
});
define("src/helpers/combineURLs", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * Creates a new URL by combining the specified URLs
     *
     * @param {string} baseURL The base URL
     * @param {string} relativeURL The relative URL
     * @returns {string} The combined URL
     */
    const combineURLs = function (baseURL, relativeURL) {
        return relativeURL
            ? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '')
            : baseURL;
    };
    exports.combineURLs = combineURLs;
});
define("src/core/buildFullPath", ["require", "exports", "src/helpers/isAbsoluteURL", "src/helpers/combineURLs"], function (require, exports, isAbsoluteURL_ts_1, combineURLs_ts_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * Creates a new URL by combining the baseURL with the requestedURL,
     * only when the requestedURL is not already an absolute URL.
     * If the requestURL is absolute, this function returns the requestedURL untouched.
     *
     * @param {string} baseURL The base URL
     * @param {string} requestedURL Absolute or relative URL to combine
     * @returns {string} The combined full path
     */
    const buildFullPath = function (baseURL, requestedURL) {
        if (baseURL && !isAbsoluteURL_ts_1.isAbsoluteURL(requestedURL)) {
            return combineURLs_ts_1.combineURLs(baseURL, requestedURL);
        }
        return requestedURL;
    };
    exports.buildFullPath = buildFullPath;
});
define("src/adapters/fetchAdapter", ["require", "exports", "src/core/settle", "src/helpers/buildURL", "src/core/buildFullPath"], function (require, exports, settle_ts_1, buildURL_ts_1, buildFullPath_ts_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const fetchAdapter = function (config) {
        // At this point:
        //  - config has been merged with defaults
        //  - request transformers have already run
        //  - request interceptors have already run
        // Make the request using config provided
        // Upon response settle the Promise
        return new Promise(function (resolve, reject) {
            let fullPath = buildFullPath_ts_1.buildFullPath(config.baseURL, config.url);
            let parsed = new URL(fullPath);
            //let protocol = parsed.protocol || 'http:'
            let path = buildURL_ts_1.buildURL(parsed.href, config.params, config.paramsSerializer).replace(/^\?/, '');
            let headers = config.headers;
            // HTTP basic authentication
            var auth = undefined;
            if (config.auth) {
                var username = config.auth.username || '';
                var password = config.auth.password || '';
                auth = username + ':' + password;
            }
            if (auth) {
                delete headers.Authorization;
            }
            let options = {
                method: config.method.toUpperCase(),
                body: config.data,
                headers: headers,
            };
            if (auth) {
                options.headers['Authorization'] = `Basic ${btoa(auth)}`;
            }
            fetch(path, options)
                .then((res => {
                let h = {};
                for (let [key, value] of res.headers) {
                    h[key] = value;
                }
                res.text()
                    .then((data) => {
                    var response = {
                        data: data,
                        status: res.status,
                        statusText: res.statusText,
                        headers: h,
                        config: config,
                        request: ''
                    };
                    settle_ts_1.settle(resolve, reject, response);
                });
            }));
            // From here:
            //  - response transformers will run
            //  - response interceptors will run
        });
    };
    exports.fetchAdapter = fetchAdapter;
});
define("src/defaults", ["require", "exports", "src/utils", "src/helpers/normalizeHeaderName", "src/adapters/fetchAdapter"], function (require, exports, utils, normalizeHeaderName_ts_1, fetchAdapter_ts_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    utils = __importStar(utils);
    var DEFAULT_CONTENT_TYPE = {
        'Content-Type': 'application/x-www-form-urlencoded'
    };
    function setContentTypeIfUnset(headers, value) {
        if (!utils.isUndefined(headers) && utils.isUndefined(headers['Content-Type'])) {
            headers['Content-Type'] = value;
        }
    }
    function getDefaultAdapter() {
        return fetchAdapter_ts_1.fetchAdapter;
    }
    let defaults = {
        headers: {
            common: {
                'Accept': 'application/json, text/plain, */*'
            },
            delete: {},
            get: {},
            head: {},
            post: utils.merge(DEFAULT_CONTENT_TYPE),
            put: utils.merge(DEFAULT_CONTENT_TYPE),
            patch: utils.merge(DEFAULT_CONTENT_TYPE)
        },
        adapter: getDefaultAdapter(),
        transformRequest: [function transformRequest(data, headers) {
                normalizeHeaderName_ts_1.normalizeHeaderName(headers, 'Accept');
                normalizeHeaderName_ts_1.normalizeHeaderName(headers, 'Content-Type');
                if (utils.isFormData(data) ||
                    utils.isArrayBuffer(data) ||
                    utils.isBuffer(data) ||
                    utils.isStream(data) ||
                    utils.isFile(data) ||
                    utils.isBlob(data)) {
                    return data;
                }
                if (utils.isArrayBufferView(data)) {
                    return data.buffer;
                }
                if (utils.isURLSearchParams(data)) {
                    setContentTypeIfUnset(headers, 'application/x-www-form-urlencoded;charset=utf-8');
                    return data.toString();
                }
                if (utils.isObject(data)) {
                    setContentTypeIfUnset(headers, 'application/json;charset=utf-8');
                    return JSON.stringify(data);
                }
                return data;
            }],
        transformResponse: [function transformResponse(data) {
                /*eslint no-param-reassign:0*/
                if (typeof data === 'string') {
                    try {
                        data = JSON.parse(data);
                    }
                    catch (e) { /* Ignore */ }
                }
                return data;
            }],
        /**
         * A timeout in milliseconds to abort a request. If set to 0 (default) a
         * timeout is not created.
         */
        timeout: 0,
        xsrfCookieName: 'XSRF-TOKEN',
        xsrfHeaderName: 'X-XSRF-TOKEN',
        maxContentLength: -1,
        validateStatus: function validateStatus(status) {
            return status >= 200 && status < 300;
        }
    };
    exports.defaults = defaults;
});
define("src/core/dispatchRequest", ["require", "exports", "src/utils", "src/core/transformData", "src/cancel/isCancel", "src/defaults"], function (require, exports, utils, transformData_ts_1, isCancel_ts_1, defaults_ts_1) {
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    utils = __importStar(utils);
    /**
     * Throws a `Cancel` if cancellation has been requested.
     */
    function throwIfCancellationRequested(config) {
        if (config.cancelToken) {
            config.cancelToken.throwIfRequested();
        }
    }
    /**
     * Dispatch a request to the server using the configured adapter.
     *
     * @param {object} config The config that is to be used for the request
     * @returns {Promise} The Promise to be fulfilled
     */
    const dispatchRequest = function (config) {
        throwIfCancellationRequested(config);
        // Ensure headers exist
        config.headers = config.headers || {};
        // Transform request data
        config.data = transformData_ts_1.transformData(config.data, config.headers, config.transformRequest);
        // Flatten headers
        config.headers = utils.merge(config.headers.common || {}, config.headers[config.method] || {}, config.headers || {});
        utils.forEach(['delete', 'get', 'head', 'post', 'put', 'patch', 'common'], function cleanHeaderConfig(method) {
            delete config.headers[method];
        });
        let adapter = config.adapter || defaults_ts_1.defaults.adapter;
        return adapter(config).then(function onAdapterResolution(response) {
            throwIfCancellationRequested(config);
            // Transform response data
            response.data = transformData_ts_1.transformData(response.data, response.headers, config.transformResponse);
            return response;
        }, function onAdapterRejection(reason) {
            if (!isCancel_ts_1.isCancel(reason)) {
                throwIfCancellationRequested(config);
                // Transform response data
                if (reason && reason.response) {
                    reason.response.data = transformData_ts_1.transformData(reason.response.data, reason.response.headers, config.transformResponse);
                }
            }
            return Promise.reject(reason);
        });
    };
    exports.dispatchRequest = dispatchRequest;
});
define("src/core/mergeConfig", ["require", "exports", "src/utils"], function (require, exports, utils) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    utils = __importStar(utils);
    /**
     * Config-specific merge-function which creates a new config-object
     * by merging two configuration objects together.
     *
     * @param {Object} config1
     * @param {Object} config2
     * @returns {Object} New object resulting from merging config2 to config1
     */
    const mergeConfig = function (config1, config2) {
        // eslint-disable-next-line no-param-reassign
        config2 = config2 || {};
        var config = {};
        var valueFromConfig2Keys = ['url', 'method', 'params', 'data'];
        var mergeDeepPropertiesKeys = ['headers', 'auth', 'proxy'];
        var defaultToConfig2Keys = [
            'baseURL', 'url', 'transformRequest', 'transformResponse', 'paramsSerializer',
            'timeout', 'withCredentials', 'adapter', 'responseType', 'xsrfCookieName',
            'xsrfHeaderName', 'onUploadProgress', 'onDownloadProgress',
            'maxContentLength', 'validateStatus', 'maxRedirects', 'httpAgent',
            'httpsAgent', 'cancelToken', 'socketPath'
        ];
        utils.forEach(valueFromConfig2Keys, function valueFromConfig2(prop) {
            if (typeof config2[prop] !== 'undefined') {
                config[prop] = config2[prop];
            }
        });
        utils.forEach(mergeDeepPropertiesKeys, function mergeDeepProperties(prop) {
            if (utils.isObject(config2[prop])) {
                config[prop] = utils.deepMerge(config1[prop], config2[prop]);
            }
            else if (typeof config2[prop] !== 'undefined') {
                config[prop] = config2[prop];
            }
            else if (utils.isObject(config1[prop])) {
                config[prop] = utils.deepMerge(config1[prop]);
            }
            else if (typeof config1[prop] !== 'undefined') {
                config[prop] = config1[prop];
            }
        });
        utils.forEach(defaultToConfig2Keys, function defaultToConfig2(prop) {
            if (typeof config2[prop] !== 'undefined') {
                config[prop] = config2[prop];
            }
            else if (typeof config1[prop] !== 'undefined') {
                config[prop] = config1[prop];
            }
        });
        var soxaKeys = valueFromConfig2Keys
            .concat(mergeDeepPropertiesKeys)
            .concat(defaultToConfig2Keys);
        var otherKeys = Object
            .keys(config2)
            .filter(function filterSoxaKeys(key) {
            return soxaKeys.indexOf(key) === -1;
        });
        utils.forEach(otherKeys, function otherKeysDefaultToConfig2(prop) {
            if (typeof config2[prop] !== 'undefined') {
                config[prop] = config2[prop];
            }
            else if (typeof config1[prop] !== 'undefined') {
                config[prop] = config1[prop];
            }
        });
        return config;
    };
    exports.mergeConfig = mergeConfig;
});
define("src/core/Soxa", ["require", "exports", "src/utils", "src/helpers/buildURL", "src/core/InterceptorManager", "src/core/dispatchRequest", "src/core/mergeConfig"], function (require, exports, utils, buildURL_ts_2, InterceptorManager_ts_1, dispatchRequest_ts_1, mergeConfig_ts_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    utils = __importStar(utils);
    class Soxa {
        /**
         * Create a new instance of Soxa
         *
         * @param {Object} instanceConfig The default config for the instance
         */
        constructor(instanceConfig) {
            this.defaults = instanceConfig;
            this.interceptors = {
                request: new InterceptorManager_ts_1.InterceptorManager(),
                response: new InterceptorManager_ts_1.InterceptorManager()
            };
        }
        /**
         * Dispatch a request
         *
         * @param {Object} config The config specific for this request (merged with this.defaults)
         */
        request(config) {
            // Allow for soxa('example/url'[, config]) a la fetch API
            if (typeof config === 'string') {
                config = arguments[1] || {};
                config.url = arguments[0];
            }
            else {
                config = config || {};
            }
            config = mergeConfig_ts_1.mergeConfig(this.defaults, config);
            // Set config.method
            if (config.method) {
                config.method = config.method.toLowerCase();
            }
            else if (this.defaults.method) {
                config.method = this.defaults.method.toLowerCase();
            }
            else {
                config.method = 'get';
            }
            let chain = [dispatchRequest_ts_1.dispatchRequest, undefined];
            let promise = Promise.resolve(config);
            this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
                chain.unshift(interceptor.fulfilled, interceptor.rejected);
            });
            this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
                chain.push(interceptor.fulfilled, interceptor.rejected);
            });
            while (chain.length) {
                promise = promise.then(chain.shift(), chain.shift());
            }
            return promise;
        }
        getUri(config) {
            config = mergeConfig_ts_1.mergeConfig(this.defaults, config);
            return buildURL_ts_2.buildURL(config.url, config.params, config.paramsSerializer).replace(/^\?/, '');
        }
        requestURL(url, method, config) {
            return this.request(utils.merge(config || {}, {
                method: method,
                url: url
            }));
        }
        requestData(url, data, method, config) {
            return this.request(utils.merge(config || {}, {
                method: method,
                url: url,
                data: data
            }));
        }
        delete(url, config) {
            return this.requestURL(url, 'delete', config);
        }
        get(url, config) {
            return this.requestURL(url, 'get', config);
        }
        head(url, config) {
            return this.requestURL(url, 'head', config);
        }
        options(url, config) {
            return this.requestURL(url, 'options', config);
        }
        post(url, data, config) {
            return this.requestData(url, data, 'post', config);
        }
        put(url, data, config) {
            return this.requestData(url, data, 'put', config);
        }
        patch(url, data, config) {
            return this.requestData(url, data, 'patch', config);
        }
    }
    exports.Soxa = Soxa;
});
define("src/soxa", ["require", "exports", "src/core/Soxa", "src/defaults"], function (require, exports, Soxa_ts_1, defaults_ts_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const soxa = new Soxa_ts_1.Soxa(defaults_ts_2.defaults);
    exports.soxa = soxa;
});
define("mod", ["require", "exports", "src/soxa"], function (require, exports, soxa_ts_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.soxa = soxa_ts_1.soxa;
});

const __rootExports = instantiate("mod");
export const soxa = __rootExports["soxa"];


// utils is a library of generic helper functions non-specific to soxa

var toString = Object.prototype.toString;

// @ts-ignore
function isArray(val) {
  return toString.call(val) === '[object Array]';
}

// @ts-ignore
function isUndefined(val) {
  return typeof val === 'undefined';
}

// @ts-ignore
function isBuffer(val) {
  return val !== null && !isUndefined(val) && val.constructor !== null && !isUndefined(val.constructor)
    && typeof val.constructor.isBuffer === 'function' && val.constructor.isBuffer(val);
}

// @ts-ignore
function isArrayBuffer(val) {
  return toString.call(val) === '[object ArrayBuffer]';
}

// @ts-ignore
function isFormData(val) {
  return (typeof FormData !== 'undefined') && (val instanceof FormData);
}

// @ts-ignore
function isArrayBufferView(val) {
  var result;
  if ((typeof ArrayBuffer !== 'undefined') && (ArrayBuffer.isView)) {
    result = ArrayBuffer.isView(val);
  } else {
    result = (val) && (val.buffer) && (val.buffer instanceof ArrayBuffer);
  }
  return result;
}

// @ts-ignore
function isObject(val) {
  return val !== null && typeof val === 'object';
}

// @ts-ignore
function isDate(val) {
  return toString.call(val) === '[object Date]';
}

// @ts-ignore
function isFile(val) {
  return toString.call(val) === '[object File]';
}

// @ts-ignore
function isBlob(val) {
  return toString.call(val) === '[object Blob]';
}

// @ts-ignore
function isFunction(val) {
  return toString.call(val) === '[object Function]';
}

// @ts-ignore
function isStream(val) {
  return isObject(val) && isFunction(val.pipe);
}

// @ts-ignore
function isURLSearchParams(val) {
  return typeof URLSearchParams !== 'undefined' && val instanceof URLSearchParams;
}

// @ts-ignore
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
  } else {
    // Iterate over object keys
    for (var key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        fn.call(null, obj[key], key, obj);
      }
    }
  }
}

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
function merge(...args: any[]) {
  var result = {};
  // @ts-ignore
  function assignValue(val, key) {
    // @ts-ignore
    if (typeof result[key] === 'object' && typeof val === 'object') {
      // @ts-ignore
      result[key] = merge(result[key], val);
    } else {
      // @ts-ignore
      result[key] = val;
    }
  }

  for (var i = 0, l = arguments.length; i < l; i++) {
    forEach(arguments[i], assignValue);
  }
  return result;
}

/**
 * Function equal to merge with the difference being that no reference
 * to original objects is kept.
 *
 * @see merge
 * @param {Object} obj1 Object to merge
 * @returns {Object} Result of all merge properties
 */
function deepMerge(...args: any[]) {
  var result = {};
  // @ts-ignore
  function assignValue(val, key) {
    // @ts-ignore
    if (typeof result[key] === 'object' && typeof val === 'object') {
      // @ts-ignore
      result[key] = deepMerge(result[key], val);
    } else if (typeof val === 'object') {
      // @ts-ignore
      result[key] = deepMerge({}, val);
    } else {
      // @ts-ignore
      result[key] = val;
    }
  }

  for (var i = 0, l = arguments.length; i < l; i++) {
    forEach(arguments[i], assignValue);
  }
  return result;
}

export  {
  isArray,
  isArrayBuffer,
  isBuffer,
  isFormData,
  isArrayBufferView,
  isObject,
  isUndefined,
  isDate,
  isFile,
  isBlob,
  isStream,
  isURLSearchParams,
  forEach,
  merge,
  deepMerge
};

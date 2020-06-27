import * as utils from "../utils.ts"

function encode(val: string): string {
  return encodeURIComponent(val).
    replace(/%40/gi, "@").
    replace(/%3A/gi, ":").
    replace(/%24/g, "$").
    replace(/%2C/gi, ",").
    replace(/%20/g, "+").
    replace(/%5B/gi, "[").
    replace(/%5D/gi, "]");
}

/**
 * Build a URL by appending params to the end
 *
 * @param {string} url The base of the url (e.g., http://www.google.com)
 * @param {object} [params] The params to be appended
 * @returns {string} The formatted url
 */
const buildURL = function (url: string, params: any, paramsSerializer: any): string {
  /*eslint no-param-reassign:0*/
  if (!params) {
    return url;
  }

  let serializedParams;
  if (paramsSerializer) {
    serializedParams = paramsSerializer(params);
  } else if (utils.isURLSearchParams(params)) {
    serializedParams = params.toString();
  } else {
    // @ts-ignore
    const parts = [];

    // @ts-ignore
    utils.forEach(params, function serialize(val, key) {
      if (val === null || typeof val === "undefined") {
        return;
      }

      if (utils.isArray(val)) {
        key = key + "[]";
      } else {
        val = [val];
      }

      // @ts-ignore
      utils.forEach(val, function parseValue(v) {
        if (utils.isDate(v)) {
          v = v.toISOString();
        } else if (utils.isObject(v)) {
          v = JSON.stringify(v);
        }
        parts.push(encode(key) + "=" + encode(v));
      });
    });

    // @ts-ignore
    serializedParams = parts.join("&");
  }

  if (serializedParams) {
    const hashmarkIndex = url.indexOf("#");
    if (hashmarkIndex !== -1) {
      url = url.slice(0, hashmarkIndex);
    }

    url += (url.indexOf("?") === -1 ? "?" : "&") + serializedParams;
  }

  return url;
};

export { buildURL }

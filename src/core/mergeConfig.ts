import * as utils from "../utils.ts"

// @ts-ignore
const mergeConfig = function (config1, config2) {
  // eslint-disable-next-line no-param-reassign
  config2 = config2 || {};
  const config = {};

  const valueFromConfig2Keys = ["url", "method", "params", "data"];
  const mergeDeepPropertiesKeys = ["headers", "auth", "proxy"];
  const defaultToConfig2Keys = [
    "baseURL", "url", "transformRequest", "transformResponse", "paramsSerializer",
    "timeout", "withCredentials", "adapter", "responseType", "xsrfCookieName",
    "xsrfHeaderName", "onUploadProgress", "onDownloadProgress",
    "maxContentLength", "validateStatus", "maxRedirects", "httpAgent",
    "httpsAgent", "cancelToken", "socketPath"
  ];

  utils.forEach(valueFromConfig2Keys, function valueFromConfig2(prop: string) {
    if (typeof config2[prop] !== "undefined") {
      // @ts-ignore
      config[prop] = config2[prop];
    }
  });

  utils.forEach(mergeDeepPropertiesKeys, function mergeDeepProperties(prop: string) {
    if (utils.isObject(config2[prop])) {
      // @ts-ignore
      config[prop] = utils.deepMerge(config1[prop], config2[prop]);
    } else if (typeof config2[prop] !== "undefined") {
      // @ts-ignore
      config[prop] = config2[prop];
    } else if (utils.isObject(config1[prop])) {
      // @ts-ignore
      config[prop] = utils.deepMerge(config1[prop]);
    } else if (typeof config1[prop] !== "undefined") {
      // @ts-ignore
      config[prop] = config1[prop];
    }
  });

  utils.forEach(defaultToConfig2Keys, function defaultToConfig2(prop: string) {
    if (typeof config2[prop] !== "undefined") {
      // @ts-ignore
      config[prop] = config2[prop];
    } else if (typeof config1[prop] !== "undefined") {
      // @ts-ignore
      config[prop] = config1[prop];
    }
  });

  const soxaKeys = valueFromConfig2Keys
    .concat(mergeDeepPropertiesKeys)
    .concat(defaultToConfig2Keys);

  const otherKeys = Object
    .keys(config2)
    .filter(function filterSoxaKeys(key) {
      return soxaKeys.indexOf(key) === -1;
    });

  utils.forEach(otherKeys, function otherKeysDefaultToConfig2(prop: string) {
    if (typeof config2[prop] !== "undefined") {
      // @ts-ignore
      config[prop] = config2[prop];
    } else if (typeof config1[prop] !== "undefined") {
      // @ts-ignore
      config[prop] = config1[prop];
    }
  });

  return config;
};

export { mergeConfig }

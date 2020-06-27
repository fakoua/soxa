"use strict";

import * as utils from "../utils.ts"
import { transformData } from "./transformData.ts"
import { isCancel } from "../cancel/isCancel.ts"
import { defaults } from "../defaults.ts"

// @ts-ignore
function throwIfCancellationRequested(config): void {
  if (config.cancelToken) {
    config.cancelToken.throwIfRequested();
  }
}

// @ts-ignore
const dispatchRequest = function (config): Promise<any> {
  throwIfCancellationRequested(config);

  // Ensure headers exist
  config.headers = config.headers || {};

  // Transform request data
  config.data = transformData(
    config.data,
    config.headers,
    config.transformRequest
  );

  // Flatten headers
  config.headers = utils.merge(
    config.headers.common || {},
    config.headers[config.method] || {},
    config.headers || {}
  );

  utils.forEach(
    ["delete", "get", "head", "post", "put", "patch", "common"],
    function cleanHeaderConfig(method: string) {
      delete config.headers[method];
    }
  );

  const adapter = config.adapter || defaults.adapter;

  // @ts-ignore
  return adapter(config).then(function onAdapterResolution(response) {
    throwIfCancellationRequested(config);

    // Transform response data
    response.data = transformData(
      response.data,
      response.headers,
      config.transformResponse
    );

    return response;
  }, 
  // @ts-ignore
  function onAdapterRejection(reason) {
    if (!isCancel(reason)) {
      throwIfCancellationRequested(config);

      // Transform response data
      if (reason && reason.response) {
        reason.response.data = transformData(
          reason.response.data,
          reason.response.headers,
          config.transformResponse
        );
      }
    }

    return Promise.reject(reason);
  });
};

export { dispatchRequest }

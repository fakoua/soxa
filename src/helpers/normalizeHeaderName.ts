import * as utils from "../utils.ts"

const normalizeHeaderName = function (headers: object, normalizedName: string): void {
  utils.forEach(headers, function processHeader(value: string, name: string): void {
    if (name !== normalizedName && name.toUpperCase() === normalizedName.toUpperCase()) {
      // @ts-ignore
      headers[normalizedName] = value;
      // @ts-ignore
      delete headers[name];
    }
  });
};

export {normalizeHeaderName}

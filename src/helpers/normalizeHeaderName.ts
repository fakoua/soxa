import * as utils from '../utils.ts'

const normalizeHeaderName = function (headers: object, normalizedName: string): void {
  utils.forEach(headers, function processHeader(value: string, name: string): void {
    if (name !== normalizedName && name.toUpperCase() === normalizedName.toUpperCase()) {
      headers[normalizedName] = value;
      delete headers[name];
    }
  });
};

export {normalizeHeaderName}
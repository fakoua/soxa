import * as utils from "../utils.ts"

// @ts-ignore
const transformData = function (data, headers, fns) {
  // @ts-ignore
  utils.forEach(fns, function transform(fn) {
    data = fn(data, headers);
  });

  return data;
};

export { transformData }

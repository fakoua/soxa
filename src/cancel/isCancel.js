'use strict';

const isCancel = function (value) {
  return !!(value && value.__CANCEL__);
};

export {isCancel}
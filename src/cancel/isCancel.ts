const isCancel = function (value): boolean {
  return !!(value && value.__CANCEL__);
};

export {isCancel}
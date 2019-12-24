import { enhanceError } from './enhanceError.ts'

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
const createError = function (message: string, config: any, code: any, request: any, response: any) {
  var error = new Error(message);
  return enhanceError(error, config, code, request, response);
};

export { createError }
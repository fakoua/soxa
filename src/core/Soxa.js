'use strict';

import * as utils from '../utils.js'
import { buildURL } from '../helpers/buildURL.js'
import { InterceptorManager } from './InterceptorManager.js'
import { dispatchRequest } from './dispatchRequest.js'
import { mergeConfig } from './mergeConfig.js'

/**
 * Create a new instance of Soxa
 *
 * @param {Object} instanceConfig The default config for the instance
 */
function Soxa(instanceConfig) {
  this.defaults = instanceConfig;
  this.interceptors = {
    request: new InterceptorManager(),
    response: new InterceptorManager()
  };
}

/**
 * Dispatch a request
 *
 * @param {Object} config The config specific for this request (merged with this.defaults)
 */
Soxa.prototype.request = function request(config) {
  /*eslint no-param-reassign:0*/
  // Allow for soxa('example/url'[, config]) a la fetch API
  if (typeof config === 'string') {
    config = arguments[1] || {};
    config.url = arguments[0];
  } else {
    config = config || {};
  }

  config = mergeConfig(this.defaults, config);

  // Set config.method
  if (config.method) {
    config.method = config.method.toLowerCase();
  } else if (this.defaults.method) {
    config.method = this.defaults.method.toLowerCase();
  } else {
    config.method = 'get';
  }

  // Hook up interceptors middleware
  var chain = [dispatchRequest, undefined];
  var promise = Promise.resolve(config);

  this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
    chain.unshift(interceptor.fulfilled, interceptor.rejected);
  });

  this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
    chain.push(interceptor.fulfilled, interceptor.rejected);
  });

  while (chain.length) {
    promise = promise.then(chain.shift(), chain.shift());
  }

  return promise;
};

Soxa.prototype.getUri = function getUri(config) {
  config = mergeConfig(this.defaults, config);
  return buildURL(config.url, config.params, config.paramsSerializer).replace(/^\?/, '');
};

Soxa.prototype.delete = function(url, config) {
  return this.request(utils.merge(config || {}, {
    method: 'delete',
    url: url
  }));
};

Soxa.prototype.get = function(url, config) {
  return this.request(utils.merge(config || {}, {
    method: 'get',
    url: url
  }));
};

Soxa.prototype.head = function(url, config) {
  return this.request(utils.merge(config || {}, {
    method: 'head',
    url: url
  }));
};

Soxa.prototype.options = function(url, config) {
  return this.request(utils.merge(config || {}, {
    method: 'options',
    url: url
  }));
};

Soxa.prototype.post = function(url, data, config) {
  return this.request(utils.merge(config || {}, {
    method: 'post',
    url: url,
    data: data
  }));
};

Soxa.prototype.put = function(url, data, config) {
  return this.request(utils.merge(config || {}, {
    method: 'put',
    url: url,
    data: data
  }));
};

Soxa.prototype.patch = function(url, data, config) {
  return this.request(utils.merge(config || {}, {
    method: 'patch',
    url: url,
    data: data
  }));
};

export { Soxa }

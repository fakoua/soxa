'use strict';

import * as utils from './utils.js'
import { bind } from './helpers/bind.js'
import { Soxa } from './core/Soxa.js'
import { mergeConfig } from './core/mergeConfig.js'
import { defaults } from './defaults.js'
import { Cancel as tempCancel } from './cancel/Cancel.js'
import { CancelToken as tempCancelTopen } from './cancel/CancelToken.js'
import { isCancel as tempIsCancel } from './cancel/isCancel.js'
import { spread as tempSpread } from './helpers/spread.js'


/**
 * Create an instance of Soxa
 *
 * @param {Object} defaultConfig The default config for the instance
 * @return {Soxa} A new instance of Soxa
 */
function createInstance(defaultConfig) {
  var context = new Soxa(defaultConfig);
  var instance = bind(Soxa.prototype.request, context);

  // Copy soxa.prototype to instance
  utils.extend(instance, Soxa.prototype, context);

  // Copy context to instance
  utils.extend(instance, context);

  return instance;
}

// Create the default instance to be exported
var soxa = createInstance(defaults);

// Expose Soxa class to allow class inheritance
soxa.Soxa = Soxa;

// Factory for creating new instances
soxa.create = function create(instanceConfig) {
  return createInstance(mergeConfig(soxa.defaults, instanceConfig));
};

// Expose Cancel & CancelToken
soxa.Cancel = tempCancel
soxa.CancelToken = tempCancelTopen
soxa.isCancel = tempIsCancel

// Expose all/spread
soxa.all = function all(promises) {
  return Promise.all(promises);
};

soxa.spread = tempSpread

export { soxa }

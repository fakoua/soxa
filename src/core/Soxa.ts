import * as utils from "../utils.ts"
import { buildURL } from "../helpers/buildURL.ts"
import { InterceptorManager } from "./InterceptorManager.ts"
import { dispatchRequest } from "./dispatchRequest.ts"
import { mergeConfig } from "./mergeConfig.ts"
import { Config } from "./Config.ts"

export class Soxa {
    defaults: any
    interceptors: any

    // @ts-ignore
    constructor(instanceConfig) {
        this.defaults = instanceConfig;
        this.interceptors = {
            request: new InterceptorManager(),
            response: new InterceptorManager()
        };
    }

    // @ts-ignore
    request(config): Promise<any> {
        // Allow for soxa('example/url'[, config]) a la fetch API
        if (typeof config === "string") {
            config = arguments[1] || {};
            config.url = arguments[0];
        } else {
            config = config || {};
            // Set the defaults
            if (config.timeout === undefined) {
                config.timeout = 0;
            }

            if (config.withCredentials === undefined) {
                config.withCredentials = false;
            }

            if (config.responseType === undefined) {
                config.responseType = "json";
            }

            if (config.responseEncoding === undefined) {
                config.responseEncoding = "utf8";
            }

            if (config.validateStatus === undefined) {
                config.validateStatus = function (status: number) {
                    return status >= 200 && status < 300; // default
                  };
            }

            if (config.maxRedirects === undefined) {
                config.maxRedirects = 5;
            }

            if (config.socketPath === undefined) {
                config.socketPath = null;
            }
        }

        config = mergeConfig(this.defaults, config);
        // Set config.method
        if (config.method) {
            config.method = config.method.toLowerCase();
        } else if (this.defaults.method) {
            config.method = this.defaults.method.toLowerCase();
        } else {
            config.method = "get";
        }

        const chain = [dispatchRequest, undefined];
        let promise = Promise.resolve(config);

        // @ts-ignore
        this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
            chain.unshift(interceptor.fulfilled, interceptor.rejected);
        });

        // @ts-ignore
        this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
            chain.push(interceptor.fulfilled, interceptor.rejected);
        });

        while (chain.length) {
            promise = promise.then(chain.shift(), chain.shift());
        }

        return promise;
    }

    // @ts-ignore
    getUri(config): string {
        config = mergeConfig(this.defaults, config);
        return buildURL(config.url, config.params, config.paramsSerializer).replace(/^\?/, "");
    }

    private requestURL(url: string, method: string, config?: string|Config): Promise<any> {
        return this.request(utils.merge(config || {}, {
            method: method,
            url: url
        }));
    }

    private requestData(url: string, data: any, method: string, config?: string|Config): Promise<any> {
        return this.request(utils.merge(config || {}, {
            method: method,
            url: url,
            data: data
        }))
    }

    // @ts-ignore
    delete(url: string, config?: string|Config): Promise<any> {
        return this.requestURL(url, "delete", config)
    }

    // @ts-ignore
    get(url: string, config?: string|Config): Promise<any> {
        return this.requestURL(url, "get", config)
    }

    // @ts-ignore
    head(url: string, config?: string|Config): Promise<any> {
        return this.requestURL(url, "head", config)
    }

    // @ts-ignore
    options(url: string, config?: string|Config): Promise<any> {
        return this.requestURL(url, "options", config)
    }

    post(url: string, data: any, config?: string|Config): Promise<any> {
        return this.requestData(url, data, "post", config)
    }

    put(url: string, data: any, config?: string|Config): Promise<any> {
        return this.requestData(url, data, "put", config)
    }

    patch(url: string, data: any, config?: string|Config): Promise<any> {
        return this.requestData(url, data, "patch", config)
    }

}

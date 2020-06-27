import { settle } from "../core/settle.ts"
import { buildURL } from "../helpers/buildURL.ts"
import { buildFullPath } from "../core/buildFullPath.ts"

// @ts-ignore
const fetchAdapter = function (config): Promise<any> {
    // At this point:
    //  - config has been merged with defaults
    //  - request transformers have already run
    //  - request interceptors have already run
    
    // Make the request using config provided
    // Upon response settle the Promise
    return new Promise(function(resolve, reject) {
  
      const fullPath = buildFullPath(config.baseURL, config.url);

      const parsed = new URL(fullPath);
      // let protocol = parsed.protocol || 'http:'
      const path = buildURL(parsed.href, config.params, config.paramsSerializer).replace(/^\?/, "")

      const headers = config.headers;

      // HTTP basic authentication
      let auth;
      if (config.auth) {
        const username = config.auth.username || "";
        const password = config.auth.password || "";
        auth = username + ":" + password;
      }

      if (auth) {
        delete headers.Authorization;
      }
      
      const options = {
        method: config.method.toUpperCase(),
        body: config.data,
        headers: headers,
      };
      if (auth) {
        options.headers["Authorization"] = `Basic ${btoa(auth)}`
      }
      
      fetch(path, options)
        .then((res => {
          const h = {}
          for (const [key, value] of res.headers) {
            // @ts-ignore
            h[key] = value
          }

          res.text()  
          .then((data) => {
            const response = {
              data: data,
              status: res.status,
              statusText: res.statusText,
              headers: h,
              config: config
            }
            settle(resolve, reject, response);        
          })
        }))
        .catch((er) => {
          reject(er)
        })
  
      // From here:
      //  - response transformers will run
      //  - response interceptors will run
    });
  }

  export { fetchAdapter }

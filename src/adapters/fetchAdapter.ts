import { settle } from '../core/settle.ts'
import { buildURL } from '../helpers/buildURL.ts'
import { buildFullPath } from '../core/buildFullPath.ts'

const fetchAdapter = function (config): Promise<any> {
    // At this point:
    //  - config has been merged with defaults
    //  - request transformers have already run
    //  - request interceptors have already run
    
    // Make the request using config provided
    // Upon response settle the Promise
  
    return new Promise(function(resolve, reject) {
  
      let fullPath = buildFullPath(config.baseURL, config.url);

      let parsed = new URL(fullPath);
      //let protocol = parsed.protocol || 'http:'
      let path = buildURL(parsed.href, config.params, config.paramsSerializer).replace(/^\?/, '')

      let headers = config.headers;

      // HTTP basic authentication
      var auth = undefined;
      if (config.auth) {
        var username = config.auth.username || '';
        var password = config.auth.password || '';
        auth = username + ':' + password;
      }

      if (auth) {
        delete headers.Authorization;
      }
      
      let options = {
        method: config.method.toUpperCase(),
        body: config.data,
        headers: headers,
      };
      if (auth) {
        options.headers['Authorization'] =`Basic ${btoa(auth)}`
      }
      
      fetch(path, options)
        .then((res => {
          let h = {}
          for (let [key, value] of res.headers) {
            h[key] = value
          }

          res.text()  
          .then((data) => {
            var response = {
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
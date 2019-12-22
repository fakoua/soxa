import { settle } from '../core/settle.js'
import { buildURL } from '../helpers/buildURL.js'
import { buildFullPath } from '../core/buildFullPath.js'
const fetchAdapter = function (config) {
    // At this point:
    //  - config has been merged with defaults
    //  - request transformers have already run
    //  - request interceptors have already run
    
    // Make the request using config provided
    // Upon response settle the Promise
  
    return new Promise(function(resolve, reject) {
    
      // var response = {
      //   data: responseData,
      //   status: request.status,
      //   statusText: request.statusText,
      //   headers: responseHeaders,
      //   config: config,
      //   request: request
      // };
  
      let fullPath = buildFullPath(config.baseURL, config.url);

      console.log(config.auth)

      let parsed = new URL(fullPath);
      let protocol = parsed.protocol || 'http:'

      let path = buildURL(parsed.pathname, config.params, config.paramsSerializer).replace(/^\?/, '')

  
      let options = {
        method: config.method.toUpperCase(),
        body: config.data,
        headers: config.headers,
      };
      options.headers['Authorization'] ='Basic c2FtbzpzYW1v'
      fetch(fullPath, options)
        .then((res => {
          //console.log(res.ok) //true false
          let headers = {}
          for (let [key, value] of res.headers) {
            //console.log(`${key} = ${value}`);
            headers[key] = value
          }

          res.text()  
          .then((data) => {
            var response = {
              data: data,
              status: res.status,
              statusText: res.statusText,
              headers: headers,
              config: config,
              request: ''
            }
            settle(resolve, reject, response);        
          })
        }))
  
      // From here:
      //  - response transformers will run
      //  - response interceptors will run
    });
  }

  export { fetchAdapter }
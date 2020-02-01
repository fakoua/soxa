# soxa

[![Build Status](https://api.travis-ci.com/fakoua/soxa.svg?branch=master)](https://travis-ci.com/fakoua/soxa)
[![Build Status](https://github.com/fakoua/soxa/workflows/CI/badge.svg?branch=master&event=push)](https://github.com/fakoua/soxa/actions)


Promise based HTTP client for deno

## Features

- Make [fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) requests from deno
- Supports the [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) API
- Intercept request and response
- Transform request and response data
- Cancel requests
- Automatic transforms for JSON data

## Installing

Using deno:

```js
import { soxa } from 'https://deno.land/x/soxa/mod.ts'
```

## Example

Performing a `GET` request (Promise)

```js
import { soxa } from 'https://deno.land/x/soxa/mod.ts'

// soxa.get(url, config)
// soxa.head(url, config)
// soxa.delete(url, config)

// soxa.post(url, data, config)
// soxa.put(url, data, config)
// soxa.patch(url, data, config)


//Example
// Make a request for todos
soxa.get('https://jsonplaceholder.typicode.com/todos/1')
  .then(function (response) {
    // handle success
    console.log(response.data);
  })
  .catch(function (error) {
    // handle error
    console.log(error);
  })
  .finally(function () {
    // always executed
  });
```

Performing a `GET` request (Await/Async)

```js
let result = await soxa.get('https://jsonplaceholder.typicode.com/todos/1');
console.log(result.data)
```

Performing a `POST` request

```js
let response = await soxa.post('https://jsonplaceholder.typicode.com/posts', {
                          "title": "Hello Soxa",
                          "id": 14
                      });
//Note: data is passed with valid JSON format ( {"key": "string-value", "key2": int-value ...} )

//OR you can send the data with the config object.
let response = await soxa.post('https://jsonplaceholder.typicode.com/posts', {}, {
    headers: {'x-user': 'fakoua'},
    data: {
        "title":"Hello Soxa",
        "id":14
    }
});
```

## URL Examples

```js
await soxa.get('http://example.com'); // http://example.com
await soxa.get('http://example.com', { params: { q: 'hello' } }); // http://example.com?q=hello
await soxa.get('http://example.com', { params: { q: 'hello', id: 12 } }); // http://example.com?q=hello&id=12

await soxa.get('http://example.com/folder', { params: { q: 'hello' } }); // http://example.com/folder?q=hello

//Note: if baseURL is set in the config, you only need to pass the /folder relative path.
let config = {
  baseURL: 'http://example.com/',
  params: {
            q: 'hello'
          }
 }
await soxa.get('/folder', config); // http://example.com/folder?q=hello
```

## Config

These are the available config options for making requests. Only the `url` is required. Requests will default to `GET` if `method` is not specified.

```js
{
  // `baseURL` will be prepended to `url` unless `url` is absolute.
  // It can be convenient to set `baseURL` for an instance of soxa to pass relative URLs
  // to methods of that instance.
  baseURL: 'https://some-domain.com/api/',

  // `transformRequest` allows changes to the request data before it is sent to the server
  // This is only applicable for request methods 'PUT', 'POST', 'PATCH' and 'DELETE'
  // The last function in the array must return a string or an instance of Buffer, ArrayBuffer,
  // FormData or Stream
  // You may modify the headers object.
  transformRequest: [function (data, headers) {
    // Do whatever you want to transform the data

    return data;
  }],

  // `transformResponse` allows changes to the response data to be made before
  // it is passed to then/catch
  transformResponse: [function (data) {
    // Do whatever you want to transform the data

    return data;
  }],

  // `headers` are custom headers to be sent
  headers: {'X-Requested-With': 'XMLHttpRequest'},

  // `params` are the URL parameters to be sent with the request
  // Must be a plain object or a URLSearchParams object
  // Result:  [url]/?ID=12345
  params: {
    ID: 12345
  },

  // `paramsSerializer` is an optional function in charge of serializing `params`
  // (e.g. http://api.jquery.com/jquery.param/)
  paramsSerializer: function (params) {
    return ...
  },

  // `data` is the data to be sent as the request body
  // Only applicable for request methods 'PUT', 'POST', and 'PATCH'
  // When no `transformRequest` is set, must be of one of the following types:
  // - string, plain object, ArrayBuffer, ArrayBufferView, URLSearchParams
  // Browser only: FormData, File, Blob
  data: {
    firstName: 'Fred'
  },
  
  // syntax alternative to send data into the body
  // method post
  // only the value is sent, not the key
  data: 'Country=Brasil&City=Belo Horizonte',

  // `timeout` specifies the number of milliseconds before the request times out.
  // If the request takes longer than `timeout`, the request will be aborted.
  timeout: 1000, // default is `0` (no timeout)

  // `withCredentials` indicates whether or not cross-site Access-Control requests
  // should be made using credentials
  withCredentials: false, // default

  // `auth` indicates that HTTP Basic auth should be used, and supplies credentials.
  // This will set an `Authorization` header, overwriting any existing
  // `Authorization` custom headers you have set using `headers`.
  // Please note that only HTTP Basic auth is configurable through this parameter.
  // For Bearer tokens and such, use `Authorization` custom headers instead.
  auth: {
    username: 'sam',
    password: 'pass'
  }, //This will be transformed and added to header -> "Authorization": "Basic c2FtOnBhc3M="

  // `responseType` indicates the type of data that the server will respond with
  // options are: 'arraybuffer', 'document', 'json', 'text', 'stream'
  //   browser only: 'blob'
  responseType: 'json', // default

  // `responseEncoding` indicates encoding to use for decoding responses
  // Note: Ignored for `responseType` of 'stream' or client-side requests
  responseEncoding: 'utf8', // default

  // `onUploadProgress` allows handling of progress events for uploads
  onUploadProgress: function (progressEvent) {
    // Do whatever you want with the native progress event
  },

  // `onDownloadProgress` allows handling of progress events for downloads
  onDownloadProgress: function (progressEvent) {
    // Do whatever you want with the native progress event
  },

  // `maxContentLength` defines the max size of the http response content in bytes allowed
  maxContentLength: 2000,

  // `validateStatus` defines whether to resolve or reject the promise for a given
  // HTTP response status code. If `validateStatus` returns `true` (or is set to `null`
  // or `undefined`), the promise will be resolved; otherwise, the promise will be
  // rejected.
  validateStatus: function (status) {
    return status >= 200 && status < 300; // default
  },

  // `maxRedirects` defines the maximum number of redirects to follow in node.js.
  // If set to 0, no redirects will be followed.
  maxRedirects: 5, // default

  // `socketPath` defines a UNIX Socket to be used in node.js.
  // e.g. '/var/run/docker.sock' to send requests to the docker daemon.
  // Only either `socketPath` or `proxy` can be specified.
  // If both are specified, `socketPath` is used.
  socketPath: null, // default

  // `cancelToken` specifies a cancel token that can be used to cancel the request
  // (see Cancellation section below for details)
  cancelToken: new CancelToken(function (cancel) {
  })
}

//Example auth:

let config = {
    auth: {
        username: 'myUser',
        password: 'myPassword'
      }
}

soxa.post(url, {} ,config)
  .then(function (response) {
    console.log(response);
  })
  .catch(function (error) {
    console.log(error);
  });
```

## Response Schema

The response for a request contains the following information.

```js
{
  // `data` is the response that was provided by the server
  data: {},

  // `status` is the HTTP status code from the server response
  status: 200,

  // `statusText` is the HTTP status message from the server response
  statusText: 'OK',

  // `headers` the headers that the server responded with
  // All header names are lower cased
  headers: {},

  // `config` is the config that was provided to `soxa` for the request
  config: {},

  // `request` is the request that generated this response
  // It is the last ClientRequest instance in node.js (in redirects)
  // and an XMLHttpRequest instance in the browser
  request: {}
}
```

When using `then`, you will receive the response as follows:

```js
soxa.get('/user/12345')
  .then(function (response) {
    console.log(response.data);
    console.log(response.status);
    console.log(response.statusText);
    console.log(response.headers);
    console.log(response.config);
  });
```

When using `catch`, or passing a [rejection callback](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/then) as second parameter of `then`, the response will be available through the `error` object as explained in the [Handling Errors](#handling-errors) section.

## Config Defaults

You can specify config defaults that will be applied to every request.

### Global soxa defaults

```js
soxa.defaults.baseURL = 'https://api.example.com';
soxa.defaults.headers.common['Authorization'] = AUTH_TOKEN;
soxa.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
```

## Interceptors

You can intercept requests or responses before they are handled by `then` or `catch`.

```js
// Add a request interceptor
soxa.interceptors.request.use(function (config) {
    // Do something before request is sent
    return config;
  }, function (error) {
    // Do something with request error
    return Promise.reject(error);
  });

// Add a response interceptor
soxa.interceptors.response.use(function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response;
  }, function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(error);
  });
```

If you need to remove an interceptor later you can.

```js
const myInterceptor = soxa.interceptors.request.use(function () {/*...*/});
soxa.interceptors.request.eject(myInterceptor);
```

You can add interceptors to a custom instance of soxa.

```js
const instance = soxa.create();
instance.interceptors.request.use(function () {/*...*/});
```

## Handling Errors

```js
soxa.get('/user/12345')
  .catch(function (error) {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.log(error.response.data);
      console.log(error.response.status);
      console.log(error.response.headers);
    } else if (error.request) {
      // The request was made but no response was received
      // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
      // http.ClientRequest in node.js
      console.log(error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.log('Error', error.message);
    }
    console.log(error.config);
  });
```

Using the `validateStatus` config option, you can define HTTP code(s) that should throw an error.

```js
soxa.get('/user/12345', {
  validateStatus: function (status) {
    return status < 500; // Reject only if the status code is greater than or equal to 500
  }
})
```

Using `toJSON` you get an object with more information about the HTTP error.

```js
soxa.get('/user/12345')
  .catch(function (error) {
    console.log(error.toJSON());
  });
```

## Cancellation

You can cancel a request using a *cancel token*.

> The soxa cancel token API is based on the withdrawn [cancelable promises proposal](https://github.com/tc39/proposal-cancelable-promises).

You can create a cancel token using the `CancelToken.source` factory as shown below:

```js
const CancelToken = soxa.CancelToken;
const source = CancelToken.source();

soxa.get('/user/12345', {
  cancelToken: source.token
}).catch(function (thrown) {
  if (soxa.isCancel(thrown)) {
    console.log('Request canceled', thrown.message);
  } else {
    // handle error
  }
});

soxa.post('/user/12345', {
  name: 'new name'
}, {
  cancelToken: source.token
})

// cancel the request (the message parameter is optional)
source.cancel('Operation canceled by the user.');
```

You can also create a cancel token by passing an executor function to the `CancelToken` constructor:

```js
const CancelToken = soxa.CancelToken;
let cancel;

soxa.get('/user/12345', {
  cancelToken: new CancelToken(function executor(c) {
    // An executor function receives a cancel function as a parameter
    cancel = c;
  })
});

// cancel the request
cancel();
```

> Note: you can cancel several requests with the same cancel token.

## Using application/x-www-form-urlencoded format

By default, soxa serializes JavaScript objects to `JSON`. To send data in the `application/x-www-form-urlencoded` format instead, you can use one of the following options.

## Credits

soxa is heavily inspired by the [axios](https://github.com/axios/axios) with new fetch adapter and support for typescript and deno.

## License

[MIT](LICENSE)

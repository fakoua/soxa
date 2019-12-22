# soxa
Promise based HTTP client for the deno

## Getting Started
A fork of Axios lib with the same interface.

Deno example:
Create file example.ts

```
import { soxa } from 'https://deno.land/x/soxa/mod.ts'


//Promise
soxa.get('https://jsonplaceholder.typicode.com/todos/1')
.then((res)=> {
    console.log(res.data)
})
.catch((err) => {
    console.log(`${err}`)
})

//Await

let response = await soxa.get('https://jsonplaceholder.typicode.com/comments');
console.log(response.data)
```

From Command line run:
```
deno -A example.ts
```

### TODO

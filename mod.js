import { soxa } from './src/soxa.js'

let res = await soxa.get('https://jsonplaceholder.typicode.com/todos/1')

console.log(res.data)

import { soxa } from './mod.ts'

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
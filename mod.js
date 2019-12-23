import { soxa } from './mod.ts'

//Promise
soxa.post('https://jsonplaceholder.typicode.com/todos/')
.then((res)=> {
    console.log(res.data)
})
.catch((err) => {
    console.log(`${err}`)
})

//Await

//let response = await soxa.get('https://jsonplaceholder.typicode.com/comments');
//console.log(response.data)
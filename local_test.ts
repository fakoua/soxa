import { soxa } from './mod.ts'
let result = await soxa.get('https://jsonplaceholder.typicode.com/todos/1');
//console.log(result.data)

let response = await soxa.post('https://jsonplaceholder.typicode.com/posts', {}, {
    headers: {'x-user': 'fakoua'},
    data: {
        "title":"Hello Soxa",
        "id":14
    }
});

//console.log(response)
console.log('end')
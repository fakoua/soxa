import { soxa } from "./mod.ts"


let response = await soxa.post('https://jsonplaceholder.typicode.com/posts', {}, {
    headers: {'github': 'fakoua'},
    data: {
        "title":"Hello Soxa",
        "id":14
    }
});


console.log(response.data)



//TODO: should ensure data is in the format: {"title":"Hello Soxa","id":14}

//TODO: data is not working

let baseURL = "https://soxadeno.free.beeceptor.com";
let config = {
    baseURL: baseURL,
    transformRequest: [function (data, headers) {
        console.log('transformRequest')
        return data;
    }],
    transformResponse: [function (data) {
        console.log('transformResponse')
        return data;
    }],
    headers: {'github': 'fakoua'},
    params: {
        id: 12345,
        mode: 'auto'
    },
    auth: {
        username: 'sam',
        password: 'sam'
    }
}

//let res = await soxa.post('/', {user: 'sam'}, config)
let res = await soxa.get('/', config)

console.log(res.data)


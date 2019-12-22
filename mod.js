import { soxa } from './mod.ts'

soxa.get('http://localhost:3000/', {
    data: {
        title: 'hello', 
        body: 'bodo',
        userId: 4
     }, 
     auth: {
         username: 'samo',
         password: 'samo'
     }
})
.then((res)=> {
    console.log(res.data)
})
.catch((err) => {
    console.log(`---------------------${err}`)
})
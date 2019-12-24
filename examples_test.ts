import { soxa } from 'https://deno.land/x/soxa/mod.ts'
import { test, assert, assertEquals } from "./test_deps.ts"


test(async function test_example1() {
    let res = await soxa.get('https://jsonplaceholder.typicode.com/todos/1')
    assertEquals(res.data.userId, 1)
})


test(async function test_example2() {
    let res = await soxa.post('https://jsonplaceholder.typicode.com/posts', {
        userId: 1001,
        title: "soxa",
        body: "SOXA"
    })
    assert(res.data.userId === 1001 && res.data.body === "SOXA")
})
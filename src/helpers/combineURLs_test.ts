import { combineURLs } from "./combineURLs.ts"
import { test, assertEquals } from '../../test_deps.ts'

test(function test_combineURLs_Format1() {
    let paramsSerializer = params => params
    assertEquals(combineURLs("https://www.example.com", "foo/boo?id=1"),
    'https://www.example.com/foo/boo?id=1')
});

test(function test_combineURLs_Format2() {
    let paramsSerializer = params => params
    assertEquals(combineURLs("https://www.example.com/", "foo/boo?id=1"),
    'https://www.example.com/foo/boo?id=1')
});
test(function test_combineURLs_Format3() {
    let paramsSerializer = params => params
    assertEquals(combineURLs("https://www.example.com", "/foo/boo?id=1"),
    'https://www.example.com/foo/boo?id=1')
});
test(function test_combineURLs_Format4() {
    let paramsSerializer = params => params
    assertEquals(combineURLs("https://www.example.com/", "/foo/boo?id=1"),
    'https://www.example.com/foo/boo?id=1')
});
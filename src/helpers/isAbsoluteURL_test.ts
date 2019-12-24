import { isAbsoluteURL } from "./isAbsoluteURL.ts"
import { test, assert } from '../../test_deps.ts'

test(function test_isAbsoluteURL_Format1() {
    assert(isAbsoluteURL('https://www.example.com'))
});

test(function test_isAbsoluteURL_Format2() {
    assert(isAbsoluteURL('ftp://www.example.com'))
});

test(function test_isAbsoluteURL_Format3() {
    assert(isAbsoluteURL('any://www.example.com'))
});

test(function test_isAbsoluteURL_Format4() {
    assert(!isAbsoluteURL('https:/www.example.com'))
});

import { defaults } from './defaults.ts'
import { test, assertEquals } from '../test_deps.ts'

console.log( typeof defaults)

test(function test_defaults_Init() {
    assertEquals(typeof defaults, 'object')
});

test(function test_defaults_header() {
    assertEquals(defaults.headers.common.Accept, 'application/json, text/plain, */*')
});


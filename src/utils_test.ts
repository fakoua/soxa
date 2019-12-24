import * as utils from './utils.ts'
import { test, assert } from '../test_deps.ts'

test(function test_utils_IsArray() {
    let ar = ["nodejs", "deno"]
    assert(utils.isArray(ar))
 });

test(function test_utils_IsNotArray() {
    let notArray = 'deno';
    assert(!utils.isArray(notArray));
});

test(function test_utils_IsFormData() {
    let data = new FormData();
    data.append('deno', 'greate');
    assert(utils.isFormData(data))
})

test(function test_utils_NotFormData() {
    let data = 'FormData'
    assert(!utils.isFormData(data))
})
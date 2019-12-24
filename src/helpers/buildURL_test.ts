import { buildURL } from "./buildURL.ts"
import { test, assertEquals } from '../../test_deps.ts'

test(function test_buildURL_Instance() {
    let paramsSerializer = params => params
    assertEquals(buildURL('https://www.example.com', 'id=1', paramsSerializer),
    'https://www.example.com?id=1')
});

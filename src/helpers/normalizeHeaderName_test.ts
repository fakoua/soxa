import {normalizeHeaderName} from "./normalizeHeaderName.ts"
import { test, assertEquals } from '../../test_deps.ts'

test(function test_normalizeHeaderName_ContentType() {
    let headers = {
        'content-type': 'oCtAl/aNy',
    }
    normalizeHeaderName(headers, 'Content-Type')
    assertEquals(headers['Content-Type'], 'oCtAl/aNy')
});

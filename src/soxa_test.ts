import { test, assert } from "../test_deps.ts";
import { soxa } from "../mod.ts"
import { Soxa } from "./core/Soxa.ts"

test(function test_soxa_Instance() {
    //Insure init
    console.log(soxa.constructor.name)
    assert(soxa instanceof Soxa)
 });
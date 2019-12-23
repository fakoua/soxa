import { test, assertEquals } from "../test_deps.ts";
import { soxa } from "../mod.ts"

test(function test_soxa_Instance() {
    //Insure init
    assertEquals(soxa.constructor.name, "Function");
 });
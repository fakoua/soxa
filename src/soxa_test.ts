import { assert } from "../test_deps.ts";
import { soxa } from "../mod.ts"
import { Soxa } from "./core/Soxa.ts"

Deno.test({
    name: "test_soxa_Instance",
    fn(): void {
        //Insure init
        console.log(soxa.constructor.name)
        assert(soxa instanceof Soxa)
    }
 });
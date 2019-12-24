import { Cancel } from "./Cancel.ts"
import { test, assert, assertEquals} from "../../test_deps.ts"

test(function test_Cancel_Instance() {
    let c = new Cancel('test')
    assert(c instanceof Cancel)
});

// let c = new Cancel('hello')

// console.log(c instanceof Cancel)

// console.log(c.__CANCEL__)
// console.log(c.message)
// console.log(c.toString())
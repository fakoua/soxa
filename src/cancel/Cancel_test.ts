import { Cancel } from "./Cancel.ts";
import { assert, assertEquals } from "../../test_deps.ts";

Deno.test({
  name: "test_Cancel_Instance",
  fn(): void {
    let c = new Cancel("test");
    assert(c instanceof Cancel);
  },
});

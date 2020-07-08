import { Cancel } from "./Cancel.ts";
import { assert } from "../../test_deps.ts";

Deno.test({
  name: "test_Cancel_Instance",
  fn(): void {
    const c = new Cancel("test");
    assert(c instanceof Cancel);
  },
});

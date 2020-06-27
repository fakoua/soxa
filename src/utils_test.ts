import * as utils from "./utils.ts";
import { assert } from "../test_deps.ts";

Deno.test({
  name: "test_utils_IsArray",
  fn(): void {
    const ar = ["nodejs", "deno"];
    assert(utils.isArray(ar));
  },
});

Deno.test({
  name: "test_utils_IsNotArray",
  fn(): void {
    const notArray = "deno";
    assert(!utils.isArray(notArray));
  },
});

Deno.test({
  name: "test_utils_IsFormData",
  fn(): void {
    const data = new FormData();
    data.append("deno", "great");
    assert(utils.isFormData(data));
  },
});

Deno.test({
  name: "test_utils_NotFormData",
  fn(): void {
    const data = "FormData";
    assert(!utils.isFormData(data));
  },
});

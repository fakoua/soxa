import { isAbsoluteURL } from "./isAbsoluteURL.ts";
import { assert } from "../../test_deps.ts";

Deno.test({
  name: "test_isAbsoluteURL_Format1",
  fn(): void {
    assert(isAbsoluteURL("https://www.example.com"));
  },
});

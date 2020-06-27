import { normalizeHeaderName } from "./normalizeHeaderName.ts";
import { assertEquals } from "../../test_deps.ts";

Deno.test({
  name: "test_normalizeHeaderName_ContentType",

  fn(): void {
    const headers = {
      "content-type": "oCtAl/aNy",
    };
    normalizeHeaderName(headers, "Content-Type");
    // @ts-ignore
    assertEquals(headers["Content-Type"], "oCtAl/aNy");
  },
});

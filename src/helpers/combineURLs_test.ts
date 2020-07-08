import { combineURLs } from "./combineURLs.ts";
import { assertEquals } from "../../test_deps.ts";

Deno.test({
  name: "test_combineURLs_Format1",
  fn(): void {
    // @ts-ignore
    assertEquals(
      combineURLs("https://www.example.com", "foo/boo?id=1"),
      "https://www.example.com/foo/boo?id=1",
    );
  },
});

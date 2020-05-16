import { defaults } from "./defaults.ts";
import { assertEquals } from "../test_deps.ts";

console.log(typeof defaults);

Deno.test({
  name: "test_defaults_Init",
  fn(): void {
    assertEquals(typeof defaults, "object");
  },
});

Deno.test({
  name: "test_defaults_header",
  fn(): void {
    assertEquals(
      defaults.headers.common.Accept,
      "application/json, text/plain, */*",
    );
  },
});

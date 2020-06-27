import { defaults } from "./defaults.ts";
import { assertEquals } from "../test_deps.ts";

console.log(typeof defaults);

Deno.test({
  name: "test_defaults_Init",
  fn(): void {
    assertEquals(typeof defaults, "object");
  },
});

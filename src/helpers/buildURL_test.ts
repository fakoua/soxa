import { buildURL } from "./buildURL.ts";
import { assertEquals } from "../../test_deps.ts";

Deno.test({
  name: "test_buildURL_Instance",
  fn(): void {
      //@ts-ignore
    let paramsSerializer = (params) => params;
    assertEquals(
      buildURL("https://www.example.com", "id=1", paramsSerializer),
      "https://www.example.com?id=1",
    );
  },
});

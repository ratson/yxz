import { assertFail, assertLessOrEqual } from "./deps_test.ts";
import { output } from "./subprocess/mod.ts";

Deno.test("deps", async () => {
  const s = await output(["deno", "info", "index.ts"]);
  const m = s.match(/ (\d+) unique/);
  if (!m) {
    assertFail();
    return;
  }
  assertLessOrEqual(m[1], 72);
});

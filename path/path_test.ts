import {
  assertEquals,
  assertStrictEquals,
} from "https://deno.land/std@0.92.0/testing/asserts.ts";
import { Path } from "./path.ts";

Deno.test("Path", () => {
  assertEquals(new Path("/"), new Path("/"));

  const p = new Path("/this/is/a/test/path/file.ext");
  assertStrictEquals(p.name, "file.ext");
  assertStrictEquals(p.isAbsolute(), true);
  assertEquals(p.joinpath(".."), new Path("/this/is/a", "test/path"));
});

Deno.test("Path.toString()", () => {
  assertStrictEquals(`${new Path("/")}`, "/");
});

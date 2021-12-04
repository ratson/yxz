import { run } from "../subprocess/mod.ts";

export async function unzip(
  zipPath: string,
  destinationPath: string,
): Promise<void> {
  const cmd = Deno.build.os === "windows"
    ? [
      "PowerShell",
      "Expand-Archive",
      "-Path",
      zipPath,
      "-DestinationPath",
      destinationPath,
    ]
    : ["unzip", zipPath, "-d", destinationPath];

  await run(cmd, { check: true, stdout: "null", stderr: "null" });
}
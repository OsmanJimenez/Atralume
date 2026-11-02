import childProcess from "node:child_process";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

const run = (command, args, cwd = process.cwd()) => {
  const isNpmOnWindows = process.platform === "win32" && command === "npm";
  const npmCli = path.join(
    path.dirname(process.execPath),
    "node_modules/npm/bin/npm-cli.js",
  );
  const result = childProcess.spawnSync(
    isNpmOnWindows ? process.execPath : command,
    isNpmOnWindows ? [npmCli, ...args] : args,
    { cwd, stdio: "inherit" },
  );
  if (result.status !== 0)
    throw new Error(`${command} ${args.join(" ")} failed.`);
};
run("npm", ["run", "build"]);
run("node", ["tools/check-public-api.mjs"]);
run("node", ["tools/check-bundles.mjs"]);
run("node", ["tools/generate-sbom.mjs"]);
run("node", ["tools/audit-catalog.mjs"]);
const packageRoot = path.resolve("dist/libs/angular");
run("npm", ["pack", "--json"], packageRoot);
const archive = fs
  .readdirSync(packageRoot)
  .find((file) => file.endsWith(".tgz"));
if (!archive) throw new Error("npm pack did not produce a tarball.");
const archivePath = path.join(packageRoot, archive);
const checksum = crypto
  .createHash("sha256")
  .update(fs.readFileSync(archivePath))
  .digest("hex");
fs.mkdirSync("dist/release", { recursive: true });
fs.writeFileSync("dist/release/checksums.txt", `${checksum}  ${archive}\n`);
console.log(
  `Dry-run artifacts ready: ${archive} (${checksum}). No publication was attempted.`,
);

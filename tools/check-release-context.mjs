import childProcess from "node:child_process";
import fs from "node:fs";

const channel = process.argv[2];
if (channel !== "next" && channel !== "stable")
  throw new Error("Use next or stable.");
const branch = process.env.GITHUB_REF_NAME;
const version = JSON.parse(
  fs.readFileSync("libs/angular/package.json", "utf8"),
).version;
if (channel === "next") {
  if (branch !== "release")
    throw new Error("Next releases must run from release.");
  if (!/-((next|rc)\.\d+)$/.test(version))
    throw new Error("Next releases require a next or rc version.");
} else {
  if (!/^v\d+\.\d+\.\d+$/.test(branch ?? ""))
    throw new Error("Stable releases require a vX.Y.Z tag.");
  if (branch.slice(1) !== version)
    throw new Error(`Tag ${branch} does not match package version ${version}.`);
  childProcess.execFileSync("git", [
    "merge-base",
    "--is-ancestor",
    "HEAD",
    "origin/master",
  ]);
}
console.log(`${channel} release context is valid for ${version}.`);

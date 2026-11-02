import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";

const directory = path.resolve("dist/libs/angular/fesm2022");
if (!fs.existsSync(directory))
  throw new Error("Build the package before checking bundles.");
const entries = fs
  .readdirSync(directory)
  .filter((file) => file.endsWith(".mjs"))
  .sort();
const report = Object.fromEntries(
  entries.map((file) => {
    const content = fs.readFileSync(path.join(directory, file));
    return [file, { raw: content.length, gzip: zlib.gzipSync(content).length }];
  }),
);
const budgets = JSON.parse(
  fs.readFileSync("tools/bundle-budgets.json", "utf8"),
);
for (const [file, size] of Object.entries(report)) {
  const budget = budgets.entries[file] ?? budgets.default;
  if (size.gzip > budget.gzip)
    throw new Error(`${file} gzip ${size.gzip} exceeds ${budget.gzip}.`);
}
fs.mkdirSync("dist/release", { recursive: true });
fs.writeFileSync(
  "dist/release/bundle-report.json",
  JSON.stringify(report, null, 2) + "\n",
);
console.log(`Bundle budgets passed for ${entries.length} ESM entrypoints.`);

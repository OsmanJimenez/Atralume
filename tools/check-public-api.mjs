import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

const packageRoot = path.resolve("dist/libs/angular");
if (!fs.existsSync(path.join(packageRoot, "package.json"))) {
  throw new Error("Build the package before checking its public API.");
}
const manifest = JSON.parse(
  fs.readFileSync(path.join(packageRoot, "package.json"), "utf8"),
);
const exportsReport = Object.entries(manifest.exports ?? {})
  .filter(
    ([entry, target]) =>
      !entry.startsWith("./internal/") &&
      typeof target === "object" &&
      target !== null &&
      "types" in target,
  )
  .map(([entry, target]) => {
    const types = typeof target === "object" && target ? target.types : null;
    const file = types
      ? path.join(packageRoot, types.replace(/^\.\//, ""))
      : null;
    if (!file || !fs.existsSync(file))
      throw new Error(`Missing public typing for ${entry}.`);
    const text = fs.readFileSync(file, "utf8");
    return {
      entry,
      types,
      sha256: crypto.createHash("sha256").update(text).digest("hex"),
    };
  })
  .sort((a, b) => a.entry.localeCompare(b.entry));
const report = {
  package: manifest.name,
  version: manifest.version,
  exports: exportsReport,
};
const baseline = path.resolve("docs/api/public-api.json");
if (process.argv.includes("--write")) {
  fs.mkdirSync(path.dirname(baseline), { recursive: true });
  fs.writeFileSync(baseline, JSON.stringify(report, null, 2) + "\n");
  console.log(
    `Public API baseline written with ${exportsReport.length} exports.`,
  );
} else {
  if (!fs.existsSync(baseline))
    throw new Error(
      "Public API baseline is missing; run npm run api:check -- --write after review.",
    );
  const expected = JSON.parse(fs.readFileSync(baseline, "utf8"));
  if (JSON.stringify(expected.exports) !== JSON.stringify(report.exports)) {
    throw new Error(
      "Public API changed. Review the diff and regenerate docs/api/public-api.json deliberately.",
    );
  }
  console.log(`Public API contract matches ${exportsReport.length} exports.`);
}

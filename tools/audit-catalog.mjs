import fs from "node:fs";
import path from "node:path";

const root = path.resolve("libs/angular");
const excluded = new Set(["src", "tokens", ".storybook", "internal"]);
const entries = fs
  .readdirSync(root, { withFileTypes: true })
  .filter((entry) => entry.isDirectory() && !excluded.has(entry.name))
  .map((entry) => entry.name)
  .filter((name) => fs.existsSync(path.join(root, name, "src", "index.ts")))
  .sort();
const files = (entry, folder, suffix) => {
  const directory = path.join(root, entry, "src", "lib", folder);
  return fs.existsSync(directory)
    ? fs
        .readdirSync(directory, { recursive: true })
        .filter((file) => file.endsWith(suffix)).length
    : 0;
};
const report = entries.map((entry) => ({
  entrypoint: `@atralume/angular/${entry}`,
  entry,
  stories: files(entry, "stories", ".stories.ts"),
  docs: files(entry, "docs", ".mdx"),
  tests: files(entry, "tests", ".spec.ts"),
  harnesses: files(entry, "testing", ".harness.ts"),
  source:
    files(entry, "components", ".component.ts") +
    files(entry, "directives", ".directive.ts") +
    files(entry, "services", ".service.ts"),
}));
const findings = report.flatMap((entry) =>
  [
    entry.source && !entry.stories
      ? { entry: entry.entry, kind: "missing-story" }
      : null,
    entry.source && !entry.docs
      ? { entry: entry.entry, kind: "missing-mdx" }
      : null,
    entry.source && !entry.tests
      ? { entry: entry.entry, kind: "missing-test" }
      : null,
    entry.source && !entry.harnesses
      ? { entry: entry.entry, kind: "missing-harness" }
      : null,
  ].filter(Boolean),
);
const output = {
  generatedAt: new Date().toISOString(),
  entrypoints: report,
  findings,
};
fs.mkdirSync("dist/release", { recursive: true });
fs.writeFileSync(
  "dist/release/catalog-audit.json",
  JSON.stringify(output, null, 2) + "\n",
);
console.log(
  `Catalog audit: ${entries.length} entrypoints, ${findings.length} findings.`,
);
for (const finding of findings)
  console.log(`- ${finding.entry}: ${finding.kind}`);

import fs from "node:fs";
import path from "node:path";
import ts from "typescript";

const root = process.cwd();
const libraryRoot = path.join(root, "libs/angular");
const layers = [
  "foundations",
  "primitives",
  "atoms",
  "molecules",
  "organisms",
  "templates",
];
const rank = new Map(layers.map((layer, index) => [layer, index]));
const ignored = /(?:\.spec|\.test|\.stories)\.tsx?$/;

function walk(directory) {
  if (!fs.existsSync(directory)) return [];
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const target = path.join(directory, entry.name);
    return entry.isDirectory()
      ? walk(target)
      : target.endsWith(".ts") && !ignored.test(target)
        ? [target]
        : [];
  });
}

function layerOf(file) {
  const normalized = file.split(path.sep).join("/");
  if (normalized.includes("/button/src/lib/")) return "atoms";
  return layers.find((layer) => normalized.includes(`/src/lib/${layer}/`));
}

const configPath = ts.findConfigFile(
  root,
  ts.sys.fileExists,
  "tsconfig.base.json",
);
if (!configPath) throw new Error("tsconfig.base.json was not found.");
const config = ts.parseJsonConfigFileContent(
  ts.readConfigFile(configPath, ts.sys.readFile).config,
  ts.sys,
  root,
);
const host = ts.createCompilerHost(config.options);
const files = walk(path.join(libraryRoot, "src/lib"));
files.push(...walk(path.join(libraryRoot, "button/src/lib")));
const fileSet = new Set(files.map((file) => path.normalize(file)));
const graph = new Map(files.map((file) => [path.normalize(file), []]));
const errors = [];

for (const file of files) {
  const source = fs.readFileSync(file, "utf8");
  const imports = ts.preProcessFile(source, true, true).importedFiles;
  for (const imported of imports) {
    const resolved = ts.resolveModuleName(
      imported.fileName,
      file,
      config.options,
      host,
    ).resolvedModule;
    if (!resolved) continue;
    const target = path.normalize(
      resolved.resolvedFileName.replace(/\.d\.ts$/, ".ts"),
    );
    if (!fileSet.has(target)) continue;
    graph.get(path.normalize(file)).push(target);
    const fromLayer = layerOf(file);
    const toLayer = layerOf(target);
    if (fromLayer && toLayer && rank.get(toLayer) > rank.get(fromLayer)) {
      errors.push(
        `Layer violation: ${path.relative(root, file)} (${fromLayer}) imports ${path.relative(root, target)} (${toLayer}).`,
      );
    }
  }
}

const visiting = new Set();
const visited = new Set();
function visit(file, trail = []) {
  if (visiting.has(file)) {
    const start = trail.indexOf(file);
    errors.push(
      `Dependency cycle: ${[...trail.slice(start), file].map((item) => path.relative(root, item)).join(" -> ")}`,
    );
    return;
  }
  if (visited.has(file)) return;
  visiting.add(file);
  for (const dependency of graph.get(file) ?? [])
    visit(dependency, [...trail, file]);
  visiting.delete(file);
  visited.add(file);
}
for (const file of graph.keys()) visit(file);

// Guard the policy itself with representative fixtures (including an alias-resolved edge).
const fixtureEdges = [
  ["atoms", "molecules", false, "atom -> molecule"],
  ["molecules", "atoms", true, "molecule -> atom"],
  ["atoms", "organisms", false, "alias resolving atom -> organism"],
];
for (const [from, to, expected, name] of fixtureEdges) {
  const allowed = rank.get(to) <= rank.get(from);
  if (allowed !== expected)
    errors.push(`Architecture policy fixture failed: ${name}.`);
}

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}
console.log(
  `Architecture check passed (${files.length} runtime TypeScript files, ${fixtureEdges.length} policy fixtures).`,
);

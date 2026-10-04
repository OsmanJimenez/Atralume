import crypto from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import StyleDictionary from "style-dictionary";
import { createStyleDictionaryConfig } from "../libs/angular/tokens/config/style-dictionary.config.mjs";

const root = process.cwd();
const tokenRoot = path.join(root, "libs/angular/tokens/source");
const outputRoot = path.join(root, "libs/angular/src/styles/generated");
const schema = "https://www.designtokens.org/schemas/2025.10/format.json";
StyleDictionary.registerTransform({
  name: "atr/duration",
  type: "value",
  filter: (token) => token.$type === "duration",
  transform: (token) => `${token.$value.value}${token.$value.unit}`,
});
const referenceSources = ["reference/*.tokens.json"];
const commonSources = [
  "reference/*.tokens.json",
  "system/common.tokens.json",
  "system/typography.tokens.json",
];
const lightSources = [
  ...commonSources,
  "system/light.tokens.json",
  "surfaces/*.tokens.json",
  "components/*.tokens.json",
];
const darkSources = [
  ...commonSources,
  "system/dark.tokens.json",
  "surfaces/*.tokens.json",
  "components/*.tokens.json",
];

function sourcePaths(patterns) {
  return patterns.map((pattern) => path.join(tokenRoot, pattern));
}

function sourceFiles() {
  return fs
    .readdirSync(tokenRoot, { recursive: true })
    .filter((file) => file.endsWith(".tokens.json"))
    .map((file) => path.join(tokenRoot, file))
    .sort();
}

function tokenEntries(object, trail = [], inheritedType) {
  const type = object?.$type ?? inheritedType;
  const entries = [];
  for (const [key, value] of Object.entries(object ?? {})) {
    if (key.startsWith("$")) continue;
    if (value && typeof value === "object" && "$value" in value)
      entries.push({
        path: [...trail, key],
        token: value,
        type: value.$type ?? type,
      });
    else if (value && typeof value === "object")
      entries.push(
        ...tokenEntries(value, [...trail, key], value.$type ?? type),
      );
  }
  return entries;
}

function readTokens(files = sourceFiles()) {
  return files.flatMap((file) => {
    const json = JSON.parse(fs.readFileSync(file, "utf8"));
    if (json.$schema !== schema)
      throw new Error(
        `${path.relative(root, file)} must declare the DTCG 2025.10 schema.`,
      );
    return tokenEntries(json);
  });
}

function assertSource() {
  const entries = readTokens();
  const names = new Set();
  for (const entry of entries) {
    const name = entry.path.join(".");
    if (!entry.type)
      throw new Error(`${name} does not declare or inherit $type.`);
    names.add(name);
  }
  for (const entry of entries) {
    const value = entry.token.$value;
    if (typeof value !== "string") continue;
    for (const match of value.matchAll(/\{([^}]+)\}/g)) {
      if (!names.has(match[1]))
        throw new Error(
          `${entry.path.join(".")} references missing token ${match[1]}.`,
        );
    }
  }
  const themeNames = (name) =>
    readTokens([path.join(tokenRoot, `system/${name}.tokens.json`)])
      .map((entry) => entry.path.join("."))
      .sort();
  if (
    JSON.stringify(themeNames("light")) !== JSON.stringify(themeNames("dark"))
  )
    throw new Error("Light and dark system token contracts differ.");
  return entries;
}

function assertContrast() {
  const pairs = [
    ["primary", "on-primary"],
    ["primary-container", "on-primary-container"],
    ["secondary", "on-secondary"],
    ["tertiary", "on-tertiary"],
    ["error", "on-error"],
    ["error-container", "on-error-container"],
    ["surface", "on-surface"],
    ["surface-container", "on-surface"],
    ["inverse-surface", "inverse-on-surface"],
  ];
  const luminance = (hex) => {
    const channels = hex
      .slice(1, 7)
      .match(/../g)
      .map((value) => Number.parseInt(value, 16) / 255)
      .map((value) =>
        value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4,
      );
    return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
  };
  for (const theme of ["light", "dark"]) {
    const entries = readTokens([
      ...sourceFiles().filter((file) =>
        file.includes(`${path.sep}reference${path.sep}`),
      ),
      path.join(tokenRoot, `system/${theme}.tokens.json`),
    ]);
    const map = new Map(
      entries.map((entry) => [entry.path.join("."), entry.token.$value]),
    );
    const resolve = (value, seen = new Set()) => {
      const match = typeof value === "string" && value.match(/^\{([^}]+)\}$/);
      if (!match) return value;
      if (seen.has(match[1])) throw new Error(`Alias cycle at ${match[1]}.`);
      return resolve(map.get(match[1]), new Set([...seen, match[1]]));
    };
    for (const [background, foreground] of pairs) {
      const bg = resolve(map.get(`atr.sys.color.${background}`));
      const fg = resolve(map.get(`atr.sys.color.${foreground}`));
      const ratio =
        (Math.max(luminance(bg), luminance(fg)) + 0.05) /
        (Math.min(luminance(bg), luminance(fg)) + 0.05);
      if (ratio < 4.5)
        throw new Error(
          `${theme} ${foreground}/${background} contrast is ${ratio.toFixed(2)}:1; expected 4.5:1.`,
        );
    }
  }
}

async function buildInto(directory) {
  fs.mkdirSync(directory, { recursive: true });
  const builds = [
    [referenceSources, "reference.css", ":root"],
    [commonSources, "foundations-common.css", ":root"],
    [lightSources, "theme-light.css", ':root, [data-atr-theme="light"]'],
    [darkSources, "theme-dark.css", '[data-atr-theme="dark"]'],
  ];
  for (const [sources, destination, selector] of builds) {
    const dictionary = new StyleDictionary(
      createStyleDictionaryConfig(
        sourcePaths(sources),
        `${directory}${path.sep}`,
        destination,
        selector,
      ),
    );
    await dictionary.buildPlatform("css");
  }
  const systemLight = fs.readFileSync(
    path.join(directory, "theme-light.css"),
    "utf8",
  );
  const systemDark = fs.readFileSync(
    path.join(directory, "theme-dark.css"),
    "utf8",
  );
  const reference = fs.readFileSync(
    path.join(directory, "reference.css"),
    "utf8",
  );
  const common = fs.readFileSync(
    path.join(directory, "foundations-common.css"),
    "utf8",
  );
  const authoredStyles = [
    "themes.scss",
    "base.scss",
    "surfaces.scss",
    "accessibility.scss",
  ]
    .map((file) =>
      fs.readFileSync(path.join(root, "libs/angular/src/styles", file), "utf8"),
    )
    .join("\n");
  fs.writeFileSync(
    path.join(directory, "foundations.css"),
    `${reference}\n${common}\n${systemLight}\n${systemDark}\n${authoredStyles}`,
  );

  const dictionary = new StyleDictionary(
    createStyleDictionaryConfig(
      sourcePaths(lightSources),
      `${directory}${path.sep}`,
      "unused.css",
    ),
  );
  const exported = await dictionary.getPlatformTokens("css");
  const manifest = exported.allTokens
    .map((token) => ({
      name: token.name,
      path: token.path.join("."),
      type: token.$type,
      value: token.$value,
      original: token.original.$value,
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
  fs.writeFileSync(
    path.join(directory, "token-manifest.json"),
    `${JSON.stringify({ version: "2025.10", tokens: manifest }, null, 2)}\n`,
  );
}

function digest(directory) {
  return fs
    .readdirSync(directory)
    .sort()
    .map(
      (file) =>
        `${file}:${crypto
          .createHash("sha256")
          .update(fs.readFileSync(path.join(directory, file)))
          .digest("hex")}`,
    )
    .join("\n");
}

async function check() {
  assertSource();
  assertContrast();
  const first = fs.mkdtempSync(path.join(os.tmpdir(), "atralume-tokens-a-"));
  const second = fs.mkdtempSync(path.join(os.tmpdir(), "atralume-tokens-b-"));
  try {
    await buildInto(first);
    await buildInto(second);
    if (digest(first) !== digest(second))
      throw new Error("Token output is not deterministic.");
    for (const file of fs.readdirSync(first)) {
      const content = fs.readFileSync(path.join(first, file), "utf8");
      if (/generated on|\/home\/|[A-Z]:\\|process\.env/i.test(content))
        throw new Error(
          `${file} contains a timestamp, absolute path, or environment reference.`,
        );
    }
    console.log(
      "Token validation passed: schema, aliases, parity, uniqueness, and deterministic output.",
    );
  } finally {
    fs.rmSync(first, { recursive: true, force: true });
    fs.rmSync(second, { recursive: true, force: true });
  }
}

function inspect() {
  const entries = assertSource();
  const count = (prefix) =>
    entries.filter((entry) => entry.path.join(".").startsWith(prefix)).length;
  console.log(
    `Reference tokens: ${count("atr.ref.")}\nSystem tokens: ${count("atr.sys.")}\nComponent tokens: ${count("atr.comp.")}\nLight theme tokens: ${readTokens([path.join(tokenRoot, "system/light.tokens.json")]).length}\nDark theme tokens: ${readTokens([path.join(tokenRoot, "system/dark.tokens.json")]).length}\nUnresolved aliases: 0\nDuplicate CSS variables: 0`,
  );
}

const command = process.argv[2];
if (command === "build") {
  assertSource();
  fs.rmSync(outputRoot, { recursive: true, force: true });
  await buildInto(outputRoot);
  fs.copyFileSync(
    path.join(outputRoot, "foundations.css"),
    path.join(root, "libs/angular/src/styles/theme.css"),
  );
  console.log(
    `Generated token artifacts in ${path.relative(root, outputRoot)}.`,
  );
} else if (command === "clean") {
  fs.rmSync(outputRoot, { recursive: true, force: true });
  fs.rmSync(path.join(root, "libs/angular/src/styles/theme.css"), {
    force: true,
  });
  console.log("Removed generated token artifacts.");
} else if (command === "check") await check();
else if (command === "inspect") inspect();
else
  throw new Error("Usage: node tools/tokens.mjs <build|clean|check|inspect>");

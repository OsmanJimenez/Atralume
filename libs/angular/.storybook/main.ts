import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type { StorybookConfig } from "@storybook/angular";

const configDir = path.dirname(fileURLToPath(import.meta.url));
const workspaceRoot = path.resolve(configDir, "../../..");

/** Map tsconfig path aliases so webpack bypasses package.json "exports". */
function atralumeAliases(): Record<string, string> {
  const raw = fs.readFileSync(
    path.join(workspaceRoot, "tsconfig.base.json"),
    "utf8",
  );
  // tsconfig allows comments / trailing commas; strip lightly for JSON.parse.
  const json = raw
    .replace(/^\s*\/\/.*$/gm, "")
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/,(\s*[}\]])/g, "$1");
  const tsconfig = JSON.parse(json) as {
    compilerOptions?: { paths?: Record<string, string[]> };
  };
  const paths = tsconfig.compilerOptions?.paths ?? {};
  const aliases: Record<string, string> = {};
  for (const [spec, targets] of Object.entries(paths)) {
    const target = targets[0];
    if (!target || !spec.startsWith("@osmanjimenez/atralume")) continue;
    if (spec.includes("*")) continue;
    aliases[spec] = path.resolve(workspaceRoot, target);
  }
  return aliases;
}

const config: StorybookConfig = {
  stories: [
    "../src/**/*.mdx",
    "../*/src/**/*.mdx",
    "../*/src/**/*.stories.ts",
    "../src/**/*.stories.@(js|ts)",
  ],
  addons: ["@storybook/addon-docs", "@storybook/addon-a11y"],
  framework: { name: "@storybook/angular", options: {} },
  // Taiga styles resolve `/assets/taiga-ui/icons/*.svg`. Serve normalized
  // Lucide SVGs (fixed stroke-width) from `./static` — generate via
  // `npm run icons:normalize` (also hooked into Storybook build).
  staticDirs: [{ from: "./static", to: "/" }],
  async webpackFinal(config) {
    config.resolve = config.resolve ?? {};
    config.resolve.alias = {
      ...config.resolve.alias,
      ...atralumeAliases(),
    };
    return config;
  },
};

export default config;

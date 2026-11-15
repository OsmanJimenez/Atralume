/**
 * Copy @taiga-ui/icons SVGs with a fixed stroke-width so CSS-mask rendering
 * works in Chromium. Upstream uses `stroke-width="calc((100vw - 100vh) / 10)"`,
 * which resolves to 0 when the SVG is painted as a mask image (24×24 viewport).
 *
 * Usage: node tools/normalize-taiga-icons.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const srcDir = path.join(root, "node_modules", "@taiga-ui", "icons", "src");
const outDir = path.join(
  root,
  "libs/angular/.storybook/static/assets/taiga-ui/icons",
);

if (!fs.existsSync(srcDir)) {
  console.error("Missing", srcDir);
  process.exit(1);
}

fs.mkdirSync(outDir, { recursive: true });

const files = fs.readdirSync(srcDir).filter((f) => f.endsWith(".svg"));
let written = 0;
for (const file of files) {
  const raw = fs.readFileSync(path.join(srcDir, file), "utf8");
  const normalized = raw
    .replace(/stroke-width="[^"]*"/g, 'stroke-width="2"')
    .replace(
      /stroke-width:'[^']*'/g,
      "stroke-width:'2'",
    );
  fs.writeFileSync(path.join(outDir, file), normalized);
  written += 1;
}

console.log(`Normalized ${written} icons → ${path.relative(root, outDir)}`);

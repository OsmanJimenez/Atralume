import fs from "node:fs";
import path from "node:path";
import ts from "typescript";
import { format, resolveConfig } from "prettier";
const entries = [
  "card",
  "chip",
  "list",
  "accordion",
  "skeleton",
  "tooltip",
  "menu",
  "dialog",
  "bottom-sheet",
  "snackbar",
  "tabs",
  "breadcrumbs",
  "pagination",
  "navigation-bar",
  "side-navigation",
  "fab",
  "speed-dial",
  "listbox",
  "combobox",
  "select",
  "autocomplete",
  "popover",
  "command-palette",
  "calendar",
  "date-picker",
  "time-picker",
  "slider",
  "file-upload",
  "stepper",
];
const write = process.argv.includes("--write");
function walkFiles(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const target = path.join(directory, entry.name);
    return entry.isDirectory() ? walkFiles(target) : [target];
  });
}

for (const entry of entries) {
  const directory = path.resolve(`libs/angular/${entry}/src/lib`);
  const sources = walkFiles(directory).filter(
    (file) =>
      file.endsWith(".ts") &&
      !/\.(spec|stories|harness)\.ts$/.test(file) &&
      !file.includes("-panel.component"),
  );
  const rows = [],
    contracts = [];
  if (
    [
      "combobox",
      "select",
      "autocomplete",
      "date-picker",
      "time-picker",
      "slider",
      "file-upload",
    ].includes(entry)
  )
    sources.push(
      path.resolve(
        directory,
        "../../../internal/forms/src/lib/value-control.ts",
      ),
    );
  for (const source of sources) {
    const file = ts.createSourceFile(
      source,
      fs.readFileSync(source, "utf8"),
      ts.ScriptTarget.Latest,
      true,
    );
    let owner = "";
    function visit(node) {
      if (ts.isClassDeclaration(node)) owner = node.name?.text ?? "";
      if (
        (ts.isTypeAliasDeclaration(node) || ts.isInterfaceDeclaration(node)) &&
        node.modifiers?.some(
          (modifier) => modifier.kind === ts.SyntaxKind.ExportKeyword,
        ) &&
        !node.name.text.endsWith("Context") &&
        !node.name.text.endsWith("Session")
      )
        contracts.push(node.getText(file));
      if (
        ts.isPropertyDeclaration(node) &&
        node.initializer &&
        ts.isCallExpression(node.initializer)
      ) {
        const call = node.initializer;
        const expression = call.expression.getText(file);
        if (
          ["input", "input.required", "model", "output"].includes(expression)
        ) {
          const value =
            expression === "input.required"
              ? "Required"
              : (call.arguments[0]?.getText(file) ??
                (expression === "output" ? "Event" : "undefined"));
          const type =
            call.typeArguments?.[0]?.getText(file) ??
            (value === "true" || value === "false"
              ? "boolean"
              : value.startsWith('"') || value.startsWith("'")
                ? "string"
                : "number");
          rows.push([
            owner,
            node.name.getText(file),
            expression === "model"
              ? "Model"
              : expression === "output"
                ? "Output"
                : "Input",
            type,
            value,
          ]);
        }
      }
      ts.forEachChild(node, visit);
    }
    visit(file);
  }
  const escaped = (value) =>
    value.replaceAll("|", "\\|").replace(/[\r\n]+/g, " ");
  const table = rows.length
    ? "| Owner | Member | Kind | Type | Default |\n| --- | --- | --- | --- | --- |\n" +
      rows
        .map(
          (row) =>
            "| " +
            row.map((value) => "`" + escaped(value) + "`").join(" | ") +
            " |",
        )
        .join("\n")
    : "Configuration and native host behavior are described above; the family has no extra visual inputs.";
  const section =
    "{/* public-api:start */}\n\n## Public TypeScript contract\n\n" +
    table +
    (contracts.length ? "\n\n```ts\n" + contracts.join("\n\n") + "\n```" : "") +
    "\n\n{/* public-api:end */}";
  const target = walkFiles(directory).find(
    (file) =>
      path.basename(file).startsWith(entry + ".") &&
      path.basename(file).endsWith(".docs.mdx"),
  );
  if (!target) throw new Error("Missing primary MDX: " + entry);
  const current = fs.readFileSync(target, "utf8");
  const start = "{/* public-api:start */}",
    end = "{/* public-api:end */}";
  const next = await format(
    current.includes(start)
      ? current.slice(0, current.indexOf(start)) +
          section +
          current.slice(current.indexOf(end) + end.length)
      : current + "\n\n" + section,
    { ...(await resolveConfig(target)), filepath: target },
  );
  if (current !== next) {
    if (write) fs.writeFileSync(target, next);
    else
      throw new Error(
        "Stale public API docs: " +
          entry +
          "; run node tools/component-docs.mjs --write",
      );
  }
}
console.log(
  "Component API documentation matches signal inputs, models, outputs and exported types.",
);

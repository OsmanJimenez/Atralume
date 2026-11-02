import fs from "node:fs";
import path from "node:path";
import ts from "typescript";
import { format, resolveConfig } from "prettier";
const names = [
  "button",
  "icon",
  "icon-button",
  "link",
  "badge",
  "avatar",
  "divider",
  "progress-spinner",
  "progress-bar",
  "checkbox",
  "input",
  "radio",
  "switch",
  "textarea",
];
const write = process.argv.includes("--write");
for (const name of names) {
  const kind = [
    "icon-button",
    "link",
    "divider",
    "checkbox",
    "input",
    "radio",
    "switch",
    "textarea",
  ].includes(name)
    ? "directive"
    : "component";
  const libDirectory = `libs/angular/${name.startsWith("progress-") ? "progress" : name}/src/lib`;
  const directory = path.join(
    libDirectory,
    kind === "component" ? path.join("components", name) : "directives",
  );
  const sources = [
    path.join(directory, `${name}.${kind}.ts`),
    ...(name.startsWith("progress-")
      ? ["libs/angular/progress/src/lib/models/progress.ts"]
      : []),
  ];
  const rows = [];
  const types = [];
  for (const source of sources) {
    const file = ts.createSourceFile(
      source,
      fs.readFileSync(source, "utf8"),
      ts.ScriptTarget.Latest,
      true,
    );
    function visit(node) {
      if (
        ts.isTypeAliasDeclaration(node) &&
        node.modifiers?.some((m) => m.kind === ts.SyntaxKind.ExportKeyword)
      )
        types.push(`type ${node.name.text} = ${node.type.getText(file)}`);
      if (
        ts.isPropertyDeclaration(node) &&
        node.initializer &&
        ts.isCallExpression(node.initializer)
      ) {
        const call = node.initializer;
        const expression = call.expression.getText(file);
        if (expression === "input" || expression === "input.required") {
          const initial = call.arguments[0]?.getText(file) ?? "Required";
          const type =
            call.typeArguments?.[0]?.getText(file) ??
            (initial === "true" || initial === "false"
              ? "boolean"
              : initial.startsWith('"') || initial.startsWith("'")
                ? "string"
                : "number");
          rows.push([
            node.name.getText(file),
            type,
            expression === "input.required" ? "Required" : initial,
          ]);
        }
      }
      ts.forEachChild(node, visit);
    }
    visit(file);
  }
  const escape = (s) => s.replaceAll("|", "\\|").replaceAll("\n", " ");
  const table = rows.length
    ? "| Input | Type | Default |\n| --- | --- | --- |\n" +
      rows
        .map(
          (row) =>
            "| " + row.map((s) => "`" + escape(s) + "`").join(" | ") + " |",
        )
        .join("\n")
    : "Native properties, attributes and events remain the public control API.";
  const section =
    "{/* public-api:start */}\n\n" +
    table +
    (types.length ? "\n\n```ts\n" + types.join(";\n") + ";\n```" : "") +
    "\n\n{/* public-api:end */}";
  const docs = path.join(libDirectory, "docs", `${name}.${kind}.docs.mdx`);
  const current = fs.readFileSync(docs, "utf8");
  const startMarker = "{/* public-api:start */}",
    endMarker = "{/* public-api:end */}";
  let next = current.includes(startMarker)
    ? current.slice(0, current.indexOf(startMarker)) +
      section +
      current.slice(current.indexOf(endMarker) + endMarker.length)
    : current
        .replace("<ArgTypes of={Stories} />", section)
        .replace("Meta, Canvas, ArgTypes", "Meta, Canvas");
  next = await format(next, { ...(await resolveConfig(docs)), filepath: docs });
  if (current !== next) {
    if (write) fs.writeFileSync(docs, next);
    else
      throw new Error(
        `Public API documentation is stale: ${docs}. Run node tools/atom-docs.mjs --write.`,
      );
  }
}
console.log(
  "Atom API documentation matches public TypeScript signal inputs and exported variants.",
);

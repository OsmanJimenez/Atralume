import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";

function run(command, args, options = {}) {
  const result = spawnSync(command, args, { stdio: "inherit", ...options });
  if (result.status !== 0)
    throw new Error(
      `${command} ${args.join(" ")} failed with exit code ${result.status}.`,
    );
}

run("npx", ["nx", "build", "angular"]);
const packageRoot = path.resolve("dist/libs/angular");
const pack = spawnSync("npm", ["pack", "--json"], {
  cwd: packageRoot,
  encoding: "utf8",
});
if (pack.status !== 0) throw new Error(pack.stderr || "npm pack failed.");
const archiveName = JSON.parse(pack.stdout)[0].filename;
const archive = path.join(packageRoot, archiveName);
const temporary = fs.mkdtempSync(path.join(os.tmpdir(), "atralume-package-"));

try {
  fs.mkdirSync(path.join(temporary, "src"));
  fs.writeFileSync(
    path.join(temporary, "package.json"),
    JSON.stringify(
      { name: "atralume-package-consumer", version: "0.0.0", private: true },
      null,
      2,
    ),
  );
  run(
    "npm",
    [
      "install",
      "--save-exact",
      archive,
      "@angular/build@22.2.1",
      "@angular/cli@22.2.1",
      "@angular/common@22.2.1",
      "@angular/compiler@22.2.1",
      "@angular/compiler-cli@22.2.1",
      "@angular/core@22.2.1",
      "@angular/platform-browser@22.2.1",
      "rxjs@7.8.2",
      "tslib@2.8.1",
      "typescript@6.0.3",
    ],
    { cwd: temporary },
  );
  fs.writeFileSync(
    path.join(temporary, "angular.json"),
    JSON.stringify({
      version: 1,
      projects: {
        consumer: {
          projectType: "application",
          root: "",
          sourceRoot: "src",
          architect: {
            build: {
              builder: "@angular/build:application",
              defaultConfiguration: "production",
              options: {
                outputPath: "dist",
                browser: "src/main.ts",
                index: "src/index.html",
                tsConfig: "tsconfig.json",
                styles: ["src/styles.scss"],
                inlineStyleLanguage: "scss",
              },
              configurations: {
                production: { outputHashing: "all" },
              },
            },
          },
        },
      },
    }),
  );
  fs.writeFileSync(
    path.join(temporary, "tsconfig.json"),
    JSON.stringify({
      compilerOptions: {
        strict: true,
        target: "ES2022",
        module: "preserve",
        moduleResolution: "bundler",
        experimentalDecorators: true,
        importHelpers: true,
        skipLibCheck: true,
      },
      angularCompilerOptions: { strictTemplates: true },
      files: ["src/main.ts"],
    }),
  );
  fs.writeFileSync(
    path.join(temporary, "src/index.html"),
    '<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Consumer</title></head><body><consumer-root></consumer-root></body></html>',
  );
  fs.writeFileSync(
    path.join(temporary, "src/styles.scss"),
    "@use '@atralume/angular/styles/theme.css';",
  );
  fs.writeFileSync(
    path.join(temporary, "src/main.ts"),
    `import { Component } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { AtralumeButton } from '@atralume/angular/button';
@Component({ selector: 'consumer-root', imports: [AtralumeButton], template: '<button atrButton type="button">Packed</button>' })
class ConsumerRoot {}
bootstrapApplication(ConsumerRoot);
`,
  );
  run("npx", ["ng", "build", "consumer", "--configuration=production"], {
    cwd: temporary,
  });
  console.log("Package check passed in an isolated Angular consumer.");
} finally {
  fs.rmSync(temporary, { recursive: true, force: true });
  fs.rmSync(archive, { force: true });
}

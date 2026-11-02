import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import http from "node:http";
import assert from "node:assert/strict";
import { launchBrowser } from "./browser.mjs";
import { spawnSync } from "node:child_process";

function run(command, args, options = {}) {
  const result = npmCommand(command, args, { stdio: "inherit", ...options });
  if (result.status !== 0)
    throw new Error(
      `${command} ${args.join(" ")} failed with exit code ${result.status}.`,
    );
}

// Invoke the npm CLI through Node: .cmd shims cannot be spawned directly on Windows.
function npmCommand(command, args, options) {
  if (process.platform !== "win32") return spawnSync(command, args, options);
  const cli = path.join(
    path.dirname(process.execPath),
    "node_modules/npm/bin/npm-cli.js",
  );
  return spawnSync(
    process.execPath,
    [cli, ...(command === "npx" ? ["exec", "--"] : []), ...args],
    options,
  );
}

run("npx", ["nx", "build", "angular"]);
const packageRoot = path.resolve("dist/libs/angular");
const temporaryRoot = path.join(os.tmpdir(), "atralume-package-check");
fs.mkdirSync(temporaryRoot, { recursive: true });
const pack = npmCommand("npm", ["pack", "--json"], {
  cwd: packageRoot,
  encoding: "utf8",
});
if (pack.status !== 0) throw new Error(pack.stderr || "npm pack failed.");
const packResult = JSON.parse(pack.stdout)[0];
const packagedFiles = new Set(packResult.files.map((file) => file.path));
if ([...packagedFiles].some((file) => file.endsWith(".map")))
  throw new Error("Tarball must not include source maps.");
for (const forbidden of ["stories", "tests", "docs", ".mdx", "tools/"]) {
  if ([...packagedFiles].some((file) => file.includes(forbidden)))
    throw new Error(
      `Tarball contains workspace-only content matching ${forbidden}.`,
    );
}
const phase3Entries = [
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
];
const advancedEntries = [
  "listbox",
  "combobox",
  "select",
  "autocomplete",
  "popover",
  "command-palette",
];
const publishedEntries = fs
  .readdirSync(path.resolve("libs/angular"), { withFileTypes: true })
  .filter(
    (entry) =>
      entry.isDirectory() &&
      fs.existsSync(
        path.resolve("libs/angular", entry.name, "ng-package.json"),
      ),
  )
  .map((entry) => entry.name);
for (const entry of new Set([
  ...phase3Entries,
  ...advancedEntries,
  ...publishedEntries,
])) {
  if (!packagedFiles.has(`fesm2022/atralume-angular-${entry}.mjs`))
    throw new Error(`Missing phase 3 entrypoint ${entry}`);
}
for (const required of [
  "styles/theme.css",
  "styles/index.scss",
  "styles/generated/token-manifest.json",
  "fesm2022/atralume-angular-button.mjs",
  ...[
    "form-field",
    "input",
    "textarea",
    "checkbox",
    "radio",
    "switch",
    "icon",
    "icon-button",
    "link",
    "badge",
    "avatar",
    "divider",
    "progress",
  ].map((name) => `fesm2022/atralume-angular-${name}.mjs`),
]) {
  if (!packagedFiles.has(required))
    throw new Error(`Tarball is missing ${required}.`);
}
const themeCss = fs.readFileSync(
  path.join(packageRoot, "styles/theme.css"),
  "utf8",
);
for (const contract of [
  "--atr-sys-color-primary",
  "--atr-comp-button-container-color",
  '[data-atr-theme="dark"]',
  '[data-atr-theme="system"]',
  "prefers-color-scheme: dark",
]) {
  if (!themeCss.includes(contract))
    throw new Error(`Public theme stylesheet is missing ${contract}.`);
}
const archiveName = packResult.filename;
const archive = path.join(packageRoot, archiveName);
const temporary = fs.mkdtempSync(path.join(temporaryRoot, "consumer-"));

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
      "@angular/forms@22.2.1",
      "@angular/cdk@22.2.1",
      "@angular/platform-browser@22.2.1",
      "@angular/platform-server@22.2.1",
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
    `import { Component, inject, DestroyRef, ViewContainerRef, TemplateRef } from '@angular/core';
import { AtralumeListbox } from '@atralume/angular/listbox';
import { AtralumeCombobox } from '@atralume/angular/combobox';
import { AtralumeSelect } from '@atralume/angular/select';
import { AtralumeAutocomplete } from '@atralume/angular/autocomplete';
import { AtralumePopover } from '@atralume/angular/popover';
import { AtralumeCommandPalette } from '@atralume/angular/command-palette';
import {AtralumeCard,AtralumeCardContent} from '@atralume/angular/card';
import {AtralumeChip,AtralumeChipSet} from '@atralume/angular/chip';
import {AtralumeList,AtralumeListItem} from '@atralume/angular/list';
import {AtralumeAccordion,AtralumeAccordionItem,AtralumeAccordionHeader} from '@atralume/angular/accordion';
import {AtralumeSkeleton} from '@atralume/angular/skeleton';
import {AtralumeTooltip} from '@atralume/angular/tooltip';
import {AtralumeMenu,AtralumeMenuTrigger,AtralumeMenuItem} from '@atralume/angular/menu';
import {AtralumeDialog,AtralumeDialogClose} from '@atralume/angular/dialog';
import {AtralumeBottomSheet,AtralumeBottomSheetClose} from '@atralume/angular/bottom-sheet';
import {AtralumeSnackbar} from '@atralume/angular/snackbar';
import {AtralumeTabs,AtralumeTabList,AtralumeTab,AtralumeTabPanel} from '@atralume/angular/tabs';
import {AtralumeBreadcrumbs,AtralumeBreadcrumbItem,AtralumeBreadcrumbSeparator} from '@atralume/angular/breadcrumbs';
import {AtralumePagination} from '@atralume/angular/pagination';
import {AtralumeNavigationBar,AtralumeNavigationItem} from '@atralume/angular/navigation-bar';
import {AtralumeSideNavigationContainer,AtralumeSideNavigation,AtralumeSideNavigationContent,AtralumeSideNavigationItem} from '@atralume/angular/side-navigation';
import {AtralumeFab} from '@atralume/angular/fab';
import {AtralumeSpeedDial,AtralumeSpeedDialAction} from '@atralume/angular/speed-dial';
import { bootstrapApplication } from '@angular/platform-browser';
import { AtralumeButton } from '@atralume/angular/button';
import { AtralumeIcon, provideAtralumeIcons, checkIcon } from '@atralume/angular/icon';
import { AtralumeIconButton } from '@atralume/angular/icon-button';
import { AtralumeLink } from '@atralume/angular/link';
import { AtralumeBadge } from '@atralume/angular/badge';
import { AtralumeAvatar } from '@atralume/angular/avatar';
import { AtralumeDivider } from '@atralume/angular/divider';
import { AtralumeProgressSpinner, AtralumeProgressBar } from '@atralume/angular/progress';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { AtralumeFormField, AtralumeControlLabel } from '@atralume/angular/form-field';
import { AtralumeInput } from '@atralume/angular/input';
import { AtralumeTextarea } from '@atralume/angular/textarea';
import { AtralumeCheckbox } from '@atralume/angular/checkbox';
import { AtralumeRadio } from '@atralume/angular/radio';
import { AtralumeSwitch } from '@atralume/angular/switch';
@Component({ selector: 'consumer-root', providers:[provideAtralumeIcons([checkIcon])], imports: [AtralumeListbox,AtralumeCombobox,AtralumeSelect,AtralumeAutocomplete,AtralumePopover,AtralumeCommandPalette,AtralumeCard,AtralumeCardContent,AtralumeChip,AtralumeChipSet,AtralumeList,AtralumeListItem,AtralumeAccordion,AtralumeAccordionItem,AtralumeAccordionHeader,AtralumeSkeleton,AtralumeTooltip,AtralumeMenu,AtralumeMenuTrigger,AtralumeMenuItem,AtralumeDialogClose,AtralumeBottomSheetClose,AtralumeTabs,AtralumeTabList,AtralumeTab,AtralumeTabPanel,AtralumeBreadcrumbs,AtralumeBreadcrumbItem,AtralumeBreadcrumbSeparator,AtralumePagination,AtralumeNavigationBar,AtralumeNavigationItem,AtralumeSideNavigationContainer,AtralumeSideNavigation,AtralumeSideNavigationContent,AtralumeSideNavigationItem,AtralumeFab,AtralumeSpeedDial,AtralumeSpeedDialAction,AtralumeIcon, AtralumeIconButton, AtralumeLink, AtralumeBadge, AtralumeAvatar, AtralumeDivider, AtralumeProgressSpinner, AtralumeProgressBar, AtralumeButton, ReactiveFormsModule, AtralumeFormField, AtralumeControlLabel, AtralumeInput, AtralumeTextarea, AtralumeCheckbox, AtralumeRadio, AtralumeSwitch], template: '<atr-form-field label="Email" hint="Packed hint"><input atrInput type="email" [formControl]="email" /></atr-form-field><atr-form-field label="Notes"><textarea atrTextarea></textarea></atr-form-field><label atrControlLabel><input atrCheckbox type="checkbox" [formControl]="accepted" />Accept terms</label><fieldset><legend>Plan</legend><label atrControlLabel><input atrRadio type="radio" name="plan" value="personal" [formControl]="plan" />Personal</label><label atrControlLabel><input atrRadio type="radio" name="plan" value="business" [formControl]="plan" />Business</label></fieldset><label atrControlLabel><input atrSwitch type="checkbox" [formControl]="notifications" />Notifications</label><button atrButton type="button"><atr-icon name="check" />Packed</button><button atrIconButton type="button" aria-label="Save"><atr-icon name="check" /></button><a atrLink href="#docs">Packed docs</a><atr-badge tone="success">Packed active</atr-badge><atr-avatar name="Packed User" alt="Packed User" /><hr atrDivider /><atr-progress-spinner label="Packed spinner" [value]="50" /><atr-progress-bar label="Packed progress" [value]="65" /><section data-atr-theme="dark" data-atr-surface="standard" style="--atr-comp-dialog-shape:1.5rem;padding:1rem"><atr-card><div atrCardContent>Packed composition</div></atr-card><atr-listbox label="Packed listbox" [options]=\\'[{id:"alpha",label:"Packed Alpha",value:"a"},{id:"beta",label:"Packed Beta",value:"b"}]\\' /><atr-select label="Packed select" [options]=\\'[{id:"alpha",label:"Packed Alpha",value:"a"},{id:"beta",label:"Packed Beta",value:"b"}]\\' /><atr-autocomplete label="Packed search" [options]=\\'[{id:"alpha",label:"Packed Alpha",value:"a"},{id:"beta",label:"Packed Beta",value:"b"}]\\' /><atr-combobox label="Packed combo" [options]=\\'[{id:"alpha",label:"Packed Alpha",value:"a"},{id:"beta",label:"Packed Beta",value:"b"}]\\' /><atr-command-palette /><atr-chip-set label="Packed filters"><atr-chip kind="filter" label="Angular" value="angular" /></atr-chip-set><ul atrList><li atrListItem>Packed list</li></ul><atr-accordion><atr-accordion-item id="packed-disclosure"><span atrAccordionHeader>Packed disclosure</span><p>Expanded content</p></atr-accordion-item></atr-accordion><section aria-busy="true"><atr-skeleton /></section><button type="button" atrTooltip="Packed help" tooltipId="packed-tooltip" [showDelay]="0">Packed tooltip trigger</button><button type="button" [atrMenuTriggerFor]="commands">Packed commands</button><ng-template #commands><div atrMenu aria-label="Packed commands"><button atrMenuItem>Execute</button></div></ng-template><button type="button" (click)="openDialog(dialogContent,$event)">Open packed dialog</button><ng-template #dialogContent><h2 id="packed-dialog-heading">Packed dialog</h2><button type="button" atrDialogClose>Close packed dialog</button></ng-template><button type="button" (click)="openSheet(sheetContent,$event)">Open packed sheet</button><ng-template #sheetContent><h2>Packed sheet</h2><button type="button" atrBottomSheetClose>Close packed sheet</button></ng-template><button type="button" (click)="notify($event)">Packed notification</button><atr-tabs label="Packed tabs"><div atrTabList><button atrTab type="button" id="packed-tab-a" panel="packed-panel-a">One</button><button atrTab type="button" id="packed-tab-b" panel="packed-panel-b">Two</button></div><section atrTabPanel id="packed-panel-a" labelledBy="packed-tab-a">Panel one</section><section atrTabPanel id="packed-panel-b" labelledBy="packed-tab-b">Panel two</section></atr-tabs><nav atrBreadcrumbs><ol><li><a atrBreadcrumbItem href="#root">Root</a><span atrBreadcrumbSeparator>/</span></li><li><span atrBreadcrumbItem current>Packed current</span></li></ol></nav><atr-pagination [pageCount]="10" /><nav atrNavigationBar><a atrNavigationItem href="#home" active>Home</a><a atrNavigationItem href="#work">Work</a><a atrNavigationItem href="#profile">Profile</a></nav><atr-side-navigation-container><atr-side-navigation panelId="packed-navigation" label="Packed navigation"><a atrSideNavigationItem href="#profile" active>Profile</a></atr-side-navigation><main atrSideNavigationContent>App content</main></atr-side-navigation-container><button atrFab type="button" aria-label="Packed create">+</button><atr-speed-dial id="packed-dial" label="Packed actions"><button atrSpeedDialAction type="button">Create document</button></atr-speed-dial></section>' })
class ConsumerRoot { private readonly dialog=inject(AtralumeDialog);private readonly sheet=inject(AtralumeBottomSheet);private readonly snackbar=inject(AtralumeSnackbar);private readonly owner=inject(DestroyRef);private readonly views=inject(ViewContainerRef);
openDialog(template:TemplateRef<unknown>,event:Event):void{this.dialog.open(template,{labelledBy:'packed-dialog-heading',origin:event.currentTarget as HTMLElement,owner:this.owner,viewContainerRef:this.views});}
openSheet(template:TemplateRef<unknown>,event:Event):void{this.sheet.open(template,{label:'Packed sheet',origin:event.currentTarget as HTMLElement,owner:this.owner,viewContainerRef:this.views});}
notify(event:Event):void{this.snackbar.open({message:'Packed notification saved',action:'Undo packed',duration:0,origin:event.currentTarget as HTMLElement,owner:this.owner});}
 readonly email = new FormControl('packed@example.com', {nonNullable:true}); readonly accepted = new FormControl(false, {nonNullable:true}); readonly plan = new FormControl('personal', {nonNullable:true}); readonly notifications = new FormControl(false, {nonNullable:true}); }
bootstrapApplication(ConsumerRoot);
`,
  );
  run("npx", ["ng", "build", "consumer", "--configuration=production"], {
    cwd: temporary,
  });
  const output = path.join(temporary, "dist/browser");
  const server = http.createServer((request, response) => {
    if (request.url === "/favicon.ico") return response.writeHead(204).end();
    const file = path.resolve(
      output,
      decodeURIComponent(
        new URL(request.url, "http://localhost").pathname,
      ).slice(1) || "index.html",
    );
    if (!file.startsWith(output + path.sep) || !fs.existsSync(file))
      return response.writeHead(404).end();
    response.setHeader(
      "content-type",
      { ".js": "text/javascript", ".html": "text/html", ".css": "text/css" }[
        path.extname(file)
      ] || "application/octet-stream",
    );
    fs.createReadStream(file).pipe(response);
  });
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  let browser;
  try {
    browser = await launchBrowser();
    const page = await browser.newPage();
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto(`http://127.0.0.1:${server.address().port}`);
    const email = page.getByLabel("Email");
    await email.waitFor();
    assert.equal(await email.inputValue(), "packed@example.com");
    await email.fill("external@example.com");
    assert.equal(
      await email.getAttribute("aria-describedby"),
      await page.getByText("Packed hint").getAttribute("id"),
    );
    assert.equal(
      await email.evaluate((el) => getComputedStyle(el).borderStyle),
      "solid",
    );
    await page.getByLabel("Accept terms").check();
    assert.equal(await page.getByLabel("Accept terms").isChecked(), true);
    await page.getByLabel("Business").check();
    assert.equal(await page.getByLabel("Personal").isChecked(), false);
    await page.getByRole("switch").check();
    assert.equal(await page.getByRole("switch").isChecked(), true);
    assert.equal(await page.locator('atr-icon[name="check"] path').count(), 2);
    assert.equal(
      await page
        .locator('atr-accordion-item atr-icon[name="chevron-down"] path')
        .count(),
      1,
    );
    assert.equal(
      await page
        .getByRole("link", { name: "Packed docs" })
        .getAttribute("href"),
      "#docs",
    );
    assert.equal(
      await page.getByRole("img", { name: "Packed User" }).innerText(),
      "PU",
    );
    assert.equal(
      await page
        .getByRole("progressbar", { name: "Packed progress" })
        .getAttribute("aria-valuenow"),
      "65",
    );
    assert.equal(
      await page
        .getByRole("button", { name: "Save" })
        .evaluate((el) => getComputedStyle(el).minHeight),
      "48px",
    );

    await page.getByRole("button", { name: "Angular", exact: true }).click();
    await page.locator('atr-chip[data-selected="true"]').waitFor();
    assert.equal(
      await page
        .getByRole("button", { name: "Angular", exact: true })
        .getAttribute("aria-pressed"),
      "true",
    );
    await page
      .getByRole("button", { name: "Packed disclosure", exact: true })
      .click();
    await page
      .locator(
        'button[aria-controls="packed-disclosure-panel"][aria-expanded="true"]',
      )
      .waitFor();
    assert.equal(
      await page
        .getByRole("button", { name: "Packed disclosure", exact: true })
        .getAttribute("aria-expanded"),
      "true",
    );
    await page.getByRole("tab", { name: "One", exact: true }).focus();
    await page.keyboard.press("ArrowRight");
    await page.locator('#packed-tab-b[aria-selected="true"]').waitFor();
    assert.equal(
      await page
        .getByRole("tab", { name: "Two", exact: true })
        .getAttribute("aria-selected"),
      "true",
    );
    await page
      .getByRole("button", { name: "Packed commands", exact: true })
      .click();
    await page.getByRole("menu", { name: "Packed commands" }).waitFor();
    await page.keyboard.press("Escape");
    await page.getByRole("button", { name: "Open packed dialog" }).click();
    const dialog = page.getByRole("dialog", { name: "Packed dialog" });
    await dialog.waitFor();
    assert.equal(
      await dialog.locator("..").getAttribute("data-atr-theme"),
      "dark",
    );
    assert.equal(
      await dialog
        .locator("..")
        .evaluate((el) => getComputedStyle(el).borderRadius),
      "24px",
    );
    await page.keyboard.press("Escape");
    await dialog.waitFor({ state: "detached" });
    await page.getByRole("button", { name: "Open packed sheet" }).click();
    await page.getByRole("dialog", { name: "Packed sheet" }).waitFor();
    await page.getByRole("button", { name: "Close packed sheet" }).click();
    await page
      .getByRole("button", { name: "Packed notification", exact: true })
      .click();
    await page
      .getByText("Packed notification saved", { exact: true })
      .waitFor();
    await page.getByRole("button", { name: "Undo packed" }).click();
    await page
      .getByRole("button", { name: "Packed actions", exact: true })
      .click();
    await page.getByRole("button", { name: "Create document" }).waitFor();
    assert.equal(
      await page.getByRole("button", { name: "Create document" }).isVisible(),
      true,
    );
    const packedSelect = page.getByRole("combobox", {
      name: "Packed select",
      exact: true,
    });
    await packedSelect.click();
    await page
      .locator(".atr-combobox-panel")
      .getByRole("option", { name: "Packed Alpha", exact: true })
      .click();
    await packedSelect.getByText("Packed Alpha", { exact: true }).waitFor();
    assert.ok((await packedSelect.innerText()).includes("Packed Alpha"));
    const packedSearch = page.getByRole("combobox", {
      name: "Packed search",
      exact: true,
    });
    await packedSearch.fill("Beta");
    await page.keyboard.press("ArrowDown");
    await page
      .locator(".atr-combobox-panel")
      .getByRole("option", { name: "Packed Beta", exact: true })
      .waitFor();
    await page.keyboard.press("Enter");
    await page.waitForFunction(() => {
      const field = document.querySelector(
        'input[aria-label="Packed search"]',
      );
      return field instanceof HTMLInputElement && field.value === "Packed Beta";
    });
    assert.equal(await packedSearch.inputValue(), "Packed Beta");
    assert.deepEqual(errors, []);
  } finally {
    await browser?.close();
    await new Promise((resolve) => server.close(resolve));
  }
  for (const file of fs
    .readdirSync(path.join(packageRoot, "fesm2022"))
    .filter((file) => file.endsWith(".mjs"))) {
    assert.doesNotMatch(
      fs.readFileSync(path.join(packageRoot, "fesm2022", file), "utf8"),
      /from\s+["'][^"']*(?:libs\/angular|src\/lib)/,
    );
  }
  // Exercise the packed partial-compiled components against Angular's server renderer.
  fs.writeFileSync(
    path.join(temporary, "src/ssr.mjs"),
    `
import '@angular/compiler';
import assert from 'node:assert/strict';
import { Component, inject } from '@angular/core';
import { AtralumeListbox } from '@atralume/angular/listbox';
import { AtralumeCombobox } from '@atralume/angular/combobox';
import { AtralumeSelect } from '@atralume/angular/select';
import { AtralumeAutocomplete } from '@atralume/angular/autocomplete';
import { AtralumePopover } from '@atralume/angular/popover';
import { AtralumeCommandPalette } from '@atralume/angular/command-palette';
import {AtralumeCard,AtralumeCardContent} from '@atralume/angular/card';
import {AtralumeChip,AtralumeChipSet} from '@atralume/angular/chip';
import {AtralumeList,AtralumeListItem} from '@atralume/angular/list';
import {AtralumeAccordion,AtralumeAccordionItem,AtralumeAccordionHeader} from '@atralume/angular/accordion';
import {AtralumeSkeleton} from '@atralume/angular/skeleton';
import {AtralumeTooltip} from '@atralume/angular/tooltip';
import {AtralumeMenu,AtralumeMenuTrigger,AtralumeMenuItem} from '@atralume/angular/menu';
import {AtralumeDialog,AtralumeDialogClose} from '@atralume/angular/dialog';
import {AtralumeBottomSheet,AtralumeBottomSheetClose} from '@atralume/angular/bottom-sheet';
import {AtralumeSnackbar} from '@atralume/angular/snackbar';
import {AtralumeTabs,AtralumeTabList,AtralumeTab,AtralumeTabPanel} from '@atralume/angular/tabs';
import {AtralumeBreadcrumbs,AtralumeBreadcrumbItem,AtralumeBreadcrumbSeparator} from '@atralume/angular/breadcrumbs';
import {AtralumePagination} from '@atralume/angular/pagination';
import {AtralumeNavigationBar,AtralumeNavigationItem} from '@atralume/angular/navigation-bar';
import {AtralumeSideNavigationContainer,AtralumeSideNavigation,AtralumeSideNavigationContent,AtralumeSideNavigationItem} from '@atralume/angular/side-navigation';
import {AtralumeFab} from '@atralume/angular/fab';
import {AtralumeSpeedDial,AtralumeSpeedDialAction} from '@atralume/angular/speed-dial';
import { bootstrapApplication } from '@angular/platform-browser';
import { renderApplication } from '@angular/platform-server';
import { AtralumeButton } from '@atralume/angular/button';
import { AtralumeIcon, provideAtralumeIcons, checkIcon } from '@atralume/angular/icon';
import { AtralumeIconButton } from '@atralume/angular/icon-button';
import { AtralumeLink } from '@atralume/angular/link';
import { AtralumeBadge } from '@atralume/angular/badge';
import { AtralumeAvatar } from '@atralume/angular/avatar';
import { AtralumeDivider } from '@atralume/angular/divider';
import { AtralumeProgressSpinner, AtralumeProgressBar } from '@atralume/angular/progress';
class EmptyContent {}
Component({selector:'empty-server',standalone:true,template:'Server-safe service content'})(EmptyContent);
class ServerRoot {constructor(){inject(AtralumeDialog).open(EmptyContent,{label:'Server dialog'});inject(AtralumeBottomSheet).open(EmptyContent,{label:'Server sheet'});inject(AtralumeSnackbar).open({message:'Server feedback'});}}
Component({selector:'ssr-root',standalone:true,imports:[AtralumeListbox,AtralumeCombobox,AtralumeSelect,AtralumeAutocomplete,AtralumePopover,AtralumeCommandPalette,AtralumeCard,AtralumeCardContent,AtralumeChip,AtralumeChipSet,AtralumeList,AtralumeListItem,AtralumeAccordion,AtralumeAccordionItem,AtralumeAccordionHeader,AtralumeSkeleton,AtralumeTooltip,AtralumeMenu,AtralumeMenuTrigger,AtralumeMenuItem,AtralumeDialogClose,AtralumeBottomSheetClose,AtralumeTabs,AtralumeTabList,AtralumeTab,AtralumeTabPanel,AtralumeBreadcrumbs,AtralumeBreadcrumbItem,AtralumeBreadcrumbSeparator,AtralumePagination,AtralumeNavigationBar,AtralumeNavigationItem,AtralumeSideNavigationContainer,AtralumeSideNavigation,AtralumeSideNavigationContent,AtralumeSideNavigationItem,AtralumeFab,AtralumeSpeedDial,AtralumeSpeedDialAction,AtralumeButton,AtralumeIcon,AtralumeIconButton,AtralumeLink,AtralumeBadge,AtralumeAvatar,AtralumeDivider,AtralumeProgressSpinner,AtralumeProgressBar],template:'<button atrButton [loading]="true">Save</button><atr-icon name="check" /><button atrIconButton aria-label="Close">x</button><a atrLink href="/docs">Docs</a><atr-badge>Active</atr-badge><atr-avatar name="Server User" alt="Server User" /><hr atrDivider /><atr-progress-spinner label="Server spinner" /><atr-progress-bar label="Server progress" [value]="65" /><section data-atr-theme="dark" data-atr-surface="standard" style="--atr-comp-dialog-shape:1.5rem;padding:1rem"><atr-card><div atrCardContent>Packed composition</div></atr-card><atr-listbox label="Packed listbox" [options]=\\'[{id:"alpha",label:"Packed Alpha",value:"a"},{id:"beta",label:"Packed Beta",value:"b"}]\\' /><atr-select label="Packed select" [options]=\\'[{id:"alpha",label:"Packed Alpha",value:"a"},{id:"beta",label:"Packed Beta",value:"b"}]\\' /><atr-autocomplete label="Packed search" [options]=\\'[{id:"alpha",label:"Packed Alpha",value:"a"},{id:"beta",label:"Packed Beta",value:"b"}]\\' /><atr-combobox label="Packed combo" [options]=\\'[{id:"alpha",label:"Packed Alpha",value:"a"},{id:"beta",label:"Packed Beta",value:"b"}]\\' /><atr-command-palette /><atr-chip-set label="Packed filters"><atr-chip kind="filter" label="Angular" value="angular" /></atr-chip-set><ul atrList><li atrListItem>Packed list</li></ul><atr-accordion><atr-accordion-item id="packed-disclosure"><span atrAccordionHeader>Packed disclosure</span><p>Expanded content</p></atr-accordion-item></atr-accordion><section aria-busy="true"><atr-skeleton /></section><button type="button" atrTooltip="Packed help" tooltipId="packed-tooltip" [showDelay]="0">Packed tooltip trigger</button><button type="button" [atrMenuTriggerFor]="commands">Packed commands</button><ng-template #commands><div atrMenu aria-label="Packed commands"><button atrMenuItem>Execute</button></div></ng-template><button type="button" (click)="openDialog(dialogContent,$event)">Open packed dialog</button><ng-template #dialogContent><h2 id="packed-dialog-heading">Packed dialog</h2><button type="button" atrDialogClose>Close packed dialog</button></ng-template><button type="button" (click)="openSheet(sheetContent,$event)">Open packed sheet</button><ng-template #sheetContent><h2>Packed sheet</h2><button type="button" atrBottomSheetClose>Close packed sheet</button></ng-template><button type="button" (click)="notify($event)">Packed notification</button><atr-tabs label="Packed tabs"><div atrTabList><button atrTab type="button" id="packed-tab-a" panel="packed-panel-a">One</button><button atrTab type="button" id="packed-tab-b" panel="packed-panel-b">Two</button></div><section atrTabPanel id="packed-panel-a" labelledBy="packed-tab-a">Panel one</section><section atrTabPanel id="packed-panel-b" labelledBy="packed-tab-b">Panel two</section></atr-tabs><nav atrBreadcrumbs><ol><li><a atrBreadcrumbItem href="#root">Root</a><span atrBreadcrumbSeparator>/</span></li><li><span atrBreadcrumbItem current>Packed current</span></li></ol></nav><atr-pagination [pageCount]="10" /><nav atrNavigationBar><a atrNavigationItem href="#home" active>Home</a><a atrNavigationItem href="#work">Work</a><a atrNavigationItem href="#profile">Profile</a></nav><atr-side-navigation-container><atr-side-navigation panelId="packed-navigation" label="Packed navigation"><a atrSideNavigationItem href="#profile" active>Profile</a></atr-side-navigation><main atrSideNavigationContent>App content</main></atr-side-navigation-container><button atrFab type="button" aria-label="Packed create">+</button><atr-speed-dial id="packed-dial" label="Packed actions"><button atrSpeedDialAction type="button">Create document</button></atr-speed-dial></section>'})(ServerRoot);
const html=await renderApplication((context)=>bootstrapApplication(ServerRoot,{providers:[provideAtralumeIcons([checkIcon])]},context),{document:'<html><head></head><body><ssr-root></ssr-root></body></html>',url:'http://localhost/',allowedHosts:['localhost']});
assert.ok(html.includes('aria-busy="true"'));
assert.ok(html.includes('aria-valuenow="65"'));
assert.ok(html.includes('Server User'));
assert.ok(html.includes('stroke="currentColor"'));
assert.ok(html.includes('M5 12l4 4L19 6'));
assert.ok(html.includes('Packed composition'));assert.ok(html.includes('packed-tab-a'));assert.ok(html.includes('aria-current="page"'));
console.log('Packed atoms and all phase 3 families SSR passed without browser globals.');
`,
  );
  const ssr = spawnSync(
    process.execPath,
    [path.join(temporary, "src/ssr.mjs")],
    { cwd: temporary, stdio: "inherit" },
  );
  assert.equal(ssr.status, 0, "Packed atoms must render on the server");
  const packedManifest = JSON.parse(
    fs.readFileSync(path.join(packageRoot, "package.json"), "utf8"),
  );
  for (const entry of [
    ...phase3Entries,
    "button",
    "icon",
    "icon-button",
    "link",
    "badge",
    "avatar",
    "divider",
    "progress",
  ]) {
    const exported = packedManifest.exports["./" + entry];
    assert.ok(exported?.types, entry + " typings");
    assert.ok(
      packagedFiles.has(exported.types.replace(/^\.\//, "")),
      entry + " packaged typings",
    );
  }
  assert.doesNotMatch(
    JSON.stringify(packedManifest.dependencies ?? {}),
    /@angular\/material|storybook/,
  );
  const productionCode = fs
    .readdirSync(output)
    .filter((file) => file.endsWith(".js"))
    .map((file) => fs.readFileSync(path.join(output, file), "utf8"))
    .join("\n");
  assert.ok(
    !productionCode.includes("M12 9v4m0 3v1M12 3 2 21h20L12 3"),
    "unused warning icon must be tree-shaken",
  );
  console.log(
    "Package check passed: " +
      archiveName +
      "; external production consumer " +
      temporary +
      "; all atom entrypoints, typings, CSS, registered icons, tree shaking and runtime checks.",
  );
} finally {
  if (
    !path.resolve(temporary).startsWith(path.resolve(temporaryRoot) + path.sep)
  )
    throw new Error("Unsafe temporary consumer cleanup path.");
  fs.rmSync(temporary, { recursive: true, force: true });
  // Keep the validated archive available for review and manual installation.
}

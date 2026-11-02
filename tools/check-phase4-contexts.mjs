import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import http from "node:http";
import { launchBrowser } from "./browser.mjs";
const root = path.resolve("dist/storybook/angular");
const server = http.createServer((request, response) => {
  if (request.url === "/favicon.ico") return response.writeHead(204).end();
  const file = path.resolve(
    root,
    decodeURIComponent(new URL(request.url, "http://localhost").pathname).slice(
      1,
    ) || "index.html",
  );
  if (
    !file.startsWith(root + path.sep) ||
    !fs.existsSync(file) ||
    fs.statSync(file).isDirectory()
  )
    return response.writeHead(404).end();
  response.setHeader(
    "content-type",
    {
      ".html": "text/html",
      ".js": "text/javascript",
      ".css": "text/css",
      ".json": "application/json",
    }[path.extname(file)] || "application/octet-stream",
  );
  fs.createReadStream(file).pipe(response);
});
await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
const base = `http://127.0.0.1:${server.address().port}`;
let browser;
try {
  browser = await launchBrowser();
  const page = await browser.newPage();
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  const index = JSON.parse(
    fs.readFileSync(path.join(root, "index.json"), "utf8"),
  );
  const primary = [
    "Advanced Forms/Listbox",
    "Advanced Forms/Combobox",
    "Advanced Forms/Select",
    "Advanced Forms/Autocomplete",
    "Overlays/Popover",
    "Overlays/Command Palette",
  ];
  for (const title of primary) {
    const matches = Object.values(index.entries).filter(
      (entry) => entry.type === "docs" && entry.title === title,
    );
    assert.equal(matches.length, 1, title + " single Docs");
    assert.equal(matches[0].name, "Docs");
  }
  const docs = Object.values(index.entries).filter(
    (entry) => entry.type === "docs" && primary.includes(entry.title),
  );
  for (const doc of docs) {
    await page.goto(`${base}/iframe.html?id=${doc.id}&viewMode=docs`);
    await page.locator(".sbdocs-content h1").first().waitFor();
    assert.equal(
      await page.locator(".sb-errordisplay").isVisible(),
      false,
      doc.id + " editorial render",
    );
  }
  const story = async (id) => {
    await page.goto(`${base}/iframe.html?id=${id}&viewMode=story`);
    await page.waitForFunction(() =>
      ["finished", "errored"].includes(
        window.__STORYBOOK_PREVIEW__?.currentRender?.phase,
      ),
    );
    assert.equal(
      await page.evaluate(
        () => window.__STORYBOOK_PREVIEW__.currentRender.phase,
      ),
      "finished",
      id,
    );
  };

  await story("advanced-forms-select--default");
  const control = page.getByRole("combobox");
  await control.focus();
  await page.keyboard.press("ArrowDown");
  await page.getByRole("option", { name: "Alpha", exact: true }).waitFor();
  assert.equal(
    await control.evaluate((el) => el === document.activeElement),
    true,
    "combobox retains DOM focus",
  );
  await page.keyboard.press("End");
  await page.keyboard.press("Enter");
  await page.getByText('Value: "b"', { exact: true }).waitFor();
  await control.click();
  await page.getByRole("option", { name: "Alpha", exact: true }).waitFor();
  await page.keyboard.press("Home");
  await page.keyboard.press("Escape");
  assert.equal(
    await page.getByRole("option").count(),
    0,
    "Escape removes popup",
  );
  assert.equal(
    await page.getByText('Value: "b"', { exact: true }).isVisible(),
    true,
    "Escape preserves confirmation",
  );
  for (const [variant, theme] of [
    ["dark", "dark"],
    ["nested-theme", "light"],
    ["rtl", "light"],
    ["glass", "light"],
  ]) {
    await story("advanced-forms-select--" + variant);
    await page.getByRole("combobox").click();
    await page.getByRole("option", { name: "Alpha", exact: true }).waitFor();
    const panel = page.locator(".atr-combobox-panel");
    assert.equal(
      await panel.getAttribute("data-atr-theme"),
      theme,
      variant + " origin theme",
    );
    if (variant === "rtl") assert.equal(await panel.getAttribute("dir"), "rtl");
    if (variant === "glass") {
      assert.equal(await panel.getAttribute("data-atr-surface"), "glass");
      assert.notEqual(
        await page
          .locator(".atr-combobox-popup")
          .evaluate((el) => getComputedStyle(el).backdropFilter),
        "none",
      );
      await page.emulateMedia({ forcedColors: "active" });
      assert.equal(
        await page
          .locator(".atr-combobox-popup")
          .evaluate((el) => getComputedStyle(el).backdropFilter),
        "none",
      );
      await page.emulateMedia({ forcedColors: "none" });
    }
    await page.keyboard.press("Escape");
  }
  await story("overlays-popover--default");
  const origin = page.getByRole("button", { name: "Open details" });
  await origin.click();
  await page.getByRole("dialog", { name: "Edit details" }).waitFor();
  assert.equal(
    await page
      .getByRole("textbox", { name: "Name" })
      .evaluate((el) => el === document.activeElement),
    true,
    "popover first focus",
  );
  await page.keyboard.press("Escape");
  await page
    .getByRole("dialog", { name: "Edit details" })
    .waitFor({ state: "detached" });
  assert.equal(
    await origin.evaluate((el) => el === document.activeElement),
    true,
    "popover restores focus",
  );
  await origin.click();
  await page.getByRole("dialog", { name: "Edit details" }).waitFor();
  await page.getByText("Value: No action", { exact: true }).click();
  await page
    .getByRole("dialog", { name: "Edit details" })
    .waitFor({ state: "detached" });
  await story("overlays-command-palette--default");
  await page.getByRole("button", { name: "Open commands" }).click();
  await page.getByRole("option", { name: "Settings", exact: true }).waitFor();
  await page.getByRole("combobox").focus();
  await page.keyboard.press("ArrowDown");
  await page.keyboard.press("Enter");
  await page
    .getByRole("option", { name: "Change theme", exact: true })
    .waitFor();
  await page.keyboard.press("Enter");
  await page.getByText("Value: Change theme", { exact: true }).waitFor();
  assert.equal(
    await page.getByRole("dialog").count(),
    0,
    "leaf command closes palette",
  );
  const started = performance.now();
  await story("advanced-forms-select--large-dataset");
  console.log('Large dataset state',await page.getByRole('option').count(),await page.getByRole('combobox').getAttribute('aria-expanded'),JSON.stringify(errors));
  await page.getByRole("option").nth(999).waitFor();
  const elapsed = performance.now() - started;
  assert.equal(await page.getByRole("option").count(), 1000);
  console.log(
    "Ordinary 1,000-option story navigation+render: " +
      Math.round(elapsed) +
      " ms (local sample, includes Storybook startup).",
  );
  await page.keyboard.press("Escape");
  assert.equal(
    await page.locator(".atr-combobox-panel").count(),
    0,
    "large collection cleanup",
  );
  assert.deepEqual(errors, []);
  console.log(
    "Phase 4A contexts passed: 6 Docs, native keyboard, confirmation/Escape, focus, scoped themes, RTL, glass/forced colors, nested commands, 1,000 options and cleanup.",
  );
} finally {
  await browser?.close();
  await new Promise((resolve) => server.close(resolve));
}

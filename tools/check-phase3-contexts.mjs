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
    "Composition/Card",
    "Composition/Chip",
    "Composition/List",
    "Composition/Accordion",
    "Composition/Skeleton",
    "Overlays/Tooltip",
    "Overlays/Menu",
    "Overlays/Dialog",
    "Overlays/Bottom Sheet",
    "Feedback/Snackbar",
    "Navigation/Tabs",
    "Navigation/Breadcrumbs",
    "Navigation/Pagination",
    "Navigation/Navigation Bar",
    "Navigation/Side Navigation",
    "Actions/Floating Action Button",
    "Actions/Speed Dial",
  ];
  for (const title of primary) {
    const docs = Object.values(index.entries).filter(
      (entry) => entry.type === "docs" && entry.title === title,
    );
    assert.equal(docs.length, 1, title + " single Docs");
    assert.equal(docs[0].name, "Docs");
  }
  const docs = Object.values(index.entries).filter(
    (entry) =>
      entry.type === "docs" &&
      [
        "Composition/",
        "Overlays/",
        "Feedback/",
        "Navigation/",
        "Actions/",
      ].some((prefix) => entry.title.startsWith(prefix)),
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
  await story("overlays-dialog--keyboard");
  await page.evaluate(() => (document.body.style.minHeight = "200vh"));
  const origin = page.getByRole("button", { name: "Open dialog" });
  await origin.click();
  const dialog = page.getByRole("dialog", { name: "Edit profile" });
  await dialog.waitFor();
  await page.getByRole("textbox", { name: "Display name" }).focus();
  await page.keyboard.press("Shift+Tab");
  assert.equal(
    await page
      .getByRole("button", { name: "Save profile" })
      .evaluate((el) => el === document.activeElement),
    true,
    "backward focus trap",
  );
  await page.keyboard.press("Tab");
  assert.equal(
    await page
      .getByRole("textbox", { name: "Display name" })
      .evaluate((el) => el === document.activeElement),
    true,
    "forward focus trap",
  );
  assert.ok(
    await page.evaluate(() =>
      document.documentElement.classList.contains("cdk-global-scrollblock"),
    ),
    "modal blocks scrolling",
  );
  await page
    .locator(".atr-overlay-backdrop")
    .click({ position: { x: 2, y: 2 } });
  await dialog.waitFor({ state: "detached" });
  assert.equal(
    await origin.evaluate((el) => el === document.activeElement),
    true,
    "backdrop restores focus",
  );
  assert.equal(
    await page.locator(".atr-dialog-panel").count(),
    0,
    "no orphan dialog pane",
  );
  await story("overlays-dialog--nested-theme");
  const pane = page.locator(".atr-dialog-panel");
  assert.equal(await pane.getAttribute("data-atr-theme"), "light");
  assert.equal(await pane.getAttribute("dir"), "rtl");
  assert.equal(
    await pane.evaluate((el) => getComputedStyle(el).borderRadius),
    "24px",
    "scoped component override crosses portal",
  );
  await page.keyboard.press("Escape");
  await story("overlays-dialog--on-glass");
  assert.equal(
    await page.locator(".atr-dialog-panel").getAttribute("data-atr-surface"),
    "glass",
  );
  assert.notEqual(
    await page
      .locator(".atr-dialog-panel")
      .evaluate((el) => getComputedStyle(el).backdropFilter),
    "none",
    "overlay glass context",
  );
  await page.emulateMedia({ forcedColors: "active" });
  assert.equal(
    await page
      .locator(".atr-dialog-panel")
      .evaluate((el) => getComputedStyle(el).backdropFilter),
    "none",
    "forced colors glass fallback",
  );
  await page.keyboard.press("Escape");
  await page.emulateMedia({ forcedColors: "none" });
  await story("atralume-application-example--light");
  await page.getByRole("button", { name: "Edit profile", exact: true }).click();
  await page.getByRole("dialog", { name: "Edit profile" }).waitFor();
  await page.getByRole("button", { name: "Profile commands" }).click();
  await page.getByRole("menu", { name: "Workspace commands" }).waitFor();
  fs.writeFileSync(
    path.join(root, "phase3-accessibility-tree.txt"),
    await page.locator("body").ariaSnapshot(),
  );
  await page.keyboard.press("Escape");
  assert.equal(
    await page.getByRole("dialog", { name: "Edit profile" }).isVisible(),
    true,
    "Escape closes nested menu first",
  );
  await page.keyboard.press("Escape");
  await page
    .getByRole("dialog", { name: "Edit profile" })
    .waitFor({ state: "detached" });
  for (const theme of ["light", "dark", "glass"]) {
    await story("atralume-application-example--" + theme);
    await page.screenshot({
      path: path.join(root, `phase3-dashboard-${theme}.png`),
      fullPage: true,
    });
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await story("navigation-side-navigation--keyboard");
  await page.getByRole("button", { name: "Toggle navigation" }).click();
  await page.getByRole("dialog", { name: "Workspace" }).waitFor();
  const nav = await page
    .getByRole("dialog", { name: "Workspace" })
    .boundingBox();
  assert.ok(
    nav.x >= 0 && nav.x + nav.width <= 391,
    "mobile modal navigation stays in viewport",
  );
  await page.keyboard.press("Escape");
  await page.setViewportSize({ width: 1280, height: 900 });
  await story("atralume-application-example--light");
  await page.locator("#storybook-root").evaluate((el) => (el.style.zoom = "2"));
  assert.ok(
    await page.evaluate(
      () =>
        document.documentElement.scrollWidth <=
        document.documentElement.clientWidth,
    ),
    "dashboard reflows at 200%",
  );
  await page.emulateMedia({ reducedMotion: "reduce" });
  await story("composition-skeleton--default");
  assert.equal(
    await page
      .locator("atr-skeleton")
      .first()
      .evaluate((el) => getComputedStyle(el).animationName),
    "none",
    "reduced motion skeleton",
  );
  assert.deepEqual(errors, []);
  console.log(
    `Phase 3 contexts passed: ${docs.length} Docs; focus trap/restoration, backdrop, scroll blocking, nested overlay dismissal, scoped themes/overrides, glass/forced colors, mobile navigation, reduced motion and zoom. Accessibility tree and screenshots saved.`,
  );
} finally {
  await browser?.close();
  await new Promise((resolve) => server.close(resolve));
}

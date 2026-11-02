import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import http from "node:http";
import { launchBrowser } from "./browser.mjs";
const root = path.resolve("dist/storybook/angular");
const server = http.createServer((req, res) => {
  if (req.url === "/favicon.ico") return res.writeHead(204).end();
  const file = path.resolve(
    root,
    decodeURIComponent(new URL(req.url, "http://localhost").pathname).slice(
      1,
    ) || "index.html",
  );
  if (
    !file.startsWith(root + path.sep) ||
    !fs.existsSync(file) ||
    fs.statSync(file).isDirectory()
  )
    return res.writeHead(404).end();
  res.setHeader(
    "content-type",
    {
      ".html": "text/html",
      ".js": "text/javascript",
      ".css": "text/css",
      ".json": "application/json",
    }[path.extname(file)] || "application/octet-stream",
  );
  fs.createReadStream(file).pipe(res);
});
await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
const base = `http://127.0.0.1:${server.address().port}`;
let browser;
try {
  browser = await launchBrowser();
  const cases = [
    [
      "button",
      "playground",
      "backgroundColor",
      "--atr-comp-button-container-color",
    ],
    ["icon", "playground", "color", "--atr-comp-icon-color"],
    ["icon-button", "playground", "color", "--atr-comp-icon-button-icon-color"],
    ["link", "playground", "color", "--atr-comp-link-text-color"],
    [
      "badge",
      "playground",
      "backgroundColor",
      "--atr-comp-badge-container-color",
    ],
    [
      "avatar",
      "playground",
      "backgroundColor",
      "--atr-comp-avatar-container-color",
    ],
    ["divider", "playground", "borderTopColor", "--atr-comp-divider-color"],
    [
      "progress-spinner",
      "playground",
      "color",
      "--atr-comp-progress-indicator-color",
    ],
    [
      "progress-bar",
      "playground",
      "backgroundColor",
      "--atr-comp-progress-track-color",
    ],
    [
      "checkbox",
      "playground",
      "accentColor",
      "--atr-comp-form-field-selected-color",
      "checked:true",
    ],
    ["input", "playground", "color", "--atr-comp-form-field-text-color"],
    [
      "radio",
      "playground",
      "accentColor",
      "--atr-comp-form-field-selected-color",
    ],
    [
      "switch",
      "playground",
      "backgroundColor",
      "--atr-comp-form-field-selected-color",
      "checked:true",
    ],
    ["textarea", "playground", "color", "--atr-comp-form-field-text-color"],
  ];
  for (const [name, story, property, token, args] of cases) {
    const page = await browser.newPage();
    await page.goto(
      `${base}/iframe.html?id=atoms-${name}--${story}&viewMode=story${args ? `&args=${args}` : ""}`,
    );
    const element = page.locator(".atr-" + name).first();
    await element.waitFor();
    if (name === "switch") {
      await element.evaluate((el) => {
        el.checked = true;
      });
    }
    const values = await element.evaluate(
      (el, { property, token }) => {
        const sample = (theme) => {
          const scope = document.createElement("section");
          scope.dataset.atrTheme = theme;
          scope.dataset.atrSurface = "standard";
          const clone = el.cloneNode(true);
          scope.append(clone);
          document.querySelector("#storybook-root").append(scope);
          const style = getComputedStyle(clone);
          const result = style[property];
          scope.remove();
          return result;
        };
        const light = sample("light"),
          dark = sample("dark");
        el.style.setProperty(token, "rgb(1, 2, 3)");
        const overridden = getComputedStyle(el)[property];
        return { light, dark, overridden };
      },
      { property, token },
    );
    assert.notEqual(values.light, values.dark, name + " light/dark");
    assert.equal(
      values.overridden,
      "rgb(1, 2, 3)",
      name + " instance override",
    );
    const nested = await element.evaluate(
      (el, { property }) => {
        const outer = document.createElement("section");
        outer.dataset.atrTheme = "dark";
        outer.dataset.atrSurface = "standard";
        const inner = document.createElement("section");
        inner.dataset.atrTheme = "light";
        inner.dataset.atrSurface = "standard";
        const clone = el.cloneNode(true);
        clone.removeAttribute("style");
        inner.append(clone);
        outer.append(inner);
        document.querySelector("#storybook-root").append(outer);
        const value = getComputedStyle(clone)[property];
        outer.remove();
        return value;
      },
      { property },
    );
    assert.equal(nested, values.light, name + " nearest nested light theme");
    if (name === "icon-button") {
      const rect = await element.boundingBox();
      assert.ok(rect.width >= 48 && rect.height >= 48, "48px target");
    }
    await page.close();
  }
  const page = await browser.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  // Verify every editorial page actually renders (including ArgTypes), not only index metadata.
  for (const [name] of cases) {
    await page.goto(`${base}/iframe.html?id=atoms-${name}--docs&viewMode=docs`);
    await page.locator(".sbdocs-content h1").first().waitFor();
    assert.equal(
      await page.locator(".sb-errordisplay").isVisible(),
      false,
      name + " Docs",
    );
  }
  await page.goto(`${base}/iframe.html?id=atoms-icon--rtl&viewMode=story`);
  await page.locator("atr-icon").first().waitFor();
  assert.ok(
    (
      await page
        .locator("atr-icon svg")
        .first()
        .evaluate((el) => getComputedStyle(el).transform)
    ).includes("-1"),
    "directional RTL mirroring",
  );
  assert.equal(
    await page
      .locator("atr-icon svg")
      .nth(1)
      .evaluate((el) => getComputedStyle(el).transform),
    "none",
  );
  for (const [name, story, args] of [
    ["progress-spinner", "reduced-motion", ""],
    ["progress-bar", "reduced-motion", ""],
    ["button", "playground", "&args=loading:true"],
  ]) {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto(
      `${base}/iframe.html?id=atoms-${name}--${story}${args}&viewMode=story`,
    );
    const indicator = page.locator(
      name === "progress-spinner"
        ? "atr-progress-spinner svg"
        : name === "progress-bar"
          ? "atr-progress-bar .indicator"
          : ".atr-button__spinner svg",
    );
    await indicator.waitFor();
    assert.match(
      await indicator.evaluate((el) => getComputedStyle(el).animationName),
      /pulse/,
      "reduced motion activity",
    );
  }
  await page.emulateMedia({ forcedColors: "active" });
  await page.goto(
    `${base}/iframe.html?id=atoms-icon-button--playground&viewMode=story`,
  );
  await page.locator(".atr-icon-button").first().waitFor();
  assert.notEqual(
    await page
      .locator(".atr-icon-button")
      .first()
      .evaluate((el) => getComputedStyle(el).borderTopStyle),
    "none",
  );
  await page.emulateMedia({
    forcedColors: "none",
    reducedMotion: "no-preference",
  });
  for (const theme of ["light", "dark"]) {
    await page.goto(
      `${base}/iframe.html?id=atralume-atoms--${theme}&viewMode=story`,
    );
    await page.locator("atr-progress-bar").waitFor();
    await page.screenshot({
      path: path.join(root, `atoms-${theme}.png`),
      fullPage: true,
    });
  }
  await page.goto(
    `${base}/iframe.html?id=atoms-button--playground&viewMode=story`,
  );
  await page.locator(".atr-button").waitFor();
  await page.evaluate(() => {
    const sentinel = document.createElement("button");
    sentinel.type = "button";
    sentinel.setAttribute("aria-label", "Focus test start");
    sentinel.style.position = "fixed";
    sentinel.style.left = "-10000px";
    document.querySelector(".atr-button").before(sentinel);
    sentinel.focus();
  });
  await page.keyboard.press("Tab");
  const focus = await page.locator(".atr-button").evaluate((el) => ({
    focused: el === document.activeElement,
    focusVisible: el.matches(":focus-visible"),
    outline: getComputedStyle(el).outlineStyle,
    width: parseFloat(getComputedStyle(el).outlineWidth),
  }));
  assert.ok(
    focus.focused &&
      focus.focusVisible &&
      focus.outline !== "none" &&
      focus.width >= 2,
    `keyboard focus visible: ${JSON.stringify(focus)}`,
  );
  await page.getByRole("button", { name: "Focus test start" }).evaluate((el) =>
    el.remove(),
  );
  await page.goto(
    `${base}/iframe.html?id=atralume-atoms--light&viewMode=story`,
  );
  await page.locator("atr-progress-bar").waitFor();
  await page.locator("#storybook-root").evaluate((el) => (el.style.zoom = "2"));
  assert.ok(
    await page.evaluate(
      () =>
        document.documentElement.scrollWidth <=
        document.documentElement.clientWidth,
    ),
    "catalog reflow at 200%",
  );
  assert.deepEqual(errors, []);
  console.log(
    `Atoms contexts passed: ${cases.length} light/dark contracts and instance overrides; ${cases.length} Docs pages; RTL, 48px target, forced colors and reduced motion. Screenshots saved in Storybook output.`,
  );
} finally {
  await browser?.close();
  await new Promise((resolve) => server.close(resolve));
}

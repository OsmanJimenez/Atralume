import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { launchBrowser } from "./browser.mjs";

const root = path.resolve("dist/storybook/angular");
if (!fs.existsSync(path.join(root, "index.html")))
  throw new Error("Build Storybook before running this check.");
const mime = {
  ".css": "text/css",
  ".html": "text/html",
  ".js": "text/javascript",
  ".json": "application/json",
  ".svg": "image/svg+xml",
};
const server = http.createServer((request, response) => {
  const url = new URL(request.url, "http://127.0.0.1");
  if (!url.pathname.startsWith("/Atralume/")) {
    response.writeHead(404).end("Not found");
    return;
  }
  const relative =
    decodeURIComponent(url.pathname.slice("/Atralume/".length)) || "index.html";
  const target = path.resolve(root, relative);
  if (
    !target.startsWith(`${root}${path.sep}`) ||
    !fs.existsSync(target) ||
    fs.statSync(target).isDirectory()
  ) {
    response.writeHead(404).end("Not found");
    return;
  }
  response.writeHead(200, {
    "content-type": mime[path.extname(target)] ?? "application/octet-stream",
  });
  fs.createReadStream(target).pipe(response);
});

await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
const { port } = server.address();
const browser = await launchBrowser();
const page = await browser.newPage();
const failures = [];
page.on("pageerror", (error) =>
  failures.push(`Runtime error: ${error.message}`),
);
page.on("response", (response) => {
  if (response.status() === 404) failures.push(`404: ${response.url()}`);
});

try {
  await page.goto(
    `http://127.0.0.1:${port}/Atralume/?path=/story/atoms-button--playground`,
    { waitUntil: "networkidle" },
  );
  const iframe = page.locator("#storybook-preview-iframe");
  await iframe.waitFor({ state: "visible" });
  const story = page.frameLocator("#storybook-preview-iframe");
  const button = story.locator("button.atr-button");
  await button.waitFor({ state: "visible" });
  const background = await button.evaluate(
    (element) => getComputedStyle(element).backgroundColor,
  );
  if (background === "rgba(0, 0, 0, 0)")
    failures.push("Button stylesheet was not applied.");
  const root = story.locator("#storybook-root");
  const fonts = await root.evaluate((element) => {
    const styles = getComputedStyle(element);
    return {
      actual: styles.fontFamily,
      token: styles.getPropertyValue("--atr-ref-font-family-plain").trim(),
    };
  });
  if (fonts.actual !== fonts.token)
    failures.push("Storybook preview typography token was not applied.");
  const assertInlineControl = async (
    storyId,
    controlSelector,
    actionSelector,
    name,
  ) => {
    await page.goto(
      `http://127.0.0.1:${port}/Atralume/?path=/story/${storyId}`,
      { waitUntil: "networkidle" },
    );
    const preview = page.frameLocator("#storybook-preview-iframe");
    const control = preview.locator(controlSelector);
    const action = preview.locator(actionSelector);
    await control.waitFor({ state: "visible" });
    await action.waitFor({ state: "visible" });
    const group = preview.locator(".atr-input-group").filter({ has: control });
    if ((await group.count()) !== 1) {
      failures.push(
        `${name} field and action are not in a shared input group.`,
      );
      return;
    }
    const [controlBox, actionBox, groupStyle] = await Promise.all([
      control.boundingBox(),
      action.boundingBox(),
      group.evaluate((element) => {
        const styles = getComputedStyle(element);
        return {
          borderStyle: styles.borderTopStyle,
          borderWidth: styles.borderTopWidth,
          background: styles.backgroundColor,
        };
      }),
    ]);
    if (
      !controlBox ||
      !actionBox ||
      Math.abs(controlBox.y - actionBox.y) > 2 ||
      Math.abs(controlBox.height - actionBox.height) > 2
    ) {
      failures.push(`${name} action is not aligned within the input row.`);
    }
    if (
      groupStyle.borderStyle !== "solid" ||
      groupStyle.borderWidth === "0px" ||
      groupStyle.background === "rgba(0, 0, 0, 0)"
    ) {
      failures.push(`${name} input group styles were not applied.`);
    }
  };
  await assertInlineControl(
    "advanced-forms-date-picker--default",
    "input.atr-input",
    'button[aria-label="Open Appointment calendar"]',
    "Date Picker",
  );
  await assertInlineControl(
    "advanced-forms-time-picker--default",
    'input[type="time"]',
    'button[aria-label="Open time picker for Start time"]',
    "Time Picker",
  );
  await assertInlineControl(
    "advanced-forms-select--default",
    "button.atr-combobox-trigger",
    "button.atr-combobox-trigger",
    "Select",
  );
  await assertInlineControl(
    "advanced-forms-autocomplete--default",
    "input.atr-input",
    "input.atr-input",
    "Autocomplete",
  );
  if (failures.length) throw new Error(failures.join("\n"));
  console.log("Storybook smoke check passed under /Atralume/.");
} finally {
  await browser.close();
  await new Promise((resolve, reject) =>
    server.close((error) => (error ? reject(error) : resolve())),
  );
}

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
  if (
    response.status() === 404 &&
    !/favicon\.ico$/i.test(response.url())
  ) {
    failures.push(`404: ${response.url()}`);
  }
});

const openStory = async (storyId) => {
  await page.goto(
    `http://127.0.0.1:${port}/Atralume/?path=/story/${storyId}`,
    { waitUntil: "domcontentloaded" },
  );
  const iframe = page.locator("#storybook-preview-iframe");
  await iframe.waitFor({ state: "visible" });
  return page.frameLocator("#storybook-preview-iframe");
};

/**
 * Taiga-backed field contract: labelled tui-textfield hosting the value control.
 * Replaces the retired .atr-input-group + custom calendar/trigger button checks.
 */
const assertTaigaTextfield = async ({
  storyId,
  name,
  controlSelector,
  labelText,
  hostSelector,
}) => {
  const preview = await openStory(storyId);
  const control = preview.locator(controlSelector).first();
  await control.waitFor({ state: "visible" });
  if (hostSelector) {
    const host = preview.locator(hostSelector).first();
    await host.waitFor({ state: "attached" });
  }
  const field = preview.locator("tui-textfield").filter({ has: control }).first();
  if ((await field.count()) !== 1) {
    failures.push(`${name} value control is not hosted in tui-textfield.`);
    return null;
  }
  const label = field.locator("label").first();
  await label.waitFor({ state: "visible" });
  const actualLabel = ((await label.innerText()) || "").trim();
  if (labelText && actualLabel !== labelText) {
    failures.push(
      `${name} label was "${actualLabel}" but expected "${labelText}".`,
    );
  }
  const box = await field.boundingBox();
  if (!box || box.height < 24 || box.width < 80) {
    failures.push(`${name} textfield geometry looks collapsed.`);
  }
  const fieldStyle = await field.evaluate((element) => {
    const styles = getComputedStyle(element);
    return {
      opacity: styles.opacity,
      visibility: styles.visibility,
    };
  });
  if (fieldStyle.visibility === "hidden" || Number(fieldStyle.opacity) === 0) {
    failures.push(`${name} textfield is not visible.`);
  }
  return { preview, control, field };
};

try {
  const buttonPreview = await openStory("atoms-button--playground");
  const button = buttonPreview.locator("button.atr-button").first();
  await button.waitFor({ state: "visible" });
  const background = await button.evaluate(
    (element) => getComputedStyle(element).backgroundColor,
  );
  if (background === "rgba(0, 0, 0, 0)")
    failures.push("Button stylesheet was not applied.");
  const root = buttonPreview.locator("#storybook-root");
  const fonts = await root.evaluate((element) => {
    const styles = getComputedStyle(element);
    return {
      actual: styles.fontFamily,
      token: styles.getPropertyValue("--atr-ref-font-family-plain").trim(),
    };
  });
  if (fonts.actual !== fonts.token)
    failures.push("Storybook preview typography token was not applied.");

  const date = await assertTaigaTextfield({
    storyId: "advanced-forms-date-picker--default",
    name: "Date Picker",
    controlSelector: "input[data-atr-value-control]",
    labelText: "Appointment",
  });
  if (date) {
    await date.control.click();
    await page.waitForTimeout(400);
    const calendarOpen = await date.preview
      .locator("tui-calendar, [tuiCalendar], [role='grid']")
      .first()
      .count();
    if (!calendarOpen) {
      // Calendar may portal to the parent document outside the iframe root.
      const portaled = await page.locator("tui-calendar, [role='grid']").count();
      if (!portaled) {
        failures.push("Date Picker did not open a calendar after focusing the field.");
      }
    }
  }

  await assertTaigaTextfield({
    storyId: "advanced-forms-time-picker--default",
    name: "Time Picker",
    controlSelector: "input[data-atr-value-control], input[tuiInputTime], input",
    labelText: "Start time",
  });

  await assertTaigaTextfield({
    storyId: "advanced-forms-select--default",
    name: "Select",
    controlSelector: "input.atr-select-input[role='combobox'], input[role='combobox']",
    labelText: "Choose a tool",
    hostSelector: "atr-select",
  });

  await assertTaigaTextfield({
    storyId: "advanced-forms-autocomplete--default",
    name: "Autocomplete",
    controlSelector:
      "input.atr-combobox-input[role='combobox'], atr-autocomplete input[role='combobox']",
    labelText: "Search tools",
    hostSelector: "atr-autocomplete",
  });

  if (failures.length) throw new Error(failures.join("\n"));
  console.log("Storybook smoke check passed under /Atralume/.");
} finally {
  await browser.close();
  await new Promise((resolve, reject) =>
    server.close((error) => (error ? reject(error) : resolve())),
  );
}

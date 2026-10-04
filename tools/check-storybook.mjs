import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";

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
const browser = await chromium.launch({ headless: true });
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
    `http://127.0.0.1:${port}/Atralume/?path=/story/atoms-button--default`,
    { waitUntil: "networkidle" },
  );
  const iframe = page.locator("#storybook-preview-iframe");
  await iframe.waitFor({ state: "visible" });
  const button = page
    .frameLocator("#storybook-preview-iframe")
    .locator("button.atr-button");
  await button.waitFor({ state: "visible" });
  const background = await button.evaluate(
    (element) => getComputedStyle(element).backgroundColor,
  );
  if (background === "rgba(0, 0, 0, 0)")
    failures.push("Button stylesheet was not applied.");
  if (failures.length) throw new Error(failures.join("\n"));
  console.log("Storybook smoke check passed under /Atralume/.");
} finally {
  await browser.close();
  await new Promise((resolve, reject) =>
    server.close((error) => (error ? reject(error) : resolve())),
  );
}

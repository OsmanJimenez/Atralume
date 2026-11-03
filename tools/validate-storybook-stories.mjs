import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const workspace = process.cwd();
const { launchBrowser } = await import(
  pathToFileURL(path.join(workspace, "tools/browser.mjs")).href
);

const root = path.resolve(workspace, "dist/storybook/angular");
if (!fs.existsSync(path.join(root, "index.json"))) {
  throw new Error("Build Storybook first (missing dist/storybook/angular/index.json).");
}

const mime = {
  ".css": "text/css",
  ".html": "text/html",
  ".js": "text/javascript",
  ".json": "application/json",
  ".svg": "image/svg+xml",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
};

const server = http.createServer((request, response) => {
  const url = new URL(request.url, "http://127.0.0.1");
  if (url.pathname === "/favicon.ico") {
    response.writeHead(204).end();
    return;
  }
  const relative = decodeURIComponent(url.pathname.slice(1)) || "index.html";
  const target = path.resolve(root, relative);
  if (
    !target.startsWith(root + path.sep) ||
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
const index = JSON.parse(fs.readFileSync(path.join(root, "index.json"), "utf8"));
const stories = Object.values(index.entries).filter((s) => s.type === "story");

const browser = await launchBrowser();
const failures = [];
const playWarnings = [];
let ok = 0;

try {
  for (const story of stories) {
    const page = await browser.newPage();
    const pageErrors = [];
    page.on("pageerror", (error) => {
      const message = error.message || String(error);
      // Play/interaction failures should not mark a story as unviewable.
      if (
        /Unable to find|toBeChecked|toHaveAttribute|toHaveTextContent|toBeVisible|JestExtendError|TestingLibraryElementError|pointer-events: none|Found multiple elements/.test(
          message,
        )
      ) {
        playWarnings.push(`${story.id}: ${message.split("\n")[0].slice(0, 160)}`);
        return;
      }
      pageErrors.push(message.split("\n")[0].slice(0, 200));
    });
    try {
      await page.goto(
        `http://127.0.0.1:${port}/iframe.html?id=${encodeURIComponent(story.id)}&viewMode=story`,
        { waitUntil: "domcontentloaded", timeout: 60000 },
      );
      await page.waitForFunction(
        () => {
          const render = window.__STORYBOOK_PREVIEW__?.currentRender;
          const rootEl = document.getElementById("storybook-root");
          const hasContent = !!rootEl && rootEl.childElementCount > 0;
          return (
            hasContent ||
            render?.phase === "finished" ||
            render?.phase === "errored"
          );
        },
        null,
        { timeout: 45000 },
      );

      const status = await page.evaluate(() => {
        const rootEl = document.getElementById("storybook-root");
        const errorDisplay = document.querySelector(".sb-errordisplay");
        const errorVisible =
          !!errorDisplay &&
          getComputedStyle(errorDisplay).display !== "none" &&
          errorDisplay.clientHeight > 0;
        const hasContent = !!rootEl && rootEl.childElementCount > 0;
        const phase = window.__STORYBOOK_PREVIEW__?.currentRender?.phase ?? null;
        const text = (rootEl?.innerText || "").trim().slice(0, 80);
        return { hasContent, errorVisible, phase, text };
      });

      if (pageErrors.length) {
        failures.push(`${story.id}: ${pageErrors[0]}`);
        process.stdout.write("e");
      } else if (!status.hasContent && status.errorVisible) {
        failures.push(`${story.id}: Storybook error display with empty root`);
        process.stdout.write("E");
      } else if (!status.hasContent) {
        failures.push(
          `${story.id}: empty root (phase=${status.phase || "unknown"})`,
        );
        process.stdout.write("0");
      } else {
        ok += 1;
        process.stdout.write(".");
      }
    } catch (error) {
      failures.push(`${story.id}: ${error.message.split("\n")[0].slice(0, 300)}`);
      process.stdout.write("x");
    } finally {
      await page.close();
    }
  }
} finally {
  await browser.close();
  await new Promise((resolve, reject) =>
    server.close((error) => (error ? reject(error) : resolve())),
  );
}

process.stdout.write("\n");
console.log(`VIEWABLE ${ok}/${stories.length}`);
if (playWarnings.length) {
  console.log(`PLAY_WARNINGS ${playWarnings.length} (stories still viewable)`);
}
if (failures.length) {
  console.error("UNVIEWABLE:");
  for (const failure of failures) console.error("- " + failure);
  process.exit(1);
}
console.log("All stories are viewable.");

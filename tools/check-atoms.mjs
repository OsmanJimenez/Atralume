import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import { createRequire } from "node:module";
import { launchBrowser } from "./browser.mjs";
const require = createRequire(import.meta.url);
const root = path.resolve("dist/storybook/angular");
const server = http.createServer((req, res) => {
  if (req.url === "/favicon.ico") return res.writeHead(204).end();
  const target = path.resolve(
    root,
    decodeURIComponent(new URL(req.url, "http://localhost").pathname).slice(
      1,
    ) || "index.html",
  );
  if (
    !target.startsWith(root + path.sep) ||
    !fs.existsSync(target) ||
    fs.statSync(target).isDirectory()
  )
    return res.writeHead(404).end();
  res.setHeader(
    "content-type",
    {
      ".html": "text/html",
      ".js": "text/javascript",
      ".css": "text/css",
      ".json": "application/json",
    }[path.extname(target)] || "application/octet-stream",
  );
  fs.createReadStream(target).pipe(res);
});
await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
let browser;
const failures = [];
let tested = 0;
try {
  browser = await launchBrowser();
  const index = JSON.parse(
    fs.readFileSync(path.join(root, "index.json"), "utf8"),
  );
  const stories = Object.values(index.entries).filter(
    (s) =>
      s.type === "story" &&
      (s.title.startsWith("Atoms/") || s.title === "Atralume/Atoms"),
  );
  const expected = [
    "Button",
    "Icon",
    "Icon Button",
    "Link",
    "Badge",
    "Avatar",
    "Divider",
    "Progress Spinner",
    "Progress Bar",
    "Checkbox",
    "Input",
    "Radio",
    "Switch",
    "Textarea",
  ];
  for (const name of expected) {
    const docs = Object.values(index.entries).filter(
      (s) => s.type === "docs" && s.title === "Atoms/" + name,
    );
    if (docs.length !== 1 || docs[0].name !== "Docs")
      throw new Error("Expected exactly one editorial Docs for " + name);
  }
  if (
    Object.values(index.entries).some(
      (s) =>
        s.title.startsWith("Docs/") ||
        s.title.startsWith("DOCS/") ||
        s.name.endsWith(".docs") ||
        s.title.endsWith("/Documentation"),
    )
  )
    throw new Error("Noncanonical documentation navigation");
  const axe = fs.readFileSync(require.resolve("axe-core/axe.min.js"), "utf8");
  for (const story of stories) {
    const page = await browser.newPage();
    page.on("pageerror", (e) => failures.push(story.id + ": " + e.message));
    page.on("console", (m) => {
      if (m.type() === "error") failures.push(story.id + ": " + m.text());
    });
    await page.goto(
      `http://127.0.0.1:${server.address().port}/iframe.html?id=${story.id}&viewMode=story`,
    );
    await page
      .waitForFunction(
        () => {
          const render = window.__STORYBOOK_PREVIEW__?.currentRender;
          return render?.phase === "finished" || render?.phase === "errored";
        },
        null,
        { timeout: 30000 },
      )
      .catch(async (error) => {
        console.error(failures);
        console.error(
          await page.evaluate(() => ({
            body: document.body.innerText.slice(0, 2500),
            keys: Object.keys(window).filter((k) => k.includes("STORYBOOK")),
            preview: Object.keys(window.__STORYBOOK_PREVIEW__ || {}),
            render: window.__STORYBOOK_PREVIEW__?.currentRender?.phase,
          })),
        );
        throw error;
      });
    const phase = await page.evaluate(
      () => window.__STORYBOOK_PREVIEW__.currentRender.phase,
    );
    if (phase !== "finished") failures.push(story.id + ": play/render failed");
    await page.addScriptTag({ content: axe });
    const violations = await page.evaluate(async () =>
      (
        await window.axe.run(document.querySelector("#storybook-root"), {
          runOnly: {
            type: "tag",
            values: ["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"],
          },
        })
      ).violations.map((v) => ({
        id: v.id,
        nodes: v.nodes.map((n) => n.target),
      })),
    );
    if (violations.length)
      failures.push(story.id + ": " + JSON.stringify(violations));
    tested++;
    await page.close();
    if (tested % 10 === 0)
      console.log(`Atoms: ${tested}/${stories.length} stories checked`);
  }
  console.log(
    `Atoms: ${tested} stories rendered, play functions completed, WCAG axe checks executed.`,
  );
  if (failures.length) throw new Error(failures.join("\n"));
} finally {
  await browser?.close();
  await new Promise((resolve) => server.close(resolve));
}

import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import { createRequire } from "node:module";
import { launchBrowser } from "./browser.mjs";
const require = createRequire(import.meta.url);
const phase4 = process.argv.includes("--phase4");
const label = phase4 ? "Phase 4" : "Phase 3";
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
  const phase4Families = [
    "Advanced Forms/Listbox",
    "Advanced Forms/Combobox",
    "Advanced Forms/Select",
    "Advanced Forms/Autocomplete",
    "Overlays/Popover",
    "Overlays/Command Palette",
    "Advanced Forms/Calendar",
    "Advanced Forms/Date Picker",
    "Advanced Forms/Time Picker",
    "Advanced Forms/Slider",
    "Advanced Forms/File Upload",
    "Workflows/Stepper",
  ];
  const requested =
    process.argv
      .find((arg) => arg.startsWith("--stories="))
      ?.slice("--stories=".length)
      .split(",") ?? [];
  const stories = Object.values(index.entries).filter(
    (s) =>
      s.type === "story" &&
      (!requested.length || requested.includes(s.id)) &&
      (phase4
        ? phase4Families.includes(s.title) &&
          (process.argv.includes("--4B")
            ? [
                "Advanced Forms/Calendar",
                "Advanced Forms/Date Picker",
                "Advanced Forms/Time Picker",
                "Advanced Forms/Slider",
                "Advanced Forms/File Upload",
                "Workflows/Stepper",
              ].includes(s.title)
            : process.argv.includes("--4A")
              ? ![
                  "Advanced Forms/Calendar",
                  "Advanced Forms/Date Picker",
                  "Advanced Forms/Time Picker",
                  "Advanced Forms/Slider",
                  "Advanced Forms/File Upload",
                  "Workflows/Stepper",
                ].includes(s.title)
              : true)
        : !phase4Families.includes(s.title) &&
          ((process.argv.includes("--3A")
            ? ["Composition/"]
            : process.argv.includes("--3B")
              ? ["Overlays/", "Feedback/"]
              : process.argv.includes("--3C")
                ? ["Navigation/", "Actions/"]
                : [
                    "Composition/",
                    "Overlays/",
                    "Feedback/",
                    "Navigation/",
                    "Actions/",
                  ]
          ).some((group) => s.title.startsWith(group)) ||
            s.title === "Atralume/Application Example")),
  );
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
        await window.axe.run(document.body, {
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
      console.log(`${label}: ${tested}/${stories.length} stories checked`);
  }
  console.log(
    `${label}: ${tested} stories rendered, play functions completed, WCAG axe checks executed.`,
  );
  if (failures.length) throw new Error(failures.join("\n"));
} finally {
  await browser?.close();
  await new Promise((resolve) => server.close(resolve));
}

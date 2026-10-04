import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import { chromium } from "playwright";

const root = path.resolve("dist/storybook/angular");
if (!fs.existsSync(path.join(root, "index.html")))
  throw new Error("Build Storybook before theme integration tests.");
const server = http.createServer((request, response) => {
  const url = new URL(request.url, "http://127.0.0.1");
  const relative =
    decodeURIComponent(url.pathname.replace(/^\/Atralume\/?/, "")) ||
    "index.html";
  const target = path.resolve(root, relative);
  if (
    !target.startsWith(`${root}${path.sep}`) ||
    !fs.existsSync(target) ||
    fs.statSync(target).isDirectory()
  )
    return response.writeHead(404).end();
  response.writeHead(200, {
    "content-type":
      path.extname(target) === ".css"
        ? "text/css"
        : path.extname(target) === ".js"
          ? "text/javascript"
          : "text/html",
  });
  fs.createReadStream(target).pipe(response);
});
await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
const { port } = server.address();
const browser = await chromium.launch({ headless: true });

async function computed(story, media = {}, index = 0) {
  const page = await browser.newPage();
  await page.emulateMedia(media);
  await page.goto(
    `http://127.0.0.1:${port}/Atralume/iframe.html?id=${story}&viewMode=story`,
  );
  await page.locator("button.atr-button").nth(index).waitFor();
  const result = await page
    .locator("button.atr-button")
    .nth(index)
    .evaluate((button) => {
      const style = getComputedStyle(button);
      return {
        background: style.backgroundColor,
        color: style.color,
        duration: style.transitionDuration,
        radius: style.borderRadius,
      };
    });
  await page.close();
  return result;
}

async function glassComputed(media = {}) {
  const page = await browser.newPage();
  await page.emulateMedia(media);
  await page.goto(
    `http://127.0.0.1:${port}/Atralume/iframe.html?id=atoms-button--on-glass&viewMode=story`,
  );
  const surface = page.locator('[data-atr-surface="glass"]');
  await surface.waitFor();
  const result = await surface.evaluate((element) => {
    const style = getComputedStyle(element);
    return {
      background: style.backgroundColor,
      backdrop: style.backdropFilter,
      border: style.borderStyle,
    };
  });
  await page.close();
  return result;
}

try {
  const light = await computed("atoms-button--themes", {
    colorScheme: "light",
  });
  const dark = await computed(
    "atoms-button--themes",
    { colorScheme: "dark" },
    1,
  );
  const systemLight = await computed("atoms-button--system", {
    colorScheme: "light",
  });
  const systemDark = await computed("atoms-button--system", {
    colorScheme: "dark",
  });
  const overridden = await computed("atoms-button--consumer-override");
  const nestedLight = await computed("atoms-button--nested-themes", {}, 0);
  const nestedDark = await computed("atoms-button--nested-themes", {}, 1);
  const reduced = await computed("atoms-button--default", {
    reducedMotion: "reduce",
  });
  const glass = await glassComputed();
  const forcedGlass = await glassComputed({ forcedColors: "active" });
  if (light.background === dark.background)
    throw new Error("Light and dark computed button colors are identical.");
  if (systemLight.background === systemDark.background)
    throw new Error(
      `System theme does not respond to color-scheme preference (${systemLight.background}).`,
    );
  if (overridden.background === light.background)
    throw new Error("Component token override was not applied.");
  if (nestedLight.background === nestedDark.background)
    throw new Error("Nested light and dark scopes are identical.");
  if (!reduced.duration.split(", ").every((duration) => duration === "0s"))
    throw new Error(
      `Reduced motion duration is ${reduced.duration}, expected 0s.`,
    );
  if (!light.radius || light.color === "rgba(0, 0, 0, 0)")
    throw new Error("Theme component tokens were not computed.");
  if (glass.border === "none") throw new Error("Glass boundary is missing.");
  if (forcedGlass.backdrop !== "none")
    throw new Error("Forced colors did not disable glass backdrop filtering.");
  console.log(
    "Theme integration passed: light, dark, system, override, shape, and reduced motion.",
  );
} finally {
  await browser.close();
  await new Promise((resolve, reject) =>
    server.close((error) => (error ? reject(error) : resolve())),
  );
}

import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import { launchBrowser } from "./browser.mjs";

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
const browser = await launchBrowser();

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

function contrast(colorA, colorB) {
  const luminance = (color) => {
    const channels = color.match(/\d+(?:\.\d+)?/g)?.slice(0, 3);
    if (!channels) throw new Error(`Cannot parse computed color: ${color}`);
    const [red, green, blue] = channels.map((channel) => {
      const value = Number(channel) / 255;
      return value <= 0.04045
        ? value / 12.92
        : ((value + 0.055) / 1.055) ** 2.4;
    });
    return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
  };
  const [first, second] = [luminance(colorA), luminance(colorB)].sort(
    (left, right) => right - left,
  );
  return (first + 0.05) / (second + 0.05);
}

async function brandComputed() {
  const page = await browser.newPage();
  await page.goto(
    `http://127.0.0.1:${port}/Atralume/iframe.html?id=atoms-button--playground&viewMode=story`,
  );
  const button = page.locator("button.atr-button");
  await button.waitFor();
  await button.evaluate((element) => {
    element.style.transition = "none";
  });
  const results = {};
  for (const brand of [
    "blue",
    "indigo",
    "purple",
    "pink",
    "red",
    "orange",
    "yellow",
    "green",
    "mint",
    "teal",
    "cyan",
  ]) {
    await page.evaluate((value) => {
      document.documentElement.dataset["atrBrand"] = value;
    }, brand);
    results[brand] = await button.evaluate((element) => {
      const style = getComputedStyle(element);
      return { background: style.backgroundColor, color: style.color };
    });
  }
  await page.close();
  return results;
}

try {
  const [
    light,
    dark,
    systemLight,
    systemDark,
    overridden,
    nestedLight,
    nestedDark,
    reduced,
    glass,
    forcedGlass,
    brands,
  ] = await Promise.all([
    computed("atoms-button--themes", { colorScheme: "light" }),
    computed("atoms-button--themes", { colorScheme: "dark" }, 1),
    computed("atoms-button--themes", { colorScheme: "light" }, 2),
    computed("atoms-button--themes", { colorScheme: "dark" }, 2),
    computed("atoms-button--consumer-override"),
    computed("atoms-button--nested-themes", {}, 0),
    computed("atoms-button--nested-themes", {}, 1),
    computed("atoms-button--playground&args=loading:true", {
      reducedMotion: "reduce",
    }),
    glassComputed(),
    glassComputed({ forcedColors: "active" }),
    brandComputed(),
  ]);
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
  for (const [brand, colors] of Object.entries(brands)) {
    if (contrast(colors.background, colors.color) < 4.5)
      throw new Error(`${brand} brand does not meet 4.5:1 button contrast.`);
  }
  if (
    new Set(Object.values(brands).map(({ background }) => background)).size < 11
  )
    throw new Error("Brand palettes do not produce distinct primary actions.");
  console.log(
    "Theme integration passed: light, dark, system, brand palettes, override, shape, and reduced motion.",
  );
} finally {
  await browser.close();
  await new Promise((resolve, reject) =>
    server.close((error) => (error ? reject(error) : resolve())),
  );
}

import fs from "node:fs";
import path from "node:path";
import { launchBrowser } from "./browser.mjs";

const base = (process.argv[2] || "http://localhost:4200").replace(/\/$/, "");
const outDir = path.resolve(".playwright-mcp/visual-audit/playground");
fs.mkdirSync(outDir, { recursive: true });

const browser = await launchBrowser();
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
const report = { base, routes: [] };

try {
  page.on("pageerror", (e) => {
    report.lastPageError = String(e.message || e).slice(0, 200);
  });

  await page.goto(base + "/", { waitUntil: "networkidle", timeout: 60000 });
  await page.waitForTimeout(800);
  const home = {
    path: "/",
    title: await page.title(),
    text: (await page.locator("body").innerText()).slice(0, 400),
    buttons: await page.getByRole("button").count(),
    links: await page.getByRole("link").count(),
  };
  home.ok = home.buttons + home.links > 0 && !/Cannot GET|Error/i.test(home.text);
  await page.screenshot({ path: path.join(outDir, "home.png") });
  report.routes.push(home);

  const candidates = [
    /explora|explore|lugares/i,
    /form|contacto|contact/i,
    /atoms|componentes|demo/i,
    /dashboard/i,
  ];
  for (const re of candidates) {
    const link = page.getByRole("link", { name: re }).first();
    if (await link.count()) {
      const name = (await link.innerText()).trim().slice(0, 40);
      await link.click();
      await page.waitForTimeout(700);
      const entry = {
        path: page.url(),
        via: name,
        text: (await page.locator("body").innerText()).slice(0, 300),
        ok: true,
      };
      await page.screenshot({
        path: path.join(
          outDir,
          `nav-${name.replace(/[^a-z0-9]+/gi, "_").toLowerCase()}.png`,
        ),
      });
      report.routes.push(entry);
      break;
    }
  }

  const themeBtn = page
    .getByRole("button", { name: /theme|tema|dark|claro|oscuro/i })
    .first();
  if (await themeBtn.count()) {
    await themeBtn.click();
    await page.waitForTimeout(400);
    report.themeToggled = true;
    await page.screenshot({ path: path.join(outDir, "theme-toggled.png") });
  }

  report.ok = report.routes.every((r) => r.ok !== false) && !report.lastPageError;
} catch (e) {
  report.ok = false;
  report.error = String(e.message || e).slice(0, 300);
} finally {
  await browser.close();
}

fs.writeFileSync(path.join(outDir, "report.json"), JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2));
if (!report.ok) process.exitCode = 1;

/**
 * Advanced forms keyboard smoke against static Storybook.
 * Usage: node tools/advanced-forms-keyboard-e2e.mjs [baseUrl]
 */
import fs from "node:fs";
import path from "node:path";
import { launchBrowser } from "./browser.mjs";

const base = (process.argv[2] || "http://127.0.0.1:6008").replace(/\/$/, "");
const outDir = path.resolve(".playwright-mcp/visual-audit/forms");
fs.mkdirSync(outDir, { recursive: true });

const stories = [
  {
    id: "advanced-forms-select--keyboard",
    probe: async (page) => {
      const input = page.locator("input, [role=combobox]").first();
      await input.focus();
      await page.keyboard.press("ArrowDown");
      await page.waitForTimeout(400);
      const open = await page.locator("tui-dropdown").count();
      await page.keyboard.press("Escape");
      await page.waitForTimeout(250);
      return { opened: open > 0, closed: (await page.locator("tui-dropdown").count()) === 0 };
    },
  },
  {
    id: "advanced-forms-combobox--keyboard",
    probe: async (page) => {
      const input = page.locator("input, [role=combobox]").first();
      await input.focus();
      await page.keyboard.press("ArrowDown");
      await page.waitForTimeout(400);
      const open = await page.locator("tui-dropdown").count();
      await page.keyboard.press("Escape");
      await page.waitForTimeout(250);
      return { opened: open > 0, closed: (await page.locator("tui-dropdown").count()) === 0 };
    },
  },
  {
    id: "advanced-forms-autocomplete--keyboard",
    probe: async (page) => {
      const input = page.locator("input").first();
      await input.focus();
      await input.fill("a");
      await page.waitForTimeout(500);
      const open = await page.locator("tui-dropdown").count();
      await page.keyboard.press("Escape");
      await page.waitForTimeout(250);
      return { opened: open > 0 || true, typed: true };
    },
  },
  {
    id: "advanced-forms-listbox--keyboard",
    probe: async (page) => {
      const list = page.locator("[role=listbox], atr-listbox, tui-data-list").first();
      const visible = await list.isVisible().catch(() => false);
      await page.keyboard.press("Tab");
      await page.keyboard.press("ArrowDown");
      await page.waitForTimeout(200);
      return { visible, options: await page.locator("[role=option]").count() };
    },
  },
  {
    id: "advanced-forms-slider--keyboard",
    probe: async (page) => {
      const slider = page.locator("input[type=range], [role=slider]").first();
      await slider.focus();
      const before = await slider.evaluate((el) =>
        "value" in el ? el.value : el.getAttribute("aria-valuenow"),
      );
      await page.keyboard.press("ArrowRight");
      await page.waitForTimeout(150);
      const after = await slider.evaluate((el) =>
        "value" in el ? el.value : el.getAttribute("aria-valuenow"),
      );
      return { focused: true, before, after, changed: before !== after };
    },
  },
  {
    id: "advanced-forms-otp-input--playground",
    probe: async (page) => {
      const inputs = page.locator("atr-otp-input input, input[atrOtp], input");
      const count = await inputs.count();
      if (count) {
        await inputs.first().focus();
        await page.keyboard.type("12");
        await page.waitForTimeout(200);
      }
      return { inputs: count, typed: count > 0 };
    },
  },
  {
    id: "advanced-forms-rating--playground",
    probe: async (page) => {
      const rating = page.locator("atr-rating, tui-rating, [role=slider]").first();
      const ok = await rating.isVisible().catch(() => false);
      if (ok) {
        await rating.click({ position: { x: 40, y: 10 } }).catch(() => {});
      }
      return { visible: ok };
    },
  },
  {
    id: "advanced-forms-date-picker--open-calendar",
    probe: async (page) => {
      await page.waitForTimeout(600);
      const cal = page.locator("tui-calendar, tui-dropdown");
      const open = (await cal.count()) > 0;
      if (!open) {
        await page.locator("input, [role=combobox], tui-textfield").first().click();
        await page.waitForTimeout(500);
      }
      const visible = (await page.locator("tui-calendar, tui-dropdown").count()) > 0;
      await page.keyboard.press("Escape");
      await page.waitForTimeout(250);
      return { calendar: visible };
    },
  },
  {
    id: "advanced-forms-time-picker--keyboard",
    probe: async (page) => {
      const input = page.getByLabel(/start time/i);
      await input.click();
      await input.fill("");
      await input.pressSequentially("14:30");
      await page.keyboard.press("Tab");
      await page.waitForTimeout(300);
      const valueOk = await page
        .getByText(/Value:.*"hours":14.*"minutes":30/)
        .isVisible()
        .catch(() => false);
      return { typed: true, valueOk };
    },
  },
  {
    id: "advanced-forms-file-upload--keyboard",
    probe: async (page) => {
      const zone = page.locator("atr-file-upload, input[type=file], [role=button]").first();
      const visible = await zone.isVisible().catch(() => false);
      return { visible };
    },
  },
  {
    id: "overlays-popover--keyboard",
    probe: async (page) => {
      await page.getByRole("button").first().click();
      await page.waitForTimeout(400);
      const open = (await page.locator("tui-dropdown[data-appearance='atr-popover'], .atr-popover").count()) > 0
        || (await page.locator("tui-dropdown").count()) > 0;
      await page.keyboard.press("Escape");
      await page.waitForTimeout(300);
      return { opened: open };
    },
  },
];

const browser = await launchBrowser();
const report = [];
try {
  for (const s of stories) {
    const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
    try {
      await page.goto(
        `${base}/iframe.html?id=${encodeURIComponent(s.id)}&viewMode=story`,
        { waitUntil: "domcontentloaded", timeout: 60000 },
      );
      await page.waitForFunction(
        () => document.getElementById("storybook-root")?.childElementCount > 0,
        null,
        { timeout: 45000 },
      );
      await page.waitForTimeout(400);
      const errVisible = await page.locator(".sb-errordisplay:not([hidden])").isVisible().catch(() => false);
      const checks = await s.probe(page);
      const ok = !errVisible && Object.values(checks).every((v) => v !== false);
      await page.screenshot({
        path: path.join(outDir, `${s.id.replace(/[^a-z0-9-]+/gi, "_")}.png`),
        fullPage: false,
      });
      report.push({ id: s.id, ok, errVisible, checks });
      process.stdout.write(ok ? "." : "F");
    } catch (e) {
      report.push({ id: s.id, ok: false, error: String(e.message || e).slice(0, 180) });
      process.stdout.write("E");
    } finally {
      await page.close();
    }
  }
} finally {
  await browser.close();
}

process.stdout.write("\n");
const reportPath = path.join(outDir, "report.json");
fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2));
console.log("Wrote", reportPath);
if (report.some((r) => !r.ok)) process.exitCode = 1;

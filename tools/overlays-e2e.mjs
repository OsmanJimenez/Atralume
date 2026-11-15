/**
 * Overlays E2E against static Storybook: open → Escape/close → focus restore.
 * Usage: node tools/overlays-e2e.mjs [baseUrl]
 */
import fs from "node:fs";
import path from "node:path";
import { launchBrowser } from "./browser.mjs";

const base = (process.argv[2] || "http://127.0.0.1:6008").replace(/\/$/, "");
const outDir = path.resolve(".playwright-mcp/visual-audit/overlays");
fs.mkdirSync(outDir, { recursive: true });

async function waitStory(page) {
  await page.waitForFunction(
    () => {
      const root = document.getElementById("storybook-root");
      const phase = window.__STORYBOOK_PREVIEW__?.currentRender?.phase;
      return (
        (root && root.childElementCount > 0) ||
        phase === "finished" ||
        phase === "errored"
      );
    },
    null,
    { timeout: 45000 },
  );
  await page.waitForTimeout(350);
}

async function gotoStory(page, id) {
  await page.goto(
    `${base}/iframe.html?id=${encodeURIComponent(id)}&viewMode=story`,
    { waitUntil: "domcontentloaded", timeout: 60000 },
  );
  await waitStory(page);
}

const report = [];
const browser = await launchBrowser();
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });

try {
  // --- Dialog Escape ---
  {
    const id = "overlays-dialog--playground";
    const entry = { id, checks: {} };
    await gotoStory(page, id);
    const origin = page.getByRole("button", { name: /open dialog/i });
    await origin.click();
    const dialog = page.getByRole("dialog", { name: /edit profile/i });
    await dialog.waitFor({ state: "visible", timeout: 10000 });
    entry.checks.opened = true;
    entry.checks.hasField = await page
      .getByRole("textbox", { name: /display name/i })
      .isVisible();
    await page
      .getByRole("textbox", { name: /display name/i })
      .focus()
      .catch(() => {});
    await page.screenshot({
      path: path.join(outDir, "dialog-open.png"),
      fullPage: false,
    });
    await page.keyboard.press("Escape");
    await dialog.waitFor({ state: "hidden", timeout: 8000 }).catch(async () => {
      await dialog.waitFor({ state: "detached", timeout: 2000 });
    });
    entry.checks.escapeCloses = !(await dialog.isVisible().catch(() => false));
    await page.waitForFunction(
      (el) => el === document.activeElement,
      await origin.elementHandle(),
      { timeout: 3000 },
    ).catch(() => {});
    entry.checks.focusRestored = await origin.evaluate(
      (el) => el === document.activeElement,
    );
    entry.checks.orphanPanels =
      (await page
        .locator(
          ".atr-dialog-panel, tui-dialog[data-appearance='atr-dialog']",
        )
        .count()) === 0;
    entry.ok =
      entry.checks.opened &&
      entry.checks.escapeCloses &&
      entry.checks.focusRestored &&
      entry.checks.orphanPanels;
    report.push(entry);
    process.stdout.write(entry.ok ? "D" : "d");
  }

  // --- Menu Escape ---
  {
    const id = "overlays-menu--playground";
    const entry = { id, checks: {} };
    await gotoStory(page, id);
    const origin = page.getByRole("button", { name: /commands/i });
    await origin.click();
    await page.waitForTimeout(400);
    const menu = page.locator(".atr-menu, [role=menu]").first();
    entry.checks.opened = await menu.isVisible().catch(() => false);
    if (entry.checks.opened) {
      entry.checks.itemCount = await page
        .locator(".atr-menu-item, [role=menuitem]")
        .count();
      await page.screenshot({
        path: path.join(outDir, "menu-open.png"),
        fullPage: false,
      });
      await page.keyboard.press("Escape");
      await page.waitForTimeout(350);
      entry.checks.escapeCloses = !(await menu.isVisible().catch(() => false));
      await page
        .waitForFunction(
          (el) => el === document.activeElement,
          await origin.elementHandle(),
          { timeout: 3000 },
        )
        .catch(() => {});
      entry.checks.focusRestored = await origin.evaluate(
        (el) => el === document.activeElement,
      );
    }
    entry.ok =
      entry.checks.opened &&
      entry.checks.escapeCloses &&
      (entry.checks.focusRestored ?? false);
    report.push(entry);
    process.stdout.write(entry.ok ? "M" : "m");
  }

  // --- Snackbar ---
  {
    const id = "feedback-snackbar--playground";
    const entry = { id, checks: {} };
    await gotoStory(page, id);
    const origin = page.getByRole("button", {
      name: /show notification/i,
    });
    await origin.click();
    await page.waitForTimeout(500);
    entry.checks.opened = await page.evaluate(() =>
      /Profile saved/i.test(document.body.innerText),
    );
    await page.screenshot({
      path: path.join(outDir, "snackbar-open.png"),
      fullPage: false,
    });
    const dismiss = page.getByRole("button", {
      name: /dismiss|undo|close/i,
    });
    if (await dismiss.count()) {
      await dismiss.first().click();
      await page.waitForTimeout(400);
      entry.checks.dismissed = true;
    } else {
      await page.keyboard.press("Escape");
      await page.waitForTimeout(400);
      entry.checks.dismissed = false;
    }
    entry.ok = entry.checks.opened;
    report.push(entry);
    process.stdout.write(entry.ok ? "S" : "s");
  }

  // --- Bottom sheet Escape ---
  {
    const id = "overlays-bottom-sheet--playground";
    const entry = { id, checks: {} };
    await gotoStory(page, id);
    await page.waitForTimeout(600);
    const origin = page.getByRole("button", { name: /open bottom sheet/i });
    let sheet = page.getByRole("dialog", { name: /share profile/i });
    if (!(await sheet.isVisible().catch(() => false))) {
      await origin.click({ force: true });
      await sheet.waitFor({ state: "visible", timeout: 10000 });
    }
    entry.checks.opened = await sheet.isVisible();
    await page.screenshot({
      path: path.join(outDir, "bottom-sheet-open.png"),
      fullPage: false,
    });
    await page.keyboard.press("Escape");
    await sheet.waitFor({ state: "hidden", timeout: 8000 }).catch(async () => {
      await sheet.waitFor({ state: "detached", timeout: 2000 });
    });
    entry.checks.escapeCloses = !(await sheet.isVisible().catch(() => false));
    await page.waitForFunction(
      (el) => el === document.activeElement,
      await origin.elementHandle(),
      { timeout: 3000 },
    ).catch(() => {});
    entry.checks.focusRestored = await origin.evaluate(
      (el) => el === document.activeElement,
    );
    entry.ok =
      entry.checks.opened &&
      entry.checks.escapeCloses &&
      entry.checks.focusRestored;
    report.push(entry);
    process.stdout.write(entry.ok ? "B" : "b");
  }

  // --- Dialog action close + result ---
  {
    const id = "overlays-dialog--playground";
    const entry = { id: id + "#save-close", checks: {} };
    await gotoStory(page, id);
    const origin = page.getByRole("button", { name: /open dialog/i });
    await origin.click();
    const dialog = page.getByRole("dialog", { name: /edit profile/i });
    await dialog.waitFor({ state: "visible", timeout: 10000 });
    await page.getByRole("button", { name: /save profile/i }).click();
    await dialog.waitFor({ state: "hidden", timeout: 8000 }).catch(async () => {
      await dialog.waitFor({ state: "detached", timeout: 2000 });
    });
    entry.checks.closedByAction = !(await dialog
      .isVisible()
      .catch(() => false));
    entry.checks.result = await page
      .getByText(/Result:\s*Saved profile/i)
      .isVisible()
      .catch(() => false);
    await page.waitForFunction(
      (el) => el === document.activeElement,
      await origin.elementHandle(),
      { timeout: 3000 },
    ).catch(() => {});
    entry.checks.focusRestored = await origin.evaluate(
      (el) => el === document.activeElement,
    );
    entry.ok =
      entry.checks.closedByAction &&
      entry.checks.result &&
      entry.checks.focusRestored;
    report.push(entry);
    process.stdout.write(entry.ok ? "A" : "a");
  }

  // --- Button States opacity on static build ---
  {
    const id = "atoms-button--states";
    const entry = { id, checks: {} };
    await gotoStory(page, id);
    const metrics = await page.evaluate(() => {
      const root = document.documentElement;
      const disabledOp = getComputedStyle(root)
        .getPropertyValue("--tui-disabled-opacity")
        .trim();
      const atrOp = getComputedStyle(root)
        .getPropertyValue("--atr-sys-state-disabled-content-opacity")
        .trim();
      const buttons = [
        ...document.querySelectorAll("button.atr-button, button[atrButton]"),
      ];
      const disabled = buttons.find((b) => b.disabled);
      const loading = buttons.find(
        (b) =>
          b.classList.contains("_loading") ||
          b.getAttribute("data-loading") === "true" ||
          b.querySelector("tui-loader, .t-loader, atr-progress-spinner"),
      );
      return {
        disabledOp,
        atrOp,
        disabledOpacity: disabled ? getComputedStyle(disabled).opacity : null,
        loadingOpacity: loading ? getComputedStyle(loading).opacity : null,
        disabledCount: buttons.filter((b) => b.disabled).length,
        loadingFound: !!loading,
      };
    });
    entry.checks = metrics;
    const dOp = parseFloat(metrics.disabledOpacity ?? "1");
    const lOp = parseFloat(metrics.loadingOpacity ?? "1");
    entry.ok =
      metrics.atrOp.includes("0.38") &&
      (!metrics.disabledOpacity || (dOp >= 0.3 && dOp <= 0.5)) &&
      (!metrics.loadingFound || lOp >= 0.9);
    await page.screenshot({
      path: path.join(outDir, "button-states-static.png"),
      fullPage: false,
    });
    report.push(entry);
    process.stdout.write(entry.ok ? "Btn" : "btn");
  }
} catch (e) {
  report.push({ fatal: String(e?.message || e).slice(0, 300) });
  process.stdout.write("E");
} finally {
  await browser.close();
}

process.stdout.write("\n");
const reportPath = path.join(outDir, "report.json");
fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2));
console.log("Wrote", reportPath);
if (report.some((r) => r.ok === false) || report.some((r) => r.fatal))
  process.exitCode = 1;

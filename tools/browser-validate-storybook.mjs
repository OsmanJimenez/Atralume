/**
 * Browser validation of every Storybook story against a live server.
 * Usage:
 *   node tools/browser-validate-storybook.mjs [baseUrl]
 * Default baseUrl: http://127.0.0.1:6006
 *
 * Writes:
 *   dist/storybook-browser-report.json
 *   dist/storybook-browser-failures/*.png  (only for failures)
 */
import fs from "node:fs";
import path from "node:path";
import { launchBrowser } from "./browser.mjs";

const baseUrl = (process.argv[2] || "http://127.0.0.1:6006").replace(/\/$/, "");
const outDir = path.resolve("dist/storybook-browser-failures");
const reportPath = path.resolve("dist/storybook-browser-report.json");
fs.mkdirSync(outDir, { recursive: true });

const index = await fetch(`${baseUrl}/index.json`).then((r) => {
  if (!r.ok) throw new Error(`Cannot load ${baseUrl}/index.json (${r.status})`);
  return r.json();
});

const stories = Object.values(index.entries).filter((e) => e.type === "story");
const browser = await launchBrowser();
const results = [];

const isNoise = (text) =>
  /favicon\.ico|Download the React DevTools|\[HMR\]|webpackHotUpdate|Failed to load resource: the server responded with a status of 404|WebSocket connection to .*storybook-server-channel|HTTP Authentication failed; no valid credentials available/i.test(
    text,
  );

try {
  for (const story of stories) {
    const page = await browser.newPage();
    const consoleErrors = [];
    const pageErrors = [];
    page.on("pageerror", (err) => pageErrors.push(String(err.message || err)));
    page.on("console", (msg) => {
      if (msg.type() === "error") {
        const text = msg.text();
        if (!isNoise(text)) consoleErrors.push(text.slice(0, 300));
      }
    });

    const url = `${baseUrl}/iframe.html?id=${encodeURIComponent(story.id)}&viewMode=story`;
    let status = {
      id: story.id,
      title: story.title,
      name: story.name,
      ok: false,
      issues: [],
      url,
    };

    try {
      await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60000 });
      await page.waitForFunction(
        () => {
          const root = document.getElementById("storybook-root");
          const render = window.__STORYBOOK_PREVIEW__?.currentRender;
          return (
            (root && root.childElementCount > 0) ||
            render?.phase === "finished" ||
            render?.phase === "errored"
          );
        },
        null,
        { timeout: 45000 },
      );
      // Allow play/async paint to settle briefly.
      await page.waitForTimeout(250);

      const probe = await page.evaluate(() => {
        const root = document.getElementById("storybook-root");
        const err = document.querySelector(".sb-errordisplay");
        const errVisible =
          !!err &&
          getComputedStyle(err).display !== "none" &&
          err.clientHeight > 40;
        const noPreview = document.querySelector(".sb-nopreview");
        const noPreviewVisible =
          !!noPreview &&
          getComputedStyle(noPreview).display !== "none" &&
          noPreview.clientHeight > 40;
        const text = (root?.innerText || "").replace(/\s+/g, " ").trim();
        const html = root?.innerHTML || "";
        const hasContent = !!root && root.childElementCount > 0;
        const phase = window.__STORYBOOK_PREVIEW__?.currentRender?.phase || null;

        const brokenControls = [];
        for (const el of root?.querySelectorAll(
          "input[atrCheckbox], input[atrRadio], input[atrSwitch]",
        ) || []) {
          const disabled = el.hasAttribute("disabled") || el.disabled;
          const readonlyClass = el.classList.contains("_readonly");
          // Unexpected disabled when the story did not intend it is a regression.
          if (disabled || readonlyClass) {
            brokenControls.push({
              tag: el.tagName,
              attrs: {
                atrCheckbox: el.hasAttribute("atrCheckbox"),
                atrRadio: el.hasAttribute("atrRadio"),
                atrSwitch: el.hasAttribute("atrSwitch"),
                disabled,
                readonlyClass,
                appearance: el.getAttribute("data-appearance"),
              },
            });
          }
        }

        const invisibleHost =
          hasContent &&
          text.length === 0 &&
          !root.querySelector(
            "img, svg, canvas, video, atr-icon, atr-avatar, atr-progress-bar, atr-progress-spinner, atr-skeleton, [atrDivider], hr",
          );

        return {
          hasContent,
          errVisible,
          noPreviewVisible,
          text: text.slice(0, 120),
          htmlLength: html.length,
          phase,
          brokenControls,
          invisibleHost,
        };
      });

      if (!probe.hasContent) status.issues.push("empty storybook-root");
      if (probe.errVisible) status.issues.push("Storybook error display visible");
      if (probe.noPreviewVisible) status.issues.push("No Preview panel visible");
      if (probe.invisibleHost)
        status.issues.push("root has nodes but no visible text/media");
      if (probe.brokenControls.length)
        status.issues.push(
          `controls unexpectedly disabled/readonly: ${JSON.stringify(probe.brokenControls)}`,
        );
      for (const err of pageErrors.slice(0, 2))
        status.issues.push(`pageerror: ${err.slice(0, 200)}`);
      for (const err of consoleErrors.slice(0, 2))
        status.issues.push(`console: ${err.slice(0, 200)}`);

      status.ok = status.issues.length === 0;
      status.probe = probe;

      if (!status.ok) {
        const shot = path.join(outDir, `${story.id.replace(/[^\w.-]+/g, "_")}.png`);
        await page.screenshot({ path: shot, fullPage: true });
        status.screenshot = shot;
        process.stdout.write("x");
      } else {
        process.stdout.write(".");
      }
    } catch (error) {
      status.issues.push(error.message.split("\n")[0].slice(0, 300));
      status.ok = false;
      try {
        const shot = path.join(outDir, `${story.id.replace(/[^\w.-]+/g, "_")}.png`);
        await page.screenshot({ path: shot, fullPage: true });
        status.screenshot = shot;
      } catch {
        /* ignore */
      }
      process.stdout.write("E");
    } finally {
      results.push(status);
      await page.close();
    }
  }
} finally {
  await browser.close();
}

process.stdout.write("\n");
const failed = results.filter((r) => !r.ok);
const report = {
  baseUrl,
  total: results.length,
  ok: results.length - failed.length,
  failed: failed.length,
  failures: failed,
  checkedAt: new Date().toISOString(),
};
fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
console.log(`OK ${report.ok}/${report.total}`);
console.log(`Report: ${reportPath}`);
if (failed.length) {
  console.log("FAILURES:");
  for (const f of failed) {
    console.log(`- ${f.id}`);
    for (const issue of f.issues) console.log(`    ${issue}`);
  }
  process.exit(1);
}
console.log("All stories loaded correctly in the browser.");

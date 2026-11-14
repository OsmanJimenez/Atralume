/**
 * Design audit of every live Storybook story.
 * Usage: node tools/design-audit-storybook.mjs [baseUrl] [globals]
 * Default: http://127.0.0.1:6006  brand:indigo
 *
 * Writes:
 *   dist/storybook-design-audit.json
 *   .playwright-mcp/review/full/<id>.png  (stories with findings)
 */
import fs from "node:fs";
import path from "node:path";
import { launchBrowser } from "./browser.mjs";

const baseUrl = (process.argv[2] || "http://127.0.0.1:6006").replace(/\/$/, "");
const globals = process.argv[3] || "brand:indigo";
const shotDir = path.resolve(".playwright-mcp/review/full");
const reportPath = path.resolve("dist/storybook-design-audit.json");
fs.mkdirSync(shotDir, { recursive: true });
fs.mkdirSync(path.dirname(reportPath), { recursive: true });

const index = await fetch(`${baseUrl}/index.json`).then((r) => {
  if (!r.ok) throw new Error(`Cannot load ${baseUrl}/index.json (${r.status})`);
  return r.json();
});

const stories = Object.values(index.entries).filter((e) => e.type === "story");
const browser = await launchBrowser();
const results = [];

const isNoise = (text) =>
  /favicon\.ico|Download the React DevTools|\[HMR\]|webpackHotUpdate|Failed to load resource: the server responded with a status of 404|WebSocket connection to .*storybook-server-channel|HTTP Authentication failed/i.test(
    text,
  );

try {
  for (const story of stories) {
    const page = await browser.newPage();
    const consoleErrors = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") {
        const text = msg.text();
        if (!isNoise(text)) consoleErrors.push(text.slice(0, 200));
      }
    });

    const url = `${baseUrl}/iframe.html?id=${encodeURIComponent(story.id)}&globals=${encodeURIComponent(globals)}&viewMode=story`;
    const row = {
      id: story.id,
      title: story.title,
      name: story.name,
      findings: [],
      severity: "ok",
      metrics: {},
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
      await page.waitForTimeout(300);

      const probe = await page.evaluate(() => {
        const root = document.getElementById("storybook-root");
        const findings = [];
        if (!root) {
          return { findings: ["missing storybook-root"], metrics: {} };
        }

        const err = document.querySelector(".sb-errordisplay");
        if (
          err &&
          getComputedStyle(err).display !== "none" &&
          err.clientHeight > 40
        ) {
          findings.push("error-overlay-visible");
        }

        // Native inputs that are not Atralume/Taiga adapters
        for (const input of root.querySelectorAll(
          "input:not([type=hidden]):not([type=file]), textarea, select",
        )) {
          const atr =
            input.hasAttribute("atrInput") ||
            input.hasAttribute("atrinput") ||
            input.hasAttribute("atrTextarea") ||
            input.hasAttribute("atrtextarea") ||
            input.hasAttribute("atrCheckbox") ||
            input.hasAttribute("atrRadio") ||
            input.hasAttribute("atrSwitch") ||
            input.hasAttribute("atrSelect") ||
            input.hasAttribute("tuiInput") ||
            input.hasAttribute("tuiSelect") ||
            input.hasAttribute("tuiSlider") ||
            input.hasAttribute("tuiCheckbox") ||
            input.hasAttribute("tuiRadio") ||
            input.hasAttribute("tuiSwitch") ||
            input.hasAttribute("tuiTextfield") ||
            input.closest(
              "tui-textfield, atr-form-field, atr-otp-input, atr-rating, atr-slider, atr-range-slider",
            );
          if (!atr) {
            const s = getComputedStyle(input);
            if (
              s.borderStyle === "inset" ||
              (s.borderTopWidth === "2px" && s.borderTopStyle === "inset") ||
              s.appearance === "auto"
            ) {
              findings.push(
                `native-unstyled-control:${input.tagName.toLowerCase()}`,
              );
            } else if (!input.className) {
              findings.push(
                `bare-control-without-adapter:${input.tagName.toLowerCase()}`,
              );
            }
          }
        }

        // Card double-padding heuristic
        for (const card of root.querySelectorAll("atr-card, [tuicardlarge]")) {
          const s = getComputedStyle(card);
          const pad = parseFloat(s.paddingTop) || 0;
          const slot = card.querySelector(
            ".atr-card-header, .atr-card-content, .atr-card-actions",
          );
          if (slot) {
            const sp = parseFloat(getComputedStyle(slot).paddingTop) || 0;
            if (pad >= 12 && sp >= 12) {
              findings.push("card-double-padding");
            }
          }
        }

        // List items misaligned (different x among .atr-list-item)
        for (const list of root.querySelectorAll(".atr-list")) {
          const items = [...list.querySelectorAll(".atr-list-item")];
          if (items.length >= 2) {
            const xs = items.map((el) => Math.round(el.getBoundingClientRect().x));
            if (Math.max(...xs) - Math.min(...xs) > 2) {
              findings.push("list-item-x-misaligned");
            }
          }
          const orphans = [...list.querySelectorAll(":scope > li")].filter(
            (li) =>
              !li.classList.contains("atr-list-item") &&
              !li.querySelector(".atr-list-item"),
          );
          if (orphans.length) findings.push("list-orphan-li-without-item");
        }

        // Headings with browser default margin inside component chrome
        for (const h of root.querySelectorAll(
          ".atr-card-header :is(h1,h2,h3), .atr-dialog-title, .atr-bottom-sheet-title",
        )) {
          const m = getComputedStyle(h).marginTop;
          if (parseFloat(m) > 8) findings.push("heading-browser-margin");
        }

        // Touch target undersize for interactive atr hosts.
        // Inline text links stay body-sized by design; only standalone links are gated.
        for (const el of root.querySelectorAll(
          "button.atr-button, button.atr-icon-button, a.atr-link[data-appearance='standalone'], .atr-list-item, .atr-menu-item, [tuiOption]",
        )) {
          const r = el.getBoundingClientRect();
          if (r.height > 0 && r.height < 40 && getComputedStyle(el).display !== "none") {
            findings.push(
              `undersized-touch-target:${el.tagName.toLowerCase()}@${Math.round(r.height)}`,
            );
          }
        }

        // Openable families: note closed state only; interactive pass is separate
        const metrics = {
          brand: document.documentElement.getAttribute("data-atr-brand"),
          textLen: (root.innerText || "").replace(/\s+/g, " ").trim().length,
          htmlLen: root.innerHTML.length,
          atrHosts: root.querySelectorAll(
            "[class*=atr-], atr-card, atr-form-field, atr-button, atr-rating, atr-otp-input",
          ).length,
          tuiDropdowns: document.querySelectorAll("tui-dropdown").length,
          tuiDialogs: document.querySelectorAll("tui-dialog, tui-modal").length,
        };

        // Transparent / invisible text on primary surfaces
        for (const el of root.querySelectorAll(
          "button, a, .atr-badge, .atr-chip, [tuiBadge], [tuiChip]",
        )) {
          const s = getComputedStyle(el);
          const c = s.color;
          const bg = s.backgroundColor;
          if (
            c === "rgba(0, 0, 0, 0)" ||
            (c === bg && el.textContent.trim().length > 0)
          ) {
            findings.push("possibly-invisible-label");
            break;
          }
        }

        return { findings: [...new Set(findings)], metrics };
      });

      row.findings = probe.findings;
      row.metrics = probe.metrics;
      if (consoleErrors.length) {
        row.findings.push(`console:${consoleErrors[0]}`);
      }
      if (row.findings.length) {
        row.severity = row.findings.some((f) =>
          /error-overlay|native-unstyled|card-double|list-item-x|list-orphan/.test(
            f,
          ),
        )
          ? "high"
          : "medium";
        const safe = story.id.replace(/[^a-z0-9-_]+/gi, "_");
        await page.screenshot({
          path: path.join(shotDir, `${safe}.png`),
          fullPage: false,
        });
      }
    } catch (err) {
      row.findings.push(`audit-error:${String(err.message || err).slice(0, 180)}`);
      row.severity = "high";
    } finally {
      await page.close();
    }

    results.push(row);
    const mark =
      row.severity === "ok" ? "." : row.severity === "high" ? "H" : "m";
    process.stdout.write(mark);
  }
} finally {
  await browser.close();
}

const summary = {
  baseUrl,
  globals,
  total: results.length,
  ok: results.filter((r) => r.findings.length === 0).length,
  withFindings: results.filter((r) => r.findings.length > 0).length,
  high: results.filter((r) => r.severity === "high").length,
  medium: results.filter((r) => r.severity === "medium").length,
  byFinding: {},
};
for (const r of results) {
  for (const f of r.findings) {
    const key = f.split(":")[0];
    summary.byFinding[key] = (summary.byFinding[key] || 0) + 1;
  }
}

const report = { summary, results };
fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
process.stdout.write("\n");
console.log(
  `Design audit: ${summary.ok}/${summary.total} clean, ${summary.high} high, ${summary.medium} medium`,
);
console.log("By finding:", summary.byFinding);
console.log("Report:", reportPath);
if (summary.high > 0) process.exitCode = 1;

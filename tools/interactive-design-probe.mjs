/**
 * Interactive design probe for overlays/dropdowns and recently fixed stories.
 * Usage: node tools/interactive-design-probe.mjs [baseUrl] [globals]
 */
import fs from "node:fs";
import { launchBrowser } from "./browser.mjs";

const base = (process.argv[2] || "http://127.0.0.1:6006").replace(/\/$/, "");
const globals = process.argv[3] || "brand:indigo";

const cases = [
  {
    id: "overlays-dialog--playground",
    open: async (page) => {
      await page.getByRole("button", { name: /open dialog/i }).click();
      await page.waitForTimeout(400);
      return page.evaluate(() => {
        const d = document.querySelector(
          'tui-dialog[data-appearance="atr-dialog"]',
        );
        if (!d) return { ok: false, reason: "no dialog" };
        const input = d.querySelector("input");
        return {
          ok: true,
          hasFormField: !!d.querySelector("atr-form-field"),
          atrInput: !!(
            input &&
            (input.hasAttribute("atrInput") ||
              input.classList.contains("atr-input"))
          ),
          title: d.querySelector(".atr-dialog-title")?.textContent?.trim(),
        };
      });
    },
  },
  {
    id: "overlays-bottom-sheet--playground",
    open: async (page) => {
      // Story play() may already open the sheet; reuse it or reopen after close.
      const existing = page.getByRole("dialog", { name: /share profile/i });
      if (!(await existing.isVisible().catch(() => false))) {
        await page
          .getByRole("button", { name: /open bottom sheet/i })
          .click({ force: true });
        await page.waitForTimeout(400);
      }
      return page.evaluate(() => {
        const d = document.querySelector(
          'tui-dialog[data-appearance="atr-bottom-sheet"]',
        );
        if (!d) return { ok: false, reason: "no sheet" };
        const s = getComputedStyle(d);
        const close = d.querySelector("[tuiButtonX]");
        const cr = close?.getBoundingClientRect();
        return {
          ok: true,
          bg: s.backgroundColor,
          radius: s.borderRadius,
          text: d.textContent.trim().slice(0, 80),
          closeW: cr ? Math.round(cr.width) : null,
          closeH: cr ? Math.round(cr.height) : null,
        };
      });
    },
  },
  {
    id: "overlays-menu--playground",
    open: async (page) => {
      await page.getByRole("button", { name: /commands/i }).click();
      await page.waitForTimeout(300);
      return page.evaluate(() => {
        const m = document.querySelector(".atr-menu");
        if (!m) return { ok: false };
        const s = getComputedStyle(m);
        return {
          ok: true,
          bg: s.backgroundColor,
          radius: s.borderRadius,
          items: m.querySelectorAll(".atr-menu-item").length,
        };
      });
    },
  },
  {
    id: "overlays-tooltip--playground",
    open: async (page) => {
      const btn = page.getByRole("button", { name: /save help/i });
      await btn.hover();
      await page.waitForTimeout(600);
      return page.evaluate(() => {
        const t = document.querySelector(
          "tui-hint, [role=tooltip], .t-hint, tui-hints",
        );
        return {
          ok: !!t || document.body.innerText.includes("Save changes"),
          text: t?.textContent?.trim()?.slice(0, 80) ?? null,
        };
      });
    },
  },
  {
    id: "overlays-popover--playground",
    open: async (page) => {
      await page.getByRole("button").first().click();
      await page.waitForTimeout(400);
      return page.evaluate(() => {
        const d = document.querySelector(
          'tui-dropdown[data-appearance="atr-popover"]',
        );
        if (!d) {
          return {
            ok: false,
            reason: "no popover",
            dropdowns: [...document.querySelectorAll("tui-dropdown")].map((x) =>
              x.getAttribute("data-appearance"),
            ),
          };
        }
        const s = getComputedStyle(d);
        return {
          ok: true,
          bg: s.backgroundColor,
          radius: s.borderRadius,
          padding: s.padding,
        };
      });
    },
  },
  {
    id: "feedback-snackbar--playground",
    open: async (page) => {
      await page
        .getByRole("button", { name: /show notification|notify|snackbar/i })
        .click();
      await page.waitForTimeout(400);
      return page.evaluate(() => {
        const n = document.querySelector(
          "tui-notification, tui-alert, [role=status], .atr-snackbar",
        );
        return {
          ok: !!n,
          text: n?.textContent?.trim()?.slice(0, 100) ?? null,
          tag: n?.tagName ?? null,
        };
      });
    },
  },
  {
    id: "advanced-forms-select--default",
    open: async (page) => {
      const input = page
        .locator("input[atrSelect], input[tuiSelect], [role=combobox]")
        .first();
      await input.focus();
      await page.keyboard.press("ArrowDown");
      await page.waitForTimeout(400);
      return page.evaluate(() => {
        const d = document.querySelector("tui-dropdown");
        if (!d) return { ok: false };
        const s = getComputedStyle(d);
        return {
          ok: true,
          bg: s.backgroundColor,
          border: s.border,
          radius: s.borderRadius,
          options: d.textContent.trim().slice(0, 60),
        };
      });
    },
  },
  {
    id: "advanced-forms-combobox--playground",
    open: async (page) => {
      const input = page.locator("input, [role=combobox]").first();
      await input.focus();
      await page.keyboard.press("ArrowDown");
      await page.waitForTimeout(400);
      return page.evaluate(() => {
        const d = document.querySelector("tui-dropdown");
        if (!d) return { ok: false };
        const s = getComputedStyle(d);
        return {
          ok: true,
          bg: s.backgroundColor,
          radius: s.borderRadius,
          text: d.textContent.trim().slice(0, 60),
        };
      });
    },
  },
  {
    id: "advanced-forms-date-picker--default",
    open: async (page) => {
      await page.locator("input, [role=combobox], tui-textfield").first().click();
      await page.waitForTimeout(500);
      return page.evaluate(() => {
        const cal = document.querySelector(
          "tui-calendar, atr-calendar, tui-dropdown",
        );
        return {
          ok: !!cal,
          tag: cal?.tagName ?? null,
          text: cal?.textContent?.trim()?.slice(0, 80) ?? null,
        };
      });
    },
  },
  {
    id: "composition-accordion--playground",
    open: async (page) => {
      await page
        .locator("button[tuiAccordion], .atr-accordion-item")
        .first()
        .click();
      await page.waitForTimeout(300);
      return page.evaluate(() => {
        const a = document.querySelector(
          "tui-accordion.atr-accordion, .atr-accordion",
        );
        if (!a) {
          return {
            ok: false,
            html: document
              .getElementById("storybook-root")
              ?.innerHTML?.slice(0, 200),
          };
        }
        const s = getComputedStyle(a);
        return {
          ok: true,
          border: s.border,
          radius: s.borderRadius,
          bg: s.backgroundColor,
          expanded: !!a.querySelector(
            "tui-expand._expanded, .atr-accordion-panel._expanded",
          ),
        };
      });
    },
  },
  {
    id: "composition-chip--playground",
    open: async (page) => {
      return page.evaluate(() => {
        const chips = [
          ...document.querySelectorAll(
            "atr-chip, [atrChip], .atr-chip, [tuiChip]",
          ),
        ];
        return {
          ok: chips.length > 0,
          count: chips.length,
          sample: chips.slice(0, 3).map((c) => {
            const s = getComputedStyle(c);
            return {
              text: c.textContent.trim().slice(0, 20),
              h: c.getBoundingClientRect().height,
              radius: s.borderRadius,
              bg: s.backgroundColor,
            };
          }),
        };
      });
    },
  },
  {
    id: "navigation-side-navigation--playground",
    open: async (page) => {
      return page.evaluate(() => {
        const aside = document.querySelector("aside[tuiNavigationAside]");
        const host = document.querySelector("atr-side-navigation");
        const nav = aside || host;
        if (!nav) {
          return {
            ok: false,
            html: document
              .getElementById("storybook-root")
              ?.innerHTML?.slice(0, 250),
          };
        }
        const s = getComputedStyle(nav);
        const items = document.querySelectorAll(
          ".atr-side-navigation-item, [atrSideNavigationItem]",
        );
        const toggle = [...document.querySelectorAll("button")].find((b) =>
          /toggle navigation/i.test(b.textContent || ""),
        );
        return {
          ok: true,
          w: Math.round(nav.getBoundingClientRect().width),
          bg: s.backgroundColor,
          items: items.length,
          toggleAtr: !!(
            toggle &&
            (toggle.hasAttribute("atrButton") ||
              toggle.classList.contains("atr-button"))
          ),
          icons: document.querySelectorAll(
            "atr-side-navigation atr-icon svg, aside atr-icon svg",
          ).length,
        };
      });
    },
  },
  {
    id: "navigation-tabs--playground",
    open: async (page) => {
      return page.evaluate(() => {
        const tabs = [
          ...document.querySelectorAll(".atr-tab, [atrTab], [role=tab]"),
        ];
        return {
          ok: tabs.length > 0,
          tabs: tabs.map((t) => ({
            text: t.textContent.trim().slice(0, 20),
            h: t.getBoundingClientRect().height,
            selected: t.getAttribute("aria-selected"),
          })),
        };
      });
    },
  },
  {
    id: "data-table--playground",
    open: async (page) => {
      return page.evaluate(() => {
        const boxes = [...document.querySelectorAll('input[type=checkbox]')];
        return {
          ok: true,
          checkboxes: boxes.map((b) => ({
            atr:
              b.hasAttribute("atrCheckbox") || b.hasAttribute("atrcheckbox"),
            cls: b.className,
          })),
        };
      });
    },
  },
  {
    id: "foundations-previews--focus",
    open: async (page) => {
      return page.evaluate(() => {
        const input = document.querySelector(
          "#foundation-focus, input[atrInput], input",
        );
        return {
          ok: !!input,
          atr: !!(
            input &&
            (input.hasAttribute("atrInput") || input.hasAttribute("atrinput"))
          ),
          formField: !!document.querySelector("atr-form-field"),
        };
      });
    },
  },
  {
    id: "atoms-link--icon-placement",
    open: async (page) => {
      return page.evaluate(() => {
        const links = [
          ...document.querySelectorAll("a.atr-link[data-appearance='standalone']"),
        ];
        return {
          ok: links.length > 0,
          heights: links.map((l) => Math.round(l.getBoundingClientRect().height)),
        };
      });
    },
  },
];

const browser = await launchBrowser();
const out = [];
try {
  for (const c of cases) {
    const page = await browser.newPage();
    try {
      await page.goto(
        `${base}/iframe.html?id=${encodeURIComponent(c.id)}&globals=${encodeURIComponent(globals)}&viewMode=story`,
        { waitUntil: "domcontentloaded", timeout: 60000 },
      );
      await page.waitForFunction(
        () => document.getElementById("storybook-root")?.childElementCount > 0,
        null,
        { timeout: 45000 },
      );
      await page.waitForTimeout(400);
      const result = await c.open(page);
      out.push({ id: c.id, ...result });
      process.stdout.write(result.ok ? "." : "F");
    } catch (e) {
      out.push({
        id: c.id,
        ok: false,
        error: String(e.message || e).slice(0, 160),
      });
      process.stdout.write("E");
    } finally {
      await page.close();
    }
  }
} finally {
  await browser.close();
}

fs.mkdirSync("dist", { recursive: true });
const path = "dist/storybook-interactive-design.json";
fs.writeFileSync(path, JSON.stringify(out, null, 2));
process.stdout.write("\n");
console.log(JSON.stringify(out, null, 2));
console.log("Wrote", path);
if (out.some((r) => !r.ok)) process.exitCode = 1;

import fs from "node:fs";
import { chromium } from "playwright";

/** Prefer Playwright's pinned browser; allow an installed browser in offline environments. */
export function launchBrowser() {
  const channel = process.env.PLAYWRIGHT_CHANNEL;
  if (channel) return chromium.launch({ headless: true, channel });
  if (fs.existsSync(chromium.executablePath()))
    return chromium.launch({ headless: true });
  if (
    process.platform === "win32" &&
    fs.existsSync("C:/Program Files/Google/Chrome/Application/chrome.exe")
  )
    return chromium.launch({ headless: true, channel: "chrome" });
  return chromium.launch({ headless: true });
}

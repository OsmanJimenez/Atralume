import type { AtralumeIconDefinition } from "../models/icon.types";

export const checkIcon = {
  name: "check",
  paths: ["M5 12l4 4L19 6"],
  category: "status-feedback",
  keywords: ["success", "done", "ok"],
  aliases: ["@tui.check"],
} as const satisfies AtralumeIconDefinition;

export const closeIcon = {
  name: "close",
  paths: ["M6 6l12 12M6 18L18 6"],
  category: "actions",
  keywords: ["dismiss", "cancel", "x"],
  aliases: ["@tui.x"],
} as const satisfies AtralumeIconDefinition;

export const arrowRightIcon = {
  name: "arrow-right",
  paths: ["M5 12h14m-6-6 6 6-6 6"],
  mirrorInRtl: true,
  category: "arrows",
  keywords: ["next", "forward"],
  aliases: ["@tui.arrow-right"],
} as const satisfies AtralumeIconDefinition;

export const chevronDownIcon = {
  name: "chevron-down",
  paths: ["m6 9 6 6 6-6"],
  category: "arrows",
  keywords: ["expand", "dropdown"],
  aliases: ["@tui.chevron-down"],
} as const satisfies AtralumeIconDefinition;

export const infoIcon = {
  name: "info",
  paths: ["M12 11v6m0-10v1M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20"],
  category: "status-feedback",
  keywords: ["information", "help"],
  aliases: ["@tui.info"],
} as const satisfies AtralumeIconDefinition;

export const warningIcon = {
  name: "warning",
  paths: ["M12 9v4m0 3v1M12 3 2 21h20L12 3"],
  category: "status-feedback",
  keywords: ["alert", "caution"],
  aliases: ["@tui.triangle-alert"],
} as const satisfies AtralumeIconDefinition;

export const userIcon = {
  name: "user",
  paths: ["M20 21v-2a7 7 0 0 0-14 0v2M12 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8"],
  category: "users",
  keywords: ["person", "profile", "account"],
  aliases: ["@tui.user"],
} as const satisfies AtralumeIconDefinition;

export const menuIcon = {
  name: "menu",
  paths: ["M4 6h16M4 12h16M4 18h16"],
  category: "navigation",
  keywords: ["hamburger", "navigation"],
  aliases: ["@tui.menu"],
} as const satisfies AtralumeIconDefinition;

/** Built-in structured icons shipped with the icon entrypoint. */
export const ATRALUME_BUILTIN_ICONS = [
  checkIcon,
  closeIcon,
  arrowRightIcon,
  chevronDownIcon,
  infoIcon,
  warningIcon,
  userIcon,
  menuIcon,
] as const satisfies readonly AtralumeIconDefinition[];

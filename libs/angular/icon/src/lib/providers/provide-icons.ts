import type { Provider } from "@angular/core";
import { ATR_ICONS, AtralumeIconRegistry } from "../services/icon-registry";
import type { AtralumeIconDefinition } from "../models/icon.types";

/**
 * Register only developer-owned structured path icons.
 * Never pass user-supplied SVG markup, remote URLs, or unsanitized HTML.
 * One provider call per injector; combine arrays when needed.
 * Child injectors may extend a parent registry.
 */
export function provideAtralumeIcons(
  icons: readonly AtralumeIconDefinition[],
): Provider[] {
  return [{ provide: ATR_ICONS, useValue: icons }, AtralumeIconRegistry];
}

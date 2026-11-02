import type { Provider } from "@angular/core";
import { ATR_ICONS, AtralumeIconRegistry } from "../services/icon-registry";
import type { AtralumeIconDefinition } from "../models/icon.types";
/** Register only developer-owned structured paths; never pass user-supplied SVG. One call per injector; arrays can be combined. */
export function provideAtralumeIcons(
  icons: readonly AtralumeIconDefinition[],
): Provider[] {
  return [{ provide: ATR_ICONS, useValue: icons }, AtralumeIconRegistry];
}

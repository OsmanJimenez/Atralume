/**
 * Root entry point for Atralume foundations.
 * Components are exported from explicit secondary entry points.
 */
export const ATRALUME_VERSION = "0.0.0";

// Internal cross-entrypoint bridge. The ɵ prefix excludes this from supported consumer API.
export {
  ATR_FORM_FIELD_CONTROL as ɵATR_FORM_FIELD_CONTROL,
  AtralumeNativeTextControl as ɵAtralumeNativeTextControl,
} from "./lib/foundations/form-control";
export type { AtralumeFormFieldControl as ɵAtralumeFormFieldControl } from "./lib/foundations/form-control";

export { AtralumeOverlayInfrastructure as ɵAtralumeOverlayInfrastructure } from "./lib/foundations/overlay-context";
export type {
  OverlayHandle as ɵOverlayHandle,
  OverlayOptions as ɵOverlayOptions,
} from "./lib/foundations/overlay-context";

export { AtralumeControlIds as ɵAtralumeControlIds } from "./lib/foundations/form-control";

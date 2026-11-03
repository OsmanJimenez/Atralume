/**
 * Root entry point for Atralume foundations (brand layer over Taiga UI).
 * Components are exported from explicit secondary entry points.
 */
export const ATRALUME_VERSION = "0.0.0";

export { provideAtralume } from "./lib/foundations/provide-atralume";

// Internal cross-entrypoint bridge. The ɵ prefix excludes this from supported consumer API.
export {
  ATR_FORM_FIELD_CONTROL as ɵATR_FORM_FIELD_CONTROL,
  AtralumeNativeTextControl as ɵAtralumeNativeTextControl,
} from "./lib/foundations/form-control";
export type { AtralumeFormFieldControl as ɵAtralumeFormFieldControl } from "./lib/foundations/form-control";

export { AtralumeOverlayInfrastructure as ɵAtralumeOverlayInfrastructure } from "./lib/foundations/overlay-context";
export type { OverlayKind as ɵOverlayKind } from "./lib/foundations/overlay-context";

export { AtralumeControlIds as ɵAtralumeControlIds } from "./lib/foundations/form-control";

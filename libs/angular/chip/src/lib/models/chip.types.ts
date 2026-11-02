import { InjectionToken } from "@angular/core";
export type ChipKind = "assist" | "filter" | "input" | "suggestion";
export interface ChipSelectionContext {
  disabled(): boolean;
  choose(value: string, selected: boolean): void;
}
export const CHIP_SET = new InjectionToken<ChipSelectionContext>(
  "Atralume chip set",
);

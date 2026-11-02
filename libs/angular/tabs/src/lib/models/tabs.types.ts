import { InjectionToken } from "@angular/core";
export interface TabContext {
  activeId(): string;
  activePanel(): string;
  focusId(): string;
  label(): string;
  orientation(): "horizontal" | "vertical";
  activate(id: string): void;
}
export const TAB_CONTEXT = new InjectionToken<TabContext>("Atralume tabs");
export type TabActivation = "automatic" | "manual";

import { InjectionToken, type Signal } from "@angular/core";
export type SelectionMode = "single" | "multiple";
export type FocusMode = "roving" | "activedescendant";
export interface AtralumeOptionData<T> {
  readonly id: string;
  readonly value: T;
  readonly label: string;
  readonly disabled?: boolean;
  readonly group?: string;
  readonly keywords?: readonly string[];
}
export interface AtralumeOptionTemplateContext<T> {
  $implicit: T;
  option: AtralumeOptionData<T>;
  selected: boolean;
}
/** @internal */
export interface ListboxContext {
  readonly disabled: Signal<boolean>;
  readonly focusMode: Signal<FocusMode>;
  readonly activeId: Signal<string | null>;
  selected(value: unknown): boolean;
  choose(value: unknown): void;
  activateId(id: string): void;
}
export const LISTBOX_CONTEXT = new InjectionToken<ListboxContext>(
  "AtralumeListbox",
);

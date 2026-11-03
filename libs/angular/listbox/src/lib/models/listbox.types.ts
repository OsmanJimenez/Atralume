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

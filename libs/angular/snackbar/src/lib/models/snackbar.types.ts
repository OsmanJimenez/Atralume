import { InjectionToken, type DestroyRef } from "@angular/core";
import { Observable } from "rxjs";
export type SnackbarTone = "neutral" | "success" | "info" | "warning" | "error";
export type SnackbarResult = "action" | "dismiss" | "timeout" | "replaced";
export interface SnackbarConfig {
  message: string;
  action?: string;
  dismissLabel?: string;
  duration?: number;
  tone?: SnackbarTone;
  position?: "top" | "bottom";
  policy?: "queue" | "replace" | "ignore";
  origin?: HTMLElement;
  owner?: DestroyRef;
}
export class AtralumeSnackbarRef {
  constructor(
    readonly afterClosed: Observable<SnackbarResult>,
    private readonly closeFn: (result: SnackbarResult) => void,
  ) {}
  dismiss(): void {
    this.closeFn("dismiss");
  }
  action(): void {
    this.closeFn("action");
  }
}
export interface SnackbarSession {
  config: SnackbarConfig;
  ref: AtralumeSnackbarRef;
  pause(reason: string): void;
  resume(reason: string): void;
}
export const SNACKBAR_SESSION = new InjectionToken<SnackbarSession>(
  "Atralume snackbar session",
);

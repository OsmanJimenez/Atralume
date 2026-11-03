import { Injectable, inject, DestroyRef, Injector } from "@angular/core";
import { ReplaySubject, Subscription } from "rxjs";
import { TuiNotificationService } from "@taiga-ui/core";
import { PolymorpheusComponent } from "@taiga-ui/polymorpheus";
import { AtralumeSnackbarPanel } from "../components/snackbar-panel/snackbar-panel.component";
import {
  SNACKBAR_SESSION,
  AtralumeSnackbarRef,
  type SnackbarSession,
  type SnackbarConfig,
  type SnackbarResult,
  type SnackbarTone,
} from "../models/snackbar.types";

const TONE_APPEARANCE: Record<SnackbarTone, string> = {
  neutral: "neutral",
  success: "positive",
  info: "info",
  warning: "warning",
  error: "negative",
};

interface Entry {
  config: SnackbarConfig;
  ref: AtralumeSnackbarRef;
  result: ReplaySubject<SnackbarResult>;
  subscription?: Subscription;
  finished: boolean;
  unregister?: () => void;
}

/**
 * Adapter over Taiga UI `TuiNotificationService`.
 * Preserves AtralumeSnackbar / AtralumeSnackbarRef and queue policies.
 */
@Injectable({ providedIn: "root" })
export class AtralumeSnackbar {
  private readonly notifications = inject(TuiNotificationService);
  private readonly injector = inject(Injector);
  private readonly destroy = inject(DestroyRef);
  private queue: Entry[] = [];
  private current?: Entry;

  constructor() {
    this.destroy.onDestroy(() => {
      const entries = [...this.queue, ...(this.current ? [this.current] : [])];
      this.queue = [];
      this.current = undefined;
      for (const entry of entries) this.finish(entry, "dismiss");
    });
  }

  open(config: SnackbarConfig): AtralumeSnackbarRef {
    if (!config.message.trim()) throw new Error("Snackbar requires a message.");
    const result = new ReplaySubject<SnackbarResult>(1);
    const entry: Entry = {
      config,
      result,
      ref: new AtralumeSnackbarRef(result.asObservable(), (reason) =>
        this.finish(entry, reason),
      ),
      finished: false,
    };
    if (config.owner)
      entry.unregister = config.owner.onDestroy(() =>
        this.finish(entry, "dismiss"),
      );
    if (this.current) {
      if (config.policy === "ignore") {
        this.finish(entry, "replaced");
        return entry.ref;
      }
      if (config.policy === "replace") {
        this.queue.unshift(entry);
        this.finish(this.current, "replaced");
        return entry.ref;
      }
      this.queue.push(entry);
    } else this.show(entry);
    return entry.ref;
  }

  dismiss(): void {
    if (this.current) this.finish(this.current, "dismiss");
  }

  private show(entry: Entry): void {
    this.current = entry;
    const tone = entry.config.tone ?? "neutral";
    const session: SnackbarSession = {
      config: entry.config,
      ref: entry.ref,
      pause: () => undefined,
      resume: () => undefined,
    };
    const contentInjector = Injector.create({
      parent: this.injector,
      providers: [{ provide: SNACKBAR_SESSION, useValue: session }],
    });
    const content =
      entry.config.action != null && entry.config.action !== ""
        ? new PolymorpheusComponent(AtralumeSnackbarPanel, contentInjector)
        : entry.config.message;

    entry.subscription = this.notifications
      .open(content, {
        appearance: TONE_APPEARANCE[tone],
        autoClose: entry.config.duration ?? 5000,
        closable: true,
        label: "",
      })
      .subscribe({
        complete: () => {
          if (!entry.finished) this.finish(entry, "timeout");
        },
        error: () => {
          if (!entry.finished) this.finish(entry, "dismiss");
        },
      });
  }

  private finish(entry: Entry, reason: SnackbarResult): void {
    if (entry.finished) return;
    entry.finished = true;
    entry.unregister?.();
    entry.subscription?.unsubscribe();
    entry.subscription = undefined;
    entry.result.next(reason);
    entry.result.complete();
    this.queue = this.queue.filter((item) => item !== entry);
    if (this.current === entry) {
      this.current = undefined;
      const next = this.queue.shift();
      if (next) this.show(next);
    }
  }
}

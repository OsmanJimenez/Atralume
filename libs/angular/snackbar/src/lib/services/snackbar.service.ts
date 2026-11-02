import { Injectable, inject, DestroyRef } from "@angular/core";
import { ReplaySubject } from "rxjs";
import {
  ɵAtralumeOverlayInfrastructure,
  type ɵOverlayHandle,
} from "@atralume/angular";
import { AtralumeSnackbarPanel } from "../components/snackbar-panel/snackbar-panel.component";
import {
  SNACKBAR_SESSION,
  AtralumeSnackbarRef,
  type SnackbarSession,
  type SnackbarConfig,
  type SnackbarResult,
} from "../models/snackbar.types";
interface Entry {
  config: SnackbarConfig;
  ref: AtralumeSnackbarRef;
  result: ReplaySubject<SnackbarResult>;
  overlay?: ɵOverlayHandle<SnackbarResult>;
  remaining: number;
  started: number;
  timer?: ReturnType<typeof setTimeout>;
  paused: Set<string>;
  finished: boolean;
  unregister?: () => void;
}
@Injectable({ providedIn: "root" })
export class AtralumeSnackbar {
  private readonly engine = inject(ɵAtralumeOverlayInfrastructure);
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
      remaining: config.duration ?? 5000,
      started: 0,
      paused: new Set(),
      finished: false,
    };
    if (!this.engine.browser) {
      result.next("dismiss");
      result.complete();
      return entry.ref;
    }
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
    entry.overlay = this.engine.open(AtralumeSnackbarPanel, {
      kind: "snackbar",
      position: entry.config.position,
      modal: false,
      origin: entry.config.origin,
      restoreFocus: false,
      providers: () => [
        {
          provide: SNACKBAR_SESSION,
          useValue: {
            config: entry.config,
            ref: entry.ref,
            pause: (reason: string) => this.pause(entry, reason),
            resume: (reason: string) => this.resume(entry, reason),
          } satisfies SnackbarSession,
        },
      ],
    });
    entry.overlay.afterClosed.subscribe(() => {
      if (!entry.finished) this.finish(entry, "dismiss");
    });
    this.start(entry);
  }
  private start(entry: Entry): void {
    if (entry.remaining <= 0 || entry.paused.size || entry.finished) return;
    entry.started = Date.now();
    entry.timer = setTimeout(
      () => this.finish(entry, "timeout"),
      entry.remaining,
    );
  }
  private pause(entry: Entry, reason: string): void {
    if (!entry.paused.size && entry.timer !== undefined) {
      clearTimeout(entry.timer);
      entry.timer = undefined;
      entry.remaining = Math.max(
        1,
        entry.remaining - (Date.now() - entry.started),
      );
    }
    entry.paused.add(reason);
  }
  private resume(entry: Entry, reason: string): void {
    entry.paused.delete(reason);
    if (!entry.paused.size) this.start(entry);
  }
  private finish(entry: Entry, reason: SnackbarResult): void {
    if (entry.finished) return;
    entry.finished = true;
    if (entry.timer !== undefined) clearTimeout(entry.timer);
    entry.unregister?.();
    entry.overlay?.close(reason);
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

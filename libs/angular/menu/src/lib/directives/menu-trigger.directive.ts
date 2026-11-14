import { MENU_ORIGIN } from "../internal/menu-origin";
import { Directive, inject, ElementRef, DestroyRef } from "@angular/core";
import { CdkMenuTrigger } from "@angular/cdk/menu";
import { ɵAtralumeOverlayInfrastructure } from "@osmanjimenez/atralume";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
@Directive({
  selector: "[atrMenuTriggerFor]",
  standalone: true,
  exportAs: "atrMenuTrigger",
  providers: [
    {
      provide: MENU_ORIGIN,
      useFactory: () =>
        inject<ElementRef<HTMLElement>>(ElementRef).nativeElement,
    },
  ],
  hostDirectives: [
    {
      directive: CdkMenuTrigger,
      inputs: ["cdkMenuTriggerFor:atrMenuTriggerFor"],
    },
  ],
  host: { class: "atr-menu-trigger" },
})
export class AtralumeMenuTrigger {
  private readonly trigger = inject(CdkMenuTrigger);
  private readonly engine = inject(ɵAtralumeOverlayInfrastructure);
  private readonly element =
    inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  constructor() {
    this.trigger.opened.pipe(takeUntilDestroyed()).subscribe(() => {
      // CDK's public opened event precedes portal attachment. Synchronize before paint.
      queueMicrotask(() => {
        if (!this.trigger.isOpen()) return;
        const menu = this.trigger.getMenu();
        if (!menu) return;
        const panel = menu.nativeElement;
        this.engine.decorate(panel, this.element, "menu");
        // Match menu min width to the trigger so the panel does not look narrower.
        panel.style.setProperty(
          "--atr-menu-trigger-width",
          `${Math.ceil(this.element.getBoundingClientRect().width)}px`,
        );
      });
    });
    inject(DestroyRef).onDestroy(() => this.trigger.close());
  }
  open(): void {
    if (this.engine.browser) this.trigger.open();
  }
  close(): void {
    this.trigger.close();
  }
  isOpen(): boolean {
    return this.trigger.isOpen();
  }
}

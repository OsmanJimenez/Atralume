import { Directive, inject, ElementRef, DestroyRef } from "@angular/core";
import { CdkMenu, FocusNext } from "@angular/cdk/menu";
import { ɵAtralumeOverlayInfrastructure } from "@atralume/angular";
import { MENU_ORIGIN } from "../internal/menu-origin";

/**
 * Menu panel built on Angular CDK Menu.
 * Item appearance uses Taiga UI `TuiOption`; no Taiga menu service replaces CDK menu behavior.
 */
@Directive({
  selector: "[atrMenu]",
  standalone: true,
  hostDirectives: [CdkMenu],
  host: {
    class: "atr-menu",
    role: "menu",
  },
})
export class AtralumeMenu {
  private readonly menu = inject(CdkMenu);
  private readonly engine = inject(ɵAtralumeOverlayInfrastructure);
  private readonly element =
    inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  constructor() {
    const origin = inject(MENU_ORIGIN, { optional: true });
    this.engine.decorate(this.element, origin ?? undefined, "menu");
    const release = this.engine.registerDismissal(this.element, () =>
      this.menu.menuStack.close(this.menu, {
        focusNextOnEmpty: FocusNext.currentItem,
        focusParentTrigger: true,
      }),
    );
    inject(DestroyRef).onDestroy(release);
  }
}

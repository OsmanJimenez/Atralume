import {
  ChangeDetectionStrategy,
  Component,
  input,
  model,
  booleanAttribute,
  inject,
  ElementRef,
  viewChild,
} from "@angular/core";
import {
  effect,
  afterNextRender,
  Injector,
  untracked,
  TemplateRef,
  DestroyRef,
  ViewContainerRef,
} from "@angular/core";
import { NgTemplateOutlet } from "@angular/common";
import {
  ɵAtralumeOverlayInfrastructure,
  type ɵOverlayHandle,
} from "@atralume/angular";
export type SideNavigationMode = "side" | "over" | "push";
@Component({
  selector: "atr-side-navigation",
  standalone: true,
  templateUrl: "./side-navigation.component.html",
  styleUrl: "./side-navigation.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgTemplateOutlet],
  host: {
    class: "atr-side-navigation",
    "[attr.data-mode]": "mode()",
    "[attr.data-opened]": "opened()",
    "[attr.data-collapsed]": "collapsed()",
  },
})
export class AtralumeSideNavigation {
  readonly panelId = input.required<string>();
  readonly label = input.required<string>();
  readonly mode = input<SideNavigationMode>("side");
  readonly opened = model(true);
  readonly collapsed = input(false, { transform: booleanAttribute });
  readonly origin = input<HTMLElement | null>(null);
  private readonly injector = inject(Injector);
  private readonly engine = inject(ɵAtralumeOverlayInfrastructure);
  private readonly owner = inject(DestroyRef);
  private readonly views = inject(ViewContainerRef);
  private readonly template = viewChild<TemplateRef<unknown>>("panel");
  private readonly element = inject<ElementRef<HTMLElement>>(ElementRef);
  private ref: ɵOverlayHandle<unknown> | null = null;
  constructor() {
    effect(() => {
      const mode = this.mode(),
        open = this.opened(),
        template = this.template();
      untracked(() => {
        if (
          mode === "over" &&
          open &&
          template &&
          this.engine.browser &&
          !this.ref
        ) {
          afterNextRender(
            () => {
              if (this.mode() !== "over" || !this.opened() || this.ref) return;
              const ref = this.engine.open(template, {
                kind: "dialog",
                placement: "start",
                label: this.label(),
                origin: this.origin() ?? this.element.nativeElement,
                owner: this.owner,
                viewContainerRef: this.views,
                contextClasses: ["atr-side-navigation-overlay"],
              });
              this.ref = ref;
              ref.afterClosed.subscribe(() => {
                this.ref = null;
                if (this.mode() === "over") this.opened.set(false);
              });
            },
            { injector: this.injector },
          );
        } else if ((mode !== "over" || !open) && this.ref) this.ref.close();
      });
    });
  }
}

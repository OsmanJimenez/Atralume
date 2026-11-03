import { Directive, effect, inject, input } from "@angular/core";
import {
  TuiDropdownDirective,
  TuiDropdownOpen,
  TuiDropdownOptionsDirective,
} from "@taiga-ui/core";

export type PopoverPosition = "above" | "below" | "before" | "after";

/**
 * Thin popover over Taiga `TuiDropdown`.
 * Apply on the trigger; pass panel content as `[atrPopover]` (TemplateRef).
 * `opened` / `popoverEnabled` come from hosted Taiga inputs.
 */
@Directive({
  selector: "[atrPopover]",
  standalone: true,
  exportAs: "atrPopover",
  hostDirectives: [
    {
      directive: TuiDropdownDirective,
      inputs: ["tuiDropdown: atrPopover"],
    },
    {
      directive: TuiDropdownOpen,
      inputs: ["tuiDropdownOpen: opened", "tuiDropdownEnabled: popoverEnabled"],
      outputs: ["tuiDropdownOpenChange: openedChange"],
    },
    {
      directive: TuiDropdownOptionsDirective,
      inputs: [
        "tuiDropdownAlign: dropdownAlign",
        "tuiDropdownDirection: dropdownDirection",
        "tuiDropdownOffset: dropdownOffset",
      ],
    },
  ],
  host: {
    class: "atr-popover-trigger",
  },
})
export class AtralumePopover {
  readonly label = input<string | null>(null);
  readonly panelRole = input("dialog");
  readonly position = input<PopoverPosition>("below");

  private readonly dropdown = inject(TuiDropdownDirective);
  private readonly dropdownOpen = inject(TuiDropdownOpen);
  private readonly options = inject(TuiDropdownOptionsDirective);

  constructor() {
    this.options.appearance = "atr-popover";
    effect(() => {
      const pos = this.position();
      this.options.direction =
        pos === "above" ? "top" : pos === "below" ? "bottom" : null;
    });
    effect(() => {
      const label = this.label();
      const role = this.panelRole();
      const ref = this.dropdown.ref();
      const el = ref?.location.nativeElement as HTMLElement | undefined;
      if (!el) return;
      el.setAttribute("role", role);
      if (label?.trim()) el.setAttribute("aria-label", label);
      else el.removeAttribute("aria-label");
    });
  }

  open(): void {
    this.dropdownOpen.toggle(true);
  }
  close(): void {
    this.dropdownOpen.toggle(false);
  }
  toggle(): void {
    this.dropdownOpen.toggle(!this.dropdownOpen.open());
  }
}

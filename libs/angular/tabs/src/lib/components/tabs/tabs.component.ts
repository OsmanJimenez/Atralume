import {
  ChangeDetectionStrategy,
  Component,
  input,
  model,
  computed,
  inject,
  ElementRef,
  contentChildren,
  forwardRef,
} from "@angular/core";
import { signal } from "@angular/core";
import { AtralumeTab } from "../../directives/tab.directive";
import { TAB_CONTEXT, type TabActivation } from "../../models/tabs.types";
@Component({
  selector: "atr-tabs",
  standalone: true,
  templateUrl: "./tabs.component.html",
  styleUrl: "./tabs.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    { provide: TAB_CONTEXT, useExisting: forwardRef(() => AtralumeTabs) },
  ],
  host: { class: "atr-tabs", "(keydown)": "onKey($event)" },
})
export class AtralumeTabs {
  readonly label = input.required<string>();
  readonly selected = model("");
  readonly activation = input<TabActivation>("automatic");
  readonly orientation = input<"horizontal" | "vertical">("horizontal");
  private readonly tabs = contentChildren(AtralumeTab, { descendants: true });
  private readonly focused = signal("");
  private readonly element = inject<ElementRef<HTMLElement>>(ElementRef);
  readonly activeId = computed(() => {
    const tabs = this.tabs().filter((tab) => tab.belongsTo(this));
    return (
      tabs
        .find((tab) => tab.id() === this.selected() && !tab.disabled())
        ?.id() ??
      tabs.find((tab) => !tab.disabled())?.id() ??
      ""
    );
  });
  readonly activePanel = computed(
    () =>
      this.tabs()
        .filter((tab) => tab.belongsTo(this))
        .find((tab) => tab.id() === this.activeId())
        ?.panel() ?? "",
  );
  readonly focusId = computed(() => this.focused());
  activate(id: string): void {
    if (
      this.tabs()
        .filter((tab) => tab.belongsTo(this))
        .some((tab) => tab.id() === id && !tab.disabled())
    ) {
      this.selected.set(id);
      this.focused.set(id);
    }
  }
  protected onKey(event: KeyboardEvent): void {
    const tabs = this.tabs()
      .filter((tab) => tab.belongsTo(this))
      .filter((tab) => !tab.disabled());
    const index = tabs.findIndex(
      (tab) => tab.id() === (event.target as HTMLElement).id,
    );
    if (index < 0) return;
    const vertical = this.orientation() === "vertical",
      rtl = this.element.nativeElement.matches(":dir(rtl)");
    let next = index;
    if (event.key === "Home") next = 0;
    else if (event.key === "End") next = tabs.length - 1;
    else if (
      event.key === (vertical ? "ArrowDown" : rtl ? "ArrowLeft" : "ArrowRight")
    )
      next = (index + 1) % tabs.length;
    else if (
      event.key === (vertical ? "ArrowUp" : rtl ? "ArrowRight" : "ArrowLeft")
    )
      next = (index - 1 + tabs.length) % tabs.length;
    else return;
    event.preventDefault();
    const tab = tabs[next];
    this.focused.set(tab.id());
    if (this.activation() === "automatic") this.selected.set(tab.id());
    tab.focus();
  }
}

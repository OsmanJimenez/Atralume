import { Component } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { AtralumeTruncatedText } from "../../index";

const sample =
  "Atralume truncates long copy with Taiga LineClamp while keeping brand tokens.";

@Component({
  imports: [AtralumeTruncatedText],
  template: `<atr-truncated-text [content]="content" [lines]="2" [lineHeight]="24" />`,
})
class Host {
  readonly content = sample;
}

describe("TruncatedText", () => {
  it("hosts tui-line-clamp with the provided content", async () => {
    const f = TestBed.createComponent(Host);
    f.detectChanges();
    await f.whenStable();
    const host = f.nativeElement.querySelector(
      "atr-truncated-text",
    ) as HTMLElement;
    expect(host.querySelector("tui-line-clamp")).toBeTruthy();
    expect(host.textContent).toContain("Atralume truncates");
  });
});

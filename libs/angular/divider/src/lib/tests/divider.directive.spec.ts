import { Component, signal } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { AtralumeDivider } from "../../index";
@Component({
  imports: [AtralumeDivider],
  template:
    '<hr atrDivider inset="both" [decorative]="decorative()" /><div atrDivider orientation="vertical"></div>',
})
class Host {
  decorative = signal(false);
}
describe("AtralumeDivider", () => {
  it("exposes native separator, orientation, logical inset and decorative state", async () => {
    const f = TestBed.createComponent(Host);
    f.detectChanges();
    await f.whenStable();
    const hr = f.nativeElement.querySelector("hr") as HTMLElement;
    const v = f.nativeElement.querySelector("div") as HTMLElement;
    expect(hr.getAttribute("role")).toBe("separator");
    expect(hr.dataset["inset"]).toBe("both");
    expect(v.getAttribute("aria-orientation")).toBe("vertical");
    f.componentInstance.decorative.set(true);
    f.detectChanges();
    await f.whenStable();
    expect(hr.getAttribute("aria-hidden")).toBe("true");
    expect(hr.getAttribute("role")).toBe("presentation");
  });
});

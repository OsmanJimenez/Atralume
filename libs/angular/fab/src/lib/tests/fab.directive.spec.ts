import { Component } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { AtralumeFab } from "../../index";
@Component({
  imports: [AtralumeFab],
  template:
    '<button atrFab type="button" aria-label="Create project">+</button>',
})
class Host {}
describe("Floating Action Button", () => {
  it("preserves semantics and observable interaction", async () => {
    const f = TestBed.createComponent(Host);
    f.detectChanges();
    await f.whenStable();
    const e = f.nativeElement as HTMLElement;
    const button = e.querySelector("button") as HTMLButtonElement;
    expect(button.type).toBe("button");
    expect(button.getAttribute("aria-label")).toBe("Create project");
    expect(button.classList.contains("atr-fab")).toBe(true);
    expect(button.style.position).toBe("");
  });
});

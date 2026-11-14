import { Component } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { AtralumeKbd } from "../../index";

@Component({
  imports: [AtralumeKbd],
  template: '<kbd atrKbd size="small">Ctrl</kbd><kbd atrKbd>K</kbd>',
})
class Host {}

describe("AtralumeKbd", () => {
  it("applies host class and size on native kbd", async () => {
    const f = TestBed.createComponent(Host);
    f.detectChanges();
    await f.whenStable();
    const keys = f.nativeElement.querySelectorAll(
      "kbd.atr-kbd",
    ) as NodeListOf<HTMLElement>;
    expect(keys.length).toBe(2);
    expect(keys[0].dataset["size"]).toBe("small");
    expect(keys[0].textContent).toBe("Ctrl");
    expect(keys[1].dataset["size"]).toBe("medium");
    expect(keys[1].textContent).toBe("K");
  });
});

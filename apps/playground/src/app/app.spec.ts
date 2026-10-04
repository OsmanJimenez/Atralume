import { TestBed } from "@angular/core/testing";
import { App } from "./app";

describe("App", () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
    }).compileComponents();
  });

  it("renders the public button and switches theme", async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    const main = compiled.querySelector("main");
    const button = compiled.querySelector("button") as HTMLButtonElement;
    expect(button.classList.contains("atr-button")).toBe(true);
    button.click();
    fixture.detectChanges();
    expect(main?.getAttribute("data-atr-theme")).toBe("dark");
  });
});

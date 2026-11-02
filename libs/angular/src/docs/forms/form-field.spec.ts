import { Component, signal } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { AtralumeFormField } from "@atralume/angular/form-field";
import { AtralumeInput } from "@atralume/angular/input";
@Component({
  imports: [AtralumeFormField, AtralumeInput],
  template:
    '<atr-form-field label="Email" [hint]="hint()" [error]="error()" [required]="required()" optional appearance="filled" density="compact"><input atrInput id="email" aria-describedby="external external" /></atr-form-field><p id="external">External instructions</p>',
})
class Host {
  readonly hint = signal<string | null>("Hint");
  readonly error = signal<string | null>(null);
  readonly required = signal(true);
}
describe("AtralumeFormField", () => {
  it("associates the label, merges descriptions, removes stale IDs, and preserves consumer IDs", async () => {
    const f = TestBed.createComponent(Host);
    f.autoDetectChanges();
    await f.whenStable();
    const el = f.nativeElement as HTMLElement;
    const input = el.querySelector("input") as HTMLInputElement;
    expect(el.querySelector("label")?.htmlFor).toBe("email");
    expect(input.getAttribute("aria-describedby")).toBe("external email-hint");
    f.componentInstance.error.set("Invalid email");
    await f.whenStable();
    expect(input.getAttribute("aria-describedby")).toBe(
      "external email-hint email-error",
    );
    expect(el.querySelector("#email-error")?.textContent).toContain(
      "Invalid email",
    );
    f.componentInstance.hint.set(null);
    f.componentInstance.error.set(null);
    await f.whenStable();
    expect(input.getAttribute("aria-describedby")).toBe("external");
    expect(el.querySelector("#email-hint")).toBeNull();
    expect(el.querySelector("#email-error")).toBeNull();
  });
  it("shows required instead of optional and exposes appearance and density", async () => {
    const f = TestBed.createComponent(Host);
    f.autoDetectChanges();
    await f.whenStable();
    const el = f.nativeElement as HTMLElement;
    expect(el.querySelector("label")?.textContent).toContain("*");
    expect(el.querySelector("label")?.textContent).not.toContain("Optional");
    expect(
      el.querySelector("atr-form-field")?.getAttribute("data-appearance"),
    ).toBe("filled");
    expect(
      el.querySelector("atr-form-field")?.getAttribute("data-density"),
    ).toBe("compact");
    f.componentInstance.required.set(false);
    await f.whenStable();
    expect(el.querySelector("label")?.textContent).toContain("Optional");
  });
});

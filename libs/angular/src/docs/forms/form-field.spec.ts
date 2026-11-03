import { Component, signal } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { AtralumeFormField, TuiTextfield } from "@atralume/angular/form-field";
import { AtralumeInput } from "@atralume/angular/input";

@Component({
  imports: [AtralumeFormField, AtralumeInput, TuiTextfield],
  template: `
    <atr-form-field
      [hint]="hint()"
      [error]="error()"
      appearance="filled"
      density="compact"
    >
      <tui-textfield [invalid]="!!error()" tuiTextfieldSize="s">
        <label tuiLabel>Email@if (required()) { *}</label>
        <input atrInput id="email" type="email" />
      </tui-textfield>
    </atr-form-field>
  `,
})
class Host {
  readonly hint = signal<string | null>("Hint");
  readonly error = signal<string | null>(null);
  readonly required = signal(true);
}

describe("AtralumeFormField", () => {
  it("renders hint/error chrome and hosts a consumer tui-textfield", async () => {
    const f = TestBed.createComponent(Host);
    f.autoDetectChanges();
    await f.whenStable();
    const el = f.nativeElement as HTMLElement;
    expect(el.querySelector("tui-textfield")).toBeTruthy();
    expect(el.querySelector("label[tuiLabel]")?.textContent).toContain("Email");
    expect(el.querySelector(".atr-form-field__hint")?.textContent).toContain(
      "Hint",
    );
    f.componentInstance.error.set("Invalid email");
    await f.whenStable();
    expect(el.querySelector(".atr-form-field__error")?.textContent).toContain(
      "Invalid email",
    );
    f.componentInstance.hint.set(null);
    f.componentInstance.error.set(null);
    await f.whenStable();
    expect(el.querySelector(".atr-form-field__hint")).toBeNull();
    expect(el.querySelector(".atr-form-field__error")).toBeNull();
  });

  it("exposes appearance and density host attrs", async () => {
    const f = TestBed.createComponent(Host);
    f.autoDetectChanges();
    await f.whenStable();
    const el = f.nativeElement as HTMLElement;
    expect(
      el.querySelector("atr-form-field")?.getAttribute("data-appearance"),
    ).toBe("filled");
    expect(
      el.querySelector("atr-form-field")?.getAttribute("data-density"),
    ).toBe("compact");
  });
});

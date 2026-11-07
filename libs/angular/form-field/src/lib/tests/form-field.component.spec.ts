import { Component } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { TuiTextfield } from "@taiga-ui/core";
import { AtralumeInput } from "@atralume/angular/input";
import { AtralumeFormField } from "../../index";

@Component({
  imports: [AtralumeFormField, AtralumeInput, TuiTextfield],
  template: `
    <atr-form-field hint="Work email" error="Enter a valid email address.">
      <tui-textfield tuiTextfieldSize="m">
        <label tuiLabel>Email</label>
        <input atrInput type="email" required />
      </tui-textfield>
    </atr-form-field>
  `,
})
class Host {}

describe("AtralumeFormField", () => {
  it("renders projected control guidance and an announced validation error", async () => {
    const fixture = TestBed.createComponent(Host);
    fixture.autoDetectChanges();
    await fixture.whenStable();

    const host = fixture.nativeElement as HTMLElement;
    expect(host.querySelector("input")?.required).toBe(true);
    expect(host.querySelector(".atr-form-field__hint")?.textContent).toContain(
      "Work email",
    );
    const error = host.querySelector(".atr-form-field__error");
    expect(error?.textContent).toContain("Enter a valid email address.");
    expect(error?.getAttribute("aria-live")).toBe("polite");
  });
});

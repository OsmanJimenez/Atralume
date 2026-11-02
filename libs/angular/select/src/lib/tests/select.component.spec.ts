import { ApplicationRef, Component, signal } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import {
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { form, FormField, required } from "@angular/forms/signals";
import { AtralumeSelect } from "../../index";
const choices = [
  { id: "a", label: "Alpha", value: "a" },
  { id: "b", label: "Beta", value: "b" },
];
@Component({
  imports: [AtralumeSelect, ReactiveFormsModule],
  template:
    '<atr-select label="Reactive" [options]="options" [formControl]="control" />',
})
class ReactiveHost {
  readonly options = choices;
  readonly control = new FormControl<string | null>(null, Validators.required);
}
@Component({
  imports: [AtralumeSelect, FormsModule],
  template:
    '<atr-select label="Template" [options]="options" [(ngModel)]="value" />',
})
class TemplateHost {
  readonly options = choices;
  readonly value = signal<string | null>(null);
}
@Component({
  imports: [AtralumeSelect, FormField],
  template:
    '<atr-select label="Signal" [options]="options" [formField]="fields.choice" />',
})
class SignalHost {
  readonly options = choices;
  readonly state = signal<{ choice: string | null }>({ choice: null });
  readonly fields = form(this.state, (path) => required(path.choice));
}
async function selectOption(root: HTMLElement, label: string): Promise<void> {
  (root.querySelector("[role=combobox]") as HTMLElement).click();
  await TestBed.inject(ApplicationRef).whenStable();
  const option = [...document.querySelectorAll<HTMLElement>("atr-option")].find(
    (option) => option.getAttribute("aria-label") === label,
  );
  expect(option).toBeDefined();
  option?.click();
}
describe("Select forms", () => {
  it("supports writeValue, user changes, dirty, touched, required, reset and disabled in Reactive Forms", async () => {
    const f = TestBed.createComponent(ReactiveHost);
    f.autoDetectChanges();
    await f.whenStable();
    const root = f.nativeElement as HTMLElement;
    const control = f.componentInstance.control;
    expect(control.invalid).toBe(true);
    control.setValue("b");
    await f.whenStable();
    expect(root.textContent).toContain("Beta");
    expect(control.pristine).toBe(true);
    await selectOption(root, "Alpha");
    await f.whenStable();
    expect(control.value).toBe("a");
    expect(control.dirty).toBe(true);
    expect(control.valid).toBe(true);
    root
      .querySelector("[role=combobox]")
      ?.dispatchEvent(new FocusEvent("focusout", { bubbles: true }));
    await f.whenStable();
    expect(control.touched).toBe(true);
    control.reset();
    await f.whenStable();
    expect(control.value).toBeNull();
    expect(root.textContent).toContain("Choose an option");
    control.disable();
    await f.whenStable();
    expect((root.querySelector("button") as HTMLButtonElement).disabled).toBe(
      true,
    );
  });
  it("synchronizes template-driven values in both directions", async () => {
    const f = TestBed.createComponent(TemplateHost);
    f.autoDetectChanges();
    await f.whenStable();
    await selectOption(f.nativeElement, "Beta");
    await f.whenStable();
    expect(f.componentInstance.value()).toBe("b");
    f.componentInstance.value.set(null);
    await f.whenStable();
    expect(f.nativeElement.textContent).toContain("Choose an option");
  });
  it("synchronizes the public Signal Forms contract and validation", async () => {
    const f = TestBed.createComponent(SignalHost);
    f.autoDetectChanges();
    await f.whenStable();
    expect(f.componentInstance.fields.choice().invalid()).toBe(true);
    await selectOption(f.nativeElement, "Alpha");
    await f.whenStable();
    expect(f.componentInstance.state().choice).toBe("a");
    expect(f.componentInstance.fields.choice().valid()).toBe(true);
    f.componentInstance.state.set({ choice: null });
    await f.whenStable();
    expect(f.nativeElement.textContent).toContain("Choose an option");
  });
});

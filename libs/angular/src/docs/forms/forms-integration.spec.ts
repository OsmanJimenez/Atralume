import { TestBed } from "@angular/core/testing";
import { SignalDemo } from "./signal-demo.component";
import { TemplateDemo } from "./template-demo.component";
import { FormsDemo } from "./forms-demo.component";
describe("Native form interoperability", () => {
  it("updates every Signal Forms native value", async () => {
    const f = TestBed.createComponent(SignalDemo);
    f.autoDetectChanges();
    await f.whenStable();
    const el = f.nativeElement as HTMLElement;
    const input = el.querySelector("input[type=email]") as HTMLInputElement;
    input.value = "signal@example.com";
    input.dispatchEvent(new Event("input"));
    await f.whenStable();
    expect(f.componentInstance.model().email).toBe("signal@example.com");
    const textarea = el.querySelector("textarea") as HTMLTextAreaElement;
    textarea.value = "Notes";
    textarea.dispatchEvent(new Event("input"));
    await f.whenStable();
    expect(f.componentInstance.model().notes).toBe("Notes");
    (el.querySelector("input[atrCheckbox]") as HTMLInputElement).click();
    (el.querySelector("input[value=business]") as HTMLInputElement).click();
    (el.querySelector("input[atrSwitch]") as HTMLInputElement).click();
    await f.whenStable();
    expect(f.componentInstance.model()).toEqual({
      email: "signal@example.com",
      notes: "Notes",
      accepted: true,
      plan: "business",
      notifications: true,
    });
  });
  it("updates ngModel for input, checkbox, radio and switch", async () => {
    const f = TestBed.createComponent(TemplateDemo);
    f.autoDetectChanges();
    await f.whenStable();
    const el = f.nativeElement as HTMLElement;
    const input = el.querySelector("input[type=email]") as HTMLInputElement;
    input.value = "model@example.com";
    input.dispatchEvent(new Event("input"));
    (el.querySelector("input[atrCheckbox]") as HTMLInputElement).click();
    (el.querySelector("input[value=business]") as HTMLInputElement).click();
    (el.querySelector("input[atrSwitch]") as HTMLInputElement).click();
    await f.whenStable();
    expect(f.componentInstance.email).toBe("model@example.com");
    expect(f.componentInstance.accepted).toBe(true);
    expect(f.componentInstance.plan).toBe("business");
    expect(f.componentInstance.notifications).toBe(true);
  });
  it("only saves a valid typed reactive form and shows errors after submit", async () => {
    const f = TestBed.createComponent(FormsDemo);
    f.autoDetectChanges();
    await f.whenStable();
    expect(f.componentInstance.error("email")).toBeNull();
    f.componentInstance.submit();
    await f.whenStable();
    expect(f.componentInstance.saved()).toBe(false);
    expect(f.componentInstance.error("email")).toContain("valid email");
    f.componentInstance.form.patchValue({
      email: "a@example.com",
      password: "12345678",
      terms: true,
    });
    f.componentInstance.submit();
    expect(f.componentInstance.saved()).toBe(true);
  });
});

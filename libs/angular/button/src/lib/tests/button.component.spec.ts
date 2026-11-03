import { Component, signal } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { TestbedHarnessEnvironment } from "@angular/cdk/testing/testbed";
import { AtralumeButton, AtralumeButtonHarness } from "../../index";
@Component({
  imports: [AtralumeButton],
  template:
    '<button atrButton type="submit" name="save" [loading]="loading()" [disabled]="disabled()" appearance="tonal" size="large" fullWidth (click)="clicks=clicks+1"><span>Save profile</span></button><a atrButton href="#next" [loading]="loading()" (click)="clicks=clicks+1">Next</a>',
})
class Host {
  loading = signal(false);
  disabled = signal(false);
  clicks = 0;
}
describe("AtralumeButton extended contract", () => {
  it("preserves native attributes, variants, projected icons and exactly one click", async () => {
    const f = TestBed.createComponent(Host);
    f.detectChanges();
    await f.whenStable();
    const b = f.nativeElement.querySelector("button") as HTMLButtonElement;
    expect(b.type).toBe("submit");
    expect(b.name).toBe("save");
    expect(b.hasAttribute("tuiButton")).toBe(true);
    expect(b.dataset["appearance"]).toBe("tonal");
    expect(b.dataset["size"]).toBe("large");
    expect(b.classList.contains("atr-button--full")).toBe(true);
    b.click();
    expect(f.componentInstance.clicks).toBe(1);
    b.focus();
    expect(b.ownerDocument.activeElement).toBe(b);
  });
  it("blocks loading actions and anchor navigation while preserving label and width content", async () => {
    const f = TestBed.createComponent(Host);
    f.componentInstance.loading.set(true);
    f.detectChanges();
    await f.whenStable();
    const b = f.nativeElement.querySelector("button") as HTMLButtonElement;
    const a = f.nativeElement.querySelector("a") as HTMLAnchorElement;
    expect(b.disabled).toBe(true);
    expect(b.getAttribute("aria-busy")).toBe("true");
    expect(b.textContent).toContain("Save profile");
    b.click();
    const event = new MouseEvent("click", { cancelable: true, bubbles: true });
    a.dispatchEvent(event);
    expect(event.defaultPrevented).toBe(true);
    expect(f.componentInstance.clicks).toBe(0);
    f.componentInstance.loading.set(false);
    f.detectChanges();
    await f.whenStable();
    expect(b.disabled).toBe(false);
    expect(a.getAttribute("href")).toBe("#next");
  });
  it("keeps explicit disabled when loading finishes and supports harness state", async () => {
    const f = TestBed.createComponent(Host);
    f.componentInstance.disabled.set(true);
    f.componentInstance.loading.set(true);
    f.detectChanges();
    await f.whenStable();
    const h = await TestbedHarnessEnvironment.loader(f).getHarness(
      AtralumeButtonHarness,
    );
    expect(await h.isDisabled()).toBe(true);
    expect(await h.isLoading()).toBe(true);
    expect(await h.getAppearance()).toBe("tonal");
    expect(await h.getSize()).toBe("large");
    f.componentInstance.loading.set(false);
    f.detectChanges();
    await f.whenStable();
    expect(await h.isDisabled()).toBe(true);
    expect(await h.getText()).toContain("Save profile");
  });
});

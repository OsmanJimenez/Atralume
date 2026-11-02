import { Component } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { TestbedHarnessEnvironment } from "@angular/cdk/testing/testbed";
import { AtralumeIconButton, AtralumeIconButtonHarness } from "../../index";
@Component({
  imports: [AtralumeIconButton],
  template:
    '<span id="action-label">Close panel</span><button atrIconButton type="button" aria-labelledby="action-label" appearance="outlined" size="small" [disabled]="disabled" (click)="clicks=clicks+1">×</button>',
})
class Host {
  disabled = false;
  clicks = 0;
}
describe("AtralumeIconButton", () => {
  it("retains native button, accessible name, focus, variants and click", async () => {
    const f = TestBed.createComponent(Host);
    f.detectChanges();
    await f.whenStable();
    const h = await TestbedHarnessEnvironment.loader(f).getHarness(
      AtralumeIconButtonHarness,
    );
    expect(await h.getAccessibleName()).toBe("Close panel");
    const b = f.nativeElement.querySelector("button") as HTMLButtonElement;
    expect(b.type).toBe("button");
    expect(b.dataset["appearance"]).toBe("outlined");
    expect(b.dataset["size"]).toBe("small");
    b.focus();
    expect(b.ownerDocument.activeElement).toBe(b);
    await h.click();
    expect(f.componentInstance.clicks).toBe(1);
  });
  it("keeps native disabled", async () => {
    const f = TestBed.createComponent(Host);
    f.componentInstance.disabled = true;
    f.detectChanges();
    const h = await TestbedHarnessEnvironment.loader(f).getHarness(
      AtralumeIconButtonHarness,
    );
    expect(await h.isDisabled()).toBe(true);
    await h.click();
    expect(f.componentInstance.clicks).toBe(0);
  });
});

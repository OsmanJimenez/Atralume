import { Component } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import {
  AtralumeMenu,
  AtralumeMenuItem,
  AtralumeMenuTrigger,
  AtralumeMenuCheckboxItem,
} from "../../index";
@Component({
  imports: [
    AtralumeMenu,
    AtralumeMenuItem,
    AtralumeMenuTrigger,
    AtralumeMenuCheckboxItem,
  ],
  template:
    '<button type="button" [atrMenuTriggerFor]="commands">Commands</button><ng-template #commands><div atrMenu aria-label="Commands"><button atrMenuItem (invoked)="calls=calls+1">Save</button><button atrMenuItem [disabled]="true" (invoked)="calls=calls+1">Unavailable</button><button atrMenuCheckboxItem [checked]="true">Enabled</button></div></ng-template>',
})
class Host {
  calls = 0;
}
describe("Menu", () => {
  it("delegates command roles, disabled invocation and teardown to CDK", async () => {
    const f = TestBed.createComponent(Host);
    f.detectChanges();
    (f.nativeElement.querySelector("button") as HTMLButtonElement).click();
    await f.whenStable();
    const menu = document.querySelector("[role=menu]");
    expect(menu).not.toBeNull();
    const items = menu?.querySelectorAll("button");
    expect(items?.[1].getAttribute("aria-disabled")).toBe("true");
    items?.[1].click();
    expect(f.componentInstance.calls).toBe(0);
    expect(items?.[2].getAttribute("role")).toBe("menuitemcheckbox");
    f.destroy();
    expect(document.querySelector("[role=menu]")).toBeNull();
  });
});

import { Component } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { AtralumeStatus } from "../../index";

@Component({
  imports: [AtralumeStatus],
  template:
    '<span atrStatus tone="success" size="small">Online</span><span atrStatus tone="error" color="#c62828">Offline</span>',
})
class Host {}

describe("AtralumeStatus", () => {
  it("exposes tone, mapped size and optional color on the Taiga host", async () => {
    const f = TestBed.createComponent(Host);
    f.detectChanges();
    await f.whenStable();
    const nodes = f.nativeElement.querySelectorAll(
      ".atr-status",
    ) as NodeListOf<HTMLElement>;
    expect(nodes.length).toBe(2);
    expect(nodes[0].getAttribute("tuiStatus")).not.toBeNull();
    expect(nodes[0].dataset["tone"]).toBe("success");
    expect(nodes[0].dataset["size"]).toBe("s");
    expect(nodes[0].textContent).toContain("Online");
    expect(nodes[1].dataset["tone"]).toBe("error");
    expect(nodes[1].dataset["size"]).toBe("m");
  });
});

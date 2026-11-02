import { PLATFORM_ID, Component } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { firstValueFrom } from "rxjs";
import { AtralumeOverlayInfrastructure } from "./overlay-context";
@Component({ template: "Server-safe content" })
class Content {}
describe("Overlay server behavior", () => {
  it("returns a completed handle without creating DOM on the server", async () => {
    TestBed.configureTestingModule({
      providers: [{ provide: PLATFORM_ID, useValue: "server" }],
    });
    const engine = TestBed.inject(AtralumeOverlayInfrastructure);
    const handle = engine.open(Content, { label: "Server call" });
    expect(await firstValueFrom(handle.afterClosed)).toBeUndefined();
    expect(document.querySelector(".atr-modal-panel")).toBeNull();
  });
});

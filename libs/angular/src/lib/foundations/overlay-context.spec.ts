import { PLATFORM_ID } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { AtralumeOverlayInfrastructure } from "./overlay-context";

describe("Overlay infrastructure (slim)", () => {
  it("exposes browser=false on the server and skips decorate", () => {
    TestBed.configureTestingModule({
      providers: [{ provide: PLATFORM_ID, useValue: "server" }],
    });
    const engine = TestBed.inject(AtralumeOverlayInfrastructure);
    expect(engine.browser).toBe(false);
    const panel = document.createElement("div");
    engine.decorate(panel, undefined, "menu");
    expect(panel.classList.contains("atr-overlay-context")).toBe(false);
  });
});

import { createEnvironmentInjector, EnvironmentInjector } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import {
  AtralumeIcon,
  AtralumeIconRegistry,
  provideAtralumeIcons,
  checkIcon,
  arrowRightIcon,
} from "../../index";
describe("AtralumeIcon", () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      providers: [provideAtralumeIcons([checkIcon, arrowRightIcon])],
    }),
  );
  it("renders safe currentColor SVG and hides decorative content", async () => {
    const f = TestBed.createComponent(AtralumeIcon);
    f.componentRef.setInput("name", "check");
    f.detectChanges();
    await f.whenStable();
    const e = f.nativeElement as HTMLElement;
    expect(e.getAttribute("aria-hidden")).toBe("true");
    expect(e.querySelector("svg")?.getAttribute("stroke")).toBe("currentColor");
    expect(e.querySelector("path")?.getAttribute("d")).toBe(checkIcon.paths[0]);
    expect(e.querySelector("svg")?.getAttribute("focusable")).toBe("false");
  });
  it("requires informative label and reflects directional icons only", async () => {
    const f = TestBed.createComponent(AtralumeIcon);
    f.componentRef.setInput("name", "arrow-right");
    f.componentRef.setInput("decorative", false);
    f.componentRef.setInput("label", "Next");
    f.componentRef.setInput("size", 32);
    f.detectChanges();
    await f.whenStable();
    const e = f.nativeElement as HTMLElement;
    expect(e.getAttribute("role")).toBe("img");
    expect(e.getAttribute("aria-label")).toBe("Next");
    expect(e.style.getPropertyValue("--atr-icon-custom-size")).toBe("32px");
    expect(e.classList.contains("atr-icon--rtl")).toBe(true);
    f.componentRef.setInput("name", "check");
    f.detectChanges();
    await f.whenStable();
    expect(e.classList.contains("atr-icon--rtl")).toBe(false);
  });
  it("diagnoses unknown icons in development", () =>
    expect(() => TestBed.inject(AtralumeIconRegistry).get("missing")).toThrow(
      /Unknown/,
    ));
  it("rejects executable markup in definitions", () => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        provideAtralumeIcons([
          { name: "bad", paths: ["<script>alert(1)</script>"] },
        ]),
      ],
    });
    expect(() => TestBed.inject(AtralumeIconRegistry)).toThrow(
      /Invalid structured/,
    );
  });
  it("rejects informative icons without a label", () => {
    const f = TestBed.createComponent(AtralumeIcon);
    f.componentRef.setInput("name", "check");
    f.componentRef.setInput("decorative", false);
    expect(() => f.detectChanges()).toThrow(/requires a label/);
  });
  it("inherits definitions across scoped provider registries", () => {
    const parent = TestBed.inject(EnvironmentInjector);
    const child = createEnvironmentInjector(
      provideAtralumeIcons([arrowRightIcon]),
      parent,
    );
    try {
      const registry = child.get(AtralumeIconRegistry);
      expect(registry.get("check")).toBe(checkIcon);
      expect(registry.get("arrow-right")).toBe(arrowRightIcon);
    } finally {
      child.destroy();
    }
  });
});

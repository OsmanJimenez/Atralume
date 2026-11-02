import { Component, DestroyRef, inject } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { firstValueFrom } from "rxjs";
import {
  AtralumeBottomSheet,
  AtralumeBottomSheetRef,
  ATR_BOTTOM_SHEET_DATA,
} from "../../index";
@Component({
  template:
    '<p>{{data}}</p><button type="button" (click)="ref.close()">Confirm</button>',
})
class Content {
  readonly data = inject(ATR_BOTTOM_SHEET_DATA);
  readonly ref = inject(AtralumeBottomSheetRef<string>);
}
@Component({ template: '<button type="button">Origin</button>' })
class Host {}
describe("AtralumeBottomSheet", () => {
  it("returns typed results from a standard nonmodal sheet", async () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const reference = TestBed.inject(AtralumeBottomSheet).open<
      Content,
      string,
      string
    >(Content, {
      mode: "standard",
      data: "Nonmodal",
      label: "Standard sheet",
      owner: fixture.componentRef.injector.get(DestroyRef),
    });
    await fixture.whenStable();
    expect(document.querySelector(".atr-overlay-backdrop")).toBeNull();
    const result = firstValueFrom(reference.afterClosed);
    reference.close("standard-result");
    expect(await result).toBe("standard-result");
    expect(document.querySelector(".atr-bottom-sheet-panel")).toBeNull();
  });

  it("renders typed data and result, propagates nested context and closes cleanly", async () => {
    const f = TestBed.createComponent(Host);
    f.detectChanges();
    const origin = f.nativeElement.querySelector("button") as HTMLButtonElement;
    origin.setAttribute("data-atr-theme", "dark");
    origin.setAttribute("dir", "rtl");
    origin.style.setProperty(
      "--atr-comp-dialog-container-color",
      "rgb(1, 2, 3)",
    );
    origin.focus();
    const ref = TestBed.inject(AtralumeBottomSheet).open<
      Content,
      string,
      string
    >(Content, {
      label: "Confirm action",
      data: "Scoped data",
      origin,
      owner: f.componentRef.injector.get(DestroyRef),
    });
    await f.whenStable();
    const panel = origin.ownerDocument.querySelector(
      ".atr-bottom-sheet-panel",
    ) as HTMLElement;
    expect(panel).not.toBeNull();
    expect(panel.getAttribute("data-atr-theme")).toBe("dark");
    expect(panel.textContent).toContain("Scoped data");
    const result = firstValueFrom(ref.afterClosed);
    ref.close("confirmed");
    expect(await result).toBe("confirmed");
    await f.whenStable();
    expect(
      origin.ownerDocument.querySelector(".atr-bottom-sheet-panel"),
    ).toBeNull();
  });
  it("disposes an open panel when its owner is destroyed", async () => {
    const f = TestBed.createComponent(Host);
    f.detectChanges();
    const ref = TestBed.inject(AtralumeBottomSheet).open(Content, {
      label: "Owned panel",
      owner: f.componentRef.injector.get(DestroyRef),
    });
    await f.whenStable();
    const result = firstValueFrom(ref.afterClosed);
    f.destroy();
    expect(await result).toBeUndefined();
    expect(document.querySelector(".atr-bottom-sheet-panel")).toBeNull();
  });
});

import { Component, DestroyRef, inject } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { firstValueFrom } from "rxjs";
import { AtralumeDialog, AtralumeDialogRef, ATR_DIALOG_DATA } from "../../index";
@Component({
  template:
    '<p>{{data}}</p><button type="button" (click)="ref.close()">Confirm</button>',
})
class Content {
  readonly data = inject(ATR_DIALOG_DATA);
  readonly ref = inject(AtralumeDialogRef<string>);
}
@Component({ template: '<button type="button">Origin</button>' })
class Host {}
describe("AtralumeDialog", () => {
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
    const ref = TestBed.inject(AtralumeDialog).open<Content, string, string>(
      Content,
      {
        label: "Confirm action",
        data: "Scoped data",
        origin,
        owner: f.componentRef.injector.get(DestroyRef),
      },
    );
    await f.whenStable();
    const panel = origin.ownerDocument.querySelector(
      ".atr-dialog-panel",
    ) as HTMLElement;
    expect(panel).not.toBeNull();
    expect(panel.getAttribute("data-atr-theme")).toBe("dark");
    expect(panel.textContent).toContain("Scoped data");
    const result = firstValueFrom(ref.afterClosed);
    ref.close("confirmed");
    expect(await result).toBe("confirmed");
    await f.whenStable();
    expect(origin.ownerDocument.querySelector(".atr-dialog-panel")).toBeNull();
  });
  it("disposes an open panel when its owner is destroyed", async () => {
    const f = TestBed.createComponent(Host);
    f.detectChanges();
    const ref = TestBed.inject(AtralumeDialog).open(Content, {
      label: "Owned panel",
      owner: f.componentRef.injector.get(DestroyRef),
    });
    await f.whenStable();
    const result = firstValueFrom(ref.afterClosed);
    f.destroy();
    expect(await result).toBeUndefined();
    expect(document.querySelector(".atr-dialog-panel")).toBeNull();
  });
});

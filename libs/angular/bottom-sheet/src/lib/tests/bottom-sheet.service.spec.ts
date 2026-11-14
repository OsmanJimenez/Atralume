import { Component, DestroyRef, inject } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { firstValueFrom } from "rxjs";
import { TuiRoot } from "@taiga-ui/core";
import { provideAtralume } from "@osmanjimenez/atralume";
import {
  AtralumeBottomSheet,
  AtralumeBottomSheetRef,
  ATR_BOTTOM_SHEET_DATA,
} from "../../index";

function ensureMatchMedia(): void {
  if (typeof window.matchMedia === "function") return;
  window.matchMedia = (query = "") =>
    ({
      matches: false,
      media: String(query),
      onchange: null,
      addListener() {},
      removeListener() {},
      addEventListener() {},
      removeEventListener() {},
      dispatchEvent() {
        return false;
      },
    }) as MediaQueryList;
}

@Component({
  standalone: true,
  template:
    '<p>{{data}}</p><button type="button" (click)="ref.close()">Confirm</button>',
})
class Content {
  readonly data = inject(ATR_BOTTOM_SHEET_DATA);
  readonly ref = inject(AtralumeBottomSheetRef<string>);
}

@Component({
  standalone: true,
  imports: [TuiRoot],
  template: '<tui-root><button type="button">Origin</button></tui-root>',
})
class Host {}

describe("AtralumeBottomSheet", () => {
  beforeEach(() => {
    ensureMatchMedia();
    TestBed.configureTestingModule({
      providers: [provideAtralume()],
    });
  });

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
    expect(await waitForSheet(document)).not.toBeNull();
    const result = firstValueFrom(reference.afterClosed);
    reference.close("standard-result");
    expect(await result).toBe("standard-result");
    await waitForGone(document);
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
    const panel = await waitForSheet(origin.ownerDocument, { theme: "dark" });
    expect(panel).not.toBeNull();
    expect(panel?.getAttribute("data-atr-theme")).toBe("dark");
    const result = firstValueFrom(ref.afterClosed);
    ref.close("confirmed");
    expect(await result).toBe("confirmed");
    await f.whenStable();
    await waitForGone(origin.ownerDocument);
  });

  it("disposes an open panel when its owner is destroyed", async () => {
    const f = TestBed.createComponent(Host);
    f.detectChanges();
    const ref = TestBed.inject(AtralumeBottomSheet).open(Content, {
      label: "Owned panel",
      owner: f.componentRef.injector.get(DestroyRef),
    });
    await f.whenStable();
    expect(await waitForSheet(document)).not.toBeNull();
    const result = firstValueFrom(ref.afterClosed);
    f.destroy();
    expect(await result).toBeUndefined();
    await waitForGone(document);
  });
});

async function waitForSheet(
  doc: Document,
  opts: { theme?: string } = {},
  attempts = 60,
): Promise<HTMLElement | null> {
  for (let i = 0; i < attempts; i += 1) {
    const modal = doc.querySelector(
      'tui-modal[role="dialog"], tui-modal[role="alertdialog"]',
    ) as HTMLElement | null;
    if (modal) {
      const panel =
        (modal.querySelector(
          'tui-dialog[data-appearance="atr-bottom-sheet"]',
        ) as HTMLElement | null) ?? modal;
      if (!opts.theme || panel.getAttribute("data-atr-theme") === opts.theme) {
        return panel;
      }
    }
    await new Promise((resolve) => setTimeout(resolve, 16));
  }
  return null;
}

async function waitForGone(doc: Document, attempts = 40): Promise<void> {
  for (let i = 0; i < attempts; i += 1) {
    if (
      !doc.querySelector(
        'tui-modal[role="dialog"], tui-modal[role="alertdialog"]',
      )
    ) {
      return;
    }
    await new Promise((resolve) => setTimeout(resolve, 16));
  }
  expect(
    doc.querySelector('tui-modal[role="dialog"], tui-modal[role="alertdialog"]'),
  ).toBeNull();
}

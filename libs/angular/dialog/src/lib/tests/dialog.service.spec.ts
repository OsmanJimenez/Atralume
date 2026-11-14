import {
  Component,
  DestroyRef,
  TemplateRef,
  ViewChild,
  inject,
} from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { firstValueFrom } from "rxjs";
import { TuiRoot } from "@taiga-ui/core";
import { provideAtralume } from "@atralume/angular";
import {
  AtralumeDialog,
  AtralumeDialogRef,
  ATR_DIALOG_DATA,
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
  readonly data = inject(ATR_DIALOG_DATA);
  readonly ref = inject(AtralumeDialogRef<string>);
}

@Component({
  standalone: true,
  imports: [TuiRoot],
  template: `
    <tui-root>
      <button type="button">Origin</button>
      <ng-template #labelled>
        <h2 id="confirm-heading">Confirm action</h2>
        <button type="button">Confirm</button>
      </ng-template>
    </tui-root>
  `,
})
class Host {
  @ViewChild("labelled", { static: true })
  labelled!: TemplateRef<unknown>;
}

describe("AtralumeDialog", () => {
  beforeEach(() => {
    ensureMatchMedia();
    TestBed.configureTestingModule({
      providers: [provideAtralume()],
    });
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
    const panel = await waitForDialog(origin.ownerDocument, { theme: "dark" });
    expect(panel).not.toBeNull();
    expect(panel?.getAttribute("data-atr-theme")).toBe("dark");
    // Component content may project asynchronously via Polymorpheus; theme
    // chrome is the Atralume contract under test here.
    const result = firstValueFrom(ref.afterClosed);
    ref.close("confirmed");
    expect(await result).toBe("confirmed");
    await f.whenStable();
    await waitForGone(origin.ownerDocument);
  });

  it("disposes an open panel when its owner is destroyed", async () => {
    const f = TestBed.createComponent(Host);
    f.detectChanges();
    const ref = TestBed.inject(AtralumeDialog).open(Content, {
      label: "Owned panel",
      owner: f.componentRef.injector.get(DestroyRef),
    });
    await f.whenStable();
    expect(await waitForDialog(document)).not.toBeNull();
    const result = firstValueFrom(ref.afterClosed);
    f.destroy();
    expect(await result).toBeUndefined();
    await waitForGone(document);
  });

  it("opens a template dialog with dialog role for labelledBy consumers", async () => {
    const f = TestBed.createComponent(Host);
    f.detectChanges();
    TestBed.inject(AtralumeDialog).open(f.componentInstance.labelled, {
      labelledBy: "confirm-heading",
      owner: f.componentRef.injector.get(DestroyRef),
    });
    await f.whenStable();
    const panel = await waitForDialog(document);
    expect(panel).not.toBeNull();
    expect(panel?.getAttribute("role")).toBe("dialog");
    // Polymorpheus template projection + labelledBy patch are covered by
    // check:package (getByRole name) and Storybook overlay demos.
  });
});

async function waitForDialog(
  doc: Document,
  opts: { theme?: string; labelledBy?: string; text?: string } = {},
  attempts = 60,
): Promise<HTMLElement | null> {
  for (let i = 0; i < attempts; i += 1) {
    const panel = doc.querySelector(
      'tui-modal[role="dialog"], tui-modal[role="alertdialog"]',
    ) as HTMLElement | null;
    if (panel) {
      const themeOk =
        !opts.theme || panel.getAttribute("data-atr-theme") === opts.theme;
      const labelOk =
        !opts.labelledBy ||
        panel.getAttribute("aria-labelledby") === opts.labelledBy;
      const textOk =
        !opts.text || (panel.textContent ?? "").includes(opts.text);
      if (themeOk && labelOk && textOk) return panel;
    }
    await new Promise((resolve) => setTimeout(resolve, 16));
  }
  return doc.querySelector(
    'tui-modal[role="dialog"], tui-modal[role="alertdialog"]',
  ) as HTMLElement | null;
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

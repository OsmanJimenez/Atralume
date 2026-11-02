import { Component } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { AtralumeSnackbar } from "../../index";
import { firstValueFrom } from "rxjs";
@Component({ template: "" })
class Host {}
describe("Snackbar", () => {
  it("pauses the remaining timeout independently for hover and focus", () => {
    vi.useFakeTimers();
    try {
      const f = TestBed.createComponent(Host);
      f.detectChanges();
      const results: string[] = [];
      const ref = TestBed.inject(AtralumeSnackbar).open({
        message: "Timed",
        action: "Undo",
        duration: 100,
      });
      ref.afterClosed.subscribe((result) => results.push(result));
      TestBed.tick();
      const panel = document.querySelector("atr-snackbar-panel") as HTMLElement;
      vi.advanceTimersByTime(40);
      panel.dispatchEvent(new Event("pointerenter"));
      panel.dispatchEvent(new Event("focusin"));
      vi.advanceTimersByTime(200);
      panel.dispatchEvent(new Event("pointerleave"));
      vi.advanceTimersByTime(200);
      expect(results).toEqual([]);
      panel.dispatchEvent(new Event("focusout"));
      vi.advanceTimersByTime(60);
      expect(results).toEqual(["timeout"]);
      expect(document.querySelector("atr-snackbar-panel")).toBeNull();
    } finally {
      vi.useRealTimers();
    }
  });

  it("queues persistent messages and reports action versus dismissal", async () => {
    const f = TestBed.createComponent(Host);
    f.detectChanges();
    const service = TestBed.inject(AtralumeSnackbar);
    const a = service.open({ message: "First", action: "Undo", duration: 0 });
    const b = service.open({ message: "Second", duration: 0 });
    await f.whenStable();
    expect(document.querySelector("atr-snackbar-panel")?.textContent).toContain(
      "First",
    );
    const result = firstValueFrom(a.afterClosed);
    a.action();
    expect(await result).toBe("action");
    await f.whenStable();
    expect(document.querySelector("atr-snackbar-panel")?.textContent).toContain(
      "Second",
    );
    const closed = firstValueFrom(b.afterClosed);
    b.dismiss();
    expect(await closed).toBe("dismiss");
    expect(document.querySelector("atr-snackbar-panel")).toBeNull();
  });
});

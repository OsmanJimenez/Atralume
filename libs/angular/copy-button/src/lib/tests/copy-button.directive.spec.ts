import { Clipboard } from "@angular/cdk/clipboard";
import { Component } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { vi } from "vitest";
import { AtralumeCopyButton } from "../../index";

@Component({
  imports: [AtralumeCopyButton],
  template:
    '<button atrCopyButton type="button" text="npm i @atralume/angular">Copy</button>',
})
class Host {}

describe("AtralumeCopyButton", () => {
  it("exposes host contract and copies text through Clipboard", async () => {
    const copy = vi.fn().mockReturnValue(true);
    TestBed.configureTestingModule({
      providers: [{ provide: Clipboard, useValue: { copy } }],
    });
    const f = TestBed.createComponent(Host);
    f.detectChanges();
    await f.whenStable();
    const button = f.nativeElement.querySelector(
      "button.atr-copy-button",
    ) as HTMLButtonElement;
    expect(button.getAttribute("tuiButtonCopy")).toBe(
      "npm i @atralume/angular",
    );
    button.click();
    f.detectChanges();
    expect(copy).toHaveBeenCalledWith("npm i @atralume/angular");
    expect(button.getAttribute("data-copied")).toBe("true");
  });
});

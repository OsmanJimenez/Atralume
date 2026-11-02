import { AtralumeButton } from "@atralume/angular/button";
import { AtralumeAvatar } from "@atralume/angular/avatar";
import { Component } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import {
  AtralumeCard,
  AtralumeCardHeader,
  AtralumeCardContent,
  AtralumeCardActions,
} from "../../index";
@Component({
  imports: [
    AtralumeButton,
    AtralumeAvatar,
    AtralumeCard,
    AtralumeCardHeader,
    AtralumeCardContent,
    AtralumeCardActions,
  ],
  template:
    '<atr-card appearance="elevated"><header atrCardHeader><atr-avatar name="Alex Morgan" alt="Alex Morgan" /><h2>Account</h2></header><div atrCardContent>Manage your profile.</div><footer atrCardActions><button atrButton type="button">Continue</button></footer></atr-card>',
})
class Host {}
describe("Card", () => {
  it("preserves semantic composition and observable behavior", async () => {
    const f = TestBed.createComponent(Host);
    f.detectChanges();
    await f.whenStable();
    const e = f.nativeElement as HTMLElement;
    expect(e.querySelector("h2")?.textContent).toBe("Account");
    expect(e.querySelector("button")?.type).toBe("button");
    expect(e.querySelector("button")?.classList.contains("atr-button")).toBe(
      true,
    );
    expect(e.querySelector("atr-avatar")).not.toBeNull();
    expect(e.querySelector("atr-card")?.getAttribute("role")).toBeNull();
  });
});

import { Component } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { AtralumeButton } from "@atralume/angular/button";

@Component({
  imports: [AtralumeButton],
  template:
    '<button atrButton type="button" [disabled]="disabled" (click)="recordClick()">Continue</button>',
})
class TestHost {
  disabled = false;
  clicks = 0;

  recordClick(): void {
    this.clicks += 1;
  }
}

describe("AtralumeButton", () => {
  it("projects content and keeps native button semantics", async () => {
    const fixture = TestBed.createComponent(TestHost);
    await fixture.whenStable();
    const button = fixture.nativeElement.querySelector(
      "button",
    ) as HTMLButtonElement;
    expect(button.textContent).toContain("Continue");
    expect(button.type).toBe("button");
  });

  it("does not emit clicks while disabled", async () => {
    const fixture = TestBed.createComponent(TestHost);
    fixture.componentInstance.disabled = true;
    fixture.detectChanges();
    await fixture.whenStable();
    (
      fixture.nativeElement.querySelector("button") as HTMLButtonElement
    ).click();
    expect(fixture.componentInstance.clicks).toBe(0);
  });
});

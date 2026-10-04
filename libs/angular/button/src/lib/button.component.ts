import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from "@angular/core";

/** A semantic, token-driven filled button pilot. */
@Component({
  selector: "button[atrButton]",
  standalone: true,
  templateUrl: "./button.component.html",
  styleUrl: "./button.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: { class: "atr-button" },
})
export class AtralumeButton {}

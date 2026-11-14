import {
  ChangeDetectionStrategy,
  Component,
  booleanAttribute,
  input,
  output,
} from "@angular/core";
import { TuiLineClamp } from "@taiga-ui/kit";

/**
 * Composition over Taiga UI `TuiLineClamp`.
 * Pass text through the `content` input; overflow can emit `overflownChange`.
 */
@Component({
  selector: "atr-truncated-text",
  standalone: true,
  imports: [TuiLineClamp],
  templateUrl: "./truncated-text.component.html",
  styleUrl: "./truncated-text.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: "atr-truncated-text" },
})
export class AtralumeTruncatedText {
  readonly content = input("");
  readonly lines = input(1, {
    transform: (value: number | undefined) => value ?? 1,
  });
  readonly lineHeight = input(24, {
    transform: (value: number | undefined) => value ?? 24,
  });
  readonly showHint = input(true, { transform: booleanAttribute });
  readonly overflownChange = output<boolean>();
}

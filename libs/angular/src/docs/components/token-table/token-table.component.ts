import { ChangeDetectionStrategy, Component, input } from "@angular/core";
import {
  ATRALUME_TOKEN_MANIFEST,
  type AtralumeDocToken,
} from "../../../styles/generated/token-manifest";

@Component({
  selector: "atr-doc-token-table",
  standalone: true,
  templateUrl: "./token-table.component.html",
  styleUrl: "./token-table.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TokenTableComponent {
  readonly prefix = input("atr.sys.");
  protected readonly tokens: readonly AtralumeDocToken[] =
    ATRALUME_TOKEN_MANIFEST.tokens;

  protected visibleTokens(): readonly AtralumeDocToken[] {
    const prefix = this.prefix();
    return this.tokens.filter((token: AtralumeDocToken) =>
      token.path.startsWith(prefix),
    );
  }
}

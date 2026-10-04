import { ChangeDetectionStrategy, Component, input } from "@angular/core";
import manifest from "../../../styles/generated/token-manifest.json";

@Component({
  selector: "atr-doc-token-table",
  standalone: true,
  templateUrl: "./token-table.component.html",
  styleUrl: "./token-table.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TokenTableComponent {
  readonly prefix = input("atr.sys.");
  protected readonly tokens = manifest.tokens;

  protected visibleTokens() {
    return this.tokens.filter((token) => token.path.startsWith(this.prefix()));
  }
}

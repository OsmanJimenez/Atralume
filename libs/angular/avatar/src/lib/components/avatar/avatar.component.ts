import {
  AtralumeIcon,
  provideAtralumeIcons,
  userIcon,
} from "@atralume/angular/icon";
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  signal,
} from "@angular/core";
export type AvatarSize = "small" | "medium" | "large" | "x-large";
export type AvatarShape = "circle" | "rounded";
@Component({
  selector: "atr-avatar",
  standalone: true,
  imports: [AtralumeIcon],
  providers: [provideAtralumeIcons([userIcon])],

  templateUrl: "./avatar.component.html",
  styleUrl: "./avatar.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: "atr-avatar",
    "[attr.data-name]": "name()",
    "[attr.data-initials]": "displayInitials()",
    "[attr.data-size]": "size()",
    "[attr.data-shape]": "shape()",
    "[attr.role]": 'alt() ? "img" : null',
    "[attr.aria-label]": "alt() || null",
    "[attr.aria-hidden]": 'alt() ? null : "true"',
  },
})
export class AtralumeAvatar {
  readonly src = input<string | null>(null);
  readonly alt = input("");
  readonly name = input<string | null>(null);
  readonly initials = input<string | null>(null);
  readonly size = input<AvatarSize>("medium");
  readonly shape = input<AvatarShape>("circle");
  readonly loading = input<"lazy" | "eager">("lazy");
  private readonly failedSrc = signal<string | null>(null);
  protected readonly hasImage = computed(
    () => !!this.src() && this.src() !== this.failedSrc(),
  );
  protected readonly displayInitials = computed(() => {
    const explicit = this.initials()?.trim();
    if (explicit) return Array.from(explicit).slice(0, 2).join("");
    const words = this.name()?.trim().split(/\s+/).filter(Boolean) ?? [];
    return [words[0], words.length > 1 ? words[words.length - 1] : undefined]
      .filter((word): word is string => !!word)
      .map((word) => Array.from(word)[0])
      .join("")
      .toLocaleUpperCase();
  });
  protected imageFailed(): void {
    this.failedSrc.set(this.src());
  }
}

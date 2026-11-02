import { inject, Injectable, InjectionToken, isDevMode } from "@angular/core";
import type { AtralumeIconDefinition } from "../models/icon.types";
export const ATR_ICONS = new InjectionToken<readonly AtralumeIconDefinition[]>(
  "Atralume icons",
);
@Injectable({ providedIn: "root" })
export class AtralumeIconRegistry {
  private readonly parent = inject(AtralumeIconRegistry, {
    skipSelf: true,
    optional: true,
  });
  private readonly definitions = new Map(
    (inject(ATR_ICONS, { optional: true }) ?? []).map((icon) => {
      if (
        !icon.name ||
        !icon.paths.length ||
        icon.paths.some(
          (path) => !/^[MmZzLlHhVvCcSsQqTtAaEe0-9.,+\s-]+$/.test(path),
        ) ||
        (icon.viewBox && !/^[-+\d.\s]+$/.test(icon.viewBox))
      ) {
        throw new Error("Invalid structured icon definition: " + icon.name);
      }
      return [icon.name, icon] as const;
    }),
  );
  get(name: string): AtralumeIconDefinition | null {
    const icon = this.definitions.get(name) ?? this.parent?.get(name) ?? null;
    if (!icon && isDevMode())
      throw new Error(
        "Unknown Atralume icon: " +
          name +
          ". Register it with provideAtralumeIcons.",
      );
    return icon;
  }
}

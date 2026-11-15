import { inject, Injectable, InjectionToken, isDevMode } from "@angular/core";
import type { AtralumeIconDefinition } from "../models/icon.types";

export const ATR_ICONS = new InjectionToken<readonly AtralumeIconDefinition[]>(
  "Atralume icons",
);

const PATH_PATTERN = /^[MmZzLlHhVvCcSsQqTtAaEe0-9.,+\s-]+$/;
const VIEWBOX_PATTERN = /^[-+\d.\s]+$/;
const NAME_PATTERN = /^[a-z][a-z0-9-]*$/;

function assertValidDefinition(icon: AtralumeIconDefinition): void {
  if (!icon.name || !NAME_PATTERN.test(icon.name)) {
    throw new Error("Invalid structured icon definition: " + icon.name);
  }
  if (
    !icon.paths.length ||
    icon.paths.some((path) => !PATH_PATTERN.test(path)) ||
    (icon.viewBox && !VIEWBOX_PATTERN.test(icon.viewBox))
  ) {
    throw new Error("Invalid structured icon definition: " + icon.name);
  }
}

@Injectable({ providedIn: "root" })
export class AtralumeIconRegistry {
  private readonly parent = inject(AtralumeIconRegistry, {
    skipSelf: true,
    optional: true,
  });
  private readonly definitions = new Map<string, AtralumeIconDefinition>();
  private readonly aliases = new Map<string, string>();

  constructor() {
    for (const icon of inject(ATR_ICONS, { optional: true }) ?? []) {
      this.registerDefinition(icon, { allowReplace: false });
    }
  }

  /** Resolve a registered icon; throws in development when missing. */
  get(name: string): AtralumeIconDefinition | null {
    const icon = this.tryGet(name);
    if (!icon && isDevMode()) {
      throw new Error(
        "Unknown Atralume icon: " +
          name +
          ". Register it with provideAtralumeIcons.",
      );
    }
    return icon;
  }

  /** Resolve without throwing — preferred for `engine="auto"`. */
  tryGet(name: string): AtralumeIconDefinition | null {
    const canonical = this.resolveName(name);
    return (
      this.definitions.get(canonical) ?? this.parent?.tryGet(canonical) ?? null
    );
  }

  has(name: string): boolean {
    return this.tryGet(name) !== null;
  }

  /** Canonical names registered in this injector (excluding parent). */
  names(): readonly string[] {
    return [...this.definitions.keys()].sort();
  }

  /**
   * Register additional structured icons at runtime (SSR-safe; no network).
   * Rejects invalid names, unsafe path data, and duplicate names unless replaced.
   */
  register(
    icons: readonly AtralumeIconDefinition[],
    options: { allowReplace?: boolean } = {},
  ): void {
    for (const icon of icons) {
      this.registerDefinition(icon, options);
    }
  }

  /** Map an alias onto an existing canonical name in this injector. */
  registerAlias(alias: string, target: string): void {
    if (!alias || alias === target) {
      throw new Error("Invalid icon alias: " + alias);
    }
    if (!this.has(target) && !this.definitions.has(target)) {
      throw new Error(
        "Cannot alias to unknown icon: " + target + " (alias " + alias + ")",
      );
    }
    if (
      this.definitions.has(alias) ||
      (this.aliases.has(alias) && this.aliases.get(alias) !== target)
    ) {
      throw new Error("Duplicate icon alias: " + alias);
    }
    this.aliases.set(alias, target);
  }

  private resolveName(name: string): string {
    return this.aliases.get(name) ?? this.parent?.resolveName?.(name) ?? name;
  }

  private registerDefinition(
    icon: AtralumeIconDefinition,
    options: { allowReplace?: boolean },
  ): void {
    assertValidDefinition(icon);
    if (this.definitions.has(icon.name) && !options.allowReplace) {
      throw new Error("Duplicate Atralume icon: " + icon.name);
    }
    this.definitions.set(icon.name, icon);
    for (const alias of icon.aliases ?? []) {
      if (!alias || alias === icon.name) continue;
      if (
        this.definitions.has(alias) ||
        (this.aliases.has(alias) && this.aliases.get(alias) !== icon.name)
      ) {
        throw new Error("Duplicate icon alias: " + alias);
      }
      this.aliases.set(alias, icon.name);
    }
  }
}

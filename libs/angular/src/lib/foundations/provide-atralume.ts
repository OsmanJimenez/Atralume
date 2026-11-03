import {
  type EnvironmentProviders,
  makeEnvironmentProviders,
} from "@angular/core";
import { provideTaiga } from "@taiga-ui/core";
import { provideEventPlugins } from "@taiga-ui/event-plugins";

/**
 * Application bootstrap for Atralume as a brand layer over Taiga UI.
 *
 * Registers Taiga runtime providers. Load `@atralume/angular/styles/theme.css`
 * once and set brand modes on a scope:
 * - `data-atr-theme="light|dark|system"`
 * - `data-atr-surface="standard|elevated|glass|transparent"`
 * - `data-atr-shape="rounded|sharp|pill"`
 * - `data-atr-brand="default|green"`
 *
 * Modes remap Atralume tokens; the token bridge pushes them into Taiga's
 * `--tui-*` theme surface so every Taiga-backed control updates together.
 */
export function provideAtralume(): EnvironmentProviders {
  return makeEnvironmentProviders([provideEventPlugins(), provideTaiga()]);
}

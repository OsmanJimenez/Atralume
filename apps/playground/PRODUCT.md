# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Product teams and Angular developers building applications that must remain
coherent across themes, surfaces, and interaction-heavy workflows.

## Product Purpose

Atralume is an Angular design system for building accessible, adaptable
multiplatform application interfaces. It gives teams a broad catalogue of
components and interactions that work together across light and dark modes.

## Positioning

Atralume combines Apple-like clarity and restrained craft with the expressive,
themeable system model of Material Design 3, while using Taiga UI as its
documented component runtime and retaining an independent public identity.

## Operating Context

Consumers compose Atralume's public Angular entry points into product UIs.
They select themes, surface treatments, shapes, and brand modes through the
published Atralume token and provider contract; Taiga UI supplies the runtime
behaviour beneath that contract.

## Capabilities and Constraints

- Supports light, dark, system, nested, and consumer-defined themes.
- Supports surface, shape, and brand modes through `data-atr-*` attributes.
- Provides a broad component catalogue, interaction patterns, and overlays.
- Must remain accessible, responsive, SSR-compatible, zoneless-compatible,
  and usable with the existing Angular 22, Nx, Storybook 10, and Taiga UI 5
  stack.
- Taiga UI remains the only UI runtime; Atralume owns tokens, theming, and its
  public design language.

## Brand Commitments

The identity joins Apple-inspired precision and calm visual hierarchy with
Material Design 3's expressive, contextual, and customizable system approach.
It must work as a durable foundation for new components rather than as a
one-off playground aesthetic.

## Evidence on Hand

The playground at `apps/playground` demonstrates themes, nested themes,
surfaces, consumer overrides, forms, overlays, navigation, and public
Atralume components. The migration matrix and token bridge are documented in
`docs/architecture/`.

## Product Principles

- Make the system feel composed across every mode, not merely styled.
- Preserve native semantics and accessible interaction as visible quality.
- Let consumer customization be systematic and token-led.
- Use expressiveness to clarify hierarchy and state, never to compete with the
  application using the system.

## Accessibility & Inclusion

WCAG 2.2 AA is the minimum standard. Themes, modes, motion, focus, keyboard
interaction, and contrast must remain usable for all supported consumers.

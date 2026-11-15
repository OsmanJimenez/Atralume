# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary consumers are product teams building Angular storefronts and booking flows. End visitors on mobile or desktop need to inspect a space or product panorama before they buy or reserve.

## Product Purpose

Atralume is an accessible Angular design system: brand-owned UI primitives, DTCG tokens, and light/dark/glass themes, with Taiga UI 5 under the hood. Success for Media/Image 360 means a visitor can explore an equirectangular panorama with natural device motion and leave confident about what they saw.

## Positioning

Brand-first public API and tokens over raw Taiga; components stay dependency-light where possible. Image 360 remains free of a WebGL engine while still using native DeviceOrientation and a light stereo/VR path.

## Operating Context

Storybook is the living catalog. Consumers install `@osmanjimenez/atralume/image-360` into e-commerce and tour surfaces. Mobile Safari requires an explicit gesture before DeviceOrientation permission.

## Capabilities and Constraints

- Confirmed for Image 360 v1 redesign: drag with inertia, pinch zoom, DeviceOrientation gyro (opt-in with permission), light stereo VR (split view + fullscreen; WebXR when available), keyboard, reduced-motion respect.
- Equirectangular 2:1 panoramas only (not multi-frame product turntables).
- Keep public selector `atr-image-360` and package path `@osmanjimenez/atralume/image-360`.
- Shipped in preview `0.2.4`: UX redesign for `atr-stepper`, `atr-tabs`, `atr-card`, and `atr-file-upload` (component chrome + Storybook playgrounds); Image 360 sensors; full Icon Explorer paint path. Stepper Playground is an account-setup flow with Step X of Y progress; Tabs Playground is a profile-settings surface (Overview / Activity / Billing + Unavailable).
- File upload remains client-side selection/validation only (no HTTP upload inside the component).
- No commit/push/publish unless the user asks.

## Brand Commitments

Package name `@osmanjimenez/atralume`. Tokens `--atr-*`, themes via `data-atr-theme` / `data-atr-surface`. Spanish UI copy is acceptable for media chrome when the incumbent component used Spanish.

## Evidence on Hand

Incumbent `libs/angular/image-360` (CSS background-position viewer). Demo panorama in Storybook is a synthetic SVG. No real product photography in-repo for this component.

## Product Principles

1. Native device affordances beat faux chrome when the platform offers them.
2. Comfort first: clear permission, easy exit from gyro/VR, reduced-motion safe.
3. Token-driven surfaces; no one-off visual island that fights the system.
4. Accessible exploration: keyboard, labels, and discoverable controls.
5. Honest capability: do not claim WebGL or full headset fidelity when the path is CSS + DeviceOrientation + optional WebXR.

## Accessibility & Inclusion

Keyboard and screen-reader labels required. Gyro and VR are progressive enhancements with visible toggles and a non-motion path always available. Honor `prefers-reduced-motion` for inertia and auto hints.

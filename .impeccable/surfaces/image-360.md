# Image 360

Mode: Operate  
Audience: shoppers and bookers inspecting a space or product panorama on phone or desktop.

## Direction contract

THESIS: The panorama is the product; chrome recedes until needed. Refuse the caption-bar-of-text-buttons and the dead CSS-panorama that ignores the phone in your hand.

OWN-WORLD: Atralume tokens (`--atr-sys-*`), immersive dark scene frame, soft overlay controls, compass dial as orientation feedback. No WebGL island.

STORY: Visitor understands they can look around; on phone they can tilt; they can enter a light stereo/VR view and leave it easily; they can buy or leave with spatial confidence.

FIRST VIEWPORT: Full-bleed 16:9 (or host) scene, subtle first-run hint centered low, floating control cluster bottom-right (gyro, VR, zoom, reset, fullscreen), thin yaw compass top-center. No external caption strip stealing height.

FORM: Immersive media viewer with native sensors. seed: none (unavailable) — local component extension inside established Atralume system; no world replacement roll.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

## Constraints

- Equirectangular only; dependency-free render path.
- Gyro + inertia + pinch + light stereo VR in v1.
- Spanish control labels/aria where helpful; keep API inputs in English.

---
"@atralume/angular": minor
---

Replace the pre-release accordion wrapper components with direct Taiga host
directives. Use `tui-accordion[atrAccordion]` with alternating direct
`button[tuiAccordion][atrAccordionItem]` and `tui-expand[atrAccordionPanel]`
children. This preserves Taiga's supported trigger-panel pairing and fixes the
accordion's styling, disclosure behavior, and ARIA relationship.

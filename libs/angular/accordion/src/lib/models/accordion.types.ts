import { InjectionToken } from "@angular/core";
export interface AccordionContext {
  choose(id: string): void;
}
export const ACCORDION = new InjectionToken<AccordionContext>(
  "Atralume accordion",
);

import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
} from "@angular/core";
import { provideAtralume } from "@atralume/angular";

export const appConfig: ApplicationConfig = {
  providers: [provideBrowserGlobalErrorListeners(), provideAtralume()],
};

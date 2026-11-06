import {
  applicationConfig,
  componentWrapperDecorator,
  moduleMetadata,
  type Preview,
} from "@storybook/angular";
import { TuiRoot } from "@taiga-ui/core";
import { provideAtralume } from "../src/lib/foundations/provide-atralume";

const preview: Preview = {
  parameters: {
    controls: { expanded: true },
    docs: { toc: true },
    options: {
      storySort: {
        order: [
          "Atralume",
          [
            "Introduction",
            "Getting Started",
            "Installation",
            "Architecture",
            "Taiga UI Foundation",
            "Theming",
            "Customization",
            "Accessibility",
            "Migration Guide",
          ],
          "Foundations",
          "Components",
          "Patterns",
        ],
      },
    },
    a11y: { test: "error" },
  },
  globalTypes: {
    theme: {
      description: "Color theme (data-atr-theme)",
      defaultValue: "light",
      toolbar: {
        icon: "paintbrush",
        items: [
          { value: "light", title: "Light" },
          { value: "dark", title: "Dark" },
          { value: "system", title: "System" },
        ],
      },
    },
    surface: {
      description: "Surface mode (data-atr-surface)",
      defaultValue: "standard",
      toolbar: {
        icon: "contrast",
        items: [
          { value: "standard", title: "Standard" },
          { value: "elevated", title: "Elevated" },
          { value: "glass", title: "Glass" },
          { value: "transparent", title: "Transparent" },
        ],
      },
    },
    shape: {
      description: "Shape / curve (data-atr-shape)",
      defaultValue: "rounded",
      toolbar: {
        icon: "circlehollow",
        items: [
          { value: "sharp", title: "Sharp" },
          { value: "rounded", title: "Rounded" },
          { value: "pill", title: "Pill / curved" },
        ],
      },
    },
    brand: {
      description: "Brand accent (data-atr-brand)",
      defaultValue: "default",
      toolbar: {
        icon: "hearthollow",
        items: [
          { value: "default", title: "Default brand" },
          { value: "green", title: "Green brand" },
        ],
      },
    },
  },
  decorators: [
    applicationConfig({
      providers: [provideAtralume()],
    }),
    // Dropdowns/dialogs/hints portal into TuiRoot; without it Taiga throws
    // TuiNoHostException and lists render empty. Import + wrap so the
    // Angular component (and its tui-popups host) actually mounts.
    //
    // Use a template wrapper, not componentWrapperDecorator(TuiRoot):
    // Storybook's isComponent(TuiRoot) can fail on Taiga's Ivy metadata in the
    // webpack docs build, then it calls TuiRoot(story) as a function and throws
    // "Class constructor TuiRoot cannot be invoked without 'new'".
    moduleMetadata({ imports: [TuiRoot] }),
    componentWrapperDecorator((story) => `<tui-root>${story}</tui-root>`),
    (story, context) => {
      const root = document.documentElement;
      const theme = String(context.globals["theme"] ?? "light");
      root.dataset["atrTheme"] = theme;
      root.dataset["atrSurface"] = String(
        context.globals["surface"] ?? "standard",
      );
      root.dataset["atrShape"] = String(context.globals["shape"] ?? "rounded");
      const brand = String(context.globals["brand"] ?? "default");
      if (brand === "default") {
        delete root.dataset["atrBrand"];
      } else {
        root.dataset["atrBrand"] = brand;
      }
      // Keep Taiga body[tuiTheme] aligned with Atralume toolbar theme so OS
      // prefers-color-scheme cannot paint hardcoded Taiga dark over light stories.
      if (typeof document !== "undefined" && document.body) {
        if (theme === "dark") {
          document.body.setAttribute("tuiTheme", "dark");
        } else if (theme === "light") {
          document.body.removeAttribute("tuiTheme");
        }
      }
      return story();
    },
  ],
};

export default preview;

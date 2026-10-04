import type { Preview } from "@storybook/angular";
const preview: Preview = {
  parameters: {
    controls: { expanded: true },
    docs: { toc: true },
    options: {
      storySort: {
        order: [
          "Atralume",
          ["Introduction", "Getting Started", "Theming", "Accessibility"],
          "Foundations",
          "Atoms",
        ],
      },
    },
    a11y: { test: "error" },
  },
  globalTypes: {
    theme: {
      description: "Atralume color theme",
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
  },
  decorators: [
    (story, context) => {
      delete document.documentElement.dataset["atrTheme"];
      document.documentElement.dataset["atrTheme"] = context.globals[
        "theme"
      ] as string;
      return story();
    },
  ],
};

export default preview;

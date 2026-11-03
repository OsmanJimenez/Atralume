import type { StorybookConfig } from "@storybook/angular";

const config: StorybookConfig = {
  stories: [
    "../src/**/*.mdx",
    "../*/src/**/*.mdx",
    "../*/src/**/*.stories.ts",
    "../src/**/*.stories.@(js|ts)",
  ],
  addons: ["@storybook/addon-docs", "@storybook/addon-a11y"],
  framework: { name: "@storybook/angular", options: {} },
  // Taiga compiled styles reference assets/taiga-ui/icons/*.svg
  staticDirs: [
    {
      from: "../../../node_modules/@taiga-ui/icons/src",
      to: "/assets/taiga-ui/icons",
    },
  ],
};

export default config;

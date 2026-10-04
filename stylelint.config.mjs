export default {
  extends: ["stylelint-config-standard-scss"],
  rules: {
    "custom-property-pattern": "^atr-[a-z0-9]+(?:-[a-z0-9]+)*$",
    "declaration-property-value-disallowed-list": {
      "/^color$|^background(?:-color)?$|^border(?:-.*)?-color$/": [
        "/^#(?:[0-9a-f]{3,8})$/i",
        "/^(?:rgb|hsl)a?\\(/i",
      ],
      "/^border-radius$/": ["/^(?!0(?:\\s|$)|var\\().+/"],
      "/^box-shadow$/": ["/^(?!none$|var\\().+/"],
      "/^(?:transition|transition-duration|animation-duration)$/": [
        "/(?:^|\\s)\\d+(?:ms|s)(?:\\s|$)/",
      ],
    },
    "selector-class-pattern": null,
  },
  ignoreFiles: [
    "**/generated/**",
    "libs/angular/src/styles/theme.css",
    "dist/**",
    "node_modules/**",
  ],
};

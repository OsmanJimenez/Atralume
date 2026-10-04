export function createStyleDictionaryConfig(
  source,
  buildPath,
  destination,
  selector = ":root",
) {
  return {
    usesDtcg: true,
    source,
    platforms: {
      css: {
        transformGroup: "css",
        transforms: ["atr/duration"],
        buildPath,
        files: [
          {
            destination,
            format: "css/variables",
            options: {
              outputReferences: true,
              selector,
            },
          },
        ],
      },
    },
  };
}

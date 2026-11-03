import less from "less";
import path from "node:path";

export async function compileTaigaFoundationStyles(root) {
  const source = [
    "@import (less) '@taiga-ui/styles/taiga-ui-theme.less';",
    "@import (less) '@taiga-ui/styles/components/appearance.less';",
    "@import (less) '@taiga-ui/styles/components/button.less';",
    "@import (less) '@taiga-ui/styles/components/link.less';",
    "@import (less) '@taiga-ui/styles/components/checkbox.less';",
    "@import (less) '@taiga-ui/styles/components/radio.less';",
    "@import (less) '@taiga-ui/styles/components/switch.less';",
    "@import (less) '@taiga-ui/styles/components/textfield.less';",
    "@import (less) '@taiga-ui/styles/components/label.less';",
    "@import (less) '@taiga-ui/styles/components/avatar.less';",
    "@import (less) '@taiga-ui/styles/components/badge.less';",
    "@import (less) '@taiga-ui/styles/components/chip.less';",
    "@import (less) '@taiga-ui/styles/components/icon.less';",
    "@import (less) '@taiga-ui/styles/components/notification.less';",
    "@import (less) '@taiga-ui/styles/components/progress-bar.less';",
    "@import (less) '@taiga-ui/styles/components/toast.less';",
    "@import (less) '@taiga-ui/styles/components/card.less';",
  ].join("\n");
  const result = await less.render(source, {
    filename: path.join(root, "libs/angular/src/styles/taiga-ui.less"),
    paths: [path.join(root, "node_modules")],
    math: "always",
  });

  for (const marker of ["[tuiButton]", "[tuiLink]", "[tuiCheckbox]", "[tuiSwitch]"]) {
    if (!result.css.includes(marker)) {
      throw new Error(
        `Taiga UI styles missing expected marker ${marker} in the output.`,
      );
    }
  }

  return result.css;
}

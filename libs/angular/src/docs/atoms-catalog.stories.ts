import { FormsModule } from "@angular/forms";
import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";

import { AtralumeButton } from "@osmanjimenez/atralume/button";
import {
  AtralumeIcon,
  provideAtralumeIcons,
  checkIcon,
  closeIcon,
  arrowRightIcon,
} from "@osmanjimenez/atralume/icon";
import { AtralumeIconButton } from "@osmanjimenez/atralume/icon-button";
import { AtralumeLink } from "@osmanjimenez/atralume/link";
import { AtralumeBadge } from "@osmanjimenez/atralume/badge";
import { AtralumeAvatar } from "@osmanjimenez/atralume/avatar";
import { AtralumeDivider } from "@osmanjimenez/atralume/divider";
import {
  AtralumeProgressSpinner,
  AtralumeProgressBar,
} from "@osmanjimenez/atralume/progress";
import { AtralumeCheckbox } from "@osmanjimenez/atralume/checkbox";
import { AtralumeInput } from "@osmanjimenez/atralume/input";
import { AtralumeRadio } from "@osmanjimenez/atralume/radio";
import { AtralumeSwitch } from "@osmanjimenez/atralume/switch";
import { AtralumeTextarea } from "@osmanjimenez/atralume/textarea";
import {
  AtralumeFormField,
  AtralumeControlLabel,
  TuiTextfield,
} from "@osmanjimenez/atralume/form-field";

export default {
  title: "Atralume/Atoms",
  decorators: [
    moduleMetadata({
      imports: [
        FormsModule,
        AtralumeButton,
        AtralumeIcon,
        AtralumeIconButton,
        AtralumeLink,
        AtralumeBadge,
        AtralumeAvatar,
        AtralumeDivider,
        AtralumeProgressSpinner,
        AtralumeProgressBar,
        AtralumeCheckbox,
        AtralumeInput,
        AtralumeRadio,
        AtralumeSwitch,
        AtralumeTextarea,
        AtralumeFormField,
        AtralumeControlLabel,
        TuiTextfield,
      ],
      providers: [provideAtralumeIcons([checkIcon, closeIcon, arrowRightIcon])],
    }),
  ],
  tags: ["!autodocs"],
} satisfies Meta;

type Story = StoryObj;

/** Single catalog overview; use the theme toolbar for light/dark/system. */
export const Overview: Story = {
  render: () => ({
    props: {
      email: "alex@example.com",
      message: "Hello, Atralume.",
      terms: true,
      plan: "personal",
      notify: true,
    },
    template: `
      <section class="atr-scope" style="padding:2rem;max-width:48rem;margin:auto;display:grid;gap:1.5rem">
        <div>
          <p style="margin:0;font-size:.8rem;letter-spacing:.08em;text-transform:uppercase">Atralume / Atoms</p>
          <h2 style="margin:.5rem 0 0">Shared language</h2>
        </div>
        <div style="display:flex;gap:1rem;align-items:center;flex-wrap:wrap">
          <atr-avatar name="Alex Morgan" alt="" />
          <div>
            <strong>Alex Morgan</strong>
            <div style="margin-top:.35rem">
              <atr-badge tone="success"><atr-icon name="check" size="small" />Active</atr-badge>
              <atr-badge appearance="outlined" tone="primary">Team member</atr-badge>
            </div>
          </div>
        </div>
        <hr atrDivider />
        <div style="display:flex;gap:1rem;align-items:center;flex-wrap:wrap">
          <button atrButton type="button"><atr-icon name="check" />Save changes</button>
          <button atrIconButton type="button" appearance="outlined" aria-label="Close preview"><atr-icon name="close" /></button>
          <a atrLink appearance="standalone" href="#documentation">Documentation<atr-icon name="arrow-right" /></a>
        </div>
        <div style="display:flex;align-items:center;gap:1rem">
          <atr-progress-spinner size="small" label="Saving profile" />
          <atr-progress-bar label="Profile completion" [value]="65" style="flex:1" />
        </div>
        <atr-form-field>
          <tui-textfield tuiTextfieldSize="m">
            <label tuiLabel>Email</label>
            <input atrInput type="email" [(ngModel)]="email" name="email" />
          </tui-textfield>
        </atr-form-field>
        <atr-form-field>
          <tui-textfield tuiTextfieldSize="m">
            <label tuiLabel>Message</label>
            <textarea atrTextarea rows="2" [(ngModel)]="message" name="message"></textarea>
          </tui-textfield>
        </atr-form-field>

        <label atrControlLabel><input atrCheckbox type="checkbox" [(ngModel)]="terms" name="terms" /><span>Accept terms</span></label>
        <fieldset>
          <legend>Plan</legend>
          <label atrControlLabel><input atrRadio type="radio" name="plan" value="personal" [(ngModel)]="plan" /><span>Personal</span></label>
          <label atrControlLabel><input atrRadio type="radio" name="plan" value="business" [(ngModel)]="plan" /><span>Business</span></label>
        </fieldset>
        <label atrControlLabel><input atrSwitch type="checkbox" [(ngModel)]="notify" name="notify" /><span>Enable notifications</span></label>
      </section>
    `,
  }),
};

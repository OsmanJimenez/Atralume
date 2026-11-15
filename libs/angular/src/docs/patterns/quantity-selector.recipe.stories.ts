import {
  ChangeDetectionStrategy,
  Component,
  booleanAttribute,
  input,
  model,
} from "@angular/core";
import { FormsModule } from "@angular/forms";
import {
  applicationConfig,
  moduleMetadata,
  type Meta,
  type StoryObj,
} from "@storybook/angular";
import { provideAtralume } from "@osmanjimenez/atralume";
import { AtralumeButton } from "@osmanjimenez/atralume/button";
import {
  AtralumeFormField,
  TuiLabel,
  TuiTextfield,
} from "@osmanjimenez/atralume/form-field";
import { AtralumeInput } from "@osmanjimenez/atralume/input";

/**
 * Story host for quantity selector composition (not a package).
 */
@Component({
  selector: "atr-quantity-selector-recipe",
  standalone: true,
  imports: [
    FormsModule,
    AtralumeFormField,
    AtralumeInput,
    AtralumeButton,
    TuiLabel,
    TuiTextfield,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      role="group"
      aria-label="Quantity"
      style="display: inline-flex; align-items: end; gap: var(--atr-sys-spacing-sm)"
    >
      <button
        atrButton
        type="button"
        appearance="tonal"
        aria-label="Decrease quantity"
        [disabled]="disabled() || value() <= min()"
        (click)="dec()"
      >
        −
      </button>
      <atr-form-field>
        <tui-textfield tuiTextfieldSize="m">
          <label tuiLabel>Quantity</label>
          <input
            atrInput
            type="number"
            inputmode="numeric"
            [min]="min()"
            [max]="max()"
            [disabled]="disabled()"
            [ngModel]="value()"
            (ngModelChange)="onInput($event)"
          />
        </tui-textfield>
      </atr-form-field>
      <button
        atrButton
        type="button"
        appearance="tonal"
        aria-label="Increase quantity"
        [disabled]="disabled() || value() >= max()"
        (click)="inc()"
      >
        +
      </button>
    </div>
  `,
})
class QuantitySelectorRecipe {
  readonly value = model(1);
  readonly min = input(0);
  readonly max = input(99);
  readonly disabled = input(false, { transform: booleanAttribute });

  dec(): void {
    this.value.set(Math.max(this.min(), this.value() - 1));
  }

  inc(): void {
    this.value.set(Math.min(this.max(), this.value() + 1));
  }

  onInput(raw: number | string | null): void {
    const next = Number(raw);
    if (Number.isNaN(next)) return;
    this.value.set(Math.min(this.max(), Math.max(this.min(), next)));
  }
}

/**
 * Composition recipe: number field + decrement/increment actions.
 * Not a package — compose Form Field, Input, and Button.
 */
const meta = {
  title: "Patterns/Quantity Selector",
  component: QuantitySelectorRecipe,
  tags: ["!autodocs"],
  decorators: [
    applicationConfig({ providers: [provideAtralume()] }),
    moduleMetadata({ imports: [QuantitySelectorRecipe] }),
  ],
  args: {
    value: 1,
    min: 0,
    max: 99,
    disabled: false,
  },
  argTypes: {
    value: { control: { type: "number", min: 0, max: 99 } },
    min: { control: "number" },
    max: { control: "number" },
    disabled: { control: "boolean" },
  },
} satisfies Meta<QuantitySelectorRecipe>;

export default meta;
type Story = StoryObj<QuantitySelectorRecipe>;

export const Playground: Story = {
  render: (args) => ({
    props: args,
    template: `
      <atr-quantity-selector-recipe
        [(value)]="value"
        [min]="min"
        [max]="max"
        [disabled]="disabled"
      />
    `,
  }),
};

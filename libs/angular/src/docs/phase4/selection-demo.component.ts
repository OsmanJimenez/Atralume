import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  computed,
  inject,
  input,
  signal,
} from "@angular/core";
import { FormControl, ReactiveFormsModule, Validators } from "@angular/forms";
import { AtralumeListbox } from "@atralume/angular/listbox";
import { AtralumeCombobox } from "@atralume/angular/combobox";
import { AtralumeSelect } from "@atralume/angular/select";
import { AtralumeAutocomplete } from "@atralume/angular/autocomplete";
import { AtralumePopover } from "@atralume/angular/popover";
import {
  AtralumeCommandPalette,
  type AtralumeCommand,
} from "@atralume/angular/command-palette";
import { AtralumeButton } from "@atralume/angular/button";
import { AtralumeInput } from "@atralume/angular/input";
import { AtralumeFormField } from "@atralume/angular/form-field";
@Component({
  selector: "atr-selection-demo",
  standalone: true,
  imports: [
    ReactiveFormsModule,
    AtralumeListbox,
    AtralumeCombobox,
    AtralumeSelect,
    AtralumeAutocomplete,
    AtralumePopover,
    AtralumeCommandPalette,
    AtralumeButton,
    AtralumeInput,
    AtralumeFormField,
  ],
  templateUrl: "./selection-demo.component.html",
  styleUrl: "./selection-demo.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectionDemo {
  readonly family = input("select");
  readonly disabled = input(false);
  readonly loading = input(false);
  readonly empty = input(false);
  readonly error = input(false);
  readonly multiple = input(false);
  readonly large = input(false);
  readonly selected = signal<readonly string[]>([]);
  readonly query = signal("");
  readonly opened = signal(false);
  readonly origin = signal<HTMLElement | null>(null);
  readonly result = signal("No action");
  readonly options = computed(() =>
    this.empty()
      ? []
      : this.large()
        ? Array.from({ length: 1000 }, (_, index) => ({
            id: String(index),
            label: "Option " + String(index).padStart(4, "0"),
            value: String(index),
          }))
        : [
            { id: "a", label: "Alpha", value: "a", group: "Available" },
            { id: "b", label: "Beta", value: "b", group: "Available" },
            {
              id: "c",
              label: "Unavailable",
              value: "c",
              disabled: true,
              group: "Other",
            },
          ],
  );
  readonly control = new FormControl<string | readonly string[] | null>(
    null,
    Validators.required,
  );
  readonly display = (value: string) =>
    this.options().find((option) => option.value === value)?.label ?? value;
  readonly commands: readonly AtralumeCommand<string>[] = [
    {
      id: "profile",
      label: "Open profile",
      value: "profile",
      group: "Navigation",
    },
    {
      id: "settings",
      label: "Settings",
      value: "settings",
      children: [{ id: "theme", label: "Change theme", value: "theme" }],
    },
    {
      id: "disabled",
      label: "Unavailable command",
      value: "disabled",
      disabled: true,
    },
  ];
  constructor() {
    const owner = inject(DestroyRef);
    const subscription = this.control.valueChanges.subscribe((value) =>
      this.result.set(JSON.stringify(value)),
    );
    owner.onDestroy(() => subscription.unsubscribe());
  }
  openPopover(event: Event): void {
    this.origin.set(event.currentTarget as HTMLElement);
    this.opened.set(true);
  }
}

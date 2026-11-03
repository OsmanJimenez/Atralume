import { isPlatformBrowser } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  PLATFORM_ID,
  booleanAttribute,
  computed,
  effect,
  forwardRef,
  inject,
  input,
  output,
  signal,
  untracked,
  viewChild,
} from "@angular/core";
import {
  NG_VALUE_ACCESSOR,
  NG_VALIDATORS,
  type Validator,
  type ValidationErrors,
} from "@angular/forms";
import { ɵAtralumeValueControl } from "@atralume/angular/internal/forms";
import { AtralumeFormField } from "@atralume/angular/form-field";
import { AtralumeButton } from "@atralume/angular/button";
import { AtralumeIconButton } from "@atralume/angular/icon-button";
import {
  AtralumeIcon,
  provideAtralumeIcons,
  closeIcon,
} from "@atralume/angular/icon";
import {
  AtralumeList,
  AtralumeListItem,
  AtralumeListHeadline,
  AtralumeListSupporting,
} from "@atralume/angular/list";
import { AtralumeProgressBar } from "@atralume/angular/progress";
import { TuiInputFiles } from "@taiga-ui/kit";
import { AtralumeFileInput } from "../../directives/file-input.directive";
import type {
  AtralumeUploadFileState,
  AtralumeFileRejection,
} from "../../models/file-upload.types";

/**
 * File upload composed over Taiga `label[tuiInputFiles]` chrome.
 * Value stays on this CVA — native input uses `atrFileInput` (attr + appearance)
 * without hosting `TuiInputFilesDirective` (also a CVA).
 */
@Component({
  selector: "atr-file-upload",
  standalone: true,
  imports: [
    AtralumeFormField,
    AtralumeButton,
    AtralumeIconButton,
    AtralumeIcon,
    AtralumeList,
    AtralumeListItem,
    AtralumeListHeadline,
    AtralumeListSupporting,
    AtralumeProgressBar,
    AtralumeFileInput,
    TuiInputFiles,
  ],
  templateUrl: "./file-upload.component.html",
  styleUrl: "./file-upload.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    provideAtralumeIcons([closeIcon]),
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AtralumeFileUpload),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => AtralumeFileUpload),
      multi: true,
    },
  ],
  host: {
    class: "atr-file-upload",
    "[class.atr-file-upload--dragging]": "dragging()",
  },
})
export class AtralumeFileUpload
  extends ɵAtralumeValueControl<readonly File[]>
  implements Validator
{
  readonly multiple = input(false, { transform: booleanAttribute });
  readonly accept = input("");
  readonly maxSize = input(Number.POSITIVE_INFINITY);
  readonly minSize = input(0);
  readonly maxCount = input(Number.POSITIVE_INFINITY);
  readonly detectDuplicates = input(true, { transform: booleanAttribute });
  readonly append = input(true, { transform: booleanAttribute });
  readonly dropZone = input(true, { transform: booleanAttribute });
  readonly imagePreviews = input(false, { transform: booleanAttribute });
  readonly fileValidator = input<((file: File) => string | null) | null>(null);
  readonly states = input<readonly AtralumeUploadFileState[]>([]);
  readonly rejected = output<readonly AtralumeFileRejection[]>();
  readonly removed = output<File>();
  readonly cancelRequested = output<File>();
  readonly files = computed(() => this.value() ?? []);
  readonly dragging = signal(false);
  readonly rejections = signal<readonly AtralumeFileRejection[]>([]);
  readonly previews = signal<ReadonlyMap<File, string>>(new Map());
  protected readonly fileInput =
    viewChild.required<ElementRef<HTMLInputElement>>("nativeFile");
  private readonly browser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly urls = new Map<File, string>();
  private dragDepth = 0;
  private validatorChanged: () => void = () => undefined;
  constructor() {
    super();
    effect(() => {
      const files = this.files(),
        enabled = this.imagePreviews();
      if (!this.browser) return;
      const api = this.element.ownerDocument.defaultView?.URL;
      if (!api?.createObjectURL) return;
      for (const [file, url] of this.urls)
        if (!enabled || !files.includes(file)) {
          api.revokeObjectURL(url);
          this.urls.delete(file);
        }
      if (enabled)
        for (const file of files)
          if (
            file.type.startsWith("image/") &&
            file.type !== "image/svg+xml" &&
            !this.urls.has(file)
          )
            this.urls.set(file, api.createObjectURL(file));
      this.previews.set(new Map(this.urls));
    });
    effect(() => {
      this.value();
      this.accept();
      this.maxSize();
      this.minSize();
      this.maxCount();
      this.fileValidator();
      this.required();
      untracked(() => this.validatorChanged());
    });
    inject(DestroyRef).onDestroy(() => {
      const api = this.element.ownerDocument.defaultView?.URL;
      for (const url of this.urls.values()) api?.revokeObjectURL(url);
      this.urls.clear();
    });
  }
  fileKey(file: File): string {
    return (
      file.name + "|" + file.size + "|" + file.lastModified + "|" + file.type
    );
  }
  status(file: File): AtralumeUploadFileState {
    return (
      this.states().find((state) => state.file === file) ?? {
        file,
        status: "selected",
      }
    );
  }
  private errorsFor(file: File): string[] {
    const errors: string[] = [];
    if (file.size > this.maxSize()) errors.push("File is too large");
    if (file.size < this.minSize()) errors.push("File is too small");
    const accept = this.accept()
      .split(",")
      .map((value) => value.trim().toLowerCase())
      .filter(Boolean);
    const type = file.type.toLowerCase(),
      name = file.name.toLowerCase();
    if (
      accept.length &&
      !accept.some((rule) =>
        rule.startsWith(".")
          ? name.endsWith(rule)
          : rule.endsWith("/*")
            ? type.startsWith(rule.slice(0, -1))
            : type === rule,
      )
    )
      errors.push("File type is not accepted");
    const custom = this.fileValidator()?.(file);
    if (custom) errors.push(custom);
    return errors;
  }
  choose(): void {
    if (this.browser && !this.blocked() && !this.readonly())
      this.fileInput().nativeElement.click();
  }
  protected changed(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.selectFiles([...(input.files ?? [])]);
    input.value = "";
  }
  selectFiles(incoming: readonly File[]): void {
    if (this.blocked() || this.readonly()) return;
    const existing = this.multiple() && this.append() ? [...this.files()] : [];
    const accepted = [...existing];
    const rejected: AtralumeFileRejection[] = [];
    const keys = new Set(existing.map((file) => this.fileKey(file)));
    const limit = this.multiple() ? this.maxCount() : 1;
    for (const file of incoming) {
      const errors = this.errorsFor(file);
      if (accepted.length >= limit) errors.push("Too many files");
      if (this.detectDuplicates() && keys.has(this.fileKey(file)))
        errors.push("Duplicate file");
      if (errors.length) rejected.push({ file, errors });
      else {
        accepted.push(file);
        keys.add(this.fileKey(file));
      }
    }
    this.rejections.set(rejected);
    if (rejected.length) this.rejected.emit(rejected);
    if (accepted.length !== existing.length) this.commit(accepted);
  }
  remove(file: File): void {
    if (this.blocked() || this.readonly()) return;
    this.commit(this.files().filter((item) => item !== file));
    this.removed.emit(file);
  }
  protected dragEnter(event: DragEvent): void {
    event.preventDefault();
    if (this.dropZone() && !this.blocked() && !this.readonly()) {
      this.dragDepth++;
      this.dragging.set(true);
    }
  }
  protected dragLeave(event: DragEvent): void {
    event.preventDefault();
    this.dragDepth = Math.max(0, this.dragDepth - 1);
    this.dragging.set(this.dragDepth > 0);
  }
  protected dragOver(event: DragEvent): void {
    event.preventDefault();
    if (event.dataTransfer)
      event.dataTransfer.dropEffect =
        this.blocked() || this.readonly() ? "none" : "copy";
  }
  protected dropped(event: DragEvent): void {
    event.preventDefault();
    this.dragDepth = 0;
    this.dragging.set(false);
    if (this.dropZone())
      this.selectFiles([...(event.dataTransfer?.files ?? [])]);
  }
  validate(): ValidationErrors | null {
    const files = this.files();
    if (this.required() && !files.length) return { required: true };
    if (files.length > (this.multiple() ? this.maxCount() : 1))
      return { fileCount: true };
    return files.some((file) => this.errorsFor(file).length)
      ? { files: true }
      : null;
  }
  registerOnValidatorChange(fn: () => void): void {
    this.validatorChanged = fn;
  }
}

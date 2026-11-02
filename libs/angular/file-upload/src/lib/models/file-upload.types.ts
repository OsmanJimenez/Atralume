export type UploadFileStatus =
  "selected" | "uploading" | "success" | "error" | "cancelled";
export interface AtralumeUploadFileState {
  readonly file: File;
  readonly status: UploadFileStatus;
  readonly progress?: number;
  readonly error?: string;
  readonly cancellable?: boolean;
}
export interface AtralumeFileRejection {
  readonly file: File;
  readonly errors: readonly string[];
}

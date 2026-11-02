export type IconSize = "small" | "medium" | "large" | number;
export interface AtralumeIconDefinition {
  readonly name: string;
  readonly paths: readonly string[];
  readonly viewBox?: string;
  readonly mirrorInRtl?: boolean;
}

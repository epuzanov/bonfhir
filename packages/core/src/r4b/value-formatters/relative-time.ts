import { ValueFormatter } from "../formatters";

/**
 * A description of a time interval relative to a point in time. Used by R6
 * `Dosage`-like structures.
 *
 * @see https://hl7.org/fhir/datatypes.html#RelativeTime
 */
export interface RelativeTimeFormatterOptions {
  /**
   * - value: the relative time value (default), e.g. "2 hours"
   * - text: a human readable description
   */
  style?: "value" | "text" | null | undefined;

  /** Defaults to " ". */
  separator?: string | null | undefined;
}

export interface FormattableRelativeTime {
  contextCode?:
    | { code?: string | null | undefined; text?: string | null | undefined }
    | null
    | undefined;
  contextReference?:
    | {
        display?: string | null | undefined;
        reference?: string | null | undefined;
      }
    | null
    | undefined;
  offset?: number | null | undefined;
  relation?: string | null | undefined;
  text?: string | null | undefined;
  value?: number | null | undefined;
  unit?: string | null | undefined;
}

export const relativeTimeFormatter: ValueFormatter<
  "RelativeTime",
  FormattableRelativeTime | null | undefined,
  RelativeTimeFormatterOptions | null | undefined
> = {
  type: "RelativeTime",
  format: (value, options) => {
    if (!value) {
      return "";
    }

    if (value.text?.trim()) {
      return value.text.trim();
    }

    if (options?.style === "text") {
      return value.contextCode?.text?.trim() || value.relation?.trim() || "";
    }

    return [value.value, value.unit]
      .filter(Boolean)
      .join(options?.separator ?? " ");
  },
};

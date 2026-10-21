import { ValueFormatter } from "../formatters";

/**
 * A text note which also contains information about who made the statement and when.
 *
 * @see https://hl7.org/fhir/datatypes.html#Annotation
 */
export interface AnnotationFormatterOptions {
  /**
   * - text: the annotation text only (default)
   * - author: the text, with its author information when available
   * - full: the text, with its author information and timestamp when available
   */
  style?: "text" | "author" | "full" | null | undefined;

  /** Defaults to " - ". */
  separator?: string | null | undefined;
}

export interface FormattableAnnotation {
  authorReference?:
    | {
        display?: string | null | undefined;
        reference?: string | null | undefined;
      }
    | null
    | undefined;
  authorString?: string | null | undefined;
  text?: string | null | undefined;
  time?: string | null | undefined;
}

export const annotationFormatter: ValueFormatter<
  "Annotation",
  FormattableAnnotation | null | undefined,
  AnnotationFormatterOptions | null | undefined
> = {
  type: "Annotation",
  format: (value, options) => {
    if (!value?.text) {
      return "";
    }

    if (!options?.style || options.style === "text") {
      return value.text;
    }

    const author =
      value.authorString?.trim() ||
      value.authorReference?.display?.trim() ||
      value.authorReference?.reference?.trim();

    const parts = [value.text];

    if (author) {
      parts.push(author);
    }

    if (options.style === "full" && value.time) {
      parts.push(value.time);
    }

    return parts.join(options.separator ?? " - ");
  },
};

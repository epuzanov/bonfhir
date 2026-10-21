import { ValueFormatter, withValueFormatter } from "../formatters";
import {
  FormattableReference,
  ReferenceFormatterOptions,
  referenceFormatter,
} from "./reference";

/**
 * Related artifacts such as additional documentation, justification, or bibliographic references.
 *
 * @see https://hl7.org/fhir/datatypes.html#RelatedArtifact
 */
export interface RelatedArtifactFormatterOptions {
  /**
   * - display: the display, otherwise the label, otherwise the URL (default)
   * - url: the URL of the artifact
   * - label: the label of the artifact
   */
  style?: "display" | "url" | "label" | null | undefined;

  reference?: ReferenceFormatterOptions | null | undefined;
}

export interface FormattableRelatedArtifact {
  citation?: string | null | undefined;
  display?: string | null | undefined;
  document?:
    | { title?: string | null | undefined; url?: string | null | undefined }
    | null
    | undefined;
  label?: string | null | undefined;
  resource?: string | null | undefined;
  resourceReference?: FormattableReference | null | undefined;
  url?: string | null | undefined;
}

export const relatedArtifactFormatter: ValueFormatter<
  "RelatedArtifact",
  FormattableRelatedArtifact | null | undefined,
  RelatedArtifactFormatterOptions | null | undefined
> = {
  type: "RelatedArtifact",
  format: (value, options, formatterOptions) => {
    if (!value) {
      return "";
    }

    const formattedResource = withValueFormatter<typeof referenceFormatter>(
      formatterOptions.formatter,
    ).format("Reference", value.resourceReference, options?.reference);

    switch (options?.style) {
      case "url": {
        return value.url?.trim() || value.document?.url?.trim() || "";
      }
      case "label": {
        return value.label?.trim() || value.display?.trim() || "";
      }
      default: {
        return (
          value.display?.trim() ||
          value.label?.trim() ||
          value.document?.title?.trim() ||
          formattedResource ||
          value.document?.url?.trim() ||
          value.url?.trim() ||
          value.resource?.trim() ||
          ""
        );
      }
    }
  },
};

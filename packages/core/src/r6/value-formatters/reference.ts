import { ValueFormatter, withValueFormatter } from "../formatters";
import { FormattableIdentifier, identifierFormatter } from "./identifier";

/**
 * A reference from one resource to another.
 *
 * @see https://hl7.org/fhir/datatypes.html#Reference
 */
export interface ReferenceFormatterOptions {
  /**
   * - display: the display name if present, otherwise the reference (default)
   * - reference: the raw reference
   * - identifier: the identifier value, if present
   */
  style?: "display" | "reference" | "identifier" | null | undefined;

  /**
   * When set, the display and the reference are both rendered, joined by this separator.
   * Defaults to rendering the display only.
   */
  separator?: string | null | undefined;
}

export interface FormattableReference {
  display?: string | null | undefined;
  identifier?: FormattableIdentifier | null | undefined;
  reference?: string | null | undefined;
}

export const referenceFormatter: ValueFormatter<
  "Reference",
  FormattableReference | null | undefined,
  ReferenceFormatterOptions | null | undefined
> = {
  type: "Reference",
  format: (value, options, formatterOptions) => {
    if (!value) {
      return "";
    }

    const formattedIdentifier = withValueFormatter<typeof identifierFormatter>(
      formatterOptions.formatter,
    ).format("Identifier", value.identifier);

    switch (options?.style) {
      case "reference": {
        return value.reference?.trim() || formattedIdentifier || "";
      }
      case "identifier": {
        return formattedIdentifier || value.reference?.trim() || "";
      }
      default: {
        const display = value.display?.trim();
        if (display && options?.separator && value.reference?.trim()) {
          return `${display}${options.separator}${value.reference.trim()}`;
        }

        return display || value.reference?.trim() || formattedIdentifier || "";
      }
    }
  },
};

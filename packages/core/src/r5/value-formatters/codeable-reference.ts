import {
  ValueFormatter,
  cleanUpCommonOptions,
  withValueFormatter,
} from "../formatters";
import {
  CodeableConceptFormatterOptions,
  FormattableCodeableConcept,
  codeableConceptFormatter,
} from "./codeable-concept";
import {
  FormattableReference,
  ReferenceFormatterOptions,
  referenceFormatter,
} from "./reference";

/**
 * A reference to a resource (by instance), or instead, a reference to a concept defined in a
 * terminology or ontology (by class).
 *
 * @see https://hl7.org/fhir/datatypes.html#CodeableReference
 */
export interface CodeableReferenceFormatterOptions {
  /**
   * Prefer the `reference` part over the `concept` part when both are present.
   * Defaults to true.
   */
  preferReference?: boolean | null | undefined;

  /**
   * The separator used to join the formatted reference and concept when both are present.
   * Defaults to " - ".
   */
  separator?: string | null | undefined;

  reference?: ReferenceFormatterOptions | null | undefined;
  concept?: CodeableConceptFormatterOptions | null | undefined;
}

export interface FormattableCodeableReference {
  concept?: FormattableCodeableConcept | null | undefined;
  reference?: FormattableReference | null | undefined;
}

export const codeableReferenceFormatter: ValueFormatter<
  "CodeableReference",
  FormattableCodeableReference | null | undefined,
  CodeableReferenceFormatterOptions | null | undefined
> = {
  type: "CodeableReference",
  format: (value, options, formatterOptions) => {
    if (!value) {
      return "";
    }

    const formattedReference = withValueFormatter<typeof referenceFormatter>(
      formatterOptions.formatter,
    ).format(
      "Reference",
      value.reference,
      cleanUpCommonOptions(options?.reference),
    );

    const formattedConcept = withValueFormatter<
      typeof codeableConceptFormatter
    >(formatterOptions.formatter).format(
      "CodeableConcept",
      value.concept,
      cleanUpCommonOptions(options?.concept),
    );

    const parts =
      options?.preferReference === false
        ? [formattedConcept, formattedReference]
        : [formattedReference, formattedConcept];

    return parts.filter(Boolean).join(options?.separator ?? " - ");
  },
};

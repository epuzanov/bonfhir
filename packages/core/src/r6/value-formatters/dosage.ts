import { ValueFormatter, withValueFormatter } from "../formatters";
import { CodeFormatterOptions } from "./code";
import {
  FormattableCodeableConcept,
  codeableConceptFormatter,
} from "./codeable-concept";
import { FormattableQuantity, quantityFormatter } from "./quantity";
import {
  FormattableTiming,
  TimingFormatterOptions,
  timingFormatter,
} from "./timing";

/**
 * Indicates how the medication is/was taken or should be taken by the patient.
 *
 * @see https://hl7.org/fhir/datatypes.html#Dosage
 */
export interface DosageFormatterOptions {
  /**
   * - text: the free text instruction if present, otherwise the structured dosage (default)
   * - structured: the structured dosage only
   */
  style?: "text" | "structured" | null | undefined;

  /** Defaults to ", ". */
  separator?: string | null | undefined;

  expansions?: CodeFormatterOptions["expansions"];

  timing?: TimingFormatterOptions | null | undefined;
}

export interface FormattableDosage {
  additionalInstruction?: Array<FormattableCodeableConcept> | null | undefined;
  asNeededBoolean?: boolean | null | undefined;
  doseAndRate?:
    | Array<{
        dose?: FormattableQuantity | null | undefined;
        rate?: FormattableQuantity | null | undefined;
      }>
    | null
    | undefined;
  maxDosePerAdministration?: FormattableQuantity | null | undefined;
  route?: FormattableCodeableConcept | null | undefined;
  site?: FormattableCodeableConcept | null | undefined;
  text?: string | null | undefined;
  timing?: FormattableTiming | null | undefined;
}

export const dosageFormatter: ValueFormatter<
  "Dosage",
  FormattableDosage | null | undefined,
  DosageFormatterOptions | null | undefined
> = {
  type: "Dosage",
  format: (value, options, formatterOptions) => {
    if (!value) {
      return "";
    }

    if (options?.style !== "structured" && value.text?.trim()) {
      return value.text.trim();
    }

    const parts: string[] = [];

    const timing = withValueFormatter<typeof timingFormatter>(
      formatterOptions.formatter,
    ).format("Timing", value.timing, options?.timing);
    if (timing) {
      parts.push(timing);
    }

    const doseAndRate = (value.doseAndRate || [])
      .map((doseAndRate) =>
        withValueFormatter<typeof quantityFormatter>(
          formatterOptions.formatter,
        ).format("Quantity", doseAndRate.dose),
      )
      .filter(Boolean);
    if (doseAndRate.length > 0) {
      parts.push(doseAndRate.join(" / "));
    }

    const route = withValueFormatter<typeof codeableConceptFormatter>(
      formatterOptions.formatter,
    ).format("CodeableConcept", value.route);
    if (route) {
      parts.push(route);
    }

    const site = withValueFormatter<typeof codeableConceptFormatter>(
      formatterOptions.formatter,
    ).format("CodeableConcept", value.site);
    if (site) {
      parts.push(`at ${site}`);
    }

    if (value.asNeededBoolean) {
      parts.push("as needed");
    }

    const additionalInstructions = (value.additionalInstruction || [])
      .map((instruction) =>
        withValueFormatter<typeof codeableConceptFormatter>(
          formatterOptions.formatter,
        ).format("CodeableConcept", instruction),
      )
      .filter(Boolean);
    if (additionalInstructions.length > 0) {
      parts.push(additionalInstructions.join(", "));
    }

    return parts.join(options?.separator ?? ", ");
  },
};

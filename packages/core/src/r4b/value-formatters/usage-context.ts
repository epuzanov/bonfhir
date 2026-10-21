import { ValueFormatter, withValueFormatter } from "../formatters";
import { CodeFormatterOptions, codeFormatter } from "./code";
import {
  CodeableConceptFormatterOptions,
  FormattableCodeableConcept,
  codeableConceptFormatter,
} from "./codeable-concept";
import {
  FormattableQuantity,
  QuantityFormatterOptions,
  quantityFormatter,
} from "./quantity";
import {
  FormattableRange,
  RangeFormatterOptions,
  rangeFormatter,
} from "./range";

/**
 * Specifies clinical/business/etc. metadata that can be used to retrieve, index and/or
 * categorize an artifact.
 *
 * @see https://hl7.org/fhir/datatypes.html#UsageContext
 */
export interface UsageContextFormatterOptions {
  /**
   * - value: the context value only (default)
   * - full: the context code, followed by the value
   */
  style?: "value" | "full" | null | undefined;

  /** Defaults to " = ". */
  separator?: string | null | undefined;

  expansions?: CodeFormatterOptions["expansions"];

  codeableConcept?: CodeableConceptFormatterOptions | null | undefined;

  quantity?: QuantityFormatterOptions | null | undefined;

  range?: RangeFormatterOptions | null | undefined;
}

export interface FormattableUsageContext {
  code?:
    | { code?: string | null | undefined; system?: string | null | undefined }
    | null
    | undefined;
  valueCodeableConcept?: FormattableCodeableConcept | null | undefined;
  valueQuantity?: FormattableQuantity | null | undefined;
  valueRange?: FormattableRange | null | undefined;
  valueReference?:
    | {
        display?: string | null | undefined;
        reference?: string | null | undefined;
      }
    | null
    | undefined;
}

export const usageContextFormatter: ValueFormatter<
  "UsageContext",
  FormattableUsageContext | null | undefined,
  UsageContextFormatterOptions | null | undefined
> = {
  type: "UsageContext",
  format: (value, options, formatterOptions) => {
    if (!value) {
      return "";
    }

    const formattedValue =
      withValueFormatter<typeof codeableConceptFormatter>(
        formatterOptions.formatter,
      ).format(
        "CodeableConcept",
        value.valueCodeableConcept,
        options?.codeableConcept,
      ) ||
      withValueFormatter<typeof quantityFormatter>(
        formatterOptions.formatter,
      ).format("Quantity", value.valueQuantity, options?.quantity) ||
      withValueFormatter<typeof rangeFormatter>(
        formatterOptions.formatter,
      ).format("Range", value.valueRange, options?.range) ||
      value.valueReference?.display?.trim() ||
      value.valueReference?.reference?.trim() ||
      "";

    if (options?.style === "full") {
      const formattedCode = withValueFormatter<typeof codeFormatter>(
        formatterOptions.formatter,
      ).format("code", value.code?.code, { expansions: options?.expansions });

      return [formattedCode, formattedValue]
        .filter(Boolean)
        .join(options?.separator ?? " = ");
    }

    return formattedValue;
  },
};

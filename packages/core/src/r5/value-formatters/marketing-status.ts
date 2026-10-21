import { ValueFormatter, withValueFormatter } from "../formatters";
import {
  FormattableCodeableConcept,
  codeableConceptFormatter,
} from "./codeable-concept";
import { FormattablePeriod, periodFormatter } from "./period";

/**
 * The marketing status describes the date when a medicinal product is actually put on the
 * market or the date as of which it is no longer available.
 *
 * @see https://hl7.org/fhir/datatypes.html#MarketingStatus
 */
export interface MarketingStatusFormatterOptions {
  /** Defaults to ", ". */
  separator?: string | null | undefined;
}

export interface FormattableMarketingStatus {
  dateRange?: FormattablePeriod | null | undefined;
  restoreDate?: string | null | undefined;
  status?: FormattableCodeableConcept | null | undefined;
}

export const marketingStatusFormatter: ValueFormatter<
  "MarketingStatus",
  FormattableMarketingStatus | null | undefined,
  MarketingStatusFormatterOptions | null | undefined
> = {
  type: "MarketingStatus",
  format: (value, options, formatterOptions) => {
    if (!value) {
      return "";
    }

    const status = withValueFormatter<typeof codeableConceptFormatter>(
      formatterOptions.formatter,
    ).format("CodeableConcept", value.status);

    const dateRange = withValueFormatter<typeof periodFormatter>(
      formatterOptions.formatter,
    ).format("Period", value.dateRange);

    return [status, dateRange].filter(Boolean).join(options?.separator ?? ", ");
  },
};

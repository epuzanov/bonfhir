import { ValueFormatter } from "../formatters";

/**
 * A series of measurements taken by a device, with upper and lower limits.
 *
 * @see https://hl7.org/fhir/datatypes.html#SampledData
 */
export interface SampledDataFormatterOptions {
  /**
   * - summary: a summary of the sample (default), e.g. "3 samples (2 … 4)"
   * - data: the raw data points
   */
  style?: "summary" | "data" | null | undefined;

  /** Defaults to ", ". */
  separator?: string | null | undefined;
}

export interface FormattableSampledData {
  data?: string | null | undefined;
  dimensions?: number | null | undefined;
  interval?: number | null | undefined;
  origin?:
    | {
        code?: string | null | undefined;
        unit?: string | null | undefined;
        value?: number | null | undefined;
      }
    | null
    | undefined;
  period?: number | null | undefined;
  upperLimit?: number | null | undefined;
  lowerLimit?: number | null | undefined;
}

export const sampledDataFormatter: ValueFormatter<
  "SampledData",
  FormattableSampledData | null | undefined,
  SampledDataFormatterOptions | null | undefined
> = {
  type: "SampledData",
  format: (value, options) => {
    if (!value) {
      return "";
    }

    const dataPoints = (value.data || "")
      .split(" ")
      .map((x) => x.trim())
      .filter(Boolean);

    if (options?.style === "data") {
      return dataPoints.join(options.separator ?? ", ");
    }

    if (dataPoints.length === 0) {
      return "";
    }

    const unit = value.origin?.unit?.trim() || value.origin?.code?.trim();
    const numericDataPoints = dataPoints
      .map(Number)
      .filter((x) => Number.isFinite(x));

    const range =
      numericDataPoints.length > 0
        ? `${Math.min(...numericDataPoints)} … ${Math.max(...numericDataPoints)}`
        : undefined;

    return `${dataPoints.length} sample${
      dataPoints.length > 1 ? "s" : ""
    }${range ? ` (${range})` : ""}${unit ? ` ${unit}` : ""}`;
  },
};

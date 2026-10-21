import { ValueFormatter, withValueFormatter } from "../formatters";
import { CodeFormatterOptions, codeFormatter } from "./code";
import { IntegerFormatterOptions, integerFormatter } from "./integer";
import {
  FormattablePeriod,
  PeriodFormatterOptions,
  periodFormatter,
} from "./period";

/**
 * Specifies an event that may occur multiple times. Timing schedules are used to record when
 * things are planned to occur.
 *
 * @see https://hl7.org/fhir/datatypes.html#Timing
 */
export interface TimingFormatterOptions {
  /**
   * - code: the timing code (default)
   * - text: the timing `code.text` if present, otherwise the code
   * - repeat: a human readable description of the repetition (e.g. "3 times per 1 d")
   * - full: the code (or text), followed by the repetition description
   */
  style?: "code" | "text" | "repeat" | "full" | null | undefined;

  /** Defaults to " - ". */
  separator?: string | null | undefined;

  expansions?: CodeFormatterOptions["expansions"];

  period?: PeriodFormatterOptions | null | undefined;

  integer?: IntegerFormatterOptions | null | undefined;
}

export interface FormattableTimingRepeat {
  boundsPeriod?: FormattablePeriod | null | undefined;
  count?: number | null | undefined;
  countMax?: number | null | undefined;
  duration?: number | null | undefined;
  durationMax?: number | null | undefined;
  durationUnit?: string | null | undefined;
  period?: number | null | undefined;
  periodMax?: number | null | undefined;
  periodUnit?: string | null | undefined;
}

export interface FormattableTiming {
  code?:
    | {
        code?: string | null | undefined;
        text?: string | null | undefined;
      }
    | null
    | undefined;
  repeat?: FormattableTimingRepeat | null | undefined;
}

export const timingFormatter: ValueFormatter<
  "Timing",
  FormattableTiming | null | undefined,
  TimingFormatterOptions | null | undefined
> = {
  type: "Timing",
  format: (value, options, formatterOptions) => {
    if (!value) {
      return "";
    }

    const formatInteger = (input: number | null | undefined) =>
      withValueFormatter<typeof integerFormatter>(
        formatterOptions.formatter,
      ).format("integer", input, options?.integer);

    const codeText = value.code?.text?.trim();
    const formattedCode =
      options?.style === "text"
        ? codeText ||
          withValueFormatter<typeof codeFormatter>(
            formatterOptions.formatter,
          ).format("code", value.code?.code, {
            expansions: options?.expansions,
          })
        : withValueFormatter<typeof codeFormatter>(
            formatterOptions.formatter,
          ).format("code", value.code?.code, {
            expansions: options?.expansions,
          }) || codeText;

    const formattedRepeat = formatRepeat();

    switch (options?.style) {
      case "repeat": {
        return formattedRepeat || "";
      }
      case "full": {
        return [formattedCode, formattedRepeat]
          .filter(Boolean)
          .join(options.separator ?? " - ");
      }
      default: {
        return formattedCode || "";
      }
    }

    function formatRepeat(): string {
      const repeat = value?.repeat;
      if (!repeat) {
        return "";
      }

      const parts: string[] = [];

      const frequency =
        repeat.count == undefined
          ? undefined
          : repeat.countMax != undefined && repeat.countMax !== repeat.count
            ? `${formatInteger(repeat.count)}-${formatInteger(repeat.countMax)} times`
            : `${formatInteger(repeat.count)} times`;

      const period =
        repeat.period == undefined
          ? repeat.periodUnit || undefined
          : repeat.periodMax != undefined && repeat.periodMax !== repeat.period
            ? `${formatInteger(repeat.period)}-${formatInteger(repeat.periodMax)} ${
                repeat.periodUnit || ""
              }`
            : `${formatInteger(repeat.period)} ${repeat.periodUnit || ""}`;

      if (frequency && period) {
        parts.push(`${frequency} per ${period}`.trim());
      } else if (frequency) {
        parts.push(frequency);
      } else if (period) {
        parts.push(`every ${period}`.trim());
      }

      if (repeat.duration != undefined) {
        parts.push(
          `for ${formatInteger(repeat.duration)} ${repeat.durationUnit || ""}`.trim(),
        );
      }

      if (repeat.boundsPeriod) {
        const bounds = withValueFormatter<typeof periodFormatter>(
          formatterOptions.formatter,
        ).format("Period", repeat.boundsPeriod, options?.period);
        if (bounds) {
          parts.push(bounds);
        }
      }

      return parts.join(", ");
    }
  },
};

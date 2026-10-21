import { ValueFormatter, withValueFormatter } from "../formatters";
import { CodeFormatterOptions, codeFormatter } from "./code";

/**
 * A complex type that specifies a monetary amount, and how it is calculated.
 *
 * @see https://hl7.org/fhir/datatypes.html#MonetaryComponent
 */
export interface MonetaryComponentFormatterOptions {
  /**
   * - value: the monetary amount / factor / value (default)
   * - code: the component type code
   */
  style?: "value" | "code" | "full" | null | undefined;

  /** Defaults to ": ". */
  separator?: string | null | undefined;

  expansions?: CodeFormatterOptions["expansions"];
}

export interface FormattableMonetaryComponent {
  amount?:
    | {
        currency?: string | null | undefined;
        value?: number | null | undefined;
      }
    | null
    | undefined;
  code?: string | null | undefined;
  factor?: number | null | undefined;
  type?:
    | {
        code?: string | null | undefined;
        system?: string | null | undefined;
      }
    | null
    | undefined;
}

export const monetaryComponentFormatter: ValueFormatter<
  "MonetaryComponent",
  FormattableMonetaryComponent | null | undefined,
  MonetaryComponentFormatterOptions | null | undefined
> = {
  type: "MonetaryComponent",
  format: (value, options, formatterOptions) => {
    if (!value) {
      return "";
    }

    const formattedAmount = value.amount?.value
      ? new Intl.NumberFormat(formatterOptions.locale, {
          style: "currency",
          currency: value.amount.currency ?? undefined,
        }).format(value.amount.value)
      : "";

    const formattedValue =
      formattedAmount ||
      (value.factor == undefined ? "" : `${value.factor}`) ||
      value.code?.trim() ||
      "";

    const formattedType = withValueFormatter<typeof codeFormatter>(
      formatterOptions.formatter,
    ).format("code", value.type?.code, { expansions: options?.expansions });

    switch (options?.style) {
      case "code": {
        return formattedType;
      }
      case "full": {
        return [formattedType, formattedValue]
          .filter(Boolean)
          .join(options.separator ?? ": ");
      }
      default: {
        return formattedValue;
      }
    }
  },
};

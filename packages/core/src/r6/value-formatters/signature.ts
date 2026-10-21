import { ValueFormatter, withValueFormatter } from "../formatters";
import { FormattableCoding, codingFormatter } from "./coding";
import { DatetimeFormatterOptions, dateTimeFormatter } from "./date-time";
import { FormattableReference, referenceFormatter } from "./reference";

/**
 * A signature along with supporting context.
 *
 * @see https://hl7.org/fhir/datatypes.html#Signature
 */
export interface SignatureFormatterOptions {
  /**
   * - type: the signature type(s) (default)
   * - when: the signature creation date
   * - who: who signed
   * - full: the type(s), who signed and when
   */
  style?: "type" | "when" | "who" | "full" | null | undefined;

  /** Defaults to ", ". */
  separator?: string | null | undefined;

  /** Defaults to " on ". */
  whenSeparator?: string | null | undefined;

  dateTime?: DatetimeFormatterOptions | null | undefined;
}

export interface FormattableSignature {
  data?: string | null | undefined;
  onBehalfOf?: FormattableReference | null | undefined;
  sigFormat?: string | null | undefined;
  targetFormat?: string | null | undefined;
  type?: Array<FormattableCoding> | null | undefined;
  when?: string | null | undefined;
  who?: FormattableReference | null | undefined;
}

export const signatureFormatter: ValueFormatter<
  "Signature",
  FormattableSignature | null | undefined,
  SignatureFormatterOptions | null | undefined
> = {
  type: "Signature",
  format: (value, options, formatterOptions) => {
    if (!value) {
      return "";
    }

    const type = (value.type || [])
      .map((coding) =>
        withValueFormatter<typeof codingFormatter>(
          formatterOptions.formatter,
        ).format("Coding", coding),
      )
      .filter(Boolean)
      .join(", ");

    const who = withValueFormatter<typeof referenceFormatter>(
      formatterOptions.formatter,
    ).format("Reference", value.who);

    const when = value.when
      ? withValueFormatter<typeof dateTimeFormatter>(
          formatterOptions.formatter,
        ).format("dateTime", value.when, options?.dateTime)
      : "";

    switch (options?.style) {
      case "when": {
        return when;
      }
      case "who": {
        return who;
      }
      case "full": {
        const parts = [type, [who, when].filter(Boolean).join(" on ")].filter(
          Boolean,
        );
        return parts.join(options.separator ?? ", ");
      }
      default: {
        return type;
      }
    }
  },
};

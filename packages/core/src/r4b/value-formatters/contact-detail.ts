import { ValueFormatter, withValueFormatter } from "../formatters";
import {
  ContactPointFormatterOptions,
  FormattableContactPoint,
  contactPointFormatter,
} from "./contact-point";

/**
 * Specifies contact information for a person or organization.
 *
 * @see https://hl7.org/fhir/datatypes.html#ContactDetail
 */
export interface ContactDetailFormatterOptions {
  /** Defaults to true. */
  includeName?: boolean | null | undefined;

  /** Defaults to true. */
  includeTelecom?: boolean | null | undefined;

  /** Defaults to ", ". */
  separator?: string | null | undefined;

  contactPoint?: ContactPointFormatterOptions | null | undefined;
}

export interface FormattableContactDetail {
  name?: string | null | undefined;
  telecom?: Array<FormattableContactPoint> | null | undefined;
}

export const contactDetailFormatter: ValueFormatter<
  "ContactDetail",
  FormattableContactDetail | null | undefined,
  ContactDetailFormatterOptions | null | undefined
> = {
  type: "ContactDetail",
  format: (value, options, formatterOptions) => {
    if (!value) {
      return "";
    }

    const parts: string[] = [];

    if (options?.includeName !== false && value.name?.trim()) {
      parts.push(value.name.trim());
    }

    if (options?.includeTelecom !== false && value.telecom?.length) {
      const formattedTelecom = new Intl.ListFormat(formatterOptions.locale, {
        type: "conjunction",
      }).format(
        value.telecom
          .map((telecom) =>
            withValueFormatter<typeof contactPointFormatter>(
              formatterOptions.formatter,
            ).format("ContactPoint", telecom, options?.contactPoint),
          )
          .filter(Boolean),
      );
      if (formattedTelecom) {
        parts.push(formattedTelecom);
      }
    }

    return parts.join(options?.separator ?? ", ");
  },
};

import { ValueFormatter, withValueFormatter } from "../formatters";
import {
  ContactPointFormatterOptions,
  FormattableContactPoint,
  contactPointFormatter,
} from "./contact-point";
import {
  FormattableReference,
  ReferenceFormatterOptions,
  referenceFormatter,
} from "./reference";

/**
 * Details for all kinds of technology mediated contact points and postal addresses
 * for a person or organization, including telephone, email, etc.
 *
 * @see https://hl7.org/fhir/ExtendedContactDetail.html
 */
export interface ExtendedContactDetailFormatterOptions {
  /** Defaults to true. */
  includeName?: boolean | null | undefined;

  /** Defaults to true. */
  includeTelecom?: boolean | null | undefined;

  /** Defaults to true, when an address is present. */
  includeAddress?: boolean | null | undefined;

  /** Defaults to ", ". */
  separator?: string | null | undefined;

  contactPoint?: ContactPointFormatterOptions | null | undefined;

  reference?: ReferenceFormatterOptions | null | undefined;
}

export interface FormattableExtendedContactDetail {
  address?:
    | {
        city?: string | null | undefined;
        country?: string | null | undefined;
        line?: string[] | null | undefined;
        postalCode?: string | null | undefined;
        state?: string | null | undefined;
        text?: string | null | undefined;
      }
    | null
    | undefined;
  name?:
    | Array<{
        family?: string | null | undefined;
        given?: string[] | null | undefined;
        text?: string | null | undefined;
      }>
    | null
    | undefined;
  organization?: FormattableReference | null | undefined;
  period?:
    | { end?: string | null | undefined; start?: string | null | undefined }
    | null
    | undefined;
  purpose?:
    | { code?: string | null | undefined; text?: string | null | undefined }
    | null
    | undefined;
  telecom?: Array<FormattableContactPoint> | null | undefined;
}

export const extendedContactDetailFormatter: ValueFormatter<
  "ExtendedContactDetail",
  FormattableExtendedContactDetail | null | undefined,
  ExtendedContactDetailFormatterOptions | null | undefined
> = {
  type: "ExtendedContactDetail",
  format: (value, options, formatterOptions) => {
    if (!value) {
      return "";
    }

    const parts: string[] = [];

    if (options?.includeName !== false && value.name?.length) {
      const formattedNames = value.name
        .map(
          (name) =>
            name.text?.trim() ||
            [name.given?.join(" "), name.family]
              .filter(Boolean)
              .join(" ")
              .trim(),
        )
        .filter(Boolean);
      if (formattedNames.length > 0) {
        parts.push(formattedNames.join(", "));
      }
    }

    const organization = withValueFormatter<typeof referenceFormatter>(
      formatterOptions.formatter,
    ).format("Reference", value.organization, options?.reference);
    if (organization) {
      parts.push(organization);
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

    if (options?.includeAddress !== false && value.address) {
      const formattedAddress =
        value.address.text?.trim() ||
        [
          value.address.line?.join(" "),
          value.address.city,
          value.address.state,
          value.address.postalCode,
          value.address.country,
        ]
          .filter(Boolean)
          .join(", ");
      if (formattedAddress) {
        parts.push(formattedAddress);
      }
    }

    return parts.join(options?.separator ?? ", ");
  },
};

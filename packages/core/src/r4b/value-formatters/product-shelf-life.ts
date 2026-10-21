import { ValueFormatter } from "../formatters";
import { FormattableQuantity, quantityFormatter } from "./quantity";

/**
 * The shelf-life and storage information for a medicinal product item or container can be
 * described using this type.
 *
 * @see https://hl7.org/fhir/datatypes.html#ProductShelfLife
 */
export interface ProductShelfLifeFormatterOptions {
  /** Defaults to ", ". */
  separator?: string | null | undefined;
}

export interface FormattableProductShelfLife {
  period?: FormattableQuantity | null | undefined;
  specialPrecautionsForStorage?:
    | Array<{
        text?: string | null | undefined;
        coding?:
          | Array<{
              code?: string | null | undefined;
              display?: string | null | undefined;
            }>
          | null
          | undefined;
      }>
    | null
    | undefined;
  type?:
    | { code?: string | null | undefined; text?: string | null | undefined }
    | null
    | undefined;
}

export const productShelfLifeFormatter: ValueFormatter<
  "ProductShelfLife",
  FormattableProductShelfLife | null | undefined,
  ProductShelfLifeFormatterOptions | null | undefined
> = {
  type: "ProductShelfLife",
  format: (value, options, formatterOptions) => {
    if (!value) {
      return "";
    }

    const period = withQuantity(value.period);
    const type = value.type?.text?.trim() || value.type?.code?.trim();
    const precautions = (value.specialPrecautionsForStorage || [])
      .map(
        (precaution) =>
          precaution.text?.trim() ||
          precaution.coding?.[0]?.display?.trim() ||
          precaution.coding?.[0]?.code?.trim(),
      )
      .filter(Boolean);

    return [period, type, ...precautions]
      .filter(Boolean)
      .join(options?.separator ?? ", ");

    function withQuantity(quantity: FormattableQuantity | null | undefined) {
      return quantityFormatter.format(quantity, undefined, formatterOptions);
    }
  },
};

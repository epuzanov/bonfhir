import { ValueFormatter } from "../formatters";

/**
 * Describes a required data item for evaluation in terms of the type of data, and optional
 * code or date-based filters of the data.
 *
 * @see https://hl7.org/fhir/datatypes.html#DataRequirement
 */
export interface DataRequirementFormatterOptions {
  /** Defaults to ", ". */
  separator?: string | null | undefined;
}

export interface FormattableDataRequirement {
  codeFilter?:
    | Array<{
        path?: string | null | undefined;
        searchParam?: string | null | undefined;
        valueSet?: string | null | undefined;
      }>
    | null
    | undefined;
  dateFilter?:
    | Array<{
        path?: string | null | undefined;
        searchParam?: string | null | undefined;
      }>
    | null
    | undefined;
  limit?: number | null | undefined;
  type: string;
}

export const dataRequirementFormatter: ValueFormatter<
  "DataRequirement",
  FormattableDataRequirement | null | undefined,
  DataRequirementFormatterOptions | null | undefined
> = {
  type: "DataRequirement",
  format: (value, options) => {
    if (!value) {
      return "";
    }

    const filters = [
      ...(value.codeFilter || []).map(
        (filter) => filter.path || filter.searchParam || filter.valueSet,
      ),
      ...(value.dateFilter || []).map(
        (filter) => filter.path || filter.searchParam,
      ),
    ].filter(Boolean);

    return [value.type, ...filters].join(options?.separator ?? ", ");
  },
};

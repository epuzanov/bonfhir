import { ValueFormatter } from "../formatters";

/**
 * A parameter used in an operation or a definition.
 *
 * @see https://hl7.org/fhir/datatypes.html#ParameterDefinition
 */
export interface ParameterDefinitionFormatterOptions {
  /**
   * - name: the parameter name (default)
   * - type: the parameter type
   * - full: the name and the type
   */
  style?: "name" | "type" | "full" | null | undefined;

  /** Defaults to ": ". */
  separator?: string | null | undefined;
}

export interface FormattableParameterDefinition {
  max?: string | null | undefined;
  min?: number | null | undefined;
  name?: string | null | undefined;
  type: string;
  use: string;
}

export const parameterDefinitionFormatter: ValueFormatter<
  "ParameterDefinition",
  FormattableParameterDefinition | null | undefined,
  ParameterDefinitionFormatterOptions | null | undefined
> = {
  type: "ParameterDefinition",
  format: (value, options) => {
    if (!value) {
      return "";
    }

    switch (options?.style) {
      case "type": {
        return value.type;
      }
      case "full": {
        return [value.name, value.type]
          .filter(Boolean)
          .join(options.separator ?? ": ");
      }
      default: {
        return value.name?.trim() || value.type;
      }
    }
  },
};

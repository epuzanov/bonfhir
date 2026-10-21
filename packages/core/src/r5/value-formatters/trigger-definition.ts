import { ValueFormatter } from "../formatters";

/**
 * A description of a triggering event.
 *
 * @see https://hl7.org/fhir/datatypes.html#TriggerDefinition
 */
export interface TriggerDefinitionFormatterOptions {
  /**
   * - type: the trigger type (default)
   * - name: the trigger name
   * - full: the type and the name
   */
  style?: "type" | "name" | "full" | null | undefined;

  /** Defaults to ": ". */
  separator?: string | null | undefined;
}

export interface FormattableTriggerDefinition {
  condition?:
    | {
        expression?: string | null | undefined;
        language?: string | null | undefined;
      }
    | null
    | undefined;
  data?:
    | Array<{
        resourceType?: string | null | undefined;
      }>
    | null
    | undefined;
  name?: string | null | undefined;
  timingTiming?:
    | {
        code?: {
          code?: string | null | undefined;
          text?: string | null | undefined;
        };
      }
    | null
    | undefined;
  type: string;
}

export const triggerDefinitionFormatter: ValueFormatter<
  "TriggerDefinition",
  FormattableTriggerDefinition | null | undefined,
  TriggerDefinitionFormatterOptions | null | undefined
> = {
  type: "TriggerDefinition",
  format: (value, options) => {
    if (!value) {
      return "";
    }

    const name =
      value.name?.trim() || value.condition?.expression?.trim() || "";

    switch (options?.style) {
      case "name": {
        return name;
      }
      case "full": {
        return [value.type, name]
          .filter(Boolean)
          .join(options.separator ?? ": ");
      }
      default: {
        return value.type;
      }
    }
  },
};

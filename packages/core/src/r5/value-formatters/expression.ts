import { ValueFormatter } from "../formatters";

/**
 * A expression that is evaluated in a specified context and returns a value. The context of
 * use of the expression must specify the context in which the expression is evaluated, and how
 * the result of the expression is used.
 *
 * @see https://hl7.org/fhir/datatypes.html#Expression
 */
export interface ExpressionFormatterOptions {
  /**
   * - expression: the expression itself (default)
   * - description: the human readable description, otherwise the expression
   */
  style?: "expression" | "description" | null | undefined;

  /** Defaults to " - ". */
  separator?: string | null | undefined;
}

export interface FormattableExpression {
  description?: string | null | undefined;
  expression?: string | null | undefined;
  language?: string | null | undefined;
  name?: string | null | undefined;
  reference?: string | null | undefined;
}

export const expressionFormatter: ValueFormatter<
  "Expression",
  FormattableExpression | null | undefined,
  ExpressionFormatterOptions | null | undefined
> = {
  type: "Expression",
  format: (value, options) => {
    if (!value) {
      return "";
    }

    switch (options?.style) {
      case "description": {
        return value.description?.trim() || value.expression?.trim() || "";
      }
      default: {
        return value.expression?.trim() || value.description?.trim() || "";
      }
    }
  },
};

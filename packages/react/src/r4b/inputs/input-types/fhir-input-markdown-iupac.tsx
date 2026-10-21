import { ReactElement } from "react";
import { useFhirUIContext } from "../../context";
import { FhirInputCommonProps } from "./common";

/**
 * A markdown input specialized for IUPAC chemical notation.
 *
 * It behaves like the `markdown` input, but the editing surface is tailored to chemical
 * formulas: subscript and superscript are first class citizens, and a palette of
 * characters used by IUPAC notation (Greek letters, roman numerals, isotope prefixes,
 * comparison operators, arrows) is available.
 *
 * The value is a plain FHIR `markdown` string, where subscripts and superscripts are
 * represented with the markdown `~subscript~` and `^superscript^` syntax.
 */
export interface FhirInputMarkdownIupacProps<TRendererProps = any>
  extends FhirInputCommonProps {
  type: "markdownIupac";
  placeholder?: string | null | undefined;
  value?: string | null | undefined;
  onChange?: (value: string | undefined) => void;
  className?: string | undefined;
  style?: Record<string, any> | undefined;
  rendererProps?: TRendererProps;
}

export function FhirInputMarkdownIupac<TRendererProps = any>(
  props: FhirInputMarkdownIupacProps<TRendererProps>,
): ReactElement | null {
  const { render } = useFhirUIContext();

  return render("FhirInputMarkdownIupac", { ...props });
}

export type FhirInputMarkdownIupacRendererProps<TRendererProps = any> =
  FhirInputMarkdownIupacProps<TRendererProps>;

export type FhirInputMarkdownIupacRenderer = (
  props: FhirInputMarkdownIupacRendererProps,
) => ReactElement | null;

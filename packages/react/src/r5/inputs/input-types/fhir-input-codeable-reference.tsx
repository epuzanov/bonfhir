import { CodeableReference } from "@bonfhir/core/r5";
import { ReactElement } from "react";
import { useFhirUIContext } from "../../context";
import { FhirInputCommonProps } from "./common";
import { FhirInputTerminologyProps } from "./fhir-input-terminology";

export interface FhirInputCodeableReferenceProps<TRendererProps = any>
  extends FhirInputCommonProps {
  type: "CodeableReference";
  value?: CodeableReference | null | undefined;
  onChange?: (value: CodeableReference | undefined) => void;
  /**
   * Whether the user can switch between a reference and a concept input.
   * Defaults to true.
   */
  mode?: "reference" | "concept" | "both" | null | undefined;
  /**
   * Source of the terminology to use for the concept part.
   */
  conceptSource?: FhirInputTerminologyProps["source"] | null | undefined;
  /**
   * Resource type to use for the reference part.
   */
  referenceResourceType?: string | null | undefined;
  className?: string | undefined;
  style?: Record<string, any> | undefined;
  rendererProps?: TRendererProps;
}

export function FhirInputCodeableReference<TRendererProps = any>(
  props: FhirInputCodeableReferenceProps<TRendererProps>,
): ReactElement | null {
  const { render } = useFhirUIContext();

  return render("FhirInputCodeableReference", { ...props });
}

export type FhirInputCodeableReferenceRendererProps<TRendererProps = any> =
  FhirInputCodeableReferenceProps<TRendererProps>;

export type FhirInputCodeableReferenceRenderer = (
  props: FhirInputCodeableReferenceRendererProps,
) => ReactElement | null;

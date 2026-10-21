import { Range } from "@bonfhir/core/r5";
import { ReactElement } from "react";
import { useFhirUIContext } from "../../context";
import { FhirInputCommonProps } from "./common";

export interface FhirInputRangeProps<TRendererProps = any>
  extends FhirInputCommonProps {
  type: "Range";
  value?: Range | null | undefined;
  onChange?: (value: Range | undefined) => void;
  className?: string | undefined;
  style?: Record<string, any> | undefined;
  rendererProps?: TRendererProps;
}

export function FhirInputRange<TRendererProps = any>(
  props: FhirInputRangeProps<TRendererProps>,
): ReactElement | null {
  const { render } = useFhirUIContext();

  return render("FhirInputRange", { ...props });
}

export type FhirInputRangeRendererProps<TRendererProps = any> =
  FhirInputRangeProps<TRendererProps>;

export type FhirInputRangeRenderer = (
  props: FhirInputRangeRendererProps,
) => ReactElement | null;

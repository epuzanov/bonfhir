import { Ratio } from "@bonfhir/core/r4b";
import { ReactElement } from "react";
import { useFhirUIContext } from "../../context";
import { FhirInputCommonProps } from "./common";

export interface FhirInputRatioProps<TRendererProps = any>
  extends FhirInputCommonProps {
  type: "Ratio";
  value?: Ratio | null | undefined;
  onChange?: (value: Ratio | undefined) => void;
  className?: string | undefined;
  style?: Record<string, any> | undefined;
  rendererProps?: TRendererProps;
}

export function FhirInputRatio<TRendererProps = any>(
  props: FhirInputRatioProps<TRendererProps>,
): ReactElement | null {
  const { render } = useFhirUIContext();

  return render("FhirInputRatio", { ...props });
}

export type FhirInputRatioRendererProps<TRendererProps = any> =
  FhirInputRatioProps<TRendererProps>;

export type FhirInputRatioRenderer = (
  props: FhirInputRatioRendererProps,
) => ReactElement | null;

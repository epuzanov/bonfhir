import { Period } from "@bonfhir/core/r6";
import { ReactElement } from "react";
import { useFhirUIContext } from "../../context";
import { FhirInputCommonProps } from "./common";

export interface FhirInputPeriodProps<TRendererProps = any>
  extends FhirInputCommonProps {
  type: "Period";
  value?: Period | null | undefined;
  onChange?: (value: Period | undefined) => void;
  className?: string | undefined;
  style?: Record<string, any> | undefined;
  rendererProps?: TRendererProps;
}

export function FhirInputPeriod<TRendererProps = any>(
  props: FhirInputPeriodProps<TRendererProps>,
): ReactElement | null {
  const { render } = useFhirUIContext();

  return render("FhirInputPeriod", { ...props });
}

export type FhirInputPeriodRendererProps<TRendererProps = any> =
  FhirInputPeriodProps<TRendererProps>;

export type FhirInputPeriodRenderer = (
  props: FhirInputPeriodRendererProps,
) => ReactElement | null;

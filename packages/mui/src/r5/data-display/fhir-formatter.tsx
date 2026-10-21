import { FhirFormatterRendererProps } from "@bonfhir/react/r5";
import { ReactElement } from "react";

export function MuiFhirFormatter(
  props: FhirFormatterRendererProps<unknown>,
): ReactElement | null {
  return <>{props.formattedValue}</>;
}

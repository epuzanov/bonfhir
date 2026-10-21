import { Address } from "@bonfhir/core/r5";
import { ReactElement } from "react";
import { useFhirUIContext } from "../../context";
import { FhirInputCommonProps } from "./common";

export interface FhirInputAddressProps<TRendererProps = any>
  extends FhirInputCommonProps {
  type: "Address";
  value?: Address | null | undefined;
  onChange?: (value: Address | undefined) => void;
  /**
   * The components to display.
   * Defaults to `["use", "line", "city", "state", "postalCode", "country"]`.
   */
  mode?:
    | "simple"
    | "full"
    | Array<
        | "use"
        | "type"
        | "line"
        | "city"
        | "district"
        | "state"
        | "postalCode"
        | "country"
      >
    | null
    | undefined;
  className?: string | undefined;
  style?: Record<string, any> | undefined;
  rendererProps?: TRendererProps;
}

export function FhirInputAddress<TRendererProps = any>(
  props: FhirInputAddressProps<TRendererProps>,
): ReactElement | null {
  const { render } = useFhirUIContext();

  return render("FhirInputAddress", { ...props });
}

export type FhirInputAddressRendererProps<TRendererProps = any> =
  FhirInputAddressProps<TRendererProps>;

export type FhirInputAddressRenderer = (
  props: FhirInputAddressRendererProps,
) => ReactElement | null;

export type FhirInputAddressComponent =
  | "use"
  | "type"
  | "line"
  | "city"
  | "district"
  | "state"
  | "postalCode"
  | "country";

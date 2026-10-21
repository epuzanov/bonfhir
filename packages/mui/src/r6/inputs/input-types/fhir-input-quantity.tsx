import { FhirInput, FhirInputQuantityRendererProps } from "@bonfhir/react/r6";
import { Stack, StackProps } from "@mui/material";
import { ReactElement } from "react";
import { MuiInputWrapper } from "./common";

export function MuiFhirInputQuantity(
  props: FhirInputQuantityRendererProps<MuiFhirInputQuantityProps>,
): ReactElement | null {
  return (
    <MuiInputWrapper
      className={props.className}
      style={props.style}
      label={props.label}
      description={props.description}
      error={props.error}
      required={props.required}
    >
      <Stack direction="row" spacing={1} {...props.rendererProps?.stack}>
        {Boolean(props.comparator) && (
          <FhirInput
            type="code"
            value={props.value?.comparator}
            disabled={Boolean(props.disabled)}
            onChange={(comparator) =>
              props.onChange?.({
                ...props.value,
                comparator: comparator as never,
              })
            }
            {...(typeof props.comparator === "boolean"
              ? { source: "http://hl7.org/fhir/ValueSet/quantity-comparator" }
              : // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (props.comparator as any))}
          />
        )}
        <FhirInput
          type="decimal"
          value={props.value?.value}
          disabled={Boolean(props.disabled)}
          onChange={(value) => props.onChange?.({ ...props.value, value })}
          {...props.decimal}
        />
        <FhirInput
          type="string"
          value={props.value?.unit}
          disabled={Boolean(props.disabled)}
          onChange={(unit) => props.onChange?.({ ...props.value, unit })}
          {...props.rendererProps?.unit}
        />
      </Stack>
    </MuiInputWrapper>
  );
}

export interface MuiFhirInputQuantityProps {
  stack?: StackProps | null | undefined;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  unit?: any | null | undefined;
}

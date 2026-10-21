import { FhirInput, FhirInputRangeRendererProps } from "@bonfhir/react/r4b";
import { Stack, StackProps, Typography } from "@mui/material";
import { ReactElement } from "react";
import { MuiInputWrapper } from "./common";

export function MuiFhirInputRange(
  props: FhirInputRangeRendererProps<MuiFhirInputRangeProps>,
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
      <Stack
        direction="row"
        spacing={1}
        alignItems="center"
        {...props.rendererProps?.stack}
      >
        <FhirInput
          type="Quantity"
          value={props.value?.low}
          disabled={Boolean(props.disabled)}
          onChange={(low) => props.onChange?.({ ...props.value, low })}
          {...props.rendererProps?.low}
        />
        <Typography color="text.secondary">…</Typography>
        <FhirInput
          type="Quantity"
          value={props.value?.high}
          disabled={Boolean(props.disabled)}
          onChange={(high) => props.onChange?.({ ...props.value, high })}
          {...props.rendererProps?.high}
        />
      </Stack>
    </MuiInputWrapper>
  );
}

export interface MuiFhirInputRangeProps {
  stack?: StackProps | null | undefined;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  low?: any | null | undefined;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  high?: any | null | undefined;
}

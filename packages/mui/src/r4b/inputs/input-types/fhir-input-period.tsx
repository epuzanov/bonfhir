import { FhirInput, FhirInputPeriodRendererProps } from "@bonfhir/react/r4b";
import { Stack, StackProps } from "@mui/material";
import { ReactElement } from "react";
import { MuiInputWrapper } from "./common";

export function MuiFhirInputPeriod(
  props: FhirInputPeriodRendererProps<MuiFhirInputPeriodProps>,
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
        <FhirInput
          type="dateTime"
          placeholder="Start"
          value={props.value?.start}
          disabled={Boolean(props.disabled)}
          onChange={(start) => props.onChange?.({ ...props.value, start })}
          {...props.rendererProps?.start}
        />
        <FhirInput
          type="dateTime"
          placeholder="End"
          value={props.value?.end}
          disabled={Boolean(props.disabled)}
          onChange={(end) => props.onChange?.({ ...props.value, end })}
          {...props.rendererProps?.end}
        />
      </Stack>
    </MuiInputWrapper>
  );
}

export interface MuiFhirInputPeriodProps {
  stack?: StackProps | null | undefined;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  start?: any | null | undefined;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  end?: any | null | undefined;
}

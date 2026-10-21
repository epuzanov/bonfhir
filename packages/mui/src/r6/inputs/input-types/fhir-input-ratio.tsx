import { FhirInput, FhirInputRatioRendererProps } from "@bonfhir/react/r6";
import { Stack, StackProps, Typography } from "@mui/material";
import { ReactElement } from "react";
import { MuiInputWrapper } from "./common";

export function MuiFhirInputRatio(
  props: FhirInputRatioRendererProps<MuiFhirInputRatioProps>,
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
          value={props.value?.numerator}
          disabled={Boolean(props.disabled)}
          onChange={(numerator) =>
            props.onChange?.({ ...props.value, numerator })
          }
          {...props.rendererProps?.numerator}
        />
        <Typography color="text.secondary">/</Typography>
        <FhirInput
          type="Quantity"
          value={props.value?.denominator}
          disabled={Boolean(props.disabled)}
          onChange={(denominator) =>
            props.onChange?.({ ...props.value, denominator })
          }
          {...props.rendererProps?.denominator}
        />
      </Stack>
    </MuiInputWrapper>
  );
}

export interface MuiFhirInputRatioProps {
  stack?: StackProps | null | undefined;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  numerator?: any | null | undefined;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  denominator?: any | null | undefined;
}

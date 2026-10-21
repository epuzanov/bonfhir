import { FhirInputDateTimeRendererProps } from "@bonfhir/react/r5";
import { TextField, TextFieldProps } from "@mui/material";
import { ReactElement } from "react";
import { MuiInputWrapper } from "./common";

export function MuiFhirInputDateTime(
  props: FhirInputDateTimeRendererProps<MuiFhirInputDateTimeProps>,
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
      <TextField
        size="small"
        fullWidth
        type="datetime-local"
        label={props.label}
        placeholder={props.placeholder ?? undefined}
        error={Boolean(props.error)}
        required={Boolean(props.required)}
        disabled={Boolean(props.disabled)}
        value={props.value || ""}
        InputLabelProps={{ shrink: true }}
        onChange={(evt) => props.onChange?.(evt.target.value || undefined)}
        {...props.rendererProps}
      />
    </MuiInputWrapper>
  );
}

export type MuiFhirInputDateTimeProps = TextFieldProps;

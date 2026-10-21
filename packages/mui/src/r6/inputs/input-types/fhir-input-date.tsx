import { FhirInputDateRendererProps } from "@bonfhir/react/r6";
import { TextField, TextFieldProps } from "@mui/material";
import { ReactElement } from "react";
import { MuiInputWrapper } from "./common";

export function MuiFhirInputDate(
  props: FhirInputDateRendererProps<MuiFhirInputDateProps>,
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
        type="date"
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

export type MuiFhirInputDateProps = TextFieldProps;

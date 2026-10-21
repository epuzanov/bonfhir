import { FhirInputStringRendererProps } from "@bonfhir/react/r5";
import { TextField, TextFieldProps } from "@mui/material";
import { ReactElement } from "react";
import { MuiInputWrapper } from "./common";

export function MuiFhirInputString(
  props: FhirInputStringRendererProps<MuiFhirInputStringProps>,
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
        label={props.label}
        placeholder={props.placeholder ?? undefined}
        error={Boolean(props.error)}
        required={Boolean(props.required)}
        disabled={Boolean(props.disabled)}
        multiline={props.type === "string" && props.mode === "multiline"}
        value={props.value || ""}
        onChange={(evt) => props.onChange?.(evt.target.value || undefined)}
        {...props.rendererProps}
      />
    </MuiInputWrapper>
  );
}

export type MuiFhirInputStringProps = TextFieldProps;

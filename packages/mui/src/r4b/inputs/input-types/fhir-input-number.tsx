import { FhirInputNumberRendererProps } from "@bonfhir/react/r4b";
import { TextField, TextFieldProps } from "@mui/material";
import { ReactElement } from "react";
import { MuiInputWrapper } from "./common";

export function MuiFhirInputNumber(
  props: FhirInputNumberRendererProps<MuiFhirInputNumberProps>,
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
        type="number"
        label={props.label}
        error={Boolean(props.error)}
        required={Boolean(props.required)}
        disabled={Boolean(props.disabled)}
        value={props.value ?? ""}
        inputProps={{
          min: props.min ?? undefined,
          max: props.max ?? undefined,
          step: props.step ?? (props.type === "decimal" ? "any" : 1),
        }}
        onChange={(evt) => {
          const input = evt.target.value;
          if (!input) {
            props.onChange?.(undefined);
            return;
          }

          const value = Number(input);
          if (Number.isFinite(value)) {
            props.onChange?.(value);
          }
        }}
        {...props.rendererProps}
      />
    </MuiInputWrapper>
  );
}

export type MuiFhirInputNumberProps = TextFieldProps;

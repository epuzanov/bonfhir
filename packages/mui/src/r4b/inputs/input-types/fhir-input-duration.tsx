import { FhirInputDurationRendererProps } from "@bonfhir/react/r4b";
import { MenuItem, TextField, TextFieldProps } from "@mui/material";
import { ReactElement } from "react";
import { MuiInputWrapper } from "./common";

const DURATION_UNITS = ["a", "mo", "wk", "d", "h", "min", "s", "ms"];

export function MuiFhirInputDuration(
  props: FhirInputDurationRendererProps<MuiFhirInputDurationProps>,
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
        select
        label={props.label}
        error={Boolean(props.error)}
        required={Boolean(props.required)}
        disabled={Boolean(props.disabled)}
        value={props.value?.code || ""}
        onChange={(evt) =>
          props.onChange?.({
            ...props.value,
            code: evt.target.value || undefined,
          } as never)
        }
        {...props.rendererProps}
      >
        {DURATION_UNITS.map((unit) => (
          <MenuItem key={unit} value={unit}>
            {unit}
          </MenuItem>
        ))}
      </TextField>
    </MuiInputWrapper>
  );
}

export type MuiFhirInputDurationProps = TextFieldProps;

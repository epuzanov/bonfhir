import { FhirInputBooleanRendererProps } from "@bonfhir/react/r5";
import { Checkbox, FormControlLabel, Switch, SwitchProps } from "@mui/material";
import { ReactElement } from "react";
import { MuiInputWrapper } from "./common";

export function MuiFhirInputBoolean(
  props: FhirInputBooleanRendererProps<MuiFhirInputBooleanProps>,
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
      <FormControlLabel
        control={
          props.mode === "checkbox" ? (
            <Checkbox
              checked={Boolean(props.value)}
              disabled={Boolean(props.disabled)}
              onChange={(_, checked) => props.onChange?.(checked)}
            />
          ) : (
            <Switch
              checked={Boolean(props.value)}
              disabled={Boolean(props.disabled)}
              onChange={(_, checked) => props.onChange?.(checked)}
              {...props.rendererProps}
            />
          )
        }
        label={props.rendererProps?.label ?? ""}
      />
    </MuiInputWrapper>
  );
}

export type MuiFhirInputBooleanProps = SwitchProps & {
  label?: string | null | undefined;
};

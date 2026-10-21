import { FhirInputTerminologyRendererProps } from "@bonfhir/react/r5";
import {
  Autocomplete,
  CircularProgress,
  TextField,
  TextFieldProps,
} from "@mui/material";
import { ReactElement } from "react";
import { MuiInputWrapper } from "./common";

export function MuiFhirInputTerminology(
  props: FhirInputTerminologyRendererProps<MuiFhirInputTerminologyProps>,
): ReactElement | null {
  const options = props.data;

  const value =
    props.type === "code"
      ? options.find((option) => option.code === props.value) ?? null
      : props.type === "Coding"
        ? options.find(
            (option) =>
              option.code === props.value?.code &&
              (!props.value?.system || option.system === props.value.system),
          ) ?? null
        : options.find(
            (option) =>
              option.code === props.value?.coding?.[0]?.code &&
              (!props.value?.coding?.[0]?.system ||
                option.system === props.value.coding[0]?.system),
          ) ?? null;

  return (
    <MuiInputWrapper
      className={props.className}
      style={props.style}
      label={props.label}
      description={props.description}
      error={props.error}
      required={props.required}
    >
      <Autocomplete
        size="small"
        options={options}
        loading={props.loading}
        disabled={Boolean(props.disabled)}
        getOptionLabel={(option) => option.display || option.code || ""}
        isOptionEqualToValue={(option, selected) =>
          option.code === selected.code && option.system === selected.system
        }
        value={value}
        onChange={(_, option) => {
          if (!option) {
            props.onChange?.(undefined);
            return;
          }

          if (props.type === "code") {
            props.onChange?.(option.code || undefined);
            return;
          }

          const coding = {
            system: option.system,
            code: option.code,
            display: option.display,
          };

          if (props.type === "Coding") {
            props.onChange?.(coding);
            return;
          }

          props.onChange?.({ coding: [coding], text: option.display });
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            label={props.label}
            placeholder={props.placeholder ?? undefined}
            error={Boolean(props.error)}
            required={Boolean(props.required)}
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <>
                  {props.loading ? <CircularProgress size={16} /> : null}
                  {params.InputProps.endAdornment}
                </>
              ),
            }}
            {...props.rendererProps}
          />
        )}
      />
    </MuiInputWrapper>
  );
}

export type MuiFhirInputTerminologyProps = TextFieldProps;

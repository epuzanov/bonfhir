import { FhirInputResourceRendererProps } from "@bonfhir/react/r6";
import {
  Autocomplete,
  CircularProgress,
  TextField,
  TextFieldProps,
} from "@mui/material";
import { ReactElement } from "react";
import { MuiInputWrapper } from "./common";

export function MuiFhirInputResource(
  props: FhirInputResourceRendererProps<MuiFhirInputResourceProps>,
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
      <Autocomplete
        size="small"
        options={props.data}
        disabled={Boolean(props.disabled)}
        loading={!props.data}
        getOptionLabel={(option) =>
          props.display(option) ?? `${option.resourceType}/${option.id}`
        }
        isOptionEqualToValue={(option, value) =>
          option.resourceType === value.resourceType && option.id === value.id
        }
        value={props.value ?? null}
        onInputChange={(_, query) => props.onSearch(query)}
        onChange={(_, option) => props.onChange?.(option ?? undefined)}
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
                  {params.InputProps.endAdornment}
                  {props.data ? null : <CircularProgress size={16} />}
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

export type MuiFhirInputResourceProps = TextFieldProps;

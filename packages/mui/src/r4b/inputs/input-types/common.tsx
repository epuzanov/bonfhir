import {
  FormControl,
  FormControlProps,
  FormHelperText,
  InputLabel,
  Stack,
} from "@mui/material";
import { ReactElement, ReactNode } from "react";

export interface MuiInputWrapperProps {
  formControl?: FormControlProps | null | undefined;
  label?: ReactNode | null | undefined;
  description?: ReactNode | null | undefined;
  error?: ReactNode | null | undefined;
  required?: boolean | null | undefined;
  className?: string | undefined;
  style?: Record<string, unknown> | undefined;
  children: ReactNode;
}

/**
 * Renders the common label / description / error wrapper used by the MUI inputs.
 */
export function MuiInputWrapper(props: MuiInputWrapperProps): ReactElement {
  return (
    <FormControl
      fullWidth
      error={Boolean(props.error)}
      required={Boolean(props.required)}
      className={props.className}
      style={props.style}
      {...props.formControl}
    >
      <Stack spacing={0.5}>
        {props.label ? <InputLabel shrink>{props.label}</InputLabel> : null}
        {props.children}
        {props.description ? (
          <FormHelperText>{props.description}</FormHelperText>
        ) : null}
        {props.error ? (
          <FormHelperText error>{props.error}</FormHelperText>
        ) : null}
      </Stack>
    </FormControl>
  );
}

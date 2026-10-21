import {
  FhirError,
  FhirErrorProps,
  FhirQueryLoaderRendererProps,
} from "@bonfhir/react/r6";
import {
  Box,
  BoxProps,
  CircularProgress,
  Stack,
  StackProps,
} from "@mui/material";
import { ReactElement } from "react";

export function MuiFhirQueryLoader(
  props: FhirQueryLoaderRendererProps<MuiFhirQueryLoaderProps>,
): ReactElement | null {
  if (props.isLoading) {
    return (
      <Stack
        className={props.className}
        style={props.style}
        {...props.rendererProps?.stack}
      >
        {props.loader || (
          <Box
            sx={{ display: "flex", justifyContent: "center", p: 2 }}
            {...props.rendererProps?.box}
          >
            <CircularProgress size={props.rendererProps?.size ?? 24} />
          </Box>
        )}
      </Stack>
    );
  }

  if (props.isError) {
    return (
      <Stack
        className={props.className}
        style={props.style}
        spacing={1}
        {...props.rendererProps?.stack}
      >
        {props.errors.map((error, index) =>
          props.error ? (
            props.error(error)
          ) : (
            <FhirError
              key={index}
              error={error}
              onRetry={
                props.allowRetry == undefined || props.allowRetry
                  ? () => props.retry()
                  : undefined
              }
              {...props.rendererProps?.error}
            />
          ),
        )}
      </Stack>
    );
  }

  return (
    <Stack
      className={props.className}
      style={props.style}
      {...props.rendererProps?.stack}
    >
      {props.children}
    </Stack>
  );
}

export interface MuiFhirQueryLoaderProps {
  stack?: StackProps | null | undefined;
  box?: BoxProps | null | undefined;
  size?: number | null | undefined;
  error?: FhirErrorProps | null | undefined;
}

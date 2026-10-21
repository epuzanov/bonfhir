import { FhirErrorRendererProps } from "@bonfhir/react/r5";
import { Alert, AlertProps, AlertTitle, Box, Button } from "@mui/material";
import { ReactElement } from "react";

export function MuiFhirError(
  props: FhirErrorRendererProps<MuiFhirErrorProps>,
): ReactElement | null {
  if (!props.error) {
    return null;
  }

  return (
    <Alert
      severity="error"
      className={props.className}
      style={props.style}
      {...props.rendererProps?.alert}
    >
      <AlertTitle>
        {props.rendererProps?.titleText ?? "Something went wrong."}
      </AlertTitle>
      <Box>{props.error.message}</Box>
      {Boolean(props.onRetry) &&
        (props.rendererProps?.retry?.(props) ?? (
          <Box sx={{ mt: 1 }}>
            <Button
              size="small"
              color="error"
              onClick={() => props.onRetry?.()}
            >
              {props.rendererProps?.retryText ?? "Retry"}
            </Button>
          </Box>
        ))}
    </Alert>
  );
}

export interface MuiFhirErrorProps {
  alert?: AlertProps | null | undefined;
  titleText?: string | null | undefined;
  retryText?: string | null | undefined;
  retry?: (
    props: FhirErrorRendererProps<MuiFhirErrorProps>,
  ) => ReactElement | null | undefined;
}

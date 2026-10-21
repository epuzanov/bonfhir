import { FhirInputArrayRendererProps } from "@bonfhir/react/r4b";
import { Box, IconButton, Stack, StackProps, Tooltip } from "@mui/material";
import { ReactElement, ReactNode, useEffect } from "react";

export function MuiFhirInputArray(
  props: FhirInputArrayRendererProps<MuiFhirInputArrayProps>,
): ReactElement | null {
  const max = props.max ?? Number.POSITIVE_INFINITY;
  const min = props.min ?? Number.NEGATIVE_INFINITY;

  useEffect(() => {
    if (!props.value?.length && min > 0) {
      for (let i = 0; i < min; i++) {
        props.onAdd?.(i);
      }
    }
    // Only run on mount.
  }, []);

  return (
    <Stack
      className={props.className}
      style={{ ...props.style, width: "100%" }}
      spacing={1}
      {...props.rendererProps?.stack}
    >
      {!props.value?.length && (
        <Box>
          <IconButton
            size="small"
            color="primary"
            onClick={() => props.onAdd?.(-1)}
            aria-label="Add"
          >
            {props.rendererProps?.iconAdd ?? "+"}
          </IconButton>
        </Box>
      )}
      {props.value?.map((value, index) => (
        <Stack key={index} direction="row" spacing={1} alignItems="flex-start">
          <Box flex={1}>
            {props.children?.({ arrayValue: props.value, value, index })}
          </Box>
          <Stack direction="row">
            <Tooltip title="Add">
              <Box
                component="span"
                sx={{
                  visibility:
                    index >= max ||
                    (props.canAdd && !props.canAdd(value, index))
                      ? "hidden"
                      : "visible",
                }}
              >
                <IconButton
                  size="small"
                  color="primary"
                  onClick={() => props.onAdd?.(index)}
                  aria-label="Add"
                >
                  {props.rendererProps?.iconAdd ?? "+"}
                </IconButton>
              </Box>
            </Tooltip>
            <Tooltip title="Remove">
              <Box
                component="span"
                sx={{ visibility: index < min ? "hidden" : "visible" }}
              >
                <IconButton
                  size="small"
                  color="error"
                  onClick={() => props.onRemove?.(index)}
                  aria-label="Remove"
                >
                  {props.rendererProps?.iconRemove ?? "\u2212"}
                </IconButton>
              </Box>
            </Tooltip>
          </Stack>
        </Stack>
      ))}
    </Stack>
  );
}

export interface MuiFhirInputArrayProps {
  stack?: StackProps | null | undefined;
  iconAdd?: ReactNode | null | undefined;
  iconRemove?: ReactNode | null | undefined;
}

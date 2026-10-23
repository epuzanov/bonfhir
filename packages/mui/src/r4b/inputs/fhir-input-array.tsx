import { FhirInputArrayRendererProps } from "@bonfhir/react/r4b";
import {
  Box,
  IconButton,
  InputAdornment,
  Pagination,
  PaginationProps,
  Stack,
  StackProps,
  TextField,
  TextFieldProps,
  Tooltip,
  Typography,
  TypographyProps,
} from "@mui/material";
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
      {props.isFilterable && (
        <TextField
          id={props.filterInputId}
          size="small"
          fullWidth
          label={props.rendererProps?.filterLabel ?? "Filter"}
          placeholder={props.filterPlaceholder ?? "Filter..."}
          value={props.filterText}
          onChange={(evt) => props.onFilterTextChange(evt.target.value)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                {props.filterText ? (
                  <IconButton
                    size="small"
                    aria-label="Clear filter"
                    onClick={() => props.onFilterTextChange("")}
                  >
                    {"\u00D7"}
                  </IconButton>
                ) : null}
              </InputAdornment>
            ),
          }}
          {...props.rendererProps?.filterInput}
        />
      )}
      {!props.visibleValue?.length && (
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
      {props.visibleValue?.map((visibleValue, position) => {
        const index = props.visibleIndexes[position] ?? position;

        return (
          <Stack
            key={index}
            direction="row"
            spacing={1}
            alignItems="flex-start"
          >
            <Box flex={1}>
              {props.children?.({
                arrayValue: props.value,
                value: visibleValue as never,
                index,
              })}
            </Box>
            <Stack direction="row">
              <Tooltip title="Add">
                <Box
                  component="span"
                  sx={{
                    visibility:
                      index >= max ||
                      (props.canAdd &&
                        !props.canAdd(visibleValue as never, index))
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
        );
      })}
      {props.pageInfo && props.pageInfo.pageCount > 1 && (
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          spacing={1}
          {...props.rendererProps?.paginationStack}
        >
          <Typography
            variant="caption"
            color="text.secondary"
            {...props.rendererProps?.paginationText}
          >
            {formatPageText(props)}
          </Typography>
          <Pagination
            size="small"
            count={props.pageInfo.pageCount}
            page={props.pageInfo.page}
            onChange={(_, page) => props.onPageChange(page)}
            {...props.rendererProps?.pagination}
          />
        </Stack>
      )}
    </Stack>
  );
}

function formatPageText(
  props: FhirInputArrayRendererProps<MuiFhirInputArrayProps>,
): string {
  const pageInfo = props.pageInfo;
  if (!pageInfo) {
    return "";
  }

  const from = pageInfo.count === 0 ? 0 : pageInfo.offset + 1;
  const to = pageInfo.offset + pageInfo.countOnPage;

  return (props.pagination?.pageTextTemplate ?? "{from}-{to} of {total}")
    .replace("{from}", String(from))
    .replace("{to}", String(to))
    .replace("{total}", String(pageInfo.count));
}

export interface MuiFhirInputArrayProps {
  stack?: StackProps | null | undefined;
  iconAdd?: ReactNode | null | undefined;
  iconRemove?: ReactNode | null | undefined;
  filterLabel?: ReactNode | null | undefined;
  filterInput?: TextFieldProps | null | undefined;
  paginationStack?: StackProps | null | undefined;
  paginationText?: TypographyProps | null | undefined;
  pagination?: PaginationProps | null | undefined;
}

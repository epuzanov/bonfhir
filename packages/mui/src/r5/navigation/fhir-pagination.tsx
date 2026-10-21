import { FhirPaginationRendererProps } from "@bonfhir/react/r5";
import {
  Box,
  BoxProps,
  Pagination,
  PaginationProps,
  Stack,
  StackProps,
} from "@mui/material";
import { ReactElement } from "react";

export function MuiFhirPagination(
  props: FhirPaginationRendererProps<MuiFhirPaginationProps>,
): ReactElement | null {
  return (
    <Stack
      direction="row"
      justifyContent="center"
      alignItems="center"
      spacing={1}
      className={props.className}
      style={props.style}
      {...props.rendererProps?.stack}
    >
      <Pagination
        showFirstButton
        showLastButton
        count={props.totalPages}
        page={props.pageNumber}
        disabled={props.totalPages === 0}
        onChange={(_, page) => {
          if (page > props.pageNumber) {
            if (page === props.totalPages) {
              props.onPageChange?.(props.data?.linkUrl("last"), page);
              return;
            }
            if (page === props.pageNumber + 1) {
              props.onPageChange?.(props.data?.linkUrl("next"), page);
              return;
            }
            return;
          }

          if (page === 1) {
            props.onPageChange?.(props.data?.linkUrl("first"), page);
            return;
          }
          if (page === props.pageNumber - 1) {
            props.onPageChange?.(props.data?.linkUrl("previous"), page);
          }
        }}
        {...props.rendererProps?.pagination}
      />
      <Box component="span" {...props.rendererProps?.renderedText}>
        {props.renderedTextTemplate}
      </Box>
    </Stack>
  );
}

export interface MuiFhirPaginationProps {
  stack?: StackProps | null | undefined;
  pagination?: PaginationProps | null | undefined;
  renderedText?: BoxProps | null | undefined;
}

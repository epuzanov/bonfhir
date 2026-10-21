/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  FhirTableColumn,
  FhirTableRendererProps,
  useFhirUIContext,
} from "@bonfhir/react/r4b";
import {
  Table,
  TableBody,
  TableBodyProps,
  TableCell,
  TableCellProps,
  TableHead,
  TableHeadProps,
  TableProps,
  TableRow,
  TableRowProps,
  TableSortLabel,
} from "@mui/material";
import { ReactElement, createElement } from "react";

export function MuiFhirTable(
  props: FhirTableRendererProps<MuiFhirTableProps>,
): ReactElement | null {
  const { onNavigate } = useFhirUIContext();

  return (
    <Table
      className={props.className}
      style={props.style}
      {...props.rendererProps?.table}
    >
      <TableHead {...props.rendererProps?.thead}>
        {props.rendererProps?.theadPrefix
          ? createElement(props.rendererProps.theadPrefix)
          : null}
        <TableRow>
          {props.columns.map((column) => (
            <TableCell
              key={column.key}
              {...propsOrFunction(props.rendererProps?.th, column)}
            >
              {createElement(
                props.rendererProps?.headerCell ?? MuiFhirTableHeader,
                {
                  column,
                  parsedSort: props.parsedSort,
                  onSortChange: props.onSortChange,
                },
              )}
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
      {Boolean(props.rows) && (
        <TableBody {...props.rendererProps?.tbody}>
          {props.rows?.map((row, index) => (
            <TableRow
              key={index}
              hover={Boolean(props.onRowClick || props.onRowNavigate)}
              onClick={() => {
                props.onRowClick?.(row as any, index);
                const target = props.onRowNavigate?.(row as any, index);
                if (target) {
                  onNavigate?.({ target, aux: false });
                }
              }}
              sx={{
                cursor:
                  props.onRowClick || props.onRowNavigate
                    ? "pointer"
                    : "default",
              }}
              {...propsOrFunction(props.rendererProps?.tr, row)}
            >
              {props.columns.map((column) => (
                <TableCell
                  key={column.key}
                  {...propsOrFunction(props.rendererProps?.td, column, row)}
                >
                  {column.render(row as any, index)}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      )}
    </Table>
  );
}

export interface MuiFhirTableHeaderProps {
  column: FhirTableColumn<any>;
  parsedSort: FhirTableRendererProps["parsedSort"];
  onSortChange: FhirTableRendererProps["onSortChange"];
}

function MuiFhirTableHeader({
  column,
  parsedSort,
  onSortChange,
}: MuiFhirTableHeaderProps) {
  if (!column.sortable) {
    return <>{column.title}</>;
  }

  return (
    <TableSortLabel
      active={parsedSort?.columnKey === column.key}
      direction={
        parsedSort?.columnKey === column.key && parsedSort.desc ? "desc" : "asc"
      }
      onClick={() => {
        onSortChange?.(parsedSort?.desc ? column.key : `-${column.key}`);
      }}
    >
      {column.title}
    </TableSortLabel>
  );
}

export function propsOrFunction<TProps extends object>(
  value: TProps | ((...arg: any[]) => TProps) | null | undefined,
  ...arg: any[]
): TProps | null | undefined {
  if (typeof value === "function") {
    return value(...arg);
  }

  return value;
}

export interface MuiFhirTableProps {
  table?: TableProps | null | undefined;
  thead?: TableHeadProps | null | undefined;
  theadPrefix?: () => ReactElement;
  headerCell?: (props: MuiFhirTableHeaderProps) => ReactElement;
  tbody?: TableBodyProps | null | undefined;
  th?:
    | TableCellProps
    | ((column: FhirTableColumn<any>) => TableCellProps)
    | null
    | undefined;
  tr?: TableRowProps | ((row: any) => TableRowProps) | null | undefined;
  td?:
    | TableCellProps
    | ((column: FhirTableColumn<any>, row: any) => TableCellProps)
    | null
    | undefined;
}

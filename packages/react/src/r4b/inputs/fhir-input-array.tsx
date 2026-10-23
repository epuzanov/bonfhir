import { ReactElement, ReactNode, useId, useMemo, useState } from "react";
import { useFhirUIContext } from "../context";

export interface FhirInputArrayHelper<TValue> {
  arrayValue: TValue[] | null | undefined;
  value: TValue | null | undefined;
  /**
   * The index of the value in the original array, i.e. the index to use with `onAdd` /
   * `onRemove` and to read from `arrayValue`.
   *
   * When `filterBy` or `pagination` are used, this is **not** the position of the value on
   * the current page.
   */
  index: number;
}

/** Describes the state of the pagination of a {@link FhirInputArray}. */
export interface FhirInputArrayPageInfo {
  /** The current page, 1-based. */
  page: number;
  /** The number of pages. */
  pageCount: number;
  /** The number of values matching the filter. */
  count: number;
  /** The number of values matching the filter, per page. */
  pageSize: number;
  /** The index of the first value of the page, in the whole filtered array. */
  offset: number;
  /** The number of values matching the filter, on the current page. */
  countOnPage: number;
}

/**
 * Access a nested property of a value, using a dotted path - e.g. `value`, `name.family`,
 * `0` or `telecom.value`.
 *
 * A path going through an array collects the property of every item - e.g. `telecom.value`
 * on a `ContactPoint[]` returns the array of their values.
 */
function getValueAtPath(value: unknown, path: string): unknown {
  return resolvePath(
    value,
    path.split(".").filter((segment) => segment.length > 0),
  );
}

function resolvePath(value: unknown, segments: string[]): unknown {
  const segment = segments[0];
  if (value == undefined || segment === undefined) {
    return value;
  }

  const remainingSegments = segments.slice(1);

  if (Array.isArray(value)) {
    if (/^\d+$/.test(segment)) {
      return resolvePath(value[Number(segment)], remainingSegments);
    }

    return value
      .map((item) => resolvePath(item, segments))
      .filter((item) => item != undefined);
  }

  if (typeof value !== "object") {
    return undefined;
  }

  return resolvePath(
    (value as Record<string, unknown>)[segment],
    remainingSegments,
  );
}

function includesSearchText(value: unknown, searchText: string): boolean {
  if (value == undefined) {
    return false;
  }

  if (Array.isArray(value)) {
    return value.some((item) => includesSearchText(item, searchText));
  }

  if (typeof value === "object") {
    return Object.values(value as Record<string, unknown>).some((item) =>
      includesSearchText(item, searchText),
    );
  }

  return String(value).toLowerCase().includes(searchText);
}

export interface FhirInputArrayPaginationProps {
  /** When set, the values are paginated. */
  pageSize?: number | null | undefined;
  /** The initial page, 1-based. Defaults to 1. */
  initialPage?: number | null | undefined;
  /** The text to display in the pagination. Defaults to "{from}-{to} of {total}". */
  pageTextTemplate?: string | null | undefined;
}

export interface FhirInputArrayProps<TValue, TRendererProps = any> {
  label?: ReactNode | null | undefined;
  description?: ReactNode | null | undefined;
  error?: ReactNode | null | undefined;
  required?: boolean | null | undefined;
  value: TValue[] | null | undefined;
  min?: number | null | undefined;
  max?: number | null | undefined;
  children?: ((helper: FhirInputArrayHelper<TValue>) => ReactNode) | undefined;
  onAdd?: (index: number) => void;
  canAdd?: ((value: TValue, index: number) => boolean) | null | undefined;
  onRemove?: (index: number) => void;
  /**
   * The property used by the filter input, as a dotted path - e.g. `resourceType`.
   *
   * When not set, the filter matches any property of the value.
   *
   * Setting it also displays the filter input, even when pagination is disabled.
   */
  filterBy?: string | null | undefined;
  /**
   * The filter text used to control the filter input.
   *
   * Use it to pre-filter the values, e.g. to only display the `DocumentReference` resources of
   * a `contained` array. When omitted, the filter is managed by the component itself (see
   * `initialFilter`).
   */
  filter?: string | null | undefined;
  /** The initial filter text, when the filter is not controlled. */
  initialFilter?: string | null | undefined;
  /** Called when the filter text changes. */
  onFilterChange?: ((filterText: string) => void) | null | undefined;
  /**
   * Custom predicate used to match a value against the filter text.
   *
   * Takes precedence over `filterBy`. Use it when the default "contains" matching is not
   * precise enough - e.g. to match an exact `resourceType`:
   *
   * ```tsx
   * filterPredicate={(value, filter) => value.resourceType === filter}
   * ```
   */
  filterPredicate?:
    | ((value: TValue, filterText: string) => boolean)
    | null
    | undefined;
  /** The placeholder of the filter input. Defaults to "Filter...". */
  filterPlaceholder?: string | null | undefined;
  /**
   * Enable pagination and the filter input.
   *
   * Filtering and pagination only affect the values that are rendered: `onAdd` and
   * `onRemove` keep working with indexes of the original array.
   */
  pagination?: FhirInputArrayPaginationProps | null | undefined;
  className?: string | undefined;
  style?: Record<string, any> | undefined;
  rendererProps?: TRendererProps;
}

export function FhirInputArray<TValue, TRendererProps = any>(
  props: FhirInputArrayProps<TValue, TRendererProps>,
): ReactElement | null {
  const { applyDefaultProps, render } = useFhirUIContext();
  props = applyDefaultProps("FhirInputArray", props);

  const filterBy = props.filterBy ?? undefined;
  const filterPredicate = props.filterPredicate ?? undefined;
  const pageSize = props.pagination?.pageSize ?? undefined;
  const isPaginated = !!pageSize && pageSize > 0;
  const isFilterable =
    filterBy !== undefined ||
    filterPredicate !== undefined ||
    isPaginated ||
    props.filter != undefined ||
    props.initialFilter != undefined;

  const [managedFilterText, setManagedFilterText] = useState(
    props.initialFilter ?? "",
  );
  const filterText = props.filter ?? managedFilterText;
  const [page, setPage] = useState(props.pagination?.initialPage ?? 1);
  const filterInputId = useId();

  const onFilterTextChange = (newFilterText: string) => {
    if (props.filter == undefined) {
      setManagedFilterText(newFilterText);
    }
    props.onFilterChange?.(newFilterText);
  };

  const filteredIndexes = useMemo(() => {
    const indexes = (props.value ?? []).map((_, index) => index);
    const normalizedFilterText = filterText.trim().toLowerCase();
    if (!normalizedFilterText) {
      return indexes;
    }

    return indexes.filter((index) => {
      const value = props.value?.[index];
      if (value === undefined) {
        return false;
      }

      if (filterPredicate) {
        return filterPredicate(value, filterText.trim());
      }

      const valueToFilter =
        filterBy === undefined ? value : getValueAtPath(value, filterBy);

      return includesSearchText(valueToFilter, normalizedFilterText);
    });
  }, [props.value, filterBy, filterPredicate, filterText]);

  const pageCount = isPaginated
    ? Math.max(1, Math.ceil(filteredIndexes.length / pageSize))
    : 1;
  const currentPage = Math.min(Math.max(page, 1), pageCount);
  const pageStart = isPaginated ? (currentPage - 1) * pageSize : 0;
  const visibleIndexes = isPaginated
    ? filteredIndexes.slice(pageStart, pageStart + pageSize)
    : filteredIndexes;

  const pageInfo: FhirInputArrayPageInfo | undefined = isPaginated
    ? {
        page: currentPage,
        pageCount,
        count: filteredIndexes.length,
        pageSize,
        offset: pageStart,
        countOnPage: visibleIndexes.length,
      }
    : undefined;

  return render<FhirInputArrayRendererProps>("FhirInputArray", {
    ...props,
    filterBy,
    isFilterable,
    visibleValue: visibleIndexes.map((index) => props.value?.[index]),
    visibleIndexes,
    filterText,
    onFilterTextChange,
    filterInputId,
    page: currentPage,
    onPageChange: setPage,
    pageInfo,
    rendererProps: props.rendererProps,
  });
}

export interface FhirInputArrayRendererProps<TValue = any, TRendererProps = any>
  extends FhirInputArrayProps<TValue, TRendererProps> {
  /** The values that should be rendered, after filtering and pagination. */
  visibleValue: Array<TValue | undefined>;
  /** The index of each visible value, in the original `value` array. */
  visibleIndexes: number[];
  /** Whether the filter input should be displayed. */
  isFilterable: boolean;
  /** The current filter text. */
  filterText: string;
  /** Updates the filter text. */
  onFilterTextChange: (filterText: string) => void;
  /** An id to use for the filter input, so that its label points to it. */
  filterInputId: string;
  /** The current page, 1-based. */
  page: number;
  /** Updates the current page. */
  onPageChange: (page: number) => void;
  /** Describes the pagination, when it is enabled. */
  pageInfo: FhirInputArrayPageInfo | undefined;
}

export type FhirInputArrayRenderer = (
  props: FhirInputArrayRendererProps,
) => ReactElement | null;

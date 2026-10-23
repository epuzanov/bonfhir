import { FhirInputArrayRendererProps } from "@bonfhir/react/r6";
import {
  ActionIcon,
  ActionIconProps,
  Grid,
  GridProps,
  Group,
  GroupProps,
  Input,
  InputWrapperProps,
  Pagination,
  PaginationProps,
  Text,
  TextInput,
  TextInputProps,
  TextProps,
} from "@mantine/core";
import { IconMinus, IconPlus } from "@tabler/icons-react";
import { ReactElement, ReactNode, useEffect } from "react";

export function MantineFhirInputArray(
  props: FhirInputArrayRendererProps<MantineFhirInputArrayProps>,
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
    <Input.Wrapper
      className={props.className}
      style={{ ...props.style, width: "100%" }}
      label={props.label}
      description={props.description}
      error={props.error}
      required={Boolean(props.required)}
      {...props.rendererProps?.wrapper}
    >
      {props.isFilterable && (
        <Group wrap="nowrap" mb="xs" {...props.rendererProps?.filterGroup}>
          <Input.Label htmlFor={props.filterInputId} hidden>
            Filter
          </Input.Label>
          <TextInput
            id={props.filterInputId}
            size="xs"
            w="100%"
            placeholder={props.filterPlaceholder ?? "Filter..."}
            value={props.filterText}
            onChange={(evt) =>
              props.onFilterTextChange(evt.currentTarget.value)
            }
            {...props.rendererProps?.filterInput}
          />
        </Group>
      )}
      {!props.visibleValue?.length && (
        <ActionIcon
          variant="outline"
          color="primary"
          onClick={() => props.onAdd?.(-1)}
          {...props.rendererProps?.actionIconAdd}
        >
          <IconPlus />
        </ActionIcon>
      )}
      {props.visibleValue?.map((visibleValue, position) => {
        const index = props.visibleIndexes[position] ?? position;

        return (
          <Grid key={index} align="center" {...props.rendererProps?.grid}>
            <Grid.Col span="auto">
              {props.children?.({
                arrayValue: props.value,
                value: visibleValue as never,
                index,
              })}
            </Grid.Col>
            <Grid.Col span="content">
              <Group wrap="nowrap" gap="xs">
                <ActionIcon
                  variant="outline"
                  color="primary"
                  onClick={() => props.onAdd?.(index)}
                  style={{
                    visibility:
                      index >= max ||
                      (props.canAdd &&
                        !props.canAdd(visibleValue as never, index))
                        ? "hidden"
                        : "visible",
                  }}
                  {...props.rendererProps?.actionIconAdd}
                >
                  {props.rendererProps?.iconAdd ?? <IconPlus />}
                </ActionIcon>
                <ActionIcon
                  variant="subtle"
                  color="red"
                  onClick={() => props.onRemove?.(index)}
                  style={{
                    visibility: index < min ? "hidden" : "visible",
                  }}
                  {...props.rendererProps?.actionRemove}
                >
                  {props.rendererProps?.iconRemove ?? <IconMinus />}
                </ActionIcon>
              </Group>
            </Grid.Col>
          </Grid>
        );
      })}
      {props.pageInfo && props.pageInfo.pageCount > 1 && (
        <Group
          justify="space-between"
          mt="xs"
          {...props.rendererProps?.paginationGroup}
        >
          <Text size="xs" c="dimmed" {...props.rendererProps?.paginationText}>
            {formatPageText(props)}
          </Text>
          <Pagination
            size="xs"
            total={props.pageInfo.pageCount}
            value={props.pageInfo.page}
            onChange={props.onPageChange}
            {...props.rendererProps?.pagination}
          />
        </Group>
      )}
    </Input.Wrapper>
  );
}

function formatPageText(
  props: FhirInputArrayRendererProps<MantineFhirInputArrayProps>,
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

export interface MantineFhirInputArrayProps {
  wrapper?: InputWrapperProps | null | undefined;
  grid?: GridProps | null | undefined;
  actionIconAdd?: ActionIconProps | null | undefined;
  iconAdd?: ReactNode | null | undefined;
  actionIconRemove?: ActionIconProps | null | undefined;
  iconRemove?: ReactNode | null | undefined;
  filterGroup?: GroupProps | null | undefined;
  filterInput?: TextInputProps | null | undefined;
  paginationGroup?: GroupProps | null | undefined;
  paginationText?: TextProps | null | undefined;
  pagination?: PaginationProps | null | undefined;
}

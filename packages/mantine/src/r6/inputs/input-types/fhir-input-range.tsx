import {
  FhirInput,
  FhirInputQuantityProps,
  FhirInputRangeRendererProps,
} from "@bonfhir/react/r6";
import {
  Group,
  GroupProps,
  Input,
  InputWrapperProps,
  Text,
} from "@mantine/core";
import { ReactElement } from "react";

export function MantineFhirInputRange(
  props: FhirInputRangeRendererProps<MantineFhirInputRangeProps>,
): ReactElement | null {
  return (
    <Input.Wrapper
      className={props.className}
      style={props.style}
      label={props.label}
      description={props.description}
      error={props.error}
      required={Boolean(props.required)}
      {...props.rendererProps?.wrapper}
    >
      <Group gap="xs" grow {...props.rendererProps?.group}>
        <FhirInput
          type="Quantity"
          value={props.value?.low}
          disabled={Boolean(props.disabled)}
          onChange={(low) => props.onChange?.({ ...props.value, low })}
          {...props.rendererProps?.low}
        />
        <Text span c="dimmed">
          …
        </Text>
        <FhirInput
          type="Quantity"
          value={props.value?.high}
          disabled={Boolean(props.disabled)}
          onChange={(high) => props.onChange?.({ ...props.value, high })}
          {...props.rendererProps?.high}
        />
      </Group>
    </Input.Wrapper>
  );
}

export type MantineFhirInputRangeProps = {
  wrapper?: Omit<InputWrapperProps, "children"> | null | undefined;
  group?: GroupProps | null | undefined;
  low?:
    | Omit<FhirInputQuantityProps, "type" | "value" | "onChange">
    | null
    | undefined;
  high?:
    | Omit<FhirInputQuantityProps, "type" | "value" | "onChange">
    | null
    | undefined;
};

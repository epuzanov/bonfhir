import {
  FhirInput,
  FhirInputQuantityProps,
  FhirInputRatioRendererProps,
} from "@bonfhir/react/r5";
import {
  Group,
  GroupProps,
  Input,
  InputWrapperProps,
  Text,
} from "@mantine/core";
import { ReactElement } from "react";

export function MantineFhirInputRatio(
  props: FhirInputRatioRendererProps<MantineFhirInputRatioProps>,
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
          value={props.value?.numerator}
          disabled={Boolean(props.disabled)}
          onChange={(numerator) =>
            props.onChange?.({ ...props.value, numerator })
          }
          {...props.rendererProps?.numerator}
        />
        <Text span c="dimmed">
          /
        </Text>
        <FhirInput
          type="Quantity"
          value={props.value?.denominator}
          disabled={Boolean(props.disabled)}
          onChange={(denominator) =>
            props.onChange?.({ ...props.value, denominator })
          }
          {...props.rendererProps?.denominator}
        />
      </Group>
    </Input.Wrapper>
  );
}

export type MantineFhirInputRatioProps = {
  wrapper?: Omit<InputWrapperProps, "children"> | null | undefined;
  group?: GroupProps | null | undefined;
  numerator?:
    | Omit<FhirInputQuantityProps, "type" | "value" | "onChange">
    | null
    | undefined;
  denominator?:
    | Omit<FhirInputQuantityProps, "type" | "value" | "onChange">
    | null
    | undefined;
};

import {
  FhirInput,
  FhirInputPeriodRendererProps,
  FhirInputStringProps,
} from "@bonfhir/react/r5";
import { Group, GroupProps, Input, InputWrapperProps } from "@mantine/core";
import { ReactElement } from "react";

export function MantineFhirInputPeriod(
  props: FhirInputPeriodRendererProps<MantineFhirInputPeriodProps>,
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
          type="dateTime"
          placeholder="Start"
          value={props.value?.start}
          disabled={Boolean(props.disabled)}
          onChange={(start) => props.onChange?.({ ...props.value, start })}
          {...props.rendererProps?.start}
        />
        <FhirInput
          type="dateTime"
          placeholder="End"
          value={props.value?.end}
          disabled={Boolean(props.disabled)}
          onChange={(end) => props.onChange?.({ ...props.value, end })}
          {...props.rendererProps?.end}
        />
      </Group>
    </Input.Wrapper>
  );
}

export type MantineFhirInputPeriodProps = {
  wrapper?: Omit<InputWrapperProps, "children"> | null | undefined;
  group?: GroupProps | null | undefined;
  start?:
    | Omit<FhirInputStringProps, "type" | "value" | "onChange">
    | null
    | undefined;
  end?:
    | Omit<FhirInputStringProps, "type" | "value" | "onChange">
    | null
    | undefined;
};

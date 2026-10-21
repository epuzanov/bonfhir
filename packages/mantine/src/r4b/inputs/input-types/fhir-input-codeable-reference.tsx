import { AnyResourceType } from "@bonfhir/core/r4b";
import {
  FhirInput,
  FhirInputCodeableReferenceRendererProps,
} from "@bonfhir/react/r4b";
import {
  Input,
  InputWrapperProps,
  SegmentedControl,
  SegmentedControlProps,
  Stack,
  StackProps,
} from "@mantine/core";
import { ReactElement, useState } from "react";

/**
 * Renders a {@link CodeableReference}: either a reference to a resource, or a concept
 * defined in a terminology.
 */
export function MantineFhirInputCodeableReference(
  props: FhirInputCodeableReferenceRendererProps<MantineFhirInputCodeableReferenceProps>,
): ReactElement | null {
  const hasReference = Boolean(props.value?.reference);
  const [mode, setMode] = useState<"reference" | "concept">(
    hasReference ? "reference" : "concept",
  );

  const modeProps = props.mode;
  if (modeProps === "reference" || modeProps === "concept") {
    return renderInput(modeProps);
  }

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
      <Stack gap="xs" {...props.rendererProps?.stack}>
        <SegmentedControl
          size="xs"
          value={mode}
          onChange={(value) => {
            setMode(value as "reference" | "concept");
            props.onChange?.(undefined);
          }}
          data={[
            { label: "Concept", value: "concept" },
            { label: "Reference", value: "reference" },
          ]}
          {...props.rendererProps?.segmentedControl}
        />
        {renderInput(mode)}
      </Stack>
    </Input.Wrapper>
  );

  function renderInput(currentMode: "reference" | "concept"): ReactElement {
    if (currentMode === "reference") {
      return (
        <FhirInput
          type="Reference"
          resourceType={
            (props.referenceResourceType || "Resource") as AnyResourceType
          }
          value={props.value?.reference}
          disabled={Boolean(props.disabled)}
          required={Boolean(props.required)}
          onChange={(reference) =>
            props.onChange?.(reference ? { reference } : undefined)
          }
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          {...(props.rendererProps?.reference as any)}
        />
      );
    }

    return (
      <FhirInput
        type="CodeableConcept"
        source={
          props.conceptSource || "http://hl7.org/fhir/ValueSet/all-languages"
        }
        value={props.value?.concept}
        disabled={Boolean(props.disabled)}
        required={Boolean(props.required)}
        onChange={(concept) =>
          props.onChange?.(concept ? { concept } : undefined)
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        {...(props.rendererProps?.concept as any)}
      />
    );
  }
}

export type MantineFhirInputCodeableReferenceProps = {
  wrapper?: Omit<InputWrapperProps, "children"> | null | undefined;
  stack?: StackProps | null | undefined;
  segmentedControl?: SegmentedControlProps | null | undefined;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  reference?: any | null | undefined;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  concept?: any | null | undefined;
};

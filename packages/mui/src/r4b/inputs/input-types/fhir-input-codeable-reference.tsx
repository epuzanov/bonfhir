import type { AnyResourceType } from "@bonfhir/core/r4b";
import {
  FhirInput,
  FhirInputCodeableReferenceRendererProps,
} from "@bonfhir/react/r4b";
import {
  Box,
  ToggleButton,
  ToggleButtonGroup,
  ToggleButtonGroupProps,
} from "@mui/material";
import { ReactElement, useState } from "react";
import { MuiInputWrapper } from "./common";

export function MuiFhirInputCodeableReference(
  props: FhirInputCodeableReferenceRendererProps<MuiFhirInputCodeableReferenceProps>,
): ReactElement | null {
  const [mode, setMode] = useState<"reference" | "concept">(
    props.value?.reference ? "reference" : "concept",
  );

  if (props.mode === "reference" || props.mode === "concept") {
    return renderInput(props.mode);
  }

  return (
    <MuiInputWrapper
      className={props.className}
      style={props.style}
      label={props.label}
      description={props.description}
      error={props.error}
      required={props.required}
    >
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
        <ToggleButtonGroup
          size="small"
          exclusive
          value={mode}
          onChange={(_, value) => {
            if (!value) {
              return;
            }
            setMode(value);
            props.onChange?.(undefined);
          }}
          {...props.rendererProps?.toggleButtonGroup}
        >
          <ToggleButton value="concept">Concept</ToggleButton>
          <ToggleButton value="reference">Reference</ToggleButton>
        </ToggleButtonGroup>
        {renderInput(mode)}
      </Box>
    </MuiInputWrapper>
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
          props.conceptSource ?? "http://hl7.org/fhir/ValueSet/all-languages"
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

export interface MuiFhirInputCodeableReferenceProps {
  toggleButtonGroup?: ToggleButtonGroupProps | null | undefined;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  reference?: any | null | undefined;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  concept?: any | null | undefined;
}

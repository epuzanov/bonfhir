import {
  FhirInput,
  FhirInputIdentifierRendererProps,
} from "@bonfhir/react/r4b";
import { Stack, StackProps } from "@mui/material";
import { ReactElement } from "react";
import { MuiInputWrapper } from "./common";

export function MuiFhirInputIdentifier(
  props: FhirInputIdentifierRendererProps<MuiFhirInputIdentifierProps>,
): ReactElement | null {
  return (
    <MuiInputWrapper
      className={props.className}
      style={props.style}
      label={props.label}
      description={props.description}
      error={props.error}
      required={props.required}
    >
      <Stack direction="row" spacing={1} {...props.rendererProps?.stack}>
        <FhirInput
          type="code"
          source="http://hl7.org/fhir/ValueSet/identifier-use"
          label="Use"
          value={props.value?.use}
          disabled={Boolean(props.disabled)}
          onChange={(use) =>
            props.onChange?.({ ...props.value, use: use as never })
          }
          {...props.rendererProps?.use}
        />
        <FhirInput
          type="string"
          label="System"
          value={props.value?.system}
          disabled={Boolean(props.disabled)}
          onChange={(system) => props.onChange?.({ ...props.value, system })}
          {...props.rendererProps?.system}
        />
        <FhirInput
          type="string"
          label="Value"
          value={props.value?.value}
          disabled={Boolean(props.disabled)}
          onChange={(value) => props.onChange?.({ ...props.value, value })}
          {...props.rendererProps?.value}
        />
      </Stack>
    </MuiInputWrapper>
  );
}

export interface MuiFhirInputIdentifierProps {
  stack?: StackProps | null | undefined;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  use?: any | null | undefined;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  system?: any | null | undefined;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value?: any | null | undefined;
}

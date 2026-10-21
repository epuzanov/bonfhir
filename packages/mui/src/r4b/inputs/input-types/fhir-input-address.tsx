import type { AddressType, AddressUse } from "@bonfhir/core/r4b";
import { FhirInput, FhirInputAddressRendererProps } from "@bonfhir/react/r4b";
import { Grid, GridProps } from "@mui/material";
import { ReactElement } from "react";
import { MuiInputWrapper } from "./common";

export function MuiFhirInputAddress(
  props: FhirInputAddressRendererProps<MuiFhirInputAddressProps>,
): ReactElement | null {
  let mode = props.mode;
  switch (mode) {
    case "simple": {
      mode = ["line", "city"];
      break;
    }
    case "full":
    case null:
    case undefined: {
      mode = ["use", "line", "city", "state", "postalCode", "country"];
      break;
    }
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
      <Grid container spacing={1} {...props.rendererProps?.grid}>
        {mode.map((component) => (
          <Grid item xs={12} sm={6} key={component}>
            {renderComponent(component)}
          </Grid>
        ))}
      </Grid>
    </MuiInputWrapper>
  );

  function renderComponent(component: string): ReactElement {
    switch (component) {
      case "use": {
        return (
          <FhirInput
            type="code"
            source="http://hl7.org/fhir/ValueSet/address-use"
            label="Use"
            value={props.value?.use}
            disabled={Boolean(props.disabled)}
            onChange={(use) =>
              props.onChange?.({ ...props.value, use: use as AddressUse })
            }
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            {...(props.rendererProps?.use as any)}
          />
        );
      }
      case "type": {
        return (
          <FhirInput
            type="code"
            source="http://hl7.org/fhir/ValueSet/address-type"
            label="Type"
            value={props.value?.type}
            disabled={Boolean(props.disabled)}
            onChange={(type) =>
              props.onChange?.({ ...props.value, type: type as AddressType })
            }
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            {...(props.rendererProps?.type as any)}
          />
        );
      }
      case "line": {
        return (
          <FhirInput
            type="string"
            label="Line"
            value={(props.value?.line || []).join("\n")}
            disabled={Boolean(props.disabled)}
            onChange={(line) =>
              props.onChange?.({
                ...props.value,
                line: line?.length
                  ? line
                      .split("\n")
                      .map((x) => x.trim())
                      .filter(Boolean)
                  : undefined,
              })
            }
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            {...(props.rendererProps?.line as any)}
          />
        );
      }
      default: {
        return (
          <FhirInput
            type="string"
            label={component[0]?.toUpperCase() + component.slice(1)}
            value={
              props.value?.[component as keyof typeof props.value] as string
            }
            disabled={Boolean(props.disabled)}
            onChange={(value) =>
              props.onChange?.({ ...props.value, [component]: value })
            }
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            {...((props.rendererProps as any)?.[component] as any)}
          />
        );
      }
    }
  }
}

export interface MuiFhirInputAddressProps {
  grid?: GridProps | null | undefined;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  use?: any | null | undefined;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  type?: any | null | undefined;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  line?: any | null | undefined;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  city?: any | null | undefined;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  district?: any | null | undefined;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  state?: any | null | undefined;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  postalCode?: any | null | undefined;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  country?: any | null | undefined;
}

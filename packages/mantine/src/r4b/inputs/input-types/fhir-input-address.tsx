import { AddressType, AddressUse } from "@bonfhir/core/r4b";
import {
  FhirInput,
  FhirInputAddressComponent,
  FhirInputAddressRendererProps,
  FhirInputStringProps,
} from "@bonfhir/react/r4b";
import {
  Input,
  InputWrapperProps,
  SimpleGrid,
  SimpleGridProps,
} from "@mantine/core";
import { ReactElement } from "react";

export function MantineFhirInputAddress(
  props: FhirInputAddressRendererProps<MantineFhirInputAddressProps>,
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
    <Input.Wrapper
      className={props.className}
      style={props.style}
      label={props.label}
      description={props.description}
      error={props.error}
      required={Boolean(props.required)}
      {...props.rendererProps?.wrapper}
    >
      <SimpleGrid cols={2} spacing="xs" {...props.rendererProps?.grid}>
        {mode.map((component) => renderComponent(component))}
      </SimpleGrid>
    </Input.Wrapper>
  );

  function renderComponent(component: FhirInputAddressComponent): ReactElement {
    switch (component) {
      case "use": {
        return (
          <FhirInput
            key={component}
            type="code"
            source="http://hl7.org/fhir/ValueSet/address-use"
            placeholder="Use"
            value={props.value?.use}
            disabled={Boolean(props.disabled)}
            onChange={(use) =>
              props.onChange?.({
                ...props.value,
                use: use as AddressUse,
              })
            }
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            {...(props.rendererProps?.use as any)}
          />
        );
      }
      case "type": {
        return (
          <FhirInput
            key={component}
            type="code"
            source="http://hl7.org/fhir/ValueSet/address-type"
            placeholder="Type"
            value={props.value?.type}
            disabled={Boolean(props.disabled)}
            onChange={(type) =>
              props.onChange?.({
                ...props.value,
                type: type as AddressType,
              })
            }
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            {...(props.rendererProps?.type as any)}
          />
        );
      }
      case "line": {
        return (
          <FhirInput
            key={component}
            type="string"
            placeholder="Line"
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
            {...props.rendererProps?.line}
          />
        );
      }
      case "city":
      case "district":
      case "state":
      case "postalCode":
      case "country": {
        return (
          <FhirInput
            key={component}
            type="string"
            placeholder={component[0]?.toUpperCase() + component.slice(1)}
            value={props.value?.[component]}
            disabled={Boolean(props.disabled)}
            onChange={(value) =>
              props.onChange?.({
                ...props.value,
                [component]: value,
              })
            }
            {...props.rendererProps?.[component]}
          />
        );
      }
      default: {
        throw new TypeError(`Invalid component: ${component}`);
      }
    }
  }
}

export type MantineFhirInputAddressProps = {
  wrapper?: Omit<InputWrapperProps, "children"> | null | undefined;
  grid?: SimpleGridProps | null | undefined;
  use?: FhirInputStringProps | null | undefined;
  type?: FhirInputStringProps | null | undefined;
  line?:
    | Omit<FhirInputStringProps, "type" | "value" | "onChange">
    | null
    | undefined;
  city?: FhirInputStringProps | null | undefined;
  district?: FhirInputStringProps | null | undefined;
  state?: FhirInputStringProps | null | undefined;
  postalCode?: FhirInputStringProps | null | undefined;
  country?: FhirInputStringProps | null | undefined;
};

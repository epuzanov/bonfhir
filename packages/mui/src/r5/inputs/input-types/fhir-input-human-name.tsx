import { FhirInput, FhirInputHumanNameRendererProps } from "@bonfhir/react/r5";
import { Stack, StackProps } from "@mui/material";
import { ReactElement } from "react";
import { MuiInputWrapper } from "./common";

export function MuiFhirInputHumanName(
  props: FhirInputHumanNameRendererProps<MuiFhirInputHumanNameProps>,
): ReactElement | null {
  const separator = props.separator ?? " ";

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
          type="string"
          label="Prefix"
          value={props.value?.prefix?.join(separator)}
          disabled={Boolean(props.disabled)}
          onChange={(prefix) =>
            props.onChange?.({
              ...props.value,
              prefix: splitTrim(prefix, separator),
            })
          }
          {...props.rendererProps?.prefix}
        />
        <FhirInput
          type="string"
          label="Given"
          value={props.value?.given?.join(separator)}
          disabled={Boolean(props.disabled)}
          onChange={(given) =>
            props.onChange?.({
              ...props.value,
              given: splitTrim(given, separator),
            })
          }
          {...props.rendererProps?.given}
        />
        <FhirInput
          type="string"
          label="Family"
          value={props.value?.family}
          disabled={Boolean(props.disabled)}
          onChange={(family) => props.onChange?.({ ...props.value, family })}
          {...props.rendererProps?.family}
        />
        <FhirInput
          type="string"
          label="Suffix"
          value={props.value?.suffix?.join(separator)}
          disabled={Boolean(props.disabled)}
          onChange={(suffix) =>
            props.onChange?.({
              ...props.value,
              suffix: splitTrim(suffix, separator),
            })
          }
          {...props.rendererProps?.suffix}
        />
      </Stack>
    </MuiInputWrapper>
  );
}

function splitTrim(
  value: string | null | undefined,
  separator: string,
): string[] | undefined {
  if (!value?.trim()) {
    return;
  }

  return value
    .split(separator)
    .map((x) => x.trim())
    .filter(Boolean);
}

export interface MuiFhirInputHumanNameProps {
  stack?: StackProps | null | undefined;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  prefix?: any | null | undefined;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  given?: any | null | undefined;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  family?: any | null | undefined;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  suffix?: any | null | undefined;
}

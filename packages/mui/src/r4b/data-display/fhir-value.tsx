import type {
  CommonFormatterOptions,
  valueFormatters,
} from "@bonfhir/core/r4b";
import { FhirValueRendererProps, useFhirUIContext } from "@bonfhir/react/r4b";
import { Box, BoxProps, Typography, TypographyProps } from "@mui/material";
import { ReactElement } from "react";

export function MuiFhirValue(
  props: FhirValueRendererProps<MuiFhirValueProps>,
): ReactElement | null {
  const { formatter } = useFhirUIContext();

  if (hasRelativeOptions(props.options)) {
    return (
      <Typography
        component="span"
        className={props.className}
        style={props.style}
        {...props.rendererProps?.typography}
        title={formatter.format(
          props.type,
          props.value,
          props.rendererProps?.relativeDateTitleFormatter,
        )}
      >
        {props.formattedValue}
      </Typography>
    );
  }

  if (props.type === "markdown" && props.options?.style === "html") {
    return (
      <Box
        className={props.className}
        style={props.style}
        dangerouslySetInnerHTML={{ __html: props.formattedValue }}
        {...props.rendererProps?.box}
      />
    );
  }

  return (
    <Typography
      component="span"
      className={props.className}
      style={props.style}
      {...props.rendererProps?.typography}
    >
      {props.formattedValue}
    </Typography>
  );
}

export interface MuiFhirValueProps {
  typography?: TypographyProps | null | undefined;
  box?: BoxProps | null | undefined;
  relativeDateTitleFormatter?:
    | (valueFormatters.DatetimeFormatterOptions & CommonFormatterOptions)
    | null
    | undefined;
}

function hasRelativeOptions(
  value: FhirValueRendererProps<MuiFhirValueProps>["options"],
): value is { dateStyle: "relative" } {
  return !!value && "dateStyle" in value && value.dateStyle === "relative";
}

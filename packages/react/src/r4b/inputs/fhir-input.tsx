import { AnyResourceType } from "@bonfhir/core/r4b";
import { ReactElement } from "react";
import { useFhirUIContext } from "../context";
import {
  FhirInputAddress,
  FhirInputAddressProps,
  FhirInputBoolean,
  FhirInputBooleanProps,
  FhirInputCodeableReference,
  FhirInputCodeableReferenceProps,
  FhirInputContactPoint,
  FhirInputContactPointProps,
  FhirInputDate,
  FhirInputDateProps,
  FhirInputDateTime,
  FhirInputDateTimeProps,
  FhirInputDuration,
  FhirInputDurationProps,
  FhirInputHumanName,
  FhirInputHumanNameProps,
  FhirInputIdentifier,
  FhirInputIdentifierProps,
  FhirInputMarkdown,
  FhirInputMarkdownIupac,
  FhirInputMarkdownIupacProps,
  FhirInputMarkdownProps,
  FhirInputNumber,
  FhirInputNumberProps,
  FhirInputPeriod,
  FhirInputPeriodProps,
  FhirInputQuantity,
  FhirInputQuantityProps,
  FhirInputRange,
  FhirInputRangeProps,
  FhirInputRatio,
  FhirInputRatioProps,
  FhirInputResource,
  FhirInputResourceProps,
  FhirInputString,
  FhirInputStringProps,
  FhirInputTerminology,
  FhirInputTerminologyProps,
  FhirInputTime,
  FhirInputTimeProps,
} from "./input-types/index";

export function FhirInput<
  TRendererProps = any,
  TResourceType extends AnyResourceType = AnyResourceType,
>(props: FhirInputProps<TRendererProps, TResourceType>): ReactElement | null {
  const { applyDefaultProps } = useFhirUIContext();
  props = applyDefaultProps("FhirInput", props);

  switch (props.type) {
    case "Address": {
      return <FhirInputAddress<TRendererProps> {...props} />;
    }
    case "boolean": {
      return <FhirInputBoolean<TRendererProps> {...props} />;
    }
    case "CodeableReference": {
      return <FhirInputCodeableReference<TRendererProps> {...props} />;
    }
    case "ContactPoint": {
      return <FhirInputContactPoint<TRendererProps> {...props} />;
    }
    case "date": {
      return <FhirInputDate<TRendererProps> {...props} />;
    }
    case "dateTime":
    case "instant": {
      return <FhirInputDateTime<TRendererProps> {...props} />;
    }
    case "HumanName": {
      return <FhirInputHumanName<TRendererProps> {...props} />;
    }
    case "Duration": {
      return <FhirInputDuration<TRendererProps> {...props} />;
    }
    case "Identifier": {
      return <FhirInputIdentifier<TRendererProps> {...props} />;
    }
    case "markdown": {
      return <FhirInputMarkdown<TRendererProps> {...props} />;
    }
    case "markdownIupac": {
      return <FhirInputMarkdownIupac<TRendererProps> {...props} />;
    }
    case "decimal":
    case "integer":
    case "integer64":
    case "positiveInt":
    case "unsignedInt": {
      return <FhirInputNumber<TRendererProps> {...props} />;
    }
    case "Period": {
      return <FhirInputPeriod<TRendererProps> {...props} />;
    }
    case "Quantity": {
      return <FhirInputQuantity<TRendererProps> {...props} />;
    }
    case "Range": {
      return <FhirInputRange<TRendererProps> {...props} />;
    }
    case "Ratio": {
      return <FhirInputRatio<TRendererProps> {...props} />;
    }
    case "Resource":
    case "Reference": {
      return <FhirInputResource<TRendererProps, TResourceType> {...props} />;
    }
    case "string":
    case "canonical":
    case "id":
    case "oid":
    case "uri":
    case "url":
    case "uuid": {
      return <FhirInputString<TRendererProps> {...props} />;
    }
    case "code":
    case "Coding":
    case "CodeableConcept": {
      return <FhirInputTerminology<TRendererProps> {...props} />;
    }
    case "time": {
      return <FhirInputTime<TRendererProps> {...props} />;
    }
    default: {
      throw new Error(`Unknown FhirInput type: ${(props as any).type}`);
    }
  }
}

export type FhirInputProps<
  TRendererProps = any,
  TResourceType extends AnyResourceType = AnyResourceType,
> =
  | FhirInputAddressProps<TRendererProps>
  | FhirInputBooleanProps<TRendererProps>
  | FhirInputCodeableReferenceProps<TRendererProps>
  | FhirInputContactPointProps<TRendererProps>
  | FhirInputDateProps<TRendererProps>
  | FhirInputDateTimeProps<TRendererProps>
  | FhirInputDurationProps<TRendererProps>
  | FhirInputHumanNameProps<TRendererProps>
  | FhirInputIdentifierProps<TRendererProps>
  | FhirInputMarkdownProps<TRendererProps>
  | FhirInputMarkdownIupacProps<TRendererProps>
  | FhirInputNumberProps<TRendererProps>
  | FhirInputPeriodProps<TRendererProps>
  | FhirInputQuantityProps<TRendererProps>
  | FhirInputRangeProps<TRendererProps>
  | FhirInputRatioProps<TRendererProps>
  | FhirInputResourceProps<TRendererProps, TResourceType>
  | FhirInputStringProps<TRendererProps>
  | FhirInputTerminologyProps<TRendererProps>
  | FhirInputTimeProps<TRendererProps>;

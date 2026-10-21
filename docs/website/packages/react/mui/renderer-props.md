---
sidebar_position: 1
title: Renderer props
description: MUI rendererProps
---

Here is the [rendererProps type declaration](/packages/react/get-started#globally-apply-the-renderer-props-type)
that you can use in a project that uses the MUI renderer.

The `MuiFhir*Props` interfaces are exported by `@bonfhir/mui/r4b`, `@bonfhir/mui/r5` and
`@bonfhir/mui/r6` - use the entry point that matches the FHIR release of your application:

```tsx title="bonfhir.d.ts"
import {
  MuiFhirErrorProps,
  MuiFhirFormatterProps,
  MuiFhirInfiniteMarkerProps,
  MuiFhirInputAddressProps,
  MuiFhirInputArrayProps,
  MuiFhirInputBooleanProps,
  MuiFhirInputCodeableReferenceProps,
  MuiFhirInputContactPointProps,
  MuiFhirInputDateProps,
  MuiFhirInputDateTimeProps,
  MuiFhirInputDurationProps,
  MuiFhirInputHumanNameProps,
  MuiFhirInputIdentifierProps,
  MuiFhirInputMarkdownIupacProps,
  MuiFhirInputMarkdownProps,
  MuiFhirInputNumberProps,
  MuiFhirInputPeriodProps,
  MuiFhirInputQuantityProps,
  MuiFhirInputRangeProps,
  MuiFhirInputRatioProps,
  MuiFhirInputResourceProps,
  MuiFhirInputStringProps,
  MuiFhirInputTerminologyProps,
  MuiFhirInputTimeProps,
  MuiFhirPaginationProps,
  MuiFhirQueryLoaderProps,
  MuiFhirQuestionnaireProps,
  MuiFhirTableProps,
  MuiFhirValueProps,
} from "@bonfhir/mui/r5";
```

Then use it with the `FhirUIProvider`:

```tsx
import { MuiRenderer } from "@bonfhir/mui/r5";
import { FhirUIProvider } from "@bonfhir/react/r5";

return (
  <FhirUIProvider renderer={MuiRenderer}>
    <App />
  </FhirUIProvider>
);
```

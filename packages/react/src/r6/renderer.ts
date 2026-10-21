import type { FhirTableRenderer, FhirValueRenderer } from "./data-display";
import { FhirFormatterRenderer } from "./data-display";
import type { FhirErrorRenderer, FhirQueryLoaderRenderer } from "./feedback";
import type {
  FhirInputAddressRenderer,
  FhirInputArrayRenderer,
  FhirInputBooleanRenderer,
  FhirInputCodeableReferenceRenderer,
  FhirInputContactPointRenderer,
  FhirInputDateRenderer,
  FhirInputDateTimeRenderer,
  FhirInputDurationRenderer,
  FhirInputHumanNameRenderer,
  FhirInputIdentifierRenderer,
  FhirInputMarkdownIupacRenderer,
  FhirInputMarkdownRenderer,
  FhirInputNumberRenderer,
  FhirInputPeriodRenderer,
  FhirInputQuantityRenderer,
  FhirInputRangeRenderer,
  FhirInputRatioRenderer,
  FhirInputResourceRenderer,
  FhirInputStringRenderer,
  FhirInputTerminologyRenderer,
  FhirInputTimeRenderer,
  FhirQuestionnaireRenderer,
} from "./inputs";
import type {
  FhirInfiniteMarkerRenderer,
  FhirPaginationRenderer,
} from "./navigation";

export interface FhirUIRenderer {
  FhirError: FhirErrorRenderer;
  FhirFormatter: FhirFormatterRenderer;
  FhirInfiniteMarker: FhirInfiniteMarkerRenderer;
  FhirInputAddress: FhirInputAddressRenderer;
  FhirInputArray: FhirInputArrayRenderer;
  FhirInputBoolean: FhirInputBooleanRenderer;
  FhirInputCodeableReference: FhirInputCodeableReferenceRenderer;
  FhirInputContactPoint: FhirInputContactPointRenderer;
  FhirInputDate: FhirInputDateRenderer;
  FhirInputDateTime: FhirInputDateTimeRenderer;
  FhirInputDuration: FhirInputDurationRenderer;
  FhirInputIdentifier: FhirInputIdentifierRenderer;
  FhirInputHumanName: FhirInputHumanNameRenderer;
  FhirInputMarkdown: FhirInputMarkdownRenderer;
  FhirInputMarkdownIupac: FhirInputMarkdownIupacRenderer;
  FhirInputNumber: FhirInputNumberRenderer;
  FhirInputPeriod: FhirInputPeriodRenderer;
  FhirInputQuantity: FhirInputQuantityRenderer;
  FhirInputRange: FhirInputRangeRenderer;
  FhirInputRatio: FhirInputRatioRenderer;
  FhirInputResource: FhirInputResourceRenderer;
  FhirInputString: FhirInputStringRenderer;
  FhirInputTerminology: FhirInputTerminologyRenderer;
  FhirInputTime: FhirInputTimeRenderer;
  FhirPagination: FhirPaginationRenderer;
  FhirQueryLoader: FhirQueryLoaderRenderer;
  FhirQuestionnaire: FhirQuestionnaireRenderer;
  FhirTable: FhirTableRenderer;
  FhirValue: FhirValueRenderer;
}

/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  QuestionnaireItem,
  QuestionnaireItemAnswerOption,
  ValueSetExpansionContains,
  WithRequired,
  build,
  canonical,
} from "@bonfhir/core/r4b";
import {
  FhirInput,
  FhirInputProps,
  FhirQuestionnaireRendererProps,
  FhirValue,
  FhirValueProps,
} from "@bonfhir/react/r4b";
import {
  Alert,
  AlertProps,
  Button,
  ButtonProps,
  CircularProgress,
  Stack,
  StackProps,
  Typography,
  TypographyProps,
} from "@mui/material";
import {
  ReactElement,
  ReactNode,
  useCallback,
  useEffect,
  useState,
} from "react";

export function MuiFhirQuestionnaire(
  props: FhirQuestionnaireRendererProps<MuiFhirQuestionnaireProps>,
): ReactElement | null {
  if (props.isLoading || !props.questionnaire) {
    return (
      <Stack
        className={props.className}
        style={props.style}
        alignItems="center"
        {...props.rendererProps?.mainStack}
      >
        <CircularProgress size={props.rendererProps?.loaderSize ?? 24} />
      </Stack>
    );
  }

  if (props.errors.length > 0) {
    return (
      <Stack
        className={props.className}
        style={props.style}
        spacing={1}
        {...props.rendererProps?.mainStack}
      >
        {props.errors.map((error, index) => (
          <Alert key={index} severity="error" {...props.rendererProps?.alert}>
            {error.message}
          </Alert>
        ))}
      </Stack>
    );
  }

  return (
    <MuiQuestionnaireRenderer {...props} questionnaire={props.questionnaire} />
  );
}

function MuiQuestionnaireRenderer(
  props: WithRequired<
    FhirQuestionnaireRendererProps<MuiFhirQuestionnaireProps>,
    "questionnaire"
  >,
): ReactElement | null {
  const [values, setValues] = useState<object>({});

  useEffect(() => {
    setValues(
      buildValues(
        props.questionnaire.item || [],
        "",
        props.questionnaireResponse?.item || [],
      ),
    );
  }, [props.questionnaire?.id, props.questionnaireResponse?.id]);

  const setValue = useCallback((path: string, value: unknown) => {
    setValues((current) => setPathValue(current, path, value));
  }, []);

  return (
    <form
      onSubmit={(evt) => {
        evt.preventDefault();
        props.onSubmit?.(
          build("QuestionnaireResponse", {
            questionnaire: canonical(props.questionnaire)!,
            status: "completed",
            authored: new Date().toISOString(),
            item: buildQuestionnaireResponseItems(
              props.questionnaire.item || [],
              values,
            ),
          }),
        );
      }}
    >
      <Stack
        className={props.className}
        style={props.style}
        spacing={2}
        {...props.rendererProps?.mainStack}
      >
        {props.questionnaire.title && (
          <Typography variant="h5" {...props.rendererProps?.title}>
            {props.questionnaire.title}
          </Typography>
        )}
        {(props.questionnaire.item || []).map((item, index) => (
          <MuiQuestionnaireItemRenderer
            key={index}
            props={props}
            item={item}
            parentPath=""
            values={values}
            setValue={setValue}
          />
        ))}
        <Stack direction="row" spacing={1}>
          <Button
            type="submit"
            variant="contained"
            {...props.rendererProps?.submit}
          >
            {props.rendererProps?.submitText || "Submit"}
          </Button>
          {props.onCancel && (
            <Button
              variant="outlined"
              onClick={props.onCancel}
              {...props.rendererProps?.cancel}
            >
              {props.rendererProps?.cancelText || "Cancel"}
            </Button>
          )}
        </Stack>
      </Stack>
    </form>
  );
}

function MuiQuestionnaireItemRenderer({
  props,
  item,
  parentPath,
  values,
  setValue,
}: {
  props: FhirQuestionnaireRendererProps<MuiFhirQuestionnaireProps>;
  item: QuestionnaireItem;
  parentPath: string;
  values: any;
  setValue: (path: string, value: unknown) => void;
}): ReactElement | null {
  const level = parentPath.split(".").filter(Boolean).length;
  const path = concatPath(parentPath, item.linkId);
  const value = getPathValue(values, path);

  switch (item.type as string) {
    case "display": {
      return (
        <FhirValue
          type="string"
          value={item.text}
          {...props.rendererProps?.itemDisplay}
        />
      );
    }
    case "group": {
      return (
        <Stack spacing={1} {...props.rendererProps?.itemGroupStack}>
          {item.text && (
            <Typography
              variant={headingVariant(level + 3)}
              {...props.rendererProps?.itemGroupTitle}
            >
              {item.text}
            </Typography>
          )}
          {(item.item || []).map(
            (childItem: QuestionnaireItem, index: number) => (
              <MuiQuestionnaireItemRenderer
                key={index}
                props={props}
                item={childItem}
                parentPath={path}
                values={values}
                setValue={setValue}
              />
            ),
          )}
        </Stack>
      );
    }
    case "boolean":
    case "decimal":
    case "integer":
    case "date":
    case "dateTime":
    case "time":
    case "string":
    case "url":
    case "text": {
      const inputProps = props.rendererProps?.itemInput as FhirInputProps;
      if (item.type === "text") {
        return (
          <FhirInput
            {...inputProps}
            type="string"
            mode="multiline"
            label={item.text}
            required={item.required}
            disabled={item.readOnly}
            value={value as never}
            onChange={(newValue) => setValue(path, newValue)}
          />
        );
      }

      return (
        <FhirInput
          {...inputProps}
          type={item.type as never}
          label={item.text}
          required={item.required}
          disabled={item.readOnly}
          value={value as never}
          onChange={(newValue: unknown) => setValue(path, newValue)}
        />
      );
    }
    case "choice":
    case "coding": {
      return (
        <FhirInput
          type="Coding"
          source={
            item.answerOption?.length
              ? convertAnswerOptions(item.answerOption)
              : item.answerValueSet || []
          }
          label={item.text}
          required={item.required}
          disabled={item.readOnly}
          value={value as never}
          onChange={(newValue: unknown) => setValue(path, newValue)}
        />
      );
    }
    default: {
      return null;
    }
  }
}

function headingVariant(level: number): "h6" | "subtitle1" | "subtitle2" {
  if (level <= 4) {
    return "h6";
  }
  return level === 5 ? "subtitle1" : "subtitle2";
}

function concatPath(...paths: string[]): string {
  return paths.filter(Boolean).join(".");
}

function getPathValue(values: any, path: string): unknown {
  return path
    .split(".")
    .filter(Boolean)
    .reduce((current, key) => current?.[key], values);
}

function setPathValue(values: any, path: string, value: unknown): any {
  const keys = path.split(".").filter(Boolean);
  const [head, ...rest] = keys;
  if (!head) {
    return values;
  }

  if (rest.length === 0) {
    return { ...values, [head]: value };
  }

  return {
    ...values,
    [head]: setPathValue(values?.[head] ?? {}, rest.join("."), value),
  };
}

function buildQuestionnaireResponseItems(
  item: QuestionnaireItem[],
  values: any,
): any[] | undefined {
  const result: any[] = [];

  for (const i of item) {
    switch (i.type as string) {
      case "group": {
        const groupValues = values?.[i.linkId];
        if (groupValues) {
          const groupItems = buildQuestionnaireResponseItems(
            i.item || [],
            groupValues,
          );
          if (groupItems?.length) {
            result.push({
              linkId: i.linkId,
              text: i.text,
              item: groupItems,
            });
          }
        }
        break;
      }
      case "display": {
        result.push({ linkId: i.linkId, text: i.text });
        break;
      }
      case "choice": {
        if (values?.[i.linkId]) {
          result.push({
            linkId: i.linkId,
            text: i.text,
            answer: [{ valueCoding: values[i.linkId] }],
          });
        }
        break;
      }
      default: {
        if (values?.[i.linkId]) {
          result.push({
            linkId: i.linkId,
            text: i.text,
            answer: [
              {
                [`value${i.type[0]?.toUpperCase()}${i.type.slice(1)}`]:
                  values[i.linkId],
              },
            ],
          });
        }
        break;
      }
    }
  }

  return result.length === 0 ? undefined : result;
}

function buildValues(
  item: QuestionnaireItem[],
  parentPath: string,
  responseItem: any[],
): object {
  const result = {} as any;
  for (const i of item) {
    const responseI = responseItem.find((x) => x.linkId === i.linkId);
    if (i.type === "group") {
      result[i.linkId] = buildValues(
        i.item || [],
        concatPath(parentPath, i.linkId),
        responseI?.item || [],
      );
      continue;
    }

    const initialValue = responseI?.answer ||
      i.initial || [i.answerOption?.find((ao) => ao.initialSelected)];
    result[i.linkId] = Object.entries(initialValue?.[0] || {}).find(
      ([key, v]) => key.startsWith("value") && v,
    )?.[1];
  }
  return result;
}

function convertAnswerOptions(
  answerOption: QuestionnaireItemAnswerOption[],
): ValueSetExpansionContains[] {
  return answerOption
    .map((option) =>
      option.valueCoding
        ? {
            code: option.valueCoding.code,
            display: option.valueCoding.display,
          }
        : undefined,
    )
    .filter(Boolean) as ValueSetExpansionContains[];
}

export interface MuiFhirQuestionnaireProps {
  mainStack?: StackProps | null | undefined;
  loaderSize?: number | null | undefined;
  title?: TypographyProps | null | undefined;
  alert?: AlertProps | null | undefined;
  itemDisplay?: FhirValueProps | null | undefined;
  itemGroupStack?: StackProps | null | undefined;
  itemGroupTitle?: TypographyProps | null | undefined;
  itemInput?: FhirInputProps | null | undefined;
  submit?: ButtonProps | null | undefined;
  submitText?: ReactNode | null | undefined;
  cancel?: ButtonProps | null | undefined;
  cancelText?: ReactNode | null | undefined;
}

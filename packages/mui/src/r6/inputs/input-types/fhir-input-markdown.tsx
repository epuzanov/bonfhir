import { Formatter, valueFormatters } from "@bonfhir/core/r6";
import { FhirInputMarkdownRendererProps } from "@bonfhir/react/r6";
import { Box, TextField, TextFieldProps } from "@mui/material";
import { ReactElement, useRef, useState } from "react";
import { MuiInputWrapper } from "./common";
import {
  DEFAULT_MARKDOWN_TOOLBAR_ACTIONS,
  MarkdownToolbarAction,
  MarkdownToolbarControls,
  applyMarkdownToolbarAction,
} from "./markdown-toolbar";

export function MuiFhirInputMarkdown(
  props: FhirInputMarkdownRendererProps<MuiFhirInputMarkdownProps>,
): ReactElement | null {
  const [mode, setMode] = useState<"edit" | "preview">(
    props.rendererProps?.defaultMode ?? "edit",
  );
  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  const actions =
    props.rendererProps?.actions ?? DEFAULT_MARKDOWN_TOOLBAR_ACTIONS;

  const preview =
    props.rendererProps?.preview ??
    ((value: string | null | undefined) =>
      new Formatter()
        .register(valueFormatters.markdownFormatter)
        .format("markdown", value, { style: "html" }));

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
        <MarkdownToolbarControls
          mode={mode}
          onModeChange={setMode}
          actions={actions}
          onAction={(action) => {
            const textarea = inputRef.current;
            const result = applyMarkdownToolbarAction(
              action,
              props.value || "",
              textarea?.selectionStart,
              textarea?.selectionEnd,
            );
            props.onChange?.(result.value || undefined);
            // Restore the selection, once React has rendered the new value.
            setTimeout(() => {
              if (!textarea) {
                return;
              }
              textarea.focus();
              textarea.setSelectionRange(
                result.selectionStart,
                result.selectionEnd,
              );
            });
          }}
        />
        {mode === "edit" ? (
          <TextField
            inputRef={inputRef}
            size="small"
            fullWidth
            multiline
            minRows={props.rendererProps?.minRows ?? 4}
            placeholder={props.placeholder ?? undefined}
            error={Boolean(props.error)}
            required={Boolean(props.required)}
            disabled={Boolean(props.disabled)}
            value={props.value || ""}
            onChange={(evt) => props.onChange?.(evt.target.value || undefined)}
            {...props.rendererProps?.textField}
          />
        ) : (
          <Box
            sx={{
              border: 1,
              borderColor: "divider",
              borderRadius: 1,
              p: 1,
              minHeight: 96,
            }}
            dangerouslySetInnerHTML={{ __html: preview(props.value) }}
          />
        )}
      </Box>
    </MuiInputWrapper>
  );
}

export interface MuiFhirInputMarkdownProps {
  textField?: TextFieldProps | null | undefined;
  defaultMode?: "edit" | "preview" | null | undefined;
  minRows?: number | null | undefined;
  actions?: MarkdownToolbarAction[] | null | undefined;
  preview?:
    | ((markdown: string | null | undefined) => string)
    | null
    | undefined;
}

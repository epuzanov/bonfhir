import {
  Box,
  Divider,
  IconButton,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
} from "@mui/material";
import { ReactElement } from "react";

export interface MarkdownToolbarAction {
  key: string;
  label: string;
  title: string;
  /** The string inserted before the selection. */
  before?: string;
  /** The string inserted after the selection. */
  after?: string;
  /** The string inserted at the cursor when there is no selection. */
  placeholder?: string;
}

/**
 * Actions available in the markdown input toolbar.
 *
 * Subscript (`~x~`) and superscript (`^x^`) are supported by the FHIR markdown renderer
 * (see the `markdown` value formatter), and are commonly needed in healthcare content.
 */
export const DEFAULT_MARKDOWN_TOOLBAR_ACTIONS: MarkdownToolbarAction[] = [
  {
    key: "bold",
    label: "B",
    title: "Bold",
    before: "**",
    after: "**",
    placeholder: "bold",
  },
  {
    key: "italic",
    label: "I",
    title: "Italic",
    before: "_",
    after: "_",
    placeholder: "italic",
  },
  {
    key: "strikethrough",
    label: "S",
    title: "Strikethrough",
    before: "~~",
    after: "~~",
    placeholder: "strikethrough",
  },
  {
    key: "subscript",
    label: "A₂",
    title: "Subscript",
    before: "~",
    after: "~",
    placeholder: "2",
  },
  {
    key: "superscript",
    label: "A²",
    title: "Superscript",
    before: "^",
    after: "^",
    placeholder: "2",
  },
  {
    key: "link",
    label: "🔗",
    title: "Link",
    before: "[",
    after: "](https://)",
    placeholder: "text",
  },
  { key: "list", label: "•", title: "List", before: "\n- ", after: "" },
];

export interface ApplyMarkdownToolbarActionResult {
  value: string;
  selectionStart: number;
  selectionEnd: number;
}

/**
 * Apply a toolbar action to a markdown string, and return the new value plus the
 * selection to restore.
 */
export function applyMarkdownToolbarAction(
  action: MarkdownToolbarAction,
  value: string,
  selectionStart?: number | null | undefined,
  selectionEnd?: number | null | undefined,
): ApplyMarkdownToolbarActionResult {
  const start = selectionStart ?? value.length;
  const end = selectionEnd ?? start;
  const selected = value.slice(start, end) || action.placeholder || "";

  const before = action.before ?? "";
  const after = action.after ?? "";
  const inserted = `${before}${selected}${after}`;

  const newValue = `${value.slice(0, start)}${inserted}${value.slice(end)}`;

  return {
    value: newValue,
    selectionStart: start + before.length,
    selectionEnd: start + before.length + selected.length,
  };
}

export interface MarkdownToolbarControlsProps {
  mode: "edit" | "preview";
  onModeChange: (mode: "edit" | "preview") => void;
  actions: MarkdownToolbarAction[];
  onAction: (action: MarkdownToolbarAction) => void;
}

export function MarkdownToolbarControls(
  props: MarkdownToolbarControlsProps,
): ReactElement {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1,
        flexWrap: "wrap",
      }}
    >
      <ToggleButtonGroup
        size="small"
        exclusive
        value={props.mode}
        onChange={(_, value) => {
          if (value) {
            props.onModeChange(value);
          }
        }}
      >
        <ToggleButton value="edit">Edit</ToggleButton>
        <ToggleButton value="preview">Preview</ToggleButton>
      </ToggleButtonGroup>
      {props.mode === "edit" ? (
        <>
          <Divider orientation="vertical" flexItem />
          {props.actions.map((action) => (
            <Tooltip key={action.key} title={action.title}>
              <IconButton
                size="small"
                aria-label={action.title}
                onClick={() => props.onAction(action)}
              >
                {action.label}
              </IconButton>
            </Tooltip>
          ))}
        </>
      ) : null}
    </Box>
  );
}

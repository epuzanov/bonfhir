import { FhirInputMarkdownIupacRendererProps } from "@bonfhir/react/r4b";
import { Box, Chip, Stack } from "@mui/material";
import { ReactElement, useState } from "react";
import { MuiFhirInputMarkdown } from "./fhir-input-markdown";
import {
  IUPAC_CHARACTER_GROUPS,
  IUPAC_GROUP_LABELS,
  IupacCharacterGroup,
} from "./iupac-characters";
import type { MarkdownToolbarAction } from "./markdown-toolbar";

/**
 * IUPAC markdown input for MUI.
 *
 * It reuses the markdown input, so that subscript / superscript and the edit / preview
 * modes are available, and adds a palette of IUPAC specific characters on top of it.
 */
export function MuiFhirInputMarkdownIupac(
  props: FhirInputMarkdownIupacRendererProps<MuiFhirInputMarkdownIupacProps>,
): ReactElement | null {
  const [group, setGroup] = useState<IupacCharacterGroup>(
    props.rendererProps?.defaultGroup ?? "default",
  );

  const characterActions: MarkdownToolbarAction[] = (
    IUPAC_CHARACTER_GROUPS[group] ?? []
  ).map((character) => ({
    key: `iupac-${character}`,
    label: character,
    title: `Insert ${character}`,
    before: character,
  }));

  return (
    <Stack spacing={1}>
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
        {(Object.keys(IUPAC_CHARACTER_GROUPS) as IupacCharacterGroup[]).map(
          (key) => (
            <Chip
              key={key}
              size="small"
              label={IUPAC_GROUP_LABELS[key]}
              color={group === key ? "primary" : "default"}
              variant={group === key ? "filled" : "outlined"}
              onClick={() => setGroup(key)}
            />
          ),
        )}
      </Box>
      <MuiFhirInputMarkdown
        type="markdown"
        label={props.label}
        description={props.description}
        error={props.error}
        required={props.required}
        disabled={props.disabled}
        className={props.className}
        style={props.style}
        value={props.value}
        onChange={props.onChange}
        rendererProps={{
          textField: props.rendererProps?.textField,
          defaultMode: props.rendererProps?.defaultMode,
          minRows: props.rendererProps?.minRows,
          preview: props.rendererProps?.preview,
          actions: [
            ...(props.rendererProps?.actions ?? []),
            ...characterActions,
          ],
        }}
      />
    </Stack>
  );
}

export interface MuiFhirInputMarkdownIupacProps {
  defaultGroup?: IupacCharacterGroup | null | undefined;
  actions?: MarkdownToolbarAction[] | null | undefined;
  textField?: FhirInputMarkdownIupacTextFieldProps | null | undefined;
  defaultMode?: "edit" | "preview" | null | undefined;
  minRows?: number | null | undefined;
  preview?:
    | ((markdown: string | null | undefined) => string)
    | null
    | undefined;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type FhirInputMarkdownIupacTextFieldProps = any;

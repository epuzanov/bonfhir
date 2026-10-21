import { FhirInputMarkdownIupacRendererProps } from "@bonfhir/react/r4b";
import { Input, InputWrapperProps } from "@mantine/core";
import {
  RichTextEditor,
  RichTextEditorProps,
  RichTextEditorToolbarProps,
} from "@mantine/tiptap";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
  ReactElement,
  ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { Markdown } from "tiptap-markdown";
import { Subscript, Superscript } from "./tiptap-sub-sup";

/**
 * IUPAC characters that are commonly needed when typing chemical formulas and reactions.
 * Grouped by domain, so that the toolbar can page between them.
 */
const IUPAC_CHARACTERS: Record<string, string[]> = {
  default: [
    // Isotope / stereochemistry prefixes
    "\u1D05", // ᴅ
    "\u029F", // ʟ
    "\u0274", // ɴ
  ],
  operators: [
    "\u00B1",
    "\u2264",
    "\u2265",
    "\u2190",
    "\u2192",
    "\u2194",
    "\u21CC",
  ],
  greek: Array.from({ length: 25 }, (_, i) =>
    String.fromCodePoint(945 + i),
  ).filter(
    (_, i) => i !== 17, // final sigma
  ),
  greekCapital: Array.from({ length: 25 }, (_, i) =>
    String.fromCodePoint(913 + i),
  ).filter(
    (_, i) => i !== 17, // final sigma
  ),
  romanNumerals: Array.from({ length: 12 }, (_, i) =>
    String.fromCodePoint(8544 + i),
  ),
};

type IupacCharacterGroup = keyof typeof IUPAC_CHARACTERS;

/** Convert `<sub>` / `<sup>` HTML tags to the markdown `~...~` / `^...^` syntax. */
function htmlToMarkdown(value: string): string {
  return value
    .replaceAll(/<sub>(.+?)<\/sub>/g, "~$1~")
    .replaceAll(/<sup>(.+?)<\/sup>/g, "^$1^");
}

/** Convert the markdown `~...~` / `^...^` syntax to `<sub>` / `<sup>` HTML tags. */
function markdownToHtml(value: string): string {
  return value
    .replaceAll(/~(.+?)~/g, "<sub>$1</sub>")
    .replaceAll(/\^(.+?)\^/g, "<sup>$1</sup>");
}

export function MantineFhirInputMarkdownIupac(
  props: FhirInputMarkdownIupacRendererProps<MantineFhirInputMarkdownIupacProps>,
): ReactElement | null {
  const [toolbar, setToolbar] = useState<IupacCharacterGroup>("default");
  // The last value emitted by the editor, to avoid resetting the content (and the cursor)
  // when the parent re-renders with the value that we just emitted.
  const lastEmittedValue = useRef<string | null | undefined>(props.value);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Superscript,
      Subscript,
      Markdown.configure({
        html: true,
      }),
    ],
    content: props.value ? markdownToHtml(props.value) : "",
    onUpdate: ({ editor }) => {
      const markdown = htmlToMarkdown(
        editor.storage.markdown.getMarkdown() || "",
      );
      const value = markdown.trim().length > 0 ? markdown : undefined;
      lastEmittedValue.current = value;
      props.onChange?.(value);
    },
  });

  useEffect(() => {
    if (!editor) {
      return;
    }

    if (props.value === lastEmittedValue.current) {
      return;
    }

    lastEmittedValue.current = props.value;
    const content = props.value ? markdownToHtml(props.value) : "";
    editor.commands.setContent(content);
  }, [editor, props.value]);

  const insertCharacter = useCallback(
    (character: string) => {
      if (!editor) {
        return;
      }
      editor.commands.insertContent(character);
      // Keep the caret where the user was typing, so that several characters can be
      // inserted in a row.
      editor.commands.focus();
    },
    [editor],
  );

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
      <RichTextEditor editor={editor} {...props.rendererProps?.richTextEditor}>
        <RichTextEditor.Toolbar
          sticky
          stickyOffset={0}
          {...props.rendererProps?.richTextEditorToolbar}
        >
          {props.rendererProps?.toolbarChildren ?? (
            <>
              <RichTextEditor.ControlsGroup>
                <RichTextEditor.Bold />
                <RichTextEditor.Italic />
                <RichTextEditor.ClearFormatting />
                <RichTextEditor.Subscript />
                <RichTextEditor.Superscript />
              </RichTextEditor.ControlsGroup>
              <RichTextEditor.ControlsGroup>
                {IUPAC_CHARACTERS[toolbar]?.map((character) => (
                  <RichTextEditor.Control
                    key={character}
                    onClick={() => insertCharacter(character)}
                    aria-label={`Insert ${character}`}
                    title={`Insert ${character}`}
                  >
                    {character}
                  </RichTextEditor.Control>
                ))}
              </RichTextEditor.ControlsGroup>
              <RichTextEditor.ControlsGroup>
                {(Object.keys(IUPAC_CHARACTERS) as IupacCharacterGroup[]).map(
                  (group) => (
                    <RichTextEditor.Control
                      key={group}
                      onClick={() => setToolbar(group)}
                      active={toolbar === group}
                      aria-label={`Switch to the ${group} toolbar`}
                      title={`Switch to the ${group} toolbar`}
                    >
                      {groupLabel(group)}
                    </RichTextEditor.Control>
                  ),
                )}
              </RichTextEditor.ControlsGroup>
            </>
          )}
        </RichTextEditor.Toolbar>

        <RichTextEditor.Content />
      </RichTextEditor>
    </Input.Wrapper>
  );
}

function groupLabel(group: IupacCharacterGroup): string {
  switch (group) {
    case "greek": {
      return "\u03B1";
    }
    case "greekCapital": {
      return "\u0391";
    }
    case "romanNumerals": {
      return "\u216B";
    }
    case "operators": {
      return "\u00B1";
    }
    default: {
      return "\u1D05";
    }
  }
}

export interface MantineFhirInputMarkdownIupacProps {
  wrapper?: Omit<InputWrapperProps, "children"> | null | undefined;
  richTextEditor?: RichTextEditorProps | null | undefined;
  richTextEditorToolbar?: RichTextEditorToolbarProps | null | undefined;
  toolbarChildren?: ReactNode | null | undefined;
}

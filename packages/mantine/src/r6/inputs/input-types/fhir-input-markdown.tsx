import { FhirInputMarkdownRendererProps } from "@bonfhir/react/r6";
import { Input, InputWrapperProps } from "@mantine/core";
import {
  Link,
  RichTextEditor,
  RichTextEditorProps,
  RichTextEditorToolbarProps,
} from "@mantine/tiptap";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { ReactElement, ReactNode, useEffect, useRef } from "react";
import { Markdown } from "tiptap-markdown";
import { Subscript, Superscript } from "./tiptap-sub-sup";

/** Convert the markdown `~...~` / `^...^` syntax to `<sub>` / `<sup>` HTML tags. */
function markdownToHtml(value: string): string {
  return value
    .replaceAll(/~(.+?)~/g, "<sub>$1</sub>")
    .replaceAll(/\^(.+?)\^/g, "<sup>$1</sup>");
}

/** Convert `<sub>` / `<sup>` HTML tags back to the markdown `~...~` / `^...^` syntax. */
function htmlToMarkdown(value: string): string {
  return value
    .replaceAll(/<sub>(.+?)<\/sub>/g, "~$1~")
    .replaceAll(/<sup>(.+?)<\/sup>/g, "^$1^");
}

export function MantineFhirInputMarkdown(
  props: FhirInputMarkdownRendererProps<MantineFhirInputMarkdownProps>,
): ReactElement | null {
  // The last value emitted by the editor, used to avoid resetting the content (and the
  // cursor position) when the parent re-renders with the value that we just emitted.
  const lastEmittedValue = useRef<string | null | undefined>(props.value);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Link,
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
    editor.commands.setContent(props.value ? markdownToHtml(props.value) : "");
  }, [editor, props.value]);

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
          stickyOffset={60}
          {...props.rendererProps?.richTextEditorToolbar}
        >
          {props.rendererProps?.toolbarChildren ?? (
            <>
              <RichTextEditor.ControlsGroup>
                <RichTextEditor.Bold />
                <RichTextEditor.Italic />
                <RichTextEditor.Strikethrough />
                <RichTextEditor.ClearFormatting />
                <RichTextEditor.Subscript />
                <RichTextEditor.Superscript />
              </RichTextEditor.ControlsGroup>

              <RichTextEditor.ControlsGroup>
                <RichTextEditor.H1 />
                <RichTextEditor.H2 />
                <RichTextEditor.H3 />
                <RichTextEditor.H4 />
              </RichTextEditor.ControlsGroup>

              <RichTextEditor.ControlsGroup>
                <RichTextEditor.Blockquote />
                <RichTextEditor.Hr />
                <RichTextEditor.BulletList />
                <RichTextEditor.OrderedList />
              </RichTextEditor.ControlsGroup>

              <RichTextEditor.ControlsGroup>
                <RichTextEditor.Link />
                <RichTextEditor.Unlink />
              </RichTextEditor.ControlsGroup>
            </>
          )}
        </RichTextEditor.Toolbar>

        <RichTextEditor.Content />
      </RichTextEditor>
    </Input.Wrapper>
  );
}

export interface MantineFhirInputMarkdownProps {
  wrapper?: Omit<InputWrapperProps, "children"> | null | undefined;
  richTextEditor?: RichTextEditorProps | null | undefined;
  richTextEditorToolbar?: RichTextEditorToolbarProps | null | undefined;
  toolbarChildren?: ReactNode | null | undefined;
}

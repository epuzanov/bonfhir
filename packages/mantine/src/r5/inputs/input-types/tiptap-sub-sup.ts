import { Mark, mergeAttributes } from "@tiptap/react";

/**
 * Subscript and superscript marks.
 *
 * They are defined here rather than using `@tiptap/extension-subscript` /
 * `@tiptap/extension-superscript`, to avoid adding new dependencies: `@tiptap/core`
 * (re-exported by `@tiptap/react`) is enough.
 *
 * The commands (`toggleSubscript` / `toggleSuperscript`) and mark names match the ones
 * expected by the Mantine `RichTextEditor.Subscript` and `RichTextEditor.Superscript`
 * controls, so those controls work out of the box.
 */
function toggleMarkCommand(name: string) {
  return function toggleMark(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    { commands }: any,
  ) {
    return commands.toggleMark(name);
  };
}

function unsetMarkCommand(name: string) {
  return function unsetMark(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    { commands }: any,
  ) {
    return commands.unsetMark(name);
  };
}

export const Subscript = Mark.create({
  name: "subscript",

  parseHTML() {
    return [{ tag: "sub" }];
  },

  renderHTML({ HTMLAttributes }) {
    return ["sub", mergeAttributes(HTMLAttributes), 0];
  },

  addCommands() {
    return {
      toggleSubscript: toggleMarkCommand("subscript"),
      unsetSubscript: unsetMarkCommand("subscript"),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any;
  },

  addStorage() {
    return {
      markdown: {
        serialize: { open: "~", close: "~", expelEnclosingWhitespace: true },
      },
    };
  },
});

export const Superscript = Mark.create({
  name: "superscript",

  parseHTML() {
    return [{ tag: "sup" }];
  },

  renderHTML({ HTMLAttributes }) {
    return ["sup", mergeAttributes(HTMLAttributes), 0];
  },

  addCommands() {
    return {
      toggleSuperscript: toggleMarkCommand("superscript"),
      unsetSuperscript: unsetMarkCommand("superscript"),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any;
  },

  addStorage() {
    return {
      markdown: {
        serialize: { open: "^", close: "^", expelEnclosingWhitespace: true },
      },
    };
  },
});

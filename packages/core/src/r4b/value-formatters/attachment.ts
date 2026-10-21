import { ValueFormatter } from "../formatters";

/**
 * For referring to data content defined in other formats.
 *
 * @see https://hl7.org/fhir/datatypes.html#Attachment
 */
export interface AttachmentFormatterOptions {
  /**
   * - title: the title if present, otherwise the URL and then the filename (default)
   * - url: the URL of the content
   * - contentType: the content type
   */
  style?: "title" | "url" | "contentType" | null | undefined;

  /** When true, include the content type next to the title. Defaults to false. */
  includeContentType?: boolean | null | undefined;

  /** Defaults to " (". */
  contentTypePrefix?: string | null | undefined;

  /** Defaults to ")". */
  contentTypeSuffix?: string | null | undefined;
}

export interface FormattableAttachment {
  contentType?: string | null | undefined;
  data?: string | null | undefined;
  size?: number | null | undefined;
  title?: string | null | undefined;
  url?: string | null | undefined;
}

export const attachmentFormatter: ValueFormatter<
  "Attachment",
  FormattableAttachment | null | undefined,
  AttachmentFormatterOptions | null | undefined
> = {
  type: "Attachment",
  format: (value, options) => {
    if (!value) {
      return "";
    }

    const contentType = value.contentType?.trim();

    if (options?.style === "contentType") {
      return contentType || "";
    }

    if (options?.style === "url") {
      return value.url?.trim() || "";
    }

    const title =
      value.title?.trim() ||
      value.url?.trim() ||
      value.contentType?.trim() ||
      "";

    if (!title) {
      return "";
    }

    return options?.includeContentType && contentType && title !== contentType
      ? `${title}${options.contentTypePrefix ?? " ("}${contentType}${
          options.contentTypeSuffix ?? ")"
        }`
      : title;
  },
};

import { ValueFormatter } from "../formatters";

/**
 * Virtual Service Contact Details.
 *
 * @see https://hl7.org/fhir/datatypes.html#VirtualServiceDetail
 */
export interface VirtualServiceDetailFormatterOptions {
  /** Defaults to true. */
  includeAddress?: boolean | null | undefined;

  /** Defaults to ", ". */
  separator?: string | null | undefined;
}

export interface FormattableVirtualServiceDetail {
  addressUrl?: string | null | undefined;
  additionalInfo?: string[] | null | undefined;
  channelType?:
    | { code?: string | null | undefined; text?: string | null | undefined }
    | null
    | undefined;
  maxParticipants?: number | null | undefined;
  sessionKey?: string | null | undefined;
}

export const virtualServiceDetailFormatter: ValueFormatter<
  "VirtualServiceDetail",
  FormattableVirtualServiceDetail | null | undefined,
  VirtualServiceDetailFormatterOptions | null | undefined
> = {
  type: "VirtualServiceDetail",
  format: (value, options) => {
    if (!value) {
      return "";
    }

    const parts: string[] = [];

    if (options?.includeAddress !== false && value.addressUrl?.trim()) {
      parts.push(value.addressUrl.trim());
    }

    const channelType =
      value.channelType?.text?.trim() || value.channelType?.code?.trim();
    if (channelType) {
      parts.push(channelType);
    }

    for (const info of value.additionalInfo || []) {
      if (info?.trim()) {
        parts.push(info.trim());
      }
    }

    return parts.join(options?.separator ?? ", ");
  },
};

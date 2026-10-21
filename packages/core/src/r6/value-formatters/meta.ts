import { ValueFormatter } from "../formatters";

/**
 * The metadata about a resource. This is content in the resource that is maintained by the
 * infrastructure. Changes to the content might not always be associated with version changes
 * to the resource.
 *
 * @see https://hl7.org/fhir/resource-definitions.html#Meta
 */
export interface MetaFormatterOptions {
  /**
   * - version: the version id (default)
   * - lastUpdated: the last updated date time
   * - profile: the profile(s) of the resource
   */
  style?: "version" | "lastUpdated" | "profile" | null | undefined;

  /** Defaults to ", ". */
  separator?: string | null | undefined;
}

export interface FormattableMeta {
  lastUpdated?: string | null | undefined;
  profile?: string[] | null | undefined;
  versionId?: string | null | undefined;
}

export const metaFormatter: ValueFormatter<
  "Meta",
  FormattableMeta | null | undefined,
  MetaFormatterOptions | null | undefined
> = {
  type: "Meta",
  format: (value, options) => {
    if (!value) {
      return "";
    }

    switch (options?.style) {
      case "lastUpdated": {
        return value.lastUpdated?.trim() || "";
      }
      case "profile": {
        return (value.profile || [])
          .filter(Boolean)
          .join(options.separator ?? ", ");
      }
      default: {
        return value.versionId?.trim() || "";
      }
    }
  },
};

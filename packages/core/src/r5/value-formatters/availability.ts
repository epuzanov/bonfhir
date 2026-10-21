import { ValueFormatter } from "../formatters";

/**
 * Availability of a product or service.
 *
 * @see https://hl7.org/fhir/datatypes.html#Availability
 */
export interface AvailabilityFormatterOptions {
  /**
   * - availableTime: the availability time only (default)
   * - notAvailableTime: the not available time only
   * - full: both the available and not available times
   */
  style?: "availableTime" | "notAvailableTime" | "full" | null | undefined;

  /** Defaults to ", ". */
  separator?: string | null | undefined;

  /** Defaults to "not available: ". */
  notAvailablePrefix?: string | null | undefined;
}

export interface FormattableAvailability {
  availableTime?:
    | Array<{
        allDay?: boolean | null | undefined;
        availableEndTime?: string | null | undefined;
        availableStartTime?: string | null | undefined;
        daysOfWeek?: string[] | null | undefined;
      }>
    | null
    | undefined;
  notAvailableTime?:
    | Array<{
        description?: string | null | undefined;
        during?:
          | {
              end?: string | null | undefined;
              start?: string | null | undefined;
            }
          | null
          | undefined;
      }>
    | null
    | undefined;
}

export const availabilityFormatter: ValueFormatter<
  "Availability",
  FormattableAvailability | null | undefined,
  AvailabilityFormatterOptions | null | undefined
> = {
  type: "Availability",
  format: (value, options) => {
    if (!value) {
      return "";
    }

    const availableTime = (value.availableTime || [])
      .map((time) => formatAvailableTime(time))
      .filter(Boolean);

    const separator = options?.separator ?? ", ";
    const notAvailablePrefix = options?.notAvailablePrefix ?? "not available: ";

    const notAvailableTime = (value.notAvailableTime || [])
      .map((time) =>
        time.description?.trim()
          ? time.description.trim()
          : [time.during?.start, time.during?.end].filter(Boolean).join(" - "),
      )
      .filter(Boolean);

    switch (options?.style) {
      case "notAvailableTime": {
        return notAvailableTime.join(separator);
      }
      case "full": {
        return [
          availableTime.join(separator),
          notAvailableTime.length > 0
            ? `${notAvailablePrefix}${notAvailableTime.join(separator)}`
            : undefined,
        ]
          .filter(Boolean)
          .join(separator);
      }
      default: {
        return availableTime.join(separator);
      }
    }
  },
};

function formatAvailableTime(time: {
  allDay?: boolean | null | undefined;
  availableEndTime?: string | null | undefined;
  availableStartTime?: string | null | undefined;
  daysOfWeek?: string[] | null | undefined;
}): string {
  const days = (time.daysOfWeek || []).join(", ");
  const hours = time.allDay
    ? "all day"
    : [time.availableStartTime, time.availableEndTime]
        .filter(Boolean)
        .join(" - ");

  return [days, hours].filter(Boolean).join(" ");
}

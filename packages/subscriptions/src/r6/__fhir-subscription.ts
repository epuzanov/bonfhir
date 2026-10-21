import {
  AnyResource,
  CustomResourceClass,
  FhirClient,
  Retrieved,
  Subscription,
  SubscriptionFilterBy,
  build,
  urlSafeConcat,
} from "@bonfhir/core/r6";

export interface FhirSubscriptionFilterBy {
  filterParameter: string;
  value: string;
  comparator?: SubscriptionFilterBy["comparator"] | null | undefined;
  modifier?: SubscriptionFilterBy["modifier"] | null | undefined;
}

export interface FhirSubscription<
  TResource extends AnyResource | CustomResourceClass = AnyResource,
> {
  /** The canonical URL of the SubscriptionTopic that this subscription is about. */
  topic: string;

  /** A human friendly name for the subscription. */
  name: string;

  /** The Subscription reason (to document it on the server). */
  reason: string;

  /** The filters to apply to the topic. */
  filterBy?: FhirSubscriptionFilterBy[] | null | undefined;

  /** The Subscription endpoint to hit (webhook url). */
  endpoint: string;

  /**
   * Use a custom (extended) resource class (instead of default FHIR resource).
   */
  customResource?: CustomResourceClass;

  /** The subscription handler. */
  handler: FhirSubscriptionHandler<TResource>;

  /** Allow customization of the subscription registration. */
  registration?: (
    subscription: Subscription,
  ) => Subscription | Promise<Subscription>;
}

export type FhirSubscriptionHandler<
  TResource extends AnyResource | CustomResourceClass = AnyResource,
> = (args: FhirSubscriptionHandlerArgs<TResource>) => Promise<void>;

export type FhirSubscriptionLogger = Pick<
  typeof console,
  "debug" | "info" | "warn" | "error"
>;

export interface FhirSubscriptionHandlerArgs<
  TResource extends AnyResource | CustomResourceClass = AnyResource,
> {
  fhirClient: FhirClient;

  /** The resource that matches the subscription. */
  resource: Retrieved<TResource>;

  /** The configured logger. */
  logger: FhirSubscriptionLogger | null | undefined;
}

export interface RegisterSubscriptionsArgs {
  fhirClient: FhirClient;

  logger: FhirSubscriptionLogger;

  /** The API base URL */
  baseUrl: string;

  /** The subscription payload, a.k.a. MIME type. Defaults to application/fhir+json */
  contentType?: Subscription["contentType"] | null | undefined;

  /** A secret shared between the API and the FHIR subscription use to secure the endpoint. */
  webhookSecret: string;

  /**
   * The name of the security header used. Defaults to "X-Subscription-Auth"
   */
  securityHeader?: string | null | undefined;

  /** The list of subscriptions to register */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  subscriptions: FhirSubscription<any>[];
}

/**
 * Create the Subscriptions for the webhooks.
 */
export async function registerSubscriptions({
  contentType,
  baseUrl,
  fhirClient,
  logger,
  subscriptions,
  securityHeader,
  webhookSecret,
}: RegisterSubscriptionsArgs) {
  logger.info("Registering subscriptions...");

  for (const subscription of subscriptions) {
    try {
      const subscriptionUrl = urlSafeConcat(baseUrl, subscription.endpoint);
      const securityHeaderValue = `${
        securityHeader || "X-Subscription-Auth"
      }: ${webhookSecret}`;

      let subscriptionToRegister: Subscription = build("Subscription", {
        status: "requested",
        topic: subscription.topic,
        reason: subscription.reason,
        name: subscription.name,
        endpoint: subscriptionUrl,
        contentType: contentType ?? "application/fhir+json",
        channelType: {
          system:
            "http://terminology.hl7.org/CodeSystem/subscription-channel-type",
          code: "rest-hook",
        },
        parameter: [{ name: "header", value: securityHeaderValue }],
        filterBy: subscription.filterBy?.map(
          (filterBy) =>
            ({
              filterParameter: filterBy.filterParameter,
              value: filterBy.value,
              comparator: filterBy.comparator ?? undefined,
              modifier: filterBy.modifier ?? undefined,
            }) as SubscriptionFilterBy,
        ),
      } as Omit<Subscription, "resourceType">);

      subscriptionToRegister = subscription.registration
        ? await subscription.registration(subscriptionToRegister)
        : subscriptionToRegister;

      const [savedSubscription, updated] = await fhirClient.createOr(
        "replace",
        subscriptionToRegister,
        (search) => search.url(subscriptionUrl),
      );

      if (updated) {
        logger.debug(
          `Subscription ${savedSubscription.reason} for ${savedSubscription.topic} on ${subscriptionUrl} registered.`,
        );
      }
    } catch (error) {
      logger.error(
        `Error while registering subscription ${subscription.reason} on ${subscription.endpoint}`,
        (() => {
          try {
            return JSON.stringify(error, undefined, 2);
          } catch {
            return error;
          }
        })(),
      );

      throw error;
    }
  }
}

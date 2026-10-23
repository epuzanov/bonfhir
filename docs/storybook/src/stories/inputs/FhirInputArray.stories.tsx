import { useFhirForm } from "@bonfhir/mantine/r5";
import { FhirInput, FhirInputArray } from "@bonfhir/react/r5";
import { Box, Button, Group, Stack } from "@mantine/core";
import { Meta } from "@storybook/react";
import { buildArgs } from "../helpers";

/**
 * Renders FHIR arrays as inputs, allowing management or repetition.
 *
 * See https://bonfhir.dev/packages/react/components/fhir-input-array for more information.
 */
const meta = {
  title: "Inputs/FhirInputArray",
  component: FhirInputArray,
  tags: ["autodocs"],
  args: {
    label: "Array Label",
  },
  argTypes: {
    label: {
      control: "text",
      description: "The label to display above the input.",
    },
    description: {
      control: "text",
      description: "A description for the input.",
    },
    error: {
      control: "text",
      description: "An error message to display below the input.",
    },
    required: {
      control: "boolean",
      description: "Indicate that the input is required",
    },
    min: {
      control: "Boolean",
    },
    max: {
      control: "Boolean",
    },
    filterBy: {
      control: "text",
      description:
        "The property used by the filter input, as a dotted path - e.g. `value`. When not set, the filter matches any property of the value.",
    },
    pagination: {
      control: "object",
      description:
        "Enable pagination and the filter input - e.g. `{ pageSize: 3 }`.",
    },
  },
} satisfies Meta<typeof FhirInputArray>;

export default meta;

export const Default = {
  args: {
    min: 1,
  },
  render: (props: any) => {
    const form = useFhirForm();
    return (
      <form
        onSubmit={form.onSubmit((values) => {
          const value = JSON.stringify(values.value, undefined, 2);
          alert(value);
          console.log("value", value);
        })}
      >
        <Stack>
          <Box maw={800}>
            <FhirInputArray
              {...buildArgs(props)}
              {...form.getArrayInputProps("value", { newValue: "" })}
            >
              {({ index }) => (
                <FhirInput
                  type="string"
                  {...form.getInputProps(`value.${index}`)}
                />
              )}
            </FhirInputArray>
          </Box>
          <Group mt="md">
            <Button type="submit" variant="outline">
              Submit
            </Button>
            <Button variant="outline" color="red" onClick={() => form.reset()}>
              Reset
            </Button>
          </Group>
        </Stack>
      </form>
    );
  },
};

/**
 * Arrays can be filtered and paginated when they contain many values.
 *
 * The filter only affects the rendered values: `onAdd` and `onRemove` keep working with
 * indexes of the original array, so the form value is not affected by the filter or the
 * page.
 */
export const WithPagination = {
  args: {
    pagination: { pageSize: 3 },
  },
  render: (props: any) => {
    const form = useFhirForm({
      initialValues: {
        value: ["Alpha", "Bravo", "Charlie", "Delta", "Echo", "Foxtrot"],
      },
    });

    return (
      <form
        onSubmit={form.onSubmit((values) => {
          const value = JSON.stringify(values.value, undefined, 2);
          alert(value);
          console.log("value", value);
        })}
      >
        <Stack>
          <Box maw={800}>
            <FhirInputArray
              {...buildArgs(props)}
              {...form.getArrayInputProps("value", { newValue: "" })}
            >
              {({ index }) => (
                <FhirInput
                  type="string"
                  {...form.getInputProps(`value.${index}`)}
                />
              )}
            </FhirInputArray>
          </Box>
          <Group mt="md">
            <Button type="submit" variant="outline">
              Submit
            </Button>
            <Button variant="outline" color="red" onClick={() => form.reset()}>
              Reset
            </Button>
          </Group>
        </Stack>
      </form>
    );
  },
};

/**
 * Use `filterBy` together with `filter` to only display a subset of the values - here, only the
 * `DocumentReference` resources of a `contained` array.
 *
 * The filter is a case-insensitive "contains" match; add a `filterPredicate` to match the
 * `resourceType` exactly.
 */
export const WithFilter = {
  args: {
    filterBy: "resourceType",
    filter: "DocumentReference",
  },
  render: (props: any) => {
    const form = useFhirForm({
      initialValues: {
        contained: [
          { resourceType: "DocumentReference", id: "doc-1", status: "current" },
          { resourceType: "Observation", id: "obs-1", status: "final" },
          { resourceType: "DocumentReference", id: "doc-2", status: "current" },
          { resourceType: "Patient", id: "pat-1" },
        ],
      },
    });

    return (
      <form
        onSubmit={form.onSubmit((values) => {
          const value = JSON.stringify(values.contained, undefined, 2);
          alert(value);
          console.log("value", value);
        })}
      >
        <Stack>
          <Box maw={800}>
            <FhirInputArray
              label="Contained documents"
              {...buildArgs(props)}
              {...form.getArrayInputProps("contained", { newValue: {} })}
            >
              {({ index }) => (
                <FhirInput
                  type="string"
                  label={`[${index}] resourceType`}
                  {...form.getInputProps(`contained.${index}.resourceType`)}
                />
              )}
            </FhirInputArray>
          </Box>
          <Group mt="md">
            <Button type="submit" variant="outline">
              Submit
            </Button>
            <Button variant="outline" color="red" onClick={() => form.reset()}>
              Reset
            </Button>
          </Group>
        </Stack>
      </form>
    );
  },
};

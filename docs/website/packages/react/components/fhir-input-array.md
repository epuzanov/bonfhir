---
title: <FhirInputArray />
---

The `<FhirInputArray />` manages values that are repeated (e.g. when the FHIR cardinality is 0...\*).

As with [`<FhirInput />`](/packages/react/components/fhir-input), it is a controlled component.

:::tip

Although it can be use with a simple `useListState` as shown below, it should probably be used with a form hook / system for maximum power.  
See [`useFhirForm`](/packages/react/mantine/use-fhir-form) or [`useFhirResourceForm`](/packages/react/mantine/use-fhir-resource-form) for more information.

:::

## Example usage

```tsx
// This example uses the `useListState` from Mantine for simplicty sake - https://mantine.dev/hooks/use-list-state/
const [identifiers, setIdentifiers] = useListState<Identifier>([]);

return (
  <FhirInputArray
    label="Identifiers"
    value={identifiers}
    min={1}
    max={10}
    onAdd={(index) => setIdentifiers.insert(index + 1, {})}
    onRemove={(index) => setIdentifiers.remove(index)}
  >
    {({ index }) => (
      <FhirInput
        type="Identifier"
        value={identifiers[index]}
        onChange={(identifier) => {
          if (identifier) {
            setIdentifiers.setItem(index, identifier);
          }
        }}
      />
    )}
  </FhirInputArray>
);
```

The child is a function that gets the index of the element in the array.

## Filtering and pagination

When the array can contain many values, enable the filter input and the pagination with the
`pagination` prop:

```tsx
<FhirInputArray
  label="Identifiers"
  value={identifiers}
  pagination={{ pageSize: 5 }}
  // Only filter on the identifier value. Leave it unset to filter on any property.
  filterBy="value"
  onAdd={(index) => setIdentifiers.insert(index + 1, {})}
  onRemove={(index) => setIdentifiers.remove(index)}
>
  {({ index }) => (
    <FhirInput
      type="Identifier"
      value={identifiers[index]}
      onChange={(identifier) => {
        if (identifier) {
          setIdentifiers.setItem(index, identifier);
        }
      }}
    />
  )}
</FhirInputArray>
```

### Filtering on an attribute

`filterBy` is a dotted path - e.g. `value`, `name.family` or `telecom.0.value`. When it is not
set, the filter matches any property of the value, recursively. The matching is a
case-insensitive "contains", so `DocumentReference` also matches `DocumentReferenceProfile`.

### Pre-filtering the values

Use the `filter` prop to display a subset of the values, without any user interaction. This is
useful for arrays that mix different kinds of values, such as a `contained` array of resources:

```tsx
<FhirInputArray
  label="Contained documents"
  value={contained}
  filterBy="resourceType"
  filter="DocumentReference"
  /* Optional: match the resource type exactly. */
  filterPredicate={(value, filter) => value.resourceType === filter}
  onAdd={(index) => setContained.insert(index + 1, {})}
  onRemove={(index) => setContained.remove(index)}
>
  {({ index }) => (
    <FhirInput
      type="Reference"
      value={
        contained[index] && {
          reference: `#${contained[index].id}`,
        }
      }
    />
  )}
</FhirInputArray>
```

`filter` makes the filter **controlled**: pair it with `onFilterChange` if the user should still
be able to edit it. Use `initialFilter` instead to only set the initial value and let the
component manage it afterwards.

:::note

The filter and the pagination only change the values that are **rendered**: `onAdd` and
`onRemove` are still called with indexes of the original array, and `arrayValue` is still the
unfiltered array. This means the form value is never affected by the filter or the current
page.

:::

:::caution

Because the filter hides values without changing the form value, make sure the user can still
reach every value they need to edit - or that hidden values do not require editing.

:::

### Pagination options

The `pagination` object accepts:

| Property           | Description                                                        | Default                    |
| ------------------ | ------------------------------------------------------------------ | -------------------------- |
| `pageSize`         | The number of values per page. Pagination is off when not set.     | -                          |
| `initialPage`      | The initial page, 1-based.                                         | `1`                        |
| `pageTextTemplate` | The pagination text - `{from}`, `{to}` and `{total}` are replaced. | `"{from}-{to} of {total}"` |

`filterPlaceholder` sets the placeholder of the filter input.

Renderers receive the computed `visibleValue`, `visibleIndexes`, `isFilterable`, `filterText`,
`onFilterTextChange`, `page`, `onPageChange` and `pageInfo` so that a custom renderer can
implement its own UI.

## Preview

<iframe src="https://bonfhir.dev/storybook/iframe.html?args=&id=bonfhir-inputs-fhirinputarray--default&viewMode=story" width="100%" />

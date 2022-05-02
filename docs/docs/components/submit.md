---
id: submit
title: Submit
sidebar_position: 4
---

Submit component is a wrapper for your submit button.
It is used to submit your form.
It will handle the form submission and validations if [`validator`](form#validator) prop is set.

## Example

```jsx
import {Field} from 'react-swift-form';
import {Button} from 'react-native';

function MyForm() {
  return (
    <Submit onSubmit={(values) => console.log(values)}>
      {({submit}) => (
        <Button title="Submit" onPress={submit} />
      )}
    </Submit>
  );
}
```

## Props

### onSubmit

<div class="required">Required</div>

A function that will be called when the form is submitted.

It will not be called if the any one of the validations fails.

| Type                                       | Default                                       |
| ------------------------------------------ | --------------------------------------------- |
| (values: Record<string, any\>) => unknown; | <div class="required as-badge">Required</div> |

## Children Props

These props are passed to the children.

### submit

Submits the form when called.

| Type       |
| ---------- |
| () => void |
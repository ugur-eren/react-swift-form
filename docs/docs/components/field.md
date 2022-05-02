---
id: field
title: Field
sidebar_position: 2
---

Field component is a wrapper for your form elements / fields.
You can use it to render any react element that depends on the value and the change handler of the form element.

## Examples

### Simple Field

`changeValue` can be used to change the value of a form element.
Since it's a plain function, you can directly pass it to the TextInput.

```jsx
import {Field} from 'react-swift-form';
import {TextInput} from 'react-native';

function MyForm() {
  return (
    <Field id="name">
      {({value, changeValue}) => (
        <TextInput value={value} onChangeText={changeValue} />
      )}
    </Field>
  );
}
```

### Custom change handler

If you want to use a custom change handler, you can directly call `changeValue` function.

```jsx
import {Field} from 'react-swift-form';
import {Switch} from 'react-native';

function MyForm() {
  return (
    <Field id="name">
      {({value, changeValue}) => (
        <Switch value={value} onValueChange={() => changeValue(!value)} />
      )}
    </Field>
  );
}
```

### Functional updates

If the new value is computed using the previous value,
you can also use [functional updates](https://reactjs.org/docs/hooks-reference.html#functional-updates) to update the value of a form element.
Just like how you do with [setState action of useState hook](https://reactjs.org/docs/hooks-reference.html#functional-updates).

```jsx
import {Field} from 'react-swift-form';
import {Switch} from 'react-native';

function MyForm() {
  return (
    <Field id="name">
      {({value, changeValue}) => (
        <Switch value={value} onValueChange={() => changeValue(prev => !prev)} />
      )}
    </Field>
  );
}
```

### Show error

If you want to show errors, you can use the `error` value.
This value is set by the [`validator`](form#validator).

```jsx
import {Field} from 'react-swift-form';
import {TextInput, Text} from 'react-native';

function MyForm() {
  return (
    <Field id="name">
      {({value, error, changeValue}) => (
        <>
          <TextInput value={value} onChangeText={changeValue} />
          <Text>{error}</Text>
        </>
      )}
    </Field>
  );
}
```

### Set error manually

You can also set the error manually. However, this is not recommended. You should use the [`validator`](form#validator) prop instead.

```jsx
import {Field} from 'react-swift-form';
import {Switch, Text} from 'react-native';

function MyForm() {
  return (
    <Field id="name">
      {({value, error, changeValue, changeError}) => (
        <>
          <TextInput
            value={value}
            onChangeText={(text) => {
              changeValue(text);

              if (value === 'not-valid') {
                changeError('This is not valid');
              } else {
                changeError('');
              }
            }}
          />
          <Text>{error}</Text>
        </>
      )}
    </Field>
  );
}
```

### All together

Now we will use all of the above features together.

*(Except changeError)*

```jsx
import {Field} from 'react-swift-form';
import {TextInput, Text} from 'react-native';
import {string} from 'yup';

const initialValues = {
  name: '',
};

const validators = {
  name: string()
    .required('This is required')
    .test('is-valid', 'This is not valid', (value) => value === 'not-valid'),
};

function MyForm() {
  return (
    <Form initialState={initialValues} validators={validators}>
      <Field id="name">
        {({value, error, changeValue}) => (
          <>
            <TextInput value={value} onChangeText={changeValue} />
            <Text>{error}</Text>
          </>
        )}
      </Field>
    </Form>
  );
}
```

## Props

### id

<div class="required">Required</div>

The `id` prop is the unique identifier of the form element. It will be used to identify the form field in the context.

This value should be unique to the form *(unless you want to use the same form field multiple times)*.

| Type   | Default                                       |
| ------ | --------------------------------------------- |
| string | <div class="required as-badge">Required</div> |

## Children Props

These props are passed to the children.

### value

Current value of the form field.

| Type   |
| ------ |
| string |

### error

Error message for the field. It's set by the [`validator`](form#validator) or [`changeError`](#changeerror) function.

| Type   |
| ------ |
| string |

### changeValue

Changes the value of the form field.
It will accept the new state or a function that will be called with the previous state as a parameter.
Just like how you would use [`setState` function of a useState hook](https://reactjs.org/docs/hooks-reference.html#functional-updates).

| Type                                              |
| ------------------------------------------------- |
| (value: any \| ((prevValue: any) => any)) => void |

### changeError

Changes the error of the form field.
It's not recommended to use this function.
You will not need to use this function if you are using the validator prop.

| Type                    |
| ----------------------- |
| (error: string) => void |

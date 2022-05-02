---
id: form
title: Form
sidebar_position: 1
---

```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
```

Form is a wrapper component for all form elements. **You must wrap all of your form elements with the Form component.**

## Examples

### Simple Form

```jsx
import {Form} from 'react-swift-form';

function MyForm() {
  return (
    <Form initialState={{
      // You must specify initial values for all form elements.
    }}>
      // Form elements and other components goes here
    </Form>
  );
}
```

### Form with Validation

```jsx
import {Form} from 'react-swift-form';

function MyForm() {
  return (
    <Form initialState={{}} validator={{
      // You can specify yup schema for each form element.
      // Validator must be a plain object, not a yup object schema.
    }}>
      // Form elements and other components goes here
    </Form>
  );
}
```

:::danger
  Validator prop must be a plain object, **not** a yup object schema.

  For example, if you have a string field called `name`, you can use the following validator:

  ```js
  validator={{ name: yup.string().required() }}
  ```

  However, **you can't use** the following yup object schema as a validator:

  ```js
  validator={yup.object({ name: yup.string().required() })}
  ```
:::

:::caution

If you're going to use the validation feature, you must also install [yup](https://www.npmjs.com/package/yup) package separately.

<Tabs>
  <TabItem value="npm">

```bash
npm install --save yup
```

  </TabItem>
  
  <TabItem value="yarn">

```bash
yarn add yup
```

  </TabItem>
</Tabs>

:::

## Props

### initialState

<div class="required">Required</div>

The `initialState` prop is a plain object that contains initial values for all form elements.

It is not recommended to change this prop after the form is rendered.

| Type                 | Default                                       |
| -------------------- | --------------------------------------------- |
| Record<string, any\> | <div class="required as-badge">Required</div> |

---

### validator

The `validator` prop is a plain object that contains validation yup schemas for form elements.

Validator must be a plain object, not a yup object schema.

Validator items can be any yup schema.

| Type                                 | Default     |
| ------------------------------------ | ----------- |
| Partial<Record<string, AnySchema\>\> | `undefined` |

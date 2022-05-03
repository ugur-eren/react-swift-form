![GitHub Workflow Status](https://img.shields.io/github/workflow/status/ugur-eren/react-swift-form/CI?style=flat-square)
![npm bundle size](https://img.shields.io/bundlephobia/min/react-swift-form?style=flat-square)
![npms.io (maintenance)](https://img.shields.io/npms-io/maintenance-score/react-swift-form?style=flat-square)
![Libraries.io dependency status for latest release](https://img.shields.io/librariesio/release/npm/react-swift-form?style=flat-square)
![GitHub top language](https://img.shields.io/github/languages/top/ugur-eren/react-swift-form?style=flat-square)

# React Swift Form

Form library for React and React Native. Key difference from other form libraries is that it is built to be as fast as possible. No unnecessary re-renders, no unnecessary re-validations.

## Quick Start

Install the React Swift Form using your favorite package manager.

yarn:

```bash
yarn add react-swift-form
```

npm:

```bash
npm install --save react-swift-form
```

Wrap your form content in the `<Form>` component.

```jsx
<Form>{/* Your form elements and other content */}</Form>
```

Wrap your form elements with the `<Field>` component.

```jsx
<Field id="id_of_the_form_field">
  {({value, changeValue}) => <TextInput value={value} onChangeText={changeValue} />}
</Field>
```

## Example

You can view the example snack project from here:

[https://snack.expo.dev/@truetiem/react-swift-form-example](https://snack.expo.dev/@truetiem/react-swift-form-example)

## Why use React Swift Form?

React Swift Form is actually meant to be used with React Native. Handling form data and performance in React is easy and there are many libraries out there. But React Native is a whole different story. Every re-render is a performance hit, especially on low-end devices. This library is built to be as fast as possible, without unnecessary re-renders. Since it uses Context API, you can easily use it with any React or React Native app.

---

### Todos

- [ ] Strict types
- [ ] Stateless form field
- [ ] Tests

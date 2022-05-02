# React Swift Form

Yet another React form library, for React and React Native. Key difference from other form libraries is that it is built to be as fast as possible. No unnecessary re-renders, no unnecessary re-validations.

## Quick Start

Install the React Swift Form using your favorite package manager.

npm:

```bash
npm install --save react-swift-form
```

yarn:

```bash
yarn add react-swift-form
```

Wrap your form content in the `<Form>` component.

```jsx
<FormProvider>{/* Your form elements and other content */}</FormProvider>
```

Wrap your form elements with the `<Field>` component.

```jsx
<Field id="id_of_the_form_field">
  {({value, changeValue}) => <TextInput value={value} onChangeText={changeValue} />}
</Field>
```

## Why use React Swift Form?

React Swift Form is actually meant to be used with React Native. Handling form data and performance in React is easy and there are many libraries out there. But React Native is a whole different story. Every re-render is a performance hit, especially on low-end devices. This library is built to be as fast as possible, without unnecessary re-renders. Since it uses Context API, you can easily use it with any React or React Native app.

---

### Todos

- [ ] Strict types
- [ ] Stateless form field
- [ ] Tests

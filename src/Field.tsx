/* eslint @typescript-eslint/no-explicit-any: "off" */

import {useContext, useCallback, useMemo} from 'react';
import {FormContext, ChangeStateAction} from './FormProvider';

export interface FieldChildrenProps<T = any> {
  /**
   * Current value of the form field.
   */
  value: T;

  /**
   * Changes the value of the form field.
   * It will accept the new state or a function that will be called with the previous state as a parameter.
   * Just like how you would use `setState` function of a useState hook.
   */
  changeValue: (value: ChangeStateAction<T>) => unknown;
}

export interface FieldProps<T = any> {
  /**
   * Identifier of the form field. It will be used to identify the form field in the context.
   * This value should be unique to the form (unless you want to use the same form field multiple times).
   */
  id: string;

  /**
   * Function to render and pass state into.
   */
  children: (props: FieldChildrenProps<T>) => React.ReactNode & React.ReactElement;
}

/**
 * Field component is a wrapper for your form elements / fields.
 *
 * <details>
 *  <summary>Example</summary>
 *
 *  ```jsx
 *  <Field id="id_of_the_form_field">
 *   {({value, changeValue}) => (
 *     <TextInput value={value} onChangeText={changeValue} />
 *   )}
 *  </Field>
 *  ```
 * </details>
 *
 * <details>
 *  <summary>Example</summary>
 *
 *  ```jsx
 *  <Field id="id_of_the_form_field">
 *   {({value, changeValue}) => (
 *     <Switch value={value} onValueChange={() => changeValue((prev) => !prev)} />
 *   )}
 *  </Field>
 *  ```
 * </details>
 */
export const Field: React.VFC<FieldProps> = ({id, children}) => {
  const [state, dispatch] = useContext(FormContext);

  const currentState = state[id];

  const changeValue = useCallback(
    (action: FieldChildrenProps['changeValue']) => {
      dispatch({type: 'CHANGE_VALUE', payload: {id, action}});
    },
    [id],
  );

  return useMemo(
    () => children({value: currentState, changeValue}),
    [currentState, changeValue, children],
  );
};

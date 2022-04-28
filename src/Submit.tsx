/* eslint @typescript-eslint/no-explicit-any: "off" */

import {useContext} from 'react';
import {FormContext, StateType} from './FormProvider';

export interface SubmitChildrenProps {
  /**
   * Submits the form when called.
   */
  submit: () => unknown;
}

export interface SubmitProps<T = any> {
  /**
   * A function that will be called when the form is submitted.
   */
  onSubmit: (values: StateType<T>) => unknown;

  /**
   * Component to render.
   */
  children: (props: SubmitChildrenProps) => React.ReactNode & React.ReactElement;
}

/**
 * Submit is a wrapper for your submit button.
 *
 * <details>
 *  <summary>Example</summary>
 *
 *  ```jsx
 *  <Submit onSubmit={(values) => console.log(values)}>
 *   {({submit}) => (
 *    <Button title="Submit" onPress={submit} />
 *   )}
 *  </Submit>
 *  ```
 * </details>
 */
export const Submit: React.VFC<SubmitProps> = (props) => {
  const {children, onSubmit} = props;

  const [state] = useContext(FormContext);

  const onSubmitWrapper = () => {
    return onSubmit(state);
  };

  return children({submit: onSubmitWrapper});
};

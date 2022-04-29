/* eslint @typescript-eslint/no-explicit-any: "off" */

import {useContext} from 'react';
import {ValidationError} from 'yup';
import {FormContext, StateType, ValidatorContext} from './FormProvider';

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
  onSubmit: (values: StateType<T>['values']) => unknown;

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

  const [{values}, dispatch] = useContext(FormContext);
  const validator = useContext(ValidatorContext);

  const onSubmitWrapper = () => {
    const errors: StateType['errors'] = {};

    if (typeof validator === 'object') {
      Object.entries(validator).forEach(([schemaId, schema]) => {
        if (schema?.__isYupSchema__) {
          try {
            schema.validateSync(values[schemaId]);
          } catch (err) {
            errors[schemaId] = (err as ValidationError).message;
          }
        }
      });
    }

    if (Object.keys(errors).length > 0) {
      dispatch({type: 'CHANGE_ERRORS', payload: errors});
      return undefined;
    }

    return onSubmit(values);
  };

  return children({submit: onSubmitWrapper});
};

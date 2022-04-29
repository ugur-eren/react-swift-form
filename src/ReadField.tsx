/* eslint @typescript-eslint/no-explicit-any: "off" */

import {useContext, useMemo} from 'react';
import {FormContext} from './FormProvider';

export interface ReadFieldChildrenProps<T = any> {
  /**
   * Value(s) of the field(s).
   */
  values: Record<string, T>;

  /**
   * Error message(s) for the field(s).
   */
  errors?: Record<string, string>;
}

export interface ReadFieldProps<T = any> {
  /**
   * Identifier of the field. It will be used to identify the field in the context.
   * Can be an array of ids to get multiple fields.
   */
  id: string | string[];

  /**
   * Function to render and pass state into.
   */
  children: (props: ReadFieldChildrenProps<T>) => React.ReactNode & React.ReactElement;
}

/**
 * ReadField component can be used to read form field values and errors.
 *
 * <details>
 *  <summary>Example</summary>
 *
 *  ```jsx
 *  <ReadField id="id_of_the_form_field">
 *   {({values}) => (
 *     <Text>{values}</Text>
 *   )}
 *  </ReadField>
 *  ```
 * </details>
 *
 * <details>
 *  <summary>Example</summary>
 *
 *  ```jsx
 *  <ReadField id={["id1", "id2"]}>
 *   {({values}) => (
 *     <Text>{values.id1} {values.id2}</Text>
 *   )}
 *  </ReadField>
 *  ```
 * </details>
 */
export const ReadField: React.FC<ReadFieldProps> = ({id, children}) => {
  const [{values, errors}] = useContext(FormContext);

  const currentValue = !Array.isArray(id)
    ? values[id]
    : id.reduce((acc, curr) => ({...acc, [curr]: values[curr]}), {});

  const currentError = !Array.isArray(id)
    ? errors[id]
    : id.reduce((acc, curr) => ({...acc, [curr]: errors[curr]}), {});

  return useMemo(
    () => children({values: currentValue, errors: currentError}),
    [currentValue, currentError, children],
  );
};

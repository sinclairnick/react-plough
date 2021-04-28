import { ChangeEvent, useEffect, useState } from "react";
import { BaseFieldOptions, FieldActions, FieldMeta, FieldProps } from "./types";

export function useBaseField<T, E = HTMLInputElement>(
  options: BaseFieldOptions<T>
): [FieldProps<T, E>, FieldMeta<T>, FieldActions<T>] {
  const {
    checkForErrors,
    extractValue,
    checkIfEmpty,
    initialValue,
    isRequired,
    deps,
  } = options;
  const [wasTouched, setWasTouched] = useState(false);
  const [isFocussed, setIsFocussed] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const [value, setValue] = useState<T>(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, deps);

  const required = Boolean(isRequired);

  const onChange = async (e: ChangeEvent<E>) => {
    const _value = extractValue(e.target);

    const _error = await checkForErrors({
      ...meta,
      value: _value,
    });
    setError(_error);
    setValue(_value);
  };

  const onBlur = () => {
    if (!wasTouched) {
      setWasTouched(true);
    }
    setIsFocussed(false);
  };

  const onFocus = () => {
    setIsFocussed(true);
  };

  const reset = (toValue?: T) => {
    setError(undefined);
    setWasTouched(false);
    setIsFocussed(false);
    setValue(toValue ?? initialValue);
  };

  const meta: FieldMeta<T> = {
    value,
    isDirty: value !== initialValue,
    isEmpty: checkIfEmpty(value),
    isFocussed,
    isRequired: Boolean(isRequired),
    wasTouched,
    error,
    hasError: error != null,
  };

  const actions: FieldActions<T> = {
    reset,
  };

  const props: FieldProps<T, E> = {
    onChange,
    onBlur,
    onFocus,
    value,
    required: required,
  };

  return [props, meta, actions];
}

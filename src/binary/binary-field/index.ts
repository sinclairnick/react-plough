import { useBaseField } from "../../base/base-field";
import {
  FieldActions,
  FieldMeta,
  FieldMetaWithoutError,
  FieldOptions,
  FieldProps,
} from "../../base/base-field/types";

export function useBinaryField(options?: FieldOptions<boolean>): [
  FieldProps<boolean, HTMLInputElement>,
  FieldMeta<boolean>,
  FieldActions<boolean>
] {
  const checkForErrors = (meta: FieldMetaWithoutError<boolean>) => {
    const error = options?.validate?.(meta);
    const requiredErrorMessage =
      options?.isRequired && !meta.value
        ? `${options.label ?? "This field"} is required`
        : undefined;

    return error ?? requiredErrorMessage;
  };

  const extractValue = (target: EventTarget & HTMLInputElement) => {
    const newValue = target.checked;
    return options?.transform?.(newValue) ?? newValue;
  };

  const checkIfEmpty = (value: boolean) => {
    return value;
  };

  const initialValue = Boolean(options?.initialValue);
  const isRequired = Boolean(options?.isRequired);

  return useBaseField({
    checkForErrors,
    extractValue,
    checkIfEmpty,
    initialValue,
    isRequired,
  });
}

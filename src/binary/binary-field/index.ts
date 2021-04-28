import { useBaseField } from "../../base/base-field";
import {
  FieldMetaWithoutError,
  FieldOptions,
} from "../../base/base-field/types";

export function useBinaryField(
  options?: FieldOptions<boolean>,
  deps: any[] = []
) {
  const checkForErrors = async (meta: FieldMetaWithoutError<boolean>) => {
    const error = await options?.validate?.(meta);
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
    deps,
  });
}

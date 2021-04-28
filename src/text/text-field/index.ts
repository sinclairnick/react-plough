import { useBaseField } from "../../base/base-field";
import {
  FieldMetaWithoutError,
  FieldOptions,
} from "../../base/base-field/types";

export function useTextField(options?: FieldOptions<string>, deps: any[] = []) {
  const checkForErrors = async (meta: FieldMetaWithoutError<string>) => {
    const error = await options?.validate?.(meta);
    const requiredErrorMessage =
      options?.isRequired && meta.value.length == 0
        ? `${options.label ?? "This field"} is required`
        : undefined;
    return error ?? requiredErrorMessage;
  };

  const extractValue = (target: EventTarget & HTMLInputElement) => {
    const newValue = target.value;
    return options?.transform?.(newValue) ?? newValue;
  };

  const checkIfEmpty = (value: string) => {
    return value == null || value?.length === 0;
  };

  const initialValue = `${options?.initialValue ?? ""}`;
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

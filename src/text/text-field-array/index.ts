import { useBaseFieldArray } from "../../base/base-field-array";
import { FieldArrayOptions } from "../../base/base-field-array/types";
import { FieldMetaWithoutError } from "../../base/base-field/types";

export function useTextFieldArray(options?: FieldArrayOptions<string>) {
  const checkForErrors = async (
    itemMeta: FieldMetaWithoutError<string>,
    allMeta: FieldMetaWithoutError<string>[]
  ) => {
    const error = await options?.validate?.(itemMeta, allMeta);
    const requiredErrorMessage =
      options?.isRequired && itemMeta.value.length == 0
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

  const initialValues = options?.initialValues.map(
    (initialValue) => `${initialValue ?? ""}`
  );
  const isRequired = Boolean(options?.isRequired);

  return useBaseFieldArray({
    checkForErrors,
    extractValue,
    checkIfEmpty,
    initialValues,
    isRequired,
  });
}

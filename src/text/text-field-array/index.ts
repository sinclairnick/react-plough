import { useBaseFieldArray } from "../../base/base-field-array";
import {
  FieldArrayActions,
  FieldArrayData,
  FieldArrayOptions,
  FieldArrayMeta
} from "../../base/base-field-array/types";
import { FieldMetaWithoutError } from "../../base/base-field/types";

export function useTextFieldArray(
  options?: FieldArrayOptions<string>
): [FieldArrayData<string, HTMLInputElement>[], FieldArrayMeta, FieldArrayActions<string>] {
  const checkForErrors = (
    itemMeta: FieldMetaWithoutError<string>,
    allMeta: FieldMetaWithoutError<string>[]
  ) => {
    const error = options?.validate?.(itemMeta, allMeta);
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

  const initialValue = (Array.isArray(options?.initialValue)
    ? options?.initialValue.map((initialValue) => `${initialValue ?? ""}`)
    : options?.initialValue)
    ?? [];
  const isRequired = Boolean(options?.isRequired);

  return useBaseFieldArray({
    checkForErrors,
    extractValue,
    checkIfEmpty,
    initialValue,
    defaultValue: "",
    isRequired,
  });
}

import { useBaseFieldArray } from "../../base/base-field-array";
import {
  FieldArrayActions,
  FieldArrayData,
  FieldArrayOptions,
} from "../../base/base-field-array/types";
import { FieldMetaWithoutError } from "../../base/base-field/types";

export function useBinaryFieldArray(
  options?: FieldArrayOptions<boolean>
): [FieldArrayData<boolean, HTMLInputElement>[], FieldArrayActions<boolean>] {
  const checkForErrors = (
    itemMeta: FieldMetaWithoutError<boolean>,
    allMeta: FieldMetaWithoutError<boolean>[]
  ) => {
    const error = options?.validate?.(itemMeta, allMeta);
    const requiredErrorMessage =
      options?.isRequired && !itemMeta.value
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

  const initialValue = (Array.isArray(options?.initialValue)
    ? options?.initialValue.map((init) => Boolean(init))
    : options?.initialValue)
    ?? [];
  const isRequired = Boolean(options?.isRequired);

  return useBaseFieldArray({
    checkForErrors,
    extractValue,
    checkIfEmpty,
    initialValue,
    defaultValue: false,
    isRequired,
  });
}

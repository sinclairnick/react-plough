import { useBaseFieldArray } from "../../base/base-field-array";
import { FieldArrayOptions } from "../../base/base-field-array/types";
import { FieldMetaWithoutError } from "../../base/base-field/types";

export function useBinaryFieldArray(options?: FieldArrayOptions<boolean>) {
  const checkForErrors = async (
    itemMeta: FieldMetaWithoutError<boolean>,
    allMeta: FieldMetaWithoutError<boolean>[]
  ) => {
    const error = await options?.validate?.(itemMeta, allMeta);
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

  const initialValues = options?.initialValues?.map((init) => Boolean(init));
  const isRequired = Boolean(options?.isRequired);

  return useBaseFieldArray({
    checkForErrors,
    extractValue,
    checkIfEmpty,
    initialValues,
    isRequired,
  });
}

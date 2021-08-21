import { useBaseField } from "../../base/base-field";
import {
  FieldMeta,
  FieldMetaWithoutError,
  FieldOptions,
  FieldProps,
} from "../../base/base-field/types";

export type FileFieldProps = Omit<
  FieldProps<FileList, HTMLInputElement>,
  "value"
>;

export function useFileField(
  options?: FieldOptions<FileList | null | undefined>,
  deps: any[] = []
): [FileFieldProps, FieldMeta<FileList | null | undefined>] {
  const checkForErrors = async (meta: FieldMetaWithoutError<FileList>) => {
    const error = await options?.validate?.(meta);
    const isEmpty = checkIfEmpty(meta.value);
    const requiredErrorMessage =
      options?.isRequired && isEmpty
        ? `${options.label ?? "This field"} is required`
        : undefined;

    return error ?? requiredErrorMessage;
  };

  const extractValue = (target: EventTarget & HTMLInputElement) => {
    const newValue = target.files;
    return options?.transform?.(newValue ?? undefined) ?? newValue;
  };

  const checkIfEmpty = (value: FileList) => {
    return value == null || value?.length == 0;
  };

  const initialValue = options?.initialValue;
  const isRequired = Boolean(options?.isRequired);

  // Can't use controlled file input
  const [{ value, ...restProps }, meta] = useBaseField({
    checkForErrors,
    extractValue,
    checkIfEmpty,
    initialValue,
    isRequired,
    deps,
  });
  return [{ ...restProps, type: "file" }, meta];
}

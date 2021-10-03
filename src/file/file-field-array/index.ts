import { useBaseFieldArray } from "../../base/base-field-array";
import {
  FieldArrayActions,
  FieldArrayData,
  FieldArrayOptions,
  FieldArrayMeta
} from "../../base/base-field-array/types";
import { FieldMetaWithoutError } from "../../base/base-field/types";
import { FileFieldProps } from "../file-field";

export type FileFieldArrayProps = Omit<
  FieldArrayData<FileList | null | undefined, HTMLInputElement>,
  "props"
> & {
  props: FileFieldProps;
};

export function useFileFieldArray(
  options?: FieldArrayOptions<FileList | undefined>
): [FileFieldArrayProps[], FieldArrayMeta, FieldArrayActions<FileList>] {
  const checkForErrors = (
    itemMeta: FieldMetaWithoutError<FileList>,
    allMeta: FieldMetaWithoutError<FileList>[]
  ) => {
    const error = options?.validate?.(itemMeta, allMeta);
    const requiredErrorMessage =
      options?.isRequired && itemMeta.value.length == 0
        ? `${options.label ?? "This field"} is required`
        : undefined;
    return error ?? requiredErrorMessage;
  };

  const extractValue = (target: EventTarget & HTMLInputElement) => {
    const newValue = target.files;
    return options?.transform?.(newValue ?? undefined) ?? newValue;
  };

  const checkIfEmpty = (value: FileList) => {
    return value == null || value?.length === 0;
  };

  const initialValue = options?.initialValue;
  const isRequired = Boolean(options?.isRequired);

  const [_data, meta, actions] = useBaseFieldArray({
    checkForErrors,
    extractValue,
    checkIfEmpty,
    initialValue,
    defaultValue: undefined,
    isRequired,
  });
  const data = _data.map((d) => {
    // Can't use controlled file input
    const { value, ...restProps } = d.props;
    return {
      ...d,
      props: { ...restProps, type: "file" },
    };
  });
  return [data, meta, actions];
}

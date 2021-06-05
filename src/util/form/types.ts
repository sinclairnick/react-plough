import { useBinaryField } from "../../binary/binary-field";
import { useBinaryFieldArray } from "../../binary/binary-field-array";
import { useFileField } from "../../file/file-field";
import { useFileFieldArray } from "../../file/file-field-array";
import { useTextField } from "../../text/text-field";
import { useTextFieldArray } from "../../text/text-field-array";

export type ExtractPrimitiveHookType<T> = T extends "binary"
  ? typeof useBinaryField
  : T extends "file"
  ? typeof useFileField
  : typeof useTextField;

export type ExtractArrayHookType<T> = T extends "binary"
  ? typeof useBinaryFieldArray
  : T extends "file"
  ? typeof useFileFieldArray
  : typeof useTextFieldArray;

export type ExtractTypeString<T> = T extends boolean
  ? "binary"
  : T extends FileList
  ? "file"
  : "string";

export type FieldArrayDataType<T> = {
  data: ReturnType<ExtractArrayHookType<T>>["0"];
  arrayActions: ReturnType<ExtractArrayHookType<T>>["1"];
};

export type FieldDataType<T> = {
  props: ReturnType<ExtractPrimitiveHookType<T>>[0];
  meta: ReturnType<ExtractPrimitiveHookType<T>>[1];
  actions: ReturnType<ExtractPrimitiveHookType<T>>[2];
};

export type ExtractDataType<V, T> = V extends any[]
  ? FieldArrayDataType<T>
  : FieldDataType<T>;

export type ExtractHookType<V, T> = V extends any[]
  ? ExtractArrayHookType<T>
  : ExtractPrimitiveHookType<T>;

export type InitialValueType =
  | string
  | boolean
  | string[]
  | boolean[]
  | never[]
  | {
      value: string | boolean | string[] | boolean[];
    }
  | { value: never[]; type?: "binary" | "file" }
  | { type?: "binary" | "file" };

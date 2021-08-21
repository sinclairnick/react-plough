import { useBinaryField } from "../../binary/binary-field";
import { useBinaryFieldArray } from "../..//binary/binary-field-array";
import { useFileField } from "../../file/file-field";
import { useFileFieldArray } from "../../file/file-field-array";
import { useTextField } from "../../text/text-field";
import { useTextFieldArray } from "../../text/text-field-array";
import { composeForm } from "./compose-form";
import {
  ExtractDataType,
  ExtractHookType,
  ExtractTypeString,
  FieldArrayDataType,
  FieldDataType,
  InitialValueType,
} from "./types";

/**
 * Creates a form given initial values and configuration
 * @returns An object of hooks and form utility functions
 */
export function createForm<
  A extends {
    [key: string]: InitialValueType;
  },
  K extends keyof A
>(initialValues: A) {
  type Value<K extends keyof A> = A[K] extends any[]
    ? A[K]
    : A[K] extends Record<string, any>
    ? A[K]["value"]
    : A[K];
  type Type<K extends keyof A> = A[K] extends (infer R)[]
    ? ExtractTypeString<R>
    : A[K] extends Record<string, any>
    ? A[K]["type"]
    : ExtractTypeString<A[K]>;
  type HooksObject = {
    [key in K & string as `use${Capitalize<key>}`]: ExtractHookType<
      Value<key>,
      Type<key>
    >;
  };
  type FormData = { [key in K & string]: ExtractDataType<Value<key>, Type<key>>; }

  let formData = {} as FormData;

  const hooks: Partial<HooksObject> = {};
  for (const key of Object.keys(initialValues)) {
    const entry = initialValues[key];
    const hookKey = `use${key[0].toUpperCase()}${key.slice(1)}`;

    const value =
      typeof entry === "object" && "value" in entry ? entry.value : entry;
    const type =
      typeof entry === "object" && "type" in entry ? entry.type : "string";

    if (Array.isArray(value)) {
      if (type === "binary") {
        hooks[hookKey] = (
          ...params: Parameters<typeof useBinaryFieldArray>
        ) => {
          const [data, arrayActions] = useBinaryFieldArray({
            initialValue: value as any,
            ...params[0],
          });

          formData[key] = { data, arrayActions };

          return [data, arrayActions] as const;
        };
        continue;
      }
      if (type === "file") {
        hooks[hookKey] = (...params: Parameters<typeof useFileFieldArray>) => {
          const [data, arrayActions] = useFileFieldArray({
            initialValue: value as any,
            ...params[0],
          });

          formData[key] = { data, arrayActions };

          return [data, arrayActions];
        };
        continue;
      }
      hooks[hookKey] = (...params: Parameters<typeof useTextFieldArray>) => {
        const [data, arrayActions] = useTextFieldArray({
          initialValue: value as any,
          ...params[0],
        });

        formData[key] = { data, arrayActions };

        return [data, arrayActions];
      };
      continue;
    }

    if (type === "binary") {
      hooks[hookKey] = (...params: Parameters<typeof useBinaryField>) => {
        const [props, meta, actions] = useBinaryField(
          { initialValue: value as any, ...params[0] },
          params[1]
        );

        formData[key] = { props, meta, actions };

        return [props, meta, actions] as const;
      };
      continue;
    }
    if (type === "file") {
      hooks[hookKey] = useFileField;

      (...params: Parameters<typeof useFileField>) => {
        const [props, meta] = useFileField(
          { initialValue: value as any, ...params[0], },
          params[1]
        );

        formData[key] = { props, meta };

        return [props, meta];
      };
      continue;
    }
    hooks[hookKey] = (...params: Parameters<typeof useTextField>) => {
      const [props, meta, actions] = useTextField(
        { initialValue: value as any, ...params[0], },
        params[1]
      );

      formData[key] = { props, meta };

      return [props, meta, actions];
    };
    continue;
  }

  /**
   * Gets the raw internal form data
   */
  const getData = () => {
    return formData
  };

  /**
   * Processes the form and returns useful aggregate functions and data
   */
  const collect = () => {
    type MetaType = {
      [key in K & string]:
      FormData[key] extends FieldArrayDataType<
        Value<key>
      >
      ? FormData[key]["data"][number]["meta"][]
      : FormData[key] extends FieldDataType<Value<key>>
      ? FormData[key]["meta"]
      : any;
    };
    const metas = {} as MetaType;
    for (const key in formData) {
      const data = formData[key as K & string];
      if ("meta" in data) {
        metas[key] = data["meta"];
        continue;
      }
      metas[key] = data?.["data"]?.map((d) => d["meta"]);
    }
    return composeForm(metas);
  };

  const reset = () => {
    for (const key in formData) {
      const entry = formData[key as K & string];
      if ("arrayActions" in entry) {
        entry.arrayActions?.resetAll();
      } else {
        entry?.actions?.reset();
      }
    }
  };

  return { ...(hooks as any as HooksObject), getData, collect, reset };
}
const form = createForm({ a: "" })
const [x] = form.collect()
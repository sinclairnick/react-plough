import { FieldMeta } from "../../base/base-field/types";

type Meta = {
  hasErrors: boolean,
  isComplete: boolean,
  wasTouched: boolean,
  isFocussed: boolean,
  isDirty: boolean,
}

/**
 * Extract values and run common checks over many fields
 * @returns [FormData, FormMeta]
 */
export function composeForm<
  O extends {
    [key: string]: FieldMeta<any> | FieldMeta<any>[];
  },
  K extends keyof O,
  D extends {
    [key in keyof O]: O[key] extends any[]
    ? O[key][number]["value"][]
    : O[key] extends FieldMeta<any>
    ? O[key]["value"]
    : unknown;
  },
  >(fields: O): [D, Meta] {
  let hasErrors = false;
  let isComplete = true;
  let wasTouched = false;
  let isFocussed = false;
  let isDirty = false;

  const data = {} as D
  for (const key of Object.keys(fields)) {
    const value = fields[key];
    // Handle array values
    if (Array.isArray(value)) {
      const values: typeof value[0]["value"] = [];
      for (const v of value) {
        if (v.hasError) hasErrors = true;
        if (v.isRequired && v.isEmpty) isComplete = false;
        if (v.wasTouched) wasTouched = true;
        if (v.isFocussed) isFocussed = true;
        if (v.isDirty) isDirty = true;
        values.push(v.value);
      }
      data[key as K] = values;
    } else {
      if (value.hasError) hasErrors = true;
      if (value.isRequired && value.isEmpty) isComplete = false;
      if (value.isRequired && value.isEmpty) isComplete = false;
      if (value.wasTouched) wasTouched = true;
      if (value.isFocussed) isFocussed = true;
      if (value.isDirty) isDirty = true;
      data[key as K] = value.value as typeof value["value"];
    }
  }

  const meta = {
    hasErrors,
    isComplete,
    wasTouched,
    isFocussed,
    isDirty,
  };

  return [data, meta]
}
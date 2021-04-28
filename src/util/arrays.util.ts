import {
  FieldArrayActions,
  FieldArrayData,
} from "../base/base-field-array/types";

export const squashArrayActions = <A extends FieldArrayActions<any>[]>(
  actions: A
) => {
  const addItem = () => actions.forEach((a) => a.addItem());
  const resetAll = () => actions.forEach((a) => a.resetAll());
  return {
    addItem,
    resetAll,
  };
};

/**
 * Converts an object of `{key: Array<value>}` to `Array<{key: value}>`
 * @returns [FormData, FormActions]
 */
export const groupFieldArrays = <
  O extends {
    [key: string]: [FieldArrayData<any, any>[], FieldArrayActions<any>];
  },
  K extends keyof O
>(
  groups: O
) => {
  const array = Object.keys(groups).map((k) => groups[k])[0][0];

  const _actions: FieldArrayActions<any>[] = [];
  Object.keys(groups).forEach((key) => _actions.push(groups[key][1]));
  const actions = squashArrayActions(_actions);

  const data = array.map((_, i) => {
    type FieldArrayItemData = {
      [key in keyof O]: FieldArrayData<
        typeof groups[key][0][typeof i]["meta"]["value"],
        Parameters<
          typeof groups[key][0][typeof i]["props"]["onChange"]
        >["0"]["target"]
      >;
    };
    const obj = {} as FieldArrayItemData;
    Object.keys(groups).forEach((key) => {
      obj[key as K] = groups[key][0][i];
    });
    return obj;
  });
  return [data, actions] as const;
};

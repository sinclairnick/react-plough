import { reducer } from "./constants"
import { Action } from "./types"

describe("Base field array constants", () => {
	it("Updates all items", () => {
		const reducerFn = reducer("")

		const state = [{
			id: "",
			isFocussed: true,
			value: "",
			wasTouched: false,
			error: undefined
		}]

		const action: Action<string> = {
			type: "UPDATE_ITEMS",
			updates: [{ error: "NEW ERROR" }]
		}

		const res = reducerFn(
			state,
			action
		)

		expect(res[0].error).toBe("NEW ERROR")
	})
})
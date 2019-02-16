module.exports = {
	getCurrentFacts: (facts, schema) => {
		let state = { facts: {}, schema: {} }

		for (const [attribute, property, value] of schema) {
			state.schema[attribute] = value
		}

		// deconstruct the input into the state variable to get
		// the current state of the facts
		for (const [
			index,
			[entity, attribute, value, status],
		] of facts.entries()) {
			if (
				state.facts.hasOwnProperty(entity) &&
				state.schema.hasOwnProperty(attribute)
			) {
				// 1. state.facts has property entity and attribute is valid

				if (state.facts[entity].hasOwnProperty(attribute)) {
					//1.1. entity has property attribute

					if (status) {
						//1.1.1. status is true

						if (state.schema[attribute] === 'one') {
							// 1.1.1.1. cardinality of attribute is one =>
							// replace anything inside of state.facts[entity][attribute] with { [value]: index}

							state.facts[entity][attribute] = { [value]: index }
						} else {
							// 1.1.1.2. cardinality of attribute is many =>
							// set state.facts[entity][attribute][value] to index, thus replacing any previous occurrences of it

							state.facts[entity][attribute][value] = index
						}
					} else if (
						state.facts[entity][attribute].hasOwnProperty(value)
					) {
						// 1.1.2. status is false and entity[attribute][value] exists =>
						// delete entity[attribute][value].

						delete state.facts[entity][attribute][value]
					}
				} else if (status) {
					// 1.2. entity does not have property [attribute] and status is true =>
					// create attribute and give it a property [value] equal to index

					state.facts[entity][attribute] = { [value]: index }
				}
			} else if (state.schema.hasOwnProperty(attribute) && status) {
				// 2. state.facts doesn't have property [entity], attribute is valid and status is true =>
				// create entity, entity[attribute] and give it a property [value] equal to index

				state.facts[entity] = { [attribute]: { [value]: index } }
			}
		}

		let outputArray = []

		// build the output from the state variable:
		for (const entity in state.facts) {
			for (const attribute in state.facts[entity]) {
				for (const value in state.facts[entity][attribute]) {
					outputArray.push([
						entity,
						attribute,
						value,
						true,
						state.facts[entity][attribute][value],
					])
				}
			}
		}

		// sort the facts by the index property, which is the last item
		// in each array
		outputArray.sort((first, second) => {
			return first[first.length - 1] - second[second.length - 1]
		})

		// remove the index property
		for (const fact of outputArray) {
			fact.pop()
		}

		return outputArray
	},
}

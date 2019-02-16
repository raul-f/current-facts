const assert = require('chai').assert
const getCurrentFacts = require('../main').getCurrentFacts

suite('getCurrentFacts(facts, schema)', function() {
	test('Function must return an array of arrays', function() {
		const input = [
			[
				[
					['raul', 'endereço', 'av rio branco, 109', true],
					['gabriela', 'endereço', 'rua alice, 10', true],
					['paula', 'endereço', 'rua bob, 88', true],
					['mariane', 'telefone', '234-5678', true],
					['aline', 'telefone', '91234-5555', true],
					['joão', 'telefone', '234-5678', false],
					['fernando', 'faculdade', 'PUC', true],
					['isabella', 'telefone', '56789-1010', true],
				],
				[
					['endereço', 'cardinality', 'one'],
					['faculdade', 'cardinality', 'one'],
					['telefone', 'cardinality', 'many'],
				],
			],
			[
				[
					['fernando', 'endereço', 'av rio branco, 109', true],
					['joão', 'telefone', '234-5678', true],
				],
				[
					['endereço', 'cardinality', 'one'],
					['telefone', 'cardinality', 'many'],
				],
			],
			[
				[
					['fernando', 'endereço', 'av rio branco, 109', true],
					['joão', 'endereço', 'rua alice, 10', true],
					['joão', 'endereço', 'rua bob, 88', true],
					['joão', 'telefone', '234-5678', true],
					['joão', 'telefone', '91234-5555', true],
					['joão', 'telefone', '234-5678', false],
					['fernando', 'telefone', '98888-1111', true],
					['fernando', 'telefone', '56789-1010', true],
				],
				[
					['endereço', 'cardinality', 'one'],
					['telefone', 'cardinality', 'many'],
				],
			],
			[[], []],
		]

		for (const [facts, schema] of input) {
			assert.isArray(getCurrentFacts(facts, schema))
			for (const item of getCurrentFacts(facts, schema)) {
				assert.isArray(item)
			}
		}
	})

	test('Uncontested facts must be returned', function() {
		const input = [
			{
				in: [
					[
						['raul', 'endereço', 'av rio branco, 109', true],
						['gabriela', 'endereço', 'rua alice, 10', true],
						['paula', 'endereço', 'rua bob, 88', true],
						['mariane', 'telefone', '234-5678', true],
						['aline', 'telefone', '91234-5555', true],
						['fernando', 'faculdade', 'PUC', true],
					],
					[
						['endereço', 'cardinality', 'one'],
						['faculdade', 'cardinality', 'one'],
						['telefone', 'cardinality', 'many'],
					],
				],
				out: [
					['raul', 'endereço', 'av rio branco, 109', true],
					['gabriela', 'endereço', 'rua alice, 10', true],
					['paula', 'endereço', 'rua bob, 88', true],
					['mariane', 'telefone', '234-5678', true],
					['aline', 'telefone', '91234-5555', true],
					['fernando', 'faculdade', 'PUC', true],
				],
			},
			{
				in: [
					[['fernando', 'endereço', 'av rio branco, 109', true]],
					[
						['endereço', 'cardinality', 'one'],
						['telefone', 'cardinality', 'many'],
					],
				],
				out: [['fernando', 'endereço', 'av rio branco, 109', true]],
			},
			{
				in: [
					[['isabella', 'telefone', '56789-1010', true]],
					[
						['endereço', 'cardinality', 'one'],
						['telefone', 'cardinality', 'many'],
					],
				],
				out: [['isabella', 'telefone', '56789-1010', true]],
			},
			{
				in: [
					[
						['fernando', 'endereço', 'av rio branco, 109', true],
						['joão', 'endereço', 'rua bob, 88', true],
						['paula', 'endereço', 'rua bob, 88', true],
						['fernando', 'telefone', '98888-1111', true],
						['aline', 'telefone', '91234-5555', true],
					],
					[
						['endereço', 'cardinality', 'one'],
						['telefone', 'cardinality', 'many'],
					],
				],
				out: [
					['fernando', 'endereço', 'av rio branco, 109', true],
					['joão', 'endereço', 'rua bob, 88', true],
					['paula', 'endereço', 'rua bob, 88', true],
					['fernando', 'telefone', '98888-1111', true],
					['aline', 'telefone', '91234-5555', true],
				],
			},
		]

		for (const [index, obj] of input.entries()) {
			const [facts, schema] = obj.in
			assert.deepEqual(
				getCurrentFacts(facts, schema),
				obj.out,
				`Failure on test ${index + 1}`
			)
		}
	})

	test('Removed facts must not be returned', function() {
		const input = [
			[
				[
					['raul', 'endereço', 'av rio branco, 109', true],
					['raul', 'endereço', 'av rio branco, 109', false],
					['gabriela', 'endereço', 'rua alice, 10', true],
					['gabriela', 'endereço', 'rua alice, 10', false],
					['paula', 'endereço', 'rua bob, 88', true],
					['paula', 'endereço', 'rua bob, 88', false],
					['mariane', 'telefone', '234-5678', true],
					['mariane', 'telefone', '234-5678', false],
					['aline', 'telefone', '91234-5555', true],
					['aline', 'telefone', '91234-5555', false],
					['fernando', 'faculdade', 'PUC', true],
					['fernando', 'faculdade', 'PUC', false],
					['isabella', 'telefone', '56789-1010', true],
					['isabella', 'telefone', '56789-1010', false],
				],
				[
					['endereço', 'cardinality', 'one'],
					['faculdade', 'cardinality', 'one'],
					['telefone', 'cardinality', 'many'],
				],
			],
			[
				[
					['fernando', 'endereço', 'av rio branco, 109', true],
					['fernando', 'endereço', 'av rio branco, 109', false],
					['joão', 'telefone', '234-5678', true],
					['joão', 'telefone', '234-5678', false],
				],
				[
					['endereço', 'cardinality', 'one'],
					['telefone', 'cardinality', 'many'],
				],
			],
			[
				[
					['fernando', 'endereço', 'av rio branco, 109', true],
					['joão', 'endereço', 'rua alice, 10', true],
					['fernando', 'endereço', 'av rio branco, 109', false],
					['joão', 'endereço', 'rua alice, 10', false],
					['joão', 'telefone', '234-5678', true],
					['joão', 'endereço', 'rua bob, 88', false],
					['joão', 'telefone', '91234-5555', true],
					['joão', 'telefone', '234-5678', false],
					['fernando', 'telefone', '98888-1111', true],
					['joão', 'telefone', '91234-5555', false],
					['fernando', 'telefone', '56789-1010', true],
					['fernando', 'telefone', '98888-1111', false],
					['fernando', 'telefone', '56789-1010', false],
				],
				[
					['endereço', 'cardinality', 'one'],
					['telefone', 'cardinality', 'many'],
				],
			],
		]

		for (const [facts, schema] of input) {
			assert.deepEqual(getCurrentFacts(facts, schema), [])
		}
	})

	test('Multiple facts of cardinality one must return only the latest fact', function() {
		const input = [
			{
				in: [
					[
						['raul', 'endereço', 'av rio branco, 109', true],
						['raul', 'endereço', 'rua alice, 10', true],
						['raul', 'endereço', 'rua bob, 88', true],
					],
					[
						['endereço', 'cardinality', 'one'],
						['faculdade', 'cardinality', 'one'],
						['telefone', 'cardinality', 'many'],
					],
				],
				out: [['raul', 'endereço', 'rua bob, 88', true]],
			},
			{
				in: [
					[
						['fernando', 'endereço', 'av rio branco, 109', true],
						['fernando', 'endereço', 'rua bob, 88', true],
					],
					[['endereço', 'cardinality', 'one']],
				],
				out: [['fernando', 'endereço', 'rua bob, 88', true]],
			},
			{
				in: [
					[
						['isabella', 'curso', 'CM', true],
						['isabella', 'curso', 'Engenharia Mecatrônica', true],
					],
					[['curso', 'cardinality', 'one']],
				],
				out: [['isabella', 'curso', 'Engenharia Mecatrônica', true]],
			},
			{
				in: [
					[
						['fernando', 'faculdade', 'USP', true],
						['fernando', 'faculdade', 'PUC', true],
						['fernando', 'endereço', 'av rio branco, 109', true],
						['fernando', 'endereço', 'rua bob, 88', true],
					],
					[
						['endereço', 'cardinality', 'one'],
						['faculdade', 'cardinality', 'one'],
					],
				],
				out: [
					['fernando', 'faculdade', 'PUC', true],
					['fernando', 'endereço', 'rua bob, 88', true],
				],
			},
		]

		for (const [index, obj] of input.entries()) {
			const [facts, schema] = obj.in
			assert.deepEqual(
				getCurrentFacts(facts, schema),
				obj.out,
				`Failure at test ${index + 1}`
			)
		}
	})

	test('Repeated facts must be returned only once', function() {
		const input = [
			{
				in: [
					[
						['raul', 'endereço', 'av rio branco, 109', true],
						['raul', 'endereço', 'rua bob, 88', true],
						['raul', 'endereço', 'rua bob, 88', true],
					],
					[
						['endereço', 'cardinality', 'one'],
						['faculdade', 'cardinality', 'one'],
						['telefone', 'cardinality', 'many'],
					],
				],
				out: [['raul', 'endereço', 'rua bob, 88', true]],
			},
			{
				in: [
					[
						['fernando', 'endereço', 'av rio branco, 109', true],
						['fernando', 'endereço', 'av rio branco, 109', true],
					],
					[['endereço', 'cardinality', 'one']],
				],
				out: [['fernando', 'endereço', 'av rio branco, 109', true]],
			},
			{
				in: [
					[
						['isabella', 'curso', 'Engenharia Mecatrônica', true],
						['isabella', 'curso', 'Engenharia Mecatrônica', true],
					],
					[['curso', 'cardinality', 'one']],
				],
				out: [['isabella', 'curso', 'Engenharia Mecatrônica', true]],
			},
			{
				in: [
					[
						['fernando', 'faculdade', 'PUC', true],
						['fernando', 'faculdade', 'PUC', true],
						['fernando', 'endereço', 'rua bob, 88', true],
						['fernando', 'endereço', 'rua bob, 88', true],
					],
					[
						['endereço', 'cardinality', 'one'],
						['faculdade', 'cardinality', 'one'],
					],
				],
				out: [
					['fernando', 'faculdade', 'PUC', true],
					['fernando', 'endereço', 'rua bob, 88', true],
				],
			},
			{
				in: [
					[
						['fernando', 'endereço', 'av rio branco, 109', true],
						['joão', 'endereço', 'rua alice, 10', true],
						['joão', 'endereço', 'rua bob, 88', true],
						['joão', 'telefone', '234-5678', true],
						['joão', 'telefone', '234-5678', true],
						['joão', 'telefone', '91234-5555', true],
						['joão', 'telefone', '91234-5555', true],
						['joão', 'telefone', '234-5678', false],
						['fernando', 'telefone', '98888-1111', true],
						['fernando', 'telefone', '56789-1010', true],
						['fernando', 'telefone', '56789-1010', true],
					],
					[
						['endereço', 'cardinality', 'one'],
						['telefone', 'cardinality', 'many'],
					],
				],
				out: [
					['fernando', 'endereço', 'av rio branco, 109', true],
					['joão', 'endereço', 'rua bob, 88', true],
					['joão', 'telefone', '91234-5555', true],
					['fernando', 'telefone', '98888-1111', true],
					['fernando', 'telefone', '56789-1010', true],
				],
			},
		]

		for (const [index, obj] of input.entries()) {
			const [facts, schema] = obj.in
			assert.deepEqual(
				getCurrentFacts(facts, schema),
				obj.out,
				`Failure at test ${index + 1}`
			)
		}
	})

	test('Attributes not specified in the schema must be ignored', function() {
		const input = [
			{
				in: [
					[
						['fernando', 'endereço', 'av rio branco, 109', true],
						['fernando', 'faculdade', 'FAAP', true],
						['fernando', 'telefone', '95210-4287', true],
						['fernando', 'curso', 'Artes Visuais', true],
						['fernando', 'telefone', '98888-1111', true],
						['joão', 'endereço', 'rua bob, 88', true],
						['joão', 'faculdade', 'Stanford', true],
						['joão', 'faculdade', 'MIT', true],
						['joão', 'telefone', '94039-6423', true],
						['joão', 'curso', 'Matemática Pura', true],
						['paula', 'endereço', 'rua das laranjeiras, 410', true],
						['paula', 'faculdade', 'FFLCH-USP', true],
						['paula', 'telefone', '95160-4638', true],
						['paula', 'curso', 'Letras', true],
						['aline', 'endereço', 'av. sapopemba, 501', true],
						['aline', 'faculdade', 'EPM', true],
						['aline', 'curso', 'Medicina', true],
						['aline', 'telefone', '91234-5555', true],
					],
					[
						['endereço', 'cardinality', 'one'],
						['faculdade', 'cardinality', 'one'],
						['telefone', 'cardinality', 'many'],
					],
				],
				out: [
					['fernando', 'endereço', 'av rio branco, 109', true],
					['fernando', 'faculdade', 'FAAP', true],
					['fernando', 'telefone', '95210-4287', true],
					['fernando', 'telefone', '98888-1111', true],
					['joão', 'endereço', 'rua bob, 88', true],
					['joão', 'faculdade', 'MIT', true],
					['joão', 'telefone', '94039-6423', true],
					['paula', 'endereço', 'rua das laranjeiras, 410', true],
					['paula', 'faculdade', 'FFLCH-USP', true],
					['paula', 'telefone', '95160-4638', true],
					['aline', 'endereço', 'av. sapopemba, 501', true],
					['aline', 'faculdade', 'EPM', true],
					['aline', 'telefone', '91234-5555', true],
				],
			},
			{
				in: [
					[
						['fernando', 'endereço', 'av rio branco, 109', true],
						['fernando', 'curso', 'Medicina', true],
					],
					[
						['endereço', 'cardinality', 'one'],
						['telefone', 'cardinality', 'many'],
					],
				],
				out: [['fernando', 'endereço', 'av rio branco, 109', true]],
			},
			{
				in: [
					[
						['isabella', 'curso', 'Engenharia Mecatrônica', true],
						['joão', 'endereço', 'rua bob, 88', true],
					],
					[['curso', 'cardinality', 'one']],
				],
				out: [['isabella', 'curso', 'Engenharia Mecatrônica', true]],
			},
			{
				in: [
					[
						['fernando', 'faculdade', 'PUC', true],
						['fernando', 'faculdade', 'PUC', true],
						['fernando', 'endereço', 'rua bob, 88', true],
						['fernando', 'endereço', 'rua bob, 88', true],
					],
					[
						['endereço', 'cardinality', 'one'],
						['faculdade', 'cardinality', 'one'],
					],
				],
				out: [
					['fernando', 'faculdade', 'PUC', true],
					['fernando', 'endereço', 'rua bob, 88', true],
				],
			},
			{
				in: [
					[
						['fernando', 'endereço', 'av rio branco, 109', true],
						['fernando', 'curso', 'Artes Visuais', true],
						['joão', 'endereço', 'rua alice, 10', true],
						['joão', 'endereço', 'rua bob, 88', true],
						['joão', 'telefone', '234-5678', true],
						['joão', 'telefone', '91234-5555', true],
						['joão', 'telefone', '234-5678', false],
						['joão', 'curso', 'Matemática Pura', false],
						['fernando', 'telefone', '98888-1111', true],
						['fernando', 'telefone', '56789-1010', true],
					],
					[
						['endereço', 'cardinality', 'one'],
						['telefone', 'cardinality', 'many'],
					],
				],
				out: [
					['fernando', 'endereço', 'av rio branco, 109', true],
					['joão', 'endereço', 'rua bob, 88', true],
					['joão', 'telefone', '91234-5555', true],
					['fernando', 'telefone', '98888-1111', true],
					['fernando', 'telefone', '56789-1010', true],
				],
			},
		]

		for (const [index, obj] of input.entries()) {
			const [facts, schema] = obj.in
			assert.deepEqual(
				getCurrentFacts(facts, schema),
				obj.out,
				`Failure at test ${index + 1}`
			)
		}
	})

	test('False facts with no previous true correspondent must be ignored', function() {
		const input = [
			{
				in: [
					[
						['raul', 'endereço', 'rua bob, 88', false],
						['raul', 'endereço', 'rua bob, 88', true],
					],
					[
						['endereço', 'cardinality', 'one'],
						['faculdade', 'cardinality', 'one'],
						['telefone', 'cardinality', 'many'],
					],
				],
				out: [['raul', 'endereço', 'rua bob, 88', true]],
			},
			{
				in: [
					[['fernando', 'endereço', 'av rio branco, 109', false]],
					[['endereço', 'cardinality', 'one']],
				],
				out: [],
			},
			{
				in: [
					[
						['isabella', 'curso', 'Engenharia Mecatrônica', true],
						['isabella', 'curso', 'Engenharia Mecatrônica', false],
						['isabella', 'curso', 'Engenharia Mecatrônica', false],
					],
					[['curso', 'cardinality', 'one']],
				],
				out: [],
			},
			{
				in: [
					[
						['fernando', 'endereço', 'av rio branco, 109', true],
						['fernando', 'faculdade', 'FAAP', true],
						['fernando', 'telefone', '95210-4287', true],
						['fernando', 'curso', 'Artes Visuais', false],
						['fernando', 'telefone', '98888-1111', true],
					],
					[
						['endereço', 'cardinality', 'one'],
						['faculdade', 'cardinality', 'one'],
						['telefone', 'cardinality', 'many'],
						['curso', 'cardinality', 'one'],
					],
				],
				out: [
					['fernando', 'endereço', 'av rio branco, 109', true],
					['fernando', 'faculdade', 'FAAP', true],
					['fernando', 'telefone', '95210-4287', true],
					['fernando', 'telefone', '98888-1111', true],
				],
			},
		]

		for (const [index, obj] of input.entries()) {
			const [facts, schema] = obj.in
			assert.deepEqual(
				getCurrentFacts(facts, schema),
				obj.out,
				`Failure at test ${index + 1}`
			)
		}
	})

	test('The given test must pass', function() {
		const facts = [
			['fernando', 'endereço', 'av rio branco, 109', true],
			['joão', 'endereço', 'rua alice, 10', true],
			['joão', 'endereço', 'rua bob, 88', true],
			['joão', 'telefone', '234-5678', true],
			['joão', 'telefone', '91234-5555', true],
			['joão', 'telefone', '234-5678', false],
			['fernando', 'telefone', '98888-1111', true],
			['fernando', 'telefone', '56789-1010', true],
		]
		const schema = [
			['endereço', 'cardinality', 'one'],
			['telefone', 'cardinality', 'many'],
		]

		const output = [
			['fernando', 'endereço', 'av rio branco, 109', true],
			['joão', 'endereço', 'rua bob, 88', true],
			['joão', 'telefone', '91234-5555', true],
			['fernando', 'telefone', '98888-1111', true],
			['fernando', 'telefone', '56789-1010', true],
		]

		assert.deepEqual(getCurrentFacts(facts, schema), output)
	})
})

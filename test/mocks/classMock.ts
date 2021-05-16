import { ComposableClass, Constructor } from 'composable-js';

export function classMock<T>(ref: Constructor<T>): jest.Mocked<T> {
	const composable = ComposableClass.get(ref);
	const methods = [];
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore
	let traverseProto = composable.composed._construct.prototype;
	do {
		methods.push(
			...Object.getOwnPropertyNames(traverseProto).map((x) => ({
				key: x,
				descriptor: Object.getOwnPropertyDescriptor(traverseProto, x)
			}))
		);
	} while (
		(traverseProto =
			Object.getPrototypeOf(traverseProto) &&
			traverseProto !== composable.base.prototype)
	);
	const mocked = methods
		.filter(
			({ key, descriptor }) =>
				typeof descriptor.value === 'function' && key !== 'constructor'
		)
		.reduce((mockObj, { key }) => {
			mockObj[key] = jest.fn();
			return mockObj;
		}, {} as jest.Mocked<T>);
	return mocked;
}

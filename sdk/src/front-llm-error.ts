export class FrontLLMError extends Error {
	public readonly name = 'FrontLLMError';

	public constructor(
		public readonly code: number,
		public readonly message: string
	) {
		super(message);
	}
}

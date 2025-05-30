export interface FrontLLMConfiguration {
	/**
	 * Timeout in milliseconds for requests to the gateway.
	 */
	timeout?: number;

	/**
	 * Optional base URL for the FrontLLM API.
	 * If not provided, defaults to 'https://gateway.frontllm.com'.
	 */
	baseUrl?: string;

	/**
	 * Optional headers to include in the request.
	 */
	headers?: Record<string, string>;
}

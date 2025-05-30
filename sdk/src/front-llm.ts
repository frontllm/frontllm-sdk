import { FrontLLMConfiguration } from './front-llm-configuration';
import { FrontLLMError } from './front-llm-error';
import { StreamingChatCompletionResponse } from './streaming-chat-completion-response';
import {
	CreateNonStreamingChatCompletionRequest,
	CreateNonStreamingChatCompletionResponse,
	CreateStreamingChatCompletionRequest,
	FrontLLMClientOptions
} from './types';

const BASE_URL = 'https://gateway.frontllm.com';

export class FrontLLM {
	public constructor(
		private readonly gatewayId: string,
		private readonly configuration: FrontLLMConfiguration
	) {}

	public async complete(
		request: string | CreateNonStreamingChatCompletionRequest,
		options?: FrontLLMClientOptions
	): Promise<CreateNonStreamingChatCompletionResponse> {
		if (typeof request === 'string') {
			request = { messages: [{ role: 'user', content: request }], stream: false };
		}
		const url = this.getBaseUrl() + '/v1/chat/completions';
		const response = await this.createCompletion(url, request, options);
		return (await response.json()) as CreateNonStreamingChatCompletionResponse;
	}

	public async completeStreaming(
		request: string | CreateStreamingChatCompletionRequest,
		options?: FrontLLMClientOptions
	): Promise<StreamingChatCompletionResponse> {
		if (typeof request === 'string') {
			request = { messages: [{ role: 'user', content: request }], stream: true };
		}
		const url = this.getBaseUrl() + '/v1/chat/completions';
		const response = await this.createCompletion(url, request, options);
		return new StreamingChatCompletionResponse(response, options?.abortSignal);
	}

	private getBaseUrl(): string {
		return (this.configuration.baseUrl ?? BASE_URL) + `/api/gateways/${this.gatewayId}`;
	}

	private async createCompletion(url: string, payload: unknown, options: FrontLLMClientOptions | undefined) {
		const headers: Record<string, string> = {
			'Content-Type': 'application/json'
		};
		const init: RequestInit = {
			method: 'POST',
			mode: 'cors',
			headers,
			body: JSON.stringify(payload)
		};
		const timeout = options?.timeout ?? this.configuration.timeout;
		if (timeout !== undefined) {
			init.signal = AbortSignal.timeout(timeout);
		}
		if (options?.abortSignal) {
			init.signal = options.abortSignal;
		}
		if (this.configuration.headers) {
			Object.assign(headers, this.configuration.headers);
		}
		let response: Response;
		try {
			response = await fetch(url, init);
		} catch (e) {
			const error = (e as Error)?.message ?? String(e);
			throw new FrontLLMError(-1, error);
		}
		if (!response.ok) {
			let errorJson: { error?: string } | null = null;
			try {
				errorJson = await response.json();
			} catch {
				// Ignore
			}
			const error = errorJson?.error || `Server responded with status ${response.status}`;
			throw new FrontLLMError(response.status, error);
		}
		return response;
	}
}

export function frontLLM(gatewayId: string, configuration?: FrontLLMConfiguration) {
	return new FrontLLM(gatewayId, configuration ?? {});
}

export interface FrontLLMClientOptions {
	timeout?: number;
	abortSignal?: AbortSignal;
}

export interface CreateBaseChatCompletionRequest {
	messages: {
		role: 'user' | 'assistant' | 'system';
		content: string;
		name?: string;
	}[];
	model?: string;
	temperature?: number;
	maxTokens?: number;
}

export interface CreateNonStreamingChatCompletionRequest extends CreateBaseChatCompletionRequest {
	stream?: false;
}

export interface CreateStreamingChatCompletionRequest extends CreateBaseChatCompletionRequest {
	stream: true;
}

export interface CreateNonStreamingChatCompletionResponse {
	id: string;
	choices: Array<{
		finish_reason: string;
		index: number;
		message: {
			role: 'assistant';
			content: string;
		};
	}>;
	created: number;
	model: string;
	object: string;
	usage: {
		completion_tokens: number;
		prompt_tokens: number;
		total_tokens: number;
	};
}

export interface CreateStreamingChatCompletionChunk {
	id: string;
	choices: Array<{
		delta: {
			role?: 'assistant';
			content?: string;
		};
		finish_reason?: string | null;
		index: number;
	}>;
	created: number;
	model: string;
	object: string;
	usage?: {
		completion_tokens: number;
		prompt_tokens: number;
		total_tokens: number;
	};
}

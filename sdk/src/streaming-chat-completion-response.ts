import { FrontLLMError } from './front-llm-error';
import { CreateStreamingChatCompletionChunk } from './types';

export class StreamingChatCompletionResponse {
	private readonly reader: ReadableStreamDefaultReader<Uint8Array>;
	private readonly decoder: TextDecoder;
	private isFinished = false;

	public constructor(
		private readonly response: Response,
		private readonly abortSignal: AbortSignal | undefined
	) {
		if (!this.response.body) {
			throw new FrontLLMError(-1, 'Response body is not readable');
		}
		this.reader = this.response.body.getReader();
		this.decoder = new TextDecoder('utf-8');
	}

	public async read(): Promise<{
		finished: boolean;
		chunks: CreateStreamingChatCompletionChunk[];
	}> {
		if (this.isFinished) {
			return { finished: true, chunks: [] };
		}
		if (this.abortSignal?.aborted) {
			throw new FrontLLMError(-1, 'Operation aborted');
		}

		const { done, value } = await this.reader.read();
		if (done) {
			this.isFinished = true;
			return {
				finished: true,
				chunks: []
			};
		}

		const lines = this.decoder.decode(value, { stream: true }).split('\n');
		const chunks: CreateStreamingChatCompletionChunk[] = [];
		for (const line of lines) {
			const trimmedRow = line.trim();
			if (trimmedRow.length === 0) {
				continue;
			}
			if (line.startsWith('data: ')) {
				const data = line.slice(6);
				if (data === '[DONE]') {
					this.isFinished = true;
					return {
						finished: true,
						chunks: []
					};
				}
				const json = JSON.parse(data) as { error: string | { message: string } } | CreateStreamingChatCompletionChunk;
				if ('error' in json) {
					this.isFinished = true;
					throw new FrontLLMError(-2, typeof json.error === 'string' ? json.error : json.error.message || 'Unknown error');
				}
				if ('choices' in json && json.object === 'chat.completion.chunk') {
					chunks.push(json);
				}
				// We don't throw an error here if the JSON is not as expected, because different providers
				// may send non standard JSON data, for example Anthropic sends { type: "ping" }.
			}
		}

		return {
			finished: false,
			chunks
		};
	}
}

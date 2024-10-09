import { OpenAI } from 'openai';
import { LLMProvider, LLMResponse } from './LLMProvider'; // Move shared types to a separate file
import { ChatRequest } from 'ollama';
import { ChatCompletionMessageParam } from 'openai/resources/index.mjs';

class OpenAILLM implements LLMProvider {
	private openai: OpenAI;

	constructor() {
		this.openai = new OpenAI({
			apiKey: process.env.OPENAI_API_KEY,
		});
	}
    
    async call_tools(params: any): Promise<LLMResponse> {
        // Implement tool calling logic here
        return {
            choices: [
                {
                    message: {
                        content: "Tool call response"
                    }
                }
            ]
        };
    }

	async call(params: ChatRequest): Promise<LLMResponse> {
		const completion = await this.openai.chat.completions.create({
			model: "gpt-4o", // Example model
			messages: params.messages as ChatCompletionMessageParam[]
		});

		// Process and return the response
		return {
			choices: [
                {
                    message: {
                        content: completion.choices[0].message.content || "",
                    }
                }
            ]
		};
	}
}

export default OpenAILLM;
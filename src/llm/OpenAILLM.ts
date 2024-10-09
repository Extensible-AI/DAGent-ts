import { OpenAI } from 'openai';
import { LLMProvider, LLMResponse, LLMParams, Tool, ToolSchemaZod } from '../types/LLMInterfaces'; // Move shared types to a separate file
import { ChatCompletionMessageParam } from 'openai/resources/index.mjs';
import { zodResponseFormat } from 'openai/helpers/zod';

class OpenAILLM implements LLMProvider {
	private openai: OpenAI;
    private model: string;

	constructor(model: string, apiKey?: string) {
		this.openai = new OpenAI({
			apiKey: apiKey || process.env.OPENAI_API_KEY,
		});
        this.model = model;
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

	async call(params: LLMParams): Promise<LLMResponse> {
		const completion = await this.openai.chat.completions.create({
			model: this.model,
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
    
    async generateToolDescription(functionDesc: string, apiBase: string = ''): Promise<Tool> {
        console.log('Function description:', functionDesc);
        const completion = await this.openai.beta.chat.completions.parse({
            model: this.model,
            messages: [
                {
                    role: "system",
                    content: "You are a helpful assistant that generates tool descriptions for a given function description."
                },
                {
                    role: "user",
                    content: functionDesc,
                },
            ],
            response_format: zodResponseFormat(ToolSchemaZod, 'tool_schema_zod')
        });
        console.log('Tool description:', completion.choices[0].message.content);
        const extractedTool: Tool = completion.choices[0].message.parsed as Tool;
        return extractedTool;
    }
}

export default OpenAILLM;
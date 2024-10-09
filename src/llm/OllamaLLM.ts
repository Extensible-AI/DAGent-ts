import ollama, { ChatRequest } from 'ollama'
import { LLMProvider, LLMResponse } from './LLMProvider'

class OllamaLLM implements LLMProvider {
    async call_tools(params: ChatRequest): Promise<LLMResponse> {
        const response = await ollama.chat({
            model: params.model,
            messages: params.messages,
            tools: params.tools,
        })
        return {
            choices: [
                {
                    message: {
                        content: response.message.content,
                        tool_calls: response.message.tool_calls,
                    },
                },
            ],
        }
    }

    async call(params: ChatRequest): Promise<LLMResponse> {
        const response = await ollama.chat({
            model: params.model,
            messages: params.messages,
        })
        return {
            choices: [
                {
                    message: {
                        content: response.message.content,
                    },
                },
            ],
        }
    }
}

export default OllamaLLM

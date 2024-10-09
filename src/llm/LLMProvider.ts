import { ChatRequest, Tool, ToolCall} from "ollama";

// src/llm/LLMProvider.ts
export interface LLMProvider {
    call(params: ChatRequest): Promise<LLMResponse>;
    call_tools(params: ChatRequest): Promise<LLMResponse>;
}

export interface LLMCallParams {
    messages: Array<{ role: string, content: string }>;
    tools?: Tool[];
}

export interface LLMResponse {
    choices: Array<{
        message: {
            content: string;
            tool_calls?: ToolCall[];
        };
    }>;
}


/* Tool Definition from Ollama 
interface Tool {
    type: string;
    function: {
        name: string;
        description: string;
        parameters: {
            type: string;
            required: string[];
            properties: {
                [key: string]: {
                    type: string;
                    description: string;
                    enum?: string[];
                };
            };
        };
    };
}
*/
import ollama from 'ollama'
import { LLMProvider, LLMResponse, LLMParams, Tool } from '../types/LLMInterfaces'

class OllamaLLM implements LLMProvider {
    private model: string;

    constructor(model: string) {
        this.model = model;
    }

    async call_tools(params: LLMParams): Promise<LLMResponse> {
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

    async call(params: LLMParams): Promise<LLMResponse> {
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
    
    async generateToolDescription(functionDesc: string, apiBase?: string): Promise<Tool> {
        const example = {
            "type": "function",
            "function": {
                "name": "get_calendar_events",
                "description": "Get calendar events within a specified time range",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "start_time": {
                            "type": "string",
                            "description": "The start time for the event search, in ISO format",
                        },
                        "end_time": {
                            "type": "string",
                            "description": "The end time for the event search, in ISO format",
                        },
                    },
                    "required": ["start_time", "end_time"],
                },
            }
        };
        const messages = [{
            "role": "user", 
            "content": `Create a json for the attached function: ${functionDesc} using the following pattern for the json: ${JSON.stringify(example)}. Don't add anything extra. Make sure everything follows a valid json format`
        }];
        console.log('functionDesc: ', functionDesc);
        const response = await ollama.chat({
            model: this.model,
            messages: messages,
            format: 'json',
        });
        console.log('response: ', response);
        const toolDescription: Tool = JSON.parse(response.message.content);
        return toolDescription;
    }
}

export default OllamaLLM

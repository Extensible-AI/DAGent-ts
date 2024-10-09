import { z } from 'zod';

// Ollama import to build translation layer
export interface Options {
    numa: boolean
    num_ctx: number
    num_batch: number
    num_gpu: number
    main_gpu: number
    low_vram: boolean
    f16_kv: boolean
    logits_all: boolean
    vocab_only: boolean
    use_mmap: boolean
    use_mlock: boolean
    embedding_only: boolean
    num_thread: number
  
    // Runtime options
    num_keep: number
    seed: number
    num_predict: number
    top_k: number
    top_p: number
    tfs_z: number
    typical_p: number
    repeat_last_n: number
    temperature: number
    repeat_penalty: number
    presence_penalty: number
    frequency_penalty: number
    mirostat: number
    mirostat_tau: number
    mirostat_eta: number
    penalize_newline: boolean
    stop: string[]
}

export interface Message {
    role: string
    content: string
    images?: Uint8Array[] | string[]
    tool_calls?: ToolCall[]
}

export interface ToolCall {
    function: {
        name: string;
        arguments: Record<string, any>;
    };
}
  
export interface Tool {
    type: string;
    function: {
        name: string;
        description: string;
        parameters: {
            type: string;
            required: string[];
            properties: Record<string, {
                type: string;
                description: string;
                enum?: string[];
            }>;
        };
    };
}
  
  
export const ToolSchemaZod = z.object({
    type: z.literal('function'),
    function: z.object({
        name: z.string(),
        description: z.string(),
        parameters: z.object({
            type: z.string(),
            required: z.array(z.string()),
            properties: z.record(z.object({
                type: z.string(),
                description: z.string(),
                enum: z.array(z.string()).optional()
            }))
        })
    })
});

export interface LLMParams {
    messages?: Message[]
    stream?: boolean
    format?: string
    keep_alive?: string | number
    tools?: Tool[]
  
    options?: Partial<Options>
}
  
export interface LLMProvider {
    call(params: LLMParams): Promise<LLMResponse>;
    call_tools(params: LLMParams): Promise<LLMResponse>;
    generateToolDescription(functionDesc: string, apiBase?: string): Promise<Tool>;
}
  
export interface LLMResponse {
    choices: Array<{
        message: {
            content: string;
            tool_calls?: ToolCall[];
        };
    }>;
}
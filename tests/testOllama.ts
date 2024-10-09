import OllamaLLM from '../src/llm/OllamaLLM';
import { ChatRequest } from 'ollama';

async function testOllamaLLM() {
    const ollamaLLM = new OllamaLLM();
    const params: ChatRequest = {
        model: 'llama3.2', // Adding the required model property
        messages: [
            { role: 'user', content: 'return a random supplied tool' },
        ],
        tools: [
        {
            type: 'multiply_tool',
            function: {
                name: 'multiply',
                description: 'A tool that multiplies two numbers.',
                parameters: {
                    type: 'object',
                    required: ['number1', 'number2'],
                    properties: {
                        number1: {
                            type: 'number',
                            description: 'The first number to multiply.',
                        },
                        number2: {
                            type: 'number',
                            description: 'The second number to multiply.',
                        },
                    },
                },
            },
        },
        {
            type: 'add_tool',
            function: {
                name: 'add',
                description: 'A tool that adds two numbers.',
                parameters: {
                    type: 'object',
                    required: ['number1', 'number2'],
                    properties: {
                        number1: {
                            type: 'number',
                            description: 'The first number to add.',
                        },
                        number2: {
                            type: 'number',
                            description: 'The second number to add.',
                        },
                    },
                },
            },
        },
        ], // Assuming tools is optional and can be an empty array
    };

    // Function to multiply two numbers
    function multiply(a: number, b: number): number {
        return a * b;
    }

    try {
        // const response = await ollamaLLM.call_tools(params);
        // console.log('Response from OllamaLLM:', response.choices[0].message.content);
        // console.log('Tool calls from OllamaLLM:', response.choices[0].message.tool_calls);
        const toolDesc = await ollamaLLM.generateToolDescription('llama3.2', multiply.toString());
        console.log('Tool description from OllamaLLM:', toolDesc);
    } catch (error) {
        console.error('Error calling OllamaLLM:', error);
    }
}

testOllamaLLM();

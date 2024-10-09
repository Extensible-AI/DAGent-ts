import OpenAILLM from '../src/llm/OpenAILLM';
import { ChatRequest } from 'ollama';

async function testOpenAILLM() {
    const openAILLM = new OpenAILLM();
    const params: ChatRequest = {
        model: 'gpt-4o', // Using the model specified in OpenAILLM
        messages: [
            { role: 'user', content: 'tell me how you are doing.' },
        ],
    };

    try {
        const response = await openAILLM.call(params);
        console.log('Response from OpenAILLM:', response.choices[0].message.content);
    } catch (error) {
        console.error('Error calling OpenAILLM:', error);
    }
}

testOpenAILLM();

import OpenAILLM from '../src/llm/OpenAILLM';
import { LLMParams } from '../src/types/LLMInterfaces';

async function testOpenAILLM() {
    const openAILLM = new OpenAILLM('gpt-4o');
    const params: LLMParams = {
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

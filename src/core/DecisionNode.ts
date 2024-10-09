import BaseNode from './BaseNode';
import { LLMProvider } from '../llm/LLMProvider';
import { ToolDescription } from '../types/ToolDescription';

export class DecisionNode implements BaseNode {
    private nextNodes: Map<string, BaseNode>;
    private llmProvider: LLMProvider;
    private compiled: boolean = false;
    private toolDescriptions: ToolDescription[] = [];

    constructor(llmProvider: LLMProvider) {
        this.nextNodes = new Map();
        this.llmProvider = llmProvider;
    }

    addNextNodes(nodes: BaseNode[]): void {
        nodes.forEach(node => {
            this.nextNodes.set(node.constructor.name, node);
        });
    }

    compile(forceLoad: boolean): Promise<void> {
        if (this.compiled) {
            return Promise.resolve();
        }

        // Generate tool descriptions for each next node
        this.nextNodes.forEach((node, name) => {
            const toolDescription = this.generateToolDescription(name, node);
            this.toolDescriptions.push(toolDescription);
            node.compile(forceLoad);
        });

        this.compiled = true;
        return Promise.resolve();
    }

    async run(input: any): Promise<any> {
        if (!this.compiled) {
            throw new Error('Node has not been compiled');
        }

        // Call LLM to decide which node to execute
        const decision = await this.makeDecision(input);

        // Execute the chosen node
        const chosenNode = this.nextNodes.get(decision);
        if (!chosenNode) {
            throw new Error(`No node found for decision: ${decision}`);
        }

        return chosenNode.run(input);
    }

    getNextNodes(): BaseNode[] {
        return Array.from(this.nextNodes.values());
    }

    private generateToolDescription(name: string, node: BaseNode): ToolDescription {
        // TODO: Implement tool description generation
        // This should analyze the node and create a description for the LLM
        return {
            name,
            description: `Tool description for ${name}`,
            parameters: {}
        };
    }

    private async makeDecision(input: any): Promise<string> {
        // TODO: Implement LLM call to make decision
        // This should use the LLMProvider to call the LLM and interpret the response
        const llmResponse = await this.llmProvider.call_tools({
            messages: [{ role: 'user', content: JSON.stringify(input) }],
            tools: this.toolDescriptions
        });

        // Parse LLM response to get the decision
        // This is a placeholder implementation
        return llmResponse.choices[0].message.content;
    }
}
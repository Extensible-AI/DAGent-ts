import BaseNode from './BaseNode';
import { LLMProvider, Tool } from '../types/LLMInterfaces';
import * as fs from 'fs';
import * as path from 'path';
import { LLMHelpers } from '../llm/LLMHelpers';

export class DecisionNode implements BaseNode {
    private nextNodes: Map<string, BaseNode>;
    private llmProvider: LLMProvider;
    private compiled: boolean = false;
    private toolDescriptions: Tool[] = [];
    private toolJsonDir: string;
    private retryJsonCount: number;
    private apiBase: string = '';
    func: (...args: any[]) => any = () => {
        throw new Error("Tried creating tool description for decision node");
    };

    constructor(
        llmProvider: LLMProvider,
        toolJsonDir: string = 'tool_descriptions',
        retryJsonCount: number = 3
    ) {
        this.nextNodes = new Map();
        this.llmProvider = llmProvider;
        this.toolJsonDir = toolJsonDir;
        this.retryJsonCount = retryJsonCount;
    }

    addNextNodes(nodes: BaseNode[]): void {
        nodes.map(node => {
            this.nextNodes.set(node.constructor.name, node);
        });
    }

    async compile(forceLoad: boolean = false): Promise<void> {
        for (const [nodeName, nextNode] of this.nextNodes as Map<string, BaseNode>) {
            const funcName = path.join(this.toolJsonDir, `${nodeName}.json`);
            console.log(`Compiling tool description for function: ${nodeName}`);

            if (forceLoad || !fs.existsSync(funcName)) {
                console.debug(`Creating new tool description for ${nodeName}`);
                fs.mkdirSync(this.toolJsonDir, { recursive: true });
                try {
                    let currentRetryCount = 0;
                    let toolDesc: Tool | null = null;

                    // TODO: Implement retry logic
                    // while (!toolDesc && currentRetryCount < this.retryJsonCount) {
                    //     console.warn(`Retry ${currentRetryCount + 1} for creating tool description of ${nodeName}`);
                    //     toolDesc = this.llmProvider.generateToolDescription(nextNode.function);
                    //     currentRetryCount++;
                    // }
                    toolDesc = await this.llmProvider.generateToolDescription(nextNode.func.toString(), this.apiBase);

                    if (!toolDesc) {
                        const errorMsg = `Tool description for ${nodeName} could not be generated, recommend generating manually and storing under ${funcName} in ${this.toolJsonDir} directory`;
                        console.error(errorMsg);
                        throw new Error(errorMsg);
                    }

                    console.debug(`Successfully created tool description for ${nodeName}`);
                    fs.writeFileSync(funcName, JSON.stringify(toolDesc, null, 2));
                    console.log(`Saved tool description for ${nodeName} to ${funcName}`);
                } catch (e) {
                    console.error(`Error creating tool description for ${nodeName}: ${e}`);
                    throw e;
                }
            } else {
                console.log(`Loading existing tool description for ${nodeName} from ${funcName}`);
                const toolDesc = JSON.parse(fs.readFileSync(funcName, 'utf-8'));
                this.toolDescriptions.push(toolDesc);
            }

            await nextNode.compile(forceLoad);
        }
        this.compiled = true;
        console.log("Compilation process completed successfully for DecisionNode");
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

    private async makeDecision(input: any): Promise<string> {
        // TODO: Implement LLM call to make decision
        // This should use the LLMProvider to call the LLM and interpret the response
        const llmResponse = await this.llmProvider.call_tools({
            messages: [{ role: 'user', content: JSON.stringify(input) }],
            tools: this.toolDescriptions,
            model: this.model
        });

        // Parse LLM response to get the decision
        // This is a placeholder implementation
        return llmResponse.choices[0].message.content;
    }
}
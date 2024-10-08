import BaseNode from "./BaseNode";

class DecisionNode implements BaseNode {
    private nextNodes: Map<string, BaseNode>;
    private compiled: boolean = false;

    constructor() {
        this.nextNodes = new Map<string, BaseNode>();
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

        this.compiled = true;
        return Promise.resolve();
    }

    execute(context: any): Promise<any> {
        return Promise.resolve();
    }
}

export default DecisionNode;
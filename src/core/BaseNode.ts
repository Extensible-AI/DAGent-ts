interface BaseNode {
    run(context: any): Promise<any>;
    compile(forceLoad: boolean): Promise<void>;
}

export default BaseNode;
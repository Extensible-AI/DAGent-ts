interface BaseNode {
    run(context: any): Promise<any>;
    compile(forceLoad: boolean): Promise<void>;
    func: (...args: any[]) => any;
}

export default BaseNode;
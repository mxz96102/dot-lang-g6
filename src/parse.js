import dot from "graphlib-dot";

export default function parse2g6(str) {
    let graph;
    let nodes = [], edges = [];

    // read string to graph object
    try {
        graph = dot.read(str)
    } catch (err) {
        console.error('[Error] While read string: ', err.message);
        return undefined;
    }

    // read node without subgraph
    graph
    .nodes()
    .filter(node => !graph.children(node).length )
    .map(node => nodes.push({id: node, ...graph.node(node)}))

    // read edge
    graph
    .edges()
    .map(({v: source, w: target}) => edges.push({source, target, ...graph.edge(source, target)}))

    return {nodes, edges}
}
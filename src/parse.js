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

    const subG = {};
    graph
      .nodes()
      .filter(node => graph.children(node).length)
      .map(e => graph.children(e).map(c => {subG[c] = e})  );

    // read edge
    graph
    .edges()
    .map(({v: source, w: target}) => edges.push({source, target, ...graph.edge(source, target)}))

    // find the 0 in node
    const ninnodes = graph.nodes().filter(node => !graph.children(node).length).filter(n => !graph.inEdges(n).length);
    const isUse = {};
    let resultNodes = [];
    let startX = 0, startY = 0;

    ninnodes.map(ninnode => {
        const arr =[{n:ninnode, level: 0}], res = [];
        const wgap = 50, width = 100, hgap = 50, height = 40;
        let max = 1;

        while (arr.length) {
            let n = arr.shift();

            if (res[n.level] instanceof Array) {
                res[n.level].push(n)
                max = Math.max(res[n.level].length, max);
            } else {
                res[n.level] = [n];
            }

            if(graph.outEdges(n.n)) graph.outEdges(n.n).map(({w}) => {if(!isUse[w]) {arr.push({n:w, level: n.level + 1}); isUse[w] = true}})
        }

        let newNodes = [];

        res.map((nodes, i) => {
            let len = nodes.length;
            let point = {x: startX, y: startY};
            point.x = point.x + len * (width + wgap) / 2;
            point.y = point.y + i * (height + hgap);

            nodes.map((node) => {
                let gr = subG[node.n] ? {parent: subG[node.n]} : {};

                newNodes.push({
                    ...point,
                    label: node.n,
                    id: node.n,
                    ...graph.node(node.n),
                    ...gr
                });
                point.x -= width + wgap;
            })
        });

        resultNodes = resultNodes.concat(newNodes);
        startX -= (max) * (wgap + width);
        console.log('sx', startX)
    });

    const groups = graph
      .nodes()
      .filter(node => graph.children(node).length )
      .map(g => ({
          id: g,
          shape: 'rect',
          index: 1,
          label: g
      }))

    return {nodes: resultNodes, edges, groups}
}
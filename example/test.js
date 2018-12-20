import p2g6 from '../src/parse';
import G6 from '@antv/g6';
import '@antv/g6/build/plugin.layout.dagre';
import '@antv/g6/build/plugin.behaviour.analysis';

G6.registerNode('rect', {
    getPath: function getPath(item) {
      var width = 100; 
      var height = 40; 
      return G6.Util.getRectPath(-width / 2, -height / 2, width, height, 10);
    }
  });
  
  var graph = new G6.Graph({
    container: 'root',
    fitView: 'autoZoom',
    height: window.innerHeight/2, 
    plugins: [new G6.Plugins['layout.dagre']()],
    defaultIntersectBox: 'rect', 
    modes: {
        default: ['panCanvas', 'wheelZoom']
      }
  });
  
  graph.node({
    shape: 'rect',
    label: function label(model) {
      return model.label || model.id;
    },
  
    style: {
      stroke: '#66ccff',
      fill: '#99eeff',
      fillOpacity: 0.45,
      lineWidth: 2
    }
  });
  graph.edge({
    style: {
      endArrow: true
    }
  });

window.graph = graph;  

document.getElementById('draw').addEventListener('click', function () {
    let str = document.getElementById('str').value
    let data = p2g6(str);
    if(data) graph.read(data);
})
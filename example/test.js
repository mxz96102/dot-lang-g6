import p2g6 from '../src/parse';
import G6 from '@antv/g6';
import '@antv/g6/build/plugin.layout.dagre';
import '@antv/g6/build/plugin.behaviour.analysis';
import '@antv/g6/build/plugin.edge.polyline';

G6.registerNode('rect', {
    getPath: function getPath(item) {
      var width = 100; 
      var height = 40; 
      return G6.Util.getRectPath(-width / 2, -height / 2, width, height, 10);
    }
  });
  
  var graph = new G6.Graph({
    container: 'root',
    fitView: 'cc',
    height: window.innerHeight/2,
    defaultIntersectBox: 'rect',
    modes: {
        default: ['panCanvas', 'wheelZoom']
      }
  });
  
  graph.node({
    shape: 'rect',
    label: function label(model) {
      let r = model.label || model.id || '';
      return r.split(',').join('\n');
    },
  
    style: (e) => ({
      stroke: '#66ccff',
      fill: e.color,
      fillOpacity: 0.45,
      lineWidth: 2
    })
  });
  graph.edge({
    style: {
      endArrow: true
    },
    shape: 'polyline',
  });

window.graph = graph;  

document.getElementById('draw').addEventListener('click', function () {
    let str = document.getElementById('str').value;
    let data = p2g6(str);

    if(data) {
      G6.registerGroup('custom', {
        draw(item) {
          const group = item.getGraphicGroup();
          const childrenBox = item.getChildrenBBox();
          group.addShape('text', {
            attrs: {
              x: childrenBox.x,
              y: childrenBox.y,
              text: '这是一个群组',
              fill: 'red'
            }
          });
          return group.addShape('rect', {
            attrs: {
              ...childrenBox,
              stroke: 'red'
            }
          });
        }
      });

      graph.read(data);
    }
});
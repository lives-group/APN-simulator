import {APNRunner, APN, Snapshot, Transition} from './APNRunner.js';
import {NameManager} from './nameMng.js';
import {APNVisitor,StringVisitor} from './APNVisitor.js';
import {APNTester} from "./testers/APNTester.js"
import {RunnerTester} from "./testers/RunnerTester.js"


let apn = new APN();
let source = null;
let target = null;
let selEdge = null;
let counter = 0;
let ecounter = 0;
let str = new StringVisitor();


const test = document.getElementById('btTest');
const debug = document.getElementById('btDebug');
const clear = document.getElementById('btClear');
const print = document.getElementById('btPrint');
const dialog = document.getElementById("EdgeEdit");

/*
document.getElementById("btAutoTest").addEventListener('click',()=>{
  let apnT = new APNTester();
  let runnerT = new RunnerTester();
  apnT.test();
  runnerT.tests();
});


print.addEventListener('click',()=>{
    str.reset();
    apn.accept(str);
    txtF.value = str.getStr();
});

dialog.addEventListener("close", ()=>{
    source = selEdge.source().id();
    target = selEdge.target().id();
    const char = document.getElementById('char').value;
    const pop = document.getElementById('pop').value;
    const push = document.getElementById('push').value;
    let edgeLb = selEdge.data('label') + '\n'+  char + ', ' + pop + ', ' + push;
    console.log('Context tap edge from ' + edgeLb);
    if(selEdge != null){
        selEdge.data('label',edgeLb);
        let ido = Number(source);
        let idt = Number(target);
        let t = new Transition(char,pop,push,idt);
        apn.addTransition(ido,t);
    }
} );
*/

let cy = cytoscape({
  container: document.getElementById('automata'), // container to render in
  style: [
          { selector: 'node',
            style: {'content': 'data(name)', 'background-color': '#666'}
          },
          {
            selector: 'node.source-node', // Selected start node of an edge.
            style: { 'background-color': '#ff0000'}
          },

          { selector: 'edge',
            style: {
                 label: 'data(label)',
                'text-wrap': 'wrap',
                'curve-style': 'bezier',
                'target-arrow-shape': 'triangle',
                'line-color': '#ccc',
                'target-arrow-color': '#ccc',
                "edge-text-rotation": "autorotate"
            }
          }
        ]
});

cy.on('tap',function (e){
   if(e.target === cy){
      cy.add({group:'nodes',
              data: {id : '' + counter, name : 'q'+counter},
              position:  { x:  e.position.x,  y:  e.position.y}});
      apn.addState(counter);
      counter++;
   }
});
cy.on('tap','node',function (e){
   if(source === null){
      source = e.target;
      source.addClass('source-node');
   }else if(source === e.target){
      source.removeClass('source-node');
      source =null;
   }else if(!edgeExists(cy,source.id(),e.target.id())){
      cy.add({data: {id : 'edg' + ecounter,
                     label: ',,',
                     source: source.id(),
                     target: e.target.id()}
              });
      let ido = Number(source.id());
      let idt = Number(e.target.id());
      let t = new Transition('','','',idt);
      apn.addTransition(ido,t);
      source.removeClass('source-node');
      source =null;
      ecounter++;
   }
});
cy.on('cxttap','edge',function (e) {
    document.getElementById('char').value='';
    document.getElementById('pop').value='';
    document.getElementById('push').value='';
    selEdge = e.target;
    dialog.showModal();
});

function edgeExists(cy, sourceId, targetId) {
  // Use selector to find edges matching source and target
  const existingEdges = cy.edges(`[source = '${sourceId}'][target = '${targetId}']`);
  return existingEdges.length > 0;
}
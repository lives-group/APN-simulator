import {APNRunner, APN, Snapshot, Transition} from './APNRunner.js';
import {NameManager} from './nameMng.js';
import {APNVisitor,StringVisitor} from './APNVisitor.js';
import {APNTester} from "./APNTester.js"


let apn = new APN();
let source = null;
let target = null;
let selEdge = null;
let counter = 0;
let ecounter = 0;

let tester = new APNTester();

document.getElementById("btAutoTest").addEventListener('click',()=>{
  tester.test();
});

// apn.addState(0);
// apn.addState(1);
// apn.setInitial(0);
// apn.addTransition(0, new Transition('0','','Z',1) );
// apn.addTransition(0, new Transition('1','','U',1) );
// apn.addTransition(1, new Transition('1','Z','',1) );
// apn.addTransition(1, new Transition('1','U','UU',1) );
// apn.addTransition(1, new Transition('0','Z','ZZ',1) );
// apn.addTransition(1, new Transition('0','U','',1) );
// apn.addTransition(1, new Transition('','','',0) );
//
// //apn.removeTransition(0,new Transition('a','X','',1) );
// apn.setFinal(0);
// apn.unsetFinal(3);
 let str = new StringVisitor();
// apn.remodel(str);

// console.log(str.getStr());
// console.log(apn.delta(1,'1',''));


// let apnr = new APNRunner(apn,"01101");

const test = document.getElementById('btTest');
const debug = document.getElementById('btDebug');
const clear = document.getElementById('btClear');
const print = document.getElementById('btPrint');

const dialog = document.getElementById("EdgeEdit");




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
cy.on('tap',handleTap);
cy.on('tap','node',nodeTap);
cy.on('cxttap','edge',edgeCtxTap);
print.addEventListener('click',handlePrint)
dialog.addEventListener("close", closeEdgeDialog );


/*
let nmg = new NameManager();



nmg.addName("bia");
nmg.addName("bua");
nmg.addName("bea");
console.log(nmg);
nmg.removeName('bua');
nmg.addName("zuu");
console.log("Ids");
console.log(nmg.idOf("bia"));
console.log(nmg.idOf("bua"));
console.log(nmg.idOf("bea"));
console.log(nmg.idOf("zuu"));

console.log("Names");
console.log(nmg.nameOf(0));
console.log(nmg.nameOf(1));
console.log(nmg.nameOf(2));*/


let txtF = document.getElementById('out');
txtF.value = '';

//
// function stepHandler(){
//      let limit = 10000;
//      while(limit > 0 && !apnr.acceptedFS() && !apnr.exausted()){
//         apnr.step();
//         outS = apnr.lastStepString();
//         txtF.value =  txtF.value + outS;
//         limit--;
//      }
//      if(apnr.acceptedFS()){ txtF.value =  txtF.value + "  ACCEPTED BY FINAL STATE AND EMPTY STACK\n"; }
//      else{txtF.value =  txtF.value + "  REJECTED \n";}
//      if(apnr.exausted()){ txtF.value =  txtF.value + "  EXAUSTED ! \n"; }
//      txtF.value =  txtF.value + "  REMAINIG LIMIT = " + limit;
// }

function handleTap(e){
   if(e.target === cy){
      cy.add({group:'nodes',
              data: {id : '' + counter, name : 'q'+counter},
              position:  { x:  e.position.x,  y:  e.position.y}});
      apn.addState(counter);
      counter++;
   }
}

function nodeTap(e){
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
}

function edgeExists(cy, sourceId, targetId) {
  // Use selector to find edges matching source and target
  const existingEdges = cy.edges(`[source = '${sourceId}'][target = '${targetId}']`);
  return existingEdges.length > 0;
}

function edgeCtxTap(e) {
    document.getElementById('char').value='';
    document.getElementById('pop').value='';
    document.getElementById('push').value='';
    selEdge = e.target;
    dialog.showModal();
}


function handlePrint() {
  str.reset();
  apn.accept(str);
  txtF.value = str.getStr();
}

function closeEdgeDialog(){
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
}



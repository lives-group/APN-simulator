import {APNRunner} from './APN/APNRunner.js';
import { Transition } from './APN/APNRunner.js';
import { APN } from './APN/APNRunner.js';
import { Snapshot } from './APN/APNRunner.js';
import {NameManager} from './nameMng.js';
import {APNVisitor,StringVisitor} from './APN/APNVisitor.js';
import {APNTester} from "./testers/APNTester.js"
import {RunnerTester} from "./testers/RunnerTester.js"
import { LeftPanel } from './cytoscape/LeftPanel.js';

let str = new StringVisitor();
const apn = new APN();
const leftP = new LeftPanel();

const wordInput = document.getElementById("wordInput");

const layoutInput = document.getElementById("layoutInput");
const limitInput = document.getElementById("limitInput");
const accInput = document.getElementById("accInput");
const btReset = document.getElementById("btReset");
const btPrevious = document.getElementById("btPrevious");
const btStart = document.getElementById("btStart");
const btNext = document.getElementById("btNext");
const btDownload = document.getElementById("btDownload");
const btUpload = document.getElementById("btUpload");



btStart.onclick = ()=>{
  abrirPopup("transitionForm");
  //abrirPopup("nodeForm");
  apnConstructor();
  const runner = new APNRunner(apn,wordInput.value,accInput.value,limitInput.value);
};

function apnConstructor(){
  for (const [chave, valor] of leftP.getNodes()) {
    apn.addState(valor);
  }
  for (const [chave, valor] of leftP.getEdges()) {
    apn.addState(valor);
    let t = new Transition("0","z","zz",valor.target);
    apn.addTransition(valor.source,t);
  } 
}

async function abrirPopup(id) {
  const res = await fetch('/popups.html');
  const html = await res.text();

  const container = document.createElement('div');
  container.innerHTML = html;

  const popup = container.querySelector(`#${id}`);

  document.getElementById('modal-root').innerHTML = '';
  document.getElementById('modal-root').appendChild(popup);
}

/*
document.getElementById("btAutoTest").addEventListener('click',()=>{
  let apnT = new APNTester();
  let runnerT = new RunnerTester();
  apnT.test();
  runnerT.tests();
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
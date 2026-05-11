import { APNRunner } from './APN/APNRunner.js';
import { Transition } from './APN/APNRunner.js';
import { APN } from './APN/APNRunner.js';
import { Snapshot } from './APN/APNRunner.js';
import { NameManager } from './nameMng.js';
import { APNVisitor, StringVisitor } from './APN/APNVisitor.js';
import { APNTester } from "./testers/APNTester.js"
import { RunnerTester } from "./testers/RunnerTester.js"
import { LeftPanel } from './cytoscape/LeftPanel.js';
import { RightPanel } from './cytoscape/RightPanel.js';


let str = new StringVisitor();
const apn = new APN();
const runner = null;
const leftP = new LeftPanel();
const rightP = new RightPanel();

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

btUpload.addEventListener("change", (event) => {
  console.log("aqui");
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();

  reader.onload = (event) => {
    const jsonData = JSON.parse(event.target.result);
    leftP.import(jsonData);
  };

  reader.readAsText(file);
});


btDownload.onclick = () => {
  const jsonString = JSON.stringify(leftP.toObject());
  const blob = new Blob([jsonString], { type: "application/json" });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "APN.json";

  document.body.appendChild(link);
  link.click();

  URL.revokeObjectURL(url);
};

btStart.onclick = () => {
  apnConstructor();
  runner = new APNRunner(apn,wordInput.value,accInput.value,limitInput.value);
};

btNext.onclick = () =>{
  if(runner == null) return;
  runner.step();
};

function apnConstructor() {
  apn = new APN();
  const obj = leftP.toObject();

  for (const node of obj.nodes) {
    apn.addState(node.id);
  }

  for (const edge of obj.edges) {
    let arr = edge.label.split(/[,/]/);
    let t = new Transition(arr[0], arr[1], arr[2], edge.target);
    apn.addTransition(edge.source, t);
  }
}


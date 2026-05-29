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

let debugMode = false;
let str = new StringVisitor();
let apn = new APN();
let runner = null;
const leftP = new LeftPanel();
const rightP = new RightPanel(destacar);

const wordInput = document.getElementById("wordInput");
const wordTable = document.getElementById("wordTable");

const layoutInput = document.getElementById("layoutInput");
const limitInput = document.getElementById("limitInput");
const accInput = document.getElementById("accInput");
const btReset = document.getElementById("btReset");
const btPrevious = document.getElementById("btPrevious");
const btStart = document.getElementById("btStart");
const btNext = document.getElementById("btNext");
const btDownload = document.getElementById("btDownload");
const btUpload = document.getElementById("btUpload");

layoutInput.addEventListener("change", (e) => {
	leftP.cy.layout({ name: layoutInput.value }).run();
});

btUpload.addEventListener("change", (event) => {
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

btReset.onclick = () => {
	rightP.reset();
};

btStart.onclick = () => {
	if (debugMode) {
		btStart.innerHTML = '<i class="fa-solid fa-play"></i>';
		btStart.style.backgroundColor = "#F5F5F5";
		debugMode = false;
		wordInput.style.display = 'block';
		wordTable.style.display = 'none';

	} else {
		btStart.innerHTML = '<i class="fa-solid fa-stop"></i>';
		btStart.style.backgroundColor = "#CFCFCF";
		debugMode = true;
		wordInput.style.display = 'none';
		wordTable.style.display = 'block';
		let index = document.getElementById('wordIndex');
		let char = document.getElementById('wordChar');
		let word = wordInput.value;
		let aux;

		index.innerHTML = "<td>Indice</td>";
		char.innerHTML = "<td>Char</td>";
		for (let i = 1; i <= word.length; i++) {
			aux = document.createElement("td");
			aux.innerText = word[i - 1];
			char.appendChild(aux);
			aux = document.createElement("td");
			aux.innerText = i;
			index.appendChild(aux);
		}
		apnConstructor();
		runner = new APNRunner(apn, wordInput.value, accInput.value, Number(limitInput.value));
		index.children[runner.getLoop() + 1].style.backgroundColor = "#add8e6";
		char.children[runner.getLoop() + 1].style.backgroundColor = "#add8e6";

		graphMaker();
		rightP.foco(runner.getLoop() + 1);
		runner.start();
	}



};

btNext.onclick = () => {
	if (runner == null) return;
	runner.next();
	let index = document.getElementById('wordIndex');
	let char = document.getElementById('wordChar');
	index.children[runner.getLoop()].style.backgroundColor = "#F5F5F5";
	char.children[runner.getLoop()].style.backgroundColor = "#F5F5F5";
	index.children[runner.getLoop() + 1].style.backgroundColor = "#add8e6";
	char.children[runner.getLoop() + 1].style.backgroundColor = "#add8e6";
	rightP.foco(runner.getLoop() + 1);
};

function apnConstructor() {
	apn = new APN();
	const obj = leftP.toObject();

	for (const node of obj.nodes) {
		let id = Number(node.id);
		apn.addState(id);

		if (node.initial) {
			apn.setInitial(id);
		}
		if (node.final) {
			apn.setFinal(id);
		}
	}

	for (const edge of obj.edges) {
		let arr = edge.label.split(/[,/]/);
		let entrada = '';
		let desempilha = '';
		let empilha = '';
		if (arr[0] != 'λ') { entrada = arr[0] }
		if (arr[1] != 'λ') { desempilha = arr[1] }
		if (arr[2] != 'λ') { empilha = arr[2] }
		let t = new Transition(entrada, desempilha, empilha, Number(edge.target));
		apn.addTransition(Number(edge.source), t);
	}
}

function graphMaker() {
	const graph = runner.getGraph();

	const nodes = graph.getAllNodes();
	const edges = graph.getAllEdges();

	for (const [chave, valor] of nodes) {
		rightP.addNode(chave, valor.state, valor.pos, valor.stack.slice(-4));
	}

	for (const [chave, valor] of edges) {
		valor.forEach(element => {
			rightP.addEdge(chave, element);
		});
	}
	rightP.layout();
}

function destacar(id){
	let node = runner.getGraph().getNode(Number(id));
	empilhar(node.stack);
	leftP.foco(node.state);
}

function empilhar(array){
	let stackTable = document.getElementById("stackTable");
	stackTable.innerHTML = "<tr><td>&nbsp;</td></tr>";
	array.forEach(e =>{
		stackTable.innerHTML = "<tr><td>"+e+"</td></tr>"+stackTable.innerHTML;
	});
}
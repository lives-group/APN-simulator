import { Grafo } from "./libs/cy.js";
import { AFD } from "./src/afd.js";
import { APN } from "./src/apn.js";
/*
import {AFN} from "./src/afn.js";
import {AFNL} from "./src/afnl.js";
import {APD} from "./src/apd.js";
import {APN} from "./src/apn.js";
import {MT} from "./src/mt.js";
*/

export class Main {
  constructor() {
    this.modo = 5;
    this.dicionario = {
      1: "AFD",
      2: "AFN",
      3: "AFNL",
      4: "APD",
      5: "APN",
      6: "MT"
    };

    this.classes = { AFD, APN }
    this.cy = new Grafo();
    this.carrega_modo(this.modo);

    this.cy.cy.on('cxttap', 'node', (evt) => {
      this.automato.opcoes(evt.target.id());
    });

    document.getElementById("download").addEventListener("click", this.download.bind(this));
    document.getElementById("upload").addEventListener("change", this.le_arquivo.bind(this));

    window.inicia_automato = this.carrega_modo.bind(this);
  }

  configura_botoes() {
    document.getElementById("addEstado").onclick = this.automato.exibe_form_estado.bind(this.automato);
    document.getElementById("addTransicao").onclick = this.automato.exibe_form_transicao.bind(this.automato);

    document.getElementById("testa_palavra").onclick = this.automato.testa_palavra.bind(this.automato);
    document.getElementById("debuga_palavra").onclick = this.debuga_palavra.bind(this);

    document.getElementById("proximo").onclick = this.automato.proximo.bind(this.automato);
  }

  carrega_modo(op) {
    this.modo = op;
    document.getElementById("sigla").innerText = this.dicionario[this.modo];
    document.getElementById("titulo").innerText = this.dicionario[this.modo];
    document.getElementById("download").innerText = "Baixar " + this.dicionario[this.modo];
    document.getElementById("importar").innerText = "Importar " + this.dicionario[this.modo];
    this.automato = new this.classes[this.dicionario[op]](this.cy);
    this.configura_botoes();
  }

  download() {
    let aux = {
      estados: [...this.automato.estados],
      transicoes: [...this.automato.transicoes],
      tipo: this.automato.tipo
    };

    const jsonString = JSON.stringify(aux);

    const blob = new Blob([jsonString], { type: "application/json" });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = this.dicionario[this.modo] + ".json";

    document.body.appendChild(link);
    link.click();

    URL.revokeObjectURL(url);
  }

  le_arquivo(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = (event) => {
      const jsonData = JSON.parse(event.target.result);
      this.carrega_automato(jsonData);
    };

    reader.readAsText(file);
  }

  carrega_automato(jsonData) {
    console.log(jsonData);
    this.carrega_modo(jsonData.tipo);
    this.automato.recuperador(jsonData.estados, jsonData.transicoes);
  }

  debuga_palavra() {
    let row = document.getElementById("tabelaPalavra");
    let area = document.getElementById("debugArea");
    let palavra = document.getElementById("palavra")
    if (!this.debug) {
      palavra.readOnly = true;
      for (let i = 0; i < palavra.value.length; i++) {
        let cell = document.createElement("td");
        cell.innerText = palavra.value[i];
        cell.className = "caracter";
        row.appendChild(cell);
      }
      area.style.display = "block";
      this.debug = true;
      if (this.modo == 4 || this.modo == 5) {
        document.getElementById("pilha").style.display = "block";
      }
      this.automato.zera();
    } else if (this.debug) {
      row.innerHTML = "<td class='caracter' style='background-color:green;'>&nbsp;</td>";
      palavra.readOnly = false;
      area.style.display = "none";
      document.getElementById("pilha").style.display = "none";
      this.debug = false;
    }
  }

}

const main = new Main();
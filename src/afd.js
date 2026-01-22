import { Alerta, FormularioEstado, FormularioTransicao, FormularioOpcoes } from "../libs/formulario.js";
import { Automato, Estado, Transicao } from "../libs/automato.js";

class Momento {
    constructor() {
        this.i = 0;
        this.estado = 0;
        this.nbug = true;
    }
}

export class AFD extends Automato {
    constructor(cy) {
        super(cy);
        this.tipo = 1;
        this.nome = "AFD";
        this.momento = new Momento();

        this.formEstado = new FormularioEstado();
        this.campos_transicao();
        this.configura_opcoes();
        this.botoes_formulario();
    }

    botoes_formulario(){
        this.formEstado.adiciona.addEventListener("click", () => {
            super.adiciona_estado(this.formEstado.nome.value);
            this.formEstado.fechar();
        });
        this.formTransicao.adiciona.addEventListener("click", () => {
            super.adiciona_transicao({
                texto: this.formTransicao.texto.value,
                origem: this.formTransicao.origem.value,
                destino: this.formTransicao.destino.value,
                leitura: this.formTransicao.texto.value
            });
            this.formTransicao.fechar();
        });
    }

    configura_opcoes() {
        this.formopcoes = new FormularioOpcoes();

        this.formopcoes.final.onclick = () => {
            let i = this.formopcoes.sujeito;
            this.estados[i].torna_final();
            this.cy.no_final(i, this.estados[i].final);
            this.formopcoes.fechar();
        };

        this.formopcoes.inicial.onclick = () => {
            let i = this.formopcoes.sujeito;
            this.estados[i].torna_inicial();
            this.cy.no_inicial(i, this.estados[i].inicial);
            this.formopcoes.fechar();
        };
    }

    campos_transicao() {
        let texto = document.createElement("input");
        texto.placeholder = "leitura";
        this.formTransicao = new FormularioTransicao(texto);
    }

    exibe_form_estado() {
        document.body.appendChild(this.formEstado.div);
    }

    exibe_form_transicao() {
        document.body.appendChild(this.formTransicao.div);
    }

    testa_palavra() {
        this.estados.forEach(estado => {
            console.log(estado);
            if (estado.inicial) {
                this.inicial = estado.nome
                console.log("aqui");
            }
        });
        let final = document.getElementById("palavra").value.length;
        let resultado = true;
        this.zera();
        console.log(this.momento.estado);
        while (this.momento.i < final) {
            if (resultado) {
                resultado = this.executa_momento();
            }
            ++this.momento.i;
            console.log(this.momento.estado);
        }

        if (this.estados[this.getEstadoByNome(this.momento.estado)].final && resultado) {
            new Alerta("palavra aceita");
        } else {
            new Alerta("palavra recusada");
        }
    }

    zera() {
        this.momento.estado = this.inicial;
        this.momento.i = 0;
        this.momento.nbug = true;
    }

    executa_momento() {
        let palavra = document.getElementById("palavra");
        let passou = false;

        this.transicoes.forEach(transicao => {
            if (transicao.origem == this.momento.estado &&
                palavra.value[this.momento.i] == transicao.texto) {

                this.momento.estado = transicao.destino;
                passou = true;
            }
        });

        return passou;
    }

    opcoes(i) {
        this.formopcoes.sujeito = i;
        document.body.appendChild(this.formopcoes.div);
    }

    proximo() {
        let colunas = document.getElementById("tabelaPalavra").children;
        let final = document.getElementById("palavra").value.length;
        if (this.momento.i < final) {
            if (this.momento.nbug) {
                colunas[this.momento.i].style.backgroundColor = "white";
                this.cy.cy.getElementById(this.momento.estado).style({ 'background-color': '#0074D9' });
                this.momento.nbug = this.executa_momento();
                colunas[this.momento.i+1].style.backgroundColor = "green";
                this.cy.cy.getElementById(this.momento.estado).style({ 'background-color': 'green' });
            }
            ++this.momento.i;
        } else {
            if (this.estados[this.get_estado_by_nome(this.momento.estado)].final && this.momento.nbug) {
                new Alerta("palavra aceita");
            } else {
                new Alerta("palavra recusada");
            }
        }
    }
}


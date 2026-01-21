import { Alerta, FormularioEstado, FormularioTransicao, FormularioOpcoes } from "../libs/formulario.js";
import { Automato, Estado } from "../libs/automato.js";

class Momento {
    constructor() {
        this.pos = 0;
        this.estadoAtual = 0;
        this.pilha = [];
        this.filhos = [];
        this.erro = false;
    }

    clone() {
        let clone = new Momento();
        clone.estadoAtual = this.estadoAtual;
        clone.pilha = [...this.pilha];
        clone.erro = this.erro;
        return clone;
    }

    push_filho(instancia) {
        let repete = false;
        this.filhos.forEach(filho => {
            if (instancia.pos == filho.pos &&
                instancia.estadoAtual == filho.estadoAtual &&
                instancia.erro == filho.erro &&
                instancia.pilha.length == filho.pilha.length
            ) {
                let pilha = true;
                for (let i = 0; i < instancia.pilha.length; i++) {
                    if (instancia.pilha[0] != filho.pilha[0]) {
                        pilha = false;
                    }
                }
                if (pilha) {
                    repete = true;
                }
            }
        });
        if (!repete) {
            this.filhos.push(instancia);
        }
    }

    push_pilha(empilha) {
        if (empilha != "") {
            if (empilha.length > 1) {
                for (const char of empilha) {
                    this.pilha.push(char);
                }
            } else {
                this.pilha.push(empilha);
            }
        }
    }

    pop_pilha(desempilha) {
        if (this.pilha[this.pilha.length - 1] == desempilha || desempilha == "") {
            this.pilha.pop();
            return true;
        } else {
            return false;
        }
    }
}

export class APN extends Automato {
    constructor(cy) {
        super(cy);
        this.tipo = 5;
        this.nome = "APN";
        this.momento = new Momento();
        this.folhas = [];

        this.formEstado = new FormularioEstado();
        this.campos_transicao();
        this.configura_opcoes();
        this.botoes_formulario();
    }

    botoes_formulario() {
        this.formEstado.adiciona.onclick = () => {
            super.adiciona_estado(this.formEstado.nome.value);
            this.formEstado.fechar();
        };
        this.formTransicao.adiciona.onclick = () => {
            let leitura = this.formTransicao.texto.children[0].value;
            let Tleitura = leitura;
            if (Tleitura == "") {
                Tleitura = "λ";
            }
            let empilha = this.formTransicao.texto.children[2].value;
            let Tempilha = empilha;
            if (Tempilha == "") {
                Tempilha = "λ";
            }
            let desempilha = this.formTransicao.texto.children[4].value;
            let Tdesempilha = desempilha;
            if (Tdesempilha == "") {
                Tdesempilha = "λ";
            }
            let texto = Tleitura + "," + Tdesempilha + "/" + Tempilha;
            super.adiciona_transicao({
                texto: texto,
                origem: this.formTransicao.origem.value,
                destino: this.formTransicao.destino.value,
                leitura: leitura,
                extras: {
                    empilha: empilha,
                    desempilha: desempilha,
                }
            });
            this.formTransicao.fechar();
        };
    }

    opcoes(i) {
        this.formopcoes.sujeito = i;
        document.body.appendChild(this.formopcoes.div);
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
        let div = document.createElement("div");
        let texto = document.createElement("input");
        texto.placeholder = "leitura";
        let empilha = document.createElement("input");
        empilha.placeholder = "empilha";
        let desempilha = document.createElement("input");
        desempilha.placeholder = "desempilha";
        div.appendChild(texto);
        div.appendChild(document.createElement("br"));
        div.appendChild(empilha);
        div.appendChild(document.createElement("br"));
        div.appendChild(desempilha);
        div.appendChild(document.createElement("br"));

        this.formTransicao = new FormularioTransicao(div);
    }

    exibe_form_estado() {
        document.body.appendChild(this.formEstado.div);
    }

    exibe_form_transicao() {
        document.body.appendChild(this.formTransicao.div);
    }

    executa_momento(momento) {
        let palavra = document.getElementById("palavra").value;
        let aux;
        let erro = true;
        this.transicoes.forEach(transicao => {
            if (this.getEstadoByNome(transicao.origem) == momento.estadoAtual) {
                if (transicao.leitura == palavra[momento.pos] || transicao.leitura == "") {
                    aux = new Momento();
                    aux.erro = false;
                    aux.estadoAtual = transicao.destino;
                    aux.pilha = [...momento.pilha];
                    if (transicao.leitura != "") {
                        aux.pos = momento.pos + 1;
                    }
                    if (aux.pop_pilha(transicao.extras.desempilha)) {
                        aux.push_pilha(transicao.extras.empilha);
                        momento.push_filho(aux.clone());
                        erro = false;
                    }
                }
            }
        });
        console.log(aux);
        momento.erro = erro;
    }

    executa_passo() {
        let aux = [];
        let continua = false;
        this.folhas.forEach(folha => {
            this.executa_momento(folha);
            if (folha.filhos.length > 0) {
                folha.filhos.forEach(filho => {
                    aux.push(filho);
                });
                continua = true;
            }
        });
        this.folhas = [...aux];
        console.log(this.folhas);
        return continua;
    }

    verifica_aceitacao() {
        let palavra = document.getElementById("palavra").value;
        let aceita = false;
        this.folhas.forEach(folha => {
            if (!folha.erro && folha.pos == palavra.length - 1) {
                if (folha.pilha.length == 0 && this.estados[folha.estadoAtual].final) {
                    aceita = true;
                }
            }
        });
        return aceita;
    }

    testa_palavra() {
        this.momento = new Momento();
        this.folhas.push(this.momento);
        while (!this.executa_passo());

        if (this.verifica_aceitacao()) {
            new Alerta("palavra aceita");
        } else {
            new Alerta("palavra recusada");
        }
    }

    proximo() {
        console.log(this.instancias.length);
        let colunas = document.getElementById("tabelaPalavra").children;
        let final = document.getElementById("palavra").value.length;
        if (this.momento < final) {
            colunas[this.momento].style.backgroundColor = "white";
            this.instancias.forEach(instancia => {
                this.cy.cy.getElementById(instancia.estadoAtual).style({ 'background-color': '#0074D9' });
            });

            this.executa_momento();
            colunas[this.momento + 1].style.backgroundColor = "green";
            this.instancias.forEach(instancia => {
                this.cy.cy.getElementById(instancia.estadoAtual).style({ 'background-color': 'green' });
            });
            ++this.momento;
        } else {
            if (this.verifica_aceitacao()) {
                new Alerta("palavra aceita");
            } else {
                new Alerta("palavra recusada");
            }
        }
    }
}

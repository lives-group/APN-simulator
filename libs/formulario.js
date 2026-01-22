class Formulario{
    constructor(){
        this.x = window.innerWidth / 3;
        this.y = window.innerHeight / 3;

        this.div = document.createElement("div");
        this.div.className = "menu";
        this.div.style.position = "absolute";
        this.div.style.backgroundColor = "white";
        this.div.style.border = "1px solid black";
        this.div.style.padding = "5px";
        this.div.style.left = this.x + "px";
        this.div.style.top = this.y + "px";
        this.div.style.display = "flex";
        this.div.style.flexDirection = "column";

        this.fecha = document.createElement("button");
        this.fecha.id = "botao_fecha"
        this.fecha.onclick = ()=>{
            this.fechar();
        };
        this.div.appendChild(this.fecha);

    }
    fechar(){
        document.body.removeChild(this.div);
    }
} 

export class FormularioEstado extends Formulario {
    constructor() {
        super();
        this.nome = document.createElement("input");
        this.nome.placeholder = "nome";
        this.div.appendChild(this.nome);

        this.adiciona = document.createElement("button");
        this.adiciona.innerText = "adcionar"
        this.div.appendChild(this.adiciona);
    }

    
}

export class FormularioTransicao extends Formulario {
    constructor(texto) {
        super();
        this.origem = document.createElement("input");
        this.origem.placeholder = "origem";
        this.div.appendChild(this.origem);

        this.destino = document.createElement("input");
        this.destino.placeholder = "destino";
        this.div.appendChild(this.destino);

        this.texto = texto;
        this.div.appendChild(this.texto);

        this.adiciona = document.createElement("button");
        this.adiciona.innerText = "adcionar";
        this.div.appendChild(this.adiciona);
    }
}

export class Alerta extends Formulario{
    constructor(texto) {
        super();
        this.alerta = document.createElement("label");
        this.alerta.innerText = texto;
        this.div.appendChild(this.alerta);

        this.adiciona = document.createElement("button");
        this.adiciona.innerText = "OK"
        this.div.appendChild(this.adiciona);

        this.adiciona.addEventListener("click", () => {
            this.fechar();
        });
        document.body.appendChild(this.div);
    }
}
export class FormularioOpcoes extends Formulario{
    constructor(){
        super();
        this.final = document.createElement("button");
        this.final.innerText = "tornar final";
        this.div.appendChild(this.final);
        this.div.appendChild(document.createElement("br"));

        this.inicial = document.createElement("button");
        this.inicial.innerText = "tornar inicial";
        this.div.appendChild(this.inicial);

        this.sujeito = 0;
    }
}
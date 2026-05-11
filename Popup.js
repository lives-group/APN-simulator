class Popup{
    constructor(){
        this.main = document.createElement("div");
        this.main.classList.add('popup');
        this.main.style.display = "none";
        this.close = document.createElement("button");
        this.close.classList.add("fa-solid");
        this.close.classList.add("fa-xmark");
        this.close.onclick = () =>{this.fechar();} ;
        this.main.appendChild(this.close);
        document.body.appendChild(this.main);
    }
    fechar(){
        this.main.style.display = "none";
    }

    mostrar(){
        this.main.style.display = "inline-block";
    }
}

export class NodeMenu extends Popup{
    constructor(){
        super();
        this.rename = document.createElement("button");
        this.rename.innerText = "renomear";
        this.initial = document.createElement("button");
        this.initial.innerText = "inicial";
        this.final = document.createElement("button");
        this.final.innerText = "final";
        this.exclude = document.createElement("button");
        this.exclude.innerText = "excluir";

        this.main.appendChild(this.rename);
        this.main.appendChild(this.initial);
        this.main.appendChild(this.final);
        this.main.appendChild(this.exclude);

        this.form = document.createElement("div");
        this.newName = document.createElement("input");
        this.newName.placeholder = "novo nome"
        this.confirm = document.createElement("button");
        this.confirm.innerText = "confirmar";
        this.form.appendChild(document.createElement("br"))
        this.form.appendChild(this.newName);
        this.form.appendChild(this.confirm);
        this.form.style.display = "none";
        this.main.appendChild(this.form);

        this.rename.onclick = ()=>{this.renomear();};

        this.index = null;
    }

    fechar(){
        this.main.style.display = "none";
        this.form.style.display = "none";
    }

    mostrar(i){
        this.main.style.display = "inline-block";
        this.index = i;
    }
    renomear(){
        this.form.style.display = "block";
    }
}

export class EdgeForm extends Popup{
    constructor(){
        super();
        this.entrada = document.createElement("input");
        this.entrada.maxLength = 3;
        this.entrada.size = 5;
        this.entrada.placeholder = "entrada";

        this.desempilha = document.createElement("input");
        this.desempilha.maxLength = 3;
        this.desempilha.size = 7;
        this.desempilha.placeholder = "desempilha";

        this.empilha = document.createElement("input");
        this.empilha.maxLength = 3;
        this.empilha.size = 5;
        this.empilha.placeholder = "empilha";

        this.confirm = document.createElement("button");
        this.confirm.innerText = "confirmar";

        this.main.appendChild(this.entrada);
        this.main.appendChild(this.desempilha);
        this.main.appendChild(this.empilha);
        this.main.appendChild(this.confirm);

        this.index = null;
    }
    mostrar(i){
        this.main.style.display = "inline-block";
        this.index = i;
    }
}
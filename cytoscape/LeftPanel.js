import { NodeMenu, EdgeForm } from "../Popup.js";

export class LeftPanel {
    constructor() {
        this.counter = 0;
        this.ecounter = 0;
        this.source = null;
        this.nodeP = new NodeMenu();
        this.edgeP = new EdgeForm();
        this.startPopups();
        this.cy = cytoscape({
            container: document.getElementById('automata'), // container to render in
            zoom: 1.5,
            style: [
                {
                    selector: 'node',
                    style: {
                        label: 'data(label)',
                        'background-color': '#aaa',
                        'text-valign': 'center',
                        'text-halign': 'center',
                        'border-width': 3,
                        'border-color': '#000000',
                    }
                },
                {
                    selector: 'node.source-node', // Selected start node of an edge.
                    style: { 'background-color': '#5555ff' }
                },

                {
                    selector: 'edge',
                    style: {
                        label: 'data(label)',
                        'text-wrap': 'wrap',
                        'curve-style': 'bezier',
                        'target-arrow-shape': 'triangle',
                        'line-color': '#ccc',
                        'target-arrow-color': '#000',
                        "edge-text-rotation": "autorotate"
                    }
                }
            ]
        });

        this.cy.on('tap', (e) => {
            if (e.target === this.cy) {
                this.cy.add({
                    group: 'nodes',
                    data: {
                        id: this.counter,
                        label: 'q' + this.counter,
                        initial: false,
                        final: false
                    },
                    position: { x: e.position.x, y: e.position.y }
                });
                this.counter++;
            }
        });

        this.cy.on('tap', 'node', (e) => {
            if (this.source === null) {
                this.source = e.target;
                this.source.addClass('source-node');
            } else if (this.source === e.target) {
                this.cy.add({
                    data: {
                        id: 'edg' + this.ecounter,
                        label: 'λ,λ/λ',
                        source: this.source.id(),
                        target: this.source.id()
                    }
                });
                let ido = Number(this.source.id());
                let idt = Number(e.target.id());
                this.source.removeClass('source-node');
                this.source = null;
                this.ecounter++;
            } else {
                this.cy.add({
                    data: {
                        id: 'edg' + this.ecounter,
                        label: 'λ,λ/λ',
                        source: this.source.id(),
                        target: e.target.id()
                    }
                });
                let ido = Number(this.source.id());
                let idt = Number(e.target.id());
                this.source.removeClass('source-node');
                this.source = null;
                this.ecounter++;
            }
        });

        this.cy.on('cxttap', 'node', (e) => {
            const x = e.originalEvent.clientX;
            const y = e.originalEvent.clientY;
            this.nodeP.main.style.top = y + "px";
            this.nodeP.main.style.left = x + "px";
            this.nodeP.fechar();
            this.nodeP.mostrar(e.target.data("id"));
        });

        this.cy.on('cxttap', 'edge', (e) => {
            const x = e.originalEvent.clientX;
            const y = e.originalEvent.clientY;
            this.edgeP.main.style.top = y + "px";
            this.edgeP.main.style.left = x + "px";
            this.edgeP.fechar();
            this.edgeP.mostrar(e.target.data("id"));
        });

    }

    startPopups() {
        this.edgeP.confirm.onclick = () => {
            let entrada = 'λ';
            let desempilha = 'λ';
            let empilha = 'λ';
            if (this.edgeP.entrada.value != '') { entrada = this.edgeP.entrada.value; }
            if (this.edgeP.desempilha.value != '') { desempilha = this.edgeP.desempilha.value; }
            if (this.edgeP.empilha.value != '') { empilha = this.edgeP.empilha.value; }
            let name = entrada + "," + desempilha + "/" + empilha;
            this.cy.getElementById(this.edgeP.index).data("label", name);
            this.edgeP.fechar();
        };

        this.edgeP.exclude.onclick = () => {
            console.log(this.edgeP.index);
            this.cy.remove("#" + String(this.edgeP.index));
            this.edgeP.fechar();
        };

        this.nodeP.exclude.onclick = () => {
            this.cy.remove("#" + String(this.nodeP.index));
            this.nodeP.fechar();
        };

        this.nodeP.confirm.onclick = () => {
            this.cy.getElementById(this.nodeP.index).data("label", this.nodeP.newName.value);
            this.nodeP.fechar();
        };

        this.nodeP.initial.onclick = () => {
            if (this.cy.getElementById(this.nodeP.index).data("initial")) {
                this.cy.getElementById(this.nodeP.index).data("initial", false);
                this.cy.getElementById(this.nodeP.index).style({ 'background-image': 'none' });
            } else {
                this.cy.getElementById(this.nodeP.index).data("initial", true);
                this.cy.getElementById(this.nodeP.index).style({ 'background-image': 'url(../img/inicial.png)' });
                this.cy.getElementById(this.nodeP.index).style({ 'background-clip': ' none' });
                this.cy.getElementById(this.nodeP.index).style({ 'bounds-expansion': ' 20' });
                this.cy.getElementById(this.nodeP.index).style({
                    'background-width': '60px',
                    'background-height': '40px'
                });
            }
            this.nodeP.fechar();
        };

        this.nodeP.final.onclick = () => {
            if (this.cy.getElementById(this.nodeP.index).data("final")) {
                this.cy.getElementById(this.nodeP.index).data("final", false);
                this.cy.getElementById(this.nodeP.index).style({ 'border-style': 'solid', 'border-width': 3 });
            } else {
                this.cy.getElementById(this.nodeP.index).data("final", true);
                this.cy.getElementById(this.nodeP.index).style({ 'border-style': 'double', 'border-width': 10 });
            }
            this.nodeP.fechar();
        };
    }

    edgeExists(sourceId, targetId) {
        const existingEdges = this.cy.edges(`[source = '${sourceId}'][target = '${targetId}']`);
        return existingEdges.length > 0;
    }

    getNodes() {
        return this.cy.nodes().map(node => node.data());
    }

    getEdges() {
        return this.cy.edges().map(edge => edge.data());
    }

    toObject() {
        const obj = {
            nodes: [... this.getNodes()],
            edges: [... this.getEdges()]
        };

        return obj;
    }

    import(obj) {
        this.cy.elements().remove();
        this.counter = 0;
        this.ecounter = 0;

        for (const node of obj.nodes) {
            this.cy.add({
                group: 'nodes',
                data: {
                    id: node.id,
                    label: node.label,
                    initial: node.initial,
                    final: node.final
                }
            });

            if (this.cy.getElementById(this.counter).data("initial")) {
                this.cy.getElementById(this.counter).data("initial", true);
                this.cy.getElementById(this.counter).style({ 'background-image': 'url(../img/inicial.png)' });
                this.cy.getElementById(this.counter).style({ 'background-clip': ' none' });
                this.cy.getElementById(this.counter).style({ 'bounds-expansion': ' 20' });
                this.cy.getElementById(this.counter).style({
                    'background-width': '60px',
                    'background-height': '40px'
                });
            }
            if (this.cy.getElementById(this.counter).data("final")) {
                this.cy.getElementById(this.counter).data("final", true);
                this.cy.getElementById(this.counter).style({ 'border-style': 'double', 'border-width': 10 });
            }

            this.counter++;
        }

        for (const edge of obj.edges) {
            this.cy.add({
                data: {
                    id: edge.id,
                    label: edge.label,
                    source: edge.source,
                    target: edge.target
                }
            });
            this.ecounter++;
        }
        this.cy.layout({ name: 'grid' }).run();
    }

    foco(nodeId) {
        this.cy.nodes().style('background-color', "#aaa");
        this.cy.getElementById(nodeId).style('background-color', 'rgb(98, 255, 145)');
    }
}

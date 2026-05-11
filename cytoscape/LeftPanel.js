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
                        'target-arrow-color': '#ccc',
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
                this.source.removeClass('source-node');
                this.source = null;
            } else if (!this.edgeExists(this.source.id(), e.target.id())) {
                this.cy.add({
                    data: {
                        id: 'edg' + this.ecounter,
                        label: ',,',
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
            this.nodeP.mostrar(e.target.data("id"));
        });

        this.cy.on('cxttap', 'edge', (e) => {
            this.edgeP.mostrar(e.target.data("id"));
        });

    }

    startPopups() {
        this.edgeP.confirm.onclick = () => {
            let name = this.edgeP.entrada.value + "," + this.edgeP.desempilha.value + "/" + this.edgeP.empilha.value;
            this.cy.getElementById(this.edgeP.index).data("label", name);
            this.edgeP.fechar();
        };

        this.nodeP.exclude.onclick = () => {
            console.log(this.nodeP.index);
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
                this.cy.getElementById(this.nodeP.index).style({ 'background-image': 'url(../inicial.png)' });
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
        this.cy.layout({ name: 'circle' }).run();
    }
}
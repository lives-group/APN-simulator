

export class LeftPanel {
    constructor() {
        this.counter = 0;
        this.ecounter = 0;
        this.source = null;

        this.cy = cytoscape({
            container: document.getElementById('automata'), // container to render in
            style: [
                {
                    selector: 'node',
                    style: { 'content': 'data(name)', 'background-color': '#666' }
                },
                {
                    selector: 'node.source-node', // Selected start node of an edge.
                    style: { 'background-color': '#ff0000' }
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

        this.cy.on('tap', (e)=> {
            if(e.target === this.cy){
                this.cy.add({
                    group: 'nodes',
                    data: { id: this.counter, name: 'q' + this.counter },
                    position: { x: e.position.x, y: e.position.y }
                });
                //apn.addState(counter);
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
                //let t = new Transition('', '', '', idt);
                //apn.addTransition(ido, t);
                this.source.removeClass('source-node');
                this.source = null;
                this.ecounter++;
            }
        });

        this.cy.on('cxttap', 'edge', (e)=> {
            document.getElementById('char').value = '';
            document.getElementById('pop').value = '';
            document.getElementById('push').value = '';
            selEdge = e.target;
            dialog.showModal();
        });

    }
    
    edgeExists(sourceId, targetId) {
        // Use selector to find edges matching source and target
        const existingEdges = this.cy.edges(`[source = '${sourceId}'][target = '${targetId}']`);
        return existingEdges.length > 0;
    }
    getNodes(){
        return this.cy.nodes().map(node => node.data('id'));
    }
    getEdges(){
        return this.cy.edges().map(edge => edge.data());
    }
}
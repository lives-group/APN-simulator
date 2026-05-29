
export class RightPanel {
    constructor(snp) {
        this.ecounter = 0;
        this.cy = cytoscape({
            container: document.getElementById('snaps'), // container to render in
            zoom: 1.5,
            style: [
                {
                    selector: 'node',
                    style: {
                        label: 'data(label)',
                        'background-color': 'rgb(98, 98, 255)',
                        'text-valign': 'center',
                        'text-halign': 'center',
                        'shape': 'round-rectangle',
                        'width': 'label',
                        'height': 25,
                        'border-width': 2,
                        'border-color': 'rgb(55, 0, 255)'
                    }
                },
                {
                    selector: 'node.source-node', // Selected start node of an edge.
                    style: { 'background-color': '#5555ff' }
                },

                {
                    selector: 'edge',
                    style: {
                        'text-wrap': 'wrap',
                        'curve-style': 'bezier',
                        'target-arrow-shape': 'triangle',
                        'line-color': '#ccc',
                        'target-arrow-color': '#ccc',
                        "edge-text-rotation": "autorotate"
                    }
                },

                {
                    selector: '.destacada',
                    style: {
                        'line-color': 'rgb(55, 0, 255)',
                        'target-arrow-color': 'rgb(55, 0, 255)',
                        'width': 3
                    }
                }
            ]
        });

        this.cy.autoungrabify(true);

        this.cy.on('tap', 'node', (e) => {
            snp(e.target.id());
        });

    }

    addNode(id, state, pos, stack) {
        if (stack.length > 3) {
            stack[0] = "...";
        }
        let stk = "[";
        stack.forEach(element => {
            stk += element + ","
        });
        stk += "]";
        this.cy.add({
            group: 'nodes',
            data: {
                id: id,
                label: state + ',' + pos + ',' + stk,
                state: state,
                pos: pos
            }
        });
    }

    addEdge(source, target) {
        this.cy.add({
            group: 'edges',
            data: {
                id: 'edg' + this.ecounter,
                source: source,
                target: target
            }
        });
        ++this.ecounter;
    }

    reset() {
        this.cy.elements().remove();
    }

    foco(pos) {
        this.cy.nodes().forEach(node => {
            if (node.data('pos') == pos) {
                node.style('background-color', 'rgb(98, 255, 145)');
            } else {
                node.style('background-color', 'rgb(98, 98, 255)');
            }
        });
    }

    rightWay(array) {
        array.forEach(node => {
            console.log(typeof(node));
            const dijkstra = this.cy.elements().dijkstra(this.cy.getElementById(0));
            const path = dijkstra.pathTo(this.cy.getElementById(node));
            path.edges().addClass('destacada');
        });
    }

    layout() {
        /*
        this.cy.layout({ name: 'breadthfirst', directed: true, direction: 'rightward', spacingFactor: 1, avoidOverlap: true, nodeDimensionsIncludeLabels: true }).run();
        this.cy.center(this.cy.getElementById(0));
        this.cy.zoom(1.5);
        */
        const layout = this.cy.layout({
            name: 'breadthfirst',
            directed: true,
            direction: 'rightward',
            spacingFactor: 1,
            avoidOverlap: true,
            nodeDimensionsIncludeLabels: true
        });

        layout.on('layoutstop', () => {
            this.cy.animate({
                center: { eles: this.cy.getElementById(0) },
                zoom: 1.2
            });
        });

        layout.run();
    }
}
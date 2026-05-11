

export class RightPanel {
    constructor() {
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
                        'width': 100,
                        'height': 20,
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

        this.cy.add({
            group: 'nodes',
            data: {
                id: 0,
                label: 's00000000',
            }
        });

    }
}
export class Grafo {
  constructor() {

    this.cy = cytoscape({
      container: document.getElementById('grafo'),
      style: [
        {
          selector: 'node',
          style: {
            'text-valign': 'center',
            'text-halign': 'center',
            'background-color': '#0074D9',
            'label': 'data(nome)',

            'border-width': 3,
            'border-color': '#000000',
            'border-opacity': 1,
            'border-style': 'solid'
          }
        },
        {
          selector: 'edge',
          style: {
            'line-color': '#aaa',
            'width': 4,
            'label': 'data(nome)',
            'font-size': 12,
            'color': '#333',
            'text-background-color': '#fff',
            'text-background-opacity': 0.5,
            'text-background-padding': '2px',
            'text-margin-y': -12,
            'text-wrap': 'wrap',

            'curve-style': 'bezier',
            'target-arrow-shape': 'triangle'
          }
        }
      ],

      layout: {
        name: 'preset',

        fit: false
      }
    });
  }

  adciona_aresta(origem, destino, texto) {
    let repete = false;
    this.cy.edges().forEach(edge => {
      if (edge.source().data('id') == origem && edge.target().data('id') == destino) {
        edge.data('nome', edge.data('nome') + '||' + texto);
        repete = true;
      }
    });
    if (!repete) {
      let transicao = { data: { source: origem, target: destino, nome: texto } }
      this.cy.add(transicao);
    }
    this.cy.layout({ name: 'preset' }).run();
  }

  adciona_no(id, nome, final, inicial) {
    this.cy.add({ data: { id: id, nome: nome } });
    this.cy.layout({ name: 'preset' }).run();
    if (final) {
      this.no_final(id, true);
    }
    if (inicial) {
      this.no_inicial(id, true);
    }
  }

  no_inicial(id, valor) {
    if (valor) {
      this.cy.getElementById(id).style({ 'background-image': 'url(../img/inicial.png)' });
      this.cy.getElementById(id).style({ 'background-clip': ' none' });
      this.cy.getElementById(id).style({ 'bounds-expansion': ' 20' });
      this.cy.getElementById(id).style({
        'background-width': '60px',
        'background-height': '40px'
      });
    } else {
      this.cy.getElementById(id).style({ 'background-image': 'none' });
    }
  }

  no_final(id, valor) {
    if (valor) {
      this.cy.getElementById(id).style({ 'border-style': 'double', 'border-width': 10 });
    } else {
      this.cy.getElementById(id).style({ 'border-style': 'solid', 'border-width': 3 });
    }
  }

}
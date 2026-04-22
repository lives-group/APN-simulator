
/** @class Graph This class handles the dynamic behavior of the automaton, or its execution on a given word.
 *  Since we are emulating the behavior of a non-deterministic automaton, we keep a list of all
 *  possible instantaneous configurations in memory, as weel as a single copy of the word shared
 *  accors all configurations. This class is also responsable for determining whether or not
 *  accetance criterias haven been met.
 */

export class Graph {
    #names   // keep translation of names to nodes
    #edges   // keep the edges of the graph
    #counter // keep the node number

    constructor() {
        this.#names = new Map();
        this.#edges = new Map();
        this.#counter = 0;
    }

    /**
     * Add a new note to this graph
     * @param obj whatever object the user wants to add
     * @returns the index of the node added
     */
    addNode(obj) {
        if (this.#names.get(obj) === undefined) {
            this.#names.set(this.#counter, obj);
            return this.#counter++;
        }
    }

    /**
     * Add a new edge to this graph. has no effect if this edge already exists
     * @param origin the index of the origin vertex within this graph
     * @param destination the index of the destination vertex within this graph
     */
    addEdge(origin, destination) {
        let l = this.#edges.get(origin);
        if(l!=null){
            if(l.indexOf(destination)<0){
                l.push(destination);
            }
        }else{
            this.#edges.set(origin, [destination]);
        }
    }

    /**
     * Get the object associated to the index
     * @param index of the node wanted
     * @returns the data object associated with the node
     */
    getNode(index) {
        return this.#names.get(index);
    }

    /** 
     * @returns a string with the list of nodes
     */
    nodesToString() {
        let string = "";
        for (let key of this.#names.keys()) {
            string += ` ${key}=> ${this.#names.get(key)} \n`;
        }
        return string;
    }

    /** 
     * @returns a string with the list of edges
     */
    edgesToString() {
        let string = "";
        for (let key of this.#edges.keys()) {
            string += ` ${key}=> ${this.#edges.get(key)} \n`;
        }
        return string;
    }

    /** 
     * @returns a string with the edges with the name of each node
     */
    toString() {
        let string = "";
        let destnations = [];
        for (let key of this.#edges.keys()) {
            string += ` ${this.getNode(key)}=>`;
            destnations = this.#edges.get(key);
            destnations.forEach(destination => {
                string += `${this.getNode(destination)},  `;
            });
            string += `\n`;
        }
        return string;
    }
}
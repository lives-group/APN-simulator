
import { APN } from './APN.js'
import { Transition } from './transition.js'
import { Snapshot } from '../snapshot.js'
import { Graph } from '../Graph.js'
export { APNRunner, APN, Snapshot, Transition }

/** @class APNRunner This class handles the dynamic behavior of the automaton, or its execution on a given word.
 *  Since we are emulating the behavior of a non-deterministic automaton, we keep a list of all
 *  possible instantaneous configurations in memory, as weel as a single copy of the word shared
 *  accors all configurations. This class is also responsable for determining whether or not
 *  accetance criterias haven been met.
 */

class APNRunner {

    #apn        // APN
    #input      // The input string
    #snaps      // The current snapshots
    #snapsPrev  // previus snaps
    #graph      // graph of all snaps "tracer"

    #loop       // the iterator that marks the number of loop staps execution
    #limit      // the limit number of loop stap executions
    #aux        // map that keeps the snaps index on graph
    #accType    /* the type of acceptance criteria is one of the following strings:  
                *              - 'FS' : Accept by final state and empty stack.
                *              - 'F'  : Accept by final state.
                *              - 'S'  : Accept by empty stack.
                */

    constructor(apn, input, accType, limit) {
        this.#apn = apn;
        this.#input = input;
        this.#accType = accType;
        this.#limit = limit;
        this.start();
    }

    /** 
     * Startup the atributes of class to the new execution
     */
    start() {
        this.#graph = new Graph();
        this.#loop = 0;
        this.#snaps = [];
        this.#aux = new Map();
        for (let ist of this.#apn.getInitialStates()) {
            let snap = new Snapshot(ist, 0, []);
            this.#snaps.push(snap);
            let i = this.#graph.addNode(snap);
            this.#aux.set(snap, i);
        }
        this.#snapsPrev = [];
        this.#loop = -1;
    }

    /** 
     * Executes a single step, computing a new list of instantaneous configurations.
     */
    step() {
        let snps1 = [];
        let map = new Map();

        for (let snp of this.#snaps) {
            let char = snp.pos >= this.#input.length ? '' : this.#input[snp.pos];
            let ts = this.#apn.delta(snp.state, char, snp.top());
            for (let t of ts) {
                let t1 = this.transition(t, snp);
                if (!(t1 === undefined)) {
                    snps1.push(t1);
                    let i = this.#graph.addNode(t1);
                    this.#graph.addEdge(this.#aux.get(snp), i);
                    map.set(t1, i);
                }
            }
        }
        this.#aux = new Map(map);
        this.#snapsPrev = this.#snaps;
        this.#snaps = snps1;
    }

    /** 
     * Test and execute a single step
     * @returns the  
     */
    nextTrace() {
        if (this.#limit > this.#loop && !this.exausted() && typeof (this.#limit) === 'number') {
            if ((this.#accType == 'FS' && !this.acceptedFS()) ||
                (this.#accType == 'F' && !this.acceptedF()) ||
                (this.#accType == 'S' && !this.acceptedS())) {
                this.step();
            }
            /*else if(this.acceptedFS()){
                console.log("aceito com palavra e pilha")
            }else if(this.acceptedF()){
                console.log("aceito com palavra")
            }else if(this.acceptedS()){
                console.log("aceito com pilha")
            }*/
        }
        return this.#limit;
    }

    /** 
     * Turn to the next step
     */
    next() {
        ++this.#loop;
        this.nextTrace();
        console.log(this.#graph.toString());
    }


    static #mkSep(s, n) {
        let sep = s;
        for (let i = 0; i < n; i++) { sep = sep.concat(s); }
        return sep;
    }


    lastStepString() {
        let mx = 0;
        let prevStr = [];
        let newStr = [];
        for (let snp of this.#snaps) {
            let s = '';
            let acc = ((snp.pos >= this.#input.length) && (this.#apn.isFinal(snp.state)) && (snp.stack.length === 0));
            s += snp.state + ', ' + PrintUtils.printWord(this.#input, snp.pos) + ', ';
            s += PrintUtils.printArr(snp.stack);
            if (acc) { s += ' (AC) '; }
            newStr.push(s);
        }
        for (let snp of this.#snapsPrev) {
            let s = '';
            let acc = ((snp.pos >= this.#input.length) && (this.#apn.isFinal(snp.state)) && (snp.stack.length === 0));
            s += snp.state + ', ' + PrintUtils.printWord(this.#input, snp.pos) + ', ';
            s += PrintUtils.printArr(snp.stack);
            if (acc) { s += ' (AC) '; }
            prevStr.push(s);
            if (s.length > mx) { mx = s.length; }
        }

        let str = "PREV " + APNRunner.#mkSep('-', mx - 5) + '| CURRENT ------\n';
        let i = 0;
        while (i < Math.max(prevStr.length, newStr.length)) {
            if (i < prevStr.length) {
                if (i < newStr.length) {
                    str += prevStr[i] + APNRunner.#mkSep(' ', mx - prevStr[i].length) + '|' + newStr[i] + '\n';
                } else {
                    str += prevStr[i] + APNRunner.#mkSep(' ', mx - prevStr[i].length) + '|' + '\n';
                }
            } else if (i < newStr.length) {
                str += APNRunner.#mkSep(' ', mx) + '|' + newStr[i] + '\n';
            }
            i = i + 1;
        }
        return str;

    }

    /** Advances, or not, the input pointer in the current input string.
     *  This function generalizes the behaviour of the atomata when processing
     *  a symbol that migth be empty;
     *  @param inc Usualy 0 or 1. Tue number of symbols to advance.
     *  @param t the tansition unde consideration
     *  @param snp the snapshot under consideration
     *  @param stk1 A pointer to a  NEW EMPTY stack.
     *  @return undefined if the trasition does not apply or a new Snapshot if the transition applies.
     */
    #advanceSnap(inc, t, snp, stk1) {
        if (t.stkR === '') {
            for (let i of t.stkW) { stk1.push(i); }
            return new Snapshot(t.state, snp.pos + inc, stk1);
        } else if (t.stkR === snp.top()) {
            stk1.pop();
            for (let i of t.stkW) { stk1.push(i); }
            return new Snapshot(t.state, snp.pos + inc, stk1);
        }
        return undefined;
    }

    /**
     * Given a transition and a snapshot, computes the resulting snapshot. Returns unedfined
     * if the transition does not apply.
     * @param t The trasition
     * @param snp  The snapshot
     * @return  A new snapshot or undefiend if the transiotion does not apply.
     */
    transition(t, snp) {
        let snp1 = undefined;
        let stk1 = []
        for (let x of snp.stack) { stk1.push(x); }
        if (t.sym === '') {
            snp1 = this.#advanceSnap(0, t, snp, stk1);

        } else if (t.sym === this.#input[snp.pos]) {
            snp1 = this.#advanceSnap(1, t, snp, stk1);
        }
        return snp1;
    }

    /** Test if any instantaneous configuration meet the criteria for acceptance by final state.
     *  @return true if there is any snapshot that meets the creteria for accetance by final state.
     *          Returns false otherwise,
     */
    acceptedF() {
        let r = false;
        for (let snp of this.#snaps) {
            r = r || ((snp.pos >= this.#input.length) && (this.#apn.isFinal(snp.state)));
        }
        return r;
    }


    /** Test if any instantaneous configuration meet the criteria for acceptance by final state and empty stack.
     *  @return true if there is any snapshot that meets the creteria for accetance by final state and empty stack.
     *          Returns false otherwise,
     */
    acceptedFS() {
        let r = false;
        for (let snp of this.#snaps) {
            r = r || ((snp.pos >= this.#input.length) && (this.#apn.isFinal(snp.state)) && (snp.stack.length === 0));
        }
        return r;
    }

    /** Test if any instantaneous configuration meet the criteria for acceptance by empty stack.
     *  @return true if there is any snapshot that meets the creteria for accetance by empty stack.
     *          Returns false otherwise,
     */
    acceptedS() {
        let r = false;
        for (let snp of this.#snaps) {
            r = r || ((snp.pos >= this.#input.length) && (snp.stack.length === 0));
        }
        return r;
    }
    /**
     * @return true whenever the snapshot list is empty. This indicates that there is no possibçe
     */
    exausted() {
        return this.#snaps.length == 0;
    }

    /** Run the automanton until it accepts an input or set of snapshots becames empty (no possible states) or
     *  the maximum number of steps is reached.
     * @returns The number o steps reamining, if any.
     */
    runUntilAcc() {
        if (typeof (this.#limit) === 'number') {
            switch (this.#accType) {
                case 'FS': while (this.#limit > 0 && !this.acceptedFS() && !this.exausted()) { this.step(); this.#limit--; }
                    break;
                case 'F': while (this.#limit > 0 && !this.acceptedF() && !this.exausted()) { this.step(); this.#limit--; }
                    break;
                case 'S': while (this.#limit > 0 && !this.acceptedS() && !this.exausted()) { this.step(); this.#limit--; }
                    break;
            }
            console.log(this.#graph.toString());
            return this.#limit;
        }
    }

}


class PrintUtils {

    static printArr(arr) {
        let s = '';
        if (arr.length > 0) {
            s = s.concat(arr[0]);
            for (let i = 1; i < arr.length; i++) {
                s = s.concat(', ', arr[i]);
            }
        }
        return s;
    }

    static printWord(str, p) {
        let s = '';
        if (p >= str.length || p < 0) { return str + '[]'; }
        for (let i = 0; i < str.length; i++) {
            s += p == i ? '[' + str[i] + ']' : str[i];
        }
        return s;
    }

}

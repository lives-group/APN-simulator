
import {APN} from './APN.js'
import {Transition} from './transition.js'
import {Snapshot} from './snapshot.js'
export{ APNRunner ,APN, Snapshot, Transition }
/** @class APNRunner This class handles the dynamic behavior of the automaton, or its execution on a given word.
 *  Since we are emulating the behavior of a non-deterministic automaton, we keep a list of all
 *  possible instantaneous configurations in memory, as weel as a single copy of the word shared
 *  accors all configurations. This class is also responsable for determining whether or not
 *  accetance criterias haven been met.
 */

class RunnerGraph{
    #snap
    #leafs
    constructor(snapshot){
        this.#snap = snapshot;
        this.#leafs = [];
    }
    
    addLeaf(leaf){
        this.#leafs.push(leaf);
    }

    getLeafs(){
        return [... this.#leafs];
    }
}


class APNRunner {

    #apn         // APN
    #input       // The input string
    #snaps       // The current snapshots
    #snapsPrev
    #graph       // graph of all snaps "tracer"

    constructor(apn, input){
       this.#apn = apn;
       this.#input = input;
       this.#snaps = [];
       for(let ist of this.#apn.getInitialStates() ){
           this.#snaps.push(new Snapshot(ist,0,[]));
       }
       this.#snapsPrev = [];
       this.#graph = new RunnerGraph(new Snapshot(ist,0,[]));
       if(this.#snaps.length>1){
            this.#snaps.forEach(snap => {
                this.#graph.addLeaf(new RunnerGraph(snap));
            });
       }
    }

    /** Executes a single step, computing a new list of instantaneous configurations.
     *
     */
    step(){
        let snps1 = [];
        for(let snp of this.#snaps){
            let char = snp.pos >= this.#input.length ? '' :  this.#input[snp.pos];
            let ts = this.#apn.delta(snp.state,char, snp.top());
            for(let t of ts){
                let t1 = this.transition(t,snp);
                if(!(t1 === undefined)) snps1.push(t1);
            }
        }
        this.#snapsPrev = this.#snaps;
        this.#snaps = snps1;
    }

    static #mkSep(s,n){
        let sep = s;
        for(let i =0; i< n; i++){ sep = sep.concat(s); }
        return sep;
    }


    lastStepString(){
        let mx = 0;
        let prevStr = [];
        let newStr = [];
        for(let snp of this.#snaps){
                let s = '';
                let acc = ((snp.pos >= this.#input.length) && (this.#apn.isFinal(snp.state)) &&  (snp.stack.length === 0));
                s += snp.state + ', ' + PrintUtils.printWord(this.#input,snp.pos) + ', ';
                s += PrintUtils.printArr(snp.stack);
                if(acc){ s+= ' (AC) ';}
                newStr.push(s);
        }
        for(let snp of this.#snapsPrev){
                let s = '';
                let acc = ((snp.pos >= this.#input.length) && (this.#apn.isFinal(snp.state)) &&  (snp.stack.length === 0));
                s += snp.state + ', ' + PrintUtils.printWord(this.#input,snp.pos) + ', ';
                s += PrintUtils.printArr(snp.stack);
                if(acc){ s+= ' (AC) ';}
                prevStr.push(s);
                if(s.length > mx){ mx = s.length;}
        }

        let str = "PREV " + APNRunner.#mkSep('-',mx-5) + '| CURRENT ------\n';
        let i =0;
        while( i < Math.max(prevStr.length, newStr.length) ){
            if( i < prevStr.length){
                if(i < newStr.length){
                     str += prevStr[i] + APNRunner.#mkSep(' ',mx - prevStr[i].length) + '|' + newStr[i] + '\n';
                }else{
                     str += prevStr[i] + APNRunner.#mkSep(' ',mx - prevStr[i].length) + '|' + '\n';
                }
            }else if(i < newStr.length){
                     str += APNRunner.#mkSep(' ',mx) + '|' + newStr[i] + '\n';
                }
            i = i +1;
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
    #advanceSnap(inc,t,snp,stk1){
        if(t.stkR === ''){
             for(let i of t.stkW){stk1.push(i);}
             return new Snapshot(t.state,snp.pos+inc,stk1);
        }else if(t.stkR === snp.top()){
             stk1.pop();
             for(let i of t.stkW){stk1.push(i);}
             return new Snapshot(t.state,snp.pos+inc,stk1);
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
    transition(t,snp){
        let snp1 = undefined;
        let stk1 = []
        for(let x of snp.stack){ stk1.push(x);}
        if(t.sym === ''){
            snp1 = this.#advanceSnap(0,t,snp,stk1);

        }else if (t.sym === this.#input[snp.pos]){
            snp1 = this.#advanceSnap(1,t,snp,stk1);
        }
        return snp1;
    }

    /** Test if any instantaneous configuration meet the criteria for acceptance by final state.
     *  @return true if there is any snapshot that meets the creteria for accetance by final state.
     *          Returns false otherwise,
     */
    acceptedF(){
       let r = false;
       for(let snp of this.#snaps){
          r  = r || ((snp.pos >= this.#input.length) && (this.#apn.isFinal(snp.state)));
       }
       return r;
    }


    /** Test if any instantaneous configuration meet the criteria for acceptance by final state and empty stack.
     *  @return true if there is any snapshot that meets the creteria for accetance by final state and empty stack.
     *          Returns false otherwise,
     */
    acceptedFS(){
       let r = false;
       for(let snp of this.#snaps){
          r  = r || ((snp.pos >= this.#input.length) && (this.#apn.isFinal(snp.state)) &&  (snp.stack.length === 0)) ;
       }
       return r;
    }

    /** Test if any instantaneous configuration meet the criteria for acceptance by empty stack.
     *  @return true if there is any snapshot that meets the creteria for accetance by empty stack.
     *          Returns false otherwise,
     */
    acceptedS(){
       let r = false;
       for(let snp of this.#snaps){
          r  = r || ((snp.pos >= this.#input.length) &&  (snp.stack.length === 0)) ;
       }
       return r;
    }
    /**
     * @return true whenever the snapshot list is empty. This indicates that there is no possibçe
     */
    exausted(){
       return this.#snaps.length == 0;
    }

    /** Run the automanton until it accepts an input or set of snapshots becames empty (no possible states) or
     *  the maximum number of steps is reached.
     *  @param accCrit The acceptance criteria is one of the following strings:
     *              - 'FS' : Accept by final state and empty stack.
     *              - 'F'  : Accept by final state.
     *              - 'S'  : Accept by empty stack.
     * @param limit The number of steps until give up
     * @returns The number o steps reamining, if any.
     */
    runUntilAcc(accCrit, limit){
        if(typeof(limit) === 'number'){
            switch(accCrit){
               case 'FS' : while(limit > 0 && !this.acceptedFS() && !this.exausted()){ this.step(); limit--; }
                        break;
               case 'F' : while(limit > 0 && !this.acceptedF() && !this.exausted()){ this.step(); limit--; }
                        break;
               case 'S' : while(limit > 0 && !this.acceptedS() && !this.exausted()){ this.step(); limit--; }
                        break;
            }
            return limit;
        }
    }

}


class PrintUtils {

    static printArr(arr){
        let s = '';
        if(arr.length > 0){
           s = s.concat(arr[0]);
           for(let i = 1; i < arr.length; i++ ){
              s = s.concat(', ', arr[i]);
           }
        }
        return s;
    }

    static printWord(str,p){
        let s = '';
        if(p >= str.length || p < 0){ return str + '[]';}
        for(let i = 0; i < str.length; i++ ){
            s += p == i ? '[' + str[i] + ']' : str[i];
        }
        return s;
    }

}

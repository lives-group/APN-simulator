
export {APN, Transition, Snapshot,APNRunner};
import {NameManger} from '../nameMng.js'

class APN {
    #states      = undefined; // list of known states
    #transitions = undefined; // A map of transitions (int x [Transition])
    #finals      = undefined; // a list of final states
    #start       = undefined; // A single initial state
    #stDecor     = undefined; // Decorações para os estados

    /**
     * Constructs a default APN (with no states and no transitions)
     */

    constructor(){
        this.#transitions = new Map();
        this.#stDecor = new Map();
        this.#states = [];
        this.#finals = [];
        this.#start  = [];
    }

    /** Adds a state to the list of states
     * @param s The state to be added.
     */
    #addState(s){
        if(typeof s === 'number'){
            this.#states.push(s);
        }
    }

    /** Adds a state to the list of states, with a given decoration object.
     * @param s The state to be added.
     * @param decor The decoration object
     */
    #addState(s,decor){
        if(typeof s === 'number'){
            this.#states.push(s);
            this.#stDeco.set(s,decor);
        }
    }

    /** Shifts all elements to the rigth from this point foward.
     *  @param p The start of the operation. Mus be smaller than  this.#states.length - 1
     */
    #overrite(p,list){
        for(let i = p; i < list.length - 1 ; i++ ){
            list[i] = list[i+1]
        }
    }


    /** Remove a given state s.
     *  @param s The state to be removed
     */
    removeState(s){
        if(typeof s === 'number'){
            let i = this.states.indexOf(s);
            let is = this.start.indexOf(s);
            let ie = this.finals.indexOf(s);
            if( i > 0){ this.#overrite(i,this.#states);}
            if( is > 0){ this.#overrite(i,this.#start);}
            if( ie > 0){ this.#overrite(i,this.#finals);}
            this.#transitions.delete(s);
            // for(let i = 0; i < this.#states.length; i++){
            //     if(s === this.#states[i]){
            //         this.#overrite(i,this.#states);
            //         this.#states.pop();
            //         return ;
            //     }
            // }
        }
    }

    /** Adds a transition to the list of transitions of the state s.
     * @param s The state to have a transition added.
     * @param t The transition to be added.
     */
    addTransition(s,t){
        if(typeof s === 'number'){
             if(t instanceof Transition){
                  if(this.#states.indexOf(s) === -1){
                       this.#states.push(s);
                  }
                  let ls = this.#transitions.get(s);
                  if(ls === undefined){
                      this.#transitions.set(s,[t]);
                  }else{
                      ls.push(t);
                  }
             }
        }
    }

    /** Returns the index of the transition whithin the list.
     *  Uses value equality instead of reference equality.
     * @param  t The transition to look for.
     * @param ls The list of transition.
     * @return the index of r in ls or -1 it t does not occurs in ls.
     */
    #getTransition(t, ls){
        for(let i = 0; i < ls.length; i++){
            if(t.equal(ls[i])){ return i;}
        }
        return -1;
    }

    /** Removes a transition from the list of transitions of the state s.
     * @param s The state to have a transition removed.
     * @param t The transition to be removed.
     */
    removeTransition(s,t){
        if(typeof s === 'number'){
             if(t instanceof Transition){
                  let ls = this.#transitions.get(s);
                  if(ls === undefined){
                      return;
                  }else{
                     let i = this.#getTransition(t,ls);
                     if(i >=0){
                        this.#overrite(i,ls);
                        ls.pop();
                     }
                  }
             }
        }
    }

    /** Defines the given state to be final. Has no effect it s is already final.
     *  @param s The state to be made final.
     */
    setFinal(s){
        if(this.#states.indexOf(s) == -1){ this.#states.push(s); }
        if(!(this.#finals.indexOf(s) >= 0)){
            this.#finals.push(s);
        }
    }

    /** Defines the given state to not be final. Has no effect it s is not final.
     *  @param s The state to be unmade final.
     */
    unsetFinal(s){
        let i = this.#finals.indexOf(s);
        if(i >= 0){
            this.#overrite(i,this.#finals);
            this.#finals.pop();
        }
    }

    /** Returns a copy of the final state list.
     * @return A shalow copy of the final state list.
     */
    getFinals(){
        let fns = [];
        for(let i of this.#finals){fns.push(i);}
        return fns;
    }

    /**
     * @return True if the given state is Final
     */
    isFinal(s){
        if(typeof(s) === 'number'){
            return this.#finals.indexOf(s) >=0;
        }
        return false;
    }

    /** Defines the given state to be initial. Has no effect it s is already initial.
     *  @param s The state to be made initial.
     */
    setInitial(s){
        if(this.#states.indexOf(s) == -1){ this.#states.push(s); }
        if(this.#start.indexOf(s) < 0){
            this.#start.push(s);
        }
    }

    /** Remove the given state of the list of initial states. Has no effect if
     *  the given state is not in the list of initial states.
     *  @param s The state to be removed from the list of initial states.
     */
    unsetInitial(s){
        let i = this.#start.indexOf(s);
        if(i >= 0){
            this.#overrite(i,this.#start);
            this.#start.pop();
        }
    }

    /**
     * @return The initial state
     */
    getInitialStates(){
        return this.#start;
    }
    /**
     * @return true if the given state is initial.
     */
    isInitial(s){
         return this.#start.indexOf(s) >= 0;
    }

    /**
     * @return The number of states.
     */
    getNumStates(){ return this.#states.length; }

    /**
     * @return The list of states.
     */
    getStates(){
        let sts = []
        for(let i of this.#states){ sts.push(i);}
        return sts;

    }

    /** Returns a transition from a given state.
     * @param s source state;
     * @param chr the symbol in which the transition happens (from the input).
     * @param r the symbol in which the transition happens (from the stack).
     * @return A list of trasitions.
     */
    delta(s, chr , r){
        if(typeof(s) === 'number' && (typeof(chr) === 'string') && (typeof(r) === 'string')){
            let ls = this.#transitions.get(s);
            let rs = [];
            for(let t of ls){
                if( (t.sym === chr || t.sym === '') && (t.stkR === r || t.stkR === '')){
                    rs.push(t);
                }
            }
            return rs;
        }
        return []
    }
}

 /** Represents a transition
  */
class Transition {
     sym = '';
     stkR ;
     stkW ;
     state = 0;

     /** @constructor Contructs a transition.
      *  @param sym  The symbol under this transition
      *  @param stkR  An array containing the elments that must be removed from the stack (top element at the array's end).
      *  @param stkW  An array containing the elments that must be inserted into the stack (top element at the array's end).
      *  @param state  The destination state
      */

     constructor(c, stkr,stkw,st){
         this.sym = c;
         this.stkR = stkr;
         this.stkW = stkw;
         this.state = st;
    }
     /** Returns true whnever the given transition has the same
      * methods as this one
      *  @param t The transition to be compared with.s
      *  @return True if the the give transition has the exact same
      *          attributes as this one.
      */
     equal(t){
         if(t instanceof Transition){
             return t.sym   === this.sym &&
                    t.stkR  === this.stkR &&
                    t.stkW  === this.stkW &&
                    t.state === this.state ;
         }
         return false;
    }

    /** Convert this object in string, for debuggin purposes.
     * @return A humam-readable string represention of this object.
     */
    toString(){
        return this.sym + ', ' + this.stkR + ' -> ' + this.state + ',' + this.stkW;
    }

}

/** Caputres the concept of a instantaneous configuration of the automata.
 *  This calss contais the following attributes:
 *    - state :  The curent state the automaton  .
 *    - stack:  The enteire stack.
 *    - pos:   The position on the current input.
 */
class Snapshot {
    state
    stack
    pos

    /** @constructor Contructs a snapshot from the arguments.
     *    @param s The state.
     *    @param pos The position on the current input.
     *    @param stk An array containing the content of the stack.
     */
    constructor(s, pos, stk ){
        this.stack = [];
        for(let i =0; i < stk.length; i++){ this.stack.push(stk[i]);}
        this.pos = pos;
        this.state = s;
    }

    /** Compare a given snapshot with this one for equality. The comparation is performed by content of all fields.
     *  @param snp The snapshot to be compared.
     *  @return true if the given snp is equal to this one, false if the given sno is not equal to this one or if
     *  the snp is not an instance of Snapshot.
     */

    equal(snp){
        if( sno instanceof Snapshot){
            eq = sno.stack.length === this.stack.length;
            if(eq){
                for(let i =0; i< this.stack.length; i++){
                    eq = eq && this.stack[i] === sno.stack[i];
                }
            }
            return this.state == sno.state &&
                   this.pos == sno.pop &&
                   eq ;
        }
        return false;
    }

    /** Returns the top of the stack, without removing it.
     * @return The value on the top of the stack.
     */
    top(){
        if(this.stack.length > 0){
            return this.stack[this.stack.length -1];
        }
        return '';
    }

    toString(){
        let s = '(' + this.state + ', ' + this.pos + ', [';
        if(this.stack.length > 0){
           s = s.concat(this.stack[0]);
           for(let i = 1; i < this.stack.length; i++ ){
              s = s.concat(', ', this.stack[i]);
           }
        }
        s = s.concat('] )');
        return s;
    }

}

/** This class handles the dynamic behavior of the automaton, or its execution on a given word.
 *  Since we are emulating the behavior of a non-deterministic automaton, we keep a list of all
 *  possible instantaneous configurations in memory, as weel as a single copy of the word shared
 *  accors all configurations. This class is also responsable for determining whether or not
 *  accetance criterias haven been met.
 */

class APNRunner {

    #apn         // APN
    #input       // The input string
    #snaps     // The current snapshots
    #snapsPrev
    constructor(apn, input){
       this.#apn = apn;
       this.#input = input;
       let snpi = new Snapshot(apn.getInitialState(),0,[]);
       this.#snaps = [snpi];
       this.#snapsPrev = [];
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

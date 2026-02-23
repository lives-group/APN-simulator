import {Transition} from './transition.js'
import {APNVisitor} from './APNVisitor.js'
export{ APN }



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
    addState(s){
        if(typeof s === 'number'){
            this.#states.push(s);
        }
    }

    /** Associates a decoration object to a given state. Has no effect if
     *  the state is not in the list of states.
     * @param s The state.
     * @param decor The decoration object
     */
    addStateDecor(s,decor){
        if(typeof s === 'number' && this.#states.indexOf(s) >= 0){
            this.#stDecor.set(s,decor);
        }
    }

    /** Retrives a decoration from a state.
     * @return The deocaration associated with the given object
     */
    getDecor(s){
       if(typeof s === 'number'){
            return this.#stDecor.het(s,decor);
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

    /** Applyes an APN visitor to this automata.
     *  The order of the visit is:
     *    1 All states: One call to visitState per state;
     *    2 All initial States:  One call to visitStart per initial state;
     *    3 All final states:  One call to visitFinal per final state;
     *    4 All transitions: One call to visitTransition per transition;
     */
    accept(apnvisitor){
        if(apnvisitor instanceof APNVisitor){
            for(let st of this.#states){ apnvisitor.visitState(st);}
            for(let st of this.#start){ apnvisitor.visitStart(st);}
            for(let st of this.#finals){ apnvisitor.visitFinal(st);}
            for(let [st,ts] of this.#transitions){
                for(let t of ts){
                    apnvisitor.visitTransition(st, t.sym, t.stkR, t.stkW, t.state);
                }
            }
        }
    }


}

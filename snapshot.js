
export{ Snapshot }
/** Caputres the concept of a instantaneous configuration of the automata.
 *  This calss contais the following attributes:
 *    - state :  The curent state the automaton  .
 *    - stack:  The enteire stack.
 *    - pos:   The position on the current input.
 */
class Snapshot {
    state
    pos
    stack

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

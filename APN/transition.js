
export{Transition}
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

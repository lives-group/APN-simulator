export {APNVisitor,StringVisitor}

/** @class APNVisitor Defines a vsitor for an APN.
 *         All methods are empty (do-nothing) by defaul.
 *         Extends this class to create a specific visitor.
 */
class APNVisitor{
   visitState(st){}
   visitStart(st){}
   visitFinal(st){}
   visitTransition(origin, char, stkread, stkwrite, target){}
}

/** @class StringVisitor Convertes an APN to string.
 *  This class serves as a simple example on how to
 *  use visitors on automatas.
 */
class StringVisitor extends APNVisitor{
   #stStr = 'States: {';
   #stInit = 'Inits : {';
   #stFinals = 'Finals: {';
   #stTransitions = 'delta: origin, char, pop -> target, push\n';

   /** Adds a state to the states string.
    * @param st The state to be converted.
    */
   visitState(st){ this.#stStr += st + ' ';}

   /** Adds a state to the stat states string.
    * @param st The state to be converted.
    */
   visitStart(st){ this.#stInit += st + ' '}

   /** Adds a state to the final states string.
    * @param st The state to be converted.
    */
   visitFinal(st){  this.#stFinals += st + ' '}

   /** Converts a transition to string and adds it to the transition string.
    *
    * @param origin : The origin state.
    * @param char : The characer of the transition.
    * @param stkread : The required top of the stack.
    * @param stkwrite : the symbols to puhs into the stack.
    * @param target : The target satate.
    */
   visitTransition(origin, char, stkread, stkwrite, target){
       this.#stTransitions +=  origin + ', ' + char + ', ' +
                               stkread + ' -> ' +target + ', ' + stkwrite + '\n';
   }

   /** Returns the string produced from the result of applying this visitor.
    *  @return The String representation of the auotamata.
    */
   getStr(){
     return this.#stStr + '}\n' +
            this.#stInit + '}\n' +
            this.#stFinals +'}\n' +
            this.#stTransitions
   }

   /** Resets this visitor, celaring all strings
    */
   reset(){
      this.#stStr = 'States: {';
      this.#stInit = 'Inits : {';
      this.#stFinals = 'Finals: {';
      this.#stTransitions = 'delta: origin, char, pop -> target, push\n';
   }
}

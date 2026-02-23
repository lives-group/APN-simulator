
export {NameManager};

class NameManager{
    #names
    #ids
    #decorations
    #cnt;
    #dels;

    constructor(){
        this.#names = new Map();
        this.#ids = [];
        this.#cnt = 0;
        this.#dels = 0;
    }

    /** Returns the number id of a given number
     *  @param name The name to be consulted.
     *  @return The numneric if of the number or
     *          undefiend if the name is not defined or the parameter
     *          is not a name.
     */
    idOf(name){
         if(typeof(name) === 'string'){
            return this.#names.get(name);
         }
         return undefined;
    }

    /** Returns the name of an id.
     *  @param id The numeric id to be consulted.
     *  @return The name of the id or
     *          undefiend if the id do not have a name or the parameter
     *          is not a numeric.
     */
    nameOf(id){
        if(typeof(id) === 'number'){
           if(id < this.#cnt){
              return this.#ids[id];
           }
        }
        return undefined;
    }

    /** Returns the position of a undefined value on the ID array.
     *  @return the poistion of the first ocurrence of undefined in ids or -1 it there is none.
     */
    #undefinedPos(){
        for(let i =0 ; i< this.#ids.length; i++){
            if(this.#ids[i] === undefined){ return i;}
        }
        return -1;
    }

    /** Add a new name to this NameManager. Has no effect if the name is already defiend or
     *  the parameter isn't a string.
     *  @param name A string to be added.
     */

    addName(name){
        if(typeof(name) === 'string'){
            if(this.idOf(name) === undefined ){
                if(this.#dels === 0){
                    let id = this.#cnt++;
                    this.#names.set(name,id);
                    this.#ids.push(name);
                }else{
                    let p = this.#undefinedPos();
                    this.#names.set(name,p);
                    this.#ids[p] = name;
                    this.#dels --;
                }
            }
        }
    }


    /** Remove a name from this NameManager. Has no effect if the name is already absent or
     *  the parameter isn't a string.
     *  @param name A string to be removed.
     */
    removeName(name){
        if(typeof(name) === 'string'){
            let i = this.idOf(name);
            if(i != undefined ){
                    this.#names.delete(name);
                    this.#ids[i] = undefined;
                    this.#dels++;
            }
        }
    }



}

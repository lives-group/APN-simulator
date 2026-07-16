
export  {Nt,Rhs};
//
// S -> aSa | bAb | ad | eps
//
//     [ [a,Nt{A,[]},a] , [b,Nt{A,[]},b] , [a,d] , ['']]
class Rhs {
    #body = [];

    constructor(){  this.#body = []; }

    addAlternative(sequence){
        if(sequence instanceof Array){
            if(Rhs.#validate(sequence) ){
                this.#body.push(sequence);
            }
        }
    }

    getAlternatives(){return this.#body;}

    getAlternative(ref){
        if(typeof(ref) === 'number'){
            return this.#body[ref];
        }
        return undefined;
    }

    isEmptyBody(){ return this.#body.length == 0;}

    derivate(sym, nullSyms){
         let rhs1 = new Rhs();
         for(let s of this.#body){
             for(let ds of Rhs.#derivateSeq(sym,s,nullSyms)){
                 if(ds != undefined){
                     rhs1.addAlternative(ds);
                 }
             }
         }
         return rhs1;
    }

    /** Given a symbol sym and a sequene s, produce a list of
     * all possible derivates of s in relation to sym.
     * @param sym A symbol to derive in relation of
     * @param s the sequence chain to be derived
     * @param nullSyms the Set of nullable symbols.
     * @return a, possible empty, list of derivate sequnces, or undefined if
     * no derivate applies.
     */

    static #derivateSeq(sym, s, nullSyms){
        let alts = [];
        let sd = [];
        let i = 1;
        if(s.length > 0){
                  let j = 0;
                  while(j < s.length){
                      if (s[j] instanceof Nt){
                         sd = [];
                         sd.length = s.length - j;
                         sd[0]= s[j].derivate(sym);
                         for(i = j+1; i < s.length; i++  ){ sd[i-j] = s[i];}
                         alts.push(sd);
                         if(nullSyms.has(s[j].uidStr())){
                            j = j + 1;
                         }else{ return alts;}
                      }else if(s[j] === sym){
                          sd = [];
                          if(j+1 >= s.length){sd.push('');}
                          else for(i = j+1; i < s.length; i++  ){ sd.push(s[i]);}
                          alts.push(sd);
                          return alts;
                      }else{
                          return alts;
                      }
                  }
        }
        return alts;
    }

    // Validates a sequence. A sequence is valid if, and only if, it
    // is composed only of strings or a instances of Nt class.
    // This method is used by the constructor to ensure data consistencie.
    static #validate(seq){
        let valid = true;
        for(let c of seq){ valid = valid && (typeof(c) === 'string' || (c instanceof Nt) ); }
        return valid;
    }


    // return true if, and only if, a sequence is nullable.
    static emptySeq(seq){
         let empty = true;
         for(let s of seq){ empty = empty && (s === ''); }
         return empty;
    }

    emptyAlternative(){
        let empty = false;
        for(let s of this.#body){ empty = empty || Rhs.emptySeq(s); }
        return empty;
    }

    // Returns a string that rerpresent this grammar.
    ppstr(){
        let s = '';
        if(this.#body.length > 0){
          s = Rhs.#ppSeq(this.#body[0]);
          for(let i = 1; i < this.#body.length; i++){
             s = s.concat(' | ', Rhs.#ppSeq(this.#body[i]));
          }
        }else { s = '{}' }
        return s;
    }

    // Converts a sequece of symbols to a string
    static #ppSeq(seq){
        let s = '';
        if(seq != ''){
           for(let o of seq){
               s = s.concat(o.toString());
           }
        }else{
           s = 'eps'
        }
        return s;
    }

}

class Nt {
    lex = '';
    der = [];
    constructor(lx,der=[]){
        this.lex = lx;
        this.der = der;
    }

    toString(){
        if(this.der.length > 0){
           let s = this.lex.concat('_{');
           for(let c of this.der){
              s = s.concat(c);
           }
           s = s.concat('}');
           return s;
        }
        return this.lex;
//        return this.uidStr();
    }

    derivate(sym){
        let sym1 = this.der.slice();
        sym1 = sym1.concat(sym);
        return new Nt(this.lex,sym1);
    }

    uidStr(){
        if(this.der.length > 0){
           let s = this.lex.concat('_');
           for(let c of this.der){
              s = s.concat(c);
           }
           return s;
        }
        return this.lex;
    }

}




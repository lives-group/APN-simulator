import {Rhs,Nt} from "./Rhs.js"

export {Grammar};

class Grammar{
    #prods;
    #startNt;
    #nullables;
    #first;
    #redoFst;
    #redoNull;
    #der;

    /**
     * Creates a grammar without any rules.
     */

    constructor(der=[],nullables=undefined,first=undefined,prods=new Map()){
        this.#prods = prods;
        this.#startNt = null;
        this.#nullables = nullables;
        this.#first= first;
        this.#redoFst = false;
        this.#redoNull = false;
        this.#der = der;
    }

    /** Adds a production to this grammar. Has no effect if the types of the parameters are not respected.
     *  @param {Nt} nt : The name of the non-termial (tipicaly a capital letter).
     *  @param {Rhs}   rhs : A instance of the Rhs objetct that describes the rigth-hand-side of the rule.
     */
    addProdcution(nt, rhs){
        if(rhs instanceof Rhs && typeof nt === "string"){
            this.#prods.set(nt, rhs);
            if(this.#startNt === null){
                this.#startNt = nt;
            }
            this.#nullables = undefined;
            this.#first = undefined;
            this.#redoFst = true;
            this.#redoNull = true;
        }
    }

    /** Defines the name of the starting non-terminal of this grammar.
     * @param {Nt} nt : The name of the non-terminal.
     */
    setStartNt(nt){ this.#startNt = nt; }

    /** Returns the name of the starting non-terminal of this grammar.
     */
    getStartNt(){ return this.#startNt;}

    /** Get a especific right-hand-side of a non-terminal.
     * @param {String} nt : The name of the non-terminal whose righ-hand-side is desired.
     * @returns {Rhs} The right-hand-side objetct of the non-terminal. Returns undefined if
     *          there is no non-terminal with the given name or if the name is not a string.
     */
    ruleOf(nt){
        if(typeof(nt) === 'string'){
            return this.#prods.get(nt);
        }
        return undefined;
    }

    /** Lists all non-terminals on this grammar.
     * @returns {String[]} An array of names defined in this grammar.
     */
    nonTerminals(){
       let nts = [];
       for(let [nt, r] of this.#prods){
              nts.push(nt);
       }
       return nll;
    }

    /* Computes a list of all non-terminals that directly derive
     * the emptty string.
     */
    emptyRules(){
       let nll = new Set();
       for(let [nt, r] of this.#prods){
          if(r.emptyAlternative()){
              nll.add(nt);
          }
       }
       return nll;
    }


   /* Computes a Set of all non-terminals that are reachable from this the start symbol of this grammar.
    *
    */
    reachables(){
       let reachs = new Set();
       reachs.add(this.#startNt);
       let sz = 0;
       while(sz != reachs.size){
          let reachs1 = new Set();
          sz = reachs.size;
          for(let ntName of reachs.keys()){
              let rhs = this.#prods.get(ntName);
              for(let seqs of rhs.getAlternatives() ){
                   for(let s of seqs){
                       if(s instanceof Nt){
                          reachs1.add(s.uidStr());

                       }
                   }
              }
          }
          reachs = reachs.union(reachs1);
       }
       return reachs;
    }

    synthWord(size){
           let wrods = [];
           // 1 Criar uma cópia da gramática.
           // 2 Computar o first da gramática (O First é um mapa).
           // 3 Pegar o first do símbolo de partida.
           // 4 Escolher aleatoriamente um símbolo do first do simbolo de partida.
           // 5 Derive a gramática em relação a esse simbolo.
           // 6 Se o símobolo de partida é anuláve, então a sequencia de simbolos usados
           //     na derivação atual corresponde a uma palavra da gramática.
           //     Salve essa palavra na lista.
           // 7 senão, nada a fazer.
           // 8 Repita a paritir do passo 2.

    }

    prune(){
         let reachs = this.reachables();
         let prods1 = new Map();
         for(let [nt, r] of this.#prods){
              if(reachs.has(nt)){
                  prods1.set(nt,r);
              }
        }
        this.#prods = prods1;
    }

    /** Compute a list of all non-terminals that are nullable. A non-terminal
     * is nullable if it derives the empty string directly or if it
     * is composed only of nullable non-terminals.
     * @return A Set of nullale non-terminal names.
     */
    nullables(){
       if (!this.#redoNull){ return this.#nullables; }
       let nll = (this.#redoNull && this.#nullables != undefined) ? this.#nullables : this.emptyRules();
       let adds = -1;
       let nuls = false; // null sequence
       let nulp = false; // nullable production
       while(nll.size != adds){
          adds = nll.size;
          for(let [nt, r] of this.#prods){
              nulp = false;
              for(let seq of r.getAlternatives()){
                 nuls = true;
                 for(let s of seq){
                   nuls = nuls && ((s instanceof Nt) ? nll.has(s.uidStr()) : s === '')  ;
                }
                nulp = nulp || nuls;
             }
             if(nulp &&  !nll.has(nt)  ){
                 nll.add(nt);
                 adds ++;
            }
          }
       }
       this.#nullables = nll;
       this.#redoNull = false;
       return nll;
    }

    // Computes the First set of this grammar. Returns a map from non-terminal to set of terminals
    // that can firstly derived from this non-terminal.
    first(){
       if (!this.#redoFst){ return this.#first; }
       let ftable = (this.#redoFst && this.#first != undefined) ? this.#first : new Map();
       let nlbs = this.nullables();
       let add0 = -1;
       let add1 = 0;
       for(let [nt, r] of this.#prods){ ftable.set(nt,new Set()); }
       let fst;
       while(add0 != add1){
          add0 = add1;
          for(let [nt, r] of this.#prods){
              fst = new Set();
              for(let seq of r.getAlternatives()){
                let i = 0;
                while( Grammar.#testNullSym(seq[i],nlbs) && (i < seq.length)  ){
                   if(seq[i] instanceof Nt){
                       fst = fst.union(ftable.get(seq[i].uidStr()));
                   }
                   i++;
                }
                if(i < seq.length){
                   if(seq[i] instanceof Nt && ftable.get(seq[i].uidStr()) != undefined ){
                       fst = fst.union( ftable.get(seq[i].uidStr()) );
                   }else{
                       fst.add(seq[i]);
                   }
                }
                add1 = add1  + Grammar.#setUnion(ftable.get(nt),fst);
             }
          }
       }
       this.#first = ftable;
       this.#redoFst = false;
       return ftable;
    }

    /**Derivate this grammar in relation to the symbol 's'.
     *  @param s the symbol to derive for.
     *  @return A new partial derivate Grammar.
     */
    derivate(sym){
        if(typeof sym === 'string' && sym.length === 1){
            let dgrm = new Grammar(this.#der.concat(sym),this.#nullables,this.#first);
            let nulSet = this.nullables();
            for(let [nt, r] of this.#prods){
               let nt1 = nt.indexOf('_') >= 0 ? nt.concat(sym) : nt.concat('_',sym);
               let dr = r.derivate(sym,nulSet);
               if(! dr.isEmptyBody()){
                  dgrm.addProdcution(nt1,dr);
               }
            }
            for(let [nt, r] of this.#prods){dgrm.addProdcution(nt,r);}
            return dgrm;
        }
    }


    static ftable2str(ft){
          let s = ' ---- First Table ----- \n';
          for(let [nt, fset] of ft){
              s = s.concat(nt, ' : ', Grammar.set2str(fset), '\n');
          }
          s = s.concat(" ------- End of table ------");
          return s;
    }

    static #testNullSym( sym, nlbs){
         if(sym instanceof Nt){ return nlbs.has(sym.uidStr()); }
         return sym === '';
    }

    static #setUnion(setc,nset){
        if(nset != undefined){
           let d = nset.difference(setc);
           for(const i of d){
               setc.add(i);
           }
           return d.size;
        }
        return 0;
    }

    static set2str(setObj ){
           let s = "{";
           const iter = setObj.values();
           if(setObj.size > 0){
             s = s.concat(iter.next().value);
             iter.forEach((its) => s = s.concat( ", ", its.toString() ) );
           }
           s = s.concat("}");
           return s;
    }

    ppstr(){
        let s = '';
        for(let [nt, bdy] of this.#prods){
            s = s.concat(nt,' -> ', bdy.ppstr(),'\n');
        }
        return s;
    }

    clone(){
        let grm1 = new Grammar();
        for(let [nt, bdy] of this.#prods){
            grm1.addProdcution(nt,bdy);
        }
        grm1.setStartNt(this.#startNt);
        return grm1;
    }

}




import { APN } from '../APN/APN.js';
import {Transition} from '../APN/transition.js'

export class APNTester{
    constructor(){
        this.apn = new APN();
        this.errors = 0;
    }

    /** 
     * Tests the addState(s) and getStates() funcions on the APN class
     */
    addStates(){
        for(let i=0; i<10; i++){
            this.apn.addState(i);
        }
        if (this.apn.getNumStates() != 10) {
            this.errors++;
            return false
        }else{
            return true;
        }
    }

    /** 
     * Tests the addStateDecor(s) and getDecor(s) funcions on the APN class
     */
    addDecor(){
        let len = this.apn.getNumStates();
        let decor = 10;
        let s = 0;
        for(let i=0; i<len; i++){
            s = this.apn.getStates()[i];
            this.apn.addStateDecor(s,decor);
            if(this.apn.getDecor(s) != 10){
                this.errors++;
                return false;
            }
        }
        return true;
    }

    /** 
     * Tests the removeState(s) and getStates() funcions on the APN class
     */
    remorveStates(){
        let i = Math.random() * 10;
        i = Math.trunc(i);
        let s = this.apn.getStates()[i];
        this.apn.removeState(s);
        if(this.apn.getStates()[i] == s){
            this.errors++;
            return false;
        }else{
            return true;
        }
    }

    /** 
     * Tests the setFinal(s), unsetFinal(s) ,getFinals() and isFinal(s) funcions on the APN class
     */
    testFinal(){
        let i = Math.random() * 10;
        i = Math.trunc(i);
        let s = this.apn.getStates()[i];

        this.apn.setFinal(s);
        this.apn.unsetFinal(s);

        if(this.apn.isFinal(s)){
            this.errors++;
            return false;
        }

        i = Math.random() * 10;
        i = Math.trunc(i);
        s = this.apn.getStates()[i];

        this.apn.setFinal(s);

        if(!this.apn.isFinal(s)){
            this.errors++;
            return false;
        }else{
            return true;
        }
        
    }

    /** 
     * Tests the setInitial(s), unsetInitial(s) ,getInitialStates() and isInitial(s) funcions on the APN class
     */
    testInitial(){
        let i = Math.random() * 10;
        i = Math.trunc(i);
        let s = this.apn.getStates()[i];

        this.apn.setInitial(s);
        this.apn.unsetInitial(s);

        if(this.apn.isInitial(s)){
            this.errors++;
            return false;
        }

        i = Math.random() * 10;
        i = Math.trunc(i);
        s = this.apn.getStates()[i];

        this.apn.setInitial(s);

        if(!this.apn.isInitial(s)){
            this.errors++;
            return false;
        }else{
            return true;
        }
    }


    /** 
     * Tests the all states funcion on the APN class
     */
    states(){
        let result = true;
        result = result && this.addStates();
        result = result && this.addDecor();
        result = result && this.remorveStates();
        result = result && this.testFinal();
        result = result && this.testInitial();
        return result;
    }

    /** 
     * Tests the addTransition(s) funcion on the APN class
     */
    addTransitions(){
        let t;
        let len = this.apn.getNumStates();
        let s = this.apn.getStates()[0];
        for(let i=0; i<len; i++){
            t = new Transition("0", "stkr","stkw",s);
            this.apn.addTransition(i,t);
        }
    }

    /** 
     * Tests the removeState(s) and getStates() funcions on the APN class
     */
    remorveTransitions(){
        let t;
        let s = Math.random() * 10;
        s = Math.trunc(s);
        s = this.apn.getStates()[s];
        t = new Transition("0", "stkr","stkw",s);
        this.apn.removeTransition(s,t);
    }


    /** 
     * Tests the all transitions funcion on the APN class
     */
    transitions(){
        this.addTransitions();
        this.remorveTransitions();
    }

    /** 
     * Test an specific APN knowed
     */
    TestAnAPN(){
        let t;
        this.apn.addState(0);
        this.apn.addState(1);

        t = new Transition("1", "","u",1);
        this.apn.addTransition(0,t);
        t = new Transition("0", "","z",1);
        this.apn.addTransition(0,t);
        t = new Transition("0", "u","",1);
        this.apn.addTransition(1,t);
        t = new Transition("0", "z","zz",1);
        this.apn.addTransition(1,t);
        t = new Transition("1", "u","uu",1);
        this.apn.addTransition(1,t);
        t = new Transition("1", "z","",1);
        this.apn.addTransition(1,t);
        t = new Transition("", "","",0);
        this.apn.addTransition(1,t);
    }

    /** 
     * Run all tests of funcions on the APN class
     */
    test(){
        console.log("states tests: "+this.states());
        console.log("num of errors: "+this.errors);
        
        this.transitions();
        this.states();
        
        this.apn = new APN();
        this.TestAnAPN();
        this.apn.delta(0, "0" , "z");
    }
}
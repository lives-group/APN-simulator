import {APN} from './APN.js'
import {Transition} from './transition.js'

export class APNTester{
    constructor(){
        this.apn = new APN();
    }

    /** 
     * Tests the addState(s) and getStates() funcions on the APN class
     */
    addStates(){
        for(let i=0; i<10; i++){
            this.apn.addState(i);
        }
        console.log(this.apn.getStates());
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
            console.log(this.apn.getDecor(s));     
        }
    }

    /** 
     * Tests the removeState(s) and getStates() funcions on the APN class
     */
    remorveStates(){
        let s = Math.random() * 10;
        s = Math.trunc(s);
        s = this.apn.getStates()[s];
        this.apn.removeState(s);
        console.log(this.apn.getStates());
    }

    /** 
     * Tests the setFinal(s), unsetFinal(s) ,getFinals() and isFinal(s) funcions on the APN class
     */
    testFinal(){
        let s = Math.random() * 10;
        s = Math.trunc(s);
        s = this.apn.getStates()[s];

        this.apn.setFinal(s);
        this.apn.unsetFinal(s);

        console.log(!this.apn.isFinal(s));

        s = Math.random() * 10;
        s = Math.trunc(s);
        s = this.apn.getStates()[s];

        this.apn.setFinal(s);

        console.log(this.apn.getFinals());
    }

    /** 
     * Tests the setInitial(s), unsetInitial(s) ,getInitialStates() and isInitial(s) funcions on the APN class
     */
    testInitial(){
        let s = Math.random() * 10;
        s = Math.trunc(s);
        s = this.apn.getStates()[s];

        this.apn.setInitial(s);
        this.apn.unsetInitial(s);

        console.log(!this.apn.isInitial(s));

        s = Math.random() * 10;
        s = Math.trunc(s);
        s = this.apn.getStates()[s];

        this.apn.setInitial(s);

        console.log(this.apn.getInitialStates());
    }


    /** 
     * Tests the all states funcion on the APN class
     */
    states(){
        this.addStates();
        this.addDecor();
        this.remorveStates();
        this.testFinal();
        this.testInitial();
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
        this.states();
        this.transitions();
        this.states();
        
        this.apn = new APN();
        this.TestAnAPN();
        this.apn.delta(0, "0" , "z");
    }
}
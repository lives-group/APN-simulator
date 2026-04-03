import {APN} from '../APN.js'
import {Transition} from '../transition.js'
import{APNRunner} from '../APNRunner.js'

export class RunnerTester{
    constructor(){
        this.apn = new APN();
    }
    /** 
     * Create an APN that accepts a linguage with same number of 0 and 1
     */
    exe1(str){
        this.apn.addState(0);
        this.apn.addState(1);
        this.apn.setFinal(0);
        this.apn.setInitial(0);

        this.apn.addTransition(0,new Transition("1", "","u",1));
        this.apn.addTransition(0,new Transition("0", "","z",1));
        this.apn.addTransition(1,new Transition("0", "u","",1));
        this.apn.addTransition(1,new Transition("0", "z","zz",1));
        this.apn.addTransition(1,new Transition("1", "u","uu",1));
        this.apn.addTransition(1,new Transition("1", "z","",1));
        this.apn.addTransition(1,new Transition("", "","",0));

        this.runner = new APNRunner(this.apn,str);
        this.runner.runUntilAcc('FS',1000);
    }
    /** 
     * Test exe1() APN
     */
    test1(){
        let str = "";
        let result = true;

        this.exe1(str);
        result = this.runner.acceptedFS();
        return result;
    }
    /** 
     * Create an APN that don't accepts anything
     */
    exe2(str){
        this.apn = new APN();
        this.apn.addState(0);
        this.apn.setInitial(0);
        this.apn.addTransition(0,new Transition("1", "","",0));

        this.runner = new APNRunner(this.apn,str);
        this.runner.runUntilAcc('FS',1000);
        
    }
    /** 
     * Test exe2() APN
     */
    test2(){
        let str = "";
        let result = true;

        for(let i = 0; i<10; i++){
            this.exe2(str);
            result = result && !this.runner.acceptedFS();
            str = str+"0";
        }
        return result;
    }
    /** 
     * Create an APN that accepts everything
     */
    exe3(str){
        this.apn = new APN();
        this.apn.addState(0);
        this.apn.setInitial(0);
        this.apn.setFinal(0);
        this.apn.addTransition(0,new Transition("1", "","",0));
        this.apn.addTransition(0,new Transition("0", "","",0));

        this.runner = new APNRunner(this.apn,str);
        this.runner.runUntilAcc('FS',1000);
    }
    /** 
     * Test exe3() APN
     */
    test3(){
        let str = "";
        let result = true;
        let aux;

        for(let i = 0; i<10; i++){
            this.exe3(str);
            result = result && this.runner.acceptedFS();
            aux = i % 2;
            str = ""+str+aux;
        }
        return result;
    }
    /** 
     * Create an APN that accept an empty stack
     */
    exe4(str){
        this.apn = new APN();
        this.apn.addState(0);
        this.apn.setInitial(0);
        this.apn.setFinal(0);
        this.apn.addTransition(0,new Transition("1", "x","",0));
        this.apn.addTransition(0,new Transition("0", "","x",0));

        this.runner = new APNRunner(this.apn,str);
        this.runner.runUntilAcc('S',1000);
    }
    /** 
     * Test exe4() APN
     */
    test4(){
        let str = "";
        let result = true;

        for(let i = 0; i<5; i++){
            this.exe4(str);
            result = result && this.runner.acceptedS();
            str = str+"01";
        }
        return result;
    }
    /** 
     * Create an APN that accept an full stack
     */
    exe5(str){
        this.apn = new APN();
        this.apn.addState(0);
        this.apn.setInitial(0);
        this.apn.setFinal(0);
        this.apn.addTransition(0,new Transition("1", "","x",0));
        this.apn.addTransition(0,new Transition("0", "","x",0));

        this.runner = new APNRunner(this.apn,str);
        this.runner.runUntilAcc('F',1000);
    }
    /** 
     * Test exe5() APN
     */
    test5(){
        let str = "";
        let result = true;
        let aux;

        for(let i = 0; i<10; i++){
            this.exe5(str);
            result = result && this.runner.acceptedF();
            aux = i % 2;
            str = ""+str+aux;
        }
        return result;
    }
    /** 
    * Create an APN that accept an anbn language
    */
    exe6(str){
        this.apn = new APN();
        this.apn.addState(0);
        this.apn.setInitial(0);
        this.apn.setFinal(0);
        this.apn.addTransition(0,new Transition("1", "x","",0));
        this.apn.addTransition(0,new Transition("0", "","x",0));

        this.runner = new APNRunner(this.apn,str);
        this.runner.runUntilAcc('FS',1000);
    }
    /** 
     * Test exe6() APN
     */
    test6(){
        let str = "";
        let result = true;
        let aux;

        for(let i = 0; i<10; i++){
            this.exe6(str);
            result = result && this.runner.acceptedFS();
            str="0"+str+"1";
        }
        return result;
    }
    /** 
    * Create an APN that accept an language with the same length of word and stack
    */
    exe7(str){
        this.apn = new APN();
        this.apn.addState(0);
        this.apn.setInitial(0);
        this.apn.setFinal(0);
        this.apn.addTransition(0,new Transition("1", "","1",0));
        this.apn.addTransition(0,new Transition("0", "","0",0));

        this.runner = new APNRunner(this.apn,str);
        this.runner.runUntilAcc('F',1000);
    }
    /** 
     * Test exe7() APN
     */
    test7(){
        let str = "";
        let result = true;
        let aux;

        for(let i = 0; i<10; i++){
            this.exe7(str);
            result = result && this.runner.acceptedF();
            aux = i % 2;
            str = ""+str+aux;
        }
        return result;
    }
    /** 
     * Execute all APNRunner Tests
     */
    tests(){
        console.log("teste newton: "+this.test1());
        console.log("exe2: "+this.test2());
        console.log("exe3: "+this.test3());
        console.log("exe4: "+this.test4());
        console.log("exe5: "+this.test5());
        console.log("exe6: "+this.test6());
        console.log("exe7: "+this.test7());
    }
}
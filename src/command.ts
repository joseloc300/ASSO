import { LinkedList } from 'linked-list-typescript';
import {MasterExpression} from './interpreter'

class Command {
    private commandStack : LinkedList<Memento> = new LinkedList<Memento>();
    private redoStack : LinkedList<Memento> = new LinkedList<Memento>();
 
    public execute(context: String) : void{
        var me = new MasterExpression();
        if(!me.interpret(context)) {
            this.redraw();
            console.log("Error interpreting command! Redrawing previous state");
            return;
        }
        var currentCommand: Memento;
        if(this.commandStack.length == 0)
            currentCommand = new Memento(context);
        else
            currentCommand = new Memento(context, this.commandStack.head)

        this.commandStack.prepend(currentCommand);
        this.redoStack = new LinkedList<Memento>();
    }
 
    public undo() : void {
       if (this.commandStack.length == 0)
          return;
       var m : Memento = this.commandStack.removeHead();
       this.redoStack.prepend(m)
    }
 
    public redo() : void {
       if (this.redoStack.length == 0)
          return;
        var m : Memento = this.redoStack.removeHead();
        this.commandStack.prepend(m)
    }

    public getCurrentState() : Memento {
        return this.commandStack.head;
    }

    public redraw() : void {
        var m : Memento = this.commandStack.head;
        var me = new MasterExpression();
        for(var context in m.getContextList()) {
            me.interpret(context);
        }
    }
 }

 class Memento {
    private contextList : String[] = [];

    public constructor(context: String, previous?: Memento) {
        if(previous != null)
            this.contextList = previous.getContextList();
        this.contextList.push(context);
    }
 
    public getContextList() : String[] {
       return this.contextList;
    }
 }
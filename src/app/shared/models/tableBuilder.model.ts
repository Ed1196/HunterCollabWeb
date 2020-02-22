export class TableBuilder {
    userName: string;
    list: Knows[]; 

    constructor(name: string){
        this.userName = name;
        this.list = [];
    }

    setKnown(nameOf: string, knowsOf: boolean){
        this.list.push(
            {
                nameOf: nameOf,
                knows: knowsOf
            }
        )
    }

    



}

interface Knows {
    nameOf: string;
    knows: boolean;
}
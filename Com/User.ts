export class User {
    public ConnID: string = "";
    public UserName: string = "";
    public UserID: string = "";
    public UserSpace: string = "";
    public Room: string = "";
    constructor(_connID: string) {
        this.ConnID = _connID;
    }
}
export class UserGroup{ 
    private _list:{[key: string]: User}={}
    
    //获取当前实例的用户列表
    public all():{[key: string]: User}{
        return this._list;
    }

    public get(connId:string):User{
        return this._list[connId];
    }

    public addOrUpdateUser(u:User):void{
        this._list[u.ConnID]=u;
    }

    public deleteUser(connId:string):void{
        delete this._list[connId];
    }

    public hasUser(u:User): boolean {
        if (this._list[u.ConnID] == undefined)
            return false;
        else
            return true;
    }
 }


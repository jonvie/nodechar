"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class User {
    constructor(_connID) {
        this.ConnID = "";
        this.UserName = "";
        this.UserID = "";
        this.UserSpace = "";
        this.Room = "";
        this.ConnID = _connID;
    }
}
exports.User = User;
class UserGroup {
    constructor() {
        this._list = {};
    }
    all() {
        return this._list;
    }
    get(connId) {
        return this._list[connId];
    }
    addOrUpdateUser(u) {
        this._list[u.ConnID] = u;
    }
    deleteUser(connId) {
        delete this._list[connId];
    }
    hasUser(u) {
        if (this._list[u.ConnID] == undefined)
            return false;
        else
            return true;
    }
}
exports.UserGroup = UserGroup;
//# sourceMappingURL=User.js.map
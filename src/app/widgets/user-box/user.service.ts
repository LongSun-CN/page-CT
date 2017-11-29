import {User} from "./user";
import {Injectable} from "@angular/core";
import {ReplaySubject} from "rxjs/Rx";
import {BaseService} from "../../shared/services/base.service";
import {Observable} from "rxjs/Observable";
import {clearCachedHttpData} from "../../shared/services/httpx.interceptor";

@Injectable()
export class UserService {

    public currentUser: ReplaySubject<User> = new ReplaySubject<User>(1);
    public user: User;

    constructor(private baseService: BaseService) {
    }

    public setCurrentUser(user: User) {
        this.currentUser.next(user);
        this.user = user;
    }

    public hasPermission$(key: string): Observable<boolean> {
        return this.currentUser.map((user: User) => {
            let newpermissons = {};
            user.action.map(item => {
                item.remark && (newpermissons[item.remark] = true);
            });
            user.menu.map(item => {
                item.remark && (newpermissons[item.remark] = true);
            });
            let permissions = Object.assign({}, newpermissons);
            return !!permissions[key];
        });
    }

    public hasPermission(key: string): boolean {
        let newpermissons = {};
        this.user.action.map(item => {
            item.remark && (newpermissons[item.remark] = true);
        });
        this.user.menu.map(item => {
            item.remark && (newpermissons[item.remark] = true);
        });
        let permissions = Object.assign({}, newpermissons);
        return !!permissions[key];
    }

    public logout() {
        clearCachedHttpData();
        setTimeout(() => {
            this.baseService.logout().subscribe((result) => {
                // alert('logout' + JSON.stringify(result));
                // // window.location.reload();
            });
        }, 1000);
    }

    public getDefaultRouterPath(): string {
        let modules: string = this.user.modules.map(module => module.code).join('|');
        let moduleId = modules.includes('bbs') ? 'bbs' : this.user.moduleId;
        return moduleId;
    }
}

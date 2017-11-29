export class User {
    public moduleId: string;
    public account: string;
    public accountId: string;
    public companyId: string;
    public name: string;
    public jobNumber: string;
    public mail: string;
    public phoneNumber: string;
    public action: [any];
    public menu: [any];
    public modules: [module];
    public originalUser: any;
    public password: string;
    public platformAccessCodes: [any];
    public platformLanguage: string;
    public platformList: [any];

    public constructor(user: any = {}) {
        this.moduleId = user.moduleId || 'bbs';
        this.name = user.name || '';
        this.jobNumber = user.jobNumber || '';
        this.mail = user.mail || '';
        this.phoneNumber = user.phonenumber || '';
        this.originalUser = user.originalUser || null;
        this.account = user.account;
        this.accountId = user.accountId;
        this.companyId = user.componentId;
        this.action = user.action;
        this.modules = user.modules;
        this.password = user.password;
        this.platformAccessCodes = user.platformAccessCodes;
        this.platformLanguage = user.platformLanguage;
        this.platformList = user.platformList;
        this.menu = user.menu;
    }
}

export class module {
    name: string;
    code: string;
}

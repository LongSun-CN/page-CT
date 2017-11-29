import {Injectable, OnInit} from "@angular/core";
import {UserService} from "../../widgets/user-box/user.service";
import {User} from "../../widgets/user-box/user";
import {TranslateService} from "@ngx-translate/core";

const langs = ['en', 'fr', 'ru', 'he', 'zh'];

@Injectable()
export class AdminLTETranslateService implements OnInit {
    private currentUser: User;

    constructor(private userService: UserService, private translate: TranslateService) {
        translate.addLangs(langs);
        translate.setDefaultLang('en');

        this.userService.currentUser.subscribe((user: User) => {
            this.currentUser = user;
        });
    }

    public ngOnInit() {
        // TODO
    }

    public getTranslate(): TranslateService {
        return this.translate;
    }

}

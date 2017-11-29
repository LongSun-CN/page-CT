import {ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation} from "@angular/core";
import {BaseService} from "../../../shared/services/base.service";
import {UserService} from "../../user-box/user.service";

@Component({
    selector: '[switch-log]',
    templateUrl: './switch-log.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['./switch-log.component.css']
})
export class SwitchLogComponent implements OnInit {

    menus: any[];

    constructor(private userService: UserService,
                private baseService: BaseService) {
    }

    ngOnInit() {
        this.menus = this.baseService.getMenus(this.userService.user.menu, 'logcenter');
    }
}
import {ChangeDetectionStrategy, Component, ElementRef, Input, OnDestroy, OnInit} from "@angular/core";
import {UserService} from "../user-box/user.service";

@Component({
    selector: '[ourpalm-no-permission]',
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <ng-content></ng-content>
    `
})
export class OurpalmNoPermissionComponent implements OnInit, OnDestroy {

    @Input('ourpalm-no-permission')
    permission: string;

    display: string;

    constructor(private userService: UserService, private el: ElementRef) {
        this.display = this.el.nativeElement.style.display;
    }

    ngOnInit() {
        this.el.nativeElement.style.display = this.userService.hasPermission(this.permission) ? "none" : this.display;
    }

    ngOnDestroy() {
    }
}

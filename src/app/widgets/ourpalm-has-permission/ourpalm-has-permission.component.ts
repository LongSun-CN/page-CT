import {ChangeDetectionStrategy, Component, ElementRef, Input, OnDestroy, OnInit} from "@angular/core";
import {UserService} from "../user-box/user.service";

@Component({
    selector: '[ourpalm-has-permission]',
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <ng-content></ng-content>
    `
})
export class OurpalmHasPermissionComponent implements OnInit, OnDestroy {

    @Input('ourpalm-has-permission')
    permission: string;
    display: string;

    constructor(private userService: UserService, private el: ElementRef) {
        this.display = this.el.nativeElement.style.display;
    }

    ngOnInit() {
        this.el.nativeElement.style.display = !this.userService.hasPermission(this.permission) ? "none" : this.display;
    }

    ngOnDestroy() {
    }

}

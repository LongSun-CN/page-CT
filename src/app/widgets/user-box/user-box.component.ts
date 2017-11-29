import {ChangeDetectionStrategy, ChangeDetectorRef, Component, TemplateRef} from "@angular/core";
import {User} from "./user";
import {UserService} from "./user.service";
import {BsModalRef, BsModalService} from "ngx-bootstrap/modal";
import {ToastService} from "../../shared/services/toast.service";
import {BaseService} from "../../shared/services/base.service";
import {isEmpty} from "ramda";

@Component({
    selector: '.userBox',
    changeDetection: ChangeDetectionStrategy.OnPush,
    styleUrls: ['./user-box.component.css'],
    templateUrl: './user-box.component.html'
})
export class UserBoxComponent {

    user: any = {};
    modalRef: BsModalRef;

    currentUser: User = new User();

    constructor(private userServ: UserService,
                private baseService: BaseService,
                private toastService: ToastService,
                private changeDetectorRef: ChangeDetectorRef,
                private modalService: BsModalService) {
        // se connecter au modif du user courant
        this.userServ.currentUser.subscribe((user: User) => {
            this.currentUser = user;
            this.changeDetectorRef.markForCheck();
        });
    }

    openModifyPasswordDialog(template: TemplateRef<any>) {
        this.user = {oldPassword: '', newPassword: '', rePassword: ''};
        this.modalRef = this.modalService.show(template);
    }

    modifyPassword() {
        if (isEmpty(this.user.oldPassword)) {
            return this.toastService.translate('error', '请输入旧密码');
        }
        if (isEmpty(this.user.newPassword)) {
            return this.toastService.translate('error', '请输入新密码');
        }
        if (isEmpty(this.user.rePassword)) {
            return this.toastService.translate('error', '请输入确认密码');
        }
        if (this.user.rePassword != this.user.rePassword) {
            return this.toastService.translate('error', '两次密码不一致');
        }

        this.baseService.modifyPassword(this.user.oldPassword, this.user.newPassword).subscribe((result) => {
            if (result.status == '0') {
                this.modalRef.hide();
                this.toastService.translate('success', '修改成功');
            } else {
                this.toastService.pop('error', result.desc);
            }
        });
    }

    public logout = (): void => {
        this.userServ.logout();
    }
}

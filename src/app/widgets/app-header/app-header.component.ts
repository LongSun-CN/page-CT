import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit, ViewEncapsulation} from "@angular/core";
import {Store} from "@ngrx/store";
import {Observable} from "rxjs/Observable";
import {ProductDetailState} from "../../shared/reducers/product-detail.reducer";
import {ProductLanguageState} from "../../shared/reducers/product-language.reducer";
import {BaseService} from "../../shared/services/base.service";
import {UserService} from "../user-box/user.service";

@Component({
    selector: 'app-header',
    styleUrls: ['./app-header.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    templateUrl: './app-header.component.html'
})
export class AppHeaderComponent {


}

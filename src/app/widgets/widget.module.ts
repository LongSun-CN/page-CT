import {ModuleWithProviders, NgModule} from "@angular/core";
import {UserBoxComponent} from "./user-box/user-box.component";
import {TasksBoxComponent} from "./tasks-box/tasks-box.component";
import {NotificationBoxComponent} from "./notification-box/notification-box.component";
import {MessagesBoxComponent} from "./messages-box/messages-box.component";
import {MenuAsideComponent} from "./menu-aside/menu-aside.component";
import {AppFooterComponent} from "./app-footer/app-footer.component";
import {BreadcrumbComponent} from "./breadcrumb/breadcrumb.component";
import {AdminLTETranslateService} from "../shared/services/translate.service";
import {NotificationService} from "./notification-box/notification.service";
import {MessagesService} from "./messages-box/messages.service";
import {BreadcrumbService} from "./breadcrumb/breadcrumb.service";
import {AppHeaderComponent} from "./app-header/app-header.component";
import {OurpalmDatePickerComponent} from "./ourpalm-datepicker/ourpalm-datepicker.component";
import {datepicker} from "./ourpalm-datepicker/datepicker";
import {OurpalmInputImgReader} from "./input-img-previewer";
import {OurpalmLoadingComponent} from "./ourpalm-loading/ourpalm-loading.component";
import {OurpalmLoadingService} from "./ourpalm-loading/ourpalm-loading.service";
import {OurpalmHasPermissionComponent} from "./ourpalm-has-permission/ourpalm-has-permission.component";
import {OurpalmNoPermissionComponent} from "./ourpalm-has-permission/ourpalm-no-permission.component";
import {OurpalmAutocompleteComponent} from "./ourpalm-autocomplete/ourpalm-autocomplete.component";
import {GwSelectAutoKefuComponentComponent} from "./ourpalm-autocomplete/gw-select-complete-kefu-component";
import {DateFormatterPipe} from "./ourpalm-pipes/date-formatter.pipe";
import {KefuService} from "./ourpalm-autocomplete/ourpalm-kefucomplete.server";
import {OurpalmBoxMultiFormComponent} from "./ourpalm-box/ourpalm-box-multiform.component";
import {OurpalmBoxComponent} from "./ourpalm-box/ourpalm-box.component";
import {FontColorPipe} from "./ourpalm-pipes/font-color.pipe";
import {SharedModule} from "../shared/shared.module";
import {LanguagePipe} from "./ourpalm-pipes/language.pipe";
import {FullscreenSelectorDirective, ToggleFullscreenDirective} from "./fullscreen/toggle-fullscreen.directive";
import {ProductPipe} from "./ourpalm-pipes/product.pipe";
import {LanProTypeService} from "./language-producttype/language-producttype.service";
import {uiSelect} from "./ui-select-auto/ui-select-auto.component";
import {UiselectAutoService} from "./ui-select-auto/ui-select-auto.service";
import {SwitchLogComponent} from "./app-header/switch-log/switch-log.component";
import {OurpalmOnlyNumbersDirective} from "./ourpalm-only-numbers/ourpalm-only-numbers.directive"
import {LanguageProducttypeComponent} from "./language-producttype/language-producttype.component";
import {RouterModule} from "@angular/router";

@NgModule({
    imports: [
        SharedModule,
        RouterModule
    ],
    declarations: [
        BreadcrumbComponent,
        AppFooterComponent,
        MenuAsideComponent,
        MessagesBoxComponent,
        NotificationBoxComponent,
        TasksBoxComponent,
        UserBoxComponent,
        AppHeaderComponent,
        OurpalmDatePickerComponent,
        OurpalmLoadingComponent,
        OurpalmInputImgReader,
        OurpalmHasPermissionComponent,
        OurpalmNoPermissionComponent,
        OurpalmHasPermissionComponent,
        OurpalmAutocompleteComponent,
        DateFormatterPipe,
        OurpalmBoxComponent,
        OurpalmBoxMultiFormComponent,
        GwSelectAutoKefuComponentComponent,
        FontColorPipe,
        LanguagePipe,
        ProductPipe,
        ToggleFullscreenDirective,
        FullscreenSelectorDirective,
        SwitchLogComponent,
        OurpalmOnlyNumbersDirective,
        ...uiSelect,
        LanguageProducttypeComponent
    ],
    providers: [
        BreadcrumbService,
        MessagesService,
        NotificationService,
        AdminLTETranslateService,
        datepicker,
        OurpalmLoadingService,
        DateFormatterPipe,
        KefuService,
        LanProTypeService,
        UiselectAutoService
    ],
    exports: [
        BreadcrumbComponent,
        AppFooterComponent,
        MenuAsideComponent,
        MessagesBoxComponent,
        NotificationBoxComponent,
        TasksBoxComponent,
        UserBoxComponent,
        AppHeaderComponent,
        OurpalmDatePickerComponent,
        OurpalmLoadingComponent,
        OurpalmInputImgReader,
        OurpalmHasPermissionComponent,
        OurpalmAutocompleteComponent,
        OurpalmHasPermissionComponent,
        OurpalmNoPermissionComponent,
        DateFormatterPipe,
        OurpalmBoxComponent,
        OurpalmBoxMultiFormComponent,
        GwSelectAutoKefuComponentComponent,
        FontColorPipe,
        LanguagePipe,
        ProductPipe,
        ToggleFullscreenDirective,
        FullscreenSelectorDirective,
        OurpalmOnlyNumbersDirective,
        ...uiSelect,
    ]
})
export class WidgetModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: WidgetModule
        };
    }
}

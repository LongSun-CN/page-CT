import {BrowserModule} from "@angular/platform-browser";
import {NgModule} from "@angular/core";
import {AppComponent} from "./app.component";
import {SharedModule} from "./shared/shared.module";
import {WidgetModule} from "./widgets/widget.module";
import {reducer} from "./shared/reducers/index";
import {StoreModule} from "@ngrx/store";
import {BaseService} from "./shared/services/base.service";
import {UserService} from "./widgets/user-box/user.service";
import {HttpService} from "./shared/services/httpx.service";
import {ToastService} from "./shared/services/toast.service";
import {CachedHttpInterceptor, ServerMaskInterceptor, ServerURLInterceptor} from "./shared/services/httpx.interceptor";
import {InterceptorService} from "ng2-interceptors";
import {RequestOptions, XHRBackend} from "@angular/http";
import {StoreDevtoolsModule} from "@ngrx/store-devtools";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {CTModule} from "./ct/ct.module";
import {AppRoutingModule} from "./app-routing.module";
import {RouterModule} from '@angular/router';
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";

export function interceptorFactory(xhrBackend: XHRBackend, requestOptions: RequestOptions, URLInterceptor: ServerURLInterceptor, MaskInterceptor: ServerMaskInterceptor, ManageredLocalStorageInterceptor: CachedHttpInterceptor) {
    let service = new InterceptorService(xhrBackend, requestOptions);
    service.addInterceptor(URLInterceptor);
    service.addInterceptor(MaskInterceptor);
    service.addInterceptor(ManageredLocalStorageInterceptor);
    return service;
}

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        NgbModule.forRoot(),
        SharedModule.forRoot(),
        WidgetModule.forRoot(),
        /* 在全局初始化store */
        StoreModule.provideStore(reducer),
        /* 添加chrome调试工具 */
        StoreDevtoolsModule.instrumentOnlyWithExtension(),
        CTModule,
        AppRoutingModule,
        RouterModule
        // BBSModule,
        // LogCenterModule,
        // kfqaModule,
        // PackageModule,
        // MisModule
    ],
    providers: [
        BaseService,
        UserService,
        HttpService,
        ToastService,
        ServerURLInterceptor,
        ServerMaskInterceptor,
        CachedHttpInterceptor,
        {
            provide: InterceptorService,
            useFactory: interceptorFactory,
            deps: [XHRBackend, RequestOptions, ServerURLInterceptor, ServerMaskInterceptor, CachedHttpInterceptor]
        }
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}

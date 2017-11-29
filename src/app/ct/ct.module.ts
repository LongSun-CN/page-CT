import {NgModule} from "@angular/core";
import {WidgetModule} from "../widgets/widget.module";
import {declare_components} from "./pages/index";
import {SharedModule} from "../shared/shared.module";
import {routing} from "./ct-routing.module";
import {RouterModule} from "@angular/router";
import {NgbModalModule} from "@ng-bootstrap/ng-bootstrap";

@NgModule({
    imports: [
        RouterModule,
        WidgetModule,
        SharedModule,
        NgbModalModule,
        routing
    ],
    declarations: [
        ...declare_components
    ]
    /*providers: [
        ...services
    ]*/
})
export class CTModule {
}

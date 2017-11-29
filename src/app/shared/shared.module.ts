import {ModuleWithProviders, NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {BsDropdownModule, ModalModule, TabsModule, TooltipModule} from "ngx-bootstrap";
import {TranslateModule} from "@ngx-translate/core";
import {HttpModule} from "@angular/http";
import {SelectModule} from "ng2-select";
import {OurpalmTableModule} from "ngx-ourpalm-table";
import {OurpalmFormModule} from "ngx-ourpalm-form";
import {ToasterModule} from "angular2-toaster";
import {PopoverModule} from "ngx-bootstrap/popover";
import {OurpalmCKEditorModule} from "ngx-ourpalm-ckeditor";
import {TagInputModule} from "ngx-chips";
import {GlowwormModule} from "glowworm";
import {DndModule} from "ng2-dnd";
import {StoreModule} from "@ngrx/store";

// // AoT requires an exported function for factories
// export function createTranslateLoader(http: Http) {
//     return new TranslateHttpLoader(http, './assets/i18n/', '.json');
// }
//
// TranslateModule.forRoot({
//     loader: {
//         provide: TranslateLoader, useFactory: (createTranslateLoader), deps: [Http]
//     },
//     isolate: false
// });

let MODULES_FOR_ROOT = [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    ToasterModule,
    StoreModule,
    TooltipModule.forRoot(),
    ModalModule.forRoot(),
    TabsModule.forRoot(),
    BsDropdownModule.forRoot(),
    TranslateModule.forRoot(),
    SelectModule,
    TagInputModule,
    OurpalmCKEditorModule,
    DndModule.forRoot(),
    OurpalmTableModule.forRoot(),
    OurpalmFormModule,
    PopoverModule.forRoot(),
    GlowwormModule.forRoot(),
];

let MODULES_FOR_CHILD = [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    StoreModule,
    ToasterModule,
    TooltipModule,
    PopoverModule,
    ModalModule,
    TabsModule,
    BsDropdownModule,
    TranslateModule,
    DndModule,
    SelectModule,
    TagInputModule,
    OurpalmCKEditorModule,
    OurpalmTableModule,
    OurpalmFormModule,
    GlowwormModule,
];

@NgModule({
    imports: MODULES_FOR_ROOT,
    exports: MODULES_FOR_CHILD
})
export class SharedRootModule {
}

@NgModule({
    exports: MODULES_FOR_CHILD
})
export class SharedModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: SharedRootModule
        };
    }
}

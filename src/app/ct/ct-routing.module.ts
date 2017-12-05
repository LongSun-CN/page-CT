import {Routes, RouterModule} from '@angular/router';
import {DeviceListComponent} from "./pages/device/list/device-list.component";
import {DeviceOperateComponent} from "./pages/device/operate/device-operate.component";
import {ModuleWithProviders} from "@angular/core";
import {DeviceComponent} from "./pages/device/device.component";
import {ScriptListComponent} from "./pages/script/script-list.component";

export const ct_routing: Routes = [
    {
        path: '',
        children: [
            {
                path: 'device',
                component: DeviceComponent,
                children: [
                    {path: 'list', component: DeviceListComponent},
                    {path: 'operate', component: DeviceOperateComponent}
                ]
            },
            {
                path: 'script',
                component: ScriptListComponent,
            }
        ]
    }
];

export const routing: ModuleWithProviders = RouterModule.forChild(ct_routing);

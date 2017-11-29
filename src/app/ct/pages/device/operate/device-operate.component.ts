import {Component} from '@angular/core';
import {ActivatedRoute} from "@angular/router";

@Component({
    selector: 'device-operate',
    templateUrl: './device-operate.component.html',
    styleUrls: ['./device-operate.component.scss']
})

export class DeviceOperateComponent {

    name: String;
    id: String;

    constructor(private activatedRoute: ActivatedRoute) {
        activatedRoute.queryParams.subscribe(queryParams => {
            this.name = queryParams.name;
            this.id = queryParams.id;
        });
    }
}

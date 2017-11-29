import {Component, OnDestroy} from "@angular/core";
import {BreadcrumbService} from "./breadcrumb.service";
import {Subscription} from "rxjs";

@Component({
    selector: 'app-breadcrumb',
    templateUrl: './breadcrumb.component.html'
})
export class BreadcrumbComponent implements OnDestroy {

    display: boolean = false;
    header: string = '';
    description: string = '';
    levels: Array<any> = [];

    subscription$: Subscription;

    constructor() {
        this.subscription$ = BreadcrumbService.current.subscribe((data) => {
            this.display = data.display;
            this.header = data.header;
            this.description = data.description;
            this.levels = data.levels;
        });
    }

    ngOnDestroy(): void {
        this.subscription$.unsubscribe();
    }
}

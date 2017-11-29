import {Injectable} from "@angular/core";
import {ReplaySubject} from "rxjs";

interface Breadcrumb {
    description?: string,
    display: boolean,
    header?: string,
    levels?: any[];
    // levels: [
    //     {
    //         icon: 'clock-o',
    //         link: ['/'],
    //         title: 'Default'
    //     }
    //     ]
}

@Injectable()
export class BreadcrumbService {

    public static current: ReplaySubject<any> = new ReplaySubject(1);

    public static set(data: Breadcrumb) {
        BreadcrumbService.current.next(data);
    }

}

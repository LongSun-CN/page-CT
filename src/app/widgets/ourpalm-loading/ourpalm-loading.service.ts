/**
 * Created by admin on 2017/6/26.
 */
import {Injectable} from "@angular/core";
import {Subject} from "rxjs/Subject";
import {ReplaySubject} from "rxjs/ReplaySubject";

@Injectable()
export class OurpalmLoadingService {

    public currentState: Subject<number> = new ReplaySubject<number>();

    show() {
        this.currentState.next(1);
    }

    hide() {
        this.currentState.next(-1);
    }
}

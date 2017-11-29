import {Injectable} from "@angular/core";
import {Toast, ToasterService} from "angular2-toaster";
import {TranslateService} from "@ngx-translate/core";
import {Subject} from "rxjs/Subject";

@Injectable()
export class ToastService {

    private subject: Subject<any>;

    constructor(private  toastService: ToasterService,
                private  traslateService: TranslateService) {
        this.subject = new Subject();
        this.subject
            .asObservable()
            //过滤相同的内容 TODO 这里先这么写，不知道该怎么写了，正常应该是相同的内容加上频率限制，如限制一次toast多个用户未登录，限制一次toast多个没有权限
            // .distinctUntilChanged((v1: any, v2: any) => {
            //     if (v1 && v2) {
            //         if (v1.type == v2.type && v1.title == v2.title && v1.body == v2.body) {
            //             return true;
            //         }
            //     }
            //     return false;
            // })
            .subscribe((v: any) => {
                if (v) {
                    this.toastService.pop(v.type, v.title, v.body);
                }
            });
    }

    translate(type: string, titleKey: string = '', bodyKey: string = '') {
        this.traslateService.get([titleKey, bodyKey]).subscribe(result => {
            this.toastService.pop(type, result[titleKey], result[bodyKey]);
        });
    }

    pop(type: string | Toast, title?: string, body?: string) {
        this.subject.next({
          type: type,
        title: title,
       body: body
        });
        // this.toastService.pop(type, title, body);
    }

    // popAsync(type: string | Toast, title?: string, body?: string): Observable<Toast> {
    //     return this.toastService.popAsync(type, title, body);
    // }

    clear(toastId?: string, toastContainerId?: number): void {
        this.toastService.clear(toastId, toastContainerId);
    }
}

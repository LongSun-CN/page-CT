import {InterceptedRequest, InterceptedResponse, Interceptor} from "ng2-interceptors";
import {OurpalmLoadingService} from "../../widgets/ourpalm-loading/ourpalm-loading.service";
import {Injectable} from "@angular/core";
import {Response, ResponseOptions, URLSearchParams} from "@angular/http";
import {TranslateService} from "@ngx-translate/core";
import {ToastService} from "./toast.service";
import {Observable} from "rxjs/Observable";

@Injectable()
export class ServerURLInterceptor implements Interceptor {
    translations: any;

    constructor(private toastService: ToastService, private  traslate: TranslateService) {
        this.traslate.get(['网络异常', '页面不存在', '页面异常', '未知错误']).subscribe((res: any) => {
            this.translations = res;
        })
    }

    public interceptBefore(request: InterceptedRequest): InterceptedRequest {
        return request;
    }

    public interceptAfter(response: InterceptedResponse): InterceptedResponse {
        let res;
        //其他错误处理
        switch (response.response.status) {
            case 200:
                res = response.response.json();
                break;
            case -1:
                this.toastService.pop('error', this.translations['网络异常']);
                break;
            case 0:
                this.toastService.pop('error', this.translations['网络异常']);
                break;
            case 404:
                this.toastService.pop('error', this.translations['页面不存在']);
                break;
            case 500:
                this.toastService.pop('error', this.translations['页面异常']);
                break;
            case 502:
                this.toastService.pop('error', 'Bad GateWay(502)');
                break;
            default:
                this.toastService.pop('error', '(' + res.status?res.status:'未知错误' + ')');
        }

        if (res && res.status !== '1' && res.reset == 'SSO_002') {//未登录
            window.location.href = res.data;
        } else if (res && res.status !== '1' && res.reset == 'SSO_001') {//没有权限
            this.toastService.pop('warning', '没有权限');
        } else if (res && res.status !== '1') {//接口异常
            this.toastService.pop('error', (res.data && res.data.desc) || this.translations['未知错误']);
        }

        return response;
    }

}
export const mask_key = '__mask__';
export const mask = {[mask_key]: true};
export const no_mask = {[mask_key]: false};

@Injectable()
export class ServerMaskInterceptor implements Interceptor {
    constructor(private loadingService: OurpalmLoadingService) {

    }

    public interceptBefore(request: InterceptedRequest): InterceptedRequest {
        if (request.options.params && request.options.params['paramsMap']) {
            const param: URLSearchParams = <URLSearchParams>request.options.params['paramsMap'];
            if (!param.has(mask_key) || param.get(mask_key)[0]) {
                this.loadingService.show();
                request.interceptorOptions[mask_key] = true;
            }
        } else if (request.options.body && !request.options.body.includes(mask_key + '=false')) {
            this.loadingService.show();
            request.interceptorOptions[mask_key] = true;
        }

        return request;
    }

    public interceptAfter(response: InterceptedResponse): InterceptedResponse {
        if (response.interceptorOptions[mask_key]) {
            this.loadingService.hide();
        }
        return response;
    }
}

export const store_key = '__store__';
const store_prefix = '__http_cached_@_';

export function clearCachedHttpData() {
    let will_removed = [];
    for (let key in localStorage) {
        if (key.startsWith(store_prefix)) {
            will_removed.push(key);
        }
    }

    for (let i = 0; i < will_removed.length; i++) {
        let key = will_removed[i];
        localStorage.removeItem(key);
    }
}

/**
 * 使http请求具备缓存能力，放在localStorage中
 */
@Injectable()
export class CachedHttpInterceptor implements Interceptor {

    private checkStoreFormRequest(request: InterceptedRequest) {
        if (request.options.params && request.options.params['paramsMap']) {
            const param: URLSearchParams = <URLSearchParams>request.options.params['paramsMap'];
            if (!param.has(store_key) || param.get(store_key)) {
                request.interceptorOptions[store_key] = param.get(store_key);
                return true;
            }
        } else if (request.options.body && request.options.body.includes(store_key + '=')) {
            let key = new RegExp(`${store_key}=([a-zA-Z0-9\-_]*)&{0,1}`).exec(request.options.body)[1];
            request.interceptorOptions[store_key] = key;
            return true;
        }
        return false;
    }

    public interceptBefore(request: InterceptedRequest): InterceptedRequest {
        if (this.checkStoreFormRequest(request)) {
            let key = request.interceptorOptions[store_key];
            let data = window.localStorage.getItem(`${store_prefix}${key}`);
            if (data) {
                let json = JSON.parse(data);
                if (json.status == '0') {
                    request.interceptorOptions['cancelled'] = true;
                    return <any>(Observable.throw('cancelled'));
                } else {
                    window.localStorage.removeItem(`${store_prefix}${key}`);
                }
            }
        }
        return request;
    }

    public interceptAfter(response: InterceptedResponse): InterceptedResponse {
        let key = response.interceptorOptions[store_key];
        if (key) {
            let cancelled = response.interceptorOptions['cancelled'];
            if (cancelled) {
                let data = window.localStorage.getItem(`${store_prefix}${key}`);
                let options = new ResponseOptions({
                    status: 200,
                    statusText: response.response.statusText,
                    headers: response.response.headers,
                    url: response.response.url,
                    body: data
                });
                let resp = new Response(options.merge(options));
                return {response: resp, interceptorOptions: response.interceptorOptions};
            } else {
                let data = response.response.json();
                if (data && data.status == '0') {
                    window.localStorage.setItem(`${store_prefix}${key}`, JSON.stringify(data));
                }
            }
        }

        return response;
    }
}

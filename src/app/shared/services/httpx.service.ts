import {Injectable} from "@angular/core";
import {Headers, Http, RequestOptions, Response, URLSearchParams} from "@angular/http";
import {Observable} from "rxjs";
import { InterceptorService } from 'ng2-interceptors';

@Injectable()
export class HttpService {

    withCredentials: boolean | null;

    private headers: {};

    constructor(private http: InterceptorService) {
    }

    setHeader(key, value): HttpService {
        this.headers[key] = value;
        return this;
    }

    setHeaders(headers: any): HttpService {
        this.headers = {...this.headers, ...headers};
        return this;
    }

    getHeaders(): Object {
        return {...this.headers};
    }

    get(url: string, params: any = {}, options?: RequestOptions): Observable<Response> {
        console.log('[HttpService GET]', arguments);
        if (!options) {
            options = new RequestOptions();
            options.withCredentials = this.withCredentials;
            options.headers = new Headers(this.headers);
        }

        let urlParams = options.params || new URLSearchParams();
        for (let key in params) {
            urlParams.set(key, (!params[key]&&params[key]!==false)?'':params[key]);
        }
        options.params = urlParams;

        return this.http.get(url, options);
    }

    post(url: string, params: any = {}, options?: RequestOptions): Observable<Response> {
        console.log('[HttpService POST]', arguments);
        if (!options) {
            options = new RequestOptions();
            options.withCredentials = this.withCredentials;
            options.headers = new Headers({
                ...this.headers,
                'Content-Type': 'application/x-www-form-urlencoded'
            });
        }
        let body: string = '';
        for (let key in params) {
            body += `${key}=${(!params[key]&&params[key]!==false)?'':params[key]}&`;
        }
        body = body.substr(0, body.length - 1);
        return this.http.post(url, body, options);
    }

    put(url: string, params: any = {}, options?: RequestOptions): Observable<Response> {
        console.log('[HttpService PUT]', arguments);
        if (!options) {
            options = new RequestOptions();
            options.withCredentials = this.withCredentials;
            options.headers = new Headers({
                ...this.headers,
                'Content-Type': 'application/x-www-form-urlencoded'
            });
        }
        let body: string = '';
        for (let key in params) {
            body += `${key}=${(!params[key]&&params[key]!==false)?'':params[key]}&`;
        }
        body = body.substr(0, body.length - 1);
        return this.http.put(url, body, options);
    }



    download(url: string, params: any = {}) {
        console.log('[HttpService Download]', arguments);
        let paramUrl: string = '';
        params = {...params,...this.headers};
        for (let key in params) {
          params[key]&&(paramUrl += `${key}=${encodeURIComponent((!params[key]&&params[key]!==false)?'':params[key])}&`);
        }
        url = url + '?' + paramUrl;
        console.info(url);
        window.open(url);
    }

}

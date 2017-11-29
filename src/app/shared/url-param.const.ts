import * as URI from "urijs";
import {environment} from "../../environments/environment";

let initURI = new URI(window.location.href);
let {product, language, i18n} = initURI.query(true) as any;

/*if (!product || !language || !i18n) {
    if (environment.production) {
        //正式环境 重定向到服务器重新获取参数
        window.location.href = environment.getUrl('platform/getDefaultParams.htm');
    } else {
        //测试环境 SSO不支持重定向
        product = product || '10000538' || '10000941';
        language = language || '01';
        i18n = i18n || 'zh_CN';
    }

    initURI.query({product, language, i18n});
    window.history.replaceState({}, null, initURI.toString());
}*/

export class UrlParam {
    get product(): string {
        return (new URI(window.location.href).query(true) as any).product;
    }

    get language(): string {
        return (new URI(window.location.href).query(true) as any).language;
    }

    get i18n(): string {
        return (new URI(window.location.href).query(true) as any).i18n;
    }
}

export const urlParam: UrlParam = new UrlParam();
